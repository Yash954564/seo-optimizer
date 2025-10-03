
import React, { useState } from 'react';
import { EmailModal } from './EmailModal';

const features = [
  'Broken Links & 404 Errors',
  'Keyword & Competitor Deep Dive',
  'Keyword Ranking History',
  'AI-Generated Content Briefs',
  'Keyword Gap Opportunities',
  'Strategic Keyword Suggestions',
  'Advanced Strategic Suggestions',
  'Actionable Recommendations',
];

const FeatureUnlock: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = () => {
    setUnlocked(true);
    setShowModal(false);
  };

  return (
    <div className="relative bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 animate-slide-in-up">
      <h2 className="text-2xl font-bold mb-4 text-white">Full Feature List</h2>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className={`text-gray-300 ${index > 0 && !unlocked ? 'blur-sm' : ''}`}>
            <span className="text-brand-primary mr-2">✓</span>{feature}
          </li>
        ))}
      </ul>
      {!unlocked && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-brand-primary hover:bg-brand-secondary text-slate-900 font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105"
          >
            Unlock All Points
          </button>
        </div>
      )}
      {showModal && (
        <EmailModal 
          onClose={() => setShowModal(false)} 
          onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
};

export default FeatureUnlock;
