import React, { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SearchIcon } from './icons';

// TODO: Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://pieyplqyszyarodkfibp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZXlwbHF5c3p5YXJvZGtmaWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMzU2OTcsImV4cCI6MjA3NDgxMTY5N30.hiMEOit-lCLgOlhhkzyWiP3WrhXnPM1QI_WWoZDcqPE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UrlInputFormProps {
  onAnalyze: (mainUrl: string) => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onAnalyze, isLoading }) => {
  const form = useRef<HTMLFormElement>(null);
  const [mainUrl, setMainUrl] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainUrl.trim() || !isValidUrl(mainUrl)) {
      setError('Please enter a valid main URL (e.g., https://example.com)');
      return;
    }
    setError(null);
    onAnalyze(mainUrl);

    try {
      const { error } = await supabase
        .from('urls') // Make sure you have a table named 'urls'
        .insert([{ url: mainUrl }]); // Make sure you have a column named 'url'

      if (error) {
        throw error;
      }

      setDone(true);
      form.current?.reset();
      console.log('URL successfully saved to Supabase');
    } catch (error) {
      console.error('Error saving URL to Supabase:', error);
      setError('Failed to save URL. Please try again.');
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 animate-slide-in-up">
      <form ref={form} onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="mainUrl" className="block text-sm font-medium text-gray-300 mb-1">Enter Your Website URL to Begin Analysis</label>
            <div className="relative">
              <input
                type="url"
                id="mainUrl"
                name="mainUrl"
                value={mainUrl}
                onChange={(e) => setMainUrl(e.target.value)}
                placeholder="https://your-website.com"
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-slate-900 font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
          >
            <SearchIcon className="w-5 h-5" />
            {isLoading ? 'Analyzing...' : 'Analyze SEO Performance'}
          </button>
        </div>
        {done && <p className="text-green-400 text-sm mt-2">We are Analyzing Your Website</p>}
      </form>
    </div>
  );
};
