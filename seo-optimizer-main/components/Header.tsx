
import React from 'react';
import { SmartDataLogo } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <SmartDataLogo />
        <h1 className="text-xl font-semibold tracking-tight text-gray-300 hidden sm:block">
          AI SEO & Performance Analyzer
        </h1>
      </div>
    </header>
  );
};