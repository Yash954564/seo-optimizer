import React, { useState, useRef, FormEvent } from 'react';
import { logUrlAnalysis } from '../services/supabaseService';
import { SearchIcon, PlusIcon, TrashIcon } from './icons';

interface UrlInputFormProps {
  onAnalyze: (mainUrl: string, subPages: string[]) => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onAnalyze, isLoading }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [mainUrl, setMainUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [showSubPages, setShowSubPages] = useState(false);
  const [subPages, setSubPages] = useState<string[]>([]);

  const isValidUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:" && parsedUrl.hostname.includes('.');
    } catch (_) {
      return false;
    }
  };

  const handleAddSubPage = () => {
    if (subPages.length < 5) {
      setSubPages([...subPages, '']);
    }
  };

  const handleSubPageChange = (index: number, value: string) => {
    const newSubPages = [...subPages];
    newSubPages[index] = value;
    setSubPages(newSubPages);
  };

  const handleRemoveSubPage = (index: number) => {
    const newSubPages = subPages.filter((_, i) => i !== index);
    setSubPages(newSubPages);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(false);
    if (!mainUrl.trim() || !isValidUrl(mainUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    setError(null);
    const validSubPages = subPages.map(p => p.trim()).filter(p => p !== '');
    onAnalyze(mainUrl, validSubPages);

    try {
      await logUrlAnalysis(mainUrl);
      setIsSubmitted(true);
      console.log('URL analysis initiated and logged.');
    } catch (err) {
      console.error('Error logging URL:', err);
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
          
          <div className="border-t border-slate-200 pt-4">
              <button type="button" onClick={() => setShowSubPages(!showSubPages)} className="text-sm text-brand-secondary hover:underline">
                  {showSubPages ? 'Hide' : 'Add Sub-pages for focused analysis (Optional)'}
              </button>
              {showSubPages && (
                  <div className="mt-4 space-y-3">
                      {subPages.map((page, index) => (
                          <div key={index} className="flex items-center gap-2">
                              <input
                                  type="text"
                                  value={page}
                                  onChange={(e) => handleSubPageChange(index, e.target.value)}
                                  placeholder="e.g., /about-us or full URL"
                                  className="w-full bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-sm text-text-primary focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition placeholder:text-gray-400"
                              />
                              <button type="button" onClick={() => handleRemoveSubPage(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
                                  <TrashIcon className="w-4 h-4" />
                              </button>
                          </div>
                      ))}
                      {subPages.length < 5 && (
                          <button
                              type="button"
                              onClick={handleAddSubPage}
                              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                          >
                              <PlusIcon className="w-4 h-4" />
                              Add another page
                          </button>
                      )}
                  </div>
              )}
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