import React, { useState } from 'react';
import { X, User, Check, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';
import { storageService } from '../../services/storageService';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}) => {
  const [fullName, setFullName] = useState(profile.fullName);
  const [username, setUsername] = useState(profile.username);
  const [targetLevel, setTargetLevel] = useState(profile.targetLevel);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const updated = storageService.updateProfile({
      fullName,
      username,
      targetLevel: targetLevel as any,
    });

    // Update to Supabase if connected
    if (isSupabaseConfigured && supabase && profile.id !== 'guest') {
      try {
        await supabase.from('profiles').upsert({
          id: profile.id,
          full_name: fullName,
          username: username,
          target_level: targetLevel,
        });
      } catch (err) {
        console.warn('Failed to update Supabase profile:', err);
      }
    }

    setIsSaved(true);
    onProfileUpdated(updated);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white border border-pink-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-pink-600 rounded-xl hover:bg-pink-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pb-2">
          <div className="w-14 h-14 rounded-3xl bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-600 mx-auto shadow-sm mb-3">
            <User className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Đổi Tên Hiển Thị Của Bạn</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Cập nhật Họ & Tên thật để hiển thị trong lời chào và bảng xếp hạng Sanjion.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 my-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Họ và Tên của bạn:</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
              <input
                type="text"
                required
                placeholder="Nhập tên thật của bạn..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-rose-50/40 border border-pink-200 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Username Sanjion:</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-rose-50/40 border border-pink-200 rounded-2xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-pink-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mục Tiêu Trình Độ Sanjion:</label>
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value as any)}
              className="w-full bg-rose-50/40 border border-pink-200 rounded-2xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-pink-500"
            >
              <option value="Junior">Junior Level</option>
              <option value="Mid-level">Mid-level Engineer</option>
              <option value="Senior">Senior Principal Engineer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-xs shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
            {isSaved ? 'Đã Lưu Tên Mới Thành Công!' : 'Lưu Họ Tên Của Tôi'}
          </button>
        </form>
      </div>
    </div>
  );
};
