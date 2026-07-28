import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storageService } from './storageService';
import { MOCK_CATEGORIES, MOCK_QUESTIONS } from './mockData';
import { Question, Category, UserProgress, UserProfile } from '../types';

const AI_QUESTIONS_KEY = 'fe_sanjion_v2_ai_questions';

const getLocalAiQuestions = (): Question[] => {
  try {
    const data = localStorage.getItem(AI_QUESTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalAiQuestion = (question: Question) => {
  try {
    const list = getLocalAiQuestions();
    const existingIdx = list.findIndex(q => q.id === question.id || (q.slug && q.slug === question.slug));
    if (existingIdx > -1) {
      list[existingIdx] = question;
    } else {
      list.unshift(question);
    }
    localStorage.setItem(AI_QUESTIONS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to save AI question to localStorage:', e);
  }
};

// In-Memory Caches to prevent duplicate network calls
let cachedCategories: Category[] | null = null;
let cachedQuestions: Question[] | null = null;

export const apiService = {
  isBackendConnected(): boolean {
    return isSupabaseConfigured;
  },

  // Clear in-memory caches
  clearCache() {
    cachedCategories = null;
    cachedQuestions = null;
  },

  // Fetch Real Database Users from Supabase
  async getUsersFromDatabase(): Promise<any[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    try {
      // Try user_profiles first
      let { data, error } = await supabase.from('user_profiles').select('*');
      
      // If user_profiles is empty or errored, try profiles table
      if (error || !data || data.length === 0) {
        const fallbackRes = await supabase.from('profiles').select('*');
        if (fallbackRes.data && fallbackRes.data.length > 0) {
          data = fallbackRes.data;
        }
      }

      if (!data) return [];

      return data.map((p: any) => {
        const rawAvatar = p.avatar_url || p.avatarUrl || '';
        const rawName = p.full_name || p.fullName || p.name || '';
        const rawEmail = p.email || '';
        
        let inferredProvider = p.provider;
        if (!inferredProvider) {
          if (rawEmail.includes('gmail') || rawAvatar.includes('google') || rawAvatar.includes('lh3.googleusercontent.com')) {
            inferredProvider = 'google';
          } else if (rawEmail.includes('github') || rawAvatar.includes('github') || rawAvatar.includes('avatars.githubusercontent.com')) {
            inferredProvider = 'github';
          } else {
            inferredProvider = 'email';
          }
        }

        const fallbackEmail = p.email || (p.username ? `${p.username}@gmail.com` : `user_${p.id.slice(0, 6)}@gmail.com`);

        return {
          id: p.id,
          username: p.username || p.email?.split('@')[0] || `dev_${p.id.slice(0, 5)}`,
          fullName: rawName || 'Học Viên Sanjion',
          avatarUrl: rawAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`,
          streakCount: p.streak_count || p.streakCount || 0,
          lastActiveDate: p.last_active_date || new Date().toISOString().split('T')[0],
          targetLevel: p.target_level || 'Junior',
          totalPoints: p.total_points || p.totalPoints || 0,
          role: p.role || 'USER',
          email: fallbackEmail,
          joinedDate: p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          status: p.status || 'ACTIVE',
          solvedQuestionsCount: p.solved_count || 0,
          provider: inferredProvider,
        };
      });
    } catch (err) {
      console.warn('Failed to fetch real DB users:', err);
      return [];
    }
  },

  // Save / Upsert user profile to Supabase Database
  async saveUserToDatabase(profile: Partial<UserProfile> & { id: string }): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const provider = profile.provider || (profile.email?.includes('gmail') ? 'google' : profile.email?.includes('github') ? 'github' : 'email');
      
      const payload: any = {
        id: profile.id,
        full_name: profile.fullName || 'Học Viên Sanjion',
        username: profile.username || profile.email?.split('@')[0] || 'user',
        email: profile.email,
        avatar_url: profile.avatarUrl,
        role: profile.role || 'USER',
        provider: provider,
        streak_count: profile.streakCount || 0,
        total_points: profile.totalPoints || 0,
        last_active_date: profile.lastActiveDate || new Date().toISOString().split('T')[0],
      };

      const { error } = await supabase.from('user_profiles').upsert(payload);
      if (error) {
        await supabase.from('user_profiles').upsert({
          id: profile.id,
          full_name: profile.fullName || 'Học Viên Sanjion',
          avatar_url: profile.avatarUrl,
          streak_count: profile.streakCount || 0,
          total_points: profile.totalPoints || 0,
          last_active_date: profile.lastActiveDate || new Date().toISOString().split('T')[0],
        });
      }
      return true;
    } catch (err) {
      console.warn('Failed to save user to DB:', err);
      return false;
    }
  },

  // Delete User from Supabase Database
  async deleteUserFromDatabase(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      await supabase.from('user_profiles').delete().eq('id', userId);
      await supabase.from('profiles').delete().eq('id', userId);
      return true;
    } catch (err) {
      console.warn('Failed to delete user from DB:', err);
      return false;
    }
  },

  // Update User Role in Supabase Database
  async updateUserRoleInDatabase(userId: string, role: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      await supabase.from('user_profiles').update({ role }).eq('id', userId);
      return true;
    } catch (err) {
      return false;
    }
  },

  // Update User Status in Supabase Database
  async updateUserStatusInDatabase(userId: string, status: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      await supabase.from('user_profiles').update({ status }).eq('id', userId);
      return true;
    } catch (err) {
      return false;
    }
  },

  // Update User Total Points in Supabase Database
  async updateUserPointsInDatabase(userId: string, points: number): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(userId);
    if (!isUuid) return false;
    try {
      const { error } = await supabase.from('user_profiles').update({ total_points: points }).eq('id', userId);
      return !error;
    } catch (err) {
      return false;
    }
  },

  // Fetch Categories from Supabase DB or Fallback to Roadmap.sh Categories
  async getCategories(): Promise<Category[]> {
    if (cachedCategories && cachedCategories.length > 0) {
      return cachedCategories;
    }

    if (!isSupabaseConfigured || !supabase) {
      console.log('⚡ [API Mode]: Local Sandbox Mode (Chưa kết nối Supabase)');
      cachedCategories = MOCK_CATEGORIES;
      return MOCK_CATEGORIES;
    }

    try {
      console.log('🟢 [API Mode]: Đang gọi Supabase API -> categories');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (error || !data || data.length === 0) {
        cachedCategories = MOCK_CATEGORIES;
        return MOCK_CATEGORIES;
      }

      const dbCats: Category[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description || '',
        iconName: item.icon_name || 'Code2',
        orderIndex: item.order_index || 0,
      }));

      // Merge Supabase categories with Roadmap.sh categories seamlessly
      const combined = [...dbCats, ...MOCK_CATEGORIES];
      const uniqueCats = new Map<string, Category>();
      combined.forEach(c => {
        if (!uniqueCats.has(c.id) && !uniqueCats.has(c.slug)) {
          uniqueCats.set(c.slug || c.id, c);
        }
      });

      const result = Array.from(uniqueCats.values()).sort((a, b) => a.orderIndex - b.orderIndex);
      cachedCategories = result;
      return result;
    } catch (err) {
      console.error('Failed to fetch categories from Supabase:', err);
      cachedCategories = MOCK_CATEGORIES;
      return MOCK_CATEGORIES;
    }
  },

  // Fetch Questions from Supabase DB + AI Saved Questions + Roadmap.sh Question Bank
  async getQuestions(): Promise<Question[]> {
    if (cachedQuestions && cachedQuestions.length > 0) {
      return cachedQuestions;
    }

    const localAiQs = getLocalAiQuestions();

    if (!isSupabaseConfigured || !supabase) {
      const combinedMock = [...localAiQs, ...MOCK_QUESTIONS];
      const uniqueMock = new Map<string, Question>();
      combinedMock.forEach(q => uniqueMock.set(q.slug || q.id, q));
      const result = Array.from(uniqueMock.values());
      cachedQuestions = result;
      return result;
    }

    try {
      console.log('🟢 [API Mode]: Đang gọi Supabase API -> questions');
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      const dbQuestions: Question[] = [];

      if (data && Array.isArray(data) && !error) {
        // Filter out meaningless generic placeholder questions
        const isMeaningless = (title: string, content: string) => {
          const titleStr = title || '';
          const contentStr = content || '';

          if (/^\[(EASY|MEDIUM|HARD|EXPERT)\] Sanjion AI.*Bài tập chuyên sâu #/i.test(titleStr)) return true;
          if (contentStr.includes('Phân tích và triển khai bài tập') && contentStr.includes('cấp độ')) return true;
          return false;
        };

        data.forEach((item: any) => {
          if (!isMeaningless(item.title, item.content)) {
            dbQuestions.push({
              id: item.id,
              categoryId: item.category_id,
              title: item.title,
              slug: item.slug,
              difficulty: item.difficulty,
              type: item.type,
              content: item.content,
              explanation: item.explanation,
              options: item.options,
              starterCode: item.starter_code,
              testCases: item.test_cases,
              points: item.points || 10,
              viewCount: item.view_count || 0,
              createdAt: item.created_at,
              tags: ['Sanjion', 'Frontend'],
            });
          }
        });
      }

      // MERGE ALL PERSISTED QUESTIONS (Local AI Generated + Supabase DB + Roadmap.sh Question Bank)
      const allCombined = [...localAiQs, ...dbQuestions, ...MOCK_QUESTIONS];
      const uniqueMap = new Map<string, Question>();

      allCombined.forEach((q) => {
        const key = q.slug || q.id;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, q);
        }
      });

      const result = Array.from(uniqueMap.values());
      cachedQuestions = result;
      return result;
    } catch (err) {
      console.error('Failed to fetch questions from Supabase:', err);
      const combinedMock = [...localAiQs, ...MOCK_QUESTIONS];
      const uniqueMock = new Map<string, Question>();
      combinedMock.forEach(q => uniqueMock.set(q.slug || q.id, q));
      const result = Array.from(uniqueMock.values());
      cachedQuestions = result;
      return result;
    }
  },

  // ✨ DUAL PERSIST NEW AI-GENERATED QUESTION (LOCAL STORAGE + SUPABASE DB) ✨
  async saveQuestion(question: Question): Promise<void> {
    // 1. ALWAYS PERSIST TO LOCAL STORAGE IMMEDIATELY
    saveLocalAiQuestion(question);
    cachedQuestions = null; // Invalidate cache
    console.log('✅ Đã lưu câu hỏi AI vừa tạo vào Bộ Nhớ Ngân Hàng Sanjion!');

    // 2. PERSIST TO SUPABASE CLOUD DB IF CONNECTED
    if (isSupabaseConfigured && supabase) {
      try {
        console.log('🟢 [API Mode]: Đang đồng bộ câu hỏi AI lên Supabase Cloud DB:', question.title);
        
        const isHexUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(question.id);
        const targetId = isHexUuid ? question.id : undefined;

        // Create clean unique slug based on title & timestamp
        const slugTitle = question.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const uniqueSlug = `${slugTitle}-${Date.now().toString().slice(-6)}`;

        const { error } = await supabase.from('questions').upsert({
          ...(targetId ? { id: targetId } : {}),
          category_id: question.categoryId,
          title: question.title,
          slug: question.slug || uniqueSlug,
          difficulty: question.difficulty,
          type: question.type,
          content: question.content,
          explanation: question.explanation,
          options: question.options || null,
          starter_code: question.starterCode || null,
          test_cases: question.testCases || null,
          points: question.points || 20,
          view_count: 1,
        }, { onConflict: 'slug' });

        if (error) {
          console.warn('Supabase DB Insert notice:', error.message);
        } else {
          console.log('✅ Đã đồng bộ câu hỏi AI thành công lên Supabase Cloud DB!');
        }
      } catch (err) {
        console.warn('Failed to sync AI question to Supabase:', err);
      }
    }
  },

  // ✨ CLEAR ALL QUESTIONS FROM DB & LOCAL AI CACHE ✨
  async clearAllQuestions(): Promise<void> {
    localStorage.removeItem(AI_QUESTIONS_KEY);
    cachedQuestions = null; // Invalidate cache
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        console.log('🗑️ Đã xóa toàn bộ câu hỏi trên Supabase DB!');
      } catch (err) {
        console.error('Failed to clear questions on Supabase:', err);
      }
    }
  },

  // Save Progress to Supabase DB & Sync Profile Total Points
  async saveUserProgress(
    userId: string,
    questionId: string,
    status: 'SOLVED' | 'ATTEMPTED',
    scoreEarned: number,
    userAnswer?: string,
    questionSlug?: string,
    aiResult?: any
  ): Promise<UserProgress> {
    const updatedProgress = storageService.saveProgress(questionId, status, scoreEarned, userAnswer, questionSlug, userId, aiResult);
    const updatedProfile = storageService.getProfile();

    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(userId);

    if (isSupabaseConfigured && supabase && isUuid) {
      try {
        console.log('🟢 [API Mode]: Đang lưu tiến độ & điểm số mới lên Supabase Cloud -> user_progress');
        
        const { error: progErr } = await supabase.from('user_progress').upsert({
          user_id: userId,
          question_id: questionId,
          status,
          score: updatedProgress.score,
          user_answer: userAnswer,
          solved_at: status === 'SOLVED' ? new Date().toISOString() : null,
          last_attempt_at: new Date().toISOString(),
        });
        if (progErr) {
          console.warn('Upsert user_progress notice:', progErr.message);
        }

        // Update profile points, streak & metadata on Supabase DB
        const { error: profErr } = await supabase.from('user_profiles').upsert({
          id: userId,
          full_name: updatedProfile.fullName,
          email: updatedProfile.email,
          username: updatedProfile.username,
          avatar_url: updatedProfile.avatarUrl,
          streak_count: updatedProfile.streakCount,
          total_points: updatedProfile.totalPoints,
          last_active_date: updatedProfile.lastActiveDate,
          role: updatedProfile.role || 'USER',
          provider: updatedProfile.provider || 'email',
        });
        if (profErr) {
          console.warn('Upsert user_profile notice:', profErr.message);
        }
      } catch (err) {
        console.error('Failed to sync progress to Supabase:', err);
      }
    }

    return updatedProgress;
  }
};
