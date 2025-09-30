import React from 'react';
import { SeoReport } from '../types';
import { SeoScoreCard } from './SeoScoreCard';
import { KeywordRankingChart } from './KeywordRankingChart';
import { KeywordDeepDive } from './CompetitorAnalysis';
import { Recommendations } from './Recommendations';
import { ContentSuggestions } from './ContentSuggestions';
import { DownloadIcon } from './icons';
import { KeywordGaps } from './KeywordGaps';
import { AdvancedSuggestions } from './AdvancedSuggestions';
import { KeywordSuggestions } from './KeywordSuggestions';
import { TechnicalAuditReport } from './TechnicalAuditReport';

interface ReportDashboardProps {
  report: SeoReport;
  onDownloadPdf: () => void;
  isPdfMode: boolean;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({ report, onDownloadPdf, isPdfMode }) => {
  return (
    <div className="mt-8 animate-fade-in space-y-8">
      <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg border border-slate-700">
        <div>
          <h2 className="text-2xl font-bold text-white">SEO Analysis Report</h2>
          <p className="text-brand-secondary">{report.url}</p>
        </div>
        <button
          onClick={onDownloadPdf}
          disabled={isPdfMode}
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-slate-900 font-bold py-2 px-4 rounded-md transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          <DownloadIcon className="w-5 h-5"/>
          {isPdfMode ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      {/* Scores Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SeoScoreCard title="On-Page SEO Score" scoreData={report.scores.onPageSeo} />
        <SeoScoreCard title="Content Quality Score" scoreData={report.scores.contentQuality} />
        <SeoScoreCard title="Readability Score" scoreData={report.scores.readability} />
        <SeoScoreCard title="Backlinks Profile Score" scoreData={report.scores.backlinks} />
      </div>
      
      {/* Technical Audit Section */}
      <TechnicalAuditReport audit={report.technicalAudit} />

      {/* Keyword Deep Dive & Competitor Analysis */}
      <KeywordDeepDive keywords={report.keywords} competitorInfo={report.competitorAnalysis} />

      {/* Keyword Performance Charts */}
      <KeywordRankingChart keywords={report.keywords} />
      
      {/* Content & Keyword Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ContentSuggestions suggestions={report.contentSuggestions} />
        <KeywordGaps gaps={report.keywordGaps} />
        <KeywordSuggestions suggestions={report.keywordSuggestions} />
      </div>

      {/* Advanced Suggestions */}
      <AdvancedSuggestions suggestions={report.advancedSuggestions} />

      {/* Recommendations */}
      <Recommendations recommendations={report.recommendations} />
    </div>
  );
};