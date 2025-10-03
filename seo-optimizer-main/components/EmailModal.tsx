import React, { useState, FormEvent } from 'react';
import { MailIcon } from './icons';
import { createClient } from '@supabase/supabase-js';

// Supabase config
const supabaseUrl = 'https://pieyplqyszyarodkfibp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZXlwbHF5c3p5YXJvZGtmaWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMzU2OTcsImV4cCI6MjA3NDgxMTY5N30.hiMEOit-lCLgOlhhkzyWiP3WrhXnPM1QI_WWoZDcqPE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface EmailModalProps {
    onClose: () => void;
    onSubmit: () => void;
    url: string; // The URL being analyzed
}

export const EmailModal: React.FC<EmailModalProps> = ({ onClose, onSubmit, url }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Update the record in Supabase where the URL matches
            const { error: updateError } = await supabase
                .from('urls')
                .update({ email: email })
                .eq('url', url);

            if (updateError) {
                throw updateError;
            }

            console.log('Email successfully saved to Supabase for url:', url);
            onSubmit(); // This will unlock the report and close the modal
        } catch (err: any) {
            console.error('Error saving email to Supabase:', err);
            setError('Failed to save email. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-modal-title"
        >
            <div 
                className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 w-full max-w-md mx-4 animate-slide-in-up"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <h2 id="email-modal-title" className="text-2xl font-bold text-white mb-2 text-center">Unlock Full Report</h2>
                <p className="text-gray-400 text-center mb-6">Enter your email to unlock all SEO insights and recommendations.</p>
                <form onSubmit={handleSubmit}>
                    <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-slate-700 border border-slate-600 rounded-md py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                            required
                            aria-label="Email address"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-6 bg-brand-primary hover:bg-brand-secondary text-slate-900 font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Unlock Now'}
                    </button>
                </form>
                 <button onClick={onClose} disabled={isSubmitting} className="w-full mt-2 text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-50">
                    Cancel
                </button>
            </div>
        </div>
    );
};
