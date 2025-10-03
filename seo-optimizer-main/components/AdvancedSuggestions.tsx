import React from 'react';
import { AdvancedSuggestion } from '../types';
import { WrenchScrewdriverIcon, LightbulbIcon, UserGroupIcon, MapPinIcon } from './icons';

interface AdvancedSuggestionsProps {
  suggestions: AdvancedSuggestion[];
  isLocked: boolean;
}

const categoryIconMap: { [key in AdvancedSuggestion['category']]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  'Technical SEO': WrenchScrewdriverIcon,
  'Content Strategy': LightbulbIcon,
  'User Experience': UserGroupIcon,
  'Local SEO': MapPinIcon,
};

const categoryColorMap = {
    'Technical SEO': 'text-sky-400',
    'Content Strategy': 'text-yellow-400',
    'User Experience': 'text-green-400',
    'Local SEO': 'text-rose-400',
};

export const AdvancedSuggestions: React.FC<AdvancedSuggestionsProps> = ({ suggestions, isLocked }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-slide-in-up shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Advanced Strategic Suggestions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((suggestion, index) => {
          const isBlurred = isLocked && index > 0;
          const IconComponent = categoryIconMap[suggestion.category];
          const colorClass = categoryColorMap[suggestion.category];
          return (
            <div 
              key={index} 
              className={`bg-slate-700/50 p-4 rounded-lg border border-slate-600 flex items-start gap-4 transition-all duration-300 ${isBlurred ? 'blur-sm pointer-events-none select-none' : ''}`}
              aria-hidden={isBlurred}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center ${colorClass}`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-sm font-bold ${colorClass}`}>{suggestion.category}</p>
                <h4 className="font-semibold text-md text-white mt-1">{suggestion.title}</h4>
                <p className="text-gray-400 text-sm mt-1">{suggestion.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};