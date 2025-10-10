export interface ScoreDetail {
    score: number;
    breakdown: string[];
  }
  
  export interface Backlink {
      url: string;
      anchorText: string;
      domainAuthority: number;
  }
  
  export interface KeywordData {
    keyword: string;
    relevanceScore: number;
    userIntent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
    topCompetitors: { url: string; rank: number }[];
  }
  
  export interface CompetitorAnalysis {
    url: string;
    strategySummary: string;
    detailedStrategy: {
      content: string;
      linkBuilding: string;
      onPageAndTechnical: string;
    };
  }
  
  export interface ContentSuggestion {
    keyword: string;
    suggestionTitle: string;
    description: string;
    targetAudience: string;
    suggestedHeadings: string[];
  }
  
  export interface KeywordSuggestion {
      keyword: string;
      type: 'Long-Tail' | 'Informational' | 'Transactional' | 'Navigational' | 'Local';
      relevance: string;
      optimizationTips: string;
      implementationExample: string;
  }
  
  export interface AdvancedSuggestion {
    title: string;
    description: string;
    category: 'Technical SEO' | 'Content Strategy' | 'User Experience' | 'Local SEO';
  }
  
  export interface BrokenLink {
    url: string;
    foundOn: string;
  }
  
  export interface RobotsTxtAnalysis {
    hasRobotsTxt: boolean;
    isValid: boolean;
    recommendations: string[];
  }
  
  export interface SitemapAnalysis {
    hasSitemap: boolean;
    isValid: boolean;
    recommendations: string[];
  }
  
  export interface BrokenLinksAnalysis {
      brokenLinks: BrokenLink[];
      recommendations: string[];
  }
  
  export interface GoogleAnalyticsAnalysis {
      isSetup: boolean;
      recommendations: string[];
  }
  
  export interface GoogleSearchConsoleAnalysis {
      isSetup: boolean;
      recommendations: string[];
  }
  
  export interface TechnicalAudit {
      robotsTxt: RobotsTxtAnalysis;
      sitemap: SitemapAnalysis;
      brokenLinks: BrokenLinksAnalysis;
      googleAnalytics: GoogleAnalyticsAnalysis;
      googleSearchConsole: GoogleSearchConsoleAnalysis;
  }
  
  export interface SeoReport {
    url: string;
    analyzedSubPages?: string[];
    scores: {
      onPageSeo: ScoreDetail;
      contentQuality: ScoreDetail;
      backlinks: ScoreDetail & { topBacklinks: Backlink[] };
      readability: ScoreDetail;
    };
    technicalAudit: TechnicalAudit;
    keywords: KeywordData[];
    competitorAnalysis: CompetitorAnalysis[];
    recommendations: string[];
    contentSuggestions: ContentSuggestion[];
    keywordGaps: string[];
    keywordSuggestions: KeywordSuggestion[];
    advancedSuggestions: AdvancedSuggestion[];
  }
  