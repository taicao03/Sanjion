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
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Dễ</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">Trung Bình</span>;
      case 'HARD':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">Khó</span>;
      case 'EXPERT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">Cực Khó</span>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CODING_PRACTICE':
        return <span title="Thực hành Coding"><Code2 className="w-4 h-4 text-pink-500" /></span>;
      case 'MULTIPLE_CHOICE':
        return <span title="Trắc nghiệm Sanjion"><HelpCircle className="w-4 h-4 text-purple-500" /></span>;
      case 'THEORY':
        return <span title="Lý thuyết Sanjion"><FileText className="w-4 h-4 text-amber-500" /></span>;
      default:
        return null;
    }
  };

  const isSolved = progress?.status === 'SOLVED';

  return (
    <div
      onClick={() => onSelect(question)}
      className="group relative bg-white/90 hover:bg-white border border-pink-100 hover:border-pink-300 rounded-2xl p-5 transition-all duration-200 cursor-pointer shadow-md hover:shadow-pink-500/10 flex flex-col justify-between"
    >
      <div>
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {isSolved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
            )}
            {getDifficultyBadge(question.difficulty)}
            <div className="flex items-center gap-1 text-xs text-slate-500 bg-rose-50 px-2 py-0.5 rounded-lg border border-pink-100 font-medium">
              {getTypeIcon(question.type)}
              <span className="capitalize">{question.type.toLowerCase().replace('_', ' ')}</span>
            </div>
          </div>

          <button
            onClick={(e) => onToggleBookmark(e, question.id)}
            className={`p-1.5 rounded-xl transition-colors ${
              isBookmarked
                ? 'text-pink-600 bg-pink-100 hover:bg-pink-200'
                : 'text-slate-400 hover:text-pink-600 hover:bg-pink-50'
            }`}
            title={isBookmarked ? 'Bỏ lưu câu hỏi Sanjion' : 'Lưu câu hỏi Sanjion'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-pink-500' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-2 mb-2">
          {question.title}
        </h3>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {question.tags.map((tag) => (
              <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="pt-3 border-t border-pink-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-amber-600 font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>+{question.points} pts</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{question.viewCount} lượt xem</span>
        </div>
      </div>
    </div>
  );
};
