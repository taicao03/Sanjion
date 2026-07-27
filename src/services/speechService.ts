// Web Speech API Voice Pronunciation Service (100% Free, Zero-latency, No API Quota)

export const speechService = {
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
  },

  speak(text: string, lang: 'en-US' | 'vi-VN' = 'en-US', rate: number = 0.9): void {
    if (!this.isSupported() || !text || text.trim().length === 0) return;

    this.stop(); // Stop any ongoing speech

    const cleanText = text.replace(/[*`#_]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = rate; // Slightly slower speed for clear pronunciation

    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const matchedVoice = voices.find(v => v.lang.includes(lang) || v.lang.startsWith(lang.split('-')[0]));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  }
};
