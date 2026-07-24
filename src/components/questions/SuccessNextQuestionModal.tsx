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

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/70 backdrop-blur-md flex min-h-full items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white border border-pink-200/90 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-center my-auto max-h-[90vh] overflow-y-auto animate-scaleUp">
        {/* Glow Top Accent */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-tr from-pink-400 to-amber-300 rounded-full opacity-30 blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-pink-600 rounded-xl hover:bg-pink-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/30 mb-4 animate-bounce">
          <Trophy className="w-8 h-8 fill-amber-200 stroke-amber-100" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
          🎉 Xuất Sắc! Bạn Đã Trả Lời Đúng!
        </h3>

        <p className="text-xs text-pink-600 font-extrabold mt-1">
          + {earnedPoints} Điểm Sanjion Đã Được Cộng Vào Hồ Sơ!
        </p>

        <p className="text-xs text-slate-500 font-medium mt-3 leading-relaxed">
          Bạn vừa hoàn thành câu hỏi cấp độ <span className="font-extrabold text-purple-600">{currentQuestion.difficulty}</span>. Bạn có muốn AI Model <span className="font-bold text-purple-600">{activeModel}</span> sinh 1 câu hỏi mới 100% ở trình độ này không?
        </p>

        {/* Actions */}
        <div className="space-y-2.5 mt-6">
          {/* PRIMARY BUTTON: ALWAYS AI GENERATE BRAND NEW QUESTION */}
          <button
            onClick={() => {
              onGenerateNextWithAI();
              onClose();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
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
                className="py-2.5 px-3 rounded-2xl bg-rose-50 border border-pink-200 hover:bg-pink-100 text-pink-700 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 truncate"
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
                className="py-2.5 px-3 rounded-2xl bg-rose-50 border border-pink-200 hover:bg-pink-100 text-pink-700 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 truncate"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="truncate">Về Ngân Hàng</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Xem Lại Bài</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
