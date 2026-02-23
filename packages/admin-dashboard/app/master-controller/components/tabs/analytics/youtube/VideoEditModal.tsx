'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2, Tag } from 'lucide-react';
import type { YouTubeVideo } from '@/lib/youtube/types';

interface VideoEditModalProps {
  video: YouTubeVideo;
  onClose: () => void;
  onSaved: () => void;
}

export function VideoEditModal({ video, onClose, onSaved }: VideoEditModalProps) {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [tagsInput, setTagsInput] = useState(video.tags.join(', '));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (title.length > 100) {
      setError('Title must be 100 characters or fewer');
      return;
    }
    if (description.length > 5000) {
      setError('Description must be 5000 characters or fewer');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const res = await fetch(`/api/youtube/video/${video.id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), tags }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update');

      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-[#1a1a1a] border border-[#404040] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#404040]">
          <h3 className="text-lg font-bold text-[#ffd700]">Edit Video</h3>
          <button onClick={onClose} className="p-1 text-[#888] hover:text-[#e5e4dd] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#dcdbd5] mb-1.5">
              Title
              <span className="text-xs text-[#666] ml-2">{title.length}/100</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e5e4dd',
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#dcdbd5] mb-1.5">
              Description
              <span className="text-xs text-[#666] ml-2">{description.length}/5000</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              rows={8}
              className="w-full px-3 py-2 rounded-lg text-sm resize-y"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e5e4dd',
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-[#dcdbd5] mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Tags
              <span className="text-xs text-[#666]">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e5e4dd',
              }}
            />
            {/* Tag chips preview */}
            {tagsInput && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tagsInput.split(',').map((tag, idx) => {
                  const trimmed = tag.trim();
                  if (!trimmed) return null;
                  return (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        background: 'rgba(255, 215, 0, 0.1)',
                        color: '#ffd700',
                        border: '1px solid rgba(255, 215, 0, 0.2)',
                      }}
                    >
                      {trimmed}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg text-sm text-[#ff6b6b]" style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#404040]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#dcdbd5] transition-colors hover:bg-[rgba(255,255,255,0.05)]"
            style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            style={{
              background: 'rgba(255, 215, 0, 0.2)',
              color: '#ffd700',
              border: '1px solid rgba(255, 215, 0, 0.3)',
            }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
