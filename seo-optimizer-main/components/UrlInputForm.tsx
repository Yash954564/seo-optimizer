import React, { useState, useRef, FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SearchIcon } from './icons';

// Supabase config
const supabaseUrl = 'https://pieyplqyszyarodkfibp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZXlwbHF5c3p5YXJvZGtmaWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMzU2OTcsImV4cCI6MjA3NDgxMTY5N30.hiMEOit-lCLgOlhhkzyWiP3WrhXnPM1QI_WWoZDcqPE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UrlInputFormProps {
  onAnalyze: (mainUrl: string) => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onAnalyze, isLoading }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [mainUrl, setMainUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValidUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      // Basic check for a hostname with a period
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:" && parsedUrl.hostname.includes('.');
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(false);
    if (!mainUrl.trim() || !isValidUrl(mainUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    setError(null);
    onAnalyze(mainUrl);

    try {
      const { error: insertError } = await supabase
        .from('urls')
        .insert([{ url: mainUrl, email: null }]); // Insert with null email initially

      if (insertError) {
        // If the URL is already present (unique constraint violation), that's okay.
        // We just won't insert it again. We can ignore this specific error.
        if (insertError.code !== '23505') { 
            throw insertError;
        }
      }
      setIsSubmitted(true);
      console.log('URL analysis initiated and logged.');
    } catch (err) {
      console.error('Error with Supabase:', err);
      // We don't block the user from analyzing, so we won't set a user-facing error here.
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 animate-slide-in-up">
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div>
            <label htmlFor="mainUrl" className="block text-sm font-medium text-text-secondary mb-1">Enter Your Website URL to Begin Analysis</label>
            <div className="relative">
              <input
                type="url"
                id="mainUrl"
                name="mainUrl"
                value={mainUrl}
                onChange={(e) => {
                    setMainUrl(e.target.value);
                    if (error) setError(null);
                }}
                placeholder="https://your-website.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-md py-3 px-4 text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition placeholder:text-gray-400"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 hover:shadow-glow-red"
          >
            <SearchIcon className="w-5 h-5" />
            {isLoading ? 'Analyzing...' : 'Analyze SEO Performance'}
          </button>
        </div>
        {isSubmitted && !isLoading && <p className="text-green-600 text-sm mt-2 text-center">Analysis started successfully!</p>}
      </form>
    </div>
  );
};