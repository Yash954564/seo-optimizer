
import React from 'react';
import { CheckCircleIcon } from './icons';

interface RecommendationsProps {
  recommendations: string[];
}

export const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-slide-in-up shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Actionable Recommendations</h3>
      <ul className="space-y-3">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            <span className="text-gray-300">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
