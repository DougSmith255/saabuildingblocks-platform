'use client';

/**
 * Base Templates Section
 *
 * Displays and manages base email templates (header/footer):
 * - Team Members Template (no unsubscribe)
 * - External Contacts Template (with unsubscribe)
 */

import { useState, useEffect } from 'react';
import { FileText, Users, Mail, Eye, Code, Info, X } from 'lucide-react';

type TemplateType = 'team' | 'external';

interface TemplateInfo {
  id: TemplateType;
  name: string;
  description: string;
  usedFor: string;
  fileName: string;
  icon: typeof Users | typeof Mail;
  hasUnsubscribe: boolean;
}

const templates: TemplateInfo[] = [
  {
    id: 'team',
    name: 'Team Members Template',
    description: 'Base template for active downline contacts',
    usedFor: 'Contacts with "active downline" tag',
    fileName: 'base-email-template-team.html',
    icon: Users,
    hasUnsubscribe: false,
  },
  {
    id: 'external',
    name: 'External Contacts Template',
    description: 'Base template for external contacts',
    usedFor: 'All contacts without "active downline" tag',
    fileName: 'base-email-template-external.html',
    icon: Mail,
    hasUnsubscribe: true,
  },
];

export function BaseTemplatesSection() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [templateHtml, setTemplateHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Load template HTML when a template is selected
  useEffect(() => {
    if (selectedTemplate) {
      loadTemplateHtml(selectedTemplate);
    }
  }, [selectedTemplate]);

  const loadTemplateHtml = async (type: TemplateType) => {
    setLoading(true);
    try {
      const template = templates.find(t => t.id === type);
      if (!template) return;

      const response = await fetch(`/api/templates/${template.fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.statusText}`);
      }
      const html = await response.text();
      setTemplateHtml(html);
    } catch (error) {
      console.error('Error loading template:', error);
      setTemplateHtml('Error loading template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-[#e5e4dd] flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5" />
          Base Email Templates
        </h3>
        <p className="text-[#bfbdb0]">
          All holiday emails automatically use one of these base templates for consistent branding
        </p>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <div
              key={template.id}
              className="border border-[#404040] rounded-lg p-6 bg-[rgba(64,64,64,0.2)] hover:bg-[rgba(64,64,64,0.3)] transition-all cursor-pointer"
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[rgba(255,215,0,0.1)]">
                  <Icon className="w-6 h-6 text-[#ffd700]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-[#e5e4dd] mb-1">
                    {template.name}
                  </h4>
                  <p className="text-sm text-[#bfbdb0] mb-3">
                    {template.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[#dcdbd5]">
                      <span className="text-[#00ff88]">✓</span>
                      {template.usedFor}
                    </div>
                    <div className="flex items-center gap-2 text-[#dcdbd5]">
                      <span className="text-[#00ff88]">✓</span>
                      {template.hasUnsubscribe ? 'Includes unsubscribe link' : 'No unsubscribe (team members)'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#404040]">
                <button
                  className="text-sm text-[#ffd700] hover:text-[#00ff88] transition-colors flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(template.id);
                  }}
                >
                  <Eye className="w-4 h-4" />
                  View Template
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* How It Works */}
      <div
        className="p-6 rounded-lg border border-[rgba(255,215,0,0.2)]"
        style={{ background: 'rgba(255, 215, 0, 0.05)' }}
      >
        <h4 className="text-lg font-semibold text-[#ffd700] mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          How Template Selection Works
        </h4>
        <div className="space-y-3 text-sm text-[#dcdbd5]">
          <div className="flex items-start gap-3">
            <span className="text-[#ffd700] font-mono">1.</span>
            <p>
              When sending an email, the system checks if the contact has the <code className="px-2 py-1 bg-[rgba(0,0,0,0.3)] rounded text-[#00ff88]">active downline</code> tag in GoHighLevel
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#ffd700] font-mono">2.</span>
            <p>
              If they have the tag → Uses <strong>Team Members Template</strong> (no unsubscribe)
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#ffd700] font-mono">3.</span>
            <p>
              If they don't have the tag → Uses <strong>External Contacts Template</strong> (with unsubscribe)
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#ffd700] font-mono">4.</span>
            <p>
              The holiday email body is injected into the template's <code className="px-2 py-1 bg-[rgba(0,0,0,0.3)] rounded text-[#00ff88]">{`{{emailBody}}`}</code> placeholder
            </p>
          </div>
        </div>
      </div>

      {/* Template Details */}
      <div
        className="p-6 rounded-lg border border-[rgba(0,255,136,0.2)]"
        style={{ background: 'rgba(0, 255, 136, 0.05)' }}
      >
        <h4 className="text-lg font-semibold text-[#00ff88] mb-3">
          What's Included in Base Templates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#dcdbd5]">
          <div className="space-y-2">
            <p className="font-semibold text-[#e5e4dd]">Header Section:</p>
            <ul className="space-y-1 list-disc list-inside ml-2">
              <li>Smart Agent Alliance SVG logo with gradient</li>
              <li>Tagline: "Team-focused support for real estate professionals"</li>
              <li>Brand colors and styling</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-[#e5e4dd]">Footer Section:</p>
            <ul className="space-y-1 list-disc list-inside ml-2">
              <li>Website, Contact Us, and Privacy Policy links</li>
              <li>YouTube social media link</li>
              <li>Company contact information</li>
              <li>Copyright notice</li>
              <li>Unsubscribe link (external template only)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Template File Locations */}
      <div className="p-4 rounded-lg bg-[rgba(64,64,64,0.2)] border border-[#404040]">
        <h4 className="text-sm font-semibold text-[#dcdbd5] mb-3">Template File Locations</h4>
        <div className="space-y-2 text-sm font-mono">
          {templates.map((template) => (
            <div key={template.id} className="flex items-center gap-2 text-[#bfbdb0]">
              <FileText className="w-4 h-4 text-[#ffd700]" />
              <code>/templates/{template.fileName}</code>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#bfbdb0]">
          Templates are loaded from the filesystem and merged with email content via <code className="px-2 py-1 bg-[rgba(0,0,0,0.3)] rounded text-[#00ff88]">lib/email-template-merger.ts</code>
        </p>
      </div>

      {/* Info Note */}
      <div className="p-4 rounded-lg bg-[rgba(64,64,64,0.2)] border border-[#404040]">
        <p className="text-sm text-[#bfbdb0]">
          <strong className="text-[#e5e4dd]">Note:</strong> To edit these templates, modify the HTML files in the <code className="px-2 py-1 bg-[rgba(0,0,0,0.3)] rounded text-[#00ff88]">/templates</code> directory. Changes will apply to all future emails automatically.
        </p>
      </div>

      {/* Template Viewer Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#191818] border border-[#404040] rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#404040]">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#ffd700]" />
                <div>
                  <h3 className="text-xl font-semibold text-[#e5e4dd]">
                    {templates.find(t => t.id === selectedTemplate)?.name}
                  </h3>
                  <p className="text-sm text-[#bfbdb0]">
                    {templates.find(t => t.id === selectedTemplate)?.fileName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex gap-1 bg-[rgba(64,64,64,0.5)] rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${
                      viewMode === 'preview'
                        ? 'bg-[rgba(255,215,0,0.2)] text-[#ffd700]'
                        : 'text-[#dcdbd5] hover:text-[#e5e4dd]'
                    }`}
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${
                      viewMode === 'code'
                        ? 'bg-[rgba(255,215,0,0.2)] text-[#ffd700]'
                        : 'text-[#dcdbd5] hover:text-[#e5e4dd]'
                    }`}
                  >
                    <Code className="w-4 h-4 inline mr-1" />
                    Code
                  </button>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                >
                  <X className="w-5 h-5 text-[#dcdbd5]" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff88]"></div>
                </div>
              ) : viewMode === 'preview' ? (
                <div className="bg-white rounded-lg">
                  <iframe
                    srcDoc={templateHtml.replace('{{emailBody}}', '<div style="padding: 20px;"><h2>Sample Email Content</h2><p>This is where your holiday email content will appear.</p></div>').replace('{{emailTitle}}', 'Smart Agent Alliance').replace('{{unsubscribeUrl}}', '#')}
                    className="w-full h-[600px] border-0 rounded-lg"
                    title="Template Preview"
                  />
                </div>
              ) : (
                <pre className="bg-[rgba(0,0,0,0.3)] p-4 rounded-lg overflow-auto text-xs text-[#dcdbd5] font-mono">
                  <code>{templateHtml}</code>
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
