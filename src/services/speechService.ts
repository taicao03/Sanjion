// Web Speech API Voice Pronunciation Service (100% Free, Zero-latency, No API Quota)

export interface SpeakOptions {
  text: string;
  lang?: 'en-US' | 'vi-VN';
  rate?: number;
  pitch?: number;
  voiceName?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

// Inject no-referrer policy to allow direct loading of Google Translate TTS
if (typeof document !== 'undefined') {
  try {
    let meta = document.querySelector('meta[name="referrer"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'referrer');
      meta.setAttribute('content', 'no-referrer');
      document.head.appendChild(meta);
      console.log('🗣️ [speechService] Injected no-referrer meta tag successfully.');
    }
  } catch (e) {
    console.warn('🗣️ [speechService] Failed to inject referrer meta tag:', e);
  }
}

let activeAudio: HTMLAudioElement | null = null;
let audioQueue: string[] = [];
let audioQueueIndex = 0;
let onAudioStart: (() => void) | undefined = undefined;
let onAudioEnd: (() => void) | undefined = undefined;

const stopAudioPlayer = () => {
  if (activeAudio) {
    try {
      activeAudio.pause();
    } catch (e) {}
    activeAudio = null;
  }
  audioQueue = [];
  audioQueueIndex = 0;
};

const splitTextIntoChunks = (text: string, maxLen = 160): string[] => {
  const clean = text
    .replace(/[*`#_~>]/g, ' ')
    .replace(/```[\s\S]*?```/g, ' [Có đoạn mã minh họa bên dưới] ')
    .trim();
    
  const sentences = clean.split(/([.?!;:\n]+)/);
  const chunks: string[] = [];
  let current = '';
  
  for (let part of sentences) {
    if (!part) continue;
    if (current.length + part.length > maxLen) {
      if (current.trim()) chunks.push(current.trim());
      current = part;
    } else {
      current += part;
    }
  }
  
  if (current.trim()) {
    chunks.push(current.trim());
  }
  
  return chunks.filter(c => c.length > 0);
};

const fallbackToLocalSpeech = (text: string, rate: number) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const cleanChunk = text.replace(/[*`#_~>]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanChunk);
    utterance.lang = 'vi-VN';
    utterance.rate = rate;
    
    utterance.onstart = () => {
      // Mock activeAudio as playing
      activeAudio = { paused: false } as any;
    };

    utterance.onend = () => {
      activeAudio = null;
      audioQueueIndex++;
      playNextChunk(rate);
    };
    
    utterance.onerror = () => {
      activeAudio = null;
      audioQueueIndex++;
      playNextChunk(rate);
    };
    
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.toLowerCase().startsWith('vi') || v.name.toLowerCase().includes('vietnam'));
    if (viVoice) utterance.voice = viVoice;
    
    window.speechSynthesis.speak(utterance);
  } else {
    audioQueueIndex++;
    playNextChunk(rate);
  }
};

const playNextChunk = (rate: number) => {
  if (audioQueueIndex >= audioQueue.length) {
    if (onAudioEnd) onAudioEnd();
    return;
  }

  const text = audioQueue[audioQueueIndex];
  // Google Translate TTS URL (requires no referrer header to bypass 403)
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(text)}`;
  
  try {
    const audio = new Audio(url);
    activeAudio = audio;
    audio.playbackRate = rate;
    
    audio.onended = () => {
      audioQueueIndex++;
      playNextChunk(rate);
    };
    
    audio.onerror = (e) => {
      console.warn("Google TTS audio error, falling back to local speech synthesis:", e);
      fallbackToLocalSpeech(text, rate);
    };
    
    audio.play().catch(err => {
      console.warn("Google TTS play blocked, falling back to local speech synthesis:", err);
      fallbackToLocalSpeech(text, rate);
    });
  } catch (err) {
    console.warn("Google TTS audio initialization failed, falling back:", err);
    fallbackToLocalSpeech(text, rate);
  }
};

export const speechService = {
  isSupported(): boolean {
    return typeof window !== 'undefined';
  },

  stop(): void {
    stopAudioPlayer();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  pause(): void {
    if (activeAudio && typeof activeAudio.pause === 'function') {
      try {
        activeAudio.pause();
      } catch (e) {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  },

  resume(): void {
    if (activeAudio && typeof activeAudio.play === 'function') {
      activeAudio.play().catch(() => {});
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  },

  isSpeaking(): boolean {
    if (activeAudio && !activeAudio.paused) return true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.speaking;
    }
    return false;
  },

  getVietnameseVoices(): SpeechSynthesisVoice[] {
    return this.getAvailableVoices().filter(v => 
      v.lang.toLowerCase().startsWith('vi') || 
      v.name.toLowerCase().includes('vietnam') ||
      v.name.toLowerCase().includes('google dịch')
    );
  },

  getAvailableVoices(): SpeechSynthesisVoice[] {
    // Add Google Translate as first mock voice
    const list: any[] = [
      {
        name: "Google Dịch (Online Cloud TTS)",
        lang: "vi-VN",
        localService: false,
        voiceURI: "google-translate-vi-vn",
        default: true
      }
    ];

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return list;
    const voices = window.speechSynthesis.getVoices();
    
    // 1. Vietnamese voices
    const viVoices = voices.filter(v => 
      v.lang.toLowerCase().startsWith('vi') || 
      v.lang.toLowerCase().includes('vi-vn') ||
      v.name.toLowerCase().includes('vietnam') || 
      v.name.toLowerCase().includes('vietnamese') ||
      v.name.toLowerCase().includes('tiếng việt')
    );
    
    // 2. English voices
    const enVoices = voices.filter(v => 
      v.lang.toLowerCase().startsWith('en') && 
      !viVoices.includes(v)
    );
    
    // 3. Other voices
    const otherVoices = voices.filter(v => 
      !viVoices.includes(v) && 
      !enVoices.includes(v)
    );
    
    return [...list, ...viVoices, ...enVoices, ...otherVoices];
  },

  speak(textOrOptions: string | SpeakOptions, lang: 'en-US' | 'vi-VN' = 'vi-VN', rate: number = 0.95): void {
    if (!this.isSupported()) return;

    let text = '';
    let speechLang = lang;
    let speechRate = rate;
    let pitch = 1.0;
    let voiceName: string | undefined = undefined;
    let onStart: (() => void) | undefined = undefined;
    let onEnd: (() => void) | undefined = undefined;
    let onError: ((err: any) => void) | undefined = undefined;

    if (typeof textOrOptions === 'string') {
      text = textOrOptions;
    } else {
      text = textOrOptions.text;
      speechLang = textOrOptions.lang || 'vi-VN';
      speechRate = textOrOptions.rate ?? 0.95;
      pitch = textOrOptions.pitch ?? 1.0;
      voiceName = textOrOptions.voiceName;
      onStart = textOrOptions.onStart;
      onEnd = textOrOptions.onEnd;
      onError = textOrOptions.onError;
    }

    if (!text || text.trim().length === 0) return;

    this.stop(); // Stop any ongoing speech

    // Check if we should use the custom Google Translate Player
    if (voiceName === "Google Dịch (Online Cloud TTS)" || (!voiceName && speechLang === 'vi-VN')) {
      onAudioStart = onStart;
      onAudioEnd = onEnd;
      audioQueue = splitTextIntoChunks(text);
      audioQueueIndex = 0;
      
      if (audioQueue.length > 0) {
        if (onStart) onStart();
        playNextChunk(speechRate);
      } else {
        if (onEnd) onEnd();
      }
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const cleanText = text
      .replace(/[*`#_~>]/g, '')
      .replace(/```[\s\S]*?```/g, ' [Có đoạn mã minh họa bên dưới] ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = speechLang;
    utterance.rate = speechRate;
    utterance.pitch = pitch;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      let matchedVoice: SpeechSynthesisVoice | undefined;
      
      if (voiceName) {
        matchedVoice = voices.find(v => v.name === voiceName);
      }
      
      if (!matchedVoice && speechLang === 'vi-VN') {
        const viVoices = voices.filter(v => 
          v.lang.toLowerCase().startsWith('vi') || 
          v.lang.toLowerCase().includes('vi-vn') ||
          v.name.toLowerCase().includes('vietnam') ||
          v.name.toLowerCase().includes('vietnamese') ||
          v.name.toLowerCase().includes('tiếng việt')
        );

        const priorityKeywords = [
          'natural',
          'google',
          'linh',
          'hoaimy',
          'namminh',
          'an',
          'vietnamese',
          'vietnam'
        ];

        for (const kw of priorityKeywords) {
          matchedVoice = viVoices.find(v => v.name.toLowerCase().includes(kw));
          if (matchedVoice) break;
        }

        if (!matchedVoice && viVoices.length > 0) {
          matchedVoice = viVoices[0];
        }
      }

      if (!matchedVoice) {
        matchedVoice = voices.find(v => v.lang.includes(speechLang) || v.lang.startsWith(speechLang.split('-')[0]));
      }

      if (matchedVoice) {
        console.log('🗣️ [speechService] Selected Voice:', matchedVoice.name, matchedVoice.lang);
        utterance.voice = matchedVoice;
      }
    }

    if (onStart) utterance.onstart = () => onStart!();
    if (onEnd) utterance.onend = () => onEnd!();
    if (onError) utterance.onerror = (e) => onError!(e);

    window.speechSynthesis.speak(utterance);
  }
};
