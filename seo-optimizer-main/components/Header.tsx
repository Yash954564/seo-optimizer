import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <img src="https://dkk4qeqny48s0.cloudfront.net/wp-content/uploads/2025/02/logo-updated.png" alt="SmartData Enterprises Logo" className="h-12" />
        <h1 className="text-xl font-semibold tracking-tight text-text-secondary hidden sm:block">
          AI SEO & Performance Analyzer
        </h1>
      </div>
    </header>
  );
};