import { UserProfile, UserRole } from '../types';

export interface AdminUserItem extends UserProfile {
  joinedDate: string;
  status: 'ACTIVE' | 'BLOCKED';
  solvedQuestionsCount: number;
}

const LOCAL_STORAGE_USERS_KEY = 'sanjion_permanent_users_v2';

export const INITIAL_USERS: AdminUserItem[] = [
  {
    id: 'usr-owner-01',
    username: 'taicao_owner',
    fullName: 'Cao Tải (Supreme Owner)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    streakCount: 42,
    lastActiveDate: new Date().toISOString().split('T')[0],
    targetLevel: 'Senior',
    totalPoints: 1250,
    role: 'OWNER',
    email: 'owner@sanjion.dev',
    joinedDate: '2026-01-01',
    status: 'ACTIVE',
    solvedQuestionsCount: 24,
    provider: 'email',
  },
  {
    id: 'usr-admin-taichinchan',
    username: 'taichinchan',
    fullName: 'Cao Tải Admin (taichinchan)',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taichinchan',
    streakCount: 99,
    lastActiveDate: new Date().toISOString().split('T')[0],
    targetLevel: 'Senior',
    totalPoints: 500,
    role: 'ADMIN',
    email: 'taichinchan@sanjion.dev',
    joinedDate: '2026-01-15',
    status: 'ACTIVE',
    solvedQuestionsCount: 18,
    provider: 'email',
  },
];

export const adminService = {
  getUsers(): AdminUserItem[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      if (stored) {
        const parsed: AdminUserItem[] = JSON.parse(stored);
        return parsed.filter(u => u.id !== 'guest' && u.username !== 'guest' && u.id !== '');
      }
    } catch (e) {
      console.warn('Error reading admin users:', e);
    }
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  },

  saveUsers(users: AdminUserItem[]): void {
    try {
      const cleanUsers = users.filter(u => u.id !== 'guest' && u.username !== 'guest' && u.id !== '');
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(cleanUsers));
    } catch (e) {
      console.warn('Error saving admin users:', e);
    }
  },

  saveOAuthAccount(profile: UserProfile): void {
    if (!profile || !profile.id || profile.id === 'guest' || profile.id === '') return;

    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === profile.id || (!!profile.email && u.email === profile.email));

    const detectedProvider = profile.provider || 
      (profile.email?.includes('gmail') ? 'google' : 
       profile.email?.includes('github') ? 'github' : 'email');

    const accountItem: AdminUserItem = {
      id: profile.id,
      username: profile.username || profile.email?.split('@')[0] || 'oauth_user',
      fullName: profile.fullName || 'Thành Viên OAuth',
      avatarUrl: profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
      streakCount: profile.streakCount || 0,
      lastActiveDate: profile.lastActiveDate || new Date().toISOString().split('T')[0],
      targetLevel: profile.targetLevel || 'Senior',
      totalPoints: profile.totalPoints || 0,
      role: profile.role || 'USER',
      email: profile.email || `${profile.username}@gmail.com`,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      solvedQuestionsCount: 0,
      provider: detectedProvider,
    };

    if (existingIndex > -1) {
      const existing = users[existingIndex];
      users[existingIndex] = {
        ...existing,
        ...accountItem,
        role: existing.role !== 'USER' ? existing.role : accountItem.role,
        provider: (accountItem.provider && accountItem.provider !== 'email') ? accountItem.provider : (existing.provider || accountItem.provider),
      };
    } else {
      users.unshift(accountItem);
    }

    this.saveUsers(users);
  },

  updateUserRole(userId: string, newRole: UserRole, operatorRole: UserRole): boolean {
    if (operatorRole !== 'OWNER') {
      if (newRole === 'OWNER') return false;
    }

    const users = this.getUsers();
    const targetIndex = users.findIndex(u => u.id === userId);
    if (targetIndex === -1) return false;

    if (users[targetIndex].role === 'OWNER' && operatorRole !== 'OWNER') {
      return false;
    }

    users[targetIndex].role = newRole;
    this.saveUsers(users);
    return true;
  },

  toggleUserStatus(userId: string, operatorRole: UserRole): boolean {
    if (operatorRole === 'USER') return false;

    const users = this.getUsers();
    const targetIndex = users.findIndex(u => u.id === userId);
    if (targetIndex === -1) return false;

    if (users[targetIndex].role === 'OWNER' && operatorRole !== 'OWNER') {
      return false;
    }

    users[targetIndex].status = users[targetIndex].status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    this.saveUsers(users);
    return true;
  },

  deleteUser(userId: string, operatorRole: UserRole): boolean {
    if (operatorRole === 'USER') return false;

    const users = this.getUsers();
    const target = users.find(u => u.id === userId);
    if (!target) return false;

    // ADMIN cannot delete OWNER or another ADMIN
    if (operatorRole === 'ADMIN' && (target.role === 'OWNER' || target.role === 'ADMIN')) {
      return false;
    }

    const filtered = users.filter(u => u.id !== userId);
    this.saveUsers(filtered);
    return true;
  },

  addUser(newUser: Partial<AdminUserItem>, operatorRole: UserRole): AdminUserItem | null {
    if (operatorRole === 'USER') return null;

    const users = this.getUsers();
    const userItem: AdminUserItem = {
      id: `usr-${Date.now()}`,
      username: newUser.username || `user_${Math.floor(Math.random() * 1000)}`,
      fullName: newUser.fullName || 'Người Dùng Mới',
      avatarUrl: newUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      streakCount: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      targetLevel: 'Junior',
      totalPoints: 0,
      role: newUser.role || 'USER',
      email: newUser.email || 'new.user@sanjion.dev',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      solvedQuestionsCount: 0,
      provider: 'email',
    };

    users.unshift(userItem);
    this.saveUsers(users);
    return userItem;
  },
};
