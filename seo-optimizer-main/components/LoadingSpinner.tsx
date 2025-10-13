import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from './icons';

const analysisStepsList = [
  "Booting up AI analyst...",
  "Simulating website crawl...",
  "Analyzing on-page SEO factors...",
  "Evaluating content quality & readability...",
  "Auditing technical SEO health...",
  "Researching competitor strategies...",
  "Identifying keyword opportunities...",
  "Compiling final recommendations...",
];

const SpinnerIcon = () => (
    <div className="w-5 h-5 border-2 border-slate-300 border-t-brand-primary rounded-full animate-spin"></div>
);

const CheckmarkIcon = () => (
    <CheckCircleIcon className="w-5 h-5 text-green-500" />
);

const PendingIcon = () => (
    <div className="w-5 h-5 rounded-full bg-slate-200 border border-slate-300"></div>
)

export const LoadingSpinner: React.FC<{message?: string}> = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep < analysisStepsList.length -1) {
            // Simulate variable step durations for a more realistic feel
            const randomDelay = 1500 + Math.random() * 2000;
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, randomDelay);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    return (
        <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 animate-fade-in">
            <h2 className="text-xl font-bold text-center text-text-primary mb-6">Your Report is Being Generated...</h2>
            <div className="space-y-4 max-w-md mx-auto">
                {analysisStepsList.map((step, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-4 transition-all duration-500 ${index > currentStep ? 'opacity-40' : 'opacity-100'}`}
                    >
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                            {index < currentStep ? <CheckmarkIcon /> : (index === currentStep ? <SpinnerIcon /> : <PendingIcon />)}
                        </div>
                        <p className={`transition-colors duration-300 ${index === currentStep ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                            {step}
                        </p>
                    </div>
                ))}
            </div>
            <p className="text-center text-sm text-text-secondary mt-8">
                This process uses advanced AI and may take up to a minute. Thank you for your patience.
            </p>
        </div>
    );
};