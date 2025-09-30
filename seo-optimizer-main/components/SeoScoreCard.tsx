
import React from 'react';
import { ScoreDetail, Backlink } from '../types';
import { CheckCircleIcon, LinkIcon } from './icons';

interface SeoScoreCardProps {
  title: string;
  scoreData: ScoreDetail & { topBacklinks?: Backlink[] };
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
};

export const SeoScoreCard: React.FC<SeoScoreCardProps> = ({ title, scoreData }) => {
  const { score, breakdown, topBacklinks } = scoreData;
  const colorClass = getScoreColor(score);
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center text-center animate-slide-in-up shadow-lg">
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-slate-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className={colorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${colorClass}`}>
          {score}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>

      <div className="mt-4 text-left w-full border-t border-slate-700 pt-4">
        <ul className="space-y-2">
            {breakdown.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
      </div>

      {topBacklinks && topBacklinks.length > 0 && (
        <div className="mt-4 text-left w-full border-t border-slate-700 pt-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Example High-Quality Backlinks:
          </h4>
          <ul className="space-y-3">
            {topBacklinks.map((link, index) => (
                <li key={index} className="text-xs text-gray-400 bg-slate-700/50 p-2 rounded-md">
                    <p className="font-bold text-gray-300 truncate" title={link.url}>{link.url}</p>
                    <p className="mt-1">Anchor: <span className="font-semibold text-gray-200">"{link.anchorText}"</span></p>
                    <p>Est. DA: <span className="font-bold text-brand-secondary">{link.domainAuthority}</span></p>
                </li>
            ))}
        </ul>
        </div>
      )}
    </div>
  );
};