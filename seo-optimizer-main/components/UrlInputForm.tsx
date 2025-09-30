import React, { useState } from 'react';
import { SearchIcon } from './icons';

interface UrlInputFormProps {
  onAnalyze: (mainUrl: string) => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onAnalyze, isLoading }) => {
  const [mainUrl, setMainUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainUrl.trim() || !isValidUrl(mainUrl)) {
      setError('Please enter a valid main URL (e.g., https://example.com)');
      return;
    }
    setError(null);
    onAnalyze(mainUrl);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 animate-slide-in-up">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="mainUrl" className="block text-sm font-medium text-gray-300 mb-1">Enter Your Website URL to Begin Analysis</label>
            <div className="relative">
              <input
                type="url"
                id="mainUrl"
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
      </form>
    </div>
  );
};