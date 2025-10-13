import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { SeoReport } from '../types';
import { BotIcon, PaperAirplaneIcon, SparklesIcon, XMarkIcon, UserCircleIcon } from './icons';

// Per instructions, API key is in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const suggestionChips = [
    "What's the #1 priority from my report?",
    "Analyze on-page SEO for a competitor's URL",
    "What are the latest SEO trends?",
    "Suggest keywords for a blog post about 'AI marketing'",
];

const parseMarkdown = (text: string): string => {
    let html = text
        // Sanitize to prevent basic XSS
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Bold: **text**
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
         // Code blocks: ```language\ncode\n```
        .replace(/```(\w*?)\n([\s\S]*?)\n```/g, (match, lang, code) => {
            return `<pre class="bg-slate-800 text-white p-3 rounded-md my-2 text-sm overflow-x-auto"><code>${code}</code></pre>`;
        })
        // Lists: * item or - item (handles multi-line lists)
        .replace(/(?:(?:^|\n)[\*\-]\s.+)+/g, (match) => {
            const items = match.trim().split('\n').map(item => `<li class="ml-4 list-disc">${item.substring(2)}</li>`).join('');
            return `<ul>${items}</ul>`;
        })
        .replace(/\n/g, '<br />'); // Handle remaining newlines

    // Clean up adjacent list tags that can result from line-by-line processing
    html = html.replace(/<\/ul\>(\s*|<br \/>)*<ul\>/g, '');

    return html;
};


export const Chatbot: React.FC<{ report: SeoReport }> = ({ report }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize chat session when component mounts with report
        if (report && !chatRef.current) {
            const systemInstruction = `You are a world-class, real-time SEO AI assistant with the ability to perform live analysis and research on the web. Your purpose is to be a proactive SEO partner for the user.
- **You have been provided with an initial SEO report for context, but you are NOT limited to this data.** For any new query about a URL, competitor, keyword, or SEO topic, you must perform a fresh, up-to-the-minute analysis.
- Use a friendly, professional, and encouraging tone.
- Format responses clearly using Markdown (bolding, lists, code blocks for technical examples like robots.txt or schema).
- When asked to analyze a URL, provide a concise summary of its on-page SEO strengths and weaknesses (e.g., title tag, meta description, heading structure, keyword usage).
- When asked for content ideas or keyword suggestions, provide creative and data-informed answers based on current trends.
- When asked for technical advice (e.g., "how to write a redirect"), provide clear, copy-pasteable examples.

Initial Context Only (do not refer to this as your only source):
Here is the initial SEO report for the website: ${report.url}. Use this to understand the user's starting point.
${JSON.stringify(report, null, 2)}`;

            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstruction,
                }
            });

            setMessages([{
                sender: 'ai',
                text: `Hello! I'm your AI SEO co-pilot. I've reviewed your initial report for **${report.url}**, but my capabilities go far beyond that. I can perform live analysis on any URL, research new keywords, or brainstorm content ideas. What's our first mission?`
            }]);
        }
    }, [report]);

    useEffect(() => {
        // Auto-scroll to the latest message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const newUserMessage: Message = { sender: 'user', text: messageText };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            if (!chatRef.current) throw new Error("Chat not initialized");

            const stream = await chatRef.current.sendMessageStream({ message: messageText });
            
            let aiResponseText = '';
            // Add an empty AI message bubble to stream into
            setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

            for await (const chunk of stream) {
                aiResponseText += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = aiResponseText;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered an error. Please check your connection or try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSendMessage(userInput);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-30 flex items-center justify-center w-16 h-16 bg-brand-primary rounded-full text-white shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-glow-red animate-fade-in animate-pulse-subtle"
                aria-label={isOpen ? "Close Chat" : "Open AI Assistant"}
            >
                <div className="transition-transform duration-300 ease-in-out" style={{ transform: isOpen ? 'rotate(180deg) scale(0.7)' : 'rotate(0) scale(1)'}}>
                    {isOpen ? <XMarkIcon className="w-8 h-8" /> : <BotIcon className="w-8 h-8" />}
                </div>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-28 right-8 z-30 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col animate-slide-in-up" style={{ height: '70vh', maxHeight: '600px' }}>
                    <header className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0 bg-slate-50 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                <SparklesIcon className="w-6 h-6 text-brand-primary" />
                            </div>
                            <h2 className="text-lg font-bold text-text-primary">AI SEO Assistant</h2>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-full hover:bg-slate-200">
                           <XMarkIcon className="w-6 h-6" />
                        </button>
                    </header>

                    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-brand-bg/20">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''} animate-fade-in`}>
                                {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-brand-primary" /></div>}
                                <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-white text-text-primary rounded-bl-none'}`}>
                                    <div className="text-sm prose" dangerouslySetInnerHTML={{__html: parseMarkdown(msg.text)}}></div>
                                </div>
                                {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0"><UserCircleIcon className="w-5 h-5 text-slate-600" /></div>}
                            </div>
                        ))}
                        {isLoading && messages[messages.length - 1]?.text === '' && (
                            <div className="flex items-start gap-3 animate-fade-in">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-brand-primary" /></div>
                                <div className="max-w-xs md:max-w-sm px-4 py-3 rounded-2xl bg-white text-text-primary rounded-bl-none shadow-sm">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    {messages.length === 1 && !isLoading && (
                         <div className="p-4 border-t border-slate-200 flex-shrink-0">
                            <p className="text-xs text-text-secondary mb-2 font-medium">Or try one of these suggestions:</p>
                             <div className="flex flex-wrap gap-2">
                                {suggestionChips.map(chip => (
                                    <button
                                        key={chip}
                                        onClick={() => handleSendMessage(chip)}
                                        className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-brand-secondary rounded-full border border-slate-200 transition-colors"
                                    >
                                        {chip}
                                    </button>
                                ))}
                             </div>
                         </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 flex-shrink-0">
                        <div className="relative">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask about your report..."
                                className="w-full bg-slate-100 border border-slate-300 rounded-full py-3 pl-4 pr-12 text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition placeholder:text-gray-400 disabled:opacity-70"
                                disabled={isLoading}
                                aria-label="Chat input"
                            />
                            <button type="submit" disabled={isLoading} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-brand-primary text-white rounded-full transition-colors hover:bg-brand-secondary disabled:bg-slate-400 disabled:cursor-not-allowed" aria-label="Send message">
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};