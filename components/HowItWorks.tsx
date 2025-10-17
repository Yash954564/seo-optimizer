import React from 'react';
import { SearchIcon, SparklesIcon, AnalyticsIcon } from './icons';

export const HowItWorks: React.FC = () => {
    const steps = [
        {
            icon: <SearchIcon className="w-8 h-8 text-brand-primary" />,
            title: "1. Submit Your URL",
            description: "Enter the website you want to analyze. You can also add specific sub-pages for a more focused report."
        },
        {
            icon: <SparklesIcon className="w-8 h-8 text-brand-primary" />,
            title: "2. AI Performs Deep Analysis",
            description: "Our AI a live crawl, checks technical factors, evaluates content, and analyzes competitors in real-time."
        },
        {
            icon: <AnalyticsIcon className="w-8 h-8 text-brand-primary" />,
            title: "3. Receive Your Report",
            description: "Get a detailed report with scores, competitor insights, and an actionable checklist to improve your SEO."
        }
    ];

    return (
        <div className="border-t border-slate-200 pt-8 mt-12">
            <h3 className="text-2xl font-bold text-text-primary mb-6">How It Works in 3 Simple Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center p-6 bg-slate-50/50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-primary/10 mb-4">
                           {step.icon}
                        </div>
                        <h4 className="text-lg font-semibold text-text-primary mb-2">{step.title}</h4>
                        <p className="text-text-secondary text-sm">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};