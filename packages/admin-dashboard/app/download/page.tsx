'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function DownloadPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'installed'>('idle');

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Check if already installed (standalone mode)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isInStandaloneMode);

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setInstallStatus('installed');
      setDeferredPrompt(null);
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If no prompt available but on Android, show manual instructions
      if (isAndroid) {
        alert('To install: tap the menu (⋮) in your browser and select "Install app" or "Add to Home screen"');
      }
      return;
    }

    setInstallStatus('installing');

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setInstallStatus('installed');
      } else {
        setInstallStatus('idle');
      }
    } catch (error) {
      console.error('Install error:', error);
      setInstallStatus('idle');
    }

    setDeferredPrompt(null);
  };

  // If already installed, show success message
  if (isStandalone) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4">
        {/* Back Button */}
        <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm">
          <div className="max-w-md mx-auto py-3">
            <a
              href="/agent-portal"
              className="inline-flex items-center gap-2 text-[#e5e4dd]/70 hover:text-[#ffd700] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Agent Portal</span>
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#ffd700]/20 to-[#ffd700]/5 border border-[#ffd700]/30 flex items-center justify-center">
            <svg className="w-12 h-12 text-[#ffd700]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#ffd700] mb-2">App Installed!</h1>
          <p className="text-[#e5e4dd]/70 mb-6">
            You&apos;re already using the SAA Agent Portal app.
          </p>
          <a
            href="/agent-portal"
            className="inline-block px-8 py-3 bg-[#ffd700] text-black font-semibold rounded-xl hover:bg-[#ffed4a] transition-colors"
          >
            Open Agent Portal
          </a>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e4dd]">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <a
            href="/agent-portal"
            className="inline-flex items-center gap-2 text-[#e5e4dd]/70 hover:text-[#ffd700] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Agent Portal</span>
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          {/* App Icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl shadow-[#ffd700]/20 border border-[#ffd700]/30">
            <Image
              src="/icons/icon-512x512.png"
              alt="SAA Agent Portal"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold text-[#ffd700] mb-2">SAA Agent Portal</h1>
          <p className="text-[#e5e4dd]/70">Smart Agent Alliance</p>

          {/* Rating stars (decorative) */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-5 h-5 text-[#ffd700]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-sm text-[#e5e4dd]/50">5.0</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Install Button - Android */}
        {(isAndroid || (!isIOS && !isAndroid)) && (
          <div className="mb-8">
            <button
              onClick={handleInstallClick}
              disabled={installStatus === 'installing'}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
                installStatus === 'installed'
                  ? 'bg-green-500 text-white'
                  : installStatus === 'installing'
                  ? 'bg-[#ffd700]/50 text-black cursor-wait'
                  : 'bg-[#ffd700] text-black hover:bg-[#ffed4a] hover:shadow-lg hover:shadow-[#ffd700]/20'
              }`}
            >
              {installStatus === 'installed' ? (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Installed!
                </>
              ) : installStatus === 'installing' ? (
                <>
                  <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Installing...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Install App
                </>
              )}
            </button>

            {!isInstallable && isAndroid && (
              <p className="text-center text-sm text-[#e5e4dd]/50 mt-3">
                If the button doesn&apos;t work, tap your browser menu (⋮) and select &quot;Install app&quot;
              </p>
            )}
          </div>
        )}

        {/* iOS Instructions */}
        {isIOS && (
          <div className="mb-8">
            <button
              onClick={() => setShowIOSInstructions(!showIOSInstructions)}
              className="w-full py-4 px-6 rounded-xl font-semibold text-lg bg-[#ffd700] text-black hover:bg-[#ffed4a] transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Install on iPhone
            </button>
          </div>
        )}

        {/* iOS Instructions Panel */}
        {(showIOSInstructions || isIOS) && isIOS && (
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#ffd700]/20 overflow-hidden mb-8">
            <div className="p-4 bg-[#ffd700]/10 border-b border-[#ffd700]/20">
              <h2 className="text-lg font-semibold text-[#ffd700] flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Install on iPhone / iPad
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#ffd700] text-black font-bold flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-2">Tap the Share button</p>
                  <p className="text-sm text-[#e5e4dd]/60 mb-3">
                    At the bottom of Safari, tap the share icon (square with arrow pointing up)
                  </p>
                  <div className="bg-[#0a0a0a] rounded-xl p-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#007AFF]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#ffd700] text-black font-bold flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-2">Scroll down and tap &quot;Add to Home Screen&quot;</p>
                  <p className="text-sm text-[#e5e4dd]/60 mb-3">
                    You may need to scroll down in the share menu to find this option
                  </p>
                  <div className="bg-[#0a0a0a] rounded-xl p-4">
                    <div className="flex items-center gap-3 text-[#e5e4dd]">
                      <div className="w-8 h-8 rounded bg-[#333] flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <span>Add to Home Screen</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#ffd700] text-black font-bold flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-2">Tap &quot;Add&quot; in the top right corner</p>
                  <p className="text-sm text-[#e5e4dd]/60">
                    The app will be added to your home screen and work just like a native app!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#e5e4dd]/50 uppercase tracking-wider">App Features</h3>

          <div className="grid gap-3">
            {[
              { icon: '⚡', title: 'Instant Access', desc: 'Launch directly from your home screen' },
              { icon: '📱', title: 'Works Offline', desc: 'Access key features without internet' },
              { icon: '🔔', title: 'Push Notifications', desc: 'Stay updated with team announcements' },
              { icon: '🔒', title: 'Secure Login', desc: 'Your data is protected and encrypted' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-[#1a1a1a]/50 border border-white/5">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <p className="font-medium text-[#e5e4dd]">{feature.title}</p>
                  <p className="text-sm text-[#e5e4dd]/50">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <Image
            src="/images/saa-logo-gold.png"
            alt="Smart Agent Alliance"
            width={120}
            height={45}
            className="mx-auto mb-4 opacity-60"
          />
          <p className="text-xs text-[#e5e4dd]/40">
            Smart Agent Alliance Agent Portal
          </p>
          <a href="/agent-portal" className="text-xs text-[#ffd700]/60 hover:text-[#ffd700] transition-colors">
            Open in browser instead →
          </a>
        </div>
      </div>
    </div>
  );
}
