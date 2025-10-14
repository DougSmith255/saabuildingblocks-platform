'use client';

import React, { useState } from 'react';
import { SlotMachine3D } from './SlotMachine3D';

/**
 * Example usage page for SlotMachine3D component
 * Demonstrates all features and customization options
 */
export default function SlotMachine3DExample() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [customValue, setCustomValue] = useState(3700);

  const handleComplete = () => {
    console.log('Animation complete!');
    setIsAnimating(false);
  };

  const startAnimation = () => {
    setIsAnimating(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-h1 text-display mb-4">
            SlotMachine3D Component
          </h1>
          <p className="text-body text-gray-300">
            Production-ready 3D slot machine counter with dramatic glow effects
          </p>
        </header>

        {/* Example 1: Default Configuration */}
        <section className="bg-gray-800/50 rounded-lg p-8">
          <h2 className="text-h2 mb-6">Default Configuration</h2>
          <div className="flex justify-center py-8">
            <SlotMachine3D value={3700} />
          </div>
          <pre className="bg-gray-900 p-4 rounded mt-6 overflow-x-auto">
            <code className="text-sm text-green-400">
{`<SlotMachine3D value={3700} />`}
            </code>
          </pre>
        </section>

        {/* Example 2: Custom Color */}
        <section className="bg-gray-800/50 rounded-lg p-8">
          <h2 className="text-h2 mb-6">Custom Color (Cyan)</h2>
          <div className="flex justify-center py-8">
            <SlotMachine3D
              value={5000}
              label="USERS"
              color="#00ff88"
            />
          </div>
          <pre className="bg-gray-900 p-4 rounded mt-6 overflow-x-auto">
            <code className="text-sm text-green-400">
{`<SlotMachine3D
  value={5000}
  label="USERS"
  color="#00ff88"
/>`}
            </code>
          </pre>
        </section>

        {/* Example 3: Reduced Glow */}
        <section className="bg-gray-800/50 rounded-lg p-8">
          <h2 className="text-h2 mb-6">Reduced Glow Intensity</h2>
          <div className="flex justify-center py-8">
            <SlotMachine3D
              value={1500}
              label="DOWNLOADS"
              glowIntensity={0.3}
            />
          </div>
          <pre className="bg-gray-900 p-4 rounded mt-6 overflow-x-auto">
            <code className="text-sm text-green-400">
{`<SlotMachine3D
  value={1500}
  label="DOWNLOADS"
  glowIntensity={0.3}
/>`}
            </code>
          </pre>
        </section>

        {/* Example 4: No 3D Effects */}
        <section className="bg-gray-800/50 rounded-lg p-8">
          <h2 className="text-h2 mb-6">2D Mode (No 3D Transform)</h2>
          <div className="flex justify-center py-8">
            <SlotMachine3D
              value={999}
              label="ITEMS"
              enable3D={false}
            />
          </div>
          <pre className="bg-gray-900 p-4 rounded mt-6 overflow-x-auto">
            <code className="text-sm text-green-400">
{`<SlotMachine3D
  value={999}
  label="ITEMS"
  enable3D={false}
/>`}
            </code>
          </pre>
        </section>

        {/* Example 5: No Plus Sign */}
        <section className="bg-gray-800/50 rounded-lg p-8">
          <h2 className="text-h2 mb-6">Without Plus Sign</h2>
          <div className="flex justify-center py-8">
            <SlotMachine3D
              value={2500}
              label="VISITORS"
              showPlus={false}
            />
          </div>
          <pre className="bg-gray-900 p-4 rounded mt-6 overflow-x-auto">
            <code className="text-sm text-green-400">
{`<SlotMachine3D
  value={2500}
  label="VISITORS"
  showPlus={false}
/>`}
            </code>
          </pre>
        </section>

        {/* Example 6: Custom Duration */}
        <section className="bg-gray-800/50 rounded-lg p-8">
          <h2 className="text-h2 mb-6">Slow Animation (5 seconds)</h2>
          <div className="flex justify-center py-8">
            <SlotMachine3D
              value={10000}
              label="POINTS"
              duration={5}
            />
          </div>
          <pre className="bg-gray-900 p-4 rounded mt-6 overflow-x-auto">
            <code className="text-sm text-green-400">
{`<SlotMachine3D
  value={10000}
  label="POINTS"
  duration={5}
/>`}
            </code>
          </pre>
        </section>

        {/* Example 7: Interactive Control */}
        <section className="bg-gray-800/50 rounded-lg p-8">
          <h2 className="text-h2 mb-6">Manual Control</h2>
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="flex gap-4">
              <input
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(Number(e.target.value))}
                className="bg-gray-900 text-white px-4 py-2 rounded border border-gray-700"
                placeholder="Enter value"
              />
              <button
                onClick={startAnimation}
                disabled={isAnimating}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-bold px-6 py-2 rounded transition-colors"
              >
                {isAnimating ? 'Animating...' : 'Start Animation'}
              </button>
            </div>
            <SlotMachine3D
              value={customValue}
              label="CUSTOM"
              autoStart={false}
              onComplete={handleComplete}
            />
          </div>
          <pre className="bg-gray-900 p-4 rounded mt-6 overflow-x-auto">
            <code className="text-sm text-green-400">
{`<SlotMachine3D
  value={customValue}
  label="CUSTOM"
  autoStart={false}
  onComplete={handleComplete}
/>`}
            </code>
          </pre>
        </section>

        {/* Example 8: Accessibility Demo */}
        <section className="bg-gray-800/50 rounded-lg p-8">
          <h2 className="text-h2 mb-6">Accessibility Features</h2>
          <div className="flex justify-center py-8">
            <SlotMachine3D
              value={7500}
              label="ACTIVE USERS"
              ariaLabel="Total active users this month"
              reduceMotion={false}
            />
          </div>
          <div className="mt-6 space-y-2 text-gray-300">
            <p>✅ ARIA role: <code className="text-green-400">status</code></p>
            <p>✅ ARIA live: <code className="text-green-400">polite</code></p>
            <p>✅ Custom label: <code className="text-green-400">Total active users this month</code></p>
            <p>✅ Respects: <code className="text-green-400">prefers-reduced-motion</code></p>
          </div>
          <pre className="bg-gray-900 p-4 rounded mt-6 overflow-x-auto">
            <code className="text-sm text-green-400">
{`<SlotMachine3D
  value={7500}
  label="ACTIVE USERS"
  ariaLabel="Total active users this month"
  reduceMotion={false}
/>`}
            </code>
          </pre>
        </section>

        {/* Feature Summary */}
        <section className="bg-gray-800/50 rounded-lg p-8">
          <h2 className="text-h2 mb-6">Features Summary</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <div className="space-y-2">
              <h3 className="text-yellow-500 font-bold mb-3">Visual Effects</h3>
              <p>✨ 3D transforms (perspective, translateZ, rotateY)</p>
              <p>✨ Multi-layer glow (7 text-shadow layers)</p>
              <p>✨ Pulsing animation during counting</p>
              <p>✨ Brand yellow (#ffd700) default</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-yellow-500 font-bold mb-3">Performance</h3>
              <p>⚡ requestAnimationFrame (60fps)</p>
              <p>⚡ useRef for frame IDs (no re-renders)</p>
              <p>⚡ Memoized expensive calculations</p>
              <p>⚡ Transform-only animations (GPU)</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-yellow-500 font-bold mb-3">Accessibility</h3>
              <p>♿ WCAG 2.1 AAA compliant</p>
              <p>♿ prefers-reduced-motion support</p>
              <p>♿ ARIA live regions</p>
              <p>♿ Screen reader friendly</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-yellow-500 font-bold mb-3">Customization</h3>
              <p>🎨 Custom colors</p>
              <p>🎨 Adjustable glow intensity</p>
              <p>🎨 Optional plus sign and label</p>
              <p>🎨 Enable/disable 3D effects</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 py-8">
          <p>Part of SAA Building Blocks Component Library</p>
          <p className="text-sm mt-2">
            Import: <code className="text-green-400">import {'{ SlotMachine3D }'} from '@/components/saa';</code>
          </p>
        </footer>
      </div>
    </div>
  );
}
