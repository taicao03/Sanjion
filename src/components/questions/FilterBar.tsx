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
    <div className="bg-[#181F2A] border border-slate-700/60 rounded-lg p-4 font-mono mb-6 space-y-4 shadow-md">
      {/* Top Search & Controls Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Terminal Command Input Box */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder='grep --topic "..."'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0F141C] border border-slate-700/60 rounded pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C9962C] transition-colors font-mono font-bold"
          />
        </div>

        {/* AI Generate Button & Status Filter Options */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={onOpenGenerateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#5B54D9] text-[#5B54D9] bg-[#5B54D9]/20 hover:bg-[#5B54D9]/30 text-xs font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5B54D9]" />
            <span>Sinh Bài Bằng AI</span>
          </button>

          {/* Status Underline Tabs */}
          <div className="flex items-center gap-1 border-b border-slate-700/60 pb-0.5">
            <button
              onClick={() => onSelectStatus('ALL')}
              className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                selectedStatus === 'ALL'
                  ? 'text-white border-b-2 border-[#C9962C]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Tất cả
            </button>

            <button
              onClick={() => onSelectStatus('SOLVED')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                selectedStatus === 'SOLVED'
                  ? 'text-[#2FAE79] border-b-2 border-[#2FAE79]'
                  : 'text-slate-300 hover:text-[#2FAE79]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đã làm
            </button>

            <button
              onClick={() => onSelectStatus('UNSOLVED')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                selectedStatus === 'UNSOLVED'
                  ? 'text-white border-b-2 border-white/60'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Circle className="w-3.5 h-3.5" />
              Chưa làm
            </button>
          </div>
        </div>
      </div>

      {/* Category Selection Tag Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-700/50 pt-3">
        <button
          onClick={() => onSelectCategory('ALL')}
          className={`px-3 py-1 rounded text-xs font-bold flex-shrink-0 transition-colors cursor-pointer border ${
            selectedCategory === 'ALL'
              ? 'bg-[#C9962C]/20 border-[#C9962C] text-[#C9962C]'
              : 'bg-[#0F141C] border-slate-700/60 text-slate-200 hover:text-white'
          }`}
        >
          🌐 Tất Cả Chủ Đề
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-2.5 py-1 rounded text-xs font-bold flex-shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-[#5B54D9]/30 border-[#5B54D9] text-white'
                  : 'bg-[#0F141C] border-slate-700/60 text-slate-200 hover:text-white'
              }`}
            >
              <CategoryIcon slug={cat.slug} name={cat.name} className="w-3.5 h-3.5 text-slate-300" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Difficulty Level Pills */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <span className="text-xs text-slate-200 font-bold mr-1 flex items-center gap-1 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-[#C9962C]" />
          Độ khó:
        </span>
        {[
          { id: 'ALL', label: 'Tất cả', active: 'border-white text-white bg-white/10' },
          { id: 'EASY', label: 'Dễ (Easy)', active: 'border-[#2FAE79] text-[#2FAE79] bg-[#2FAE79]/20' },
          { id: 'MEDIUM', label: 'Trung Bình', active: 'border-[#C9962C] text-[#C9962C] bg-[#C9962C]/20' },
          { id: 'HARD', label: 'Khó (Senior)', active: 'border-[#C1553B] text-[#C1553B] bg-[#C1553B]/20' },
          { id: 'EXPERT', label: 'Cực Khó (System)', active: 'border-[#5B54D9] text-[#5B54D9] bg-[#5B54D9]/20' },
        ].map((item) => {
          const isSelected = selectedDifficulty === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectDifficulty(item.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer border ${
                isSelected
                  ? item.active
                  : 'border-slate-700/60 text-slate-300 bg-[#0F141C] hover:text-white'
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
