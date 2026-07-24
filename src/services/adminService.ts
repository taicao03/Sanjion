import { UserProfile, UserRole } from '../types';

export interface AdminUserItem extends UserProfile {
  joinedDate: string;
  status: 'ACTIVE' | 'BLOCKED';
  solvedQuestionsCount: number;
}

const LOCAL_STORAGE_USERS_KEY = 'sanjion_admin_users';

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
  },
];

export const adminService = {
  getUsers(): AdminUserItem[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      if (stored) {
        const parsed: AdminUserItem[] = JSON.parse(stored);
        // Filter out old dummy mock users
        const realOnly = parsed.filter(u => !['usr-admin-01', 'usr-user-01', 'usr-user-02', 'usr-user-03'].includes(u.id));
        return realOnly;
      }
    } catch (e) {
      console.warn('Error reading admin users:', e);
    }
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  },

  saveUsers(users: AdminUserItem[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Error saving admin users:', e);
    }
  },

  saveOAuthAccount(profile: UserProfile): void {
    if (!profile || !profile.id || profile.id === 'guest') return;

    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === profile.id || (profile.email && u.email === profile.email));

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
    };

    if (existingIndex > -1) {
      users[existingIndex] = { ...users[existingIndex], ...accountItem };
    } else {
      users.unshift(accountItem);
    }

    this.saveUsers(users);
  },

  updateUserRole(userId: string, newRole: UserRole, operatorRole: UserRole): boolean {
    // Permission check: ADMIN cannot change an OWNER's role or promote someone to OWNER
    if (operatorRole !== 'OWNER') {
      if (newRole === 'OWNER') return false; // Only OWNER can promote to OWNER
    }

    const users = this.getUsers();
    const targetIndex = users.findIndex(u => u.id === userId);
    if (targetIndex === -1) return false;

    // Prevent demoting the supreme owner if operator is not owner
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
    if (operatorRole !== 'OWNER') return false; // Only OWNER can delete users

    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    if (filtered.length === users.length) return false;

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
      targetLevel: newUser.targetLevel || 'Junior',
      totalPoints: 0,
      role: newUser.role || 'USER',
      email: newUser.email || 'new.user@sanjion.dev',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      solvedQuestionsCount: 0,
    };

    users.push(userItem);
    this.saveUsers(users);
    return userItem;
  }
};
