/**
 * Component Preview Registry
 *
 * Stub file to unblock Master Controller build.
 * This provides preview components for the Components tab.
 */

import React from 'react';

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
  // Currently no previews registered
  return false;
};

// Get preview component
export const getPreviewComponent = (componentName: string): React.ComponentType<any> | null => {
  // Currently no previews registered
  return null;
};
