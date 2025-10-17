import React from 'react';
import { TechnicalAudit } from '../types';
import { FileCodeIcon, SitemapIcon, BrokenLinkIcon, CheckCircleIcon, AnalyticsIcon, SearchConsoleIcon } from './icons';

interface TechnicalAuditReportProps {
  audit: TechnicalAudit;
  isReportLocked: boolean;
}

const StatusIndicator: React.FC<{ isPositive: boolean, positiveText: string, negativeText: string }> = ({ isPositive, positiveText, negativeText }) => (
    <span className={`px-2 py-1 text-xs font-bold rounded-full ${isPositive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {isPositive ? positiveText : negativeText}
    </span>
);

const AuditCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    statusIndicator: React.ReactNode;
    recommendations: string[];
}> = ({ icon, title, statusIndicator, recommendations }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
                {icon}
                <h3 className="font-semibold text-text-primary">{title}</h3>
            </div>
            {statusIndicator}
        </div>
        <ul className="space-y-2">
            {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                </li>
            ))}
        </ul>
    </div>
);


export const TechnicalAuditReport: React.FC<TechnicalAuditReportProps> = ({ audit, isReportLocked }) => {
  const { robotsTxt, sitemap, brokenLinks, googleAnalytics, googleSearchConsole } = audit;

  return (
    <div className="animate-slide-in-up">
      <h2 className="text-3xl font-bold text-text-primary text-center mb-6">
        <span className="text-brand-primary">Technical</span> SEO Audit
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">

        {/* Robots.txt Analysis */}
        <AuditCard
            icon={<FileCodeIcon className="w-5 h-5 text-brand-secondary" />}
            title="robots.txt"
            statusIndicator={<StatusIndicator isPositive={robotsTxt.isValid} positiveText={robotsTxt.hasRobotsTxt ? 'Valid' : 'OK'} negativeText={robotsTxt.hasRobotsTxt ? 'Issues Found' : 'Not Found'} />}
            recommendations={robotsTxt.recommendations}
        />

        {/* Sitemap.xml Analysis */}
        <AuditCard
            icon={<SitemapIcon className="w-5 h-5 text-brand-secondary" />}
            title="sitemap.xml"
            statusIndicator={<StatusIndicator isPositive={sitemap.isValid} positiveText={sitemap.hasSitemap ? 'Valid' : 'OK'} negativeText={sitemap.hasSitemap ? 'Issues Found' : 'Not Found'} />}
            recommendations={sitemap.recommendations}
        />

        {/* Google Analytics Analysis */}
        <AuditCard
            icon={<AnalyticsIcon className="w-5 h-5 text-brand-secondary" />}
            title="Google Analytics"
            statusIndicator={<StatusIndicator isPositive={googleAnalytics.isSetup} positiveText="Setup Detected" negativeText="Not Detected" />}
            recommendations={googleAnalytics.recommendations}
        />
        
        {/* Google Search Console Analysis */}
        <AuditCard
            icon={<SearchConsoleIcon className="w-5 h-5 text-brand-secondary" />}
            title="Google Search Console"
            statusIndicator={<StatusIndicator isPositive={googleSearchConsole.isSetup} positiveText="Setup Detected" negativeText="Not Detected" />}
            recommendations={googleSearchConsole.recommendations}
        />


        {/* Broken Links & 404s */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 md:col-span-2 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <BrokenLinkIcon className="w-6 h-6 text-brand-primary" />
                <h3 className="text-lg font-bold text-text-primary">Broken Links & 404 Errors</h3>
            </div>
            {brokenLinks.brokenLinks.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-text-secondary uppercase">
                            <tr>
                                <th scope="col" className="px-4 py-2">Broken URL</th>
                                <th scope="col" className="px-4 py-2">Found On Page</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brokenLinks.brokenLinks.map((link, index) => (
                                <tr 
                                  key={index} 
                                  className={`border-b border-slate-200 transition-all duration-300 ${isReportLocked && index > 0 ? 'blur-md grayscale opacity-60 pointer-events-none select-none' : ''}`}
                                >
                                    <td className="px-4 py-2 font-mono text-red-600 truncate max-w-xs">{link.url}</td>
                                    <td className="px-4 py-2 font-mono text-text-secondary truncate max-w-xs">{link.foundOn}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-text-secondary py-4">No broken internal links were found.</p>
            )}
            <div className="mt-4 border-t border-slate-200 pt-3">
                <h4 className="font-semibold text-text-primary">Recommendations:</h4>
                 <ul className="space-y-2 mt-2">
                    {brokenLinks.recommendations.map((rec, index) => (
                      <li 
                        key={index} 
                        className={`flex items-start gap-2 text-sm text-text-secondary transition-all duration-300 ${isReportLocked && index > 0 ? 'blur-md grayscale opacity-60 pointer-events-none select-none' : ''}`}
                      >
                        <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
            </div>
        </div>
      </div>
    </div>
  );
};