import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Crown,
  User,
  Users,
  Search,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Sparkles,
  BookOpen,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Database,
  Filter,
  RefreshCw,
  Zap,
  Cpu,
  Key,
  Sliders,
  Check,
} from 'lucide-react';
import { UserProfile, UserRole, Question } from '../../types';
import { adminService, AdminUserItem } from '../../services/adminService';
import { apiService } from '../../services/apiService';
import { aiService } from '../../services/aiService';

interface AdminDashboardProps {
  currentProfile: UserProfile;
  questions: Question[];
  onProfileRoleChanged?: (newRole: UserRole) => void;
  onGenerateNewQuestion?: () => void;
  onSelectQuestion?: (q: Question) => void;
  onSelectView?: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentProfile,
  questions,
  onProfileRoleChanged,
  onGenerateNewQuestion,
  onSelectQuestion,
  onSelectView,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'questions' | 'ai_config' | 'stats'>('users');
  const [usersList, setUsersList] = useState<AdminUserItem[]>([]);
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // New user modal
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [newFullName, setNewFullName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newRole, setNewRole] = useState<UserRole>('USER');

  // Popup confirmation delete user
  const [userToDelete, setUserToDelete] = useState<AdminUserItem | null>(null);

  // AI Configuration States
  const [selectedAiModel, setSelectedAiModel] = useState<string>(aiService.getSelectedModel());
  const [aiModelsList, setAiModelsList] = useState<string[]>(aiService.getCustomModelsList());
  const [geminiApiKey, setGeminiApiKey] = useState<string>(aiService.getGeminiKeys().join(', '));
  const [openaiApiKey, setOpenaiApiKey] = useState<string>(aiService.getOpenAIKeys().join(', '));
  const [newCustomModelInput, setNewCustomModelInput] = useState<string>('');
  const [aiSaveSuccessNotice, setAiSaveSuccessNotice] = useState<string | null>(null);

  const [providerFilter, setProviderFilter] = useState<'ALL' | 'google' | 'github' | 'email'>('ALL');

  const currentUserRole = currentProfile.role || 'USER';
  const isConnected = apiService.isBackendConnected();

  useEffect(() => {
    loadUsers();
  }, [currentProfile]);

  const loadUsers = async () => {
    const localUsers = adminService.getUsers();
    const userMap = new Map<string, AdminUserItem>();

    // 1. Add current user profile
    if (currentProfile && currentProfile.id && currentProfile.id !== 'guest' && currentProfile.id !== '') {
      const currentProvider = currentProfile.provider || (currentProfile.email?.includes('gmail') ? 'google' : currentProfile.email?.includes('github') ? 'github' : 'email');
      userMap.set(currentProfile.id, {
        id: currentProfile.id,
        username: currentProfile.username || 'current_user',
        fullName: currentProfile.fullName || 'Người Dùng Hiện Tại',
        avatarUrl: currentProfile.avatarUrl,
        streakCount: currentProfile.streakCount || 0,
        lastActiveDate: currentProfile.lastActiveDate || new Date().toISOString().split('T')[0],
        targetLevel: currentProfile.targetLevel || 'Senior',
        totalPoints: currentProfile.totalPoints || 0,
        role: currentProfile.role || 'USER',
        email: currentProfile.email || 'current.user@sanjion.dev',
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        solvedQuestionsCount: 0,
        provider: currentProvider,
      });
    }

    // 2. Add local saved users (which includes saved OAuth accounts!)
    localUsers.forEach(u => {
      if (!u.id || u.id === 'guest' || u.id === '') return;
      const existing = userMap.get(u.id);
      if (!existing) {
        userMap.set(u.id, u);
      } else {
        userMap.set(u.id, {
          ...u,
          ...existing,
          provider: (existing.provider && existing.provider !== 'email') ? existing.provider : (u.provider || existing.provider),
          email: existing.email || u.email,
        });
      }
    });

    // 3. Fetch real database users from Supabase user_profiles table if connected
    if (isConnected) {
      try {
        const dbUsers = await apiService.getUsersFromDatabase();
        if (dbUsers && dbUsers.length > 0) {
          dbUsers.forEach(u => {
            if (!u.id || u.id === 'guest' || u.id === '') return;
            const existing = userMap.get(u.id);
            if (existing) {
              userMap.set(u.id, {
                ...existing,
                ...u,
                fullName: (u.fullName && !u.fullName.includes('Học Viên Sanjion')) ? u.fullName : existing.fullName,
                email: (u.email && !u.email.endsWith('@sanjion.dev')) ? u.email : (existing.email || u.email),
                provider: (u.provider && u.provider !== 'email') ? u.provider : (existing.provider || u.provider),
                username: (u.username && u.username !== 'user') ? u.username : existing.username,
              });
            } else {
              userMap.set(u.id, u);
            }
          });
        }
      } catch (err) {
        console.warn('Real DB users load fallback:', err);
      }
    }

    setUsersList(Array.from(userMap.values()));
  };

  // Security Role Guard: Only OWNER or ADMIN are allowed to access Admin page!
  const isAdminOrOwner = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  if (!isAdminOrOwner) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 sm:p-10 bg-white border border-rose-200 rounded-3xl shadow-2xl text-center space-y-5 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Truy Cập Bị Từ Chối (Access Denied)</h2>
          <p className="text-slate-600 text-sm max-w-lg mx-auto">
            Trang Quản Trị Hệ Thống chỉ dành riêng cho tài khoản có vai trò <b className="text-amber-600">OWNER</b> hoặc <b className="text-purple-600">ADMIN</b>.
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl inline-block text-xs text-slate-500 font-medium">
            Tài khoản hiện tại của bạn: <b className="text-emerald-600 font-bold">{currentProfile.fullName}</b> (Role: <span className="font-extrabold text-pink-600">{currentProfile.role || 'USER'}</span>)
          </div>
        </div>

        <div className="pt-3">
          <button
            onClick={() => onSelectView ? onSelectView('roadmap') : (window.location.hash = '#roadmap')}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs shadow-lg shadow-pink-500/25 transition-all cursor-pointer"
          >
            Quay Về Lộ Trình Học Tập
          </button>
        </div>
      </div>
    );
  }

  const handleRoleChange = async (userId: string, targetRole: UserRole) => {
    const success = adminService.updateUserRole(userId, targetRole, currentUserRole);
    if (success) {
      if (isConnected) {
        await apiService.updateUserRoleInDatabase(userId, targetRole);
      }
      if (userId === currentProfile.id && onProfileRoleChanged) {
        onProfileRoleChanged(targetRole);
      }
      await loadUsers();
    } else {
      alert('⚠️ Bạn không có đủ quyền để thay đổi vai trò của người dùng này!');
    }
  };

  const handleToggleStatus = async (userId: string) => {
    const targetUser = usersList.find(u => u.id === userId);
    const newStatus = targetUser?.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const success = adminService.toggleUserStatus(userId, currentUserRole);
    if (success) {
      if (isConnected) {
        await apiService.updateUserStatusInDatabase(userId, newStatus);
      }
      await loadUsers();
    } else {
      alert('⚠️ Bạn không có đủ quyền thực hiện thao tác này!');
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    // 1. Delete from local storage
    const success = adminService.deleteUser(userToDelete.id, currentUserRole);
    
    // 2. Delete from Supabase Database if connected
    if (isConnected) {
      await apiService.deleteUserFromDatabase(userToDelete.id);
    }

    if (success) {
      setUserToDelete(null);
      await loadUsers();
    } else {
      alert('⚠️ Bạn không có đủ quyền xóa người dùng này khỏi hệ thống!');
      setUserToDelete(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) return;

    const createdUser = adminService.addUser(
      {
        fullName: newFullName,
        email: newEmail,
        role: newRole,
      },
      currentUserRole
    );

    if (isConnected && createdUser) {
      await apiService.saveUserToDatabase(createdUser);
    }

    setNewFullName('');
    setNewEmail('');
    setNewRole('USER');
    setIsAddUserModalOpen(false);
    await loadUsers();
  };

  // AI Configuration Handlers
  const handleSelectAiModel = (modelName: string) => {
    setSelectedAiModel(modelName);
    aiService.setSelectedModel(modelName);
    showNotice(`✨ Đã thay đổi AI Engine mặc định sang: ${modelName}`);
  };

  const handleAddCustomModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomModelInput.trim()) return;
    const updatedList = aiService.addCustomAiModel(newCustomModelInput);
    setAiModelsList(updatedList);
    handleSelectAiModel(newCustomModelInput.trim());
    setNewCustomModelInput('');
  };

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    aiService.setStoredApiKey(geminiApiKey, openaiApiKey);
    showNotice('🔑 Đã lưu thành công cấu hình AI API Keys vào hệ thống!');
  };

  const showNotice = (msg: string) => {
    setAiSaveSuccessNotice(msg);
    setTimeout(() => {
      setAiSaveSuccessNotice(null);
    }, 4000);
  };

  // Filtered users
  const filteredUsers = usersList.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const isGoogle = u.provider === 'google' || u.email?.includes('gmail');
    const isGithub = u.provider === 'github' || u.email?.includes('github');
    const matchesProvider =
      providerFilter === 'ALL' ||
      (providerFilter === 'google' && isGoogle) ||
      (providerFilter === 'github' && isGithub) ||
      (providerFilter === 'email' && !isGoogle && !isGithub);

    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesProvider && matchesSearch;
  });

  // Role & Provider Counts
  const ownerCount = usersList.filter(u => u.role === 'OWNER').length;
  const adminCount = usersList.filter(u => u.role === 'ADMIN').length;
  const userCount = usersList.filter(u => u.role === 'USER').length;
  const googleCount = usersList.filter(u => u.provider === 'google' || u.email?.includes('gmail')).length;
  const githubCount = usersList.filter(u => u.provider === 'github' || u.email?.includes('github')).length;
  const emailCount = usersList.length - googleCount - githubCount;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'OWNER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-xs">
            <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            OWNER (Tối Cao)
          </span>
        );
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            ADMIN (Quản Trị)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            USER (Học Viên)
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-8 md:p-10 shadow-2xl border border-purple-500/30">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-purple-400/30 backdrop-blur-md text-xs font-extrabold tracking-wide uppercase text-purple-300">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" /> HỆ THỐNG QUẢN TRỊ CAO CẤP (ADMIN & ROLES)
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-pink-200 to-amber-200 bg-clip-text text-transparent">
              Quản Lý Phân Quyền & Cấu Hình AI Engine
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Quản lý thành viên, cấu hình mô hình AI mặc định (Gemini, OpenAI, Custom Models) và quản trị ngân hàng bài tập.
            </p>
          </div>

          {/* Quick Role Tester Switcher */}
          <div className="bg-slate-800/90 backdrop-blur-md border border-purple-500/40 rounded-2xl p-4 w-full md:w-80 flex flex-col gap-2.5 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase font-bold">Vai Trò Hiện Tại Của Bạn</span>
              {getRoleBadge(currentUserRole)}
            </div>
            <div className="pt-2 border-t border-slate-700/80">
              <label className="text-[11px] text-slate-400 block mb-1">⚡ Đổi nhanh Role để Test Giao Diện:</label>
              <select
                value={currentUserRole}
                onChange={(e) => onProfileRoleChanged && onProfileRoleChanged(e.target.value as UserRole)}
                className="w-full bg-slate-900 border border-purple-400/40 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-300 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="OWNER">👑 OWNER (Quyền Tối Cao)</option>
                <option value="ADMIN">🛡️ ADMIN (Quản Trị Viên)</option>
                <option value="USER">👤 USER (Học Viên Thường)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pink-200/60 pb-4">
        <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-white text-pink-600 shadow-md shadow-pink-500/10 border border-pink-100'
                : 'text-slate-600 hover:text-pink-600'
            }`}
          >
            <Users className="w-4 h-4 text-purple-600" />
            Quản Lý User ({usersList.length})
          </button>

          <button
            onClick={() => setActiveTab('ai_config')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ai_config'
                ? 'bg-white text-purple-600 shadow-md shadow-purple-500/10 border border-purple-100'
                : 'text-slate-600 hover:text-purple-600'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-500" />
            Cấu Hình AI Engine & Model
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'questions'
                ? 'bg-white text-pink-600 shadow-md shadow-pink-500/10 border border-pink-100'
                : 'text-slate-600 hover:text-pink-600'
            }`}
          >
            <BookOpen className="w-4 h-4 text-pink-600" />
            Ngân Hàng Bài Tập ({questions.length})
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-white text-pink-600 shadow-md shadow-pink-500/10 border border-pink-100'
                : 'text-slate-600 hover:text-pink-600'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-blue-600" />
            System Metrics
          </button>
        </div>

        {activeTab === 'users' && (
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-pink-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Thêm Người Dùng Mới
          </button>
        )}
      </div>

      {/* TAB 1: USER ROLES MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Tổng Thành Viên</span>
              <p className="text-2xl font-black text-slate-900">{usersList.length} Người</p>
            </div>

            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-amber-500" /> OWNER Role
              </span>
              <p className="text-2xl font-black text-amber-900">{ownerCount} Tài khoản</p>
            </div>

            <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-purple-700 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ADMIN Role
              </span>
              <p className="text-2xl font-black text-purple-900">{adminCount} Tài khoản</p>
            </div>

            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> USER Role
              </span>
              <p className="text-2xl font-black text-emerald-900">{userCount} Học viên</p>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-pink-100 shadow-sm">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <button
                onClick={loadUsers}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-all cursor-pointer flex-shrink-0"
                title="Tải lại danh sách người dùng"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Role:
                </span>
                {(['ALL', 'OWNER', 'ADMIN', 'USER'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      roleFilter === role
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="h-4 w-[1px] bg-slate-200 hidden md:block" />

              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                  🔐 Login:
                </span>
                <button
                  onClick={() => setProviderFilter('ALL')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    providerFilter === 'ALL' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả ({usersList.length})
                </button>
                <button
                  onClick={() => setProviderFilter('google')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    providerFilter === 'google' ? 'bg-rose-600 text-white shadow-sm' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  🔴 Google ({googleCount})
                </button>
                <button
                  onClick={() => setProviderFilter('github')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    providerFilter === 'github' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  🐙 GitHub ({githubCount})
                </button>
                <button
                  onClick={() => setProviderFilter('email')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    providerFilter === 'email' ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  ✉️ Email ({emailCount})
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-pink-100 shadow-xl shadow-pink-500/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Thành Viên</th>
                    <th className="p-4">Vai Trò (Role)</th>
                    <th className="p-4">Thay Đổi Phân Quyền</th>
                    <th className="p-4">Tiến Độ Học</th>
                    <th className="p-4">Trạng Thái</th>
                    <th className="p-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Không tìm thấy người dùng nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-pink-50/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatarUrl}
                              alt={user.fullName}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 flex-shrink-0"
                            />
                            <div>
                              <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                                {user.fullName}
                                {user.id === currentProfile.id && (
                                  <span className="text-[10px] bg-pink-100 text-pink-700 font-bold px-1.5 py-0.2 rounded">
                                    Tài khoản bạn đang dùng
                                  </span>
                                )}
                              </p>
                              <p className="text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5">
                                <span>@{user.username}</span>
                                <span>·</span>
                                <span>{user.email}</span>
                                {(user.provider === 'google' || user.email?.includes('gmail')) && (
                                  <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-black px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                                    🔴 Google OAuth
                                  </span>
                                )}
                                {(user.provider === 'github' || user.email?.includes('github')) && (
                                  <span className="bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                                    🐙 GitHub OAuth
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          {getRoleBadge(user.role)}
                        </td>

                        <td className="p-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            disabled={currentUserRole !== 'OWNER' && user.role === 'OWNER'}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <option value="USER">👤 USER (Học Viên)</option>
                            <option value="ADMIN">🛡️ ADMIN (Quản Trị)</option>
                            <option value="OWNER" disabled={currentUserRole !== 'OWNER'}>
                              👑 OWNER (Tối Cao)
                            </option>
                          </select>
                        </td>

                        <td className="p-4">
                          <div className="space-y-1">
                            <p className="font-bold text-slate-900">
                              {user.solvedQuestionsCount} bài đã giải · {user.totalPoints} pts
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Streak: {user.streakCount} ngày · Joined {user.joinedDate}
                            </p>
                          </div>
                        </td>

                        <td className="p-4">
                          {user.status === 'ACTIVE' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-extrabold">
                              <AlertCircle className="w-3 h-3 text-rose-600" /> Blocked
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                user.status === 'ACTIVE'
                                  ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                              }`}
                              title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                            >
                              {user.status === 'ACTIVE' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            </button>

                            {(currentUserRole === 'OWNER' || (currentUserRole === 'ADMIN' && user.role === 'USER')) && user.id !== currentProfile.id && (
                              <button
                                onClick={() => setUserToDelete(user)}
                                className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                                title="Xóa tài khoản khỏi hệ thống"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI CONFIGURATION & MODELS MANAGER */}
      {activeTab === 'ai_config' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Notification Banner */}
          {aiSaveSuccessNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center justify-between shadow-sm animate-fadeIn">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> {aiSaveSuccessNotice}
              </span>
              <button onClick={() => setAiSaveSuccessNotice(null)} className="text-emerald-700 font-black">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Model Selection (Checkboxes / Radio List) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">1. Chọn Model AI Sử Dụng</h3>
                  <p className="text-xs text-slate-500">Tích chọn mô hình AI làm Engine mặc định trả lời bài tập và tutor.</p>
                </div>
              </div>

              <div className="space-y-3">
                {aiModelsList.map(modelName => {
                  const isSelected = selectedAiModel === modelName;
                  return (
                    <label
                      key={modelName}
                      onClick={() => handleSelectAiModel(modelName)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 ring-2 ring-purple-500/20 shadow-md'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectAiModel(modelName)}
                          className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                        />
                        <div>
                          <p className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                            {modelName}
                            {modelName.includes('2.5') && (
                              <span className="text-[10px] bg-amber-100 text-amber-900 font-black px-2 py-0.5 rounded-full">
                                Flash 2.5 ✨
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {modelName.includes('gpt') ? 'OpenAI ChatGPT Model Engine' : 'Google Gemini AI Engine'}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-600 text-white font-extrabold text-[10px]">
                          <Check className="w-3.5 h-3.5" /> Đang sử dụng
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Right: API Keys & Custom Model Config */}
            <div className="space-y-8">
              {/* Form 1: API Keys Settings */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-xl space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">2. Cấu Hình AI API Keys</h3>
                    <p className="text-xs text-slate-500">Cập nhật API Key cá nhân cho Gemini & OpenAI.</p>
                  </div>
                </div>

                <form onSubmit={handleSaveApiKeys} className="space-y-4 text-xs font-medium">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">Google Gemini API Key:</label>
                    <input
                      type="password"
                      placeholder="Dán AIzaSy... API key tại đây"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">OpenAI ChatGPT API Key:</label>
                    <input
                      type="password"
                      placeholder="Dán sk-... API key tại đây"
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Lưu Cấu Hình API Keys
                  </button>
                </form>
              </div>

              {/* Form 2: Add Custom Model Identifier (e.g. gemini-flash-2) */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-xl space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">3. Thêm Model AI Mới (Custom)</h3>
                    <p className="text-xs text-slate-500">Ví dụ nhập: <code className="font-bold text-pink-600">gemini-flash-2</code>, <code className="font-bold text-pink-600">gemini-2.0-flash-exp</code></p>
                  </div>
                </div>

                <form onSubmit={handleAddCustomModel} className="flex gap-2 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: gemini-flash-2..."
                    value={newCustomModelInput}
                    onChange={(e) => setNewCustomModelInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold shadow-md hover:from-pink-600 hover:to-purple-700 cursor-pointer whitespace-nowrap"
                  >
                    + Thêm Model
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUESTIONS MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-pink-100 shadow-sm">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Danh Sách Câu Hỏi Trong Ngân Hàng</h3>
              <p className="text-xs text-slate-500">Quản lý và xem toàn bộ bài tập HTML/CSS, JS Core, Async, React, TS & System Design.</p>
            </div>

            {onGenerateNewQuestion && (
              <button
                onClick={onGenerateNewQuestion}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 hover:from-pink-600 hover:to-purple-600 text-white font-extrabold text-xs shadow-md shadow-pink-500/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" /> Sinh Câu Hỏi Mới Bằng AI
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((q) => (
              <div
                key={q.id}
                onClick={() => onSelectQuestion && onSelectQuestion(q)}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-pink-300 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      q.difficulty === 'EASY'
                        ? 'bg-emerald-100 text-emerald-800'
                        : q.difficulty === 'MEDIUM'
                        ? 'bg-blue-100 text-blue-800'
                        : q.difficulty === 'HARD'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {q.difficulty}
                  </span>

                  <span className="text-[10px] font-bold text-slate-400">
                    +{q.points} pts
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-2">
                  {q.title}
                </h4>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold">{q.type}</span>
                  <span>👀 {q.viewCount} lượt xem</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM METRICS & STATS */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase">Trạng Thái Kết Nối DB API</span>
                <Database className={`w-5 h-5 ${isConnected ? 'text-emerald-500' : 'text-amber-500'}`} />
              </div>
              <p className="text-xl font-black text-slate-900">
                {isConnected ? 'Supabase Database Online' : 'Local Sandbox Storage'}
              </p>
              <p className="text-xs text-slate-500">
                {isConnected ? 'Tự động đồng bộ Realtime Database.' : 'Đang hoạt động ở chế độ Sandbox Offline lưu trữ LocalStorage.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase">Ngân Hàng Bài Tập</span>
                <BookOpen className="w-5 h-5 text-pink-500" />
              </div>
              <p className="text-2xl font-black text-slate-900">{questions.length} Bài Tập</p>
              <p className="text-xs text-slate-500">Đã sẵn sàng trên lộ trình Junior -&gt; Senior.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase">Trợ Lý AI Engine Mặc Định</span>
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-purple-600">{selectedAiModel}</p>
              <p className="text-xs text-slate-500">Failover tự động với ChatGPT OpenAI.</p>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 1: CUSTOM DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/70 backdrop-blur-md flex min-h-full items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-rose-200 max-w-md w-full p-6 space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Xác Nhận Xóa Thành Viên</h3>
                <p className="text-xs text-slate-500">Cảnh báo hành động không thể hoàn tác.</p>
              </div>
            </div>

            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-center gap-3">
              <img
                src={userToDelete.avatarUrl}
                alt={userToDelete.fullName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-200"
              />
              <div>
                <p className="font-black text-slate-900 text-sm">{userToDelete.fullName}</p>
                <p className="text-xs text-slate-500">@{userToDelete.username} · {userToDelete.email}</p>
                <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded mt-1 inline-block">
                  Role: {userToDelete.role}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống không? Tất cả dữ liệu điểm số, lịch sử làm bài sẽ bị xóa hoàn toàn.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Hủy Thao Tác
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Xác Nhận Xóa Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: CREATE NEW USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/70 backdrop-blur-md flex min-h-full items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 max-w-md w-full p-6 space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-pink-600" /> Thêm Người Dùng Mới
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Họ và Tên:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email:</label>
                <input
                  type="email"
                  required
                  placeholder="user@sanjion.dev"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Vai Trò (Role):</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="USER">👤 USER (Học Viên Thường)</option>
                  <option value="ADMIN">🛡️ ADMIN (Quản Trị Viên)</option>
                  <option value="OWNER" disabled={currentUserRole !== 'OWNER'}>
                    👑 OWNER (Tối Cao)
                  </option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold shadow-md shadow-pink-500/20 hover:from-pink-600 hover:to-purple-700"
                >
                  Tạo Người Dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
