import { motion } from 'framer-motion';
import { ArrowRight, Command, Github, Key, Sparkles } from 'lucide-react';
import { useState } from 'react';

const LandingPage = ({ onProcessRepo, isLoading }) => {
    const [url, setUrl] = useState('');
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url && apiKey) {
            onProcessRepo(url, apiKey);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 bg-slate-950 selection:bg-accent-primary/30 selection:text-white">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/10 rounded-full blur-[120px] animate-pulse-slow animation-delay-1000" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 max-w-2xl w-full space-y-12"
            >
                {/* Hero Section */}
                <div className="text-center space-y-8">
                    {/* Logo/Icon */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex justify-center"
                    >
                        <div className="relative group cursor-default">
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                            <div className="relative bg-slate-900 p-5 rounded-2xl border border-white/10 shadow-2xl ring-1 ring-white/10">
                                <Command className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Title & Tagline */}
                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight text-white"
                        >
                            Repo <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary">Chat</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-lg md:text-xl text-slate-400 font-light max-w-lg mx-auto leading-relaxed"
                        >
                            Talk to your codebase. Understand logic, find bugs, and generate features in seconds.
                        </motion.p>
                    </div>
                </div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        {/* GitHub URL Input - Cinematic Style */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary rounded-xl opacity-30 group-hover:opacity-100 blur transition duration-500 group-focus-within:opacity-100"></div>
                            <div className="relative bg-slate-900 rounded-xl p-1">
                                <div className="flex items-center gap-4 px-5 py-4 bg-slate-950/50 rounded-lg border border-white/5 group-focus-within:border-white/10 transition-colors">
                                    <Github className="w-6 h-6 text-slate-400 flex-shrink-0" />
                                    <input
                                        type="url"
                                        required
                                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 text-lg font-medium"
                                        placeholder="github.com/username/repository"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* API Key Input */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-secondary to-accent-tertiary rounded-xl opacity-0 group-hover:opacity-50 blur transition duration-500 group-focus-within:opacity-50"></div>
                            <div className="relative bg-slate-900 rounded-xl p-1">
                                <div className="flex items-center gap-4 px-5 py-3 bg-slate-950/50 rounded-lg border border-white/5 group-focus-within:border-white/10 transition-colors">
                                    <Key className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                    <input
                                        type="password"
                                        required
                                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600"
                                        placeholder="Gemini API Key"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                            relative w-full py-4 rounded-xl font-semibold text-lg overflow-hidden group
                            transition-all duration-300 shadow-lg shadow-accent-primary/20
                            ${isLoading ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:shadow-accent-primary/40'}
                        `}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-[length:200%_100%] animate-shimmer"></div>
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>

                        <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="text-base">Analyzing Repository...</span>
                                </>
                            ) : (
                                <>
                                    <span>Start Analysis</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </motion.button>
                </motion.form>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="flex items-center justify-center gap-6 text-sm text-slate-500"
                >
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent-secondary" />
                        <span>Powered by RepoChat</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                    <div>v1.0.0</div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
