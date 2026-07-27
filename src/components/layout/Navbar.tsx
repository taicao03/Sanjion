import React, { useState } from "react";
import {
  Flame,
  Star,
  BookOpen,
  LayoutDashboard,
  Bookmark,
  Zap,
  Sparkles,
  Database,
  LogIn,
  LogOut,
  Edit3,
  ChevronDown,
  Trophy,
  Crown,
  ShieldCheck,
  Key,
} from "lucide-react";
import { UserProfile } from "../../types";
import { apiService } from "../../services/apiService";
import { EditProfileModal } from "../profile/EditProfileModal";
import { ApiKeyModal } from "../shared/ApiKeyModal";

interface NavbarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  profile: UserProfile;
  onOpenMockInterview: () => void;
  onOpenAuthModal: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  profile,
  onOpenMockInterview,
  onOpenAuthModal,
  isLoggedIn,
  onLogout,
  onProfileUpdated,
}) => {
  const isConnected = apiService.isBackendConnected();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [keyUpdateCount, setKeyUpdateCount] = useState(0);

  const hasCustomKey = Boolean(
    localStorage.getItem('fe_gemini_api_key') || localStorage.getItem('fe_openai_api_key')
  );

  const isAdminOrOwner = profile.role === 'OWNER' || profile.role === 'ADMIN';

  return (
    <>
      {/* Top Header Bar - Ultra Clean Responsive Glass Style */}
      <header className="sticky top-0 z-40 w-full border-b border-pink-200/50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* 1. Left Logo Branding - ALWAYS VISIBLE ON MOBILE, IPAD & DESKTOP */}
          <div
            onClick={() => onSelectView("roadmap")}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5 fill-amber-300 text-amber-300 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-500 bg-clip-text text-transparent tracking-tight">
                  Sanjion
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs">
                  PRO
                </span>
              </div>
            </div>
          </div>

          {/* 2. Center Navigation Tabs (ONLY VISIBLE ON DESKTOP XL, HIDDEN ON IPAD & MOBILE) */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 backdrop-blur-md">
            <button
              onClick={() => onSelectView("roadmap")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                currentView === "roadmap"
                  ? "bg-white text-pink-600 shadow-md shadow-pink-500/10 border border-pink-100"
                  : "text-slate-600 hover:text-pink-600 hover:bg-white/50"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              Lộ Trình A-Z
            </button>

            <button
              onClick={() => onSelectView("dashboard")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                currentView === "dashboard"
                  ? "bg-white text-pink-600 shadow-md shadow-pink-500/10 border border-pink-100"
                  : "text-slate-600 hover:text-pink-600 hover:bg-white/50"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>

            <button
              onClick={() => onSelectView("questions")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                currentView === "questions"
                  ? "bg-white text-pink-600 shadow-md shadow-pink-500/10 border border-pink-100"
                  : "text-slate-600 hover:text-pink-600 hover:bg-white/50"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Ngân Hàng Bài Tập
            </button>

            <button
              onClick={() => onSelectView("bookmarks")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                currentView === "bookmarks"
                  ? "bg-white text-pink-600 shadow-md shadow-pink-500/10 border border-pink-100"
                  : "text-slate-600 hover:text-pink-600 hover:bg-white/50"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Đã Lưu
            </button>

            {/* Admin Management Tab - Visible only to OWNER or ADMIN */}
            {isAdminOrOwner && (
              <button
                onClick={() => onSelectView("admin")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  currentView === "admin"
                    ? "bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "text-amber-700 hover:text-purple-700 hover:bg-white/60"
                }`}
              >
                <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                Quản Trị Admin
              </button>
            )}
          </nav>

          {/* 3. Right Actions Area */}
          <div className="flex items-center gap-2.5">
            {!isLoggedIn && (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md shadow-purple-500/20 transition-all cursor-pointer animate-pulse"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
            )}

            {/* Quick Mock Interview Button */}
            <button
              onClick={onOpenMockInterview}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-slate-950" />
              Thi Thử 45'
            </button>

            {/* Combined Compact User Stats Badge (Streak + Points) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs font-extrabold text-slate-700 shadow-xs">
              <span className="flex items-center gap-1 text-amber-600" title="Streak ngày học">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                {isLoggedIn ? profile.streakCount : 0}d
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1 text-pink-600" title="Điểm kinh nghiệm">
                <Star className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                {isLoggedIn ? profile.totalPoints : 0}
              </span>
            </div>

            {/* User Profile Avatar & Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 hover:bg-pink-50 border border-slate-200/80 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full ring-2 ring-pink-400/40 overflow-hidden flex-shrink-0">
                  <img
                    src={isLoggedIn ? profile.avatarUrl : "https://api.dicebear.com/7.x/avataaars/svg?seed=guest"}
                    alt={isLoggedIn ? profile.fullName : "Khách"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-600 transition-transform" />
              </button>

              {/* Clean Popover Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-12 w-64 bg-white border border-pink-200/80 rounded-2xl shadow-2xl p-2.5 z-50 animate-fadeIn space-y-1">
                  {/* Profile info header */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-1 space-y-1.5">
                    <p className="text-xs font-black text-slate-900 line-clamp-1">
                      {isLoggedIn ? profile.fullName : "Khách (Chưa đăng nhập)"}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Role hiện tại:</span>
                      <b className="text-amber-600 font-black">{isLoggedIn ? (profile.role || 'USER') : 'GUEST'}</b>
                    </div>

                    {/* Database API Connection indicator inside menu */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200/60 font-medium">
                      <Database className={`w-3 h-3 ${isConnected ? "text-emerald-500" : "text-amber-500"}`} />
                      <span>{isConnected ? "Supabase Realtime DB" : "Local Sandbox Mode"}</span>
                    </div>
                  </div>

                  {isAdminOrOwner && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onSelectView("admin");
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-extrabold text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors"
                    >
                      <Crown className="w-4 h-4 text-amber-600" />
                      Trang Quản Trị Admin
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenMockInterview();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Trophy className="w-4 h-4 text-amber-600" />
                    Thi Thử Sanjion 45'
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsEditModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-pink-600" />
                    Chỉnh Sửa Hồ Sơ & Tên
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsApiKeyModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-500" />
                      <span>Cấu Hình AI Key</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold transition-all ${
                      hasCustomKey 
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                        : "bg-amber-100 text-amber-700 border border-amber-200"
                    }`}>
                      {hasCustomKey ? "🟢 Đã cài Key" : "⚡ Mặc Định"}
                    </span>
                  </button>

                  {!isLoggedIn ? (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenAuthModal();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-purple-600 hover:bg-purple-50 transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      Đăng Nhập / Đăng Ký
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng Xuất Tài Khoản
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile & iPad Bottom Navigation Bar */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-pink-200/80 backdrop-blur-lg px-2 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => onSelectView("roadmap")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all ${
            currentView === "roadmap"
              ? "text-pink-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <div className={`p-1.5 rounded-xl ${currentView === "roadmap" ? "bg-pink-100 text-pink-600" : ""}`}>
            <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
          </div>
          <span>Lộ Trình</span>
        </button>

        <button
          onClick={() => onSelectView("dashboard")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all ${
            currentView === "dashboard"
              ? "text-pink-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <div className={`p-1.5 rounded-xl ${currentView === "dashboard" ? "bg-pink-100 text-pink-600" : ""}`}>
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onSelectView("questions")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all ${
            currentView === "questions"
              ? "text-pink-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <div className={`p-1.5 rounded-xl ${currentView === "questions" ? "bg-pink-100 text-pink-600" : ""}`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <span>Bài Tập</span>
        </button>

        <button
          onClick={() => onSelectView("bookmarks")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all ${
            currentView === "bookmarks"
              ? "text-pink-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <div className={`p-1.5 rounded-xl ${currentView === "bookmarks" ? "bg-pink-100 text-pink-600" : ""}`}>
            <Bookmark className="w-4 h-4" />
          </div>
          <span>Đã Lưu</span>
        </button>

        {isAdminOrOwner && (
          <button
            onClick={() => onSelectView("admin")}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all ${
              currentView === "admin"
                ? "text-amber-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div className={`p-1.5 rounded-xl ${currentView === "admin" ? "bg-amber-100 text-amber-600" : ""}`}>
              <Crown className="w-4 h-4 text-amber-500 fill-amber-300" />
            </div>
            <span>Admin</span>
          </button>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onProfileUpdated={onProfileUpdated}
      />

      {/* Api Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaved={() => {
          setKeyUpdateCount((prev) => prev + 1);
        }}
      />
    </>
  );
};
