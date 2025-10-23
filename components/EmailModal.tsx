import React, { useState, FormEvent } from 'react';
import { MailIcon } from './icons';
import { saveAnalysisResults } from '../services/supabaseService';
import { SeoReport } from '../types';


interface EmailModalProps {
    onClose: () => void;
    onSaveSuccess: (reportUrlId: string) => void;
    report: SeoReport;
}

export const EmailModal: React.FC<EmailModalProps> = ({ onClose, onSaveSuccess, report }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        
        if (!report.urlid) {
            setError("Could not verify your session. Please refresh and try again.");
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedReportUrlId = await saveAnalysisResults(report, email);
            console.log('Report successfully saved with urlid:', updatedReportUrlId);
            onSaveSuccess(updatedReportUrlId);
        } catch (err: any) {
            console.error('Error saving report:', err);
            setError('Failed to save report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-modal-title"
        >
            <div 
                className="bg-white p-8 rounded-xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 animate-slide-in-up"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <h2 id="email-modal-title" className="text-2xl font-bold text-text-primary mb-2 text-center">Unlock Full Report</h2>
                <p className="text-text-secondary text-center mb-6">Enter your email to save and unlock all SEO insights and recommendations.</p>
                <form onSubmit={handleSubmit}>
                    <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-slate-50 border border-slate-300 rounded-md py-3 pl-10 pr-4 text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition placeholder:text-gray-400"
                            required
                            aria-label="Email address"
                        />
                    </div>
                    {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-6 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        {isSubmitting ? 'Saving & Unlocking...' : 'Unlock Now'}
                    </button>
                </form>
                 <button onClick={onClose} disabled={isSubmitting} className="w-full mt-2 text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50">
                    Cancel
                </button>
            </div>
        </div>
    );
};