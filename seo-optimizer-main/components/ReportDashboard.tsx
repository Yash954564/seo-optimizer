import React from 'react';
import { SeoReport } from '../types';
import { SeoScoreCard } from './SeoScoreCard';
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

const childAnimation = (index: number): React.CSSProperties => ({
    animation: `slideInUp 0.5s ease-in-out forwards`,
    animationDelay: `${index * 150}ms`,
    opacity: 0,
});


export const ReportDashboard: React.FC<ReportDashboardProps> = ({ report, onDownloadPdf, isPdfMode, isReportLocked }) => {
  const isLocked = isReportLocked && !isPdfMode;

  return (
    <div className="mt-8 space-y-12">
      <div style={childAnimation(0)} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-white rounded-lg shadow-lg border border-slate-200">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-text-primary">SEO <span className="text-brand-primary">Analysis Report</span></h2>
          <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline break-all">{report.url}</a>
          {report.analyzedSubPages && report.analyzedSubPages.length > 0 && (
            <div className="mt-2">
                <h3 className="text-xs font-semibold text-text-secondary uppercase">Focused On Sub-pages:</h3>
                <ul className="list-disc list-inside text-sm text-text-secondary">
                    {report.analyzedSubPages.map((page, index) => (
                        <li key={index} className="truncate">{page}</li>
                    ))}
                </ul>
            </div>
          )}
        </div>
        
      </div>

      {/* Scores Section */}
      <div style={childAnimation(1)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SeoScoreCard title="On-Page SEO" scoreData={report.scores.onPageSeo} />
        <SeoScoreCard title="Content Quality" scoreData={report.scores.contentQuality} />
        <SeoScoreCard title="Readability" scoreData={report.scores.readability} />
        <SeoScoreCard title="Backlinks Profile" scoreData={report.scores.backlinks} />
      </div>
      
      {/* Main Content with partial blur */}
      <div style={childAnimation(2)} className="space-y-12">
        {/* Technical Audit Section */}
        <TechnicalAuditReport audit={report.technicalAudit} isReportLocked={isLocked} />

        {/* Keyword Deep Dive & Competitor Analysis */}
        <KeywordDeepDive keywords={report.keywords} competitorInfo={report.competitorAnalysis} isReportLocked={isLocked} />
        
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