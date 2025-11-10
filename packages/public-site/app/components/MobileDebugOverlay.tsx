'use client';

import { useState, useEffect } from 'react';

/**
 * Mobile Debug Overlay - Shows real-time positioning data on mobile devices
 * Press and hold anywhere on screen for 2 seconds to toggle
 */
export function MobileDebugOverlay() {
  const [visible, setVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    h1Top: '0',
    h1Transform: 'none',
    h1ScreenTop: 0,
    profileImgTop: 0,
    profileImgBottom: 0,
    viewportHeight: 0,
    scrollY: 0,
    timestamp: Date.now(),
  });

  useEffect(() => {
    let touchTimer: NodeJS.Timeout | null = null;

    const handleTouchStart = () => {
      touchTimer = setTimeout(() => {
        setVisible((v) => !v);
      }, 2000);
    };

    const handleTouchEnd = () => {
      if (touchTimer) clearTimeout(touchTimer);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      if (touchTimer) clearTimeout(touchTimer);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const updateDebugInfo = () => {
      const h1Container = document.querySelector('.absolute.left-1\\/2.z-10') as HTMLElement;
      const profileImg = document.querySelector('.profile-image') as HTMLImageElement;

      if (h1Container && profileImg) {
        const h1Styles = window.getComputedStyle(h1Container);
        const h1Rect = h1Container.getBoundingClientRect();
        const imgRect = profileImg.getBoundingClientRect();

        setDebugInfo({
          h1Top: h1Styles.top,
          h1Transform: h1Styles.transform,
          h1ScreenTop: Math.round(h1Rect.top),
          profileImgTop: Math.round(imgRect.top),
          profileImgBottom: Math.round(imgRect.bottom),
          viewportHeight: window.visualViewport?.height || window.innerHeight,
          scrollY: Math.round(window.scrollY),
          timestamp: Date.now(),
        });
      }
    };

    // Update continuously
    const interval = setInterval(updateDebugInfo, 100);

    // Also update on scroll
    window.addEventListener('scroll', updateDebugInfo);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', updateDebugInfo);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#0f0',
        padding: '8px',
        fontSize: '11px',
        fontFamily: 'monospace',
        zIndex: 999999,
        maxHeight: '30vh',
        overflow: 'auto',
        lineHeight: '1.4',
      }}
    >
      <div style={{ fontWeight: 'bold', color: '#ff0', marginBottom: '4px' }}>
        🐛 DEBUG (hold 2s to hide)
      </div>
      <div>H1 top: {debugInfo.h1Top}</div>
      <div>H1 transform: {debugInfo.h1Transform}</div>
      <div>H1 screen pos: {debugInfo.h1ScreenTop}px</div>
      <div>Profile top: {debugInfo.profileImgTop}px</div>
      <div>Profile bottom: {debugInfo.profileImgBottom}px</div>
      <div>Viewport height: {debugInfo.viewportHeight}px</div>
      <div>Scroll Y: {debugInfo.scrollY}px</div>
      <div style={{ color: '#888', marginTop: '4px' }}>
        Updated: {new Date(debugInfo.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}
