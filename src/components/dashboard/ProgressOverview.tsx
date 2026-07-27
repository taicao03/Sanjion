import React from 'react';
import { Question, UserProgress } from '../../types';
import { CheckCircle2, Flame, Star, Trophy, TrendingUp } from 'lucide-react';

interface ProgressOverviewProps {
  questions: Question[];
  progressMap: Record<string, UserProgress>;
  streakCount: number;
  totalPoints: number;
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  questions,
  progressMap,
  streakCount,
  totalPoints,
}) => {
  const solvedCount = questions.filter(
    (q) => progressMap[q.id]?.status === 'SOLVED' || (q.slug && progressMap[q.slug]?.status === 'SOLVED')
  ).length;

  const totalCount = questions.length;
  const overallPercentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const countByDifficulty = (diff: string) => {
    const total = questions.filter((q) => q.difficulty === diff).length;
    const solved = questions.filter(
      (q) => q.difficulty === diff && (progressMap[q.id]?.status === 'SOLVED' || (q.slug && progressMap[q.slug]?.status === 'SOLVED'))
    ).length;
    return { solved, total, percentage: total > 0 ? Math.round((solved / total) * 100) : 0 };
  };

  const easy = countByDifficulty('EASY');
  const medium = countByDifficulty('MEDIUM');
  const hard = countByDifficulty('HARD');
  const expert = countByDifficulty('EXPERT');

  return (
    <div className="space-y-6">
      {/* 1. Editor Noir Hero Banner */}
      <div className="bg-[#161B22] border border-white/[0.06] rounded-lg p-6 font-mono">
        <div className="flex items-center gap-2 text-xs text-[#8B94A3] mb-2 border-b border-white/[0.04] pb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C1553B]/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9962C]/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#2FAE79]/80 inline-block" />
          <span className="ml-2 text-[#8B94A3]">~/fe-sanjion-pro/overview.sh</span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-[#8B94A3]">
            <span className="text-[#2FAE79]">sanjion@fe</span>:<span className="text-[#5B54D9]">~</span>$ status --senior-level
          </p>
          <h2 className="text-xl sm:text-2xl font-display font-medium text-[#EDEFF2] mt-1 flex items-center gap-2 tracking-tight">
            <span>ready for senior review</span>
            <span className="inline-block w-2.5 h-6 bg-[#C9962C] animate-cursor-blink" />
          </h2>
        </div>
      </div>

      {/* 2. Top Stats Minimal Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <div className="bg-[#161B22] border border-white/[0.06] rounded-lg p-4 relative group">
          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#C9962C]" />
          <p className="text-xs font-mono text-[#8B94A3] uppercase tracking-wider">Streak🔥</p>
          <h3 className="text-3xl font-mono font-bold text-[#EDEFF2] mt-1">{streakCount}<span className="text-sm text-[#8B94A3] font-normal">d</span></h3>
          <p className="text-[11px] font-mono text-[#C9962C] mt-2">Chuỗi rèn luyện liên tục</p>
        </div>

        {/* Solved Card */}
        <div className="bg-[#161B22] border border-white/[0.06] rounded-lg p-4 relative group">
          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#2FAE79]" />
          <p className="text-xs font-mono text-[#8B94A3] uppercase tracking-wider">Đã Giải</p>
          <h3 className="text-3xl font-mono font-bold text-[#EDEFF2] mt-1">
            {solvedCount}<span className="text-sm text-[#8B94A3] font-normal"> / {totalCount}</span>
          </h3>
          <p className="text-[11px] font-mono text-[#2FAE79] mt-2">Hoàn thành {overallPercentage}% bài tập</p>
        </div>

        {/* Experience Points */}
        <div className="bg-[#161B22] border border-white/[0.06] rounded-lg p-4 relative group">
          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#5B54D9]" />
          <p className="text-xs font-mono text-[#8B94A3] uppercase tracking-wider">Kinh Nghiệm</p>
          <h3 className="text-3xl font-mono font-bold text-[#EDEFF2] mt-1">+{totalPoints}<span className="text-sm text-[#8B94A3] font-normal"> XP</span></h3>
          <p className="text-[11px] font-mono text-[#5B54D9] mt-2">Cấp độ Sanjion Expert</p>
        </div>

        {/* Target Level */}
        <div className="bg-[#161B22] border border-white/[0.06] rounded-lg p-4 relative group">
          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#C1553B]" />
          <p className="text-xs font-mono text-[#8B94A3] uppercase tracking-wider">Mục Tiêu</p>
          <h3 className="text-2xl font-display font-medium text-[#EDEFF2] mt-1">Senior Level</h3>
          <p className="text-[11px] font-mono text-[#8B94A3] mt-2">Big Tech Ready</p>
        </div>
      </div>

      {/* 3. Signature Element: The Ledger Line (Git Diff Progress) */}
      <div className="bg-[#161B22] border border-white/[0.06] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
          <h3 className="text-sm font-mono font-bold text-[#EDEFF2] flex items-center gap-2">
            <span className="text-[#2FAE79]">+</span>
            <span className="text-[#C1553B]">-</span>
            <span>Tiến Độ Sanjion (The Ledger Line)</span>
          </h3>
          <span className="text-xs font-mono text-[#8B94A3]">git diff --stat</span>
        </div>

        <div className="space-y-3 font-mono">
          {/* Easy */}
          <div className="p-3 bg-[#0B0D11] border border-white/[0.04] rounded">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#2FAE79]">● Easy (Dễ)</span>
              <span className="text-[#8B94A3]">{easy.solved}/{easy.total} câu ({easy.percentage}%)</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-xs">
              <div className="flex-1 overflow-hidden whitespace-nowrap tracking-widest text-sm select-none">
                <span className="text-[#2FAE79]">{"+".repeat(Math.round((easy.solved / Math.max(easy.total, 1)) * 32))}</span>
                <span className="text-[#232A35]">{"-".repeat(32 - Math.round((easy.solved / Math.max(easy.total, 1)) * 32))}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] flex-shrink-0">
                <span className="text-[#2FAE79] font-bold">+{easy.solved} resolved</span>
                <span className="text-[#8B94A3]">-{easy.total - easy.solved} remaining</span>
              </div>
            </div>
          </div>

          {/* Medium */}
          <div className="p-3 bg-[#0B0D11] border border-white/[0.04] rounded">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#C9962C]">● Medium (Trung Bình)</span>
              <span className="text-[#8B94A3]">{medium.solved}/{medium.total} câu ({medium.percentage}%)</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-xs">
              <div className="flex-1 overflow-hidden whitespace-nowrap tracking-widest text-sm select-none">
                <span className="text-[#C9962C]">{"+".repeat(Math.round((medium.solved / Math.max(medium.total, 1)) * 32))}</span>
                <span className="text-[#232A35]">{"-".repeat(32 - Math.round((medium.solved / Math.max(medium.total, 1)) * 32))}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] flex-shrink-0">
                <span className="text-[#2FAE79] font-bold">+{medium.solved} resolved</span>
                <span className="text-[#8B94A3]">-{medium.total - medium.solved} remaining</span>
              </div>
            </div>
          </div>

          {/* Hard */}
          <div className="p-3 bg-[#0B0D11] border border-white/[0.04] rounded">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#C1553B]">● Hard (Khó)</span>
              <span className="text-[#8B94A3]">{hard.solved}/{hard.total} câu ({hard.percentage}%)</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-xs">
              <div className="flex-1 overflow-hidden whitespace-nowrap tracking-widest text-sm select-none">
                <span className="text-[#C1553B]">{"+".repeat(Math.round((hard.solved / Math.max(hard.total, 1)) * 32))}</span>
                <span className="text-[#232A35]">{"-".repeat(32 - Math.round((hard.solved / Math.max(hard.total, 1)) * 32))}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] flex-shrink-0">
                <span className="text-[#2FAE79] font-bold">+{hard.solved} resolved</span>
                <span className="text-[#8B94A3]">-{hard.total - hard.solved} remaining</span>
              </div>
            </div>
          </div>

          {/* Expert */}
          <div className="p-3 bg-[#0B0D11] border border-white/[0.04] rounded">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#5B54D9]">● Expert (Hệ Thống)</span>
              <span className="text-[#8B94A3]">{expert.solved}/{expert.total} câu ({expert.percentage}%)</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-xs">
              <div className="flex-1 overflow-hidden whitespace-nowrap tracking-widest text-sm select-none">
                <span className="text-[#5B54D9]">{"+".repeat(Math.round((expert.solved / Math.max(expert.total, 1)) * 32))}</span>
                <span className="text-[#232A35]">{"-".repeat(32 - Math.round((expert.solved / Math.max(expert.total, 1)) * 32))}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] flex-shrink-0">
                <span className="text-[#2FAE79] font-bold">+{expert.solved} resolved</span>
                <span className="text-[#8B94A3]">-{expert.total - expert.solved} remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
