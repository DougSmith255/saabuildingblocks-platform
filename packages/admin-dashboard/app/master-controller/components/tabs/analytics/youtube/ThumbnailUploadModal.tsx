'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import type { YouTubeVideo } from '@/lib/youtube/types';

interface ThumbnailUploadModalProps {
  video: YouTubeVideo;
  onClose: () => void;
  onUploaded: () => void;
}

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ThumbnailUploadModal({ video, onClose, onUploaded }: ThumbnailUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Generate preview
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const validateFile = (f: File): string | null => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      return 'Invalid file type. Use JPEG, PNG, or WebP';
    }
    if (f.size > MAX_SIZE) {
      return `File too large (${(f.size / 1024 / 1024).toFixed(1)}MB). Maximum is 2MB`;
    }
    return null;
  };

  const handleFileChange = (f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('thumbnail', file);

      const res = await fetch(`/api/youtube/video/${video.id}/thumbnail`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');

      onUploaded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-[#1a1a1a] border border-[#404040] rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#404040]">
          <h3 className="text-lg font-bold text-[#00ff88]">Upload Thumbnail</h3>
          <button onClick={onClose} className="p-1 text-[#888] hover:text-[#e5e4dd] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Video info */}
          <div className="text-sm text-[#dcdbd5]">
            <span className="text-[#888]">Video: </span>
            <span className="font-medium">{video.title}</span>
          </div>

          {/* Current thumbnail */}
          {video.thumbnailUrl && (
            <div>
              <p className="text-xs text-[#888] mb-1">Current thumbnail:</p>
              <img
                src={video.thumbnailUrl}
                alt="Current thumbnail"
                className="w-full max-w-[300px] rounded-lg border"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              />
            </div>
          )}

          {/* Drop zone */}
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
            style={{
              borderColor: dragOver ? '#00ff88' : 'rgba(255, 255, 255, 0.15)',
              background: dragOver ? 'rgba(0, 255, 136, 0.05)' : 'rgba(0, 0, 0, 0.2)',
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileChange(f);
              }}
            />
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-[#888]" />
            <p className="text-sm text-[#dcdbd5]">
              {file ? file.name : 'Drop an image here or click to browse'}
            </p>
            <p className="text-xs text-[#666] mt-1">JPEG, PNG, or WebP. Max 2MB</p>
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <p className="text-xs text-[#888] mb-1">New thumbnail preview:</p>
              <img
                src={preview}
                alt="New thumbnail preview"
                className="w-full max-w-[300px] rounded-lg border"
                style={{ borderColor: 'rgba(0, 255, 136, 0.3)' }}
              />
            </div>
          )}

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
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            style={{
              background: 'rgba(0, 255, 136, 0.2)',
              color: '#00ff88',
              border: '1px solid rgba(0, 255, 136, 0.3)',
            }}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload Thumbnail'}
          </button>
        </div>
      </div>
    </div>
  );
}
