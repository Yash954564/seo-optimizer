import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { SeoReport } from '../types';
import { PaperAirplaneIcon, SparklesIcon, XMarkIcon, UserCircleIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, ArrowPathIcon, ClockIcon, ClipboardIcon, CheckCircleIcon, ScholarIcon } from './icons';
import { generateChatSuggestions } from '../services/geminiService';

// Per instructions, API key is in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Message {
    sender: 'user' | 'ai';
    text: string;
    status?: 'pending' | 'sent';
}

interface ChatbotProps {
    report: SeoReport;
    isChatAllowed: boolean;
    onRequestAccess: () => void;
}

const staticSuggestionChips = [
    "What's the #1 priority from my report?",
    "Analyze on-page SEO for a competitor's URL",
    "What are the latest SEO trends?",
    "Suggest keywords for a blog post about 'AI marketing'",
];

// Helper component for rendering code blocks with a copy button
const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <div className="relative my-2">
            <pre className="bg-slate-800 text-white p-3 rounded-md text-sm overflow-x-auto">
                <code>{code}</code>
            </pre>
            <button
                onClick={handleCopy}
                aria-label="Copy code"
                className="absolute top-2 right-2 p-1.5 bg-slate-600 hover:bg-slate-500 rounded-md text-slate-200 transition-colors"
            >
                {copied ? <CheckCircleIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
            </button>
        </div>
    );
};

// Helper function to parse markdown for non-code text
const parseRegularMarkdown = (text: string): string => {
    return text
        .replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
        .replace(/(?:(?:^|\n)[\*\-]\s.+)+/g, (match) => {
            const items = match.trim().split('\n').map(item => `<li class="ml-4 list-disc">${item.substring(2)}</li>`).join('');
            return `<ul>${items}</ul>`;
        })
        .replace(/\n/g, '<br />')
        .replace(/<\/ul\>(\s*|<br \/>)*<ul\>/g, '');
};

// Helper component to render message content with markdown parsing
const MessageContent: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split(/(```[\s\S]*?```)/);
    return (
        <div className="text-sm prose max-w-none prose-p:my-0 prose-ul:my-2">
            {parts.map((part, index) => {
                if (part.startsWith('```')) {
                    const code = part.replace(/```\w*\n?/, '').replace(/```$/, '');
                    return <CodeBlock key={index} code={code.trim()} />;
                } else {
                    return <span key={index} dangerouslySetInnerHTML={{ __html: parseRegularMarkdown(part) }} />;
                }
            })}
        </div>
    );
};

export const Chatbot: React.FC<ChatbotProps> = ({ report, isChatAllowed, onRequestAccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestionChips, setSuggestionChips] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatStorageKey = `chatHistory_${report.url?.replace(/https?:\/\//, '')}`;
    
    const initializeChat = () => {
        const systemInstruction = `You are a world-class, real-time SEO AI assistant with the ability to perform live analysis and research on the web. Your purpose is to be a proactive SEO partner for the user.
- **You have been provided with an initial SEO report for context, but you are NOT limited to this data.** For any new query about a URL, competitor, keyword, or SEO topic, you must perform a fresh, up-to-the-minute analysis.
- Use a friendly, professional, and encouraging tone.
- Format responses clearly using Markdown (bolding, lists, code blocks for technical examples like robots.txt or schema, and inline code for technical terms).
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
    }

    useEffect(() => {
        if (!isOpen || !report) return;

        const savedMessages = localStorage.getItem(chatStorageKey);
        if (savedMessages && JSON.parse(savedMessages).length > 0) {
            setMessages(JSON.parse(savedMessages));
        } else {
             setMessages([{
                sender: 'ai',
                text: `Hello! I'm your AI SEO co-pilot. I've reviewed your initial report for **${report.url}**, but my capabilities go far beyond that. I can perform live analysis on any URL, research new keywords, or brainstorm content ideas. What's our first mission?`
            }]);
        }
        
        const fetchSuggestions = async () => {
            setIsLoadingSuggestions(true);
            try {
                const suggestions = await generateChatSuggestions(report);
                setSuggestionChips(suggestions.length > 0 ? suggestions : staticSuggestionChips);
            } catch (e) {
                console.error("Could not fetch suggestions, using fallback", e);
                setSuggestionChips(staticSuggestionChips);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };

        fetchSuggestions();
        initializeChat();
    }, [isOpen, report]);

    useEffect(() => {
        if (messages.length > 0 && isOpen) {
            localStorage.setItem(chatStorageKey, JSON.stringify(messages));
        }
    }, [messages, chatStorageKey, isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleNewChat = () => {
        localStorage.removeItem(chatStorageKey);
        setMessages([{
            sender: 'ai',
            text: `Starting a new chat! I still have your original report for **${report.url}** as context. How can I help you now?`
        }]);
        initializeChat();
    };

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const newUserMessage: Message = { sender: 'user', text: messageText, status: 'pending' };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            if (!chatRef.current) throw new Error("Chat not initialized");

            const stream = await chatRef.current.sendMessageStream({ message: messageText });
            
            let aiResponseText = '';
            setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

            for await (const chunk of stream) {
                aiResponseText += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = aiResponseText;
                    if (newMessages.length > 1 && newMessages[newMessages.length - 2].sender === 'user') {
                        newMessages[newMessages.length - 2].status = 'sent';
                    }
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered an error. Please check your connection or try again in a moment." }]);
        } finally {
            setIsLoading(false);
            setMessages(prev => prev.map(msg => msg.status === 'pending' ? { ...msg, status: 'sent' } : msg));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSendMessage(userInput);
    };
    
    const handleOpenClick = () => {
      if (isChatAllowed) {
        setIsOpen(true);
      } else {
        onRequestAccess();
      }
    };

    // Automatically open the chat if access was just granted
    useEffect(() => {
        if (isChatAllowed && !isOpen) {
            // Check if this permission was granted in response to a direct request
            // This is tricky. Let's stick to the user clicking again.
            // A more complex solution would involve more state from App.tsx.
        }
    }, [isChatAllowed, isOpen]);


    return (
        <>
            {!isOpen && (
                <button
                    onClick={handleOpenClick}
                    className="fixed bottom-8 right-8 z-30 flex items-center gap-3 bg-brand-primary text-white font-bold py-4 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-glow-red animate-fade-in animate-pulse-subtle"
                    aria-label="Open AI Assistant"
                >
                    <ScholarIcon className="w-7 h-7" />
                    <span className="whitespace-nowrap">Chat with an <span className="font-extrabold underline">Expert</span></span>
                </button>
            )}

            {isOpen && (
                <div className={`fixed z-30 flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 animate-slide-in-up ${isFullScreen ? 'inset-4' : 'bottom-8 right-8 w-full max-w-md'}`} style={!isFullScreen ? { height: 'calc(100vh - 8rem)', maxHeight: '650px' } : {}}>
                    <header className="flex items-center justify-between p-3 border-b border-slate-200 flex-shrink-0 bg-slate-50 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                <ScholarIcon className="w-6 h-6 text-brand-primary" />
                            </div>
                             <div>
                                <h2 className="text-lg font-bold text-text-primary">Chat with an SEO Expert</h2>
                                <p className="text-xs text-text-secondary">Powered by Gemini</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-1">
                            <button onClick={handleNewChat} className="text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-slate-200" aria-label="New Chat">
                                <ArrowPathIcon className="w-5 h-5" />
                            </button>
                             <button onClick={() => setIsFullScreen(!isFullScreen)} className="text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-slate-200" aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}>
                                {isFullScreen ? <ArrowsPointingInIcon className="w-5 h-5"/> : <ArrowsPointingOutIcon className="w-5 h-5" />}
                            </button>
                             <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-slate-200" aria-label="Close chat">
                               <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </header>

                    <div className={`flex-1 p-4 space-y-5 overflow-y-auto ${isFullScreen ? 'md:px-8 lg:px-16' : ''}`} style={{
                        backgroundColor: '#F8F9FA',
                        backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 w-full animate-fade-in ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm"><SparklesIcon className="w-5 h-5 text-brand-primary" /></div>}
                                <div className={`px-4 py-2 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-white text-text-primary rounded-bl-none border border-slate-200'} ${isFullScreen ? 'md:max-w-xl lg:max-w-2xl' : 'max-w-xs md:max-w-sm'}`}>
                                    <MessageContent text={msg.text} />
                                </div>
                                <div className="flex items-center self-end h-8">
                                    {msg.sender === 'user' && msg.status === 'pending' && <ClockIcon className="w-4 h-4 text-slate-400" />}
                                    {msg.sender === 'user' && msg.status !== 'pending' && <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm"><UserCircleIcon className="w-5 h-5 text-brand-primary" /></div>}
                                </div>
                            </div>
                        ))}
                        {isLoading && messages[messages.length - 1]?.text === '' && (
                            <div className="flex items-start gap-3 animate-fade-in">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm"><SparklesIcon className="w-5 h-5 text-brand-primary" /></div>
                                <div className="max-w-xs md:max-w-sm px-4 py-3 rounded-2xl bg-white text-text-primary rounded-bl-none shadow-sm border border-slate-200">
                                    <p className="text-sm italic text-slate-500">AI is typing...</p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    {messages.length <= 1 && !isLoading && (
                         <div className="p-4 border-t border-slate-200 flex-shrink-0">
                            <p className="text-xs text-text-secondary mb-2 font-medium">Or try one of these suggestions:</p>
                             {isLoadingSuggestions ? (
                                <div className="flex flex-wrap gap-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="px-3 py-1.5 text-sm bg-slate-200 rounded-full h-8 w-48 animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {suggestionChips.map(chip => (
                                        <button
                                            key={chip}
                                            onClick={() => handleSendMessage(chip)}
                                            className="px-3 py-1.5 text-sm bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-full border border-brand-primary/20 transition-colors font-medium"
                                        >
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            )}
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
                            <button type="submit" disabled={isLoading || !userInput.trim()} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-brand-primary text-white rounded-full transition-colors hover:bg-brand-secondary disabled:bg-slate-400 disabled:cursor-not-allowed" aria-label="Send message">
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};