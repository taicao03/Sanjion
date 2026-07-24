import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, BookOpen, MessageSquare } from 'lucide-react';
import { TermDefinition, findTermDefinition } from '../../services/termDictionary';

interface SmartTermTooltipProps {
  termText: string;
  definition?: TermDefinition;
  children?: React.ReactNode;
}

export const SmartTermTooltip: React.FC<SmartTermTooltipProps> = ({
  termText,
  definition: customDef,
  children,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ top: number; left: number; placeBelow: boolean }>({
    top: 0,
    left: 0,
    placeBelow: false,
  });

  const triggerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<any>(null);

  // Dynamic fallback definition if exact keyword is not in static dictionary
  const fallbackDef: TermDefinition = {
    key: termText.toLowerCase(),
    aliases: [],
    title: termText.replace(/^\*\*|\*\*$/g, '').replace(/^`|`$/g, ''),
    category: 'Khái Niệm Frontend',
    simpleExplanation: `Khái niệm kỹ thuật "${termText.replace(/^\*\*|\*\*$/g, '').replace(/^`|`$/g, '')}" trong lập trình Frontend. Bấm nút bên dưới để nhờ AI Tutor giải thích chi tiết kèm ví dụ!`,
    analogyOrExample: '💡 Bấm "Hỏi AI Chi Tiết" để AI Tutor phân tích và đưa ra ví dụ code.',
    level: 'Junior',
  };

  const def = customDef || findTermDefinition(termText) || fallbackDef;

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const placeBelow = rect.top < 240; // If close to top of viewport/container, render below
      setCoords({
        left: rect.left + rect.width / 2,
        top: placeBelow ? rect.bottom + 8 : rect.top - 8,
        placeBelow,
      });
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updateCoords();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  const handleAskAIAboutTerm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHovered(false);

    const promptText = `Giải thích chi tiết hơn cho mình về khái niệm "${def.title}" (${def.category}) với ví dụ thực tế chuẩn Senior!`;

    window.dispatchEvent(
      new CustomEvent('sanjion-ask-ai', {
        detail: { prompt: promptText }
      })
    );
  };

  return (
    <span
      ref={triggerRef}
      className="relative inline"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Interactive Trigger Badge - Seamless inline rendering */}
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 my-0.5 mx-0.5 rounded bg-pink-50 border-b-2 border-pink-500 text-pink-700 font-bold hover:bg-pink-100 hover:text-purple-800 transition-all cursor-help select-none group align-baseline">
        <span>{children || termText}</span>
        <Sparkles className="w-3 h-3 text-pink-500 inline-block group-hover:rotate-12 group-hover:scale-110 transition-transform" />
      </span>

      {/* Floating Tooltip Portal (Appended directly to document.body to NEVER be clipped by overflow:hidden) */}
      {isHovered &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              left: `${coords.left}px`,
              top: `${coords.top}px`,
              transform: coords.placeBelow ? 'translateX(-50%)' : 'translate(-50%, -100%)',
            }}
            className="z-[9999] w-72 sm:w-80 p-4 bg-slate-900/95 backdrop-blur-2xl border border-pink-400/50 rounded-2xl shadow-2xl text-white text-xs space-y-2.5 animate-fadeIn pointer-events-auto font-sans"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Tooltip Arrow (Flipped based on placement) */}
            {coords.placeBelow ? (
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-[1px] border-8 border-transparent border-b-slate-900/95 pointer-events-none block" />
            ) : (
              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-8 border-transparent border-t-slate-900/95 pointer-events-none block" />
            )}

            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-2">
              <div className="flex items-center gap-1.5 font-extrabold text-pink-300 truncate">
                <BookOpen className="w-3.5 h-3.5 flex-shrink-0 text-pink-400" />
                <span className="truncate">{def.title}</span>
              </div>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                  def.level === 'Junior'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : def.level === 'Mid-level'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : def.level === 'Senior'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {def.level}
              </span>
            </div>

            {/* Simple Explanation */}
            <div className="space-y-1 text-slate-200 leading-relaxed font-normal">
              <p className="font-medium">{def.simpleExplanation}</p>
            </div>

            {/* Analogy / Example */}
            <div className="bg-slate-800/80 border border-slate-700 p-2 rounded-xl text-[11px] text-amber-200 leading-normal">
              {def.analogyOrExample}
            </div>

            {/* Footer Action: Ask AI */}
            <div className="pt-1 flex items-center justify-between border-t border-slate-800">
              <span className="text-[10px] text-slate-400">💡 Hover xem lý thuyết</span>
              <button
                onClick={handleAskAIAboutTerm}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-[10px] shadow-sm transition-all"
              >
                <MessageSquare className="w-3 h-3" /> Hỏi AI Chi Tiết
              </button>
            </div>
          </div>,
          document.body
        )}
    </span>
  );
};
