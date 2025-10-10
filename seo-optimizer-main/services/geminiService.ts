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
                        score: { type: Type.INTEGER, description: "Backlinks profile score from 0-100, based on inferred authority and industry relevance." },
                        breakdown: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of positive factors for the backlinks score." },
                        topBacklinks: {
                            type: Type.ARRAY,
                            description: "A list of 3-5 examples of IDEAL, high-quality backlinks the site should aim to acquire.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    url: { type: Type.STRING, description: "The URL of a relevant, high-authority page that would be an ideal backlink source." },
                                    anchorText: { type: Type.STRING, description: "Plausible anchor text for such a link." },
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
            description: "An audit of the site's technical SEO health based on live inspection.",
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
                            description: "A list of identified broken internal links (404 errors) found during the crawl.",
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
                        isSetup: { type: Type.BOOLEAN, description: "Whether a Google Analytics tracking script (gtag.js or analytics.js) is detected in the site's source code." },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommendations for Google Analytics setup or optimization." }
                    },
                    required: ["isSetup", "recommendations"]
                },
                googleSearchConsole: {
                    type: Type.OBJECT,
                    properties: {
                        isSetup: { type: Type.BOOLEAN, description: "An inference on whether Google Search Console is likely set up (cannot be directly detected)." },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommendations for GSC setup, verification, and usage." }
                    },
                    required: ["isSetup", "recommendations"]
                }
            },
            required: ["robotsTxt", "sitemap", "brokenLinks", "googleAnalytics", "googleSearchConsole"]
        },
        keywords: {
            type: Type.ARRAY,
            description: "Analysis of 5-7 top keywords based on the website's content.",
            items: {
                type: Type.OBJECT,
                properties: {
                    keyword: { type: Type.STRING },
                    relevanceScore: { type: Type.INTEGER, description: "A score from 1-10 indicating how well the site's content currently targets this keyword." },
                    userIntent: { type: Type.STRING, enum: ["Informational", "Commercial", "Transactional", "Navigational"], description: "The likely user intent behind a search for this keyword." },
                    topCompetitors: {
                        type: Type.ARRAY,
                        description: "Top 2-3 ranking competitors for this keyword, based on public search results.",
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
                required: ["keyword", "relevanceScore", "userIntent", "topCompetitors"]
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


const generatePrompt = (mainUrl: string, subPages: string[]): string => {
    let prompt = `Analyze the SEO and performance of the website: ${mainUrl}.
    
    IMPORTANT: First, act as an expert SEO analyst with real-time web access. Browse the provided URL and its connected pages to gather real information. Your entire analysis must be based on the actual content and structure of the live website. DO NOT simulate or invent data that cannot be verified by inspecting the site (e.g., search volume, historical ranks).`;

    if (subPages.length > 0) {
        prompt += `\n\nIn addition to the main URL, pay special attention to the following key sub-pages. Ensure your analysis reflects specific findings from these URLs:\n${subPages.map(p => `- ${p}`).join('\n')}`;
    }

    prompt += `

    Provide a comprehensive SEO report. The output must be a JSON object that strictly follows the provided schema.

    Your analysis must include:
    1.  **Scores (0-100)**: On-Page SEO, Content Quality, Backlinks Profile, and a Readability score. For each, provide a score and a breakdown of positive factors. For the Backlinks score, analyze the site's content and industry to identify 3-5 examples of IDEAL, high-quality domains that would be valuable backlink sources. Provide plausible anchor text and their estimated Domain Authority. This is a strategic exercise, not a report of existing links.
    2.  **Technical SEO Audit**:
        - **Robots.txt Analysis**: Inspect the live site for a robots.txt file. Report on its presence and validity, providing recommendations for any issues found.
        - **Sitemap.xml Analysis**: Inspect the live site for a sitemap.xml file. Report on its presence, validity, and apparent completeness. Provide recommendations.
        - **Broken Links (404s)**: Based on your crawl, identify up to 5 broken internal links. For each, list the broken URL and the page it was found on. Provide recommendations.
        - **Google Analytics Check**: Inspect the site's source code for a Google Analytics tracking script (gtag.js or analytics.js). Report if it is set up.
        - **Google Search Console Check**: Infer if GSC is likely set up (as this cannot be directly checked). Provide recommendations on its use.
    3.  **Keyword Analysis**: Based on the site's content, identify 5-7 primary keywords. For each, provide a 'relevanceScore' (1-10) for how well the site's content targets the keyword, and deduce the primary 'userIntent' (Informational, Commercial, Transactional, or Navigational). List the top 2-3 publicly visible competitors for this keyword. DO NOT invent rank, search volume, or ranking history.
    4.  **Competitor Deep Dive**: For each unique competitor identified, browse their site and provide a summary of their strategy and a more detailed breakdown of their content, link building, and on-page/technical SEO.
    5.  **Actionable Recommendations**: A list of 5-7 high-impact, actionable steps to improve SEO.
    6.  **Content Briefs**: 2-3 detailed content briefs based on content gaps you identified. Each brief should include a target keyword, a catchy title, a description, a defined target audience, and a list of suggested headings.
    7.  **Keyword Gaps**: 4-6 keywords that competitors seem to target but the main site does not, based on your analysis.
    8.  **Keyword Suggestions**: 3-4 strategic keyword suggestions relevant to the website's industry. For each, specify its type, its relevance, actionable optimization tips, and a concrete implementation example.
    9.  **Advanced Suggestions**: 4 strategic suggestions, one for each category: 'Technical SEO', 'Content Strategy', 'User Experience', and 'Local SEO'.

    Generate a report based on real, observable data from the website. Do not include any explanatory text outside of the JSON object.
    `;
    return prompt;
};


export const analyzeWebsite = async (mainUrl: string, subPages: string[]): Promise<SeoReport> => {
    const prompt = generatePrompt(mainUrl, subPages);
    const modelsToTry = ['gemini-2.5-pro', 'gemini-2.5-flash'];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Attempting analysis with model: ${modelName}`);
            const response = await ai.models.generateContent({
                model: modelName,
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
            
            if (subPages.length > 0) {
                report.analyzedSubPages = subPages;
            }

            console.log(`Successfully generated report with model: ${modelName}`);
            return report; // Success, exit the loop and return the report

        } catch (error) {
            console.warn(`Analysis with model ${modelName} failed. Retrying with next model...`, error);
            lastError = error;
            // The loop will continue to the next model if there is one.
        }
    }
    
    // If the loop completes without returning, it means all models failed.
    console.error("All models failed to generate a response.", lastError);
    throw new Error("Failed to get a valid response from the AI model after trying all available options.");
};