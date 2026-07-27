import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, Languages, MessageSquare, Loader2, X } from 'lucide-react';
import { speechService } from '../../services/speechService';
import { translationService } from '../../services/translationService';

export const TextSelectionToolbar: React.FC = () => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationResult, setTranslationResult] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        // If selection cleared, hide after short delay if not inside toolbar
        return;
      }

      const text = selection.toString().trim();
      if (text.length >= 2) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            setSelectedText(text);
            setCoords({
              left: Math.max(160, Math.min(window.innerWidth - 160, rect.left + rect.width / 2)),
              top: Math.max(50, rect.top - 12),
            });
            setIsVisible(true);
            setTranslationResult(null);
          }
        } catch (e) {
          // ignore selection errors
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (toolbarRef.current && toolbarRef.current.contains(e.target as Node)) {
        return;
      }
      // Hide toolbar when clicking outside selection
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          setIsVisible(false);
          setTranslationResult(null);
        }
      }, 150);
    };

    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  if (!isVisible || !selectedText) return null;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speechService.speak(selectedText, 'en-US');
  };

  const handleTranslate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (translationResult) {
      setTranslationResult(null);
      return;
    }
    setIsTranslating(true);
    const res = await translationService.translateToVietnamese(selectedText);
    setTranslationResult(res);
    setIsTranslating(false);
  };

  const handleAskAI = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    const prompt = `Giải thích chi tiết đoạn văn/từ vựng được bôi đen sau đây trong đề bài: "${selectedText}"`;
    window.dispatchEvent(
      new CustomEvent('sanjion-ask-ai', {
        detail: { prompt }
      })
    );
  };

  return createPortal(
    <div
      ref={toolbarRef}
      style={{
        position: 'fixed',
        left: `${coords.left}px`,
        top: `${coords.top}px`,
        transform: 'translate(-50%, -100%)',
      }}
      className="z-[99999] bg-slate-900/95 backdrop-blur-2xl border border-pink-400/50 p-2 rounded-2xl shadow-2xl text-white text-xs space-y-2 animate-fadeIn max-w-sm w-max font-sans pointer-events-auto select-none"
    >
      <div className="flex items-center gap-1.5 font-bold">
        {/* Speak button */}
        <button
          onClick={handleSpeak}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 transition-all cursor-pointer"
          title="🔊 Nghe phát âm từ/câu được bôi đen"
        >
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Phát Âm</span>
        </button>

        {/* Translate button */}
        <button
          onClick={handleTranslate}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-300 transition-all cursor-pointer"
          title="🇻🇳 Dịch sang Tiếng Việt bằng AI"
        >
          {isTranslating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-400" />
          ) : (
            <Languages className="w-3.5 h-3.5 text-pink-400" />
          )}
          <span>Dịch Tiếng Việt</span>
        </button>

        {/* Ask AI button */}
        <button
          onClick={handleAskAI}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-sm transition-all cursor-pointer"
          title="🤖 Hỏi AI Tutor giải thích chi tiết"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Hỏi AI</span>
        </button>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inline Translation Results Box */}
      {translationResult && (
        <div className="p-2.5 bg-slate-950 border border-purple-500/40 rounded-xl text-[11px] text-purple-200 leading-relaxed max-h-40 overflow-y-auto font-sans">
          <div className="font-bold text-pink-400 text-[10px] mb-1 flex items-center gap-1">
            <Languages className="w-3 h-3" /> Bản dịch Tiếng Việt:
          </div>
          <p className="whitespace-pre-line">{translationResult}</p>
        </div>
      )}
    </div>,
    document.body
  );
};
