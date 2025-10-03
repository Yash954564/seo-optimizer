import React from 'react';
import { TechnicalAudit } from '../types';
import { FileCodeIcon, SitemapIcon, BrokenLinkIcon, CheckCircleIcon, AnalyticsIcon, SearchConsoleIcon } from './icons';

interface TechnicalAuditReportProps {
  audit: TechnicalAudit;
  isLocked: boolean;
}

const StatusIndicator: React.FC<{ isPositive: boolean, positiveText: string, negativeText: string }> = ({ isPositive, positiveText, negativeText }) => (
    <span className={`px-2 py-1 text-xs font-bold rounded-full ${isPositive ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
        {isPositive ? positiveText : negativeText}
    </span>
);

const AuditCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    statusIndicator: React.ReactNode;
    recommendations: string[];
}> = ({ icon, title, statusIndicator, recommendations }) => (
    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
                {icon}
                <h3 className="font-semibold text-white">{title}</h3>
            </div>
            {statusIndicator}
        </div>
        <ul className="space-y-2">
            {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                </li>
            ))}
        </ul>
    </div>
);


export const TechnicalAuditReport: React.FC<TechnicalAuditReportProps> = ({ audit, isLocked }) => {
  const { robotsTxt, sitemap, brokenLinks, googleAnalytics, googleSearchConsole } = audit;

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-slide-in-up shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Technical SEO Audit</h2>
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
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
                <BrokenLinkIcon className="w-6 h-6 text-brand-primary" />
                <h3 className="text-lg font-bold text-white">Broken Links & 404 Errors</h3>
            </div>
            {brokenLinks.brokenLinks.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-800 text-xs text-gray-300 uppercase">
                            <tr>
                                <th scope="col" className="px-4 py-2">Broken URL</th>
                                <th scope="col" className="px-4 py-2">Found On Page</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brokenLinks.brokenLinks.map((link, index) => {
                                const isBlurred = isLocked && index > 0;
                                return (
                                    <tr 
                                      key={index} 
                                      className={`border-b border-slate-600 transition-all duration-300 ${isBlurred ? 'blur-sm pointer-events-none select-none' : ''}`}
                                      aria-hidden={isBlurred}
                                    >
                                        <td className="px-4 py-2 font-mono text-red-400 truncate max-w-xs">{link.url}</td>
                                        <td className="px-4 py-2 font-mono text-gray-400 truncate max-w-xs">{link.foundOn}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-400 py-4">No broken internal links were found.</p>
            )}
            <div className="mt-4 border-t border-slate-600 pt-3">
                <h4 className="font-semibold text-gray-300">Recommendations:</h4>
                 <ul className="space-y-2 mt-2">
                    {brokenLinks.recommendations.map((rec, index) => {
                        const isBlurred = isLocked && index > 0;
                        return (
                          <li 
                            key={index} 
                            className={`flex items-start gap-2 text-sm text-gray-400 transition-all duration-300 ${isBlurred ? 'blur-sm pointer-events-none select-none' : ''}`}
                            aria-hidden={isBlurred}
                          >
                            <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        );
                    })}
                  </ul>
            </div>
        </div>
      </div>
    </div>
  );
};