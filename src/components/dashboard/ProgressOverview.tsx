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
      {/* Top Banner Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <div className="bg-white/80 border border-amber-200 rounded-3xl p-5 backdrop-blur-md relative overflow-hidden group shadow-sm hover:shadow-amber-500/10 transition-all">
          <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6 fill-amber-500 animate-pulse" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chuỗi Ngày Sanjion</p>
          <h3 className="text-2xl font-black text-slate-800 mt-1">{streakCount} Ngày</h3>
          <p className="text-xs text-amber-600 mt-2 font-bold">🔥 Rèn luyện Sanjion đều đặn mỗi ngày!</p>
        </div>

        {/* Solved Card */}
        <div className="bg-white/80 border border-pink-200 rounded-3xl p-5 backdrop-blur-md relative overflow-hidden group shadow-sm hover:shadow-pink-500/10 transition-all">
          <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đã Hoàn Thành</p>
          <h3 className="text-2xl font-black text-slate-800 mt-1">
            {solvedCount} <span className="text-sm font-normal text-slate-400">/ {totalCount} câu</span>
          </h3>
          <p className="text-xs text-pink-600 mt-2 font-bold">🎯 Tiến độ Sanjion: {overallPercentage}%</p>
        </div>

        {/* Experience Points */}
        <div className="bg-white/80 border border-purple-200 rounded-3xl p-5 backdrop-blur-md relative overflow-hidden group shadow-sm hover:shadow-purple-500/10 transition-all">
          <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6 fill-purple-500" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Điểm Sanjion</p>
          <h3 className="text-2xl font-black text-slate-800 mt-1">{totalPoints} pts</h3>
          <p className="text-xs text-purple-600 mt-2 font-bold">⭐ Danh hiệu: Sanjion Pro Leader</p>
        </div>

        {/* Target Level */}
        <div className="bg-white/80 border border-rose-200 rounded-3xl p-5 backdrop-blur-md relative overflow-hidden group shadow-sm hover:shadow-rose-500/10 transition-all">
          <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mục Tiêu Sanjion</p>
          <h3 className="text-2xl font-black text-slate-800 mt-1">Senior Level</h3>
          <p className="text-xs text-rose-600 mt-2 font-bold">🚀 Sẵn sàng cho kỳ Sanjion Big Tech!</p>
        </div>
      </div>

      {/* Difficulty Breakdown Progress Bars */}
      <div className="bg-white/80 border border-pink-100 rounded-3xl p-6 backdrop-blur-md shadow-sm">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-pink-500" />
          Tiến Độ Sanjion Theo Cấp Độ
        </h3>

        <div className="space-y-4">
          {/* Easy */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-emerald-600">Dễ (Easy)</span>
              <span className="text-slate-600">{easy.solved} / {easy.total} ({easy.percentage}%)</span>
            </div>
            <div className="w-full h-3 bg-emerald-50 rounded-full overflow-hidden border border-emerald-200">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${easy.percentage}%` }}></div>
            </div>
          </div>

          {/* Medium */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-amber-600">Trung Bình (Medium)</span>
              <span className="text-slate-600">{medium.solved} / {medium.total} ({medium.percentage}%)</span>
            </div>
            <div className="w-full h-3 bg-amber-50 rounded-full overflow-hidden border border-amber-200">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${medium.percentage}%` }}></div>
            </div>
          </div>

          {/* Hard */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-pink-600">Khó (Hard)</span>
              <span className="text-slate-600">{hard.solved} / {hard.total} ({hard.percentage}%)</span>
            </div>
            <div className="w-full h-3 bg-pink-50 rounded-full overflow-hidden border border-pink-200">
              <div className="h-full bg-pink-500 rounded-full transition-all duration-500" style={{ width: `${hard.percentage}%` }}></div>
            </div>
          </div>

          {/* Expert */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-purple-600">Cực Khó (Expert)</span>
              <span className="text-slate-600">{expert.solved} / {expert.total} ({expert.percentage}%)</span>
            </div>
            <div className="w-full h-3 bg-purple-50 rounded-full overflow-hidden border border-purple-200">
              <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${expert.percentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
