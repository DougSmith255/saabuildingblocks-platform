'use client';

import { useEffect, useState } from 'react';
import { Type, RotateCcw, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useEmailTypographyStore, EmailTypographySettings } from '../../../stores/emailTypographyStore';

export function TypographySection() {
  const { settings, isLoading, error, fetchSettings, updateSettings, resetToDefaults } = useEmailTypographyStore();
  const [localSettings, setLocalSettings] = useState<EmailTypographySettings | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Update local settings when store settings change
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleChange = (field: keyof EmailTypographySettings, value: string | number) => {
    if (!localSettings) return;
    setLocalSettings({ ...localSettings, [field]: value });
  };

  const handleSave = async () => {
    if (!localSettings) return;

    setSaveStatus('saving');
    try {
      await updateSettings(localSettings);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all typography settings to defaults?')) {
      return;
    }

    setSaveStatus('saving');
    try {
      await resetToDefaults();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  if (isLoading || !localSettings) {
    return (
      <div className="p-8 text-center text-[#dcdbd5]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffd700]"></div>
        <p className="mt-4">Loading typography settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-[#ffd700] flex items-center gap-2">
            <Type className="w-5 h-5" />
            Email Typography Settings
          </h3>
          <p className="text-sm text-[#dcdbd5] mt-1">
            Configure fonts, sizes, and styles for email templates
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#404040] text-[#dcdbd5] border border-[#606060] hover:border-[#ffd700] transition-all"
            disabled={saveStatus === 'saving'}
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ffd700] text-[#191818] font-medium hover:bg-[#e6c200] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#191818]"></div>}
            {saveStatus === 'saved' && <CheckCircle className="w-4 h-4" />}
            {saveStatus === 'error' && <AlertCircle className="w-4 h-4" />}
            {saveStatus === 'idle' && <Save className="w-4 h-4" />}
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Typography Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* H1 Settings */}
        <div className="p-6 rounded-lg bg-[#2a2a2a] border border-[#404040]">
          <h4 className="text-lg font-semibold text-[#ffd700] mb-4">H1 (Main Heading)</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#dcdbd5] mb-2">Font Family</label>
              <select
                value={localSettings.h1_font_family}
                onChange={(e) => handleChange('h1_font_family', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
              >
                <option value="Taskor">Taskor</option>
                <option value="Amulya">Amulya</option>
                <option value="Synonym">Synonym</option>
                <option value="Georgia">Georgia</option>
                <option value="Arial">Arial</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Font Weight</label>
                <input
                  type="number"
                  min="100"
                  max="900"
                  step="100"
                  value={localSettings.h1_font_weight}
                  onChange={(e) => handleChange('h1_font_weight', parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Font Size</label>
                <input
                  type="text"
                  value={localSettings.h1_font_size}
                  onChange={(e) => handleChange('h1_font_size', e.target.value)}
                  placeholder="e.g., 32px"
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#dcdbd5] mb-2">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localSettings.h1_color}
                  onChange={(e) => handleChange('h1_color', e.target.value)}
                  className="w-16 h-10 rounded-lg border border-[#404040] cursor-pointer"
                />
                <input
                  type="text"
                  value={localSettings.h1_color}
                  onChange={(e) => handleChange('h1_color', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Line Height</label>
                <input
                  type="number"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={localSettings.h1_line_height}
                  onChange={(e) => handleChange('h1_line_height', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Letter Spacing</label>
                <input
                  type="text"
                  value={localSettings.h1_letter_spacing}
                  onChange={(e) => handleChange('h1_letter_spacing', e.target.value)}
                  placeholder="e.g., 0 or 1px"
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#dcdbd5] mb-2">Text Shadow (Glow Effect)</label>
              <input
                type="text"
                value={localSettings.h1_text_shadow}
                onChange={(e) => handleChange('h1_text_shadow', e.target.value)}
                placeholder="e.g., 0 0 10px rgba(255, 215, 0, 0.5)"
                className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
              />
            </div>
          </div>
        </div>

        {/* H2 Settings */}
        <div className="p-6 rounded-lg bg-[#2a2a2a] border border-[#404040]">
          <h4 className="text-lg font-semibold text-[#e5e4dd] mb-4">H2 (Sub Heading)</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#dcdbd5] mb-2">Font Family</label>
              <select
                value={localSettings.h2_font_family}
                onChange={(e) => handleChange('h2_font_family', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
              >
                <option value="Taskor">Taskor</option>
                <option value="Amulya">Amulya</option>
                <option value="Synonym">Synonym</option>
                <option value="Georgia">Georgia</option>
                <option value="Arial">Arial</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Font Weight</label>
                <input
                  type="number"
                  min="100"
                  max="900"
                  step="100"
                  value={localSettings.h2_font_weight}
                  onChange={(e) => handleChange('h2_font_weight', parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Font Size</label>
                <input
                  type="text"
                  value={localSettings.h2_font_size}
                  onChange={(e) => handleChange('h2_font_size', e.target.value)}
                  placeholder="e.g., 24px"
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#dcdbd5] mb-2">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localSettings.h2_color}
                  onChange={(e) => handleChange('h2_color', e.target.value)}
                  className="w-16 h-10 rounded-lg border border-[#404040] cursor-pointer"
                />
                <input
                  type="text"
                  value={localSettings.h2_color}
                  onChange={(e) => handleChange('h2_color', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Line Height</label>
                <input
                  type="number"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={localSettings.h2_line_height}
                  onChange={(e) => handleChange('h2_line_height', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Letter Spacing</label>
                <input
                  type="text"
                  value={localSettings.h2_letter_spacing}
                  onChange={(e) => handleChange('h2_letter_spacing', e.target.value)}
                  placeholder="e.g., 0 or 1px"
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* H3 Settings */}
        <div className="p-6 rounded-lg bg-[#2a2a2a] border border-[#404040]">
          <h4 className="text-lg font-semibold text-[#e5e4dd] mb-4">H3 (Section Heading)</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#dcdbd5] mb-2">Font Family</label>
              <select
                value={localSettings.h3_font_family}
                onChange={(e) => handleChange('h3_font_family', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
              >
                <option value="Taskor">Taskor</option>
                <option value="Amulya">Amulya</option>
                <option value="Synonym">Synonym</option>
                <option value="Georgia">Georgia</option>
                <option value="Arial">Arial</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Font Weight</label>
                <input
                  type="number"
                  min="100"
                  max="900"
                  step="100"
                  value={localSettings.h3_font_weight}
                  onChange={(e) => handleChange('h3_font_weight', parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Font Size</label>
                <input
                  type="text"
                  value={localSettings.h3_font_size}
                  onChange={(e) => handleChange('h3_font_size', e.target.value)}
                  placeholder="e.g., 18px"
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#dcdbd5] mb-2">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localSettings.h3_color}
                  onChange={(e) => handleChange('h3_color', e.target.value)}
                  className="w-16 h-10 rounded-lg border border-[#404040] cursor-pointer"
                />
                <input
                  type="text"
                  value={localSettings.h3_color}
                  onChange={(e) => handleChange('h3_color', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Line Height</label>
                <input
                  type="number"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={localSettings.h3_line_height}
                  onChange={(e) => handleChange('h3_line_height', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Letter Spacing</label>
                <input
                  type="text"
                  value={localSettings.h3_letter_spacing}
                  onChange={(e) => handleChange('h3_letter_spacing', e.target.value)}
                  placeholder="e.g., 0 or 1px"
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Body Text Settings */}
        <div className="p-6 rounded-lg bg-[#2a2a2a] border border-[#404040]">
          <h4 className="text-lg font-semibold text-[#bfbdb0] mb-4">Body Text</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#dcdbd5] mb-2">Font Family</label>
              <select
                value={localSettings.body_font_family}
                onChange={(e) => handleChange('body_font_family', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
              >
                <option value="Taskor">Taskor</option>
                <option value="Amulya">Amulya</option>
                <option value="Synonym">Synonym</option>
                <option value="Georgia">Georgia</option>
                <option value="Arial">Arial</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Font Weight</label>
                <input
                  type="number"
                  min="100"
                  max="900"
                  step="100"
                  value={localSettings.body_font_weight}
                  onChange={(e) => handleChange('body_font_weight', parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Font Size</label>
                <input
                  type="text"
                  value={localSettings.body_font_size}
                  onChange={(e) => handleChange('body_font_size', e.target.value)}
                  placeholder="e.g., 14px"
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#dcdbd5] mb-2">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localSettings.body_color}
                  onChange={(e) => handleChange('body_color', e.target.value)}
                  className="w-16 h-10 rounded-lg border border-[#404040] cursor-pointer"
                />
                <input
                  type="text"
                  value={localSettings.body_color}
                  onChange={(e) => handleChange('body_color', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Line Height</label>
                <input
                  type="number"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={localSettings.body_line_height}
                  onChange={(e) => handleChange('body_line_height', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#dcdbd5] mb-2">Letter Spacing</label>
                <input
                  type="text"
                  value={localSettings.body_letter_spacing}
                  onChange={(e) => handleChange('body_letter_spacing', e.target.value)}
                  placeholder="e.g., 0 or 1px"
                  className="w-full px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Link Settings - Full Width */}
      <div className="p-6 rounded-lg bg-[#2a2a2a] border border-[#404040]">
        <h4 className="text-lg font-semibold text-[#00ff88] mb-4">Link Colors</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#dcdbd5] mb-2">Link Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={localSettings.link_color}
                onChange={(e) => handleChange('link_color', e.target.value)}
                className="w-16 h-10 rounded-lg border border-[#404040] cursor-pointer"
              />
              <input
                type="text"
                value={localSettings.link_color}
                onChange={(e) => handleChange('link_color', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#dcdbd5] mb-2">Link Hover Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={localSettings.link_hover_color}
                onChange={(e) => handleChange('link_hover_color', e.target.value)}
                className="w-16 h-10 rounded-lg border border-[#404040] cursor-pointer"
              />
              <input
                type="text"
                value={localSettings.link_hover_color}
                onChange={(e) => handleChange('link_hover_color', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#191818] text-[#dcdbd5] border border-[#404040] focus:border-[#ffd700] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-400">
            <p className="font-medium">Custom Fonts</p>
            <p>Taskor, Amulya, and Synonym are custom fonts hosted on Cloudflare R2. Fallback fonts (Georgia, Arial) will be used if custom fonts fail to load.</p>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      {localSettings && (
        <div className="p-6 rounded-lg bg-[#2a2a2a] border border-[#404040]">
          <h4 className="text-lg font-semibold text-[#ffd700] mb-4">Live Preview</h4>
          <div
            className="p-6 rounded-lg bg-[#191818] border border-[#404040]"
            style={{
              fontFamily: `'${localSettings.body_font_family}', Arial, Helvetica, sans-serif`,
              fontSize: localSettings.body_font_size,
              fontWeight: localSettings.body_font_weight,
              color: localSettings.body_color,
              lineHeight: localSettings.body_line_height,
              letterSpacing: localSettings.body_letter_spacing,
            }}
          >
            <h1
              style={{
                fontFamily: `'${localSettings.h1_font_family}', Georgia, serif`,
                fontSize: localSettings.h1_font_size,
                fontWeight: localSettings.h1_font_weight,
                color: localSettings.h1_color,
                lineHeight: localSettings.h1_line_height,
                letterSpacing: localSettings.h1_letter_spacing,
                textShadow: localSettings.h1_text_shadow,
                marginTop: 0,
                marginBottom: '1rem',
              }}
            >
              Welcome to Smart Agent Alliance
            </h1>

            <h2
              style={{
                fontFamily: `'${localSettings.h2_font_family}', Georgia, serif`,
                fontSize: localSettings.h2_font_size,
                fontWeight: localSettings.h2_font_weight,
                color: localSettings.h2_color,
                lineHeight: localSettings.h2_line_height,
                letterSpacing: localSettings.h2_letter_spacing,
                marginTop: 0,
                marginBottom: '0.75rem',
              }}
            >
              Your Success Is Our Mission
            </h2>

            <p style={{ marginBottom: '1rem' }}>
              This is a sample paragraph showing how your body text will appear in emails. The typography settings you configure above will be applied to all email templates automatically.
            </p>

            <h3
              style={{
                fontFamily: `'${localSettings.h3_font_family}', Georgia, serif`,
                fontSize: localSettings.h3_font_size,
                fontWeight: localSettings.h3_font_weight,
                color: localSettings.h3_color,
                lineHeight: localSettings.h3_line_height,
                letterSpacing: localSettings.h3_letter_spacing,
                marginTop: '1rem',
                marginBottom: '0.5rem',
              }}
            >
              What You'll Get
            </h3>

            <p style={{ marginBottom: '0.5rem' }}>
              Here's an example of <a href="#" style={{ color: localSettings.link_color, textDecoration: 'none' }}>a link</a> with your configured link color. Hover over links to see the hover color effect.
            </p>

            <p style={{ marginBottom: 0 }}>
              All changes are previewed in real-time. Click "Save Changes" to apply these settings to your email templates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
