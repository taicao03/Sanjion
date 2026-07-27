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
    <div className="bg-[#161B22] border border-white/[0.06] rounded-lg p-4 font-mono mb-6 space-y-4">
      {/* Top Search & Controls Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Terminal Command Input Box */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B94A3]" />
          <input
            type="text"
            placeholder='grep --topic "..."'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0B0D11] border border-white/[0.06] rounded pl-10 pr-4 py-2 text-xs text-[#EDEFF2] placeholder-[#8B94A3]/60 focus:outline-none focus:border-[#C9962C]/50 transition-colors font-mono"
          />
        </div>

        {/* AI Generate Button & Status Filter Options */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={onOpenGenerateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#5B54D9] text-[#5B54D9] bg-[#5B54D9]/10 hover:bg-[#5B54D9]/20 text-xs font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5B54D9]" />
            <span>Sinh Bài Bằng AI</span>
          </button>

          {/* Status Underline Tabs */}
          <div className="flex items-center gap-1 border-b border-white/[0.06] pb-0.5">
            <button
              onClick={() => onSelectStatus('ALL')}
              className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                selectedStatus === 'ALL'
                  ? 'text-[#EDEFF2] border-b-2 border-[#C9962C]'
                  : 'text-[#8B94A3] hover:text-[#EDEFF2]'
              }`}
            >
              Tất cả
            </button>

            <button
              onClick={() => onSelectStatus('SOLVED')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                selectedStatus === 'SOLVED'
                  ? 'text-[#2FAE79] border-b-2 border-[#2FAE79]'
                  : 'text-[#8B94A3] hover:text-[#2FAE79]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đã làm
            </button>

            <button
              onClick={() => onSelectStatus('UNSOLVED')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                selectedStatus === 'UNSOLVED'
                  ? 'text-[#EDEFF2] border-b-2 border-white/40'
                  : 'text-[#8B94A3] hover:text-[#EDEFF2]'
              }`}
            >
              <Circle className="w-3.5 h-3.5" />
              Chưa làm
            </button>
          </div>
        </div>
      </div>

      {/* Category Selection Tag Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-white/[0.04] pt-3">
        <button
          onClick={() => onSelectCategory('ALL')}
          className={`px-3 py-1 rounded text-xs font-bold flex-shrink-0 transition-colors cursor-pointer border ${
            selectedCategory === 'ALL'
              ? 'bg-[#C9962C]/20 border-[#C9962C] text-[#C9962C]'
              : 'bg-[#0B0D11] border-white/[0.06] text-[#8B94A3] hover:text-[#EDEFF2]'
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
                  ? 'bg-[#5B54D9]/20 border-[#5B54D9] text-[#EDEFF2]'
                  : 'bg-[#0B0D11] border-white/[0.06] text-[#8B94A3] hover:text-[#EDEFF2]'
              }`}
            >
              <CategoryIcon slug={cat.slug} name={cat.name} className="w-3.5 h-3.5 text-[#8B94A3]" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Difficulty Level Pills */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <span className="text-xs text-[#8B94A3] font-bold mr-1 flex items-center gap-1 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-[#C9962C]" />
          Độ khó:
        </span>
        {[
          { id: 'ALL', label: 'Tất cả', active: 'border-[#EDEFF2] text-[#EDEFF2] bg-white/[0.05]' },
          { id: 'EASY', label: 'Dễ (Easy)', active: 'border-[#2FAE79] text-[#2FAE79] bg-[#2FAE79]/10' },
          { id: 'MEDIUM', label: 'Trung Bình', active: 'border-[#C9962C] text-[#C9962C] bg-[#C9962C]/10' },
          { id: 'HARD', label: 'Khó (Senior)', active: 'border-[#C1553B] text-[#C1553B] bg-[#C1553B]/10' },
          { id: 'EXPERT', label: 'Cực Khó (System)', active: 'border-[#5B54D9] text-[#5B54D9] bg-[#5B54D9]/10' },
        ].map((item) => {
          const isSelected = selectedDifficulty === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectDifficulty(item.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer border ${
                isSelected
                  ? item.active
                  : 'border-white/[0.06] text-[#8B94A3] bg-[#0B0D11] hover:text-[#EDEFF2]'
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
