/**
 * Component Preview Registry
 *
 * Stub file to unblock Master Controller build.
 * This provides preview components for the Components tab.
 */

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for heading components
const H1 = dynamic(() => import('@saa/shared/components/saa/headings/H1'), { ssr: false });
const H2 = dynamic(() => import('@saa/shared/components/saa/headings/H2'), { ssr: false });

// Preview components
const H1Preview: React.FC = () => {
  return (
    <div className="p-8 rounded-lg border border-[#404040] bg-[#191818]">
      <div className="text-center">
        <H1>Heading 1</H1>
      </div>
      <div className="mt-6 text-sm text-[#dcdbd5] text-center">
        <p>3D animated neon heading with flicker effect</p>
        <p className="text-xs text-[#999] mt-2">Uses text-h1 class for Master Controller typography</p>
      </div>
    </div>
  );
};

const H2Preview: React.FC = () => {
  return (
    <div className="p-8 rounded-lg border border-[#404040] bg-[#191818]">
      <div className="text-center">
        <H2>Heading 2</H2>
      </div>
      <div className="mt-6 text-sm text-[#dcdbd5] text-center">
        <p>3D static neon heading with metal backing</p>
        <p className="text-xs text-[#999] mt-2">Uses text-h2 class for Master Controller typography</p>
      </div>
    </div>
  );
};

// Preview registry map
const PREVIEW_REGISTRY: Record<string, React.ComponentType<any>> = {
  'h1-heading': H1Preview,
  'h2-heading': H2Preview,
};

// Fallback preview component
export const FallbackPreview: React.FC<{ componentName: string }> = ({ componentName }) => {
  return (
    <div className="p-8 rounded-lg border border-[#404040] bg-[#2a2a2a]">
      <div className="text-center text-[#dcdbd5]">
        <p className="mb-2">Preview for <strong className="text-[#00ff88]">{componentName}</strong></p>
        <p className="text-sm text-[#999]">Component preview coming soon...</p>
      </div>
    </div>
  );
};

// Check if preview exists for component
export const hasPreview = (componentName: string): boolean => {
  return componentName in PREVIEW_REGISTRY;
};

// Get preview component
export const getPreviewComponent = (componentName: string): React.ComponentType<any> | null => {
  return PREVIEW_REGISTRY[componentName] || null;
};
