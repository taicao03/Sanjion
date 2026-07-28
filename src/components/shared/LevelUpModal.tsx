import React from 'react';
import {
  Sparkles,
  Trophy,
  Award,
  Crown,
  Flame,
  X,
  Check,
  ArrowRight,
  Share2,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface LevelTier {
  name: string;
  minPoints: number;
  badge: string;
  color: string;
  perks: string[];
}

export const LEVEL_TIERS: LevelTier[] = [
  {
    name: 'Fresher Frontend Dev',
    minPoints: 0,
    badge: '🌱',
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    perks: ['Truy cập Ngân hàng câu hỏi cơ bản', 'Trợ lý Sanjion AI Tutor 24/7']
  },
  {
    name: 'Junior Frontend Developer',
    minPoints: 50,
    badge: '⚡',
    color: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
    perks: ['Thực hành Closure & Async JS', 'AI Review chuyên sâu & Gợi ý Hint']
  },
  {
    name: 'Mid-Level Frontend Engineer',
    minPoints: 150,
    badge: '🚀',
    color: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    perks: ['Thách thức React Hooks & Performance', 'Phỏng vấn 1-1 Drill-Down (/grill-me)']
  },
  {
    name: 'Senior Frontend Architect',
    minPoints: 300,
    badge: '👑',
    color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    perks: ['Tối ưu Web Performance & Virtualization', 'Sinh bài tập AI tùy chỉnh nâng cao']
  },
  {
    name: 'Principal Big-Tech Lead',
    minPoints: 500,
    badge: '🔥',
    color: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    perks: ['Chinh phục các bài tập System Design', 'Danh hiệu Principal Engineer trên Hồ Sơ']
  }
];

export function getSavedLevelTiers(): LevelTier[] {
  try {
    const saved = localStorage.getItem('fe_sanjion_level_tiers');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return LEVEL_TIERS;
}

export function saveLevelTiers(tiers: LevelTier[]): void {
  localStorage.setItem('fe_sanjion_level_tiers', JSON.stringify(tiers));
}

export function getUserLevel(points: number = 0): LevelTier {
  const tiers = getSavedLevelTiers();
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (points >= tiers[i].minPoints) {
      return tiers[i];
    }
  }
  return tiers[0];
}

interface LevelUpModalProps {
  userName: string;
  oldLevel?: LevelTier;
  newLevel: LevelTier;
  currentPoints: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  userName,
  oldLevel,
  newLevel,
  currentPoints,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Fire confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore if confetti fails
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleShare = () => {
    const text = `🎉 Tôi vừa đột phá lên trình độ [${newLevel.name}] trên Sanjion Frontend Pro với ${currentPoints} XP! 🚀`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn font-mono">
      <div className="bg-[#181F2A] border border-amber-500/60 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-center my-auto max-h-[90vh] overflow-y-auto animate-scaleUp text-white">
        
        {/* Glow Ambient Light */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-tr from-amber-500/30 to-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Badge Icon */}
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-purple-600 to-pink-500 p-0.5 mx-auto mb-4 shadow-xl shadow-amber-500/20 animate-bounce">
          <div className="w-full h-full bg-[#0F141C] rounded-[22px] flex items-center justify-center text-4xl">
            {newLevel.badge}
          </div>
        </div>

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>ĐỘT PHÁ TRÌNH ĐỘ MỚI</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
          🎉 Chúc mừng <span className="text-amber-400">{userName || 'Sanjioner'}</span>!
        </h3>

        <p className="text-sm text-slate-200 font-bold mt-2">
          Bạn vừa chính thức cán mốc <span className="text-amber-300 font-black">{currentPoints} XP</span> và thăng cấp trình độ:
        </p>

        {/* Level Banner Card */}
        <div className="my-5 p-4 rounded-2xl bg-[#0F141C] border border-amber-500/50 shadow-inner space-y-2">
          {oldLevel && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <span className="line-through">{oldLevel.name}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </div>
          )}
          <div className={`text-lg sm:text-xl font-black ${newLevel.color.split(' ')[0]} uppercase tracking-wide flex items-center justify-center gap-2`}>
            <span>{newLevel.badge}</span>
            <span>{newLevel.name}</span>
          </div>
        </div>

        {/* Unlocked Perks */}
        <div className="text-left bg-[#0F141C] p-4 rounded-2xl border border-slate-700/60 space-y-2 mb-6">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Đặc quyền vừa mở khóa:
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-200">
            {newLevel.perks.map((perk, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#2FAE79] flex-shrink-0" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.01]"
          >
            <span>🚀 Tiếp Tục Chinh Phục Bài Tập Mới</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0F141C] border border-slate-700/60 hover:bg-slate-800 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#2FAE79]" />
                <span className="text-[#2FAE79]">Đã Copy Thành Tích!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Chia Sẻ Thành Tích Khoe Bạn Bè</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
