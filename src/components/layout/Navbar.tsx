import React, { useState } from "react";
import {
  Flame,
  Star,
  BookOpen,
  LayoutDashboard,
  Bookmark,
  Zap,
  Heart,
  Database,
  LogIn,
  LogOut,
  Edit3,
  User,
} from "lucide-react";
import { UserProfile } from "../../types";
import { apiService } from "../../services/apiService";
import { EditProfileModal } from "../profile/EditProfileModal";

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

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-pink-200/60 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Logo Branding */}
          <div
            onClick={() => onSelectView("dashboard")}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white stroke-none" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-base sm:text-lg font-black bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 bg-clip-text text-transparent tracking-tight">
                  Sanjion
                </span>
                <span className="text-[10px] sm:text-[11px] font-extrabold px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                  PRO
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                <Database
                  className={`w-3 h-3 ${isConnected ? "text-emerald-500" : "text-amber-500"}`}
                />
                <span>
                  {isConnected
                    ? "Supabase API Connected"
                    : "Local Sandbox Mode"}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-rose-50/80 p-1.5 rounded-2xl border border-pink-100">
            <button
              onClick={() => onSelectView("dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === "dashboard"
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20"
                  : "text-slate-600 hover:text-pink-600 hover:bg-white/80"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => onSelectView("questions")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === "questions"
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20"
                  : "text-slate-600 hover:text-pink-600 hover:bg-white/80"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Ngân Hàng Sanjion
            </button>

            <button
              onClick={() => onSelectView("bookmarks")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === "bookmarks"
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20"
                  : "text-slate-600 hover:text-pink-600 hover:bg-white/80"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Đã Lưu
            </button>
          </nav>

          {/* Right Stats & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mock Sanjion Button */}
            <button
              onClick={onOpenMockInterview}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-900" />
              Thi Thử Sanjion
            </button>

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 text-[11px] sm:text-xs font-extrabold shadow-sm"
              title="Chuỗi ngày Sanjion"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{profile.streakCount}d</span>
            </div>

            {/* User Points */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-600 text-[11px] sm:text-xs font-extrabold shadow-sm"
              title="Tổng điểm"
            >
              <Star className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>{profile.totalPoints}pts</span>
            </div>

            {/* DIRECT PROMINENT LOGIN / LOGOUT BUTTONS */}
            {!isLoggedIn ? (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20 hover:from-pink-600 hover:to-purple-700 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-all cursor-pointer"
                title="Đăng xuất khỏi tài khoản"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng Xuất</span>
              </button>
            )}

            {/* User Profile Avatar / Dropdown Menu */}
            <div className="relative">
              <div
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-pink-400/40 overflow-hidden cursor-pointer flex-shrink-0"
                title="Bấm để đổi tên hoặc xem tùy chọn"
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              {isMenuOpen && (
                <div className="absolute right-0 top-11 w-52 bg-white border border-pink-200 rounded-2xl shadow-xl p-2 z-50 animate-fadeIn">
                  <div className="p-2 border-b border-pink-100 mb-1">
                    <p className="text-xs font-extrabold text-slate-800 line-clamp-1">
                      {profile.fullName}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      @{profile.username}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsEditModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-pink-600 hover:bg-pink-50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Đổi Tên Hiển Thị
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
                      Đăng Xuất
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-pink-200 backdrop-blur-md px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => onSelectView("dashboard")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all ${
            currentView === "dashboard"
              ? "text-pink-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <div
            className={`p-1.5 rounded-xl ${currentView === "dashboard" ? "bg-pink-100 text-pink-600" : ""}`}
          >
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
          <div
            className={`p-1.5 rounded-xl ${currentView === "questions" ? "bg-pink-100 text-pink-600" : ""}`}
          >
            <BookOpen className="w-4 h-4" />
          </div>
          <span>Sanjion</span>
        </button>

        <button
          onClick={() => onSelectView("bookmarks")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all ${
            currentView === "bookmarks"
              ? "text-pink-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <div
            className={`p-1.5 rounded-xl ${currentView === "bookmarks" ? "bg-pink-100 text-pink-600" : ""}`}
          >
            <Bookmark className="w-4 h-4" />
          </div>
          <span>Đã Lưu</span>
        </button>

        <button
          onClick={onOpenMockInterview}
          className="flex flex-col items-center gap-0.5 text-[10px] font-extrabold text-amber-700"
        >
          <div className="p-1.5 rounded-xl bg-amber-100 text-amber-600 border border-amber-200 shadow-sm">
            <Zap className="w-4 h-4 fill-amber-500" />
          </div>
          <span>Thi Thử</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onProfileUpdated={onProfileUpdated}
      />
    </>
  );
};
