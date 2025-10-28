'use client';

import { useState, useEffect } from 'react';
import { X, Code, Eye, Copy, Check, FileCode, ExternalLink } from 'lucide-react';
import { StarBackground } from './StarBackground';

interface ComponentInfo {
  id: string;
  name: string;
  description: string;
  htmlPath: string;
  cssPath?: string;
  jsPath?: string;
  hasReactVersion?: boolean;
}

interface ComponentPreviewModalProps {
  component: ComponentInfo;
  onClose: () => void;
}

type TabType = 'preview' | 'html' | 'css' | 'js';

// CSS Variables and Custom Fonts for iframe injection
const IFRAME_DEPENDENCIES = `
  <style>
    /* Import custom fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    /* SAA Design System CSS Variables */
    :root {
      /* Spacing */
      --space-1: 0.25rem;
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-5: 1.25rem;
      --space-6: 1.5rem;
      --space-8: 2rem;

      /* Colors */
      --gold-primary: #FFD700;
      --green-primary: #00ff88;
      --color-text-primary: #e5e4dd;
      --color-text-secondary: #dcdbd5;
      --color-bg-dark: #191818;
      --color-border: #404040;

      /* Typography */
      --font-heading: 'Amulya', 'Inter', sans-serif;
      --font-body: 'Inter', sans-serif;
      --size-button: 0.875rem;
      --letter-spacing-wide: 0.05em;
    }

    /* Amulya Font Fallback */
    @font-face {
      font-family: 'Amulya';
      src: local('Inter'), local('Arial');
      font-weight: 600;
    }
  </style>
`;

export function ComponentPreviewModal({ component, onClose }: ComponentPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [cssContent, setCssContent] = useState<string>('');
  const [jsContent, setJsContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedTab, setCopiedTab] = useState<TabType | null>(null);

  // Load component files
  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load HTML
        const htmlResponse = await fetch(component.htmlPath);
        if (!htmlResponse.ok) {
          throw new Error(`Failed to load HTML from ${component.htmlPath}`);
        }
        const html = await htmlResponse.text();
        setHtmlContent(html);

        // Load CSS if available
        if (component.cssPath) {
          const cssResponse = await fetch(component.cssPath);
          if (!cssResponse.ok) {
            console.warn(`Failed to load CSS from ${component.cssPath}`);
          } else {
            const css = await cssResponse.text();
            setCssContent(css);
          }
        }

        // Load JS if available
        if (component.jsPath) {
          const jsResponse = await fetch(component.jsPath);
          if (!jsResponse.ok) {
            console.warn(`Failed to load JS from ${component.jsPath}`);
          } else {
            const js = await jsResponse.text();
            setJsContent(js);
          }
        }

        // Special handling for icon library - load icon CSS
        if (component.id === 'icon-demo') {
          const iconCssResponse = await fetch('/saa-components/icons/icon-library.css');
          if (iconCssResponse.ok) {
            const iconCss = await iconCssResponse.text();
            setCssContent(cssContent + '\n' + iconCss);
          }
        }
      } catch (error) {
        console.error('Error loading component files:', error);
        setError(error instanceof Error ? error.message : 'Failed to load component files');
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [component]);

  const handleCopy = async (content: string, tab: TabType) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getActiveContent = () => {
    switch (activeTab) {
      case 'html':
        return htmlContent;
      case 'css':
        return cssContent;
      case 'js':
        return jsContent;
      default:
        return '';
    }
  };

  // Generate iframe content with all dependencies
  const generateIframeContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${IFRAME_DEPENDENCIES}
          <style>
            ${cssContent}
            body {
              margin: 0;
              padding: 2rem;
              min-height: 400px;
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
              font-family: var(--font-body);
            }

            /* Icon Library Specific Styles */
            ${component.id === 'icon-demo' ? `
              body {
                padding: 1rem;
              }
              .icon-large {
                width: 48px;
                height: 48px;
                margin: 0 auto;
              }
            ` : ''}
          </style>
        </head>
        <body>
          ${htmlContent}
          ${jsContent ? `<script>${jsContent}</script>` : ''}
        </body>
      </html>
    `;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Star Background Layer - Behind modal */}
      <div className="fixed inset-0" style={{ zIndex: -1 }}>
        <StarBackground />
      </div>

      <div className="relative w-full max-w-6xl h-[90vh] bg-[#191818] border border-[#404040] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#404040] bg-[#191818]">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#e5e4dd] mb-1">
              {component.name}
            </h2>
            <p className="text-sm text-[#dcdbd5]">
              {component.description}
            </p>
          </div>

          {component.hasReactVersion && (
            <span className="px-3 py-1.5 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg text-sm text-[#00ff88] font-medium mr-4">
              React Version Available
            </span>
          )}

          <button
            onClick={onClose}
            className="p-2 hover:bg-[#404040] rounded-lg transition-all duration-200 text-[#dcdbd5] hover:text-[#e5e4dd]"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-[#404040]">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-all border-b-2 ${
              activeTab === 'preview'
                ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5'
                : 'border-transparent text-[#dcdbd5] hover:text-[#00ff88] hover:bg-[#404040]/30'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          <button
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-all border-b-2 ${
              activeTab === 'html'
                ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5'
                : 'border-transparent text-[#dcdbd5] hover:text-[#00ff88] hover:bg-[#404040]/30'
            }`}
          >
            <FileCode className="w-4 h-4" />
            HTML
          </button>

          {component.cssPath && (
            <button
              onClick={() => setActiveTab('css')}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-all border-b-2 ${
                activeTab === 'css'
                  ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5'
                  : 'border-transparent text-[#dcdbd5] hover:text-[#00ff88] hover:bg-[#404040]/30'
              }`}
            >
              <Code className="w-4 h-4" />
              CSS
            </button>
          )}

          {component.jsPath && (
            <button
              onClick={() => setActiveTab('js')}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-all border-b-2 ${
                activeTab === 'js'
                  ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5'
                  : 'border-transparent text-[#dcdbd5] hover:text-[#00ff88] hover:bg-[#404040]/30'
              }`}
            >
              <FileCode className="w-4 h-4" />
              JavaScript
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-[#dcdbd5]">Loading component...</div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg max-w-2xl">
                <p className="text-sm text-red-400">
                  <strong>⚠️ Error:</strong> {error}
                </p>
                <p className="text-xs text-[#dcdbd5] mt-2">
                  The component files may be missing or the paths may be incorrect.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Preview Tab */}
              {activeTab === 'preview' && (
                <div className="h-full overflow-auto bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 relative">
                  {/* Preview Container with Star Background Visible Behind */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-white/10">
                    <iframe
                      srcDoc={generateIframeContent()}
                      className="w-full h-[600px] border-0"
                      title={`Preview of ${component.name}`}
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>

                  {/* Info Banner */}
                  <div className="mt-6 p-4 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg">
                    <p className="text-sm text-[#dcdbd5]">
                      <strong className="text-[#ffd700]">💡 Tip:</strong> This is a live preview of the component.
                      Switch to the HTML, CSS, or JavaScript tabs to view and copy the source code.
                    </p>
                    {component.id === 'icon-demo' && (
                      <p className="text-sm text-[#00ff88] mt-2">
                        <strong>✨ Icon Library:</strong> All {component.name} icons are displayed in an organized grid.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Code Tabs */}
              {activeTab !== 'preview' && (
                <div className="h-full flex flex-col">
                  {/* Copy Button */}
                  <div className="flex items-center justify-end p-4 bg-[#191818] border-b border-[#404040]">
                    <button
                      onClick={() => handleCopy(getActiveContent(), activeTab)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#191818] font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#00ff88]/30"
                    >
                      {copiedTab === activeTab ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Display */}
                  <div className="flex-1 overflow-auto bg-[#0d0d0d] p-6">
                    <pre className="text-sm text-[#e5e4dd] font-mono">
                      <code>{getActiveContent()}</code>
                    </pre>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#404040] bg-[#191818]">
          <div className="flex items-center gap-4 text-xs text-[#dcdbd5]">
            <span className="flex items-center gap-1">
              <FileCode className="w-3 h-3" />
              Files: {[component.htmlPath, component.cssPath, component.jsPath].filter(Boolean).length}
            </span>
            {component.hasReactVersion && (
              <span className="text-[#00ff88]">
                React component available in /app/components/ui/
              </span>
            )}
          </div>

          <a
            href={component.htmlPath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-[#404040] hover:bg-[#404040]/80 text-[#dcdbd5] text-sm rounded-lg transition-all duration-200"
          >
            <ExternalLink className="w-3 h-3" />
            Open in New Tab
          </a>
        </div>
      </div>
    </div>
  );
}
