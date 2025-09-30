
import React, { useState } from 'react';
import { KeywordData, CompetitorAnalysis as CompetitorAnalysisType } from '../types';
import { LinkIcon, ChevronDownIcon } from './icons';

interface KeywordDeepDiveProps {
  keywords: KeywordData[];
  competitorInfo: CompetitorAnalysisType[];
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
                <div className="mt-2 space-y-2 text-sm text-gray-400 border-l-2 border-slate-500 pl-3">
                    <div>
                        <h5 className="font-semibold text-gray-300">Content Strategy:</h5>
                        <p>{competitor.detailedStrategy.content}</p>
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-300">Link Building:</h5>
                        <p>{competitor.detailedStrategy.linkBuilding}</p>
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-300">On-Page & Technical SEO:</h5>
                        <p>{competitor.detailedStrategy.onPageAndTechnical}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export const KeywordDeepDive: React.FC<KeywordDeepDiveProps> = ({ keywords, competitorInfo }) => {
  const competitorInfoMap = new Map(competitorInfo.map(c => [c.url, c]));

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-slide-in-up shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Keyword & Competitor Deep Dive</h2>
      <div className="space-y-6">
        {keywords.map((keyword) => (
          <div key={keyword.keyword} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 border-b border-slate-600 pb-3">
              <h3 className="text-lg font-semibold text-white">
                Keyword: <span className="text-brand-accent">{keyword.keyword}</span>
              </h3>
              <p className="font-bold text-lg text-gray-200">
                Your Rank: <span className="text-brand-primary">#{keyword.rank}</span>
              </p>
            </div>
            
            <h4 className="text-md font-semibold text-gray-300 mb-2">Top Competitors for this Keyword:</h4>
            <div className="space-y-4">
                {keyword.topCompetitors.length > 0 ? keyword.topCompetitors.map(comp => {
                    const details = competitorInfoMap.get(comp.url);
                    return (
                        <div key={comp.url} className="pl-4 border-l-2 border-slate-600">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-brand-secondary text-md">#{comp.rank}</span>
                                <LinkIcon className="w-4 h-4 text-gray-400" />
                                <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline truncate text-sm">
                                    {comp.url}
                                </a>
                            </div>
                            {details && (
                                <>
                                    <p className="text-gray-400 text-sm mt-1 ml-1">{details.strategySummary}</p>
                                    <CompetitorDetails competitor={details} />
                                </>
                            )}
                        </div>
                    )
                }) : <p className="text-sm text-gray-400">No direct competitors found for this keyword.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
