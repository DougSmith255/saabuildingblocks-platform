'use client';

import { useState } from 'react';
import { Check, Copy, Eye, ExternalLink, Sparkles, Edit } from 'lucide-react';
import type { ShadCNComponent, SAAComponent, UIComponent } from '../types';
import { ComponentPreview } from './ComponentPreview';

interface ComponentCardProps {
  component: UIComponent;
  onInstall?: (componentId: string) => Promise<void>;
  onUpdateStatus?: (componentId: string, installed: boolean) => void;
  onEdit?: (component: SAAComponent) => void;
  onPreview?: (component: SAAComponent) => void;
}

// Type guard to check if component is SAA
function isSAAComponent(comp: UIComponent): comp is SAAComponent {
  return 'converted' in comp && 'source' in comp;
}

export function ComponentCard({ component, onInstall, onUpdateStatus, onEdit, onPreview }: ComponentCardProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const isSSA = isSAAComponent(component);
  const isInstalled = isSSA ? component.converted : (component as ShadCNComponent).installed;

  const handleInstall = async () => {
    if (isSSA || !onInstall || !onUpdateStatus) return; // SAA components are already converted
    setIsInstalling(true);
    try {
      await onInstall(component.id);
      onUpdateStatus(component.id, true);
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleCopyCommand = async () => {
    if (isSSA) {
      const path = component.reactPath || '';
      await navigator.clipboard.writeText(path);
    } else {
      const command = `npx shadcn@latest add ${component.id}`;
      await navigator.clipboard.writeText(command);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      // ShadCN categories
      forms: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      layout: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      feedback: 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30',
      navigation: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'data-display': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      // SAA categories
      buttons: 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/30',
      cards: 'bg-green-500/20 text-green-400 border-green-500/30',
      gallery: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      effects: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      interactive: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    };
    return colors[category as keyof typeof colors] || 'bg-[#404040]/30 text-[#dcdbd5] border-[#404040]';
  };

  return (
    <>
      <div className="relative p-5 bg-[#191818] border border-[#404040] rounded-lg hover:shadow-xl hover:shadow-[#00ff88]/20 hover:border-[#00ff88]/50 transition-all duration-200 group">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-[#e5e4dd]">
                {component.name}
              </h3>
              {/* SAA Badge */}
              {isSSA && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/30 rounded-md text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  SAA
                </div>
              )}
            </div>
            <p className="text-sm text-[#dcdbd5] line-clamp-2">
              {component.description}
            </p>
          </div>

          {/* Status Badge */}
          {isInstalled && (
            <div className="ml-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30 rounded-full text-xs font-medium">
              <Check className="w-3.5 h-3.5" />
              {isSSA ? 'Converted' : 'Installed'}
            </div>
          )}
        </div>

        {/* Category Badge */}
        {component.category && (
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md border ${getCategoryColor(
                component.category
              )}`}
            >
              {component.category}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isSSA ? (
            // SAA Component Actions
            <>
              <div className="flex-1 flex gap-2">
                {onEdit && component.converted && component.reactPath ? (
                  <button
                    onClick={() => onEdit(component as SAAComponent)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#ffd700] text-[#191818] rounded-md hover:bg-[#ffd700]/90 hover:shadow-lg hover:shadow-[#ffd700]/30 transition-all duration-200 font-medium text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#404040] text-[#dcdbd5] rounded-md cursor-not-allowed font-medium text-sm">
                    <Edit className="w-4 h-4" />
                    Not Converted
                  </div>
                )}

                {onPreview && (
                  <button
                    onClick={() => onPreview(component as SAAComponent)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#00ff88] text-[#191818] rounded-md hover:bg-[#00ff88]/90 hover:shadow-lg hover:shadow-[#00ff88]/30 transition-all duration-200 font-medium text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                )}
              </div>

              <button
                onClick={handleCopyCommand}
                className="p-2 text-[#dcdbd5] hover:text-[#ffd700] hover:bg-[#ffd700]/10 border border-transparent hover:border-[#ffd700]/30 rounded-md transition-all duration-200"
                title="Copy component path"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#ffd700]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </>
          ) : (
            // ShadCN Component Actions
            <>
              {isInstalled ? (
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#ffd700] text-[#191818] rounded-md hover:bg-[#ffd700]/90 hover:shadow-lg hover:shadow-[#ffd700]/30 transition-all duration-200 font-medium text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              ) : (
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#ffd700] text-[#191818] rounded-md hover:bg-[#ffd700]/90 hover:shadow-lg hover:shadow-[#ffd700]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
                >
                  {isInstalling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#191818] border-t-transparent rounded-full animate-spin" />
                      Installing...
                    </>
                  ) : (
                    'Install'
                  )}
                </button>
              )}

              <button
                onClick={handleCopyCommand}
                className="p-2 text-[#dcdbd5] hover:text-[#00ff88] hover:bg-[#00ff88]/10 border border-transparent hover:border-[#00ff88]/30 rounded-md transition-all duration-200"
                title="Copy install command"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#00ff88]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <a
                href={`https://ui.shadcn.com/docs/components/${component.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[#dcdbd5] hover:text-[#00ff88] hover:bg-[#00ff88]/10 border border-transparent hover:border-[#00ff88]/30 rounded-md transition-all duration-200"
                title="View documentation"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </>
          )}
        </div>

        {/* Install Command/Path (shown on hover) */}
        {!isInstalled && (
          <div className="mt-3 pt-3 border-t border-[#404040] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <code className="block px-3 py-2 text-xs bg-[#404040]/50 text-[#00ff88] rounded font-mono overflow-x-auto border border-[#404040]">
              {isSSA ? (component.reactPath || 'N/A') : `npx shadcn@latest add ${component.id}`}
            </code>
          </div>
        )}
      </div>

      {/* Preview Dialog (only for ShadCN components) */}
      {showPreview && !isSSA && (
        <ComponentPreview
          component={component as ShadCNComponent}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
