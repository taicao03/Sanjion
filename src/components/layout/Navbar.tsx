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
      {/* Top Header Bar - Editor Noir IDE Titlebar Style */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#161B22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          
          {/* 1. Left Logo Branding */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div
              onClick={() => onSelectView("roadmap")}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <span className="font-mono font-bold text-[#C9962C] text-lg select-none group-hover:translate-x-0.5 transition-transform">&gt;</span>
              <span className="font-display font-black text-lg text-[#EDEFF2] tracking-tight">
                FE Sanjion
              </span>
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#C9962C]/40 text-[#C9962C] bg-[#C9962C]/10">
                PRO
              </span>
            </div>

            {/* Server Status Monitor Indicator */}
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-[#8B94A3] pl-3 border-l border-white/[0.06]">
              <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? "bg-[#2FAE79]" : "bg-[#8B94A3]"}`} />
              <span>{isConnected ? "Supabase Connected" : "Local Sandbox"}</span>
            </div>
          </div>

          {/* 2. Center Navigation Tabs (VS Code Editor Tab style) */}
          <nav className="hidden xl:flex items-center gap-1 h-full">
            <button
              onClick={() => onSelectView("roadmap")}
              className={`flex items-center gap-2 px-3.5 h-14 text-xs font-medium font-mono border-b-2 transition-colors ${
                currentView === "roadmap"
                  ? "border-[#C9962C] text-[#EDEFF2] bg-[#0B0D11]/40"
                  : "border-transparent text-[#8B94A3] hover:text-[#EDEFF2] hover:bg-white/[0.02]"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#C9962C]" />
              Lộ Trình A-Z
            </button>

            <button
              onClick={() => onSelectView("dashboard")}
              className={`flex items-center gap-2 px-3.5 h-14 text-xs font-medium font-mono border-b-2 transition-colors ${
                currentView === "dashboard"
                  ? "border-[#C9962C] text-[#EDEFF2] bg-[#0B0D11]/40"
                  : "border-transparent text-[#8B94A3] hover:text-[#EDEFF2] hover:bg-white/[0.02]"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#5B54D9]" />
              Dashboard
            </button>

            <button
              onClick={() => onSelectView("questions")}
              className={`flex items-center gap-2 px-3.5 h-14 text-xs font-medium font-mono border-b-2 transition-colors ${
                currentView === "questions"
                  ? "border-[#C9962C] text-[#EDEFF2] bg-[#0B0D11]/40"
                  : "border-transparent text-[#8B94A3] hover:text-[#EDEFF2] hover:bg-white/[0.02]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#2FAE79]" />
              Ngân Hàng Bài Tập
            </button>

            <button
              onClick={() => onSelectView("bookmarks")}
              className={`flex items-center gap-2 px-3.5 h-14 text-xs font-medium font-mono border-b-2 transition-colors ${
                currentView === "bookmarks"
                  ? "border-[#C9962C] text-[#EDEFF2] bg-[#0B0D11]/40"
                  : "border-transparent text-[#8B94A3] hover:text-[#EDEFF2] hover:bg-white/[0.02]"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-[#8B94A3]" />
              Đã Lưu
            </button>

            {/* Admin Management Tab */}
            {isAdminOrOwner && (
              <button
                onClick={() => onSelectView("admin")}
                className={`flex items-center gap-2 px-3.5 h-14 text-xs font-medium font-mono border-b-2 transition-colors ${
                  currentView === "admin"
                    ? "border-[#C9962C] text-[#C9962C] bg-[#C9962C]/10"
                    : "border-transparent text-[#C9962C]/80 hover:text-[#C9962C]"
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-[#C9962C]" />
                Quản Trị Admin
              </button>
            )}
          </nav>

          {/* 3. Right Actions Area */}
          <div className="flex items-center gap-3">
            {!isLoggedIn && (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-[#5B54D9] text-[#EDEFF2] bg-[#5B54D9]/20 hover:bg-[#5B54D9]/40 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#5B54D9]" />
                <span>Đăng Nhập</span>
              </button>
            )}

            {/* Quick Mock Interview Button - Outline Gold */}
            <button
              onClick={onOpenMockInterview}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-[#C9962C] text-[#C9962C] hover:bg-[#C9962C]/10 transition-colors cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-[#C9962C]" />
              Thi Thử 45'
            </button>

            {/* Compact User Stats (Mono ledger format) */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0B0D11] border border-white/[0.06] text-xs font-mono text-[#EDEFF2]">
              <span className="flex items-center gap-1 text-[#C9962C]" title="Streak ngày học">
                <Flame className="w-3.5 h-3.5 text-[#C9962C]" />
                <span>{isLoggedIn ? profile.streakCount : 0}d</span>
              </span>
              <span className="text-[#232A35]">|</span>
              <span className="flex items-center gap-1 text-[#C9962C]" title="Điểm kinh nghiệm">
                <Star className="w-3.5 h-3.5 text-[#C9962C]" />
                <span>+{isLoggedIn ? profile.totalPoints : 0} XP</span>
              </span>
            </div>

            {/* User Profile Avatar & Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded bg-[#0B0D11] hover:border-white/20 border border-white/[0.06] transition-colors cursor-pointer group"
              >
                <div className="w-7 h-7 rounded overflow-hidden flex-shrink-0 bg-[#232A35]">
                  <img
                    src={isLoggedIn ? profile.avatarUrl : "https://api.dicebear.com/7.x/avataaars/svg?seed=guest"}
                    alt={isLoggedIn ? profile.fullName : "Khách"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#8B94A3] group-hover:text-[#EDEFF2] transition-transform" />
              </button>

              {/* Popover Menu - Noir Surface */}
              {isMenuOpen && (
                <div className="absolute right-0 top-11 w-64 bg-[#161B22] border border-white/[0.08] rounded shadow-2xl p-2 z-50 animate-fadeIn space-y-1 font-mono">
                  {/* Profile info header */}
                  <div className="p-2.5 bg-[#0B0D11] rounded border border-white/[0.06] mb-1 space-y-1">
                    <p className="text-xs font-bold text-[#EDEFF2] line-clamp-1 font-sans">
                      {isLoggedIn ? profile.fullName : "Khách (Chưa đăng nhập)"}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-[#8B94A3]">
                      <span>Role:</span>
                      <b className="text-[#C9962C] font-bold">{isLoggedIn ? (profile.role || 'USER') : 'GUEST'}</b>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-[#8B94A3] mt-1.5 pt-1.5 border-t border-white/[0.06]">
                      <Database className={`w-3 h-3 ${isConnected ? "text-[#2FAE79]" : "text-[#8B94A3]"}`} />
                      <span>{isConnected ? "Supabase DB" : "Local Sandbox"}</span>
                    </div>
                  </div>

                  {isAdminOrOwner && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onSelectView("admin");
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded text-xs text-[#C9962C] bg-[#C9962C]/10 hover:bg-[#C9962C]/20 transition-colors"
                    >
                      <Crown className="w-4 h-4 text-[#C9962C]" />
                      Trang Quản Trị Admin
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenMockInterview();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded text-xs text-[#EDEFF2] hover:bg-white/[0.04] transition-colors"
                  >
                    <Trophy className="w-4 h-4 text-[#C9962C]" />
                    Thi Thử Sanjion 45'
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsEditModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded text-xs text-[#EDEFF2] hover:bg-white/[0.04] transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-[#5B54D9]" />
                    Chỉnh Sửa Hồ Sơ & Tên
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsApiKeyModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded text-xs text-[#EDEFF2] hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-[#C9962C]" />
                      <span>Cấu Hình AI Key</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      hasCustomKey 
                        ? "bg-[#2FAE79]/20 text-[#2FAE79] border border-[#2FAE79]/40" 
                        : "bg-[#232A35] text-[#8B94A3] border border-white/[0.06]"
                    }`}>
                      {hasCustomKey ? "Đã cài Key" : "Mặc Định"}
                    </span>
                  </button>

                  {!isLoggedIn ? (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenAuthModal();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded text-xs text-[#5B54D9] hover:bg-[#5B54D9]/10 transition-colors"
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
                      className="w-full flex items-center gap-2 p-2 rounded text-xs text-[#C1553B] hover:bg-[#C1553B]/10 transition-colors"
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
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#161B22] border-t border-white/[0.06] px-2 py-2 flex items-center justify-around font-mono">
        <button
          onClick={() => onSelectView("roadmap")}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition-all ${
            currentView === "roadmap" ? "text-[#C9962C]" : "text-[#8B94A3]"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Lộ Trình</span>
        </button>

        <button
          onClick={() => onSelectView("dashboard")}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition-all ${
            currentView === "dashboard" ? "text-[#C9962C]" : "text-[#8B94A3]"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onSelectView("questions")}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition-all ${
            currentView === "questions" ? "text-[#C9962C]" : "text-[#8B94A3]"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bài Tập</span>
        </button>

        <button
          onClick={() => onSelectView("bookmarks")}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition-all ${
            currentView === "bookmarks" ? "text-[#C9962C]" : "text-[#8B94A3]"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Đã Lưu</span>
        </button>

        {isAdminOrOwner && (
          <button
            onClick={() => onSelectView("admin")}
            className={`flex flex-col items-center gap-0.5 text-[10px] transition-all ${
              currentView === "admin" ? "text-[#C9962C]" : "text-[#8B94A3]"
            }`}
          >
            <Crown className="w-4 h-4" />
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
