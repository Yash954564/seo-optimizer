import React, { useState } from 'react';
import { KeywordData, CompetitorAnalysis as CompetitorAnalysisType } from '../types';
import { LinkIcon, ChevronDownIcon } from './icons';

interface KeywordDeepDiveProps {
  keywords: KeywordData[];
  competitorInfo: CompetitorAnalysisType[];
  isReportLocked: boolean;
}

const CompetitorDetails: React.FC<{ competitor: CompetitorAnalysisType }> = ({ competitor }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="pl-4 mt-2">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 text-sm text-brand-secondary hover:text-brand-primary">
                <span>{isOpen ? 'Hide' : 'Show'} Details</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-2 space-y-2 text-sm text-text-secondary border-l-2 border-slate-300 pl-3">
                    <div>
                        <h5 className="font-semibold text-text-primary">Content Strategy:</h5>
                        <p>{competitor.detailedStrategy.content}</p>
                    </div>
                    <div>
                        <h5 className="font-semibold text-text-primary">Link Building:</h5>
                        <p>{competitor.detailedStrategy.linkBuilding}</p>
                    </div>
                    <div>
                        <h5 className="font-semibold text-text-primary">On-Page & Technical SEO:</h5>
                        <p>{competitor.detailedStrategy.onPageAndTechnical}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export const KeywordDeepDive: React.FC<KeywordDeepDiveProps> = ({ keywords, competitorInfo, isReportLocked }) => {
  const competitorInfoMap = new Map<string, CompetitorAnalysisType>(competitorInfo.map(c => [c.url, c]));

  return (
    <div className="animate-slide-in-up">
      <h2 className="text-3xl font-bold text-text-primary text-center mb-6">
        <span className="text-brand-primary">Keyword</span> & Competitor Deep Dive
      </h2>
      <div className="space-y-6">
        {keywords.map((keyword, index) => {
          return (
            <div 
              key={keyword.keyword} 
              className={`bg-white p-4 rounded-lg border border-slate-200 transition-all duration-300 shadow-md ${isReportLocked && index > 0 ? 'blur-lg grayscale opacity-60 pointer-events-none select-none' : ''}`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 border-b border-slate-200 pb-3">
                <h3 className="text-lg font-semibold text-text-primary">
                  Keyword: <span className="text-brand-secondary">{keyword.keyword}</span>
                </h3>
                <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                        <p className="font-bold text-lg text-brand-primary">{keyword.relevanceScore}/10</p>
                        <p className="text-text-secondary text-xs">Relevance Score</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-lg text-brand-primary">{keyword.userIntent}</p>
                        <p className="text-text-secondary text-xs">User Intent</p>
                    </div>
                </div>
              </div>
              
              <h4 className="text-md font-semibold text-text-primary mb-2">Top Competitors for this Keyword:</h4>
              <div className="space-y-4">
                  {keyword.topCompetitors.length > 0 ? keyword.topCompetitors.map(comp => {
                      const details = competitorInfoMap.get(comp.url);
                      return (
                          <div key={comp.url} className="pl-4 border-l-2 border-slate-300">
                              <div className="flex items-center gap-2">
                                  <span className="font-bold text-brand-secondary text-md">#{comp.rank}</span>
                                  <LinkIcon className="w-4 h-4 text-gray-400" />
                                  <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline truncate text-sm">
                                      {comp.url}
                                  </a>
                              </div>
                              {details && (
                                  <>
                                      <p className="text-text-secondary text-sm mt-1 ml-1">{details.strategySummary}</p>
                                      <CompetitorDetails competitor={details} />
                                  </>
                              )}
                          </div>
                      )
                  }) : <p className="text-sm text-text-secondary">No direct competitors found for this keyword.</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};