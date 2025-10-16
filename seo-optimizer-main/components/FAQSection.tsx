import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';

const faqData = [
    {
        question: "What is an SEO analyzer free tool?",
        answer: "An SEO analyzer free tool evaluates your website’s SEO performance, page speed, and optimization issues. It provides actionable insights, helping you improve rankings and overall website health without any cost or signup."
    },
    {
        question: "How does the Performance Analyzer work?",
        answer: "The Performance Analyzer checks your website’s speed, responsiveness, and technical SEO elements. It identifies performance bottlenecks and provides actionable recommendations to optimize your site, enhance user experience, and boost search engine rankings."
    },
    {
        question: "Can I use this as a website health checker?",
        answer: "Yes! Our tool doubles as a website health checker, analyzing SEO errors, performance issues, and site optimization. You receive a clear SEO audit with actionable insights to improve your site’s health and overall search visibility."
    },
    {
        question: "Is this a reliable Google SEO checker?",
        answer: "Absolutely. This Google SEO checker evaluates on-page SEO, site speed, and other ranking factors. It offers an easy-to-understand SEO audit report and actionable recommendations to enhance Google search performance efficiently."
    },
    {
        question: "Can I get a website analyzer free report?",
        answer: "Yes, our website analyzer free feature generates a detailed SEO audit report instantly. It highlights optimization issues, performance metrics, and actionable insights to help you boost your website’s ranking and overall user experience."
    },
    {
        question: "Does it include an SEO report generator?",
        answer: "Yes, the SEO report generator creates comprehensive reports including SEO scores, performance analysis, and actionable recommendations. You can download a free SEO audit report PDF for review, sharing, or strategy planning."
    },
    {
        question: "Is this the best SEO checker online?",
        answer: "Our tool is one of the best SEO checker online options, offering quick, accurate audits. It combines website analysis, actionable insights, and performance optimization in a single, free, and user-friendly platform."
    },
    {
        question: "Can I use this as an SEO optimizer?",
        answer: "Yes, the tool functions as an SEO optimizer by providing actionable insights and practical recommendations. It helps improve website speed, on-page SEO, and overall site performance to increase search engine rankings."
    },
    {
        question: "What actionable recommendations will I get?",
        answer: "You’ll receive actionable recommendations to fix SEO issues, improve website performance, optimize meta tags, enhance page speed, and boost rankings. Each suggestion is clear, practical, and focused on measurable SEO improvements."
    },
    {
        question: "Is this a complete SEO audit tool?",
        answer: "Yes, this SEO audit tool performs a full website analysis, checks performance, identifies errors, and generates actionable insights. It’s free, fast, and designed to help marketers, developers, and website owners optimize their sites effectively."
    }
];

const FAQItem: React.FC<{ faq: typeof faqData[0], isOpen: boolean, onClick: () => void }> = ({ faq, isOpen, onClick }) => {
    return (
        <div className="border-b border-slate-200 py-4">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-text-primary">{faq.question}</span>
                <ChevronDownIcon className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-2' : 'max-h-0'}`}
              aria-hidden={!isOpen}
            >
                <p className="text-text-secondary text-sm">{faq.answer}</p>
            </div>
        </div>
    )
}

export const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    }
    
    return (
        <div id="faq" className="border-t border-slate-200 pt-8 mt-12">
            <h3 className="text-2xl font-bold text-text-primary mb-6">Frequently Asked Questions</h3>
            <div className="max-w-3xl mx-auto text-left">
                {faqData.map((faq, index) => (
                    <FAQItem 
                        key={index}
                        faq={faq}
                        isOpen={openIndex === index}
                        onClick={() => handleClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};