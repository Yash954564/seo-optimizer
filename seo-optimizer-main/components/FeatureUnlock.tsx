import React, { useState } from 'react';
import { EmailModal } from './EmailModal';
import { CheckCircleIcon } from './icons';

const features = [
  'Broken Links & 404 Errors',
  'Keyword & Competitor Deep Dive',
  'AI-Generated Content Briefs',
  'Keyword Gap Opportunities',
  'Strategic Keyword Suggestions',
  'Advanced Strategic Suggestions',
  'Actionable Recommendations',
];

interface FeatureUnlockProps {
  url: string;
}

const FeatureUnlock: React.FC<FeatureUnlockProps> = ({ url }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = () => {
    setUnlocked(true);
    setShowModal(false);
  };

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-lg border border-slate-200 animate-slide-in-up">
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Full Feature List</h2>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className={`flex items-center gap-2 text-text-secondary transition-all duration-300 ${index > 0 && !unlocked ? 'blur-md saturate-0 opacity-50' : ''}`}>
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {!unlocked && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105"
          >
            Unlock All Points
          </button>
        </div>
      )}
      {showModal && (
        <EmailModal 
          onClose={() => setShowModal(false)} 
          onSubmit={handleSuccess} 
          url={url}
        />
      )}
    </div>
  );
};

export default FeatureUnlock;
