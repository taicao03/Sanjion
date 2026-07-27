import React from 'react';
import { Question, UserProgress } from '../../types';
import { Bookmark, CheckCircle2, Circle, Clock, Star, Code2, HelpCircle, FileText } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  progress?: UserProgress | null;
  isBookmarked: boolean;
  onSelect: (question: Question) => void;
  onToggleBookmark: (e: React.MouseEvent, questionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  progress,
  isBookmarked,
  onSelect,
  onToggleBookmark,
}) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#2FAE79]/10 text-[#2FAE79] border border-[#2FAE79]/30">Easy</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#C9962C]/10 text-[#C9962C] border border-[#C9962C]/30">Medium</span>;
      case 'HARD':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#C1553B]/10 text-[#C1553B] border border-[#C1553B]/30">Hard</span>;
      case 'EXPERT':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#5B54D9]/10 text-[#5B54D9] border border-[#5B54D9]/30">Expert</span>;
      default:
        return null;
    }
  };

  const getHoverBorderClass = (diff: string) => {
    switch (diff) {
      case 'EASY': return 'hover:border-[#2FAE79]/60';
      case 'MEDIUM': return 'hover:border-[#C9962C]/60';
      case 'HARD': return 'hover:border-[#C1553B]/60';
      case 'EXPERT': return 'hover:border-[#5B54D9]/60';
      default: return 'hover:border-white/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CODING_PRACTICE':
        return <span title="Thực hành Coding"><Code2 className="w-3.5 h-3.5 text-[#2FAE79]" /></span>;
      case 'MULTIPLE_CHOICE':
        return <span title="Trắc nghiệm"><HelpCircle className="w-3.5 h-3.5 text-[#5B54D9]" /></span>;
      case 'THEORY':
        return <span title="Lý thuyết"><FileText className="w-3.5 h-3.5 text-[#C9962C]" /></span>;
      default:
        return null;
    }
  };

  const isSolved = progress?.status === 'SOLVED';

  return (
    <div
      onClick={() => onSelect(question)}
      className={`group relative bg-[#181F2A] border border-slate-700/60 ${getHoverBorderClass(question.difficulty)} rounded-lg p-4 transition-all duration-150 cursor-pointer flex flex-col justify-between font-mono shadow-md hover:shadow-lg`}
    >
      <div>
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {isSolved ? (
              <CheckCircle2 className="w-4 h-4 text-[#2FAE79] flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
            )}
            {getDifficultyBadge(question.difficulty)}
            <div className="flex items-center gap-1 text-[11px] text-slate-200 bg-[#0F141C] px-2 py-0.5 rounded border border-slate-700/50 font-bold">
              {getTypeIcon(question.type)}
              <span className="capitalize">{question.type.toLowerCase().replace('_', ' ')}</span>
            </div>
          </div>

          <button
            onClick={(e) => onToggleBookmark(e, question.id)}
            className={`p-1 rounded transition-colors ${
              isBookmarked
                ? 'text-[#C9962C] bg-[#C9962C]/20 border border-[#C9962C]/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/40'
            }`}
            title={isBookmarked ? 'Bỏ lưu câu hỏi' : 'Lưu câu hỏi'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#C9962C]' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm font-sans font-bold text-white group-hover:text-[#C9962C] transition-colors line-clamp-2 mb-2 leading-snug">
          {question.title}
        </h3>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {question.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-[#0F141C] text-slate-200 border border-slate-700/50 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-300 font-bold">
        <div className="flex items-center gap-1 text-[#C9962C] font-bold">
          <Star className="w-3.5 h-3.5 text-[#C9962C]" />
          <span>+{question.points} XP</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-300">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{question.viewCount} views</span>
        </div>
      </div>
    </div>
  );
};
