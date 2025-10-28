'use client';

import { useState, useMemo } from 'react';
import { Search, Package } from 'lucide-react';
import { ComponentCard } from '../../components/ComponentCard';
import { ComponentEditor } from '../ComponentEditor';
import {
  saaComponentRegistry,
  getConversionStats,
  searchComponents,
  SAA_CATEGORY_LABELS,
} from '@/data/saa-component-registry';
import type { SAAComponent, SAAComponentCategory } from '@/data/saa-component-registry';

type CategoryFilter = SAAComponentCategory | 'all';

export function ComponentsTab() {
  const [saaComponents, setSaaComponents] = useState<SAAComponent[]>(saaComponentRegistry);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingComponent, setEditingComponent] = useState<SAAComponent | null>(null);

  // Filter components based on category and search
  const filteredComponents = useMemo(() => {
    let filtered = [...saaComponents];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((comp) => comp.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = searchComponents(searchQuery);
      // Apply category filter after search if not 'all'
      if (selectedCategory !== 'all') {
        filtered = filtered.filter((comp) => comp.category === selectedCategory);
      }
    }

    return filtered;
  }, [saaComponents, selectedCategory, searchQuery]);

  // Category statistics
  const stats = useMemo(() => getConversionStats(), [saaComponents]);

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<SAAComponentCategory, number> = {
      buttons: 0,
      cards: 0,
      navigation: 0,
      gallery: 0,
      effects: 0,
      interactive: 0,
      layouts: 0,
      forms: 0,
    };
    saaComponents.forEach((comp) => {
      counts[comp.category]++;
    });
    return counts;
  }, [saaComponents]);

  const handleEditComponent = (component: SAAComponent) => {
    setEditingComponent(component);
  };

  const handleSaveComponent = async (componentId: string, code: string) => {
    try {
      const component = saaComponents.find((c) => c.id === componentId);
      if (!component?.reactPath) {
        throw new Error('Component has no React path');
      }

      const response = await fetch('/api/master-controller/components/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: component.reactPath,
          content: code,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save component');
      }

      // Mark component as converted if it wasn't already
      if (!component.converted) {
        setSaaComponents((prev) =>
          prev.map((c) =>
            c.id === componentId ? { ...c, converted: true } : c
          )
        );
      }
    } catch (error) {
      console.error('Failed to save component:', error);
      throw error;
    }
  };

  return (
    <>
      {/* Component Editor Modal */}
      {editingComponent && (
        <ComponentEditor
          component={editingComponent}
          onClose={() => setEditingComponent(null)}
          onSave={handleSaveComponent}
        />
      )}

      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#e5e4dd] mb-2">
            Component Library
          </h2>
          <p className="text-[#dcdbd5]">
            Browse and convert SAA Design System components
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg hover:shadow-md hover:shadow-[#ffd700]/20 transition-all duration-200">
            <div className="flex items-center gap-2 text-[#ffd700] mb-1">
              <Package className="w-5 h-5" />
              <span className="text-sm font-medium">Total Components</span>
            </div>
            <p className="text-2xl font-bold text-[#ffd700]">
              {stats.total}
            </p>
          </div>

          <div className="p-4 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg hover:shadow-md hover:shadow-[#00ff88]/20 transition-all duration-200">
            <div className="flex items-center gap-2 text-[#00ff88] mb-1">
              <Package className="w-5 h-5" />
              <span className="text-sm font-medium">Converted</span>
            </div>
            <p className="text-2xl font-bold text-[#00ff88]">
              {stats.converted}
            </p>
          </div>

          <div className="p-4 bg-[#404040]/30 border border-[#404040] rounded-lg hover:shadow-md hover:shadow-[#00ff88]/20 transition-all duration-200">
            <div className="flex items-center gap-2 text-[#dcdbd5] mb-1">
              <Package className="w-5 h-5" />
              <span className="text-sm font-medium">Categories</span>
            </div>
            <p className="text-2xl font-bold text-[#dcdbd5]">
              {Object.keys(SAA_CATEGORY_LABELS).length}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#dcdbd5]" />
            <input
              type="text"
              placeholder="Search components by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#404040] rounded-lg bg-[#191818] text-[#e5e4dd] placeholder-[#dcdbd5] focus:ring-2 focus:ring-[#00ff88]/50 focus:border-[#00ff88] transition-all duration-200"
            />
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="w-full mb-2">
            <h3 className="text-sm font-medium text-[#dcdbd5]">Filter by Category:</h3>
          </div>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-[#ffd700] text-[#191818] shadow-md shadow-[#ffd700]/30'
                : 'bg-[#191818] text-[#dcdbd5] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/50 border border-[#404040]'
            }`}
          >
            All ({stats.total})
          </button>

          {(Object.keys(SAA_CATEGORY_LABELS) as SAAComponentCategory[]).map((category) => {
            const count = categoryCounts[category];
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#ffd700] text-[#191818] shadow-md shadow-[#ffd700]/30'
                    : 'bg-[#191818] text-[#dcdbd5] hover:bg-[#ffd700]/10 hover:border-[#ffd700]/50 border border-[#404040]'
                }`}
              >
                {SAA_CATEGORY_LABELS[category]} ({count})
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-[#dcdbd5]">
          Showing {filteredComponents.length} of {stats.total} components
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {/* Components Grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredComponents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">
              {filteredComponents.map((component) => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  onEdit={handleEditComponent}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-[#191818] border border-[#404040] rounded-lg">
              <Package className="w-16 h-16 text-[#404040] mb-4" />
              <h3 className="text-lg font-semibold text-[#e5e4dd] mb-2">
                No components found
              </h3>
              <p className="text-[#dcdbd5] max-w-md">
                {searchQuery
                  ? `No components match "${searchQuery}". Try a different search term.`
                  : 'No components available in this category.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
