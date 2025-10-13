import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon, CheckCircleIcon } from './icons';
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
        <div className="text-center p-8 mt-8 bg-white border border-slate-200 rounded-xl animate-fade-in shadow-lg">
            <SparklesIcon className="w-12 h-12 mx-auto text-brand-primary mb-4" />
            <h2 className="text-4xl font-bold text-text-primary mb-3">
                Trusted By <span className="text-brand-primary">Innovators</span> Worldwide.
            </h2>
            <p className="text-text-secondary max-w-3xl mx-auto mb-10">
                From startups to global enterprises, we provide AI-driven insights that deliver measurable impact. Analyze your website to uncover data-driven strategies for growth and outperform your competition. Our 360° analysis covers every critical aspect of your online presence.
            </p>

            <div className="py-8 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-lg text-text-secondary">Join over</p>
                <div className="text-6xl font-bold text-brand-primary my-2">
                    <AnimatedCounter end={analysisCount+2487} />
                </div>
                <p className="text-lg text-text-secondary">innovators who have scaled up their SEO with our insights.</p>
            </div>

            <HowItWorks />

            

            <FAQSection />

            <div className="border-t border-slate-200 pt-8 mt-12">
                 <h3 className="text-2xl font-bold text-text-primary mb-6">Our Comprehensive Analysis Includes:</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 text-left max-w-6xl mx-auto">
                    {analysisFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold text-text-primary">{feature.title}</h4>
                                <p className="text-text-secondary text-sm mt-1">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}