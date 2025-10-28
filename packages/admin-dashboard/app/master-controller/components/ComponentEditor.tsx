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
          const response = await fetch(`/api/master-controller/components/read?path=${component.reactPath}&t=${timestamp}`);
          if (response.ok) {
            const data = await response.json();
            setCode(data.content);
            setOriginalCode(data.content);
          }
        }
      } catch (error) {
        console.error('Failed to load component code:', error);
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
  // Map component IDs to their actual imports (same as standalone ComponentPreview.tsx)
  const PreviewComponent = React.useMemo(() => {
    const id = component.id;

    switch (id) {
      // Buttons
      case 'cta-button':
        return lazy(() => import('@/components/saa/buttons/CTAButton').then(m => ({ default: () => <m.CTAButton>Get Started</m.CTAButton> })));
      case 'secondary-button':
        return lazy(() => import('@/components/saa/buttons/SecondaryButton').then(m => ({ default: () => <m.SecondaryButton>Learn More</m.SecondaryButton> })));

      // Cards
      case 'stacked-animation-cards':
      case 'cyber-card-stacked-animation':
        return lazy(() => import('@/components/saa/cards/CyberCardStackedAnimation').then(m => ({
          default: () => (
            <m.CyberCardStackedAnimation
              cards={[
                {
                  title: 'Revenue Share',
                  description: 'Transparent compensation model with direct revenue sharing based on performance and contribution to client success.',
                  buttonText: 'Learn More',
                  buttonHref: '#revenue',
                  placeholder: '💰'
                },
                {
                  title: 'Stock Awards',
                  description: 'Equity participation program for long-term alignment with company growth and success.',
                  buttonText: 'View Details',
                  buttonHref: '#stock',
                  placeholder: '📈'
                },
                {
                  title: 'Performance Bonuses',
                  description: 'Quarterly performance incentives based on individual and team achievements.',
                  buttonText: 'Get Started',
                  buttonHref: '#bonus',
                  placeholder: '🎯'
                },
                {
                  title: 'Benefits Package',
                  description: 'Comprehensive health, dental, vision, and wellness programs for you and your family.',
                  buttonText: 'Explore',
                  buttonHref: '#benefits',
                  placeholder: '🏥'
                },
                {
                  title: 'Growth Opportunities',
                  description: 'Professional development programs, mentorship, and career advancement pathways.',
                  buttonText: 'Learn More',
                  buttonHref: '#growth',
                  placeholder: '🚀'
                }
              ]}
              topOffset="40px"
              className="w-full"
            />
          )
        })));
      case 'cyber-card-prismatic-glass':
        return lazy(() => import('@/components/saa/cards/CyberCardPrismaticGlass').then(m => ({
          default: () => (
            <m.CyberCardPrismaticGlass className="w-full max-w-md">
              <h3 className="text-2xl font-bold text-[#ffd700] mb-4">Prismatic Glass</h3>
              <p className="text-[#dcdbd5]">Glass morphism with prismatic light effects</p>
            </m.CyberCardPrismaticGlass>
          )
        })));
      case 'cyber-card-holographic':
        return lazy(() => import('@/components/saa/cards/CyberCardHolographic').then(m => ({
          default: () => (
            <m.CyberCardHolographic className="w-full max-w-md">
              <h3 className="text-2xl font-bold text-[#ffd700] mb-4">Holographic Card</h3>
              <p className="text-[#dcdbd5]">Futuristic holographic border and glow effects</p>
            </m.CyberCardHolographic>
          )
        })));
      case 'cyber-card-industrial-metal':
        return lazy(() => import('@/components/saa/cards/CyberCardIndustrialMetal').then(m => ({
          default: () => (
            <m.CyberCardIndustrialMetal className="w-full max-w-md">
              <h3 className="text-2xl font-bold text-[#ffd700] mb-4">Industrial Metal</h3>
              <p className="text-[#dcdbd5]">Industrial metal plate design</p>
            </m.CyberCardIndustrialMetal>
          )
        })));
      // Effects
      case 'text-scramble':
        return lazy(() => import('@/components/saa/text/TextScramble').then(m => ({
          default: () => (
            <div className="flex items-center justify-center h-full">
              <m.TextScramble text="SAA Building Blocks">
                SAA Building Blocks
              </m.TextScramble>
            </div>
          )
        })));

      // Interactive
      case 'icon-library':
        return lazy(() => import('@/components/saa/icons/IconLibrary').then(m => ({
          default: () => (
            <div className="w-full h-full p-8">
              <m.IconLibrary size="large" showLabels />
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
