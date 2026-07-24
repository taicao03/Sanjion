import { UserProfile, UserProgress } from '../types';
import { INITIAL_USER_PROFILE } from './mockData';

const STORAGE_KEYS = {
  USER_PROFILE: 'fe_sanjion_v2_profile',
  USER_PROGRESS: 'fe_sanjion_v2_progress',
  BOOKMARKS: 'fe_sanjion_v2_bookmarks',
  DAILY_ACTIVITY: 'fe_sanjion_v2_activity',
};

export const storageService = {
  // --- Profile ---
  getProfile(): UserProfile {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
      return INITIAL_USER_PROFILE;
    }
    const parsed = JSON.parse(data);
    if (!parsed.role) {
      parsed.role = 'USER';
    }
    return parsed;
  },

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    const profile = this.getProfile();
    const updated = { ...profile, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    return updated;
  },

  resetProfile(newProfile?: UserProfile): UserProfile {
    const p = newProfile || INITIAL_USER_PROFILE;
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(p));
    return p;
  },

  // --- Progress ---
  getAllProgress(userId?: string): Record<string, UserProgress> {
    const prof = this.getProfile();
    const targetId = userId || prof.id;
    
    let data = null;
    if (targetId) {
      data = localStorage.getItem(`fe_sanjion_v2_progress_${targetId}`);
    }
    if (!data) {
      data = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    }
    return data ? JSON.parse(data) : {};
  },

  setAllProgress(progressMap: Record<string, UserProgress>, userId?: string): void {
    const prof = this.getProfile();
    const targetId = userId || prof.id;
    
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progressMap));
    if (targetId) {
      localStorage.setItem(`fe_sanjion_v2_progress_${targetId}`, JSON.stringify(progressMap));
    }
  },

  getProgress(questionId: string, questionSlug?: string, userId?: string): UserProgress | null {
    const all = this.getAllProgress(userId);
    if (all[questionId]) return all[questionId];
    if (questionSlug && all[questionSlug]) return all[questionSlug];
    return null;
  },

  saveProgress(
    questionId: string,
    status: 'SOLVED' | 'ATTEMPTED',
    scoreEarned: number,
    userAnswer?: string,
    questionSlug?: string,
    userId?: string
  ): UserProgress {
    const prof = this.getProfile();
    const targetId = userId || prof.id;
    const all = this.getAllProgress(targetId);
    const existing = all[questionId] || (questionSlug ? all[questionSlug] : undefined);

    const isFirstTimeSolved = status === 'SOLVED' && (!existing || existing.status !== 'SOLVED');

    const updated: UserProgress = {
      questionId,
      status: existing?.status === 'SOLVED' ? 'SOLVED' : status,
      score: existing?.score || (status === 'SOLVED' ? scoreEarned : 0),
      userAnswer: userAnswer || existing?.userAnswer || '',
      attemptsCount: (existing?.attemptsCount || 0) + 1,
      solvedAt: existing?.solvedAt || (status === 'SOLVED' ? new Date().toISOString() : undefined),
      lastAttemptAt: new Date().toISOString(),
    };

    all[questionId] = updated;
    if (questionSlug) {
      all[questionSlug] = updated;
    }

    this.setAllProgress(all, targetId);

    // Add points & update streak if first time solved
    if (isFirstTimeSolved) {
      const today = new Date().toISOString().split('T')[0];
      const newStreak = prof.lastActiveDate === today ? prof.streakCount : (prof.streakCount || 0) + 1;

      this.updateProfile({ 
        totalPoints: (prof.totalPoints || 0) + scoreEarned,
        streakCount: newStreak === 0 ? 1 : newStreak,
        lastActiveDate: today
      });

      this.logDailyActivity();
    }

    return updated;
  },

  // --- Bookmarks ---
  getBookmarks(): string[] {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  },

  toggleBookmark(questionId: string): boolean {
    const bookmarks = this.getBookmarks();
    const index = bookmarks.indexOf(questionId);
    let isBookmarked = false;

    if (index > -1) {
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(questionId);
      isBookmarked = true;
    }

    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    return isBookmarked;
  },

  // --- Activity & Streak ---
  logDailyActivity() {
    const today = new Date().toISOString().split('T')[0];
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_ACTIVITY);
    const activity: Record<string, number> = data ? JSON.parse(data) : {};

    activity[today] = (activity[today] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, JSON.stringify(activity));
  },

  getActivityHistory(): Record<string, number> {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_ACTIVITY);
    return data ? JSON.parse(data) : {};
  },

  clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  }
};
