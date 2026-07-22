import React from 'react';
import { Search, Filter, CheckCircle2, Circle, Sparkles, Layers, Zap, Code2, ShieldAlert } from 'lucide-react';
import { Category } from '../../types';
import { CategoryIcon } from '../shared/CategoryIcon';

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  selectedDifficulty: string;
  onSelectDifficulty: (diff: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenGenerateModal: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  onOpenGenerateModal,
}) => {
  return (
    <div className="bg-white/80 border border-pink-100/90 rounded-3xl p-4 sm:p-5 mb-6 backdrop-blur-md shadow-sm space-y-4">
      {/* Top Search & Controls Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-500" />
          <input
            type="text"
            placeholder="Tìm bài tập Sanjion, từ khóa, kỹ năng..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-rose-50/50 border border-pink-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-pink-400/70 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all font-bold"
          />
        </div>

        {/* AI Generate Button & Status Filter Options */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={onOpenGenerateModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white text-xs font-black shadow-md shadow-purple-500/20 transition-all cursor-pointer transform hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Sinh Bài Bằng AI</span>
          </button>

          {/* Status Option Tabs */}
          <div className="flex items-center gap-1 bg-rose-50/80 p-1 rounded-2xl border border-pink-100 shadow-inner">
            <button
              onClick={() => onSelectStatus('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedStatus === 'ALL'
                  ? 'bg-white text-pink-600 shadow-sm scale-[1.02]'
                  : 'text-slate-500 hover:text-pink-600'
              }`}
            >
              Tất cả
            </button>

            <button
              onClick={() => onSelectStatus('SOLVED')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedStatus === 'SOLVED'
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 scale-[1.02]'
                  : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đã làm
            </button>

            <button
              onClick={() => onSelectStatus('UNSOLVED')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedStatus === 'UNSOLVED'
                  ? 'bg-slate-800 text-white shadow-sm scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Circle className="w-3.5 h-3.5" />
              Chưa làm
            </button>
          </div>
        </div>
      </div>

      {/* Category Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-pink-100/70 pt-3">
        <button
          onClick={() => onSelectCategory('ALL')}
          className={`px-4 py-2 rounded-2xl text-xs font-black flex-shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'ALL'
              ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 text-white shadow-md shadow-pink-500/25 scale-[1.02]'
              : 'bg-white text-slate-600 hover:text-pink-600 hover:bg-rose-50 border border-pink-100/90 shadow-sm'
          }`}
        >
          🌐 Tất Cả Chủ Đề Roadmap.sh
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex-shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-purple-500/20 scale-[1.02]'
                  : 'bg-white text-slate-600 hover:text-pink-600 hover:bg-rose-50 border border-pink-100/90 shadow-sm'
              }`}
            >
              <div className="w-5 h-5 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-sm flex-shrink-0 border border-pink-100">
                <CategoryIcon slug={cat.slug} name={cat.name} className="w-4 h-4" />
              </div>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Difficulty Level Pills */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <span className="text-xs text-slate-500 font-extrabold mr-1 flex items-center gap-1 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-pink-500" />
          Độ khó:
        </span>
        {[
          { id: 'ALL', label: 'Tất cả', style: 'bg-slate-700 text-white shadow-sm' },
          { id: 'EASY', label: 'Dễ (Easy)', style: 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30' },
          { id: 'MEDIUM', label: 'Trung Bình', style: 'bg-amber-500 text-white shadow-sm shadow-amber-500/30' },
          { id: 'HARD', label: 'Khó (Senior)', style: 'bg-rose-600 text-white shadow-sm shadow-rose-500/30' },
          { id: 'EXPERT', label: 'Cực Khó', style: 'bg-purple-700 text-white shadow-sm shadow-purple-500/30' },
        ].map((item) => {
          const isSelected = selectedDifficulty === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectDifficulty(item.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                isSelected
                  ? `${item.style} scale-105`
                  : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-700 border border-pink-100 shadow-sm'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
