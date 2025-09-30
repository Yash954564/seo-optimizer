
import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 mt-8 animate-fade-in">
        <div className="w-16 h-16 border-4 border-slate-600 border-t-brand-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-gray-300">{message || 'Loading...'}</p>
        <p className="text-sm text-gray-400">This may take a moment.</p>
    </div>
  );
};
