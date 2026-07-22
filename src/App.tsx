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

import { Navbar } from './components/layout/Navbar';
import { QuestionCard } from './components/questions/QuestionCard';
import { FilterBar } from './components/questions/FilterBar';
import { CodeEditorWorkspace } from './components/questions/CodeEditorWorkspace';
import { GenerateQuestionModal } from './components/questions/GenerateQuestionModal';
import { ProgressOverview } from './components/dashboard/ProgressOverview';
import { CategoryBreakdownChart } from './components/dashboard/CategoryBreakdownChart';
import { StreakHeatmap } from './components/dashboard/StreakHeatmap';
import { AuthModal } from './components/auth/AuthModal';

export function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'questions' | 'workspace' | 'bookmarks'>('dashboard');
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
  }, []);

  const loadInitialData = async () => {
    const cats = await apiService.getCategories();
    const qs = await apiService.getQuestions();
    setCategories(cats);
    setQuestions(qs);
    await loadUserData();
  };

  const loadUserData = async () => {
    const storedUser = await authService.getSessionUser();
    if (storedUser) {
      setIsLoggedIn(true);
    }
    const prof = storageService.getProfile();
    setProfile(prof);
    setProgressMap(storageService.getAllProgress());
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
    setProgressMap(storageService.getAllProgress());
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50/50 to-amber-50/50 text-slate-800 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
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
            onBack={() => setCurrentView('questions')}
            onSolveQuestion={handleSolveQuestion}
            onToggleBookmark={handleToggleBookmark}
            allQuestions={questions}
            onSelectQuestion={handleSelectQuestion}
            onGenerateNextWithAI={handleGenerateNextSameTopicSameDifficulty}
          />
        ) : currentView === 'dashboard' ? (
          /* Dashboard View */
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Hero Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 p-5 sm:p-8 shadow-xl text-white">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] sm:text-xs font-extrabold mb-3 sm:mb-4 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Sanjion đánh bay mọi thứ
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Chào mừng trở lại, {profile.fullName}! 👋
                </h1>
                <p className="text-pink-100 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed font-medium">
                  Rèn luyện kiến thức Sanjion chọn lọc từ Google, Meta, VNG &
                  Shopee. Hoặc sử dụng AI Model <span className="font-bold underline text-amber-300">{aiService.getActiveModelName()}</span> để tự động tạo bài tập Sanjion mới không giới hạn!
                </p>
                <div className="mt-5 sm:mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                  <button
                    onClick={() => setCurrentView('questions')}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-pink-700 font-black text-xs sm:text-sm shadow-lg shadow-pink-900/10 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-pink-600" />
                    Luyện Bài Sanjion
                  </button>
                  <button
                    onClick={() => setIsGenerateModalOpen(true)}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-slate-900/40 hover:bg-slate-900/60 text-amber-300 border border-amber-300/40 font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    ✨ Sinh Bài Tập Bằng AI
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
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  Ngân Hàng Câu Hỏi Sanjion
                </h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Tổng hợp các câu hỏi chọn lọc hoặc tự tạo không giới hạn bằng
                  AI.
                </p>
              </div>

              <button
                onClick={() => setIsGenerateModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />✨
                Sinh Câu Hỏi Bằng AI
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
              <div className="py-12 sm:py-16 text-center bg-white/80 rounded-3xl border border-pink-100 shadow-sm">
                <Code2 className="w-10 h-10 text-pink-400 mx-auto mb-3 opacity-60" />
                <h3 className="text-base font-bold text-slate-700">
                  Không tìm thấy câu hỏi phù hợp
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Thử thay đổi bộ lọc hoặc sử dụng nút "Sinh Câu Hỏi Bằng AI" để AI tự
                  động thiết kế câu hỏi mới cho bạn!
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
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Câu Hỏi Sanjion Đã Lưu
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Danh sách những câu hỏi quan trọng cần xem lại trước kỳ Sanjion.
              </p>
            </div>

            {bookmarkedQuestions.length === 0 ? (
              <div className="py-12 sm:py-16 text-center bg-white/80 rounded-3xl border border-pink-100 shadow-sm">
                <Trophy className="w-9 h-9 text-amber-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">
                  Bạn chưa lưu câu hỏi Sanjion nào
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Bấm nút biểu tượng bookmark trên các câu hỏi để đưa vào danh
                  sách xem lại tại đây.
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
    </div>
  );
}
