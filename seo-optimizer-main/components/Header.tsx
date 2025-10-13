import React from 'react';

export const Header: React.FC = () => {
    // JS smooth scroll to avoid platform navigation issues
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-text-primary">
          Google SEO Checker &amp; <span className="text-brand-primary">Free SEO Analyzer</span>
        </h1>
        <nav className="hidden sm:flex items-center gap-6">
            <button onClick={() => scrollToSection('faq')} className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors">FAQ</button>
        </nav>
      </div>
    </header>
  );
};