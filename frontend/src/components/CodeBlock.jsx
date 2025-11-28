import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * CodeBlock component with syntax highlighting and copy functionality
 * @param {object} props - Component props
 * @param {string} props.code - Code content to display
 * @param {string} props.language - Programming language for syntax highlighting
 * @param {boolean} props.showLineNumbers - Whether to show line numbers (default: true)
 * @param {string} props.filename - Optional filename to display in header
 */
const CodeBlock = ({ code, language = 'text', showLineNumbers = true, filename }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative rounded-lg overflow-hidden border border-code-border bg-code-bg my-4">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-code-border">
                <div className="flex items-center gap-2">
                    {filename && (
                        <span className="text-xs font-mono text-slate-400">{filename}</span>
                    )}
                    {!filename && language !== 'text' && (
                        <span className="text-xs font-mono text-slate-400">{language}</span>
                    )}
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors duration-200"
                    title="Copy code"
                >
                    {copied ? (
                        <>
                            <Check size={14} className="text-green-400" />
                            <span className="text-green-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code Content */}
            <div className="overflow-x-auto">
                <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    showLineNumbers={showLineNumbers}
                    customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                    }}
                    lineNumberStyle={{
                        minWidth: '2.5rem',
                        paddingRight: '1rem',
                        color: '#6B7280',
                        userSelect: 'none',
                    }}
                    wrapLines={true}
                    wrapLongLines={false}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeBlock;
