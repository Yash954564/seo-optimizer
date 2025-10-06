import React from 'react';
import { PuzzlePieceIcon } from './icons';

interface KeywordGapsProps {
  gaps: string[];
  isReportLocked: boolean;
}

export const KeywordGaps: React.FC<KeywordGapsProps> = ({ gaps, isReportLocked }) => {
  if (!gaps || gaps.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 animate-slide-in-up shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <PuzzlePieceIcon className="w-6 h-6 text-brand-primary" />
        <h3 className="text-xl font-bold text-text-primary">Keyword <span className="text-brand-primary">Gap Opportunities</span></h3>
      </div>
      <p className="text-sm text-text-secondary mb-4">These are keywords your competitors are ranking for that you aren't. Consider creating content targeting these terms.</p>
      <div className="flex flex-wrap gap-2">
        {gaps.map((gap, index) => {
          return (
            <span 
              key={index} 
              className={`bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full border border-red-200 transition-all duration-300 ${isReportLocked && index > 0 ? 'blur-md grayscale opacity-60 pointer-events-none select-none' : ''}`}
            >
              {gap}
            </span>
          );
        })}
      </div>
    </div>
  );
};