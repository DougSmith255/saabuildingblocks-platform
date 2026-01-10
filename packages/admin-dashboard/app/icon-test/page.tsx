'use client';

import { useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import styles from './page.module.css';

const iconSizes = [48, 72, 96, 128, 144, 152, 192, 384, 512];
const maskableSizes = [192, 512];

export default function IconTestPage() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  return (
    <>
      {showLoadingScreen && (
        <LoadingScreen
          isLoading={true}
          message="Loading Agent Portal..."
        />
      )}

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>App Icon & Loading Screen Test</h1>
          <p>Preview all PWA icons and the loading screen component</p>
        </header>

        {/* Loading Screen Test */}
        <section className={styles.section}>
          <h2>Loading Screen</h2>
          <p className={styles.description}>
            The loading screen uses the same glass shimmer effect as the app header,
            with the SAA logo and an animated loading bar.
          </p>
          <button
            className={styles.button}
            onClick={() => {
              setShowLoadingScreen(true);
              setTimeout(() => setShowLoadingScreen(false), 4000);
            }}
          >
            Show Loading Screen (4s)
          </button>
        </section>

        {/* Standard Icons */}
        <section className={styles.section}>
          <h2>Standard App Icons</h2>
          <p className={styles.description}>
            These icons are used for Android/iOS home screens. The OS applies its own
            mask (rounded corners, circles, squircles) automatically.
          </p>
          <div className={styles.iconGrid}>
            {iconSizes.map((size) => (
              <div
                key={size}
                className={styles.iconCard}
                onClick={() => setSelectedIcon(`/icons/icon-${size}x${size}.png`)}
              >
                <div className={styles.iconWrapper} style={{ width: Math.min(size, 128), height: Math.min(size, 128) }}>
                  <img
                    src={`/icons/icon-${size}x${size}.png`}
                    alt={`Icon ${size}x${size}`}
                    width={Math.min(size, 128)}
                    height={Math.min(size, 128)}
                  />
                </div>
                <span className={styles.iconLabel}>{size}x{size}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Maskable Icons */}
        <section className={styles.section}>
          <h2>Maskable Icons (Android Adaptive)</h2>
          <p className={styles.description}>
            These icons have extra padding so the logo stays visible when Android
            crops them to different shapes (circles, squircles, rounded squares).
          </p>
          <div className={styles.iconGrid}>
            {maskableSizes.map((size) => (
              <div
                key={`maskable-${size}`}
                className={styles.iconCard}
                onClick={() => setSelectedIcon(`/icons/maskable-${size}x${size}.png`)}
              >
                <div className={styles.iconWrapper} style={{ width: Math.min(size, 128), height: Math.min(size, 128) }}>
                  <img
                    src={`/icons/maskable-${size}x${size}.png`}
                    alt={`Maskable ${size}x${size}`}
                    width={Math.min(size, 128)}
                    height={Math.min(size, 128)}
                  />
                </div>
                <span className={styles.iconLabel}>maskable-{size}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Apple Touch Icon */}
        <section className={styles.section}>
          <h2>Apple Touch Icon</h2>
          <p className={styles.description}>
            Used when users add the PWA to their iOS home screen. Apple applies
            its signature rounded rectangle mask.
          </p>
          <div className={styles.iconGrid}>
            <div
              className={styles.iconCard}
              onClick={() => setSelectedIcon('/icons/apple-touch-icon.png')}
            >
              <div className={styles.iconWrapper} style={{ width: 128, height: 128 }}>
                <img
                  src="/icons/apple-touch-icon.png"
                  alt="Apple Touch Icon"
                  width={128}
                  height={128}
                />
              </div>
              <span className={styles.iconLabel}>180x180</span>
            </div>
          </div>
        </section>

        {/* Device Mockups */}
        <section className={styles.section}>
          <h2>Device Mockups</h2>
          <p className={styles.description}>
            Preview how the icons will look with different OS mask shapes applied.
          </p>
          <div className={styles.mockupGrid}>
            {/* iOS Style */}
            <div className={styles.mockupCard}>
              <h3>iOS</h3>
              <div className={styles.iosMask}>
                <img
                  src="/icons/icon-512x512.png"
                  alt="iOS mockup"
                  width={80}
                  height={80}
                />
              </div>
              <span>Superellipse</span>
            </div>

            {/* Android Circle */}
            <div className={styles.mockupCard}>
              <h3>Android (Circle)</h3>
              <div className={styles.circleMask}>
                <img
                  src="/icons/maskable-512x512.png"
                  alt="Android circle mockup"
                  width={80}
                  height={80}
                />
              </div>
              <span>Pixel/Stock</span>
            </div>

            {/* Android Squircle */}
            <div className={styles.mockupCard}>
              <h3>Android (Squircle)</h3>
              <div className={styles.squircleMask}>
                <img
                  src="/icons/maskable-512x512.png"
                  alt="Android squircle mockup"
                  width={80}
                  height={80}
                />
              </div>
              <span>Samsung/Most</span>
            </div>

            {/* Android Rounded Square */}
            <div className={styles.mockupCard}>
              <h3>Android (Rounded)</h3>
              <div className={styles.roundedMask}>
                <img
                  src="/icons/maskable-512x512.png"
                  alt="Android rounded mockup"
                  width={80}
                  height={80}
                />
              </div>
              <span>Some OEMs</span>
            </div>
          </div>
        </section>

        {/* SVG Sources */}
        <section className={styles.section}>
          <h2>SVG Source Files</h2>
          <p className={styles.description}>
            The master SVG files used to generate all PNG sizes.
          </p>
          <div className={styles.svgGrid}>
            <a href="/icons/icon-master.svg" target="_blank" className={styles.svgLink}>
              icon-master.svg
            </a>
            <a href="/icons/icon-maskable.svg" target="_blank" className={styles.svgLink}>
              icon-maskable.svg
            </a>
            <a href="/icons/icon-transparent.svg" target="_blank" className={styles.svgLink}>
              icon-transparent.svg
            </a>
          </div>
        </section>

        {/* Selected Icon Preview */}
        {selectedIcon && (
          <div className={styles.modal} onClick={() => setSelectedIcon(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={() => setSelectedIcon(null)}>×</button>
              <img src={selectedIcon} alt="Selected icon preview" />
              <p>{selectedIcon}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
