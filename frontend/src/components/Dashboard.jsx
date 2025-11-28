import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Github, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { getLanguageFromFilename } from '../utils/fileIcons';
import ChatInterface from './ChatInterface';
import CodeBlock from './CodeBlock';
import FileExplorer from './FileExplorer';

const Dashboard = ({ fileTree, repoName, onSendMessage, chatHistory, isLoadingAnswer }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [loadingFile, setLoadingFile] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleFileClick = async (filePath) => {
        setLoadingFile(true);
        try {
            const response = await axios.get('/file-content', {
                params: {
                    repo_name: repoName,
                    file_path: filePath,
                },
            });
            setSelectedFile(response.data);
            setFileContent(response.data.content);
        } catch (error) {
            console.error('Error loading file:', error);
            alert(`Error loading file: ${error.response?.data?.detail || error.message}`);
        } finally {
            setLoadingFile(false);
        }
    };

    const closeFileViewer = () => {
        setSelectedFile(null);
        setFileContent('');
    };

    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans selection:bg-accent-primary/30 selection:text-white">
            {/* Sidebar - File Explorer (VS Code Style) */}
            <motion.div
                initial={{ width: 320 }}
                animate={{ width: isSidebarOpen ? 320 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden relative z-30"
            >
                {/* Sidebar Header */}
                <div className="h-14 px-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700">
                            <Github size={16} className="text-slate-300" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-medium truncate text-sm text-slate-200" title={repoName}>
                                {repoName}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* File Tree */}
                <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2 mt-2">Explorer</div>
                    <FileExplorer data={fileTree} onFileClick={handleFileClick} />
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative bg-slate-950 min-w-0">
                {/* Toggle Sidebar Button (Visible when sidebar is closed) */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="absolute top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                )}

                {selectedFile ? (
                    /* File Viewer with Enhanced Code Display */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col h-full"
                    >
                        {/* File Header */}
                        <div className="h-14 px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-primary/10 rounded-full border border-accent-primary/20">
                                    <FileText size={14} className="text-accent-primary" />
                                    <span className="font-mono text-xs text-accent-primary font-medium">{selectedFile.path}</span>
                                </div>
                                <span className="text-xs text-slate-500">
                                    {fileContent.split('\n').length} lines
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                                    title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                                >
                                    <Menu size={18} />
                                </button>
                                <button
                                    onClick={closeFileViewer}
                                    className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors text-slate-400"
                                    title="Close File"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* File Content */}
                        <div className="flex-1 overflow-auto p-0 bg-[#0f172a]"> {/* Match code block bg */}
                            {loadingFile ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center space-y-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 border-4 border-slate-700 border-t-accent-primary rounded-full animate-spin mx-auto"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                                            </div>
                                        </div>
                                        <p className="text-slate-400 text-sm font-medium animate-pulse">Reading file...</p>
                                    </div>
                                </div>
                            ) : (
                                <CodeBlock
                                    code={fileContent}
                                    language={getLanguageFromFilename(selectedFile.path)}
                                    filename={selectedFile.path.split('/').pop()}
                                    showLineNumbers={true}
                                />
                            )}
                        </div>
                    </motion.div>
                ) : (
                    /* Chat Interface */
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        {/* Header for Chat */}
                        <div className="h-14 px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between flex-shrink-0 z-20">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className="p-2 -ml-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                                >
                                    <Menu size={18} />
                                </button>
                                <h2 className="font-semibold text-slate-200">AI Chat Assistant</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-medium text-green-400">Online</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden relative">
                            <ChatInterface
                                chatHistory={chatHistory}
                                onSendMessage={onSendMessage}
                                isLoading={isLoadingAnswer}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
