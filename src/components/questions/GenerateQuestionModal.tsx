import React, { useState } from 'react';
import { X, Sparkles, Wand2, AlertCircle, RefreshCw, Check, Code2, HelpCircle, FileText, ChevronDown } from 'lucide-react';
import { Category, DifficultyLevel, QuestionType, Question } from '../../types';
import { aiService } from '../../services/aiService';
import { ApiKeyModal } from '../shared/ApiKeyModal';
import { CategoryIcon } from '../shared/CategoryIcon';

interface GenerateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onQuestionGenerated: (newQuestion: Question) => void;
}

export const GenerateQuestionModal: React.FC<GenerateQuestionModalProps> = ({
  isOpen,
  onClose,
  categories,
  onQuestionGenerated,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || 'cat-html-css');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [type, setType] = useState<QuestionType>('CODING_PRACTICE');
  const [topicHint, setTopicHint] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  // ✨ CUSTOM DROPDOWN STATE (REPLACES NATIVE OS SELECT) ✨
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeModel = aiService.getActiveModelName();
  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiKey = aiService.getStoredApiKey();

    if (!apiKey) {
      setIsKeyModalOpen(true);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const categoryObj = categories.find((c) => c.id === selectedCategoryId) || categories[0];

    try {
      const generatedQuestion = await aiService.generateQuestionWithAI(
        selectedCategoryId,
        categoryObj?.name || 'JavaScript Core',
        difficulty,
        type,
        topicHint,
        apiKey
      );

      onQuestionGenerated(generatedQuestion);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || `Lỗi khi gọi AI Model [${activeModel}] để tạo câu hỏi.`);
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyDetails: Record<DifficultyLevel, { label: string; bg: string; text: string; activeBg: string; shadow: string }> = {
    EASY: {
      label: 'Dễ (Easy)',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
      text: 'text-emerald-600',
      activeBg: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/30 scale-[1.02]',
      shadow: 'shadow-emerald-500/20',
    },
    MEDIUM: {
      label: 'Trung Bình',
      bg: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
      text: 'text-amber-600',
      activeBg: 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30 scale-[1.02]',
      shadow: 'shadow-amber-500/20',
    },
    HARD: {
      label: 'Khó (Senior)',
      bg: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
      text: 'text-rose-600',
      activeBg: 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/30 scale-[1.02]',
      shadow: 'shadow-rose-500/20',
    },
    EXPERT: {
      label: 'Cực Khó',
      bg: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
      text: 'text-purple-600',
      activeBg: 'bg-purple-700 text-white border-purple-700 shadow-md shadow-purple-500/30 scale-[1.02]',
      shadow: 'shadow-purple-500/20',
    },
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
        <div className="bg-white border border-pink-200/80 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative overflow-visible max-h-[92vh] flex flex-col">
          {/* Top Decorative Glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-tr from-pink-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-pink-600 rounded-2xl hover:bg-rose-50 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center pb-2 flex-shrink-0">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-500/20 mb-2.5">
              <Wand2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Thiết Kế Câu Hỏi Sanjion Bằng AI</h3>
            
            {/* Dynamic AI Model Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-extrabold my-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
              <span>Đang vận hành: {activeModel}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold my-2 flex-shrink-0">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4 my-2 overflow-y-visible pr-1 flex-1">
            {/* ✨ HIGH-END CUSTOM DROPDOWN COMPONENT (NO MORE NATIVE OS SELECT) ✨ */}
            <div className="relative">
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                1. Chọn Chủ Đề Sanjion (Roadmap.sh):
              </label>

              {/* Custom Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full text-left bg-gradient-to-r from-rose-50/80 via-purple-50/60 to-amber-50/50 hover:from-rose-100 hover:to-purple-100 border border-pink-300/80 rounded-2xl px-4 py-3 text-xs text-slate-800 font-extrabold focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all cursor-pointer shadow-sm flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center font-bold flex-shrink-0 shadow-sm border border-pink-100">
                    <CategoryIcon slug={selectedCategoryObj?.slug} name={selectedCategoryObj?.name} className="w-6 h-6" />
                  </div>
                  <div className="truncate">
                    <span className="text-slate-800 font-black text-xs block truncate">{selectedCategoryObj?.name}</span>
                    <span className="text-slate-500 font-medium text-[10px] block truncate">{selectedCategoryObj?.description}</span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-purple-600 flex-shrink-0 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Floating Custom Popup Menu */}
              {isCategoryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsCategoryDropdownOpen(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white/95 backdrop-blur-xl border border-pink-200/90 rounded-3xl p-2 shadow-2xl space-y-1 max-h-64 overflow-y-auto scrollbar-thin animate-fadeIn">
                    {categories.map((cat) => {
                      const isSelected = selectedCategoryId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategoryId(cat.id);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white shadow-md shadow-purple-500/20'
                              : 'hover:bg-rose-50/80 text-slate-700 hover:translate-x-0.5'
                          }`}
                        >
                          <div className="flex items-center gap-3 truncate">
                            <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center font-bold flex-shrink-0 shadow-sm border border-pink-100">
                              <CategoryIcon slug={cat.slug} name={cat.name} className="w-6 h-6" />
                            </div>
                            <div className="truncate">
                              <div className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                {cat.name}
                              </div>
                              <div className={`text-[10px] font-medium truncate ${isSelected ? 'text-pink-100' : 'text-slate-500'}`}>
                                {cat.description}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-white flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Custom Interactive Grid Selector for Difficulty */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                2. Cấp Độ Độ Khó:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as DifficultyLevel[]).map((diff) => {
                  const details = difficultyDetails[diff];
                  const isSelected = difficulty === diff;
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`py-2.5 px-2 rounded-2xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected ? details.activeBg : details.bg
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                      <span>{details.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Interactive Cards for Question Type */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                3. Dạng Bài Tập Sanjion:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CODING_PRACTICE', label: 'Coding Practical', icon: Code2, desc: 'Tự gõ code & chấm test' },
                  { id: 'MULTIPLE_CHOICE', label: 'Trắc Nghiệm', icon: HelpCircle, desc: 'Chọn đáp án đúng' },
                  { id: 'THEORY', label: 'Lý Thuyết Senior', icon: FileText, desc: 'Phân tích & tự luận' },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSelected = type === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id as QuestionType)}
                      className={`p-2.5 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-purple-600 shadow-md shadow-purple-500/25 scale-[1.02]'
                          : 'bg-white hover:bg-rose-50/60 border-pink-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-purple-600'}`} />
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div>
                        <div className="text-[11px] font-black leading-tight">{t.label}</div>
                        <div className={`text-[9px] mt-0.5 font-medium ${isSelected ? 'text-pink-100' : 'text-slate-400'}`}>
                          {t.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Topic Hint Input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                4. Từ Khóa / Chủ Đề Muốn AI Tập Trung (Tùy Chọn):
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Custom Hook useLocalStorage, Event Loop Microtask..."
                value={topicHint}
                onChange={(e) => setTopicHint(e.target.value)}
                className="w-full bg-rose-50/40 border border-pink-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4 transform hover:scale-[1.01]"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />}
              {isLoading ? `Model ${activeModel} đang sáng tạo câu hỏi...` : `✨ Sinh Câu Hỏi Bằng ${activeModel}`}
            </button>
          </form>
        </div>
      </div>

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSaved={() => {}}
      />
    </>
  );
};
