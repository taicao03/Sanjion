import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import { X, Clock, Play, Award, Zap, Heart } from 'lucide-react';

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onStartQuestion: (question: Question) => void;
}

export const MockInterviewModal: React.FC<MockInterviewModalProps> = ({
  isOpen,
  onClose,
  questions,
  onStartQuestion,
}) => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [mockQuestions, setMockQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (isOpen) {
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      setMockQuestions(shuffled.slice(0, 5));
    }
  }, [isOpen, questions]);

  useEffect(() => {
    let timer: any;
    if (sessionStarted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [sessionStarted, timeLeft]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/70 backdrop-blur-md flex min-h-full items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white border border-pink-200/90 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto animate-scaleUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-pink-600 rounded-xl hover:bg-pink-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!sessionStarted ? (
          /* Start Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-500 mx-auto shadow-sm">
              <Zap className="w-8 h-8 fill-amber-500 animate-pulse" />
            </div>

            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Chế Độ Giả Lập Sanjion (Mock Sanjion)</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
              Thử thách bản thân dưới áp lực thời gian thực! Bạn sẽ có **45 phút** để hoàn thành bộ **5 câu hỏi Sanjion ngẫu nhiên** bao gồm cả Lý thuyết, Trắc nghiệm và Thực hành Coding.
            </p>

            <div className="bg-rose-50/60 p-4 rounded-2xl border border-pink-100 text-left space-y-2 text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Thời lượng Sanjion: **45 phút**</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Cấu trúc đề Sanjion: 2 câu Lý thuyết + 2 câu Trắc nghiệm + 1 câu Coding</span>
              </div>
            </div>

            <button
              onClick={() => setSessionStarted(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-slate-900 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-900" />
              Bắt Đầu Kỳ Sanjion Ngay
            </button>
          </div>
        ) : (
          /* Active Session Screen */
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <span className="text-xs font-black text-pink-600 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                Phiên Sanjion Đang Diễn Ra
              </span>
              <div className="flex items-center gap-2 bg-amber-100 px-3 py-1 rounded-xl border border-amber-200 text-amber-800 font-mono font-black text-sm">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium">Chọn câu hỏi bên dưới để vào màn hình làm bài Sanjion:</p>

            <div className="space-y-2.5 max-h-64 overflow-y-auto">
              {mockQuestions.map((q, index) => (
                <div
                  key={q.id}
                  onClick={() => {
                    onClose();
                    onStartQuestion(q);
                  }}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/50 border border-pink-100 hover:border-pink-300 hover:bg-white transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-xl bg-pink-100 text-pink-700 text-xs font-black flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-1">
                      {q.title}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                    {q.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
