
import React from 'react';
import { SparklesIcon } from './icons';

export const WelcomeScreen: React.FC = () => {
    return (
        <div className="text-center p-8 mt-8 bg-slate-800/50 border border-slate-700 rounded-xl animate-fade-in">
            <SparklesIcon className="w-12 h-12 mx-auto text-brand-primary mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to the AI SEO Analyzer</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
                Enter your website's URL above to begin a comprehensive SEO analysis. Our AI will assess your site's performance, check keyword rankings, analyze competitors, and provide actionable strategies for improvement.
            </p>
        </div>
    );
}
