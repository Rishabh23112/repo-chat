import axios from 'axios';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:8000';

function App() {
    const [view, setView] = useState('landing'); // 'landing' | 'dashboard'
    const [repoUrl, setRepoUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [repoName, setRepoName] = useState('');
    const [fileTree, setFileTree] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);

    const handleProcessRepo = async (url, key) => {
        setIsLoading(true);
        setRepoUrl(url);
        setApiKey(key);
        try {
            const response = await axios.post('/process-repo', {
                url: url,
                gemini_api_key: key
            });

            setFileTree(response.data.file_tree);
            setRepoName(response.data.repo_name);
            setView('dashboard');
        } catch (error) {
            console.error("Error processing repo:", error);
            alert(`Error: ${error.response?.data?.detail || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (message) => {
        // Add user message immediately
        const newHistory = [...chatHistory, { role: 'user', content: message }];
        setChatHistory(newHistory);
        setIsLoadingAnswer(true);

        try {
            // Backend expects chat_history as list of [question, answer] pairs
            // We need to pair up user messages with their corresponding bot responses
            const historyPairs = [];
            for (let i = 0; i < chatHistory.length - 1; i++) {
                if (chatHistory[i].role === 'user' && chatHistory[i + 1].role === 'bot') {
                    historyPairs.push([chatHistory[i].content, chatHistory[i + 1].content]);
                }
            }

            const apiResponse = await axios.post('/chat', {
                repo_name: repoName,
                question: message,
                chat_history: historyPairs,
                gemini_api_key: apiKey
            });

            setChatHistory(prev => [...prev, { role: 'bot', content: apiResponse.data.answer }]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = error.response?.data?.detail || error.message || 'An error occurred';
            setChatHistory(prev => [...prev, { role: 'bot', content: `Error: ${errorMessage}` }]);
        } finally {
            setIsLoadingAnswer(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-accent-primary/30 selection:text-white">
            {view === 'landing' ? (
                <LandingPage onProcessRepo={handleProcessRepo} isLoading={isLoading} />
            ) : (
                <Dashboard
                    fileTree={fileTree}
                    repoName={repoName}
                    chatHistory={chatHistory}
                    onSendMessage={handleSendMessage}
                    isLoadingAnswer={isLoadingAnswer}
                />
            )}
        </div>
    );
}

export default App;
