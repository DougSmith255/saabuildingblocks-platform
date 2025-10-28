'use client';

import { Download, Upload, RotateCcw, Eye, EyeOff, Copy } from 'lucide-react';
import { useControllerStore } from '../stores/controllerStore';
import { useTypographyStore } from '../stores/typographyStore';
import { useBrandColorsStore } from '../stores/brandColorsStore';
import { useSpacingStore } from '../stores/spacingStore';
import { exportSettings, importSettings, applyImportedSettings } from '../lib/exportImport';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import { SyncStatus } from './SyncStatus';

export function ActionBar() {
  const { showPreview, togglePreview } = useControllerStore();
  const typographyStore = useTypographyStore();
  const colorsStore = useBrandColorsStore();
  const spacingStore = useSpacingStore();

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleExport = () => {
    try {
      const jsonData = exportSettings(
        typographyStore.settings,
        colorsStore.settings,
        spacingStore.settings
      );

      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      const date = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `master-controller-settings-${date}.json`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[ActionBar] Export failed:', error);
      alert('Export failed. Check console for details.');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const result = importSettings(text);

        if (!result.success || !result.settings) {
          const errorMsg = result.errors?.map(e => `${e.field}: ${e.message}`).join('\n') || 'Unknown error';
          setImportError(errorMsg);
          alert(`Import validation failed:\n\n${errorMsg}`);
          return;
        }

        // Apply settings
        applyImportedSettings(
          result.settings,
          typographyStore,
          colorsStore,
          spacingStore
        );

        setImportError(null);
        alert('Settings imported successfully!');
      } catch (error) {
        console.error('[ActionBar] Import failed:', error);
        alert('Import failed. Check console for details.');
      }
    };

    input.click();
  };

  const handleResetAll = () => {
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    typographyStore.resetToDefaults();
    colorsStore.resetToDefaults();
    spacingStore.resetToDefaults();
    setShowResetDialog(false);
    alert('All settings reset to defaults!');
  };

  const handleCopyCSS = async () => {
    try {
      // Get all CSS variables from the current state
      const cssVariables = [
        '/* Typography Variables */',
        ...Object.entries(typographyStore).map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            return `--${key}: ${JSON.stringify(value)};`;
          }
          return '';
        }).filter(Boolean),
        '',
        '/* Brand Colors */',
        ...Object.entries(colorsStore).map(([key, value]) => {
          if (typeof value === 'string' && value.startsWith('#')) {
            return `--${key}: ${value};`;
          }
          return '';
        }).filter(Boolean),
        '',
        '/* Spacing & Layout */',
        ...Object.entries(spacingStore).map(([key, value]) => {
          if (typeof value === 'string') {
            return `--${key}: ${value};`;
          }
          return '';
        }).filter(Boolean),
      ].join('\n');

      await navigator.clipboard.writeText(cssVariables);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('[ActionBar] Copy CSS failed:', error);
      alert('Failed to copy CSS to clipboard');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 bg-[#191818] border-b border-[#404040]">
        <div className="flex items-center gap-4">
          {/* SAA Logo */}
          <div className="w-[126px] h-[45px]">
            <svg width="126px" height="45px" viewBox="0 0 201.96256 75.736626" version="1.1" style={{width: '100%', height: '100%', objectFit: 'contain'}} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="masterControllerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#fff3b0', stopOpacity: 1}} />
                  <stop offset="40%" style={{stopColor: '#ffd700', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#e6ac00', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              <g transform="translate(-5.5133704,-105.97189)">
                <path fill="url(#masterControllerLogoGradient)" d="M 21.472273,180.56058 C 11.316147,178.12213 1.9355119,166.45773 6.8673475,154.38101 c 0.2284985,-0.55952 1.4152886,-0.30887 8.5218335,-0.25364 6.089186,0.0474 11.528887,-0.54887 11.563021,0.35268 0.12172,3.21493 1.548705,4.66069 2.560443,5.07358 1.092535,0.44586 18.027365,0.14064 18.956531,-0.51505 2.086142,-1.47214 2.326164,-6.74 -0.732868,-6.70809 -1.893125,0.0197 -16.677992,0.18141 -18.724365,-0.11743 -4.043916,-0.59058 -5.591737,-1.59981 -9.49172,-4.13883 -8.077325,-5.25858 -10.5671578,-12.68416 -8.96983,-21.28238 0,0 6.234294,-0.12184 10.651176,-0.37024 4.312501,-0.24253 8.14686,-0.34782 8.671149,0.65635 1.028138,1.96921 2.764824,2.67171 3.10468,3.73011 0.296847,0.92448 1.558671,0.84083 5.661272,0.85056 4.303079,0.01 9.549862,0.24636 14.627167,0.65835 6.271917,0.50893 12.606804,1.04447 18.1587,14.09205 1.256383,2.95263 -0.05146,7.82433 2.707298,0.89052 0.906748,-2.27902 1.363355,-2.02044 15.012644,-2.13873 7.507113,-0.065 13.649301,-0.23577 13.649301,-0.37936 0,-0.1436 -0.28095,-0.89482 -0.62433,-1.66938 -0.34338,-0.77455 -1.02601,-2.31327 -1.51695,-3.41938 -0.49094,-1.10612 -2.062126,-4.92722 -3.491523,-8.49135 -1.429397,-3.56413 -2.857843,-7.08356 -3.174329,-7.82097 -0.316495,-0.7374 -1.226445,-2.94962 -2.022113,-4.91605 -0.795667,-1.96641 -4.043105,-11.29798 -3.693629,-11.88325 0.458064,-0.76712 -0.18677,-0.40385 12.337194,-0.40385 9.84423,0 9.65274,0.24739 9.65274,0.24739 1.2078,1.06083 2.78957,6.78964 3.34621,8.01751 0.55721,1.22913 1.27686,2.83788 1.59864,3.57529 0.60465,1.38564 1.79312,3.9863 4.28898,9.38518 0.79543,1.72061 2.34948,5.13949 3.45345,7.59751 2.67446,5.95472 3.04484,6.75259 5.91254,12.73702 2.46283,5.1395 2.46283,5.1395 3.20091,3.24636 2.23698,-5.73776 1.98186,-5.7611 4.28454,-5.95219 1.54958,-0.1286 24.51316,0.54777 24.82611,0.0215 0,0 -3.59658,-6.2074 -5.83995,-10.49576 -8.26158,-15.79266 -13.92752,-27.26401 -13.81355,-28.2205 0.0424,-0.35537 5.59171,-0.19826 13.73661,-0.17244 11.92585,0.0378 11.19138,0.12582 11.45775,0.44068 0.7756,0.9168 5.56816,10.25269 6.3956,11.61578 0.82745,1.36309 2.32581,3.98669 3.32968,5.83019 1.00389,1.84351 2.17996,3.95518 2.61353,4.69258 0.43356,0.7374 1.35628,2.34629 2.0505,3.5753 0.6942,1.22901 3.48408,6.15623 6.19971,10.94936 2.71564,4.79315 6.57201,11.63091 8.5697,15.19503 1.99772,3.56414 3.98079,6.98302 4.40686,7.59753 1.75557,2.53202 7.19727,12.85738 7.19727,13.65646 0,1.35047 -1.83096,1.53856 -14.97656,1.53856 -15.12194,0 -11.00005,0.41867 -13.10487,-0.35263 -2.71179,-0.99372 -7.4667,-12.35312 -8.24465,-13.49738 -0.5144,-0.75665 -20.11115,-0.50211 -20.85813,0.10747 -0.30114,0.24573 -4.74222,12.87268 -5.21806,13.18149 -0.51253,0.33263 1.56565,0.31373 -13.12083,0.46948 -14.37638,0.15246 -12.92516,-0.20864 -13.7378,-0.46876 -1.39249,-0.44578 -3.05836,-6.3221 -3.28223,-6.8137 -0.2239,-0.4916 -1.69614,-6.08358 -2.6942,-7.30424 -0.46821,-0.57263 -22.000524,-0.10018 -22.427167,0.30027 -0.495999,0.46555 -2.403531,4.97746 -3.536292,7.45088 -3.647579,7.96455 -0.798091,6.48322 -14.189162,6.21687 -7.764148,-0.15444 -10.944164,0.0682 -12.663388,-0.49314 -2.370345,-0.7739 -1.493164,-2.84033 -1.713395,-2.39718 -2.970363,5.97706 -32.338174,3.84174 -36.236923,2.90565 z m 12.24087,-53.49377 c -0.644922,-0.55276 -1.868417,-1.61286 -2.718877,-2.35578 C 28.5887,122.6096 17.54033,106.32825 20.700077,106.24689 c 18.520277,-0.47684 31.530155,-0.22018 43.622587,-0.0695 12.878883,18.49983 14.110357,21.6067 12.221476,21.31699 -20.587891,-5.5e-4 -41.658407,0.57749 -42.830997,-0.42752 z" />
              </g>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#e5e4dd]">Master Controller</h1>
            <p className="text-sm text-[#dcdbd5]">Centralized Design System Control</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Cloud Sync Status - Phase 9 */}
          <div className="mr-2">
            <SyncStatus />
          </div>
          <button
            onClick={togglePreview}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#ffd700] bg-[#404040] border border-[#ffd700]/30 rounded-md hover:bg-[#ffd700]/10 hover:border-[#ffd700] transition-all"
            title={showPreview ? 'Hide Preview' : 'Show Preview'}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Hide' : 'Preview'}
          </button>

          <button
            onClick={handleCopyCSS}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              copySuccess
                ? 'text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]'
                : 'text-[#dcdbd5] bg-[#404040] border border-[#404040] hover:bg-[#00ff88]/5 hover:border-[#00ff88]/50'
            }`}
            title="Copy CSS Variables"
          >
            <Copy className="w-4 h-4" />
            {copySuccess ? 'Copied!' : 'Copy CSS'}
          </button>

          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#dcdbd5] bg-[#404040] border border-[#404040] rounded-md hover:bg-[#00ff88]/5 hover:border-[#00ff88]/50 transition-all"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#191818] bg-[#ffd700] border border-[#ffd700] rounded-md hover:bg-[#ffd700]/90 hover:shadow-lg hover:shadow-[#ffd700]/30 transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={handleResetAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-300 bg-red-950/50 border border-red-700/50 rounded-md hover:bg-red-950 hover:border-red-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </button>
        </div>
      </div>

      {importError && (
        <div className="px-6 py-3 bg-red-950 border-b border-red-800 text-red-300 text-sm">
          <strong>Import Error:</strong> {importError}
        </div>
      )}

      <ConfirmDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title="Reset All Settings?"
        message="This will reset all typography, colors, spacing, and component settings to their default values. This action cannot be undone."
        onConfirm={confirmReset}
        confirmText="Reset All"
        variant="destructive"
      />
    </>
  );
}
