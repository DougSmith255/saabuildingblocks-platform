'use client';

/**
 * Profile Picture Upload Component
 * Allows users to upload and preview their profile picture during signup
 */

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Upload, X, Camera } from 'lucide-react';

interface ProfilePictureUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export default function ProfilePictureUpload({
  value,
  onChange,
  error,
  disabled = false,
}: ProfilePictureUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setPreview(null);
      onChange(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG and PNG images are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must not exceed 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onChange(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Profile Picture <span className="text-gray-500">(optional)</span>
      </label>

      <div
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        {preview ? (
          <div className="relative h-40 w-40">
            <Image
              src={preview}
              alt="Profile preview"
              fill
              className="rounded-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Camera className="mb-3 h-12 w-12 text-gray-400" />
            <p className="mb-1 text-sm font-medium text-gray-700">
              Click or drag to upload
            </p>
            <p className="text-xs text-gray-500">
              JPG or PNG, max 5MB
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-500">
        Your profile picture helps team members recognize you
      </p>
    </div>
  );
}
