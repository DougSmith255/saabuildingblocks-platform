'use client';

/**
 * Edit Template Modal
 *
 * Modal for editing email templates with Tiptap editor
 * - Edit subject line
 * - Edit email HTML content
 * - Save changes to API
 */

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { X, Save } from 'lucide-react';

// Dynamically import the editor to avoid SSR issues
const EmailEditor = dynamic(() => import('./EmailEditor').then(mod => ({ default: mod.EmailEditor })), {
  ssr: false,
  loading: () => <div className="p-6 text-[#dcdbd5]">Loading editor...</div>
});

interface Template {
  id: string;
  holiday_name: string;
  subject_line: string;
  preview_text: string | null;
  email_html: string;
  personalization_tokens: string[];
}

interface EditTemplateModalProps {
  template: Template;
  onClose: () => void;
  onSave: (updatedTemplate: Partial<Template>) => void;
}

export function EditTemplateModal({ template, onClose, onSave }: EditTemplateModalProps) {
  const [subjectLine, setSubjectLine] = useState(template.subject_line);
  const [previewText, setPreviewText] = useState(template.preview_text || '');
  const [emailHtml, setEmailHtml] = useState(template.email_html);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        subject_line: subjectLine,
        preview_text: previewText || null,
        email_html: emailHtml,
      });
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
              Edit Template: {template.holiday_name}
            </h2>
            <p className="text-sm text-[#dcdbd5] mt-1">
              Update email subject, preview text, and content
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-[#dcdbd5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Subject Line */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Subject Line *
            </label>
            <input
              type="text"
              value={subjectLine}
              onChange={(e) => setSubjectLine(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
              placeholder="Happy {{holiday}}, {{firstName}}!"
            />
            <p className="text-xs text-[#7a7a7a] mt-1">
              Use {`{{firstName}}`}, {`{{lastName}}`}, {`{{email}}`} for personalization
            </p>
          </div>

          {/* Preview Text */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Preview Text (Optional)
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
              placeholder="Text shown in email preview..."
            />
            <p className="text-xs text-[#7a7a7a] mt-1">
              Shows in email client preview pane before opening
            </p>
          </div>

          {/* Email Content Editor */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Email Content *
            </label>
            <EmailEditor
              initialContent={emailHtml}
              onChange={setEmailHtml}
            />
          </div>

          {/* Personalization Info */}
          <div className="p-4 bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.2)] rounded-lg">
            <div className="text-sm text-[#00ff88] font-medium mb-2">
              Available Personalization Tokens:
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-[#dcdbd5]">
              {template.personalization_tokens.map((token, idx) => (
                <code key={idx} className="px-2 py-1 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.3)] rounded text-[#ffd700]">
                  {`{{${token}}}`}
                </code>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#404040]">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-lg transition-colors text-[#dcdbd5] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !subjectLine.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.3)] rounded-lg transition-colors text-[#00ff88] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
