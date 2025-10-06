// @google/genai API call to analyze website SEO
import { GoogleGenAI, Type } from "@google/genai";
import { SeoReport } from '../types';

// Per instructions, API key is in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const seoReportSchema = {
    type: Type.OBJECT,
    properties: {
        url: { type: Type.STRING, description: "The main URL that was analyzed." },
        scores: {
            type: Type.OBJECT,
            properties: {
                onPageSeo: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER, description: "On-page SEO score from 0-100." },
                        breakdown: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of positive factors for the on-page SEO score." }
                    },
                    required: ["score", "breakdown"]
                },
                contentQuality: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER, description: "Content quality score from 0-100." },
                        breakdown: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of positive factors for the content quality score." }
                    },
                    required: ["score", "breakdown"]
                },
                backlinks: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER, description: "Backlinks profile score from 0-100." },
                        breakdown: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of positive factors for the backlinks score." },
                        topBacklinks: {
                            type: Type.ARRAY,
                            description: "A list of 3-5 simulated high-quality backlinks.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    url: { type: Type.STRING, description: "The URL of the linking page." },
                                    anchorText: { type: Type.STRING, description: "The anchor text of the link." },
                                    domainAuthority: { type: Type.INTEGER, description: "Estimated Domain Authority (0-100) of the linking domain." }
                                },
                                required: ["url", "anchorText", "domainAuthority"]
                            }
                        }
                    },
                    required: ["score", "breakdown", "topBacklinks"]
                },
                 readability: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER, description: "Readability score from 0-100, where higher is better." },
                        breakdown: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of factors contributing to the readability score." }
                    },
                    required: ["score", "breakdown"]
                },
            },
            required: ["onPageSeo", "contentQuality", "backlinks", "readability"]
        },
        technicalAudit: {
            type: Type.OBJECT,
            description: "An audit of the site's technical SEO health.",
            properties: {
                robotsTxt: {
                    type: Type.OBJECT,
                    properties: {
                        hasRobotsTxt: { type: Type.BOOLEAN },
                        isValid: { type: Type.BOOLEAN },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable recommendations for the robots.txt file." }
                    },
                    required: ["hasRobotsTxt", "isValid", "recommendations"]
                },
                sitemap: {
                    type: Type.OBJECT,
                    properties: {
                        hasSitemap: { type: Type.BOOLEAN },
                        isValid: { type: Type.BOOLEAN },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable recommendations for the sitemap.xml file." }
                    },
                    required: ["hasSitemap", "isValid", "recommendations"]
                },
                brokenLinks: {
                    type: Type.OBJECT,
                    properties: {
                        brokenLinks: {
                            type: Type.ARRAY,
                            description: "A list of identified broken internal links (404 errors).",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    url: { type: Type.STRING, description: "The URL of the broken link." },
                                    foundOn: { type: Type.STRING, description: "The page where the broken link was found." }
                                },
                                required: ["url", "foundOn"]
                            }
                        },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable recommendations for fixing broken links and managing 404s." }
                    },
                    required: ["brokenLinks", "recommendations"]
                },
                googleAnalytics: {
                    type: Type.OBJECT,
                    properties: {
                        isSetup: { type: Type.BOOLEAN, description: "Whether Google Analytics tracking code is detected." },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommendations for Google Analytics setup or optimization." }
                    },
                    required: ["isSetup", "recommendations"]
                },
                googleSearchConsole: {
                    type: Type.OBJECT,
                    properties: {
                        isSetup: { type: Type.BOOLEAN, description: "An inference on whether Google Search Console is likely set up." },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommendations for GSC setup, verification, and usage." }
                    },
                    required: ["isSetup", "recommendations"]
                }
            },
            required: ["robotsTxt", "sitemap", "brokenLinks", "googleAnalytics", "googleSearchConsole"]
        },
        keywords: {
            type: Type.ARRAY,
            description: "Analysis of 5-7 top keywords relevant to the website's content.",
            items: {
                type: Type.OBJECT,
                properties: {
                    keyword: { type: Type.STRING },
                    rank: { type: Type.INTEGER, description: "Current estimated search engine rank for this keyword." },
                    searchVolume: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                    competition: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                    rankingHistory: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: "Simulated ranking history over the last 6 weeks (e.g., [12, 10, 11, 9, 8, 8])." },
                    topCompetitors: {
                        type: Type.ARRAY,
                        description: "Top 2-3 competitors for this keyword.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                url: { type: Type.STRING },
                                rank: { type: Type.INTEGER }
                            },
                            required: ["url", "rank"]
                        }
                    }
                },
                required: ["keyword", "rank", "searchVolume", "competition", "rankingHistory", "topCompetitors"]
            }
        },
        competitorAnalysis: {
            type: Type.ARRAY,
            description: "Detailed analysis for each unique competitor URL found in the keyword analysis.",
            items: {
                type: Type.OBJECT,
                properties: {
                    url: { type: Type.STRING },
                    strategySummary: { type: Type.STRING, description: "A brief, one-sentence summary of the competitor's SEO strategy." },
                    detailedStrategy: {
                        type: Type.OBJECT,
                        properties: {
                            content: { type: Type.STRING, description: "Analysis of the competitor's content strategy." },
                            linkBuilding: { type: Type.STRING, description: "Analysis of the competitor's link building strategy." },
                            onPageAndTechnical: { type: Type.STRING, description: "Analysis of the competitor's on-page and technical SEO." }
                        },
                        required: ["content", "linkBuilding", "onPageAndTechnical"]
                    }
                },
                required: ["url", "strategySummary", "detailedStrategy"]
            }
        },
        recommendations: {
            type: Type.ARRAY,
            description: "A list of 5-7 high-impact, actionable SEO recommendations.",
            items: { type: Type.STRING }
        },
        contentSuggestions: {
            type: Type.ARRAY,
            description: "2-3 specific content briefs to attract more traffic.",
            items: {
                type: Type.OBJECT,
                properties: {
                    keyword: { type: Type.STRING, description: "The target keyword for the content suggestion." },
                    suggestionTitle: { type: Type.STRING, description: "A catchy, SEO-friendly title for a new blog post or page." },
                    description: { type: Type.STRING, description: "A brief description of what the content should cover." },
                    targetAudience: { type: Type.STRING, description: "The intended audience for this content." },
                    suggestedHeadings: { type: Type.ARRAY, items: {type: Type.STRING}, description: "An array of suggested H2 or H3 headings for the content structure." }
                },
                required: ["keyword", "suggestionTitle", "description", "targetAudience", "suggestedHeadings"]
            }
        },
        keywordGaps: {
            type: Type.ARRAY,
            description: "A list of 4-6 keywords that competitors rank for but the main site does not.",
            items: { type: Type.STRING }
        },
        keywordSuggestions: {
            type: Type.ARRAY,
            description: "3-4 strategic keyword suggestions with optimization and implementation guidance.",
            items: {
                type: Type.OBJECT,
                properties: {
                    keyword: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['Long-Tail', 'Informational', 'Transactional', 'Navigational', 'Local'], description: "The type of keyword." },
                    relevance: { type: Type.STRING, description: "Why this keyword is relevant to the website's industry." },
                    optimizationTips: { type: Type.STRING, description: "Actionable tips on how to optimize for this keyword." },
                    implementationExample: { type: Type.STRING, description: "A concrete example of how to use this keyword in a sentence or heading." }
                },
                required: ["keyword", "type", "relevance", "optimizationTips", "implementationExample"]
            }
        },
        advancedSuggestions: {
            type: Type.ARRAY,
            description: "4 advanced, strategic suggestions covering different areas of SEO.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    category: { type: Type.STRING, enum: ['Technical SEO', 'Content Strategy', 'User Experience', 'Local SEO'] }
                },
                required: ["title", "description", "category"]
            }
        },
    },
    required: ["url", "scores", "technicalAudit", "keywords", "competitorAnalysis", "recommendations", "contentSuggestions", "keywordGaps", "keywordSuggestions", "advancedSuggestions"]
};


const generatePrompt = (mainUrl: string): string => {
    let prompt = `Analyze the SEO and performance of the website: ${mainUrl}.
    
    IMPORTANT: First, act as a web crawler. Simulate crawling the entire website starting from ${mainUrl} to discover all its internal pages. Your entire analysis must be based on this simulated full-site crawl, not just the single URL provided.

    Provide a comprehensive SEO report. Base your analysis on established SEO best practices.
    The output must be a JSON object that strictly follows the provided schema.

    Your analysis must include:
    1.  **Scores (0-100)**: On-Page SEO, Content Quality, Backlinks Profile, and a Readability score. For each, provide a score and a breakdown of positive factors. For the Backlinks score, also include a 'topBacklinks' array with 3-5 simulated examples of high-quality backlinks, including their URL, anchor text, and estimated Domain Authority.
    2.  **Technical SEO Audit**:
        - **Robots.txt Analysis**: Check for its presence and validity. Provide recommendations for any misconfigurations.
        - **Sitemap.xml Analysis**: Check for its presence, validity, and whether it appears up-to-date. Provide recommendations.
        - **Broken Links (404s)**: Based on your simulated crawl, identify 3-5 broken internal links. For each, list the broken URL and the page it was found on. Provide recommendations for fixing them.
        - **Google Analytics Check**: Check for the presence of a Google Analytics tracking code (gtag.js or analytics.js). If not present, recommend setting it up. If present, recommend setting up goals or events.
        - **Google Search Console Check**: Infer if GSC is likely set up. If not, recommend the verification process and sitemap submission. If it is likely set up, recommend leveraging its performance reports.
    3.  **Keyword Analysis**: Identify 5-7 primary keywords for the entire site. For each, provide current rank, search volume (Low, Medium, High), competition (Low, Medium, High), a simulated ranking history for the past 6 weeks, and the top 2-3 competitors.
    4.  **Competitor Deep Dive**: For each unique competitor identified, provide a summary of their strategy and a more detailed breakdown of their content, link building, and on-page/technical SEO.
    5.  **Actionable Recommendations**: A list of 5-7 high-impact, actionable steps to improve SEO.
    6.  **Content Briefs**: 2-3 detailed content briefs. Each brief should include a target keyword, a catchy title, a description, a defined target audience, and a list of suggested headings.
    7.  **Keyword Gaps**: 4-6 keywords that competitors rank for but the main site does not.
    8.  **Keyword Suggestions**: 3-4 strategic keyword suggestions relevant to the website's industry. For each, specify its type (e.g., 'Long-Tail'), its relevance, actionable optimization tips, and a concrete implementation example.
    9.  **Advanced Suggestions**: 4 strategic suggestions, one for each category: 'Technical SEO', 'Content Strategy', 'User Experience', and 'Local SEO'.

    Generate plausible but realistic data for all fields. The analysis should feel like it was generated by a professional SEO tool. Do not include any explanatory text outside of the JSON object.
    `;
    return prompt;
};


export const analyzeWebsite = async (mainUrl: string): Promise<SeoReport> => {
    const prompt = generatePrompt(mainUrl);
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: seoReportSchema,
            }
        });

        const reportJson = response.text.trim();
        const report: SeoReport = JSON.parse(reportJson);

        if (!report.url) {
            report.url = mainUrl;
        }

        return report;
    } catch (error) {
        console.error("Error analyzing website with Gemini API:", error);
        throw new Error("Failed to get a valid response from the AI model.");
    }
};