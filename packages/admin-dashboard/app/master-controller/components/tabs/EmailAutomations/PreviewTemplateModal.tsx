'use client';

/**
 * Preview Template Modal
 *
 * Shows a rendered preview of the email template with sample data
 * - Displays subject line
 * - Shows preview text
 * - Renders email HTML with sample personalization
 * - Desktop/Mobile toggle view
 */

import { useState } from 'react';
import { X, Smartphone, Monitor } from 'lucide-react';

interface Template {
  id: string;
  holiday_name: string;
  subject_line: string;
  preview_text: string | null;
  email_html: string;
  personalization_tokens: string[];
}

interface PreviewTemplateModalProps {
  template: Template;
  onClose: () => void;
}

export function PreviewTemplateModal({ template, onClose }: PreviewTemplateModalProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Sample personalization data
  const sampleData: Record<string, string> = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
  };

  // Replace personalization tokens with sample data
  const renderWithSampleData = (text: string): string => {
    let rendered = text;
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, value);
    });
    return rendered;
  };

  const renderedSubject = renderWithSampleData(template.subject_line);
  const renderedPreview = template.preview_text ? renderWithSampleData(template.preview_text) : '';
  const renderedHtml = renderWithSampleData(template.email_html);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] border border-[#404040] rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#404040]">
          <div>
            <h2 className="text-2xl font-bold text-[#ffd700]">
              Preview: {template.holiday_name}
            </h2>
            <p className="text-sm text-[#dcdbd5] mt-1">
              Showing with sample data
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'desktop'
                    ? 'bg-[rgba(255,215,0,0.2)] text-[#ffd700]'
                    : 'hover:bg-[rgba(255,255,255,0.1)] text-[#dcdbd5]'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'mobile'
                    ? 'bg-[rgba(255,215,0,0.2)] text-[#ffd700]'
                    : 'hover:bg-[rgba(255,255,255,0.1)] text-[#dcdbd5]'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-[#dcdbd5]" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Email Metadata */}
          <div className="mb-6 space-y-3">
            <div className="p-4 bg-[rgba(64,64,64,0.3)] border border-[#404040] rounded-lg">
              <div className="text-xs text-[#7a7a7a] mb-1">Subject Line:</div>
              <div className="text-base text-[#e5e4dd] font-medium">{renderedSubject}</div>
            </div>
            {renderedPreview && (
              <div className="p-4 bg-[rgba(64,64,64,0.3)] border border-[#404040] rounded-lg">
                <div className="text-xs text-[#7a7a7a] mb-1">Preview Text:</div>
                <div className="text-sm text-[#dcdbd5]">{renderedPreview}</div>
              </div>
            )}
          </div>

          {/* Email Preview */}
          <div className="flex justify-center">
            <div
              className={`bg-white border-2 border-[#404040] rounded-lg overflow-hidden transition-all ${
                viewMode === 'desktop' ? 'w-full' : 'w-[375px]'
              }`}
              style={{
                minHeight: '400px',
              }}
            >
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body {
                          margin: 0;
                          padding: 20px;
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                          background: #ffffff;
                          color: #000000;
                        }
                      </style>
                    </head>
                    <body>
                      ${renderedHtml}
                    </body>
                  </html>
                `}
                className="w-full h-[600px] border-0"
                title="Email Preview"
              />
            </div>
          </div>

          {/* Sample Data Info */}
          <div className="mt-6 p-4 bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.2)] rounded-lg">
            <div className="text-sm text-[#00ff88] font-medium mb-2">
              Sample Personalization Data:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-[#dcdbd5]">
              {Object.entries(sampleData).map(([key, value]) => (
                <div key={key}>
                  <span className="text-[#7a7a7a]">{`{{${key}}}`}:</span>{' '}
                  <span className="text-[#e5e4dd]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#404040]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-lg transition-colors text-[#dcdbd5]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
