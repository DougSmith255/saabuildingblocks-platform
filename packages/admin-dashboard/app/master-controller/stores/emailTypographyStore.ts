import { create } from 'zustand';

export interface EmailTypographySettings {
  id?: string;

  // H1 Settings
  h1_font_family: string;
  h1_font_weight: number;
  h1_font_size: string;
  h1_color: string;
  h1_line_height: number;
  h1_letter_spacing: string;
  h1_text_shadow: string;

  // H2 Settings
  h2_font_family: string;
  h2_font_weight: number;
  h2_font_size: string;
  h2_color: string;
  h2_line_height: number;
  h2_letter_spacing: string;

  // H3 Settings
  h3_font_family: string;
  h3_font_weight: number;
  h3_font_size: string;
  h3_color: string;
  h3_line_height: number;
  h3_letter_spacing: string;

  // Body Settings
  body_font_family: string;
  body_font_weight: number;
  body_font_size: string;
  body_color: string;
  body_line_height: number;
  body_letter_spacing: string;

  // Link Settings
  link_color: string;
  link_hover_color: string;

  // Metadata
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface EmailTypographyStore {
  settings: EmailTypographySettings | null;
  isLoading: boolean;
  error: string | null;

  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<EmailTypographySettings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const defaultSettings: EmailTypographySettings = {
  // H1 Settings
  h1_font_family: 'Taskor',
  h1_font_weight: 400,
  h1_font_size: '32px',
  h1_color: '#ffd700',
  h1_line_height: 1.2,
  h1_letter_spacing: '0',
  h1_text_shadow: '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)',

  // H2 Settings
  h2_font_family: 'Amulya',
  h2_font_weight: 700,
  h2_font_size: '24px',
  h2_color: '#e5e4dd',
  h2_line_height: 1.3,
  h2_letter_spacing: '0',

  // H3 Settings
  h3_font_family: 'Amulya',
  h3_font_weight: 600,
  h3_font_size: '18px',
  h3_color: '#e5e4dd',
  h3_line_height: 1.4,
  h3_letter_spacing: '0',

  // Body Settings
  body_font_family: 'Synonym',
  body_font_weight: 300,
  body_font_size: '14px',
  body_color: '#bfbdb0',
  body_line_height: 1.7,
  body_letter_spacing: '0',

  // Link Settings
  link_color: '#00ff88',
  link_hover_color: '#ffd700',
};

export const useEmailTypographyStore = create<EmailTypographyStore>((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/email-automations/typography');

      if (!response.ok) {
        throw new Error('Failed to fetch typography settings');
      }

      const data = await response.json();
      set({ settings: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching typography settings:', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
        settings: defaultSettings // Fallback to defaults
      });
    }
  },

  updateSettings: async (updates: Partial<EmailTypographySettings>) => {
    const currentSettings = get().settings;
    if (!currentSettings) return;

    set({ isLoading: true, error: null });

    try {
      const updatedSettings = { ...currentSettings, ...updates };

      const response = await fetch('/api/email-automations/typography', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to update typography settings');
      }

      const data = await response.json();
      set({ settings: data, isLoading: false });
    } catch (error) {
      console.error('Error updating typography settings:', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  resetToDefaults: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/email-automations/typography', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to reset typography settings');
      }

      const data = await response.json();
      set({ settings: data, isLoading: false });
    } catch (error) {
      console.error('Error resetting typography settings:', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },
}));
