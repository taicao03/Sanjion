import React from 'react';
import { Trophy, ArrowRight, Sparkles, X, BookOpen, RotateCcw } from 'lucide-react';
import { Question } from '../../types';
import { aiService } from '../../services/aiService';

interface SuccessNextQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedPoints: number;
  currentQuestion: Question;
  allQuestions: Question[];
  onNextQuestion: (nextQuestion: Question) => void;
  onGenerateNextWithAI: () => void;
  onBackToBank: () => void;
}

export const SuccessNextQuestionModal: React.FC<SuccessNextQuestionModalProps> = ({
  isOpen,
  onClose,
  earnedPoints,
  currentQuestion,
  allQuestions,
  onNextQuestion,
  onGenerateNextWithAI,
  onBackToBank,
}) => {
  if (!isOpen) return null;

  const activeModel = aiService.getActiveModelName();

  // Find another question with same difficulty & category that is not the current question
  const sameLevelQuestions = allQuestions.filter(
    (q) => q.id !== currentQuestion.id && q.difficulty === currentQuestion.difficulty
  );

  const hasExistingNext = sameLevelQuestions.length > 0;
  const nextQuestionCandidate = hasExistingNext
    ? sameLevelQuestions[Math.floor(Math.random() * sameLevelQuestions.length)]
    : null;

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn font-mono">
      <div className="bg-[#181F2A] border border-slate-700/60 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-center my-auto max-h-[90vh] overflow-y-auto animate-scaleUp text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#C9962C]/20 border border-[#C9962C]/50 flex items-center justify-center text-[#C9962C] mx-auto mb-4 animate-bounce">
          <Trophy className="w-7 h-7 text-[#C9962C]" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white tracking-tight">
          🎉 Xuất Sắc! Bạn Đã Trả Lời Đúng!
        </h3>

        <p className="text-xs text-[#2FAE79] font-bold mt-1">
          + {earnedPoints} Điểm Sanjion Đã Được Cộng Vào Hồ Sơ!
        </p>

        <p className="text-xs text-slate-200 font-medium mt-3 leading-relaxed">
          Bạn vừa hoàn thành câu hỏi cấp độ <span className="font-bold text-[#C9962C]">{currentQuestion.difficulty}</span>. Bạn có muốn AI Model <span className="font-bold text-[#5B54D9]">{activeModel}</span> sinh 1 câu hỏi mới 100% ở trình độ này không?
        </p>

        {/* Actions */}
        <div className="space-y-2.5 mt-6">
          {/* PRIMARY BUTTON: ALWAYS AI GENERATE BRAND NEW QUESTION */}
          <button
            onClick={() => {
              onGenerateNextWithAI();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-lg bg-[#C9962C] hover:bg-[#C9962C]/90 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
            <span>✨ AI [{activeModel}] Sinh Bài Mới 100% ({currentQuestion.difficulty})</span>
          </button>

          {/* SECONDARY BUTTON: BANK CANDIDATE OR RETURN */}
          <div className="grid grid-cols-2 gap-2">
            {hasExistingNext && nextQuestionCandidate ? (
              <button
                onClick={() => {
                  onNextQuestion(nextQuestionCandidate);
                  onClose();
                }}
                className="py-2.5 px-3 rounded-lg bg-[#0F141C] border border-slate-700/60 hover:bg-slate-800 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 truncate"
                title="Làm 1 câu sẵn có trong ngân hàng Sanjion"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span className="truncate">Câu Khác Trong Bank</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onBackToBank();
                  onClose();
                }}
                className="py-2.5 px-3 rounded-lg bg-[#0F141C] border border-slate-700/60 hover:bg-slate-800 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 truncate"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="truncate">Về Ngân Hàng</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
              }}
              className="py-2.5 px-3 rounded-lg bg-[#0F141C] border border-slate-700/60 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 truncate"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="truncate">Ở Lại Xem Mã</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
