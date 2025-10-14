'use client';

import { IconLibrary, IconGrid } from '@/components/saa/icons/IconLibrary';

export default function TestIconsPage() {
  return (
    <>
      <link rel="stylesheet" href="/css/wordpress-components/icon-library-v2.css" />

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        padding: '2rem'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#FFD700',
          marginBottom: '3rem',
          fontFamily: 'Amulya, sans-serif'
        }}>
          SAA Icon Library - All Icons
        </h1>

        {/* Default grid view */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ color: '#FFD700', marginBottom: '1rem' }}>Default Grid View</h2>
          <IconLibrary size="large" showLabels={true} />
        </section>

        {/* Grouped by category */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ color: '#FFD700', marginBottom: '1rem' }}>Grouped by Category</h2>
          <IconGrid size="large" showLabels={true} groupByCategory={true} />
        </section>

        {/* Size variants */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ color: '#FFD700', marginBottom: '1rem' }}>Size Variants</h2>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>Small</p>
              <IconLibrary size="small" showLabels={false} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>Medium</p>
              <IconLibrary size="medium" showLabels={false} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>Large</p>
              <IconLibrary size="large" showLabels={false} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div>
              <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>Extra Large</p>
              <IconLibrary size="xl" showLabels={false} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
