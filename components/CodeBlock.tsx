import React, { useState, useEffect } from 'react';

const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const LineNumberIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="9" x2="20" y2="9"></line>
        <line x1="4" y1="15" x2="20" y2="15"></line>
        <line x1="10" y1="3" x2="8" y2="21"></line>
        <line x1="16" y1="3" x2="14" y2="21"></line>
    </svg>
);

const IndentIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
        <line x1="8" y1="3" x2="8" y2="21"></line>
    </svg>
);


type Theme = 'dark' | 'light' | 'monokai';
const THEMES: Record<Theme, { name: string; class: string; preClass: string; }> = {
    dark: { name: 'Dark', class: 'bg-gradient-to-r from-gray-800 to-gray-800/80', preClass: 'text-gray-200' },
    light: { name: 'Light', class: 'bg-gray-100 border border-gray-200', preClass: 'text-gray-800' },
    monokai: { name: 'Monokai', class: 'bg-[#272822]', preClass: 'text-[#F8F8F2]'}
};
const THEME_STORAGE_KEY = 'codeblock-theme';
const LINE_NUMBERS_STORAGE_KEY = 'codeblock-line-numbers';
const INDENT_GUIDES_STORAGE_KEY = 'codeblock-indent-guides';

const LANGUAGE_DESCRIPTIONS: Record<string, { name: string; useCase: string; }> = {
    python: { name: 'Python', useCase: 'General-purpose language for web backends, data science, and scripting.' },
    hcl: { name: 'HashiCorp Configuration Language', useCase: 'Declarative language for defining infrastructure as code with Terraform.' },
    yaml: { name: 'YAML Ain\'t Markup Language', useCase: 'Human-readable data serialization format used for configuration files.' },
    dockerfile: { name: 'Dockerfile', useCase: 'Instructions for building Docker container images.' },
    solidity: { name: 'Solidity', useCase: 'Contract-oriented language for writing smart contracts on blockchains.' },
    bash: { name: 'Bourne Again Shell', useCase: 'Command language and shell for scripting in Unix-like operating systems.' },
    markdown: { name: 'Markdown', useCase: 'A lightweight markup language for creating formatted text.' },
};


interface CodeBlockProps {
    code: string;
    language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [theme, setTheme] = useState<Theme>('dark');
    const [showLineNumbers, setShowLineNumbers] = useState(false);
    const [showIndentGuides, setShowIndentGuides] = useState(false);
    const [isLangTooltipVisible, setIsLangTooltipVisible] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
        if (savedTheme && THEMES[savedTheme]) {
            setTheme(savedTheme);
        }
        const savedLineNumbers = localStorage.getItem(LINE_NUMBERS_STORAGE_KEY);
        setShowLineNumbers(savedLineNumbers === 'true');

        const savedIndentGuides = localStorage.getItem(INDENT_GUIDES_STORAGE_KEY);
        setShowIndentGuides(savedIndentGuides === 'true');
    }, []);

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    };
    
    const handleToggleLineNumbers = () => {
        const newValue = !showLineNumbers;
        setShowLineNumbers(newValue);
        localStorage.setItem(LINE_NUMBERS_STORAGE_KEY, String(newValue));
    };

    const handleToggleIndentGuides = () => {
        const newValue = !showIndentGuides;
        setShowIndentGuides(newValue);
        localStorage.setItem(INDENT_GUIDES_STORAGE_KEY, String(newValue));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const lines = code.split('\n');
    const needsExpansion = lines.length > 10;
    const displayedCode = needsExpansion && !isExpanded ? lines.slice(0, 10).join('\n') : code;

    const preStyles: React.CSSProperties = {
        backgroundImage: showIndentGuides 
          ? `repeating-linear-gradient(to right, transparent 0, transparent calc(2ch - 1px), rgba(107, 114, 128, 0.3) calc(2ch - 1px), rgba(107, 114, 128, 0.3) 2ch)`
          : 'none',
        backgroundPosition: showLineNumbers ? '3.5rem 0' : '0 0'
    };
    
    const buttonBaseClasses = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900/50 focus:ring-teal-400';

    return (
        <div className={`rounded-lg my-4 relative group ${THEMES[theme].class}`}>
            <div className="absolute top-2 right-2 flex items-center space-x-3 z-10">
                <div className="relative" onMouseEnter={() => setIsLangTooltipVisible(true)} onMouseLeave={() => setIsLangTooltipVisible(false)}>
                    <span className="text-xs text-gray-400 uppercase font-sans cursor-help">{language}</span>
                    {isLangTooltipVisible && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 text-xs bg-gray-900 border border-gray-700 text-white rounded-md shadow-lg z-20 pointer-events-none">
                            <strong className="font-bold text-teal-400">{LANGUAGE_DESCRIPTIONS[language]?.name || language}</strong>
                            <p className="mt-1 text-gray-300">{LANGUAGE_DESCRIPTIONS[language]?.useCase || 'No description available.'}</p>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center space-x-1 p-0.5 rounded-md bg-gray-900/30">
                    <button
                        onClick={handleToggleIndentGuides}
                        className={`p-1.5 rounded transition-colors ${buttonBaseClasses} ${showIndentGuides ? 'bg-teal-500 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
                        aria-pressed={showIndentGuides}
                        aria-label="Toggle indentation guides"
                        title="Toggle indentation guides"
                    >
                        <IndentIcon />
                    </button>
                    <button
                        onClick={handleToggleLineNumbers}
                        className={`p-1.5 rounded transition-colors ${buttonBaseClasses} ${showLineNumbers ? 'bg-teal-500 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
                        aria-pressed={showLineNumbers}
                        aria-label="Toggle line numbers"
                        title="Toggle line numbers"
                    >
                        <LineNumberIcon />
                    </button>
                    {(Object.keys(THEMES) as Theme[]).map(themeKey => (
                        <button
                            key={themeKey}
                            onClick={() => handleSetTheme(themeKey)}
                            className={`px-2 py-0.5 text-xs rounded transition-colors ${buttonBaseClasses} ${theme === themeKey ? 'bg-teal-500 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
                            aria-pressed={theme === themeKey}
                            aria-label={`Switch to ${THEMES[themeKey].name} theme`}
                        >
                            {THEMES[themeKey].name}
                        </button>
                    ))}
                </div>
                 <div className="relative flex items-center">
                    <span 
                        className={`text-xs text-teal-400 transition-opacity duration-300 ${isCopied ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transform: 'translateX(-4px)' }}
                        aria-live="polite"
                    >
                        Copied!
                    </span>
                    <button
                        onClick={handleCopy}
                        className={`p-1.5 rounded-md bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 opacity-0 group-hover:opacity-100 ${buttonBaseClasses}`}
                        aria-label="Copy code to clipboard"
                        title="Copy code"
                    >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                 </div>
            </div>
            <pre 
                className={`p-4 pt-12 text-sm overflow-x-auto bg-transparent ${THEMES[theme].preClass} flex gap-4`}
                style={preStyles}
            >
                {showLineNumbers && (
                    <code className="text-right text-gray-500/50 select-none flex-shrink-0" aria-hidden="true">
                        {displayedCode.split('\n').map((_, i) => (
                            <div key={i}>{i + 1}</div>
                        ))}
                    </code>
                )}
                <code className="flex-grow">
                    {displayedCode}
                </code>
            </pre>
            {needsExpansion && (
                <div className={`border-t border-white/10 rounded-b-lg ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-800/50'}`}>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`w-full text-center py-2 text-xs text-gray-400 hover:text-white font-semibold uppercase tracking-wider ${buttonBaseClasses}`}
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? 'Show Less' : `Show More (${lines.length - 10} more lines)`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CodeBlock;
