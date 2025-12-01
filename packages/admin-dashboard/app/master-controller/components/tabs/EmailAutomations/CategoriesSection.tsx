'use client';

/**
 * Categories Section
 *
 * Manage email automation categories (e.g., "Greeting Emails", "Birthday Emails")
 * CRUD operations for categories with template count display
 */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FolderOpen, Plus, Edit2, Trash2, FileText } from 'lucide-react';

// Lazy load the templates and category modals
const TemplatesModal = dynamic(() => import('./TemplatesModal').then(mod => ({ default: mod.TemplatesModal })), {
  ssr: false,
});

const CategoryModal = dynamic(() => import('./CategoryModal').then(mod => ({ default: mod.CategoryModal })), {
  ssr: false,
});

interface Category {
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

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/email-automations/categories');
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.error || 'Failed to load categories');
      }
    } catch (err) {
      setError('Network error loading categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (category: Category) => {
    try {
      const isEdit = !!category.id;
      const url = isEdit
        ? `/api/email-automations/categories/${category.id}`
        : '/api/email-automations/categories';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });

      const result = await response.json();

      if (result.success) {
        if (isEdit) {
          // Update existing category
          setCategories(prev =>
            prev.map(cat => (cat.id === category.id ? result.data : cat))
          );
        } else {
          // Add new category
          setCategories(prev => [...prev, result.data]);
        }
      } else {
        throw new Error(result.error || 'Failed to save category');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      throw err;
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? This will also delete all associated templates.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/email-automations/categories/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
      } else {
        throw new Error(result.error || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff88]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg border border-red-500/20 bg-red-500/5">
        <p className="text-red-400">Error: {error}</p>
        <button
          onClick={fetchCategories}
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#e5e4dd]">Email Categories</h3>
          <p className="text-sm text-[#dcdbd5]">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.3)] rounded-lg transition-colors text-[#00ff88]"
          onClick={() => {
            setEditingCategory(null);
            setShowCategoryModal(true);
          }}
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#404040] rounded-lg">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-[#404040]" />
            <p className="text-[#dcdbd5]">No categories yet</p>
            <p className="text-sm text-[#7a7a7a] mt-2">Create your first email category to get started</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="p-4 rounded-lg border transition-all"
              style={{
                background: category.is_active
                  ? 'rgba(64, 64, 64, 0.5)'
                  : 'rgba(64, 64, 64, 0.2)',
                borderColor: category.is_active
                  ? 'rgba(0, 255, 136, 0.2)'
                  : 'rgba(64, 64, 64, 0.5)',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FolderOpen className="w-5 h-5 text-[#ffd700]" />
                    <h4 className="text-lg font-semibold text-[#e5e4dd]">{category.name}</h4>
                    {!category.is_active && (
                      <span className="px-2 py-1 text-xs bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#dcdbd5] mb-2">{category.description || 'No description'}</p>
                  <div className="flex items-center gap-4 text-xs text-[#7a7a7a]">
                    <span>Slug: {category.slug}</span>
                    <span>Order: {category.display_order}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowTemplatesModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[rgba(255,215,0,0.1)] hover:bg-[rgba(255,215,0,0.2)] border border-[rgba(255,215,0,0.3)] rounded transition-colors text-[#ffd700]"
                    title="View templates for this category"
                  >
                    <FileText className="w-3 h-3" />
                    Templates
                  </button>
                  <button
                    className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                    onClick={() => {
                      setEditingCategory(category);
                      setShowCategoryModal(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4 text-[#dcdbd5]" />
                  </button>
                  <button
                    className="p-2 hover:bg-[rgba(255,0,0,0.1)] rounded transition-colors"
                    onClick={() => category.id && handleDeleteCategory(category.id, category.name)}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Templates Modal */}
      {showTemplatesModal && selectedCategory && (
        <TemplatesModal
          category={selectedCategory}
          onClose={() => {
            setShowTemplatesModal(false);
            setSelectedCategory(null);
          }}
        />
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
}
