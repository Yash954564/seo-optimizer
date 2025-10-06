import React from 'react';
import { KeywordSuggestion } from '../types';
import { TagIcon } from './icons';

interface KeywordSuggestionsProps {
  suggestions: KeywordSuggestion[];
  isReportLocked: boolean;
}

const typeColorMap: { [key in KeywordSuggestion['type']]: string } = {
    'Long-Tail': 'bg-sky-100 text-sky-800 border-sky-200',
    'Informational': 'bg-blue-100 text-blue-800 border-blue-200',
    'Transactional': 'bg-green-100 text-green-800 border-green-200',
    'Navigational': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Local': 'bg-amber-100 text-amber-800 border-amber-200',
};

export const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({ suggestions, isReportLocked }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 animate-slide-in-up shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <TagIcon className="w-6 h-6 text-brand-primary" />
        <h3 className="text-xl font-bold text-text-primary">Strategic <span className="text-brand-primary">Keyword Suggestions</span></h3>
      </div>
      <div className="space-y-6">
        {suggestions.map((suggestion, index) => {
          return (
            <div 
              key={index} 
              className={`bg-slate-50 p-4 rounded-lg border border-slate-200 transition-all duration-300 ${isReportLocked && index > 0 ? 'blur-lg grayscale opacity-60 pointer-events-none select-none' : ''}`}
            >
              <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg text-text-primary">{suggestion.keyword}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${typeColorMap[suggestion.type] || 'bg-slate-200 text-slate-800 border-slate-300'}`}>
                      {suggestion.type}
                  </span>
              </div>
              <p className="text-sm text-text-secondary mt-2 italic">"{suggestion.relevance}"</p>

              <div className="mt-3 border-t border-slate-200 pt-3">
                  <h5 className="text-sm font-semibold text-text-primary">Optimization Tips:</h5>
                  <p className="text-sm text-text-secondary mt-1">{suggestion.optimizationTips}</p>
              </div>
               <div className="mt-3">
                  <h5 className="text-sm font-semibold text-text-primary">Implementation Example:</h5>
                  <p className="text-sm text-slate-800 bg-slate-100 p-2 rounded-md mt-1 font-mono border border-slate-200">
                      {suggestion.implementationExample}
                  </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};