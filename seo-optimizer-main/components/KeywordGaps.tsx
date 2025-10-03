
import React from 'react';
import { PuzzlePieceIcon } from './icons';

interface KeywordGapsProps {
  gaps: string[];
  isLocked: boolean;
}

export const KeywordGaps: React.FC<KeywordGapsProps> = ({ gaps, isLocked }) => {
  if (!gaps || gaps.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-slide-in-up shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <PuzzlePieceIcon className="w-6 h-6 text-brand-primary" />
        <h3 className="text-xl font-bold text-white">Keyword Gap Opportunities</h3>
      </div>
      <p className="text-sm text-gray-400 mb-4">These are keywords your competitors are ranking for that you aren't. Consider creating content targeting these terms.</p>
      <div className="flex flex-wrap gap-2">
        {gaps.map((gap, index) => {
          const isBlurred = isLocked && index > 0;
          return (
            <span 
              key={index} 
              className={`bg-slate-700 text-brand-accent text-sm font-medium px-3 py-1 rounded-full transition-all duration-300 ${isBlurred ? 'blur-sm pointer-events-none select-none text-transparent' : ''}`}
              aria-hidden={isBlurred}
            >
              {gap}
            </span>
          );
        })}
      </div>
    </div>
  );
};