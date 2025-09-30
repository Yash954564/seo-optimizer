
import React from 'react';
import { ContentSuggestion } from '../types';
import { LightbulbIcon } from './icons';

interface ContentSuggestionsProps {
  suggestions: ContentSuggestion[];
}

export const ContentSuggestions: React.FC<ContentSuggestionsProps> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-slide-in-up shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">AI-Generated Content Briefs</h3>
      <div className="space-y-6">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
            <div className="flex items-start gap-3">
              <LightbulbIcon className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-400">For keyword: <span className="font-bold text-brand-accent">{suggestion.keyword}</span></p>
                <h4 className="font-semibold text-lg text-white mt-1">{suggestion.suggestionTitle}</h4>
                <p className="text-gray-300 mt-1">{suggestion.description}</p>
                
                <div className="mt-3 border-t border-slate-600 pt-3">
                  <h5 className="text-sm font-semibold text-gray-300">Target Audience:</h5>
                  <p className="text-sm text-gray-400">{suggestion.targetAudience}</p>
                </div>
                
                <div className="mt-3">
                  <h5 className="text-sm font-semibold text-gray-300">Suggested Headings:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-400 mt-1 space-y-1">
                      {suggestion.suggestedHeadings.map((heading, i) => <li key={i}>{heading}</li>)}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};