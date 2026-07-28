import React, { useState, useEffect, useRef } from 'react';
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
  Trophy,
  ChevronDown,
  X,
  Award,
  Edit3
} from 'lucide-react';
import { UserProfile, UserRole, Question } from '../../types';
import { adminService, AdminUserItem } from '../../services/adminService';
import { apiService } from '../../services/apiService';
import { aiService } from '../../services/aiService';
import { brandingService, SystemBrandingConfig } from '../../services/brandingService';
import { getSavedLevelTiers, saveLevelTiers, LevelTier } from '../shared/LevelUpModal';

// --- CUSTOM STYLISH DARK DROPDOWN COMPONENT ---
interface CustomRoleSelectProps {
  value: UserRole;
  onChange: (newRole: UserRole) => void;
  disabled?: boolean;
}

export const CustomRoleSelect: React.FC<CustomRoleSelectProps> = ({
  value,
  onChange,
  disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'OWNER', label: '👑 OWNER', icon: <Crown className="w-3.5 h-3.5 text-amber-400" />, color: 'text-amber-300' },
    { role: 'ADMIN', label: '🛡️ ADMIN', icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />, color: 'text-purple-300' },
    { role: 'USER', label: '👤 USER', icon: <User className="w-3.5 h-3.5 text-emerald-400" />, color: 'text-emerald-300' },
  ];

  const currentOption = options.find(o => o.role === value) || options[2];

  return (
    <div className="relative inline-block text-left font-mono" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#0B0D11] border border-white/10 hover:border-purple-500/50 text-xs font-bold text-[#EDEFF2] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-inner ${isOpen ? 'ring-2 ring-purple-500 border-purple-500' : ''}`}
      >
        <span className="flex items-center gap-1.5">
          {currentOption.icon}
          <span>{currentOption.label}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute right-0 mt-1.5 w-52 rounded-2xl bg-[#161B22] border border-white/10 shadow-2xl p-1.5 z-50 animate-fadeIn space-y-1 text-xs">
          {options.map((opt) => {
            const isSelected = opt.role === value;
            return (
              <button
                key={opt.role}
                type="button"
                onClick={() => {
                  onChange(opt.role);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600/20 text-amber-300 border border-purple-500/40'
                    : 'text-slate-300 hover:bg-[#232A35] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- MAIN ADMIN DASHBOARD ---
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
  const [activeTab, setActiveTab] = useState<'users' | 'branding_config' | 'ai_config' | 'level_config' | 'questions' | 'stats'>('users');
  const [usersList, setUsersList] = useState<AdminUserItem[]>([]);
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Branding & System Config States
  const [brandingConfig, setBrandingConfig] = useState<SystemBrandingConfig>(() => brandingService.getConfig());
  const [brandingSaveNotice, setBrandingSaveNotice] = useState<string | null>(null);

  // Level Up Points Config States
  const [levelTiersConfig, setLevelTiersConfig] = useState<LevelTier[]>(() => getSavedLevelTiers());
  const [levelSaveNotice, setLevelSaveNotice] = useState<string | null>(null);

  // New user modal
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [newFullName, setNewFullName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newRole, setNewRole] = useState<UserRole>('USER');

  // Popup confirmation delete user
  const [userToDelete, setUserToDelete] = useState<AdminUserItem | null>(null);
  
  // Permission Error Custom Popup Modal State
  const [permissionErrorMsg, setPermissionErrorMsg] = useState<string | null>(null);

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

    // 2. Add local storage users
    localUsers.forEach(u => userMap.set(u.id, u));

    // 3. Add Supabase users if connected
    if (isConnected) {
      const dbUsers = await apiService.getUsersFromDatabase();
      dbUsers.forEach(dbu => {
        const existing = userMap.get(dbu.id);
        userMap.set(dbu.id, {
          id: dbu.id,
          username: dbu.username || dbu.email?.split('@')[0] || 'user',
          fullName: dbu.fullName || dbu.name || 'Học Viên Sanjion',
          avatarUrl: dbu.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbu.id}`,
          streakCount: dbu.streakCount || 0,
          lastActiveDate: dbu.lastActiveDate || new Date().toISOString().split('T')[0],
          targetLevel: dbu.targetLevel || 'Senior',
          totalPoints: dbu.totalPoints || 0,
          role: dbu.role || (existing ? existing.role : 'USER'),
          email: dbu.email || '',
          joinedDate: dbu.created_at ? dbu.created_at.split('T')[0] : (existing?.joinedDate || '2026-01-01'),
          status: (dbu.status as any) || existing?.status || 'ACTIVE',
          solvedQuestionsCount: existing?.solvedQuestionsCount || 0,
          provider: dbu.provider || existing?.provider || (dbu.email?.includes('gmail') ? 'google' : dbu.email?.includes('github') ? 'github' : 'email'),
        });
      });
    }

    const finalList = Array.from(userMap.values());
    setUsersList(finalList);
    adminService.saveUsers(finalList);
  };

  // Role change confirmation popup state
  const [roleChangePending, setRoleChangePending] = useState<{
    user: AdminUserItem;
    newRole: UserRole;
  } | null>(null);
  const [roleNotice, setRoleNotice] = useState<string | null>(null);

  // User Points Editing States & Handlers
  const [userForPointsEdit, setUserForPointsEdit] = useState<AdminUserItem | null>(null);
  const [newPointsInput, setNewPointsInput] = useState<number>(0);

  const isAnyAdminModalOpen = Boolean(
    userToDelete ||
    isAddUserModalOpen ||
    roleChangePending ||
    permissionErrorMsg ||
    userForPointsEdit
  );

  useEffect(() => {
    if (isAnyAdminModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnyAdminModalOpen]);

  const handleOpenPointsEdit = (user: AdminUserItem) => {
    setUserForPointsEdit(user);
    setNewPointsInput(user.totalPoints || 0);
  };

  const handleSaveUserPoints = async () => {
    if (!userForPointsEdit) return;

    const targetId = userForPointsEdit.id;
    const points = Math.max(0, Math.floor(newPointsInput));

    // Update local storage
    adminService.updateUserPoints(targetId, points);

    // Update Supabase Cloud DB
    if (isConnected) {
      await apiService.updateUserPointsInDatabase(targetId, points);
    }

    // Update state in Admin Dashboard list
    setUsersList((prev) =>
      prev.map((u) => (u.id === targetId ? { ...u, totalPoints: points } : u))
    );

    // If editing active profile, update profile in App.tsx
    if (targetId === currentProfile.id && onProfileRoleChanged) {
      onProfileRoleChanged(currentProfile.role || 'USER');
    }

    setRoleNotice(`✅ Đã cập nhật thành công điểm số cho [${userForPointsEdit.fullName}] thành ${points} pts!`);
    setTimeout(() => setRoleNotice(null), 4000);
    setUserForPointsEdit(null);
  };

  const handleRoleChangeInitiate = (targetUser: AdminUserItem, newRole: UserRole) => {
    if (targetUser.role === newRole) return;
    setRoleChangePending({ user: targetUser, newRole });
  };

  const handleConfirmRoleChange = async () => {
    if (!roleChangePending) return;
    const { user, newRole } = roleChangePending;

    const success = adminService.updateUserRole(user.id, newRole, currentUserRole);
    if (success) {
      if (isConnected) {
        await apiService.updateUserRoleInDatabase(user.id, newRole);
      }
      if (user.id === currentProfile.id && onProfileRoleChanged) {
        onProfileRoleChanged(newRole);
      }
      setRoleNotice(`🎉 Đã cập nhật phân quyền cho người dùng [${user.fullName}] sang quyền [${newRole}] thành công!`);
      setTimeout(() => setRoleNotice(null), 4000);
      setRoleChangePending(null);
      await loadUsers();
    } else {
      setPermissionErrorMsg('⚠️ Bạn không có đủ quyền thực hiện thao tác phân quyền này!');
      setRoleChangePending(null);
    }
  };

  const handleToggleBlockUser = async (userId: string, currentStatus: 'ACTIVE' | 'BLOCKED') => {
    const newStatus = currentStatus === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    const success = adminService.toggleUserStatus(userId, currentUserRole);
    if (success) {
      if (isConnected) {
        await apiService.updateUserStatusInDatabase(userId, newStatus);
      }
      await loadUsers();
    } else {
      setPermissionErrorMsg('⚠️ Bạn không có đủ quyền thực hiện khóa/mở khóa tài khoản người dùng này!');
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    const success = adminService.deleteUser(userToDelete.id, currentUserRole);
    if (isConnected) {
      await apiService.deleteUserFromDatabase(userToDelete.id);
    }
    if (success) {
      setUserToDelete(null);
      await loadUsers();
    } else {
      setPermissionErrorMsg('⚠️ Bạn không có đủ quyền xóa người dùng này khỏi hệ thống!');
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

  const handleSaveBrandingConfig = (e: React.FormEvent) => {
    e.preventDefault();
    brandingService.saveConfig(brandingConfig);
    setBrandingSaveNotice('🎨 Đã cập nhật tên ứng dụng, logo và thương hiệu hệ thống thành công!');
    setTimeout(() => setBrandingSaveNotice(null), 4000);
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

  const handleSaveLevelConfig = () => {
    saveLevelTiers(levelTiersConfig);
    setLevelSaveNotice('✅ Đã lưu cấu hình mốc điểm thưởng lên cấp thành công!');
    setTimeout(() => {
      setLevelSaveNotice(null);
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

  const isModalOpen = Boolean(roleChangePending || userToDelete || isAddUserModalOpen || permissionErrorMsg);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'OWNER':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-md shadow-amber-500/20 font-mono">
            <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            OWNER
          </span>
        );
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            ADMIN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            USER
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn font-mono">
      {/* 1. Header Banner - Editor Noir Premium Style */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B0D11] via-[#161B22] to-[#0B0D11] text-white p-8 md:p-10 shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl font-sans">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-md text-xs font-black tracking-wide uppercase text-purple-300 font-mono">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" /> HỆ THỐNG QUẢN TRỊ CAO CẤP (ADMIN & ROLES)
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-pink-200 to-amber-300 bg-clip-text text-transparent">
              Quản Lý Phân Quyền & Cấu Hình AI Engine
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-sans">
              Quản lý thành viên, cấu hình mô hình AI mặc định (Gemini, OpenAI, Custom Models) và mốc điểm thưởng lên cấp.
            </p>
          </div>

          {/* Role Display */}
          <div className="bg-[#0B0D11] border border-white/10 rounded-2xl p-4 flex items-center gap-3 text-white shadow-xl">
            <span className="text-xs text-slate-400 uppercase font-bold">Vai Trò Của Bạn:</span>
            {getRoleBadge(currentUserRole)}
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs - Editor Noir Dark Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 bg-[#0B0D11] p-1.5 rounded-2xl border border-white/10 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-[#232A35] text-amber-300 border border-amber-500/40 shadow-lg shadow-purple-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            Quản Lý User ({usersList.length})
          </button>

          <button
            onClick={() => setActiveTab('branding_config')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'branding_config'
                ? 'bg-[#232A35] text-amber-300 border border-amber-500/40 shadow-lg shadow-purple-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Cấu Hình Logo & Thương Hiệu
          </button>

          <button
            onClick={() => setActiveTab('ai_config')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ai_config'
                ? 'bg-[#232A35] text-amber-300 border border-amber-500/40 shadow-lg shadow-purple-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            Cấu Hình AI Engine & Model
          </button>

          <button
            onClick={() => setActiveTab('level_config')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'level_config'
                ? 'bg-[#232A35] text-amber-300 border border-amber-500/40 shadow-lg shadow-purple-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Cấu Hình Điểm Thưởng Lên Cấp
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'questions'
                ? 'bg-[#232A35] text-amber-300 border border-amber-500/40 shadow-lg shadow-purple-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-pink-400" />
            Ngân Hàng Bài Tập ({questions.length})
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-[#232A35] text-amber-300 border border-amber-500/40 shadow-lg shadow-purple-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-sky-400" />
            System Metrics
          </button>
        </div>

        {activeTab === 'users' && (
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs shadow-lg shadow-purple-600/20 transition-all cursor-pointer transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Thêm Người Dùng Mới
          </button>
        )}
      </div>

      {/* TAB 1: USER ROLES MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {roleNotice && (
            <div className="p-4 rounded-2xl bg-[#161B22] border border-purple-500/40 text-amber-300 text-xs font-mono font-bold flex items-center justify-between shadow-2xl animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{roleNotice}</span>
              </div>
              <button onClick={() => setRoleNotice(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {/* Summary Stats Cards - Editor Noir Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#161B22] p-5 rounded-2xl border border-white/10 shadow-xl space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Thành Viên</span>
              <p className="text-2xl font-black text-[#EDEFF2]">{usersList.length} Người</p>
            </div>

            <div className="bg-[#161B22] p-5 rounded-2xl border border-amber-500/40 shadow-xl shadow-amber-500/5 space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-amber-400" /> OWNER Role
              </span>
              <p className="text-2xl font-black text-amber-300">{ownerCount} Tài khoản</p>
            </div>

            <div className="bg-[#161B22] p-5 rounded-2xl border border-purple-500/40 shadow-xl shadow-purple-500/5 space-y-1">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ADMIN Role
              </span>
              <p className="text-2xl font-black text-purple-300">{adminCount} Tài khoản</p>
            </div>

            <div className="bg-[#161B22] p-5 rounded-2xl border border-emerald-500/40 shadow-xl shadow-emerald-500/5 space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> USER Role
              </span>
              <p className="text-2xl font-black text-emerald-300">{userCount} Học viên</p>
            </div>
          </div>

          {/* Filter Bar & Search - Editor Noir */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#161B22] p-4 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#0B0D11] border border-white/10 rounded-xl text-xs font-mono font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={loadUsers}
                className="p-2 rounded-xl bg-[#0B0D11] hover:bg-[#232A35] border border-white/10 text-slate-300 font-bold transition-all cursor-pointer flex-shrink-0"
                title="Tải lại danh sách người dùng"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Role:
                </span>
                {(['ALL', 'OWNER', 'ADMIN', 'USER'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      roleFilter === role
                        ? 'bg-purple-600/30 text-amber-300 border border-purple-500/50 shadow-md'
                        : 'bg-[#0B0D11] text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
                  🔐 Login:
                </span>
                <button
                  onClick={() => setProviderFilter('ALL')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    providerFilter === 'ALL' ? 'bg-purple-600 text-white shadow-sm' : 'bg-[#0B0D11] text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  Tất cả ({usersList.length})
                </button>
                <button
                  onClick={() => setProviderFilter('google')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    providerFilter === 'google' ? 'bg-rose-600 text-white shadow-sm' : 'bg-[#0B0D11] text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
                  }`}
                >
                  🔴 Google ({googleCount})
                </button>
                <button
                  onClick={() => setProviderFilter('github')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    providerFilter === 'github' ? 'bg-slate-700 text-white shadow-sm' : 'bg-[#0B0D11] text-slate-300 hover:bg-slate-800 border border-white/10'
                  }`}
                >
                  🐙 GitHub ({githubCount})
                </button>
                <button
                  onClick={() => setProviderFilter('email')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    providerFilter === 'email' ? 'bg-sky-600 text-white shadow-sm' : 'bg-[#0B0D11] text-sky-400 hover:bg-sky-500/20 border border-sky-500/30'
                  }`}
                >
                  ✉️ Email ({emailCount})
                </button>
              </div>
            </div>
          </div>

          {/* Users Table - Editor Noir Custom Styled */}
          <div className="bg-[#161B22] rounded-3xl border border-white/10 shadow-2xl overflow-hidden font-mono">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B0D11] border-b border-white/10 text-[#8B94A3] font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Thành Viên</th>
                    <th className="p-4">Vai Trò (Role)</th>
                    <th className="p-4">Thay Đổi Phân Quyền</th>
                    <th className="p-4">Tiến Độ Học</th>
                    <th className="p-4">Trạng Thái</th>
                    <th className="p-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-slate-200 font-medium">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Không tìm thấy người dùng nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-[#1C2128] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatarUrl}
                              alt={user.fullName}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                            />
                            <div>
                              <p className="font-extrabold text-[#EDEFF2] text-sm flex items-center gap-1.5 font-sans">
                                {user.fullName}
                                {user.id === currentProfile.id && (
                                  <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold px-1.5 py-0.2 rounded font-mono">
                                    Tài khoản bạn đang dùng
                                  </span>
                                )}
                              </p>
                              <p className="text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5 font-mono">
                                <span>@{user.username}</span>
                                <span>·</span>
                                <span>{user.email}</span>
                                {(user.provider === 'google' || user.email?.includes('gmail')) && (
                                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-black px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                                    🔴 Google OAuth
                                  </span>
                                )}
                                {(user.provider === 'github' || user.email?.includes('github')) && (
                                  <span className="bg-slate-800 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5 border border-white/10">
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
                          <CustomRoleSelect
                            value={user.role}
                            onChange={(newRole) => handleRoleChangeInitiate(user, newRole)}
                            disabled={currentUserRole !== 'OWNER' && user.role === 'OWNER'}
                          />
                        </td>

                        <td className="p-4">
                          <div className="space-y-0.5 text-xs font-mono">
                            <p className="font-bold text-amber-300">{user.solvedQuestionsCount || 0} bài đã giải · {user.totalPoints || 0} pts</p>
                            <p className="text-[10px] text-slate-400">Streak: {user.streakCount || 0} ngày · Joined {user.joinedDate || '2026-01-01'}</p>
                          </div>
                        </td>

                        <td className="p-4">
                          {user.status === 'BLOCKED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              <Lock className="w-3 h-3 text-rose-400" /> Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenPointsEdit(user)}
                              className="p-1.5 rounded-xl bg-[#0B0D11] border border-white/10 hover:bg-amber-500/20 hover:border-amber-500/40 text-amber-400 transition-colors cursor-pointer"
                              title="Cập nhật điểm XP bài tập"
                            >
                              <Award className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleToggleBlockUser(user.id, user.status || 'ACTIVE')}
                              className="p-1.5 rounded-xl bg-[#0B0D11] border border-white/10 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title={user.status === 'BLOCKED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                            >
                              {user.status === 'BLOCKED' ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
                            </button>

                            <button
                              onClick={() => setUserToDelete(user)}
                              className="p-1.5 rounded-xl bg-[#0B0D11] border border-white/10 hover:bg-rose-500/20 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Xóa tài khoản khỏi hệ thống"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

      {/* TAB: SYSTEM BRANDING & LOGO CONFIGURATION */}
      {activeTab === 'branding_config' && (
        <div className="space-y-6 animate-fadeIn font-mono">
          {brandingSaveNotice && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{brandingSaveNotice}</span>
            </div>
          )}

          <div className="bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Cấu Hình Logo, Tên & Thương Hiệu Hệ Thống</h3>
                  <p className="text-xs text-slate-400 font-sans">Tùy chỉnh tên ứng dụng, logo icon, badge và khẩu hiệu hiển thị trên Navbar & Giao diện.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveBrandingConfig} className="space-y-5 text-xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Tên Ứng Dụng (App Name):</label>
                  <input
                    type="text"
                    required
                    placeholder="Sanjion"
                    value={brandingConfig.appName}
                    onChange={(e) => setBrandingConfig({ ...brandingConfig, appName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0B0D11] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Thẻ Phân Cấp Logo (App Badge):</label>
                  <input
                    type="text"
                    placeholder="PRO"
                    value={brandingConfig.appBadge}
                    onChange={(e) => setBrandingConfig({ ...brandingConfig, appBadge: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0B0D11] border border-white/10 rounded-xl text-amber-300 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Logo Image URL (Đường dẫn ảnh Logo tùy chọn):</label>
                <input
                  type="url"
                  placeholder="https://example.com/my-logo.png (Để trống sẽ sử dụng icon mặc định >)"
                  value={brandingConfig.logoUrl || ''}
                  onChange={(e) => setBrandingConfig({ ...brandingConfig, logoUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0B0D11] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Khẩu Hiệu Hệ Thống (Tagline):</label>
                  <input
                    type="text"
                    placeholder="Hệ Thống Luyện Tập & Phỏng Vấn Frontend Senior A-Z"
                    value={brandingConfig.tagline}
                    onChange={(e) => setBrandingConfig({ ...brandingConfig, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0B0D11] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Email Hỗ Trợ Hệ Thống (Support Email):</label>
                  <input
                    type="email"
                    placeholder="support@sanjion.dev"
                    value={brandingConfig.supportEmail}
                    onChange={(e) => setBrandingConfig({ ...brandingConfig, supportEmail: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0B0D11] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Logo Preview Header Box */}
              <div className="p-4 rounded-2xl bg-[#0B0D11] border border-white/10 space-y-2">
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Xem Trước Hiển Thị Logo Trên Navbar:</span>
                <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-[#161C24] border border-slate-700">
                  {brandingConfig.logoUrl ? (
                    <img src={brandingConfig.logoUrl} alt="Logo" className="w-7 h-7 object-contain rounded" />
                  ) : (
                    <span className="font-mono font-bold text-[#C9962C] text-lg select-none">&gt;</span>
                  )}
                  <span className="font-display font-black text-lg text-white tracking-tight">
                    {brandingConfig.appName || 'Sanjion'}
                  </span>
                  {brandingConfig.appBadge && (
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#C9962C]/40 text-[#C9962C] bg-[#C9962C]/20">
                      {brandingConfig.appBadge}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Lưu Cấu Hình Thương Hiệu & Logo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: AI CONFIGURATION */}
      {activeTab === 'ai_config' && (
        <div className="space-y-6 font-sans">
          {aiSaveSuccessNotice && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{aiSaveSuccessNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Models Selection */}
            <div className="bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/40">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">1. Chọn AI Model Engine Mặc Định</h3>
                  <p className="text-xs text-slate-400">Chọn mô hình LLM chính cho AI Tutor & Đánh giá code.</p>
                </div>
              </div>

              <div className="space-y-3">
                {aiModelsList.map((modelName) => {
                  const isSelected = selectedAiModel === modelName;
                  return (
                    <label
                      key={modelName}
                      onClick={() => handleSelectAiModel(modelName)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600/20 border-purple-500 text-amber-300 ring-2 ring-purple-500/40 shadow-xl'
                          : 'bg-[#0B0D11] border-white/10 hover:bg-[#232A35] text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectAiModel(modelName)}
                          className="w-4 h-4 text-purple-500 rounded border-white/20 focus:ring-purple-500 cursor-pointer"
                        />
                        <div>
                          <p className="font-extrabold text-sm text-white flex items-center gap-2 font-mono">
                            {modelName}
                            {modelName.includes('2.5') && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black px-2 py-0.5 rounded-full">
                                Flash 2.5 ✨
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {modelName.includes('gpt') ? 'OpenAI ChatGPT Model Engine' : 'Google Gemini AI Engine'}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-600 text-white font-extrabold text-[10px] font-mono">
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
              <div className="bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">2. Cấu Hình AI API Keys</h3>
                    <p className="text-xs text-slate-400">Cập nhật API Key cá nhân cho Gemini & OpenAI.</p>
                  </div>
                </div>

                <form onSubmit={handleSaveApiKeys} className="space-y-4 text-xs font-medium font-mono">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Google Gemini API Key:</label>
                    <input
                      type="password"
                      placeholder="Dán AIzaSy... API key tại đây"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0B0D11] border border-white/10 rounded-xl font-mono text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">OpenAI ChatGPT API Key:</label>
                    <input
                      type="password"
                      placeholder="Dán sk-... API key tại đây"
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0B0D11] border border-white/10 rounded-xl font-mono text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
                  >
                    Lưu Cấu Hình API Keys
                  </button>
                </form>
              </div>

              {/* Form 2: Add Custom Model Identifier */}
              <div className="bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="p-3 bg-pink-500/20 text-pink-400 rounded-2xl border border-pink-500/40">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">3. Thêm Model AI Mới (Custom)</h3>
                    <p className="text-xs text-slate-400">Ví dụ nhập: <code className="font-bold text-pink-400">gemini-flash-2</code></p>
                  </div>
                </div>

                <form onSubmit={handleAddCustomModel} className="flex gap-2 text-xs font-mono">
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: gemini-flash-2..."
                    value={newCustomModelInput}
                    onChange={(e) => setNewCustomModelInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#0B0D11] border border-white/10 rounded-xl font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold shadow-md hover:from-purple-700 hover:to-pink-700 cursor-pointer whitespace-nowrap"
                  >
                    + Thêm Model
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LEVEL UP POINTS CONFIGURATION */}
      {activeTab === 'level_config' && (
        <div className="space-y-6 animate-fadeIn font-mono">
          {levelSaveNotice && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{levelSaveNotice}</span>
            </div>
          )}

          <div className="bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Cấu Hình Mốc Điểm Thưởng Lên Cấp (Level Up Thresholds)</h3>
                  <p className="text-xs text-slate-400">Chỉnh sửa mốc điểm XP yêu cầu để thăng cấp và nhận đặc quyền thăng cấp tương ứng.</p>
                </div>
              </div>

              <button
                onClick={handleSaveLevelConfig}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Lưu Cấu Hình Điểm Thưởng
              </button>
            </div>

            {/* Level Tiers Form Table */}
            <div className="space-y-4">
              {levelTiersConfig.map((tier, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#0B0D11] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-[240px]">
                    <span className="text-3xl p-2 bg-[#161B22] rounded-xl shadow-xs border border-white/10">{tier.badge}</span>
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Cấp {idx + 1}</span>
                      <h4 className="text-sm font-black text-white font-sans">{tier.name}</h4>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Mốc XP Tối Thiểu (Min Points):</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={tier.minPoints}
                          onChange={(e) => {
                            const newMin = parseInt(e.target.value) || 0;
                            const updated = [...levelTiersConfig];
                            updated[idx] = { ...updated[idx], minPoints: newMin };
                            setLevelTiersConfig(updated);
                          }}
                          className="w-32 px-3 py-2 bg-[#161B22] border border-white/10 rounded-xl text-xs font-black text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">XP</span>
                      </div>
                    </div>

                    <div className="flex-1 md:w-96">
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Đặc Quyền Mở Khóa (Phân cách bởi dấu phẩy):</label>
                      <input
                        type="text"
                        value={tier.perks.join(', ')}
                        onChange={(e) => {
                          const newPerks = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
                          const updated = [...levelTiersConfig];
                          updated[idx] = { ...updated[idx], perks: newPerks };
                          setLevelTiersConfig(updated);
                        }}
                        className="w-full px-3 py-2 bg-[#161B22] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUESTIONS MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#161B22] p-5 rounded-3xl border border-white/10 shadow-2xl">
            <div>
              <h3 className="text-lg font-extrabold text-white">Danh Sách Câu Hỏi Trong Ngân Hàng</h3>
              <p className="text-xs text-slate-400">Quản lý và xem toàn bộ bài tập HTML/CSS, JS Core, Async, React, TS & System Design.</p>
            </div>

            {onGenerateNewQuestion && (
              <button
                onClick={onGenerateNewQuestion}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-pink-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer"
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
                className="bg-[#161B22] p-5 rounded-2xl border border-white/10 hover:border-purple-500/50 shadow-xl transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      q.difficulty === 'EASY'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : q.difficulty === 'MEDIUM'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : q.difficulty === 'HARD'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {q.difficulty}
                  </span>

                  <span className="text-[10px] font-bold text-amber-400">
                    +{q.points} pts
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-2 font-sans">
                  {q.title}
                </h4>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
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
            <div className="bg-[#161B22] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase">Trạng Thái Kết Nối DB API</span>
                <Database className={`w-5 h-5 ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
              </div>
              <p className="text-xl font-black text-white">
                {isConnected ? 'Supabase Database Online' : 'Local Sandbox Storage'}
              </p>
              <p className="text-xs text-slate-400">
                {isConnected ? 'Tự động đồng bộ Realtime Database.' : 'Đang hoạt động ở chế độ Sandbox Offline lưu trữ LocalStorage.'}
              </p>
            </div>

            <div className="bg-[#161B22] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase">Ngân Hàng Bài Tập</span>
                <BookOpen className="w-5 h-5 text-pink-400" />
              </div>
              <p className="text-2xl font-black text-white">{questions.length} Bài Tập</p>
              <p className="text-xs text-slate-400">Đã sẵn sàng trên lộ trình Junior -&gt; Senior.</p>
            </div>

            <div className="bg-[#161B22] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase">Trợ Lý AI Engine Mặc Định</span>
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-300">{selectedAiModel}</p>
              <p className="text-xs text-slate-400">Failover tự động với ChatGPT OpenAI.</p>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 1: CUSTOM DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex min-h-full items-center justify-center p-4 sm:p-6 animate-fadeIn font-mono">
          <div className="bg-[#161B22] rounded-3xl shadow-2xl border border-rose-500/40 max-w-md w-full p-6 space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-scaleUp text-white">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/40">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Xác Nhận Xóa Thành Viên</h3>
                <p className="text-xs text-slate-400">Cảnh báo hành động không thể hoàn tác.</p>
              </div>
            </div>

            <div className="p-4 bg-[#0B0D11] rounded-2xl border border-white/10 flex items-center gap-3">
              <img
                src={userToDelete.avatarUrl}
                alt={userToDelete.fullName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
              />
              <div>
                <p className="font-black text-white text-sm font-sans">{userToDelete.fullName}</p>
                <p className="text-xs text-slate-400">@{userToDelete.username} · {userToDelete.email}</p>
                <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded mt-1 inline-block">
                  Role: {userToDelete.role}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống không? Tất cả dữ liệu điểm số, lịch sử làm bài sẽ bị xóa hoàn toàn.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#0B0D11] text-slate-300 font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Hủy Thao Tác
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                Xác Nhận Xóa Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: CREATE NEW USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex min-h-full items-center justify-center p-4 sm:p-6 animate-fadeIn font-mono">
          <div className="bg-[#161B22] rounded-3xl shadow-2xl border border-white/10 max-w-md w-full p-6 space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-scaleUp text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" /> Thêm Người Dùng Mới
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Họ và Tên:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0B0D11] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email:</label>
                <input
                  type="email"
                  required
                  placeholder="user@sanjion.dev"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0B0D11] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Vai Trò (Role):</label>
                <CustomRoleSelect
                  value={newRole}
                  onChange={(r) => setNewRole(r)}
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#0B0D11] text-slate-300 font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold shadow-lg shadow-purple-600/20 hover:from-purple-700 hover:to-pink-700 cursor-pointer"
                >
                  Tạo Người Dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* POPUP 0: ROLE CHANGE CONFIRMATION MODAL */}
      {roleChangePending && (
        <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex min-h-full items-center justify-center p-4 sm:p-6 animate-fadeIn font-mono">
          <div className="bg-[#161B22] rounded-3xl shadow-2xl border border-purple-500/40 max-w-md w-full p-6 space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-scaleUp text-white relative">
            
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/40">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Xác Nhận Thay Đổi Phân Quyền</h3>
                <p className="text-xs text-slate-400 font-sans">Vui lòng xác nhận trước khi cấp quyền mới cho người dùng.</p>
              </div>
            </div>

            {/* Target User Info Card */}
            <div className="p-4 bg-[#0B0D11] rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={roleChangePending.user.avatarUrl}
                  alt={roleChangePending.user.fullName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                />
                <div>
                  <p className="font-black text-white text-sm font-sans">{roleChangePending.user.fullName}</p>
                  <p className="text-xs text-slate-400">@{roleChangePending.user.username} · {roleChangePending.user.email}</p>
                </div>
              </div>

              {/* Role Transition Badge */}
              <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-[#161B22] border border-white/10 text-xs">
                <span>{getRoleBadge(roleChangePending.user.role)}</span>
                <span className="text-amber-400 font-black text-sm">➔</span>
                <span>{getRoleBadge(roleChangePending.newRole)}</span>
              </div>
            </div>

            {/* Description & Impact Warning */}
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs leading-relaxed text-slate-200 font-sans">
              {roleChangePending.newRole === 'OWNER' && (
                <p className="text-amber-300 font-bold">
                  👑 <strong>Cấp quyền OWNER (Tối Cao):</strong> Người dùng này sẽ nhận toàn bộ quyền hạn cao nhất trên ứng dụng, bao gồm phân quyền thành viên và quản trị hệ thống.
                </p>
              )}
              {roleChangePending.newRole === 'ADMIN' && (
                <p className="text-purple-300 font-bold">
                  🛡️ <strong>Cấp quyền ADMIN (Quản Trị Viên):</strong> Người dùng này sẽ được phép truy cập trang quản trị Admin, phân quyền học viên, cài đặt AI Engine và quản lý bài tập.
                </p>
              )}
              {roleChangePending.newRole === 'USER' && (
                <p className="text-emerald-300 font-bold">
                  👤 <strong>Chuyển về USER (Học Viên Thường):</strong> Người dùng này sẽ không còn quyền quản trị và chỉ có thể làm bài tập như học viên thông thường.
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRoleChangePending(null)}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#0B0D11] text-slate-300 font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Hủy Thao Tác
              </button>

              <button
                type="button"
                onClick={handleConfirmRoleChange}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs shadow-lg shadow-purple-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Xác Nhận Cấp Quyền Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: PERMISSION DENIED CUSTOM MODAL */}
      {permissionErrorMsg && (
        <div className="fixed inset-0 z-[999999] overflow-y-auto bg-slate-950/85 backdrop-blur-md flex min-h-full items-center justify-center p-4 sm:p-6 animate-fadeIn font-mono">
          <div className="bg-[#161B22] rounded-3xl shadow-2xl border border-rose-500/50 max-w-md w-full p-6 space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-scaleUp text-white relative">
            
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/40">
                <AlertCircle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-white font-sans">Từ Chối Quyền Thao Tác</h3>
                <p className="text-xs text-slate-400 font-sans">Quyền hạn tài khoản của bạn không đủ để thực hiện.</p>
              </div>
            </div>

            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-rose-200 text-xs font-bold font-sans leading-relaxed flex items-start gap-2.5">
              <span className="text-amber-400 text-sm font-bold">⚠️</span>
              <span>{permissionErrorMsg}</span>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setPermissionErrorMsg(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xs shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                Đã Hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: EDIT USER POINTS MODAL */}
      {userForPointsEdit && (
        <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex min-h-full items-center justify-center p-4 sm:p-6 animate-fadeIn font-mono">
          <div className="bg-[#161B22] rounded-3xl shadow-2xl border border-amber-500/40 max-w-md w-full p-6 space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-scaleUp text-white relative">
            
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white font-sans">Cập Nhật Điểm XP Học Viên</h3>
                <p className="text-xs text-slate-400 font-sans">Điều chỉnh điểm kinh nghiệm làm bài trực tiếp.</p>
              </div>
            </div>

            {/* Target User Info Card */}
            <div className="p-4 bg-[#0B0D11] rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={userForPointsEdit.avatarUrl}
                  alt={userForPointsEdit.fullName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                />
                <div>
                  <p className="font-black text-white text-sm font-sans">{userForPointsEdit.fullName}</p>
                  <p className="text-xs text-slate-400">@{userForPointsEdit.username} · {userForPointsEdit.email}</p>
                </div>
              </div>
            </div>

            {/* Points Input & Quick Adjust Buttons */}
            <div className="space-y-3">
              <label className="text-xs text-slate-300 font-bold block">
                Điểm XP Hiện Tại: <span className="text-amber-400 font-mono text-sm">{userForPointsEdit.totalPoints || 0} pts</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={newPointsInput}
                  onChange={(e) => setNewPointsInput(Number(e.target.value))}
                  className="w-full bg-[#0B0D11] border border-amber-500/40 rounded-xl px-4 py-3 text-amber-300 font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Nhập số điểm..."
                />
                <span className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold">XP</span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setNewPointsInput((prev) => prev + 50)}
                  className="py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  +50 pts
                </button>
                <button
                  type="button"
                  onClick={() => setNewPointsInput((prev) => prev + 100)}
                  className="py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  +100 pts
                </button>
                <button
                  type="button"
                  onClick={() => setNewPointsInput((prev) => prev + 500)}
                  className="py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  +500 pts
                </button>
                <button
                  type="button"
                  onClick={() => setNewPointsInput(0)}
                  className="py-1.5 px-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset 0
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserForPointsEdit(null)}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#0B0D11] text-slate-300 font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Hủy Thao Tác
              </button>

              <button
                type="button"
                onClick={handleSaveUserPoints}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Lưu Điểm Mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
