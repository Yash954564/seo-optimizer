import React from 'react';
import { ScoreDetail, Backlink } from '../types';
import { CheckCircleIcon, LinkIcon } from './icons';

interface SeoScoreCardProps {
  title: string;
  scoreData: ScoreDetail & { topBacklinks?: Backlink[] };
}

const getScoreStyles = (score: number) => {
  if (score >= 80) return {
    colorClass: 'text-green-500',
    shadowClass: 'hover:shadow-glow-green',
    borderClass: 'hover:border-green-300',
    progressFilter: `url(#filter-green)`
  };
  if (score >= 50) return {
    colorClass: 'text-yellow-500',
    shadowClass: 'hover:shadow-glow-yellow',
    borderClass: 'hover:border-yellow-300',
    progressFilter: `url(#filter-yellow)`
  };
  return {
    colorClass: 'text-red-500',
    shadowClass: 'hover:shadow-glow-red',
    borderClass: 'hover:border-red-300',
    progressFilter: `url(#filter-red)`
  };
};

export const SeoScoreCard: React.FC<SeoScoreCardProps> = ({ title, scoreData }) => {
  const { score, breakdown, topBacklinks } = scoreData;
  const { colorClass, shadowClass, borderClass, progressFilter } = getScoreStyles(score);
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`bg-white p-6 rounded-xl border border-slate-200 flex flex-col items-center text-center animate-slide-in-up shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${shadowClass} ${borderClass}`}>
       <div className="relative w-32 h-32 flex-shrink-0">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <filter id="filter-green">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#34d399" />
            </filter>
            <filter id="filter-yellow">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#fbbf24" />
            </filter>
            <filter id="filter-red">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f87171" />
            </filter>
          </defs>
          <circle
            className="text-slate-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
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
            style={{ transition: 'stroke-dashoffset 1s ease-out', filter: progressFilter }}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-4xl font-bold ${colorClass}`}>
          {score}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-text-primary">{title}</h3>

      <div className="mt-4 text-left w-full border-t border-slate-200 pt-4">
        <ul className="space-y-2">
            {breakdown.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
      </div>

      {topBacklinks && topBacklinks.length > 0 && (
        <div className="mt-4 text-left w-full border-t border-slate-200 pt-4">
          <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Example High-Quality Backlinks:
          </h4>
          <ul className="space-y-3">
            {topBacklinks.map((link, index) => (
                <li key={index} className="text-xs text-text-secondary bg-slate-50 p-2 rounded-md border border-slate-200">
                    <p className="font-bold text-text-primary truncate" title={link.url}>{link.url}</p>
                    <p className="mt-1">Anchor: <span className="font-semibold text-text-primary">"{link.anchorText}"</span></p>
                    <p>Est. DA: <span className="font-bold text-brand-secondary">{link.domainAuthority}</span></p>
                </li>
            ))}
        </ul>
        </div>
      )}
    </div>
  );
};