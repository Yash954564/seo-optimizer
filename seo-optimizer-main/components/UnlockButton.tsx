import React from 'react';
import { UnlockIcon } from './icons';

interface UnlockButtonProps {
    onClick: () => void;
}

export const UnlockButton: React.FC<UnlockButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-8 right-8 z-20 flex items-center gap-3 bg-brand-primary hover:bg-brand-secondary text-slate-900 font-bold py-3 px-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg animate-fade-in"
            aria-label="Unlock All Points"
        >
            <UnlockIcon className="w-6 h-6" />
            <span className="hidden sm:inline">Unlock All Points</span>
        </button>
    );
};
