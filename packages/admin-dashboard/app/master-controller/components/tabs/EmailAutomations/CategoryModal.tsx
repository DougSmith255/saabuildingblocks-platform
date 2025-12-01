'use client';

/**
 * Category Modal
 *
 * Create or edit email automation categories
 * - Category name
 * - Slug (auto-generated from name)
 * - Description
 * - Icon
 * - Display order
 * - Active status
 */

import { useState, useEffect } from 'react';
import { X, Save, FolderOpen } from 'lucide-react';

interface CategoryFormData {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CategoryModalProps {
  category?: CategoryFormData | null; // null = create, existing = edit
  onClose: () => void;
  onSave: (category: CategoryFormData) => Promise<void>;
}

export function CategoryModal({ category, onClose, onSave }: CategoryModalProps) {
  const [name, setName] = useState(category?.name || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [description, setDescription] = useState(category?.description || '');
  const [icon, setIcon] = useState(category?.icon || '');
  const [displayOrder, setDisplayOrder] = useState(category?.display_order || 0);
  const [isActive, setIsActive] = useState(category?.is_active ?? true);
  const [saving, setSaving] = useState(false);

  const isEditMode = !!category?.id;

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditMode && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [name, isEditMode]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const categoryData: CategoryFormData = {
        ...(category?.id && { id: category.id }),
        name,
        slug,
        description: description || null,
        icon: icon || null,
        display_order: displayOrder,
        is_active: isActive,
      };

      await onSave(categoryData);
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Please try again.');
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
        className="bg-[#1a1a1a] border border-[#404040] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#404040]">
          <div>
            <h2 className="text-2xl font-bold text-[#ffd700] flex items-center gap-2">
              <FolderOpen className="w-6 h-6" />
              {isEditMode ? 'Edit Category' : 'Create Category'}
            </h2>
            <p className="text-sm text-[#dcdbd5] mt-1">
              {isEditMode ? 'Update category details' : 'Add a new email automation category'}
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
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
              placeholder="e.g., Holiday Emails"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
              placeholder="holiday-emails"
            />
            <p className="text-xs text-[#7a7a7a] mt-1">
              URL-friendly identifier (auto-generated from name)
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700] resize-none"
              placeholder="Brief description of this category..."
            />
          </div>

          {/* Icon (Optional) */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Icon (Optional)
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
              placeholder="📧"
            />
            <p className="text-xs text-[#7a7a7a] mt-1">
              Emoji or icon identifier
            </p>
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd] focus:outline-none focus:border-[#ffd700]"
              min="0"
            />
            <p className="text-xs text-[#7a7a7a] mt-1">
              Lower numbers appear first
            </p>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded border-[#404040] bg-[rgba(64,64,64,0.5)] text-[#00ff88] focus:ring-[#00ff88] focus:ring-offset-0"
              />
              <div>
                <div className="text-sm font-medium text-[#e5e4dd]">Active</div>
                <div className="text-xs text-[#7a7a7a]">
                  Inactive categories are hidden from users
                </div>
              </div>
            </label>
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
            disabled={saving || !name.trim() || !slug.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.3)] rounded-lg transition-colors text-[#00ff88] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </div>
    </div>
  );
}
