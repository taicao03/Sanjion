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
    if (count === 0) return 'bg-[#232A35]/60 border-white/[0.04] text-[#8B94A3]';
    if (count === 1) return 'bg-[#2FAE79]/30 border-[#2FAE79]/40 text-[#2FAE79] font-bold';
    if (count === 2) return 'bg-[#2FAE79]/60 border-[#2FAE79]/80 text-[#EDEFF2] font-bold';
    return 'bg-[#2FAE79] border-[#2FAE79] text-[#0B0D11] font-bold';
  };

  return (
    <div className="bg-[#161B22] border border-white/[0.06] rounded-lg p-5 font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#EDEFF2] flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#C9962C]" />
            Nhật Ký Sanjion 28 Ngày Gần Nhất (GitHub Heatmap)
          </h3>
          <p className="text-xs text-[#8B94A3] mt-0.5">
            Tổng cộng: <b className="text-[#2FAE79]">{totalSolvedIn28Days}</b> lượt giải bài tập.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#8B94A3]">
          <span>Ít</span>
          <span className="w-3 h-3 rounded-sm bg-[#232A35] border border-white/[0.06]"></span>
          <span className="w-3 h-3 rounded-sm bg-[#2FAE79]/30"></span>
          <span className="w-3 h-3 rounded-sm bg-[#2FAE79]/60"></span>
          <span className="w-3 h-3 rounded-sm bg-[#2FAE79]"></span>
          <span>Nhiều</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day.dateStr}
            className={`aspect-square rounded border flex flex-col items-center justify-center text-xs transition-colors hover:border-white/30 cursor-pointer ${getHeatColor(
              day.count
            )}`}
            title={`${day.dateStr}: Hoàn thành ${day.count} bài Sanjion`}
          >
            <span className="text-[10px] opacity-80">{day.dayNum}</span>
            {day.count > 0 && <Flame className="w-3 h-3 text-[#C9962C] mt-0.5" />}
          </div>
        ))}
      </div>
    </div>
  );
};
