import React from 'react';
import { CheckCircleIcon } from './icons';

interface RecommendationsProps {
  recommendations: string[];
  isReportLocked: boolean;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ recommendations, isReportLocked }) => {
  return (
    <div className="animate-slide-in-up">
      <h3 className="text-3xl font-bold text-text-primary text-center mb-6">
          <span className="text-brand-primary">Actionable</span> Recommendations
      </h3>
      <ul className="space-y-3 max-w-3xl mx-auto">
        {recommendations.map((rec, index) => {
          return (
            <li 
              key={index} 
              className={`flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-lg shadow-sm animate-staggered-slide-in transition-all duration-300 ${isReportLocked && index > 0 ? 'blur-lg grayscale opacity-60 pointer-events-none select-none' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <span className="text-text-primary">{rec}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};