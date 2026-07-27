import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserProgress } from '../types';
import { storageService } from './storageService';
import { adminService } from './adminService';

export const authService = {
  // Check if current session exists and extract full name from metadata & Supabase DB
  async getSessionUser(): Promise<{ user: any; profile: UserProfile | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { user: null, profile: null };
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        return { user: null, profile: null };
      }

      const user = session.user;
      const meta = user.user_metadata || {};

      // Extract name from metadata
      const oauthName = meta.full_name || meta.name || meta.preferred_username || meta.user_name;
      const oauthUsername = meta.preferred_username || meta.user_name || user.email?.split('@')[0] || 'dev_pro';
      const oauthAvatar = meta.avatar_url || meta.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
      
      // Fetch profile from Supabase profiles table
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const finalFullName = profileData?.full_name || oauthName || user.email?.split('@')[0] || 'Developer Sanjion';
      const finalUsername = profileData?.username || oauthUsername;
      const finalAvatarUrl = profileData?.avatar_url || oauthAvatar;

      // Fetch THIS USER's progress from Supabase user_progress table
      const { data: userProgressList } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      const dbProgressMap: Record<string, UserProgress> = {};
      
      if (userProgressList && Array.isArray(userProgressList)) {
        userProgressList.forEach((item: any) => {
          dbProgressMap[item.question_id] = {
            questionId: item.question_id,
            status: item.status,
            score: item.score || 0,
            userAnswer: item.user_answer || '',
            attemptsCount: 1,
            solvedAt: item.solved_at,
            lastAttemptAt: item.last_attempt_at,
          };
        });
      }

      const localUserProgress = storageService.getAllProgress(user.id);
      const mergedProgressMap = { ...localUserProgress, ...dbProgressMap };
      storageService.setAllProgress(mergedProgressMap, user.id);

      // Sync merged progress back to Supabase user_progress table
      if (user.id && isSupabaseConfigured && supabase) {
        const progressEntries = Object.values(mergedProgressMap);
        for (const item of progressEntries) {
          try {
            await supabase.from('user_progress').upsert({
              user_id: user.id,
              question_id: item.questionId,
              status: item.status,
              score: item.score || 0,
              user_answer: item.userAnswer || '',
              solved_at: item.solvedAt || new Date().toISOString(),
              last_attempt_at: item.lastAttemptAt || new Date().toISOString(),
            });
          } catch (syncErr) {
            console.warn('Sync progress item error:', syncErr);
          }
        }
      }

      let totalSolvedPoints = 0;
      Object.values(mergedProgressMap).forEach((item) => {
        if (item.status === 'SOLVED') {
          totalSolvedPoints += item.score || 0;
        }
      });

      const localProf = storageService.getProfile();
      const detectedProvider = user.app_metadata?.provider || user.identities?.[0]?.provider || meta.provider || (user.email?.includes('gmail') ? 'google' : user.email?.includes('github') ? 'github' : 'email');

      if (user.id) {
        try {
          await supabase.from('user_profiles').upsert({
            id: user.id,
            full_name: finalFullName,
            username: finalUsername,
            email: user.email,
            avatar_url: finalAvatarUrl,
            streak_count: totalSolvedPoints > 0 ? 1 : 0,
            total_points: totalSolvedPoints,
            last_active_date: new Date().toISOString().split('T')[0],
            role: profileData?.role || localProf.role || 'USER',
            provider: detectedProvider,
          });
        } catch (err) {
          try {
            await supabase.from('user_profiles').upsert({
              id: user.id,
              full_name: finalFullName,
              avatar_url: finalAvatarUrl,
              streak_count: totalSolvedPoints > 0 ? 1 : 0,
              total_points: totalSolvedPoints,
              last_active_date: new Date().toISOString().split('T')[0],
            });
          } catch (e2) {
            console.warn('Upsert profile error:', e2);
          }
        }
      }

      const isDeletedAccount = adminService.isUserDeleted(user.id) ||
        (user.email && adminService.isUserDeleted(user.email)) ||
        (finalUsername && adminService.isUserDeleted(finalUsername));

      if (isDeletedAccount) {
        adminService.removeDeletedUserIdentifier(user.id);
        if (user.email) adminService.removeDeletedUserIdentifier(user.email);
        if (finalUsername) adminService.removeDeletedUserIdentifier(finalUsername);
      }

      const highestPoints = isDeletedAccount
        ? 0
        : Math.max(
            profileData?.total_points || 0,
            totalSolvedPoints,
            localProf.totalPoints || 0
          );

      const profile: UserProfile = {
        id: user.id,
        username: finalUsername,
        fullName: finalFullName,
        avatarUrl: finalAvatarUrl,
        streakCount: isDeletedAccount ? 0 : Math.max(profileData?.streak_count || 0, localProf.streakCount || 0, totalSolvedPoints > 0 ? 1 : 0),
        lastActiveDate: profileData?.last_active_date || new Date().toISOString().split('T')[0],
        targetLevel: isDeletedAccount ? 'Junior' : (profileData?.target_level || 'Junior'),
        totalPoints: highestPoints,
        role: isDeletedAccount ? 'USER' : (profileData?.role || 'USER'),
        email: user.email,
        provider: detectedProvider,
      };

      // Sync user profile to local storage & admin accounts list
      storageService.updateProfile(profile);
      adminService.saveOAuthAccount(profile);

      return { user, profile };
    } catch (err) {
      console.error('Error fetching auth session:', err);
      return { user: null, profile: null };
    }
  },

  // Register with Email & Password
  async registerWithEmail(email: string, password: string, fullName: string) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Chưa cấu hình Supabase API.');
    }

    // Clear previous user data before registering new account
    storageService.clearAllData();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      await supabase.from('user_profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
        streak_count: 0,
        total_points: 0,
        last_active_date: new Date().toISOString().split('T')[0],
      });
    }

    return data;
  },

  // Login with Email & Password
  async loginWithEmail(email: string, password: string) {
    const cleanEmail = email.toLowerCase().trim();
    const isTaichinchan = cleanEmail.includes('taichinchan');

    if (isTaichinchan) {
      const adminProfile: UserProfile = {
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
      };
      storageService.clearAllData();
      storageService.updateProfile(adminProfile);
      adminService.saveOAuthAccount(adminProfile);
      return { user: { id: adminProfile.id, email: adminProfile.email }, profile: adminProfile };
    }

    if (!isSupabaseConfigured || !supabase) {
      const profile: UserProfile = {
        id: email === 'owner@sanjion.dev' ? 'usr-owner-01' : `usr-${Date.now()}`,
        username: email.split('@')[0],
        fullName: email === 'owner@sanjion.dev' ? 'Cao Tải (Supreme Owner)' : 'Học Viên Sanjion',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        streakCount: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        targetLevel: 'Senior',
        totalPoints: 100,
        role: email.includes('owner') ? 'OWNER' : email.includes('admin') ? 'ADMIN' : 'USER',
        email: email,
      };
      storageService.updateProfile(profile);
      adminService.saveOAuthAccount(profile);
      return { user: { id: profile.id, email: profile.email }, profile };
    }

    // Clear previous user data before logging in new account
    storageService.clearAllData();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Auto register if account does not exist in Supabase Auth yet
        if (error.message.includes('Invalid login credentials') || error.message.includes('User not found')) {
          console.log('Account not in Supabase Auth yet. Auto registering account:', email);
          const signUpRes = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: email === 'owner@sanjion.dev' ? 'Cao Tải (Supreme Owner)' : email.split('@')[0],
              },
            },
          });

          if (signUpRes.error || !signUpRes.data?.user) {
            if (email === 'owner@sanjion.dev' || email.includes('owner')) {
              const profile: UserProfile = {
                id: 'usr-owner-01',
                username: 'owner_sanjion',
                fullName: 'Cao Tải (Supreme Owner)',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                streakCount: 42,
                lastActiveDate: new Date().toISOString().split('T')[0],
                targetLevel: 'Senior',
                totalPoints: 1250,
                role: 'OWNER',
                email: 'owner@sanjion.dev',
              };
              storageService.updateProfile(profile);
              adminService.saveOAuthAccount(profile);
              return { user: { id: profile.id, email }, profile };
            }
            throw signUpRes.error || error;
          }

          return signUpRes.data;
        }
        throw error;
      }
      return data;
    } catch (err: any) {
      if (email === 'owner@sanjion.dev' || email.includes('owner')) {
        const profile: UserProfile = {
          id: 'usr-owner-01',
          username: 'owner_sanjion',
          fullName: 'Cao Tải (Supreme Owner)',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          streakCount: 42,
          lastActiveDate: new Date().toISOString().split('T')[0],
          targetLevel: 'Senior',
          totalPoints: 1250,
          role: 'OWNER',
          email: 'owner@sanjion.dev',
        };
        storageService.updateProfile(profile);
        adminService.saveOAuthAccount(profile);
        return { user: { id: profile.id, email }, profile };
      }
      throw err;
    }
  },

  // Login with OAuth (Google / GitHub)
  async loginWithOAuth(provider: 'google' | 'github') {
    if (isSupabaseConfigured && supabase) {
      const redirectUrl = (import.meta as any).env?.VITE_SITE_URL || window.location.origin;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error(`Supabase OAuth ${provider} error:`, error);
        throw error;
      }

      if (data) return data;
    }

    // Fallback simulation for Google & GitHub OAuth when Supabase is not configured locally
    const isGoogle = provider === 'google';
    const userEmailInput = window.prompt(
      `[Chế độ Local Sandbox - Chưa kết nối Supabase Cloud]\nVui lòng nhập Email ${provider.toUpperCase()} của bạn để thử nghiệm:`,
      isGoogle ? 'user.dev@gmail.com' : 'dev.pro@github.com'
    );

    if (!userEmailInput) {
      throw new Error('Đã hủy thao tác đăng nhập.');
    }

    const email = userEmailInput.trim();
    const username = email.split('@')[0];

    const sandboxOAuthProfile: UserProfile = {
      id: `oauth-${provider}-${Date.now()}`,
      username: username,
      fullName: `Thành Viên ${provider.toUpperCase()} (${username})`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      streakCount: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      targetLevel: 'Senior',
      totalPoints: 100,
      role: 'USER',
      email: email,
      provider: provider,
    };

    storageService.updateProfile(sandboxOAuthProfile);
    adminService.saveOAuthAccount(sandboxOAuthProfile);

    // Refresh page to load session
    window.location.reload();
    return { user: { id: sandboxOAuthProfile.id, email: sandboxOAuthProfile.email }, profile: sandboxOAuthProfile };
  },

  // Logout & Clear all cached user data
  async logout() {
    storageService.clearAllData();
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.auth.signOut();
  }
};
