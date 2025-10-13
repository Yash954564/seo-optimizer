import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon, CheckCircleIcon, ChartTrendingUpIcon } from './icons';
import { getTotalAnalyses } from '../services/supabaseService';
import { HowItWorks } from './HowItWorks';
import { FAQSection } from './FAQSection';

const analysisFeatures = [
    {
        title: 'On-Page SEO',
        description: 'Analyze meta tags, keyword density, and internal linking to ensure every page is perfectly optimized.'
    },
    {
        title: 'Content Quality',
        description: 'Receive an objective score on your content\'s relevance, depth, and value to your target audience.'
    },
    {
        title: 'Readability',
        description: 'Assess your content\'s readability score to ensure it\'s easily digestible by your intended readers.'
    },
    {
        title: 'Backlinks Profile',
        description: 'Get a score on your backlink profile health and see examples of high-authority referring domains.'
    },
    {
        title: 'Technical SEO Audit',
        description: 'Uncover critical technical issues with robots.txt, sitemap.xml, and more that could be hurting your rankings.'
    },
    {
        title: 'Broken Links & 404 Errors',
        description: 'Automatically find and report broken internal links that create a poor user experience and waste crawl budget.'
    },
    {
        title: 'Keyword & Competitor Deep Dive',
        description: 'Identify top competitors for crucial keywords and get a detailed breakdown of their winning strategies.'
    },
    {
        title: 'AI-Generated Content Briefs',
        description: 'Get ready-to-use content briefs with titles, target audiences, and structured headings to create high-ranking content.'
    },
    {
        title: 'Keyword Gap Opportunities',
        description: 'Discover valuable keywords your competitors rank for, but you don\'t, to capture more market share.'
    },
    {
        title: 'Strategic Keyword Suggestions',
        description: 'Go beyond basic keywords with actionable suggestions for long-tail, informational, and transactional terms.'
    },
    {
        title: 'Advanced Strategic Suggestions',
        description: 'Receive expert-level guidance across Technical SEO, Content, UX, and Local SEO for a holistic strategy.'
    },
    {
        title: 'Actionable Recommendations',
        description: 'Get a prioritized, easy-to-understand checklist of the most impactful changes you can make to boost your SEO.'
    },
];

const AnimatedCounter: React.FC<{ end: number }> = ({ end }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (end === 0) return;
        
        let start = 0;
        const duration = 2000; // 2 seconds
        const frameRate = 60;
        const totalFrames = Math.round(duration / (1000 / frameRate));
        const increment = end / totalFrames;

        const counter = () => {
            start += increment;
            if (start < end) {
                setCount(Math.ceil(start));
                requestAnimationFrame(counter);
            } else {
                setCount(end);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                requestAnimationFrame(counter);
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [end]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
};


export const WelcomeScreen: React.FC = () => {
    const [analysisCount, setAnalysisCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const count = await getTotalAnalyses();
                setAnalysisCount(count);
            } catch (error) {
                console.error("Failed to fetch analysis count:", error);
                // Set a default or fallback count if fetching fails
                setAnalysisCount(1000); // A nice number to show on error
            }
        };
        fetchCount();
    }, []);

    return (
        <div className="mt-8 space-y-20 md:space-y-32 animate-fade-in">
            {/* Hero Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-left animate-slide-in-up">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-6">
                        Unlock Your Website's <span className="text-brand-primary">True Potential</span>
                    </h2>
                    <p className="text-lg text-text-secondary max-w-xl mb-8">
                        Stop guessing and start growing. Our AI-powered analyzer performs a comprehensive 360° audit of your website, delivering actionable insights to dominate search rankings and outperform your competition.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <span className="text-text-primary">In-depth Technical & Content Analysis</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <span className="text-text-primary">Live Competitor Strategy Breakdowns</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <span className="text-text-primary">AI-Generated Actionable Recommendations</span>
                        </div>
                    </div>
                </div>
                <div className="relative flex justify-center items-center animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <div className="absolute w-72 h-72 bg-gradient-to-br from-red-100 to-red-200 rounded-full blur-2xl opacity-50"></div>
                     <div className="relative bg-white/50 backdrop-blur-sm p-8 rounded-full border border-slate-200 shadow-xl text-center">
                        <ChartTrendingUpIcon className="w-24 h-24 mx-auto text-brand-primary mb-4"/>
                        <p className="text-lg text-text-secondary">Analyses Performed</p>
                        <div className="text-5xl font-bold text-brand-primary my-1">
                            <AnimatedCounter end={analysisCount+2487} />+
                        </div>
                        <p className="text-sm text-text-secondary">and growing!</p>
                    </div>
                </div>
            </div>

            <HowItWorks />

            {/* Features Section */}
            <div id="features" className="text-center">
                 <h3 className="text-3xl font-bold text-text-primary mb-4">A Complete SEO Toolkit at Your Fingertips</h3>
                 <p className="text-lg text-text-secondary max-w-3xl mx-auto mb-12">
                     Our analysis covers every critical aspect of your online presence. No stone is left unturned.
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    {analysisFeatures.map((feature, index) => (
                        <div 
                            key={index} 
                            className="bg-white p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-in-up"
                            style={{ animationDelay: `${index * 50}ms`, opacity: 0, animationFillMode: 'forwards' }}
                        >
                            <SparklesIcon className="w-8 h-8 text-brand-primary mb-4" />
                            <h4 className="font-bold text-lg text-text-primary mb-2">{feature.title}</h4>
                            <p className="text-text-secondary text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <FAQSection />
        </div>
    );
}