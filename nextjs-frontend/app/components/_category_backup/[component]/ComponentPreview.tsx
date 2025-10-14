'use client';

import { useEffect, useRef, useState } from 'react';

interface ComponentPreviewProps {
  html: string;
  css: string | null;
  js: string | null;
  componentName: string;
}

export default function ComponentPreview({ html, css, js, componentName }: ComponentPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'css' | 'js'>('preview');

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const document = iframe.contentDocument || iframe.contentWindow?.document;

    if (!document) return;

    // Build complete HTML document
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${componentName}</title>
  ${css ? `<style>${css}</style>` : ''}
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  ${html}
  ${js ? `<script>${js}</script>` : ''}
</body>
</html>
    `;

    document.open();
    document.write(fullHTML);
    document.close();
  }, [html, css, js, componentName]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'preview'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab('html')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'html'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          HTML
        </button>
        {css && (
          <button
            onClick={() => setActiveTab('css')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'css'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            CSS
          </button>
        )}
        {js && (
          <button
            onClick={() => setActiveTab('js')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'js'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            JavaScript
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="rounded-xl border border-blue-500/20 bg-slate-900/50 overflow-hidden">
        {activeTab === 'preview' && (
          <iframe
            ref={iframeRef}
            className="w-full min-h-[600px] bg-white"
            title={componentName}
            sandbox="allow-scripts allow-same-origin"
          />
        )}

        {activeTab === 'html' && (
          <pre className="p-6 overflow-x-auto">
            <code className="text-emerald-300 text-sm">{html}</code>
          </pre>
        )}

        {activeTab === 'css' && css && (
          <pre className="p-6 overflow-x-auto">
            <code className="text-blue-300 text-sm">{css}</code>
          </pre>
        )}

        {activeTab === 'js' && js && (
          <pre className="p-6 overflow-x-auto">
            <code className="text-amber-300 text-sm">{js}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
