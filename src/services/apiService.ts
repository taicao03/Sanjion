import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storageService } from './storageService';
import { MOCK_CATEGORIES, MOCK_QUESTIONS } from './mockData';
import { Question, Category, UserProgress } from '../types';

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

export const apiService = {
  isBackendConnected(): boolean {
    return isSupabaseConfigured;
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

      return data.map((p: any) => ({
        id: p.id,
        username: p.username || p.email?.split('@')[0] || 'user',
        fullName: p.full_name || p.fullName || p.name || 'Học Viên Sanjion',
        avatarUrl: p.avatar_url || p.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=sanjion',
        streakCount: p.streak_count || p.streakCount || 0,
        lastActiveDate: p.last_active_date || new Date().toISOString().split('T')[0],
        targetLevel: p.target_level || 'Junior',
        totalPoints: p.total_points || p.totalPoints || 0,
        role: p.role || 'USER',
        email: p.email || `${p.username || 'user'}@sanjion.dev`,
        joinedDate: p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        status: p.status || 'ACTIVE',
        solvedQuestionsCount: p.solved_count || 0,
        provider: p.provider || (p.email?.includes('gmail') ? 'google' : p.email?.includes('github') ? 'github' : 'email'),
      }));
    } catch (err) {
      console.warn('Failed to fetch real DB users:', err);
      return [];
    }
  },

  // Fetch Categories from Supabase DB or Fallback to Roadmap.sh Categories
  async getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured || !supabase) {
      console.log('⚡ [API Mode]: Local Sandbox Mode (Chưa kết nối Supabase)');
      return MOCK_CATEGORIES;
    }

    try {
      console.log('🟢 [API Mode]: Đang gọi Supabase API -> categories');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (error || !data || data.length === 0) {
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

      return Array.from(uniqueCats.values()).sort((a, b) => a.orderIndex - b.orderIndex);
    } catch (err) {
      console.error('Failed to fetch categories from Supabase:', err);
      return MOCK_CATEGORIES;
    }
  },

  // Fetch Questions from Supabase DB + AI Saved Questions + Roadmap.sh Question Bank
  async getQuestions(): Promise<Question[]> {
    const localAiQs = getLocalAiQuestions();

    if (!isSupabaseConfigured || !supabase) {
      const combinedMock = [...localAiQs, ...MOCK_QUESTIONS];
      const uniqueMock = new Map<string, Question>();
      combinedMock.forEach(q => uniqueMock.set(q.slug || q.id, q));
      return Array.from(uniqueMock.values());
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

      return Array.from(uniqueMap.values());
    } catch (err) {
      console.error('Failed to fetch questions from Supabase:', err);
      const combinedMock = [...localAiQs, ...MOCK_QUESTIONS];
      const uniqueMock = new Map<string, Question>();
      combinedMock.forEach(q => uniqueMock.set(q.slug || q.id, q));
      return Array.from(uniqueMock.values());
    }
  },

  // ✨ DUAL PERSIST NEW AI-GENERATED QUESTION (LOCAL STORAGE + SUPABASE DB) ✨
  async saveQuestion(question: Question): Promise<void> {
    // 1. ALWAYS PERSIST TO LOCAL STORAGE IMMEDIATELY
    saveLocalAiQuestion(question);
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
    questionSlug?: string
  ): Promise<UserProgress> {
    const updatedProgress = storageService.saveProgress(questionId, status, scoreEarned, userAnswer, questionSlug);
    const updatedProfile = storageService.getProfile();

    if (isSupabaseConfigured && supabase) {
      try {
        console.log('🟢 [API Mode]: Đang lưu tiến độ & điểm số mới lên Supabase Cloud -> user_progress');
        await supabase.from('user_progress').upsert({
          user_id: userId,
          question_id: questionId,
          status,
          score: updatedProgress.score,
          user_answer: userAnswer,
          solved_at: status === 'SOLVED' ? new Date().toISOString() : null,
          last_attempt_at: new Date().toISOString(),
        });

        // Update profile points on Supabase DB
        if (userId) {
          await supabase.from('user_profiles').upsert({
            id: userId,
            full_name: updatedProfile.fullName,
            avatar_url: updatedProfile.avatarUrl,
            streak_count: updatedProfile.streakCount,
            total_points: updatedProfile.totalPoints,
            last_active_date: updatedProfile.lastActiveDate,
          });
        }
      } catch (err) {
        console.error('Failed to sync progress to Supabase:', err);
      }
    }

    return updatedProgress;
  }
};
