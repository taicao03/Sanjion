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

  const COLORS = ['#ec4899', '#8b5cf6', '#eab308', '#f43f5e', '#10b981'];

  return (
    <div className="bg-white/80 border border-pink-100 rounded-3xl p-6 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-purple-600" />
            Phân Phối Kỹ Năng Sanjion Theo Chủ Đề
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Biểu đồ ngang hiển thị số câu Sanjion đã hoàn thành ở từng chủ đề.
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
            <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#475569"
              fontSize={12}
              width={140}
              tickLine={false}
              axisLine={false}
              tick={{ fontWeight: '600' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#fbcfe8',
                borderRadius: '16px',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
              itemStyle={{ color: '#ec4899', fontWeight: 'bold' }}
              formatter={(val: any) => [`${val} câu đã giải`, 'Tiến độ']}
            />
            <Bar dataKey="solved" name="Đã giải" radius={[0, 8, 8, 0]} barSize={18}>
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
