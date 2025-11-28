import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const ChatInterface = ({ chatHistory, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isLoading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 relative">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl"></div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {chatHistory.length === 0 && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-full text-slate-500 space-y-6"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <div className="relative bg-slate-800/50 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                                <Bot size={48} className="text-slate-400" />
                            </div>
                        </div>
                        <div className="text-center space-y-2 max-w-md">
                            <h3 className="text-xl font-semibold text-white">How can I help you?</h3>
                            <p className="text-sm text-slate-400">
                                Ask me to explain code, find bugs, or suggest improvements for this repository.
                            </p>
                        </div>
                    </motion.div>
                )}

                {chatHistory.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
                            {/* Avatar */}
                            <div className={`
                                w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg
                                ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-accent-primary to-accent-secondary'
                                    : 'bg-slate-800 border border-slate-700'
                                }
                            `}>
                                {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-accent-primary" />}
                            </div>

                            {/* Message Bubble */}
                            <div className={`
                                relative rounded-2xl p-5 shadow-sm
                                ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-accent-primary to-accent-secondary text-white rounded-tr-sm'
                                    : 'bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-tl-sm backdrop-blur-sm'
                                }
                            `}>
                                {msg.role === 'user' ? (
                                    <div className="whitespace-pre-wrap text-[15px] leading-relaxed font-medium">{msg.content}</div>
                                ) : (
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeRaw]}
                                            components={{
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    const codeContent = String(children).replace(/\n$/, '');

                                                    return !inline && match ? (
                                                        <div className="my-4 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
                                                            <div className="bg-slate-950/50 px-4 py-2 flex items-center justify-between border-b border-slate-700/50">
                                                                <span className="text-xs font-mono text-slate-400">{match[1]}</span>
                                                            </div>
                                                            <SyntaxHighlighter
                                                                language={match[1]}
                                                                style={vscDarkPlus}
                                                                customStyle={{
                                                                    margin: 0,
                                                                    padding: '1.5rem',
                                                                    background: '#0f172a', // slate-900
                                                                    fontSize: '0.875rem',
                                                                    lineHeight: '1.6',
                                                                }}
                                                                {...props}
                                                            >
                                                                {codeContent}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    ) : (
                                                        <code className="px-1.5 py-0.5 bg-slate-950/50 rounded-md text-accent-secondary text-xs font-mono border border-slate-700/30" {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                },
                                                p: ({ children }) => <p className="mb-4 last:mb-0 leading-7 text-slate-300">{children}</p>,
                                                ul: ({ children }) => <ul className="mb-4 ml-4 space-y-2 list-disc marker:text-accent-primary">{children}</ul>,
                                                ol: ({ children }) => <ol className="mb-4 ml-4 space-y-2 list-decimal marker:text-accent-primary">{children}</ol>,
                                                li: ({ children }) => <li className="leading-7 text-slate-300">{children}</li>,
                                                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-white tracking-tight">{children}</h1>,
                                                h2: ({ children }) => <h2 className="text-xl font-bold mb-3 text-white tracking-tight">{children}</h2>,
                                                h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 text-white">{children}</h3>,
                                                a: ({ children, href }) => <a href={href} className="text-accent-primary hover:text-accent-secondary underline decoration-2 decoration-accent-primary/30 underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                                                blockquote: ({ children }) => <blockquote className="border-l-4 border-accent-primary/50 pl-4 py-1 my-4 bg-slate-900/30 rounded-r-lg italic text-slate-400">{children}</blockquote>,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Loading State */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="flex max-w-[85%] flex-row items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                                <Bot size={14} className="text-accent-primary animate-pulse" />
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl rounded-tl-sm px-5 py-4 backdrop-blur-sm flex items-center gap-3">
                                <span className="text-sm text-slate-400 font-medium">Thinking</span>
                                <div className="flex gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-accent-secondary rounded-full animate-bounce animation-delay-100"></div>
                                    <div className="w-1.5 h-1.5 bg-accent-tertiary rounded-full animate-bounce animation-delay-200"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Floating Style */}
            <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent relative z-20">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="relative group">
                        {/* Glow effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition duration-500"></div>

                        <div className="relative flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-2xl">
                            <div className="pl-4">
                                <Sparkles size={20} className="text-accent-secondary" />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question about your repository..."
                                disabled={isLoading}
                                className="flex-1 bg-transparent text-white border-none outline-none placeholder-slate-500 text-[15px] py-3"
                            />
                            <motion.button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    p-3 rounded-xl transition-all duration-200 flex items-center justify-center
                                    ${input.trim() && !isLoading
                                        ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/25'
                                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                    }
                                `}
                            >
                                <Send size={18} />
                            </motion.button>
                        </div>
                    </form>
                    <p className="text-center text-xs text-slate-600 mt-3 font-medium">
                        AI can make mistakes. Please review the code.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
