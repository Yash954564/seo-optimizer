import React from 'react';
import { AdvancedSuggestion } from '../types';
import { WrenchScrewdriverIcon, LightbulbIcon, UserGroupIcon, MapPinIcon } from './icons';

interface AdvancedSuggestionsProps {
  suggestions: AdvancedSuggestion[];
  isReportLocked: boolean;
}

const categoryIconMap: { [key in AdvancedSuggestion['category']]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  'Technical SEO': WrenchScrewdriverIcon,
  'Content Strategy': LightbulbIcon,
  'User Experience': UserGroupIcon,
  'Local SEO': MapPinIcon,
};

const categoryStyleMap: { [key in AdvancedSuggestion['category']]: { text: string; bg: string; shadow: string } } = {
    'Technical SEO': { text: 'text-sky-600', bg: 'bg-sky-100', shadow: 'hover:shadow-glow-sky' },
    'Content Strategy': { text: 'text-yellow-600', bg: 'bg-yellow-100', shadow: 'hover:shadow-glow-yellow' },
    'User Experience': { text: 'text-green-600', bg: 'bg-green-100', shadow: 'hover:shadow-glow-green' },
    'Local SEO': { text: 'text-rose-600', bg: 'bg-rose-100', shadow: 'hover:shadow-glow-red' },
};

export const AdvancedSuggestions: React.FC<AdvancedSuggestionsProps> = ({ suggestions, isReportLocked }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="animate-slide-in-up">
      <h3 className="text-3xl font-bold text-text-primary text-center mb-6">Advanced <span className="text-brand-primary">Strategic Suggestions</span></h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((suggestion, index) => {
          const styles = categoryStyleMap[suggestion.category];
          const IconComponent = categoryIconMap[suggestion.category];
          return (
            <div 
              key={index} 
              className={`bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-4 transition-all duration-300 shadow-md hover:scale-105 hover:shadow-xl ${styles.shadow} ${isReportLocked && index > 0 ? 'blur-lg grayscale opacity-60 pointer-events-none select-none' : ''}`}
              style={{ animation: 'staggeredSlideIn 0.5s ease-out forwards', animationDelay: `${index * 100}ms` }}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${styles.bg} flex items-center justify-center ${styles.text}`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-sm font-bold ${styles.text}`}>{suggestion.category}</p>
                <h4 className="font-semibold text-md text-text-primary mt-1">{suggestion.title}</h4>
                <p className="text-text-secondary text-sm mt-1">{suggestion.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};