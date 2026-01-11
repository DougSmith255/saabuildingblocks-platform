'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

interface InstallPWAProps {
  className?: string;
  variant?: 'button' | 'banner' | 'minimal';
}

export default function InstallPWA({ className = '', variant = 'button' }: InstallPWAProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detect Safari
    const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(safari);

    // For iOS, we can't auto-prompt but can show instructions
    if (iOS) {
      setIsInstallable(true);
      return;
    }

    // Listen for the beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      // If no prompt available, show manual instructions
      setShowInstructions(true);
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show if not installable (unless we want to show instructions)
  if (!isInstallable && variant !== 'banner') {
    return null;
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors ${className}`}
        title="Install App"
      >
        <Download className="w-4 h-4" />
        <span>Install App</span>
      </button>
    );
  }

  if (variant === 'banner') {
    if (!isInstallable) return null;

    return (
      <>
        <div className={`bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20 rounded-lg p-4 ${className}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold-500/20 rounded-lg">
                <Smartphone className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Install Agent Portal</h3>
                <p className="text-xs text-gray-400">Get quick access from your home screen</p>
              </div>
            </div>
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-black font-medium text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Install
            </button>
          </div>
        </div>

        {showInstructions && (
          <InstallInstructionsModal
            isIOS={isIOS}
            isSafari={isSafari}
            onClose={() => setShowInstructions(false)}
          />
        )}
      </>
    );
  }

  // Default button variant
  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-medium rounded-lg transition-all shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Install App</span>
      </button>

      {showInstructions && (
        <InstallInstructionsModal
          isIOS={isIOS}
          isSafari={isSafari}
          onClose={() => setShowInstructions(false)}
        />
      )}
    </>
  );
}

interface InstallInstructionsModalProps {
  isIOS: boolean;
  isSafari: boolean;
  onClose: () => void;
}

function InstallInstructionsModal({ isIOS, isSafari, onClose }: InstallInstructionsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {isIOS ? <Smartphone className="w-5 h-5 text-gold-400" /> : <Monitor className="w-5 h-5 text-gold-400" />}
            Install Agent Portal
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isIOS ? (
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              To install the Agent Portal on your iPhone or iPad:
            </p>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gold-500/20 text-gold-400 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                <span className="text-gray-300 text-sm">
                  Tap the <strong className="text-white">Share</strong> button at the bottom of Safari (the square with an arrow pointing up)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gold-500/20 text-gold-400 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                <span className="text-gray-300 text-sm">
                  Scroll down and tap <strong className="text-white">&quot;Add to Home Screen&quot;</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gold-500/20 text-gold-400 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                <span className="text-gray-300 text-sm">
                  Tap <strong className="text-white">&quot;Add&quot;</strong> in the top right corner
                </span>
              </li>
            </ol>
            <div className="mt-4 p-3 bg-gold-500/10 border border-gold-500/20 rounded-lg">
              <p className="text-gold-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                The app will appear on your home screen like a native app!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              To install the Agent Portal on your device:
            </p>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gold-500/20 text-gold-400 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                <span className="text-gray-300 text-sm">
                  Click the <strong className="text-white">install icon</strong> in your browser&apos;s address bar (usually a &quot;+&quot; or computer icon)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gold-500/20 text-gold-400 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                <span className="text-gray-300 text-sm">
                  Or click the <strong className="text-white">three dots menu</strong> and select <strong className="text-white">&quot;Install App&quot;</strong> or <strong className="text-white">&quot;Install SAA Agent Portal&quot;</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gold-500/20 text-gold-400 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                <span className="text-gray-300 text-sm">
                  Click <strong className="text-white">&quot;Install&quot;</strong> to confirm
                </span>
              </li>
            </ol>
            <div className="mt-4 p-3 bg-gold-500/10 border border-gold-500/20 rounded-lg">
              <p className="text-gold-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                The app will open in its own window without browser UI!
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
