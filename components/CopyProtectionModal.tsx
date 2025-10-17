import React from 'react';
import { MegaphoneIcon, XMarkIcon } from './icons';

interface CopyProtectionModalProps {
    onAllow: () => void;
    onCheck: () => void;
    onCancel: () => void;
}

export const CopyProtectionModal: React.FC<CopyProtectionModalProps> = ({ onAllow, onCheck, onCancel }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="copy-modal-title"
        >
            <div 
                className="bg-white p-8 rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg mx-4 text-center animate-slide-in-up relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onCancel} 
                    className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                    aria-label="Close modal"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <MegaphoneIcon className="w-12 h-12 mx-auto mb-4 text-brand-primary" />
                <h2 id="copy-modal-title" className="text-2xl font-bold text-text-primary mb-4">
                    Would you like to promote your growth or website like this?
                </h2>
                <p className="text-text-secondary mb-8">
                    By enabling copying, you agree that you're inspired by our tool and are looking to grow.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={onAllow}
                        className="w-full sm:w-auto bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-glow-red"
                    >
                        Yes, I would like to grow
                    </button>
                    <button
                        onClick={onCheck}
                        className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-text-secondary font-bold py-3 px-6 rounded-md transition-colors"
                    >
                        I am just checking
                    </button>
                </div>
            </div>
        </div>
    );
};