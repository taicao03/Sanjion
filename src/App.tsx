import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Trophy,
  Filter,
  Flame,
  UserCheck,
  Search,
  Code2,
  CheckCircle2,
  Bookmark,
  Layers,
  Zap,
} from 'lucide-react';
import { Category, Question, UserProfile, UserProgress } from './types';
import { apiService } from './services/apiService';
import { storageService } from './services/storageService';
import { authService } from './services/authService';
import { aiService } from './services/aiService';
import { supabase, isSupabaseConfigured } from './lib/supabase';

import { Navbar } from './components/layout/Navbar';
import { QuestionCard } from './components/questions/QuestionCard';
import { FilterBar } from './components/questions/FilterBar';
import { CodeEditorWorkspace } from './components/questions/CodeEditorWorkspace';
import { GenerateQuestionModal } from './components/questions/GenerateQuestionModal';
import { ProgressOverview } from './components/dashboard/ProgressOverview';
import { CategoryBreakdownChart } from './components/dashboard/CategoryBreakdownChart';
import { StreakHeatmap } from './components/dashboard/StreakHeatmap';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { AiTutorWidget } from './components/ai/AiTutorWidget';
import { AuthModal } from './components/auth/AuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TextSelectionToolbar } from './components/shared/TextSelectionToolbar';

export function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'questions' | 'workspace' | 'bookmarks' | 'roadmap' | 'admin'>('roadmap');
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [activityHistory, setActivityHistory] = useState<Record<string, number>>(storageService.getActivityHistory());
  const [bookmarks, setBookmarks] = useState<string[]>(storageService.getBookmarks());

  // Workspace & Active Question
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // ✨ DIRECT AI GENERATION STATES FOR SAME TOPIC & DIFFICULTY ✨
  const [isDirectAiGenerating, setIsDirectAiGenerating] = useState<boolean>(false);
  const [directAiMessage, setDirectAiMessage] = useState<string>('');

  useEffect(() => {
    loadInitialData();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, _session: any) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          await loadUserData();
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          storageService.clearAllData();
          setProfile(storageService.getProfile());
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const loadInitialData = async () => {
    const cats = await apiService.getCategories();
    const qs = await apiService.getQuestions();
    setCategories(cats);
    setQuestions(qs);
    await loadUserData();
  };

  const loadUserData = async () => {
    const { user, profile: fetchedProfile } = await authService.getSessionUser();
    if (user && fetchedProfile) {
      setIsLoggedIn(true);
      setProfile(fetchedProfile);
      setProgressMap(storageService.getAllProgress(fetchedProfile.id));
    } else {
      setIsLoggedIn(false);
      const prof = storageService.getProfile();
      setProfile(prof);
      setProgressMap(storageService.getAllProgress(prof.id));
    }
    setActivityHistory(storageService.getActivityHistory());
    setBookmarks(storageService.getBookmarks());
  };

  const handleToggleBookmark = (e: React.MouseEvent, questionId: string) => {
    e.stopPropagation();
    storageService.toggleBookmark(questionId);
    setBookmarks(storageService.getBookmarks());
  };

  const handleSolveQuestion = async (
    questionId: string,
    score: number,
    userAnswer?: string
  ) => {
    if (!isLoggedIn || !profile.id) {
      setIsAuthModalOpen(true);
      return;
    }

    await apiService.saveUserProgress(
      profile.id,
      questionId,
      'SOLVED',
      score,
      userAnswer,
      activeQuestion?.slug
    );
    const updatedProfile = storageService.getProfile();
    setProfile(updatedProfile);
    setProgressMap(storageService.getAllProgress(profile.id));
    setActivityHistory(storageService.getActivityHistory());
  };

  const handleSelectQuestion = (q: Question) => {
    setActiveQuestion(q);
    setCurrentView('workspace');
  };

  const handleQuestionGenerated = async (newQuestion: Question) => {
    await apiService.saveQuestion(newQuestion);
    setQuestions((prev) => [newQuestion, ...prev]);
    setActiveQuestion(newQuestion);
    setCurrentView('workspace');
  };

  // ✨ 1-CLICK DIRECT SAME LEVEL & SAME TOPIC AI GENERATION (DYNAMIC MODEL FROM .ENV.LOCAL) ✨
  const handleGenerateNextSameTopicSameDifficulty = async () => {
    if (!activeQuestion) {
      setIsGenerateModalOpen(true);
      return;
    }

    const cat = categories.find((c) => c.id === activeQuestion.categoryId);
    const categoryName = cat?.name || 'Frontend Core';
    const activeModel = aiService.getActiveModelName();

    setIsDirectAiGenerating(true);
    setDirectAiMessage(`✨ Model AI [${activeModel}] đang sinh câu hỏi mới 100% (Chủ đề: ${categoryName} - Cấp độ: ${activeQuestion.difficulty})...`);

    try {
      const apiKey = aiService.getStoredApiKey();
      const newQ = await aiService.generateQuestionWithAI(
        activeQuestion.categoryId,
        categoryName,
        activeQuestion.difficulty,
        activeQuestion.type,
        undefined,
        apiKey
      );

      await apiService.saveQuestion(newQ);
      setQuestions((prev) => [newQ, ...prev]);
      setActiveQuestion(newQ);
      setCurrentView('workspace');
    } catch (err: any) {
      console.error('Direct AI Generation error:', err);
      setIsGenerateModalOpen(true);
    } finally {
      setIsDirectAiGenerating(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    const defaultProfile = storageService.resetProfile();
    setProfile(defaultProfile);
    if (currentView === 'admin') {
      setCurrentView('roadmap');
    }
    await loadUserData();
  };

  // Filter questions logic with dual ID and Slug progress resolution
  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory !== 'ALL' && q.categoryId !== selectedCategory)
      return false;
    if (selectedDifficulty !== 'ALL' && q.difficulty !== selectedDifficulty)
      return false;

    const isSolved = progressMap[q.id]?.status === 'SOLVED' || (q.slug && progressMap[q.slug]?.status === 'SOLVED');
    if (selectedStatus === 'SOLVED' && !isSolved) return false;
    if (selectedStatus === 'UNSOLVED' && isSolved) return false;

    if (searchQuery.trim() !== '') {
      const qText = `${q.title} ${q.content} ${q.tags?.join(' ')}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }

    return true;
  });

  const bookmarkedQuestions = questions.filter((q) => bookmarks.includes(q.id));

  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#EDEFF2] flex flex-col font-sans selection:bg-[#C9962C]/30 selection:text-[#EDEFF2]">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v as any);
          if (v !== 'workspace') setActiveQuestion(null);
        }}
        profile={profile}
        onOpenMockInterview={() => setIsGenerateModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onProfileUpdated={(updated) => setProfile(updated)}
      />

      {/* Main Body Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 md:pb-6">
        {currentView === 'workspace' && activeQuestion ? (
          <CodeEditorWorkspace
            question={activeQuestion}
            progress={progressMap[activeQuestion.id] || (activeQuestion.slug ? progressMap[activeQuestion.slug] : undefined)}
            isBookmarked={bookmarks.includes(activeQuestion.id)}
            onBack={() => setCurrentView('roadmap')}
            onSolveQuestion={handleSolveQuestion}
            onToggleBookmark={handleToggleBookmark}
            allQuestions={questions}
            onSelectQuestion={handleSelectQuestion}
            onGenerateNextWithAI={handleGenerateNextSameTopicSameDifficulty}
            isLoggedIn={isLoggedIn}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        ) : currentView === 'admin' ? (
          /* Admin Dashboard */
          <AdminDashboard
            currentProfile={profile}
            questions={questions}
            onProfileRoleChanged={(newRole) => {
              const updated = storageService.updateProfile({ role: newRole });
              setProfile(updated);
            }}
            onGenerateNewQuestion={() => setIsGenerateModalOpen(true)}
            onSelectQuestion={handleSelectQuestion}
            onSelectView={(v) => setCurrentView(v as any)}
          />
        ) : currentView === 'roadmap' ? (
          /* Roadmap View */
          <RoadmapView
            questions={questions}
            progressMap={progressMap}
            profile={profile}
            onSelectQuestion={handleSelectQuestion}
            onOpenAiAssistant={() => {
              const btn = document.querySelector('button[title*="Trợ Lý AI Tutor"], button:has(svg.animate-bounce)') as HTMLButtonElement;
              if (btn) btn.click();
            }}
          />
        ) : currentView === 'dashboard' ? (
          /* Dashboard View */
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Hero Welcome Banner - Editor Noir Style */}
            <div className="relative overflow-hidden rounded-lg bg-[#161B22] border border-white/[0.06] p-6 sm:p-8 font-mono">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0B0D11] border border-white/[0.06] text-[#C9962C] text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9962C]" />
                  <span>FE Sanjion Atelier Edition</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#EDEFF2] tracking-tight">
                  sanjion@fe ~ % ready for senior review
                </h1>
                <p className="text-[#8B94A3] text-xs sm:text-sm mt-3 leading-relaxed">
                  Chào mừng trở lại, <span className="text-[#EDEFF2] font-bold">{profile.fullName}</span>. Hệ thống ôn luyện Frontend Senior chuẩn Editor Noir.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => setCurrentView('questions')}
                    className="px-4 py-2 rounded bg-[#C9962C] hover:bg-[#C9962C]/90 text-[#0B0D11] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    Luyện Bài Sanjion
                  </button>
                  <button
                    onClick={() => setIsGenerateModalOpen(true)}
                    className="px-4 py-2 rounded bg-[#0B0D11] hover:bg-white/[0.04] text-[#EDEFF2] border border-white/[0.06] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#5B54D9]" />
                    Sinh Bài Tập Bằng AI
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Overview Stats */}
            <ProgressOverview
              questions={questions}
              progressMap={progressMap}
              streakCount={profile.streakCount}
              totalPoints={profile.totalPoints}
            />

            {/* Charts & Heatmap Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryBreakdownChart
                categories={categories}
                questions={questions}
                progressMap={progressMap}
              />
              <StreakHeatmap activityHistory={activityHistory} />
            </div>
          </div>
        ) : currentView === 'questions' ? (
          /* Questions Bank View */
          <div className="space-y-4 sm:space-y-6 animate-fadeIn font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-display font-medium text-[#EDEFF2] tracking-tight">
                  Ngân Hàng Câu Hỏi Sanjion
                </h1>
                <p className="text-xs text-[#8B94A3] mt-1">
                  Bộ câu hỏi kỹ thuật Sanjion và tự động tạo bằng AI.
                </p>
              </div>

              <button
                onClick={() => setIsGenerateModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[#5B54D9] text-[#EDEFF2] bg-[#5B54D9]/20 hover:bg-[#5B54D9]/30 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5B54D9]" />
                Sinh Câu Hỏi AI
              </button>
            </div>

            <FilterBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedDifficulty={selectedDifficulty}
              onSelectDifficulty={setSelectedDifficulty}
              selectedStatus={selectedStatus}
              onSelectStatus={setSelectedStatus}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
            />

            {filteredQuestions.length === 0 ? (
              <div className="py-12 text-center bg-[#161B22] rounded-lg border border-white/[0.06]">
                <Code2 className="w-8 h-8 text-[#8B94A3] mx-auto mb-2 opacity-60" />
                <h3 className="text-sm font-bold text-[#EDEFF2]">
                  Không tìm thấy câu hỏi phù hợp
                </h3>
                <p className="text-xs text-[#8B94A3] mt-1 max-w-md mx-auto">
                  Thử đổi từ khóa hoặc dùng tính năng Sinh Câu Hỏi Bằng AI.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {filteredQuestions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    progress={progressMap[q.id] || (q.slug ? progressMap[q.slug] : undefined)}
                    isBookmarked={bookmarks.includes(q.id)}
                    onSelect={handleSelectQuestion}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Bookmarks View */
          <div className="space-y-4 sm:space-y-6 animate-fadeIn font-mono">
            <div>
              <h1 className="text-xl font-display font-medium text-[#EDEFF2] tracking-tight">
                Câu Hỏi Sanjion Đã Lưu
              </h1>
              <p className="text-xs text-[#8B94A3] mt-1">
                Danh sách những câu hỏi quan trọng đã đánh dấu bookmark.
              </p>
            </div>

            {bookmarkedQuestions.length === 0 ? (
              <div className="py-12 text-center bg-[#161B22] rounded-lg border border-white/[0.06]">
                <Trophy className="w-8 h-8 text-[#C9962C] mx-auto mb-2" />
                <h3 className="text-sm font-bold text-[#EDEFF2]">
                  Bạn chưa lưu câu hỏi Sanjion nào
                </h3>
                <p className="text-xs text-[#8B94A3] mt-1">
                  Bấm biểu tượng bookmark trên các thẻ câu hỏi để lưu lại.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {bookmarkedQuestions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    progress={progressMap[q.id] || (q.slug ? progressMap[q.slug] : undefined)}
                    isBookmarked={true}
                    onSelect={handleSelectQuestion}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Direct AI Generation Overlay Modal */}
      {isDirectAiGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-pink-200">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 p-0.5 mx-auto animate-spin">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">Gemini AI Sanjioner</h3>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                {directAiMessage}
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-purple-600 font-bold bg-purple-50 py-1.5 px-3 rounded-full">
              <span>Đang kết nối: {aiService.getActiveModelName()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Supabase Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => loadUserData()}
      />

      {/* Generate AI Question Modal */}
      <GenerateQuestionModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        categories={categories}
        onQuestionGenerated={handleQuestionGenerated}
      />

      {/* Floating AI Tutor Assistant Widget (Accessible Anywhere 24/7) */}
      <AiTutorWidget
        activeQuestion={activeQuestion}
        onOpenApiKeyModal={() => setIsGenerateModalOpen(true)}
      />

      {/* Global Text Selection Pronunciation & Translation Toolbar */}
      <TextSelectionToolbar />
    </div>
  );
}
