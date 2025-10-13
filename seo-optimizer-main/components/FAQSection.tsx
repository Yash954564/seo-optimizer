import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';

const faqData = [
    {
        question: "How does this tool analyze my website?",
        answer: "Our tool uses an advanced AI model from Google (Gemini) that acts like an expert SEO analyst. It simulates a live crawl of your website to gather real-time data on technical factors, content quality, and on-page elements, compiling it into a comprehensive report."
    },
    {
        question: "Is the data in the report accurate?",
        answer: "Yes, the analysis is based on a real-time inspection of your website's live content and structure. The AI identifies your keywords, checks for technical files like robots.txt, and evaluates your content based on SEO best practices. It does not use outdated or cached data."
    },
    {
        question: "How is this different from other SEO tools?",
        answer: "Many tools focus on one aspect of SEO or use data that can be slow to update. Our analyzer provides a holistic, 360-degree view by combining technical, on-page, and content analysis. The AI also provides strategic recommendations and content briefs, which is a unique feature."
    },
    {
        question: "Is my data safe?",
        answer: "Absolutely. We only require your URL for analysis and do not access any private backend data. If you choose to unlock the full report, your email is stored securely and is only used to associate you with the report for this specific analysis."
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