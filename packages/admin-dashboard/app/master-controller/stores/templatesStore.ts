import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BlogTemplate, CategoryAssignment } from '../types/templates';

interface TemplatesStore {
  // State
  templates: BlogTemplate[];
  categoryAssignments: CategoryAssignment[];
  selectedTemplate: BlogTemplate | null;
  isEditing: boolean;
  isSaving: boolean;
  isLoading: boolean;

  // Template CRUD
  createTemplate: (template: Omit<BlogTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BlogTemplate | null>;
  updateTemplate: (id: string, updates: Partial<BlogTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  setDefaultTemplate: (id: string) => Promise<void>;

  // Category assignments
  assignCategories: (templateId: string, categoryIds: number[]) => Promise<void>;
  unassignCategory: (categoryId: number) => Promise<void>;
  getCategoryTemplate: (categoryId: number) => BlogTemplate | null;

  // UI state
  setSelectedTemplate: (template: BlogTemplate | null) => void;
  setIsEditing: (editing: boolean) => void;

  // Data fetching
  loadTemplates: () => Promise<void>;
  loadCategoryAssignments: () => Promise<void>;

  // Cache invalidation
  invalidateCache: () => void;
}

export const useTemplatesStore = create<TemplatesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      templates: [],
      categoryAssignments: [],
      selectedTemplate: null,
      isEditing: false,
      isSaving: false,
      isLoading: false,

      // Create template
      createTemplate: async (templateData) => {
        set({ isSaving: true });

        try {
          const response = await fetch('/api/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(templateData),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create template');
          }

          const { template } = await response.json();

          set(state => ({
            templates: [...state.templates, template],
            isSaving: false,
            selectedTemplate: template,
          }));

          return template;
        } catch (error) {
          console.error('Failed to create template:', error);
          set({ isSaving: false });
          return null;
        }
      },

      // Update template
      updateTemplate: async (id, updates) => {
        const originalTemplates = get().templates;

        // Optimistic update
        set(state => ({
          templates: state.templates.map(t =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          )
        }));

        try {
          const response = await fetch(`/api/templates/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          });

          if (!response.ok) {
            throw new Error('Failed to update template');
          }

          const { template: updatedTemplate } = await response.json();

          set(state => ({
            templates: state.templates.map(t =>
              t.id === id ? updatedTemplate : t
            ),
            selectedTemplate: state.selectedTemplate?.id === id ? updatedTemplate : state.selectedTemplate,
          }));
        } catch (error) {
          console.error('Failed to update template:', error);
          // Revert on error
          set({ templates: originalTemplates });
          throw error;
        }
      },

      // Delete template
      deleteTemplate: async (id) => {
        const originalTemplates = get().templates;

        // Optimistic update
        set(state => ({
          templates: state.templates.filter(t => t.id !== id),
          selectedTemplate: state.selectedTemplate?.id === id ? null : state.selectedTemplate,
        }));

        try {
          const response = await fetch(`/api/templates/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to delete template');
          }
        } catch (error) {
          console.error('Failed to delete template:', error);
          // Revert on error
          set({ templates: originalTemplates });
          throw error;
        }
      },

      // Set default template
      setDefaultTemplate: async (id) => {
        const originalTemplates = get().templates;

        // Optimistic update
        set(state => ({
          templates: state.templates.map(t => ({
            ...t,
            isDefault: t.id === id,
          }))
        }));

        try {
          const response = await fetch(`/api/templates/${id}/default`, {
            method: 'PUT',
          });

          if (!response.ok) {
            throw new Error('Failed to set default template');
          }

          const { template } = await response.json();

          set(state => ({
            templates: state.templates.map(t =>
              t.id === id ? template : { ...t, isDefault: false }
            ),
          }));
        } catch (error) {
          console.error('Failed to set default template:', error);
          // Revert on error
          set({ templates: originalTemplates });
          throw error;
        }
      },

      // Assign categories
      assignCategories: async (templateId, categoryIds) => {
        try {
          const response = await fetch('/api/templates/assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ templateId, categoryIds }),
          });

          if (!response.ok) {
            throw new Error('Failed to assign categories');
          }

          // Reload assignments
          await get().loadCategoryAssignments();

          // Update template's assignedCategories
          set(state => ({
            templates: state.templates.map(t =>
              t.id === templateId
                ? { ...t, assignedCategories: categoryIds }
                : t
            ),
          }));
        } catch (error) {
          console.error('Failed to assign categories:', error);
          throw error;
        }
      },

      // Unassign category
      unassignCategory: async (categoryId) => {
        try {
          const response = await fetch(`/api/templates/unassign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryId }),
          });

          if (!response.ok) {
            throw new Error('Failed to unassign category');
          }

          // Reload assignments
          await get().loadCategoryAssignments();
        } catch (error) {
          console.error('Failed to unassign category:', error);
          throw error;
        }
      },

      // Get category template
      getCategoryTemplate: (categoryId) => {
        const { templates, categoryAssignments } = get();
        const assignment = categoryAssignments.find(a => a.categoryId === categoryId);

        if (assignment?.templateId) {
          return templates.find(t => t.id === assignment.templateId) || null;
        }

        // Fall back to default template
        return templates.find(t => t.isDefault) || null;
      },

      // UI state setters
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      setIsEditing: (editing) => set({ isEditing: editing }),

      // Load templates from database
      loadTemplates: async () => {
        set({ isLoading: true });

        try {
          const response = await fetch('/api/templates');

          if (!response.ok) {
            throw new Error('Failed to load templates');
          }

          const { templates } = await response.json();

          // Transform database response to match BlogTemplate interface
          const transformedTemplates = templates.map((t: any) => ({
            id: t.id,
            name: t.name,
            description: t.description,
            layout: t.layout,
            cardComponentId: t.card_component_id,
            headerPosition: t.header_position,
            spacingDensity: t.spacing_density,
            isDefault: t.is_default,
            assignedCategories: [], // Will be populated from assignments
            createdAt: t.created_at,
            updatedAt: t.updated_at,
            createdBy: t.created_by,
          }));

          set({ templates: transformedTemplates, isLoading: false });
        } catch (error) {
          console.error('Failed to load templates:', error);
          set({ isLoading: false });
        }
      },

      // Load category assignments
      loadCategoryAssignments: async () => {
        try {
          const response = await fetch('/api/templates/assignments');

          if (!response.ok) {
            throw new Error('Failed to load assignments');
          }

          const { assignments } = await response.json();
          set({ categoryAssignments: assignments });

          // Update templates with assigned categories
          set(state => ({
            templates: state.templates.map(t => ({
              ...t,
              assignedCategories: assignments
                .filter((a: any) => a.templateId === t.id)
                .map((a: any) => a.categoryId),
            })),
          }));
        } catch (error) {
          console.error('Failed to load assignments:', error);
        }
      },

      // Invalidate cache
      invalidateCache: () => {
        set({
          templates: [],
          categoryAssignments: [],
          selectedTemplate: null,
        });
      },
    }),
    {
      name: 'master-controller-templates',
      partialize: (state) => ({
        // Only persist templates, not UI state
        templates: state.templates,
        categoryAssignments: state.categoryAssignments,
      }),
    }
  )
);
