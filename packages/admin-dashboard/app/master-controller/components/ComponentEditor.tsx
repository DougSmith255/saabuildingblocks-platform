'use client';

import { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { X, Save, Code, Eye, AlertCircle } from 'lucide-react';
import { SAAComponent } from '../types';
import React from 'react';

interface ComponentEditorProps {
  component: SAAComponent;
  onClose: () => void;
  onSave: (componentId: string, code: string) => Promise<void>;
}

export function ComponentEditor({ component, onClose, onSave }: ComponentEditorProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [code, setCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Load component code on mount AND when component changes
  // This ensures fresh content is loaded every time the editor opens
  useEffect(() => {
    const loadComponentCode = async () => {
      try {
        if (component.reactPath) {
          // Add cache-busting timestamp to force fresh fetch
          const timestamp = Date.now();
          console.log('[ComponentEditor] Loading component:', component.name, 'Path:', component.reactPath);
          const response = await fetch(`/api/master-controller/components/read?path=${component.reactPath}&t=${timestamp}`);
          console.log('[ComponentEditor] Response status:', response.status, response.statusText);
          if (response.ok) {
            const data = await response.json();
            console.log('[ComponentEditor] Loaded code length:', data.content?.length, 'chars');
            setCode(data.content);
            setOriginalCode(data.content);
          } else {
            const errorData = await response.json();
            console.error('[ComponentEditor] API error:', errorData);
          }
        }
      } catch (error) {
        console.error('[ComponentEditor] Failed to load component code:', error);
      }
    };

    loadComponentCode();
  }, [component.reactPath, component.id]);

  // Debounced preview update
  useEffect(() => {
    if (activeTab === 'preview' && code !== originalCode) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        setPreviewKey((prev) => prev + 1);
      }, 300);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [code, originalCode, activeTab]);

  const hasUnsavedChanges = code !== originalCode;

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      await onSave(component.id, code);
      setOriginalCode(code);
    } catch (error) {
      console.error('Failed to save component:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setPreviewError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-6xl h-[90vh] bg-[#191818] border border-[#404040] rounded-lg flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#404040]">
          <div>
            <h2 className="text-xl font-bold text-[#e5e4dd]">{component.name}</h2>
            <p className="text-sm text-[#dcdbd5]">{component.description}</p>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <span className="text-xs text-[#ffd700] px-2 py-1 bg-[#ffd700]/10 rounded">
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-[#191818] rounded-lg font-medium hover:bg-[#00ff88]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#404040] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#dcdbd5]" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2 bg-[#191818] border-b border-[#404040]">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'code'
                ? 'bg-[#00ff88] text-[#191818]'
                : 'bg-transparent text-[#dcdbd5] hover:bg-[#404040]'
            }`}
          >
            <Code className="w-4 h-4" />
            Code
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'preview'
                ? 'bg-[#00ff88] text-[#191818]'
                : 'bg-transparent text-[#dcdbd5] hover:bg-[#404040]'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
            {hasUnsavedChanges && (
              <span className="w-2 h-2 bg-[#ffd700] rounded-full" />
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'code' ? (
            <div className="h-full p-4">
              <textarea
                value={code}
                onChange={handleCodeChange}
                className="w-full h-full p-4 bg-[#0a0a0a] border border-[#404040] rounded-lg text-[#e5e4dd] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50 focus:border-[#00ff88]"
                spellCheck={false}
                placeholder="Component code will appear here..."
              />
            </div>
          ) : (
            <div className="h-full p-8 overflow-auto">
              {previewError ? (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-red-400 font-semibold mb-1">Preview Error</h3>
                    <p className="text-red-300 text-sm">{previewError}</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 -z-10 opacity-20">
                    {/* Stars background visible through transparent component */}
                    <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-[#00ff88]/20" />
                  </div>
                  <ComponentPreview
                    key={previewKey}
                    component={component}
                    code={code}
                    onError={setPreviewError}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#404040] bg-[#191818]">
          <div className="text-xs text-[#dcdbd5]">
            {component.reactPath || 'No React component path'}
          </div>
          <div className="text-xs text-[#dcdbd5]">
            {code.split('\n').length} lines • {code.length} characters
          </div>
        </div>
      </div>
    </div>
  );
}

// Component Preview with Error Boundary
interface ComponentPreviewProps {
  component: SAAComponent;
  code: string;
  onError: (error: string) => void;
}

function ComponentPreview({ component, code, onError }: ComponentPreviewProps) {
  /**
   * ⚠️ ADDING A NEW COMPONENT PREVIEW?
   * Add a case to the switch statement below.
   * See: 📘 /home/claude-flow/📘-NEW-COMPONENT-GUIDE.md
   */

  // Map component IDs to their actual imports (same as standalone ComponentPreview.tsx)
  const PreviewComponent = React.useMemo(() => {
    const id = component.id;

    switch (id) {
      // ============================================
      // BUTTONS
      // ============================================
      case 'cta-button':
        return lazy(() => import('@saa/shared/components/saa/buttons/CTAButton').then(m => ({ default: () => <m.CTAButton>Get Started</m.CTAButton> })));
      case 'secondary-button':
        return lazy(() => import('@saa/shared/components/saa/buttons/SecondaryButton').then(m => ({ default: () => <m.SecondaryButton>Learn More</m.SecondaryButton> })));
      case 'generic-button':
        return lazy(() => import('@saa/shared/components/saa/buttons/GenericButton').then(m => ({ default: () => <m.GenericButton>Filter Option</m.GenericButton> })));

      // ============================================
      // CARDS
      // ============================================
      case 'generic-card':
        return lazy(() => import('@saa/shared/components/saa/cards/GenericCard').then(m => ({
          default: () => (
            <div className="space-y-4 w-full max-w-md">
              <m.GenericCard>
                <h3 className="text-xl font-bold text-[#e5e4dd] mb-2">Default Card</h3>
                <p className="text-[#dcdbd5]">Simple card with medium padding</p>
              </m.GenericCard>
              <m.GenericCard hover>
                <h3 className="text-xl font-bold text-[#e5e4dd] mb-2">Hover Card</h3>
                <p className="text-[#dcdbd5]">Interactive card with hover effects</p>
              </m.GenericCard>
              <m.GenericCard padding="lg" centered>
                <h3 className="text-xl font-bold text-[#ffd700] mb-2">Centered Card</h3>
                <p className="text-[#dcdbd5]">Large padding, centered content</p>
              </m.GenericCard>
            </div>
          )
        })));

      // ============================================
      // TYPOGRAPHY
      // ============================================
      case 'h1-heading':
        return lazy(() => import('@saa/shared/components/saa/headings/H1').then(m => ({
          default: () => <m.default>Heading 1</m.default>
        })));
      case 'h2-heading':
        return lazy(() => import('@saa/shared/components/saa/headings/H2').then(m => ({
          default: () => <m.default>Heading 2</m.default>
        })));
      case 'tagline':
        return lazy(() => import('@saa/shared/components/saa/headings/Tagline').then(m => ({
          default: () => <m.default>For Agents Who Want More</m.default>
        })));
      case 'cyber-text-3d':
        return lazy(() => import('@saa/shared/components/saa/text/CyberText3D').then(m => ({
          default: () => (
            <div className="space-y-6 text-center">
              <m.CyberText3D variant="gold" glowIntensity="intense" className="text-4xl font-bold">
                3700+
              </m.CyberText3D>
              <m.CyberText3D variant="white" flicker flickerSpeed="slow" className="text-2xl">
                AGENTS
              </m.CyberText3D>
            </div>
          )
        })));

      // ============================================
      // EFFECTS
      // ============================================
      case 'icon-3d':
        return lazy(() => import('@saa/shared/components/saa/icons/Icon3D').then(m => ({
          default: () => (
            <div className="flex gap-8 items-center">
              <m.Icon3D size={32}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </m.Icon3D>
              <m.Icon3D color="#00ff88" size={32}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </m.Icon3D>
            </div>
          )
        })));

      // ============================================
      // INTERACTIVE
      // ============================================
      case 'faq-accordion':
        return lazy(() => import('@saa/shared/components/saa/interactive/FAQ').then(m => ({
          default: () => (
            <div className="w-full max-w-xl">
              <m.FAQ items={[
                { question: 'What is the Smart Agent Alliance?', answer: 'The Smart Agent Alliance is a team of top-performing real estate agents at eXp Realty.' },
                { question: 'How do I join?', answer: 'Simply click the Get Started button and fill out the application form.' },
                { question: 'What are the benefits?', answer: 'Access to training, mentorship, marketing tools, and revenue share opportunities.' }
              ]} />
            </div>
          )
        })));
      case 'share-buttons':
        return lazy(() => import('@saa/shared/components/saa/interactive/ShareButtons').then(m => ({
          default: () => (
            <m.ShareButtons
              title="Amazing Article"
              url="https://example.com/article"
              excerpt="This is an amazing article about real estate."
              showDivider={false}
            />
          )
        })));
      case 'icon-library':
        // Note: IconLibrary relies on external CSS with sprite.svg for actual icons
        // Preview shows the component structure with placeholder icons
        return lazy(() => import('@saa/shared/components/saa/icons/IconLibrary').then(m => ({
          default: () => (
            <div className="w-full h-full p-4">
              <div className="text-[#ffd700] text-sm mb-4 p-2 bg-yellow-900/20 rounded border border-yellow-600/30">
                ⚠️ Icons require icon-library.css + sprite.svg to display
              </div>
              <div className="grid grid-cols-4 gap-4">
                {['Email', 'Webinar', 'LinkedIn', 'YouTube', 'Calendar', 'Rocket', 'Bolt', 'Trophy'].map((name) => (
                  <div key={name} className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#ffd700]/20 to-[#ffd700]/5 rounded-lg flex items-center justify-center border border-[#ffd700]/30">
                      <span className="text-[#ffd700] text-lg">⬡</span>
                    </div>
                    <span className="text-white/80 text-xs">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })));

      // ============================================
      // MEDIA / GALLERY
      // ============================================
      case 'cyber-frame':
        return lazy(() => import('@saa/shared/components/saa/media/CyberFrame').then(m => ({
          default: () => (
            <m.CyberFrame>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
                alt="Sample real estate"
                className="w-full h-auto"
              />
            </m.CyberFrame>
          )
        })));
      case 'youtube-facade':
        return lazy(() => import('@saa/shared/components/saa/media/YouTubeFacade').then(m => ({
          default: () => (
            <div className="w-full max-w-lg aspect-video relative">
              <m.YouTubeFacade
                videoId="dQw4w9WgXcQ"
                title="Sample YouTube Video"
              />
            </div>
          )
        })));

      default:
        return () => (
          <div className="flex items-center justify-center p-8 bg-transparent border-2 border-dashed border-[#404040] rounded-lg">
            <div className="text-center">
              <Eye className="w-16 h-16 text-[#404040] mx-auto mb-4" />
              <p className="text-[#dcdbd5] text-lg mb-2">Live Preview</p>
              <p className="text-[#dcdbd5]/70 text-sm">Component ID: {id || 'unknown'}</p>
              <p className="text-[#00ff88] text-xs mt-4">Transparent background shows global stars</p>
            </div>
          </div>
        );
    }
  }, [component.id]);

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-transparent">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-[#ffd700] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#dcdbd5]">Loading preview...</p>
          </div>
        }
      >
        <PreviewComponent />
      </Suspense>
    </div>
  );
}
