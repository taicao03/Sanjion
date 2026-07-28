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
      activeBg: 'bg-[#C9962C]/20 text-white border border-[#C9962C]',
      shadow: 'shadow-purple-500/20',
    },
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
        <div className="bg-[#181F2A] border border-slate-700/60 rounded-2xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto animate-scaleUp flex flex-col text-white font-mono">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700/50 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center pb-2 flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-[#5B54D9]/20 border border-[#5B54D9]/50 flex items-center justify-center text-[#5B54D9] mx-auto mb-2">
              <Wand2 className="w-6 h-6 text-[#5B54D9]" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Thiết Kế Câu Hỏi Sanjion Bằng AI</h3>
            
            {/* Dynamic AI Model Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0F141C] border border-[#5B54D9]/40 text-slate-200 text-[11px] font-bold my-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5B54D9] animate-pulse" />
              <span>Đang vận hành: {activeModel}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#C1553B]/20 border border-[#C1553B]/50 text-[#C1553B] text-xs font-bold my-2 flex-shrink-0">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4 my-2 overflow-y-visible pr-1 flex-1">
            {/* ✨ HIGH-END CUSTOM DROPDOWN COMPONENT (NO MORE NATIVE OS SELECT) ✨ */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider">
                1. Chọn Chủ Đề Sanjion (Roadmap.sh):
              </label>

              {/* Custom Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full text-left bg-[#0F141C] hover:bg-slate-800/80 border border-slate-700/60 rounded-lg px-4 py-3 text-xs text-white font-bold focus:outline-none focus:border-[#C9962C] transition-all cursor-pointer shadow-sm flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-[#181F2A] p-1 flex items-center justify-center font-bold flex-shrink-0 border border-slate-700/60">
                    <CategoryIcon slug={selectedCategoryObj?.slug} name={selectedCategoryObj?.name} className="w-5 h-5 text-[#C9962C]" />
                  </div>
                  <div className="truncate">
                    <span className="text-white font-bold text-xs block truncate">{selectedCategoryObj?.name}</span>
                    <span className="text-slate-300 text-[10px] block truncate">{selectedCategoryObj?.description}</span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-300 flex-shrink-0 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Floating Custom Popup Menu */}
              {isCategoryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsCategoryDropdownOpen(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-[#0F141C] border border-slate-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto p-1.5 space-y-1 animate-fadeIn scrollbar-thin">
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
                          className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-[#5B54D9]/20 border border-[#5B54D9]/40 text-white font-bold'
                              : 'hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 truncate">
                            <div className="w-8 h-8 rounded-lg bg-[#181F2A] p-1 flex items-center justify-center font-bold flex-shrink-0 border border-slate-700/60">
                              <CategoryIcon slug={cat.slug} name={cat.name} className="w-5 h-5 text-[#C9962C]" />
                            </div>
                            <div className="truncate">
                              <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-white'}`}>
                                {cat.name}
                              </div>
                              <div className={`text-[10px] font-medium truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                                {cat.description}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#2FAE79] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Custom Interactive Grid Selector for Difficulty */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider">
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
                      className={`py-2.5 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
              <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider">
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
                      className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#5B54D9]/20 border-[#5B54D9] text-white'
                          : 'bg-[#0F141C] border-slate-700/60 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#C9962C]' : 'text-slate-400'}`} />
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
