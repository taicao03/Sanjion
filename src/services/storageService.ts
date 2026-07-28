import { Question, UserProfile, UserProgress } from '../types';
import { INITIAL_USER_PROFILE, MOCK_QUESTIONS } from './mockData';

const STORAGE_KEYS = {
  USER_PROFILE: 'fe_sanjion_v2_profile',
  USER_PROGRESS: 'fe_sanjion_v2_progress',
  BOOKMARKS: 'fe_sanjion_v2_bookmarks',
  DAILY_ACTIVITY: 'fe_sanjion_v2_activity',
};

export const storageService = {
  // --- Questions Cache ---
  getQuestions(): Question[] {
    try {
      const localAi = localStorage.getItem('fe_sanjion_ai_questions');
      const aiQs: Question[] = localAi ? JSON.parse(localAi) : [];
      return [...aiQs, ...MOCK_QUESTIONS];
    } catch (e) {
      return MOCK_QUESTIONS;
    }
  },

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
    if (targetId && targetId !== 'guest' && targetId !== '') {
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
    
    if (targetId && targetId !== 'guest' && targetId !== '') {
      localStorage.setItem(`fe_sanjion_v2_progress_${targetId}`, JSON.stringify(progressMap));
    } else {
      localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progressMap));
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
    userId?: string,
    aiResult?: any
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
      userAnswer: userAnswer !== undefined ? userAnswer : (existing?.userAnswer || ''),
      attemptsCount: (existing?.attemptsCount || 0) + 1,
      solvedAt: existing?.solvedAt || (status === 'SOLVED' ? new Date().toISOString() : undefined),
      lastAttemptAt: new Date().toISOString(),
      aiResult: aiResult || existing?.aiResult,
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
    localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.DAILY_ACTIVITY);
  },

  // --- Complete User Purge (Wipes out all progress, points, streak, and history) ---
  purgeAllUserData(userId: string, username?: string, email?: string): void {
    try {
      const identifiers = [userId, username, email].filter(Boolean) as string[];

      // 1. Purge specific key patterns
      identifiers.forEach((id) => {
        localStorage.removeItem(`fe_sanjion_v2_progress_${id}`);
        localStorage.removeItem(`fe_sanjion_v2_bookmarks_${id}`);
        localStorage.removeItem(`fe_sanjion_v2_activity_${id}`);
      });

      // 2. Scan all localStorage keys to clean any keys containing the user identifier
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          identifiers.forEach((id) => {
            if (id && key.includes(id)) {
              keysToRemove.push(key);
            }
          });
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      // 3. Reset profile if current active profile matches deleted user
      const currentProf = this.getProfile();
      if (
        currentProf.id === userId ||
        (username && currentProf.username === username) ||
        (email && currentProf.email === email)
      ) {
        localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
        localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
        localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
        localStorage.removeItem(STORAGE_KEYS.DAILY_ACTIVITY);
      }
    } catch (e) {
      console.warn('Failed to purge user data:', e);
    }
  }
};
