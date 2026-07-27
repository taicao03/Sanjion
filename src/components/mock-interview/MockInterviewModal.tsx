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

  const getTimeColorClass = (seconds: number) => {
    if (seconds <= 60) return 'text-[#C1553B] border-[#C1553B]/50 bg-[#C1553B]/10 animate-pulse';
    if (seconds <= 300) return 'text-[#C9962C] border-[#C9962C]/50 bg-[#C9962C]/10';
    return 'text-[#EDEFF2] border-white/[0.06] bg-[#0B0D11]';
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#0B0D11]/90 flex min-h-full items-center justify-center p-4 sm:p-6 animate-fadeIn font-mono">
      <div className="bg-[#161B22] border border-white/[0.06] rounded-lg max-w-xl w-full p-6 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-[#8B94A3] hover:text-[#EDEFF2] rounded hover:bg-white/[0.04] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!sessionStarted ? (
          /* Start Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded bg-[#0B0D11] border border-white/[0.06] flex items-center justify-center text-[#C9962C] mx-auto">
              <Zap className="w-7 h-7 text-[#C9962C]" />
            </div>

            <h3 className="text-xl font-display font-medium text-[#EDEFF2] tracking-tight">Chế Độ Thi Thử Sanjion 45'</h3>
            <p className="text-xs text-[#8B94A3] max-w-md mx-auto leading-relaxed">
              Thử thách bản thân dưới áp lực thời gian thực trong <b>45 phút</b> với bộ <b>5 câu hỏi Sanjion ngẫu nhiên</b>.
            </p>

            <div className="bg-[#0B0D11] p-4 rounded border border-white/[0.04] text-left space-y-2 text-xs text-[#EDEFF2]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C9962C]" />
                <span>Thời lượng: <b>45 phút</b></span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#5B54D9]" />
                <span>Cấu trúc: 2 Lý thuyết + 2 Trắc nghiệm + 1 Coding</span>
              </div>
            </div>

            <button
              onClick={() => setSessionStarted(true)}
              className="w-full py-3 rounded border border-[#C9962C] text-[#C9962C] bg-[#C9962C]/10 hover:bg-[#C9962C]/20 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-[#C9962C]" />
              Bắt Đầu Kỳ Thi Thử Ngay
            </button>
          </div>
        ) : (
          /* Active Session Screen */
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-xs font-bold text-[#C9962C] uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#C9962C]" />
                Mock Interview In Progress
              </span>
              <div className={`flex items-center gap-2 px-3 py-1 rounded border font-mono font-bold text-sm ${getTimeColorClass(timeLeft)}`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            <p className="text-xs text-[#8B94A3]">Chọn câu hỏi bên dưới để vào làm bài:</p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mockQuestions.map((q, index) => (
                <div
                  key={q.id}
                  onClick={() => {
                    onClose();
                    onStartQuestion(q);
                  }}
                  className="flex items-center justify-between p-3 rounded bg-[#0B0D11] border border-white/[0.04] hover:border-white/20 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-[#161B22] text-[#C9962C] text-xs font-bold flex items-center justify-center border border-white/[0.04]">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-sans font-bold text-[#EDEFF2] group-hover:text-[#C9962C] transition-colors line-clamp-1">
                      {q.title}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#161B22] text-[#8B94A3] border border-white/[0.04]">
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
