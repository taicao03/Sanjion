import React from 'react';
import { Calendar as CalendarIcon, Flame } from 'lucide-react';

interface StreakHeatmapProps {
  activityHistory: Record<string, number>;
}

export const StreakHeatmap: React.FC<StreakHeatmapProps> = ({ activityHistory }) => {
  const days: { dateStr: string; dayNum: number; count: number }[] = [];
  const now = new Date();

  for (let i = 27; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      dateStr,
      dayNum: d.getDate(),
      count: activityHistory[dateStr] || 0,
    });
  }

  const totalSolvedIn28Days = Object.values(activityHistory).reduce((sum, val) => sum + val, 0);

  const getHeatColor = (count: number) => {
    if (count === 0) return 'bg-rose-50/40 border-pink-100/60 text-slate-400';
    if (count === 1) return 'bg-pink-200 border-pink-300 text-pink-900 font-bold';
    if (count === 2) return 'bg-pink-400 border-pink-500 text-white font-extrabold';
    return 'bg-amber-400 border-amber-500 text-slate-900 font-black shadow-md';
  };

  return (
    <div className="bg-white/80 border border-pink-100 rounded-3xl p-6 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-500" />
            Nhật Ký Sanjion 28 Ngày Gần Nhất
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Tổng cộng: **{totalSolvedIn28Days}** lượt giải bài tập.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <span>Ít</span>
          <span className="w-3 h-3 rounded-sm bg-rose-50 border border-pink-100"></span>
          <span className="w-3 h-3 rounded-sm bg-pink-200"></span>
          <span className="w-3 h-3 rounded-sm bg-pink-400"></span>
          <span className="w-3 h-3 rounded-sm bg-amber-400"></span>
          <span>Nhiều</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day.dateStr}
            className={`aspect-square rounded-2xl border flex flex-col items-center justify-center text-xs transition-all hover:scale-105 cursor-pointer ${getHeatColor(
              day.count
            )}`}
            title={`${day.dateStr}: Hoàn thành ${day.count} bài Sanjion`}
          >
            <span className="text-[10px] opacity-80">{day.dayNum}</span>
            {day.count > 0 && <Flame className="w-3 h-3 fill-amber-500 text-amber-500 mt-0.5" />}
          </div>
        ))}
      </div>
    </div>
  );
};
