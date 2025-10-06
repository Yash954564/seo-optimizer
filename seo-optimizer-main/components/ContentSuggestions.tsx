import React from 'react';
import { ContentSuggestion } from '../types';
import { LightbulbIcon } from './icons';

interface ContentSuggestionsProps {
  suggestions: ContentSuggestion[];
  isReportLocked: boolean;
}

export const ContentSuggestions: React.FC<ContentSuggestionsProps> = ({ suggestions, isReportLocked }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 animate-slide-in-up shadow-lg lg:col-span-1">
      <h3 className="text-xl font-bold text-text-primary mb-4">AI-Generated <span className="text-brand-primary">Content Briefs</span></h3>
      <div className="space-y-6">
        {suggestions.map((suggestion, index) => {
          return (
            <div 
              key={index} 
              className={`bg-slate-50 p-4 rounded-lg border border-slate-200 transition-all duration-300 ${isReportLocked && index > 0 ? 'blur-lg grayscale opacity-60 pointer-events-none select-none' : ''}`}
            >
              <div className="flex items-start gap-3">
                <LightbulbIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-text-secondary">For keyword: <span className="font-bold text-brand-secondary">{suggestion.keyword}</span></p>
                  <h4 className="font-semibold text-lg text-text-primary mt-1">{suggestion.suggestionTitle}</h4>
                  <p className="text-text-secondary mt-1">{suggestion.description}</p>
                  
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <h5 className="text-sm font-semibold text-text-primary">Target Audience:</h5>
                    <p className="text-sm text-text-secondary">{suggestion.targetAudience}</p>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="text-sm font-semibold text-text-primary">Suggested Headings:</h5>
                    <ul className="list-disc list-inside text-sm text-text-secondary mt-1 space-y-1">
                        {suggestion.suggestedHeadings.map((heading, i) => <li key={i}>{heading}</li>)}
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};