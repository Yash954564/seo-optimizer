import React from 'react';
import { SparklesIcon, SearchIcon, UserGroupIcon, WrenchScrewdriverIcon } from './icons';

export const WelcomeScreen: React.FC = () => {
    return (
        <div className="text-center p-8 mt-8 bg-white border border-slate-200 rounded-xl animate-fade-in shadow-lg">
            <SparklesIcon className="w-12 h-12 mx-auto text-brand-primary mb-4" />
            <h2 className="text-4xl font-bold text-text-primary mb-3">
                Trusted By <span className="text-brand-primary">Innovators</span> Worldwide.
            </h2>
            <p className="text-text-secondary max-w-3xl mx-auto mb-10">
                From startups to global enterprises, we provide AI-driven insights that deliver measurable impact. Analyze your website to uncover data-driven strategies for growth and outperform your competition.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                        <WrenchScrewdriverIcon className="w-8 h-8 text-brand-secondary" />
                        <h3 className="text-xl font-semibold text-text-primary">Comprehensive Analysis</h3>
                    </div>
                    <p className="mt-3 text-text-secondary">
                        Receive detailed scores and a full technical audit, from sitemap validation to broken link detection.
                    </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                        <UserGroupIcon className="w-8 h-8 text-brand-secondary" />
                        <h3 className="text-xl font-semibold text-text-primary">Competitor Insights</h3>
                    </div>
                    <p className="mt-3 text-text-secondary">
                        Uncover the keywords your competitors rank for and get a deep-dive into their successful SEO strategies.
                    </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                        <SearchIcon className="w-8 h-8 text-brand-secondary" />
                        <h3 className="text-xl font-semibold text-text-primary">Actionable Strategy</h3>
                    </div>
                    <p className="mt-3 text-text-secondary">
                        Get AI-generated content briefs, strategic keyword suggestions, and a clear list of actionable recommendations.
                    </p>
                </div>
            </div>
        </div>
    );
}