import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Category, Question, UserProgress } from '../../types';
import { LayoutGrid } from 'lucide-react';

interface CategoryBreakdownChartProps {
  categories: Category[];
  questions: Question[];
  progressMap: Record<string, UserProgress>;
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  categories,
  questions,
  progressMap,
}) => {
  const chartData = categories.map((cat) => {
    const catQuestions = questions.filter(
      (q) => q.categoryId === cat.id || q.categoryId === cat.slug || q.tags?.includes(cat.name)
    );
    const solved = catQuestions.filter(
      (q) => progressMap[q.id]?.status === 'SOLVED' || (q.slug && progressMap[q.slug]?.status === 'SOLVED')
    ).length;
    return {
      name: cat.name,
      total: catQuestions.length,
      solved: solved,
    };
  });

  const COLORS = ['#2FAE79', '#C9962C', '#5B54D9', '#C1553B', '#EDEFF2'];

  return (
    <div className="bg-[#161B22] border border-white/[0.06] rounded-lg p-5 font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#EDEFF2] flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-[#5B54D9]" />
            Phân Phối Kỹ Năng Sanjion Theo Chủ Đề
          </h3>
          <p className="text-xs text-[#8B94A3] mt-0.5">
            Số lượng câu đã giải ở mỗi danh mục kỹ thuật.
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis type="number" stroke="#8B94A3" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#EDEFF2"
              fontSize={11}
              width={140}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161B22',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#EDEFF2',
                fontFamily: 'JetBrains Mono',
              }}
              itemStyle={{ color: '#2FAE79', fontWeight: 'bold' }}
              formatter={(val: any) => [`${val} câu đã giải`, 'Tiến độ']}
            />
            <Bar dataKey="solved" name="Đã giải" radius={[0, 4, 4, 0]} barSize={16}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
