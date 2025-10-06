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
  isReportLocked: boolean;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({ report, onDownloadPdf, isPdfMode, isReportLocked }) => {
  const isLocked = isReportLocked && !isPdfMode;

  return (
    <div className="mt-8 animate-fade-in space-y-12">
      <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-lg border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">SEO <span className="text-brand-primary">Analysis Report</span></h2>
          <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">{report.url}</a>
        </div>
        {!isLocked && (
            <button
            onClick={onDownloadPdf}
            disabled={isPdfMode}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
            <DownloadIcon className="w-5 h-5"/>
            {isPdfMode ? 'Generating PDF...' : 'Download PDF'}
            </button>
        )}
      </div>

      {/* Scores Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SeoScoreCard title="On-Page SEO" scoreData={report.scores.onPageSeo} />
        <SeoScoreCard title="Content Quality" scoreData={report.scores.contentQuality} />
        <SeoScoreCard title="Readability" scoreData={report.scores.readability} />
        <SeoScoreCard title="Backlinks Profile" scoreData={report.scores.backlinks} />
      </div>
      
      {/* Main Content with partial blur */}
      <div className="space-y-12">
        {/* Technical Audit Section */}
        <TechnicalAuditReport audit={report.technicalAudit} isReportLocked={isLocked} />

        {/* Keyword Deep Dive & Competitor Analysis */}
        <KeywordDeepDive keywords={report.keywords} competitorInfo={report.competitorAnalysis} isReportLocked={isLocked} />

        {/* Keyword Performance Charts */}
        <KeywordRankingChart keywords={report.keywords} isReportLocked={isLocked} />
        
        {/* Content & Keyword Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ContentSuggestions suggestions={report.contentSuggestions} isReportLocked={isLocked} />
          <div className="lg:col-span-2 space-y-8">
            <KeywordGaps gaps={report.keywordGaps} isReportLocked={isLocked} />
            <KeywordSuggestions suggestions={report.keywordSuggestions} isReportLocked={isLocked} />
          </div>
        </div>

        {/* Advanced Suggestions */}
        <AdvancedSuggestions suggestions={report.advancedSuggestions} isReportLocked={isLocked} />

        {/* Recommendations */}
        <Recommendations recommendations={report.recommendations} isReportLocked={isLocked} />
      </div>
    </div>
  );
};