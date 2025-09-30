import React from 'react';
import { KeywordSuggestion } from '../types';
import { TagIcon } from './icons';

interface KeywordSuggestionsProps {
  suggestions: KeywordSuggestion[];
}

const typeColorMap: { [key in KeywordSuggestion['type']]: string } = {
    'Long-Tail': 'bg-sky-500/20 text-sky-300',
    'Informational': 'bg-blue-500/20 text-blue-300',
    'Transactional': 'bg-green-500/20 text-green-300',
    'Navigational': 'bg-indigo-500/20 text-indigo-300',
    'Local': 'bg-amber-500/20 text-amber-300',
};

export const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-slide-in-up shadow-lg lg:col-span-1">
      <div className="flex items-center gap-3 mb-4">
        <TagIcon className="w-6 h-6 text-brand-primary" />
        <h3 className="text-xl font-bold text-white">Strategic Keyword Suggestions</h3>
      </div>
      <div className="space-y-6">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg text-white">{suggestion.keyword}</h4>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${typeColorMap[suggestion.type] || 'bg-gray-500/20 text-gray-300'}`}>
                    {suggestion.type}
                </span>
            </div>
            <p className="text-sm text-gray-400 mt-2 italic">"{suggestion.relevance}"</p>

            <div className="mt-3 border-t border-slate-600 pt-3">
                <h5 className="text-sm font-semibold text-gray-300">Optimization Tips:</h5>
                <p className="text-sm text-gray-400 mt-1">{suggestion.optimizationTips}</p>
            </div>
             <div className="mt-3">
                <h5 className="text-sm font-semibold text-gray-300">Implementation Example:</h5>
                <p className="text-sm text-gray-400 bg-slate-800 p-2 rounded-md mt-1 font-mono">
                    {suggestion.implementationExample}
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
