'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const SpacemanTest = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('🚀 SpacemanTest mounted!');
    console.log('📁 SVG path:', '/animations/spaceman.svg');
    console.log('🌐 Current URL:', window.location.href);
    setMounted(true);
  }, []);

  return (
    <div className="spaceman-test-container" style={{
      border: '3px solid red',
      padding: '20px',
      margin: '20px',
      background: '#1a1a1a'
    }}>
      <h2 style={{ color: 'yellow', marginBottom: '20px' }}>
        ⚠️ SPACEMAN TEST AREA - Component Mounted: {mounted ? 'YES' : 'NO'}
      </h2>

      {/* Test 1: Direct inline SVG (simplified) */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'cyan' }}>Test 1: Direct Inline SVG</h3>
        <div style={{ border: '1px solid blue', padding: '10px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" width="200" height="200">
            <circle cx="1000" cy="1000" r="800" fill="#4a5568" />
            <circle cx="800" cy="900" r="100" fill="#2d3748" />
            <circle cx="1200" cy="900" r="100" fill="#2d3748" />
            <path d="M 700 1200 Q 1000 1400 1300 1200" stroke="#2d3748" strokeWidth="40" fill="none" />
          </svg>
        </div>
      </div>

      {/* Test 2: Next.js Image component */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'cyan' }}>Test 2: Next.js Image Component</h3>
        <div style={{ border: '1px solid green', padding: '10px', position: 'relative', height: '200px' }}>
          <Image
            src="/animations/spaceman.svg"
            alt="Spaceman"
            fill
            style={{ objectFit: 'contain' }}
            onError={(e) => console.error('❌ Image error:', e)}
            onLoad={() => console.log('✅ Image loaded successfully')}
          />
        </div>
      </div>

      {/* Test 3: Background image CSS */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'cyan' }}>Test 3: Background Image CSS</h3>
        <div style={{
          border: '1px solid orange',
          padding: '10px',
          height: '200px',
          backgroundImage: 'url(/animations/spaceman.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}>
          <p style={{ color: 'white' }}>Background should show behind this text</p>
        </div>
      </div>

      {/* Test 4: Direct img tag */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'cyan' }}>Test 4: Direct IMG Tag</h3>
        <div style={{ border: '1px solid purple', padding: '10px' }}>
          <img
            src="/animations/spaceman.svg"
            alt="Spaceman direct"
            style={{ width: '200px', height: '200px' }}
            onError={(e) => {
              console.error('❌ Direct img error');
              (e.target as HTMLImageElement).style.border = '2px solid red';
            }}
            onLoad={() => console.log('✅ Direct img loaded')}
          />
        </div>
      </div>

      {/* Test 5: Object tag */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'cyan' }}>Test 5: Object Tag</h3>
        <div style={{ border: '1px solid pink', padding: '10px' }}>
          <object
            data="/animations/spaceman.svg"
            type="image/svg+xml"
            width="200"
            height="200"
          >
            ❌ Object tag failed
          </object>
        </div>
      </div>

      {/* Test 6: Iframe (last resort) */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'cyan' }}>Test 6: Iframe</h3>
        <div style={{ border: '1px solid yellow', padding: '10px' }}>
          <iframe
            src="/animations/spaceman.svg"
            width="200"
            height="200"
            style={{ border: 'none' }}
            title="Spaceman iframe"
          />
        </div>
      </div>

      {/* Test 7: Fetch and check */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'cyan' }}>Test 7: File Existence Check</h3>
        <button
          onClick={async () => {
            try {
              const response = await fetch('/animations/spaceman.svg');
              console.log('📊 Fetch response:', response.status, response.statusText);
              console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

              if (response.ok) {
                const text = await response.text();
                console.log('✅ SVG file exists! Size:', text.length, 'bytes');
                console.log('📝 First 500 chars:', text.substring(0, 500));
              } else {
                console.error('❌ SVG file not found:', response.status);
              }
            } catch (err) {
              console.error('❌ Fetch error:', err);
            }
          }}
          style={{
            padding: '10px 20px',
            background: '#4a5568',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Check SVG File Existence
        </button>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '10px',
        background: '#2d3748',
        color: 'white'
      }}>
        <p>🔍 Check browser console for detailed logs</p>
        <p>🎯 Look for errors, successful loads, and fetch results</p>
        <p>📍 SVG should be at: /home/claude-flow/nextjs-frontend/public/animations/spaceman.svg</p>
      </div>
    </div>
  );
};

export default SpacemanTest;
