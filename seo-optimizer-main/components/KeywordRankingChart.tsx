import React from 'react';
import { KeywordData } from '../types';
import { ChartBarIcon } from './icons';

interface KeywordRankingChartProps {
  keywords: KeywordData[];
  isReportLocked: boolean;
}

// A simple color palette for charts
const colors = [
  '#38bdf8', // sky-400 from tailwind
  '#fbbf24', // amber-400
  '#4ade80', // green-400
  '#f472b6', // pink-400
  '#818cf8', // indigo-400
  '#fb923c', // orange-400
  '#a78bfa', // violet-400
];

// A small component to render a sparkline for ranking history
const RankingSparkline: React.FC<{ history: number[]; color: string }> = ({ history, color }) => {
  if (!history || history.length < 2) {
    return <div className="text-sm text-text-secondary text-center flex-1">Not enough data for chart.</div>;
  }

  const width = 150;
  const height = 40;
  const padding = 2;

  // In SEO, a lower rank number is better.
  const ranks = history.map(r => r <= 0 ? 1 : r); // Treat 0 or negative rank as 1
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  
  // Handle case where all ranks are the same to avoid division by zero.
  const rankRange = maxRank - minRank === 0 ? 1 : maxRank - minRank;

  const points = ranks.map((rank, i) => {
    const x = (i / (ranks.length - 1)) * (width - padding * 2) + padding;
    // Lower rank (better) should be higher on the chart (lower y value)
    const y = padding + ((rank - minRank) / rankRange) * (height - padding * 2);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
  
  const currentRank = history.length > 0 ? history[history.length - 1] : '-';
  const bestRank = history.length > 0 ? Math.min(...history) : '-';

  return (
    <div className="flex items-center justify-end gap-4 flex-1">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-36 h-10" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
      <div className="text-right">
        <p className="text-xs text-text-secondary">Current / Best</p>
        <p className="font-bold text-lg text-text-primary">#{currentRank} / <span className="text-green-500">#{bestRank}</span></p>
      </div>
    </div>
  );
};

export const KeywordRankingChart: React.FC<KeywordRankingChartProps> = ({ keywords, isReportLocked }) => {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 animate-slide-in-up shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <ChartBarIcon className="w-6 h-6 text-brand-primary" />
        <h3 className="text-xl font-bold text-text-primary">Keyword <span className="text-brand-primary">Ranking History</span></h3>
        <span className="text-sm text-text-secondary">(Last 6 Weeks)</span>
      </div>
      <div className="space-y-4">
        {keywords.map((keyword, index) => {
          return (
             <div 
              key={keyword.keyword} 
              className={`bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all duration-300 ${isReportLocked && index > 0 ? 'blur-lg grayscale opacity-60 pointer-events-none select-none' : ''}`}
            >
              <h4 className="font-semibold text-lg text-text-primary">
                {keyword.keyword}
              </h4>
              <RankingSparkline history={keyword.rankingHistory} color={colors[index % colors.length]} />
            </div>
          );
        })}
      </div>
    </div>
  );
};