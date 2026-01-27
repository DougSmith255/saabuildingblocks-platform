'use client';

/**
 * L-Frame Layer Test Page
 * Shows each layer of the L-frame separately for debugging rounded corners
 */
export default function LFrameTestPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8">
      <h1 className="text-3xl font-bold text-[#ffd700] mb-8">L-Frame Layer Test</h1>
      <p className="text-[#e5e4dd] mb-8">Each layer is shown separately. Check which corners are NOT rounded.</p>

      <div className="grid grid-cols-2 gap-8">

        {/* === HEADER LAYERS === */}
        <div className="col-span-2">
          <h2 className="text-xl font-bold text-[#ffd700] mb-4">HEADER LAYERS (should have bottom-right corner rounded)</h2>
        </div>

        {/* Layer 1: Header Base Gradient */}
        <div className="relative">
          <div className="text-[#00ff88] font-bold mb-2">Layer 1: Header Base Gradient</div>
          <div className="relative h-[120px] w-full overflow-visible">
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(14, 14, 14, 0.98) 0%, rgba(10, 10, 10, 0.95) 100%)',
                borderBottomRightRadius: '24px',
                border: '2px solid #ff0000',
              }}
            />
            <div className="absolute bottom-2 right-2 text-[#ff0000] text-xs">← Bottom-right should be rounded</div>
          </div>
        </div>

        {/* Layer 2: Header Corrugated Stripes */}
        <div className="relative">
          <div className="text-[#00ff88] font-bold mb-2">Layer 2: Header Corrugated Stripes</div>
          <div className="relative h-[120px] w-full overflow-visible">
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 215, 0, 0.15) 2px, rgba(255, 215, 0, 0.15) 4px)`,
                borderBottomRightRadius: '24px',
                border: '2px solid #ff0000',
              }}
            />
            <div className="absolute bottom-2 right-2 text-[#ff0000] text-xs">← Bottom-right should be rounded</div>
          </div>
        </div>

        {/* Layer 3: Header Scan Lines */}
        <div className="relative">
          <div className="text-[#00ff88] font-bold mb-2">Layer 3: Header Scan Lines</div>
          <div className="relative h-[120px] w-full overflow-visible">
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.08) 2px, rgba(255, 255, 255, 0.08) 4px)`,
                borderBottomRightRadius: '24px',
                border: '2px solid #ff0000',
              }}
            />
            <div className="absolute bottom-2 right-2 text-[#ff0000] text-xs">← Bottom-right should be rounded</div>
          </div>
        </div>

        {/* Layer 4: Header Shimmer */}
        <div className="relative">
          <div className="text-[#00ff88] font-bold mb-2">Layer 4: Header Shimmer</div>
          <div className="relative h-[120px] w-full overflow-visible">
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%)',
                borderBottomRightRadius: '24px',
                border: '2px solid #ff0000',
              }}
            />
            <div className="absolute bottom-2 right-2 text-[#ff0000] text-xs">← Bottom-right should be rounded</div>
          </div>
        </div>

        {/* === SIDEBAR LAYERS === */}
        <div className="col-span-2 mt-8">
          <h2 className="text-xl font-bold text-[#ffd700] mb-4">SIDEBAR LAYERS (should have bottom-right corner rounded)</h2>
        </div>

        {/* Layer 5: Sidebar Base Gradient */}
        <div className="relative">
          <div className="text-[#00ff88] font-bold mb-2">Layer 5: Sidebar Base Gradient</div>
          <div className="relative h-[300px] w-[200px] overflow-visible">
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(14, 14, 14, 0.98) 0%, rgba(10, 10, 10, 0.95) 100%)',
                borderBottomRightRadius: '24px',
                border: '2px solid #ff0000',
              }}
            />
            <div className="absolute bottom-2 right-2 text-[#ff0000] text-xs">← Bottom-right</div>
          </div>
        </div>

        {/* Layer 6: Sidebar Corrugated Stripes */}
        <div className="relative">
          <div className="text-[#00ff88] font-bold mb-2">Layer 6: Sidebar Corrugated Stripes</div>
          <div className="relative h-[300px] w-[200px] overflow-visible">
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 215, 0, 0.15) 2px, rgba(255, 215, 0, 0.15) 4px)`,
                borderBottomRightRadius: '24px',
                border: '2px solid #ff0000',
              }}
            />
            <div className="absolute bottom-2 right-2 text-[#ff0000] text-xs">← Bottom-right</div>
          </div>
        </div>

        {/* Layer 7: Sidebar Scan Lines */}
        <div className="relative">
          <div className="text-[#00ff88] font-bold mb-2">Layer 7: Sidebar Scan Lines</div>
          <div className="relative h-[300px] w-[200px] overflow-visible">
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.08) 2px, rgba(255, 255, 255, 0.08) 4px)`,
                borderBottomRightRadius: '24px',
                border: '2px solid #ff0000',
              }}
            />
            <div className="absolute bottom-2 right-2 text-[#ff0000] text-xs">← Bottom-right</div>
          </div>
        </div>

        {/* Layer 8: Sidebar Shimmer */}
        <div className="relative">
          <div className="text-[#00ff88] font-bold mb-2">Layer 8: Sidebar Shimmer</div>
          <div className="relative h-[300px] w-[200px] overflow-visible">
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%)',
                borderBottomRightRadius: '24px',
                border: '2px solid #ff0000',
              }}
            />
            <div className="absolute bottom-2 right-2 text-[#ff0000] text-xs">← Bottom-right</div>
          </div>
        </div>

        {/* === 3D EFFECT LAYERS === */}
        <div className="col-span-2 mt-8">
          <h2 className="text-xl font-bold text-[#ffd700] mb-4">3D EFFECT LAYERS</h2>
        </div>

        {/* Layer 9: Header Bottom Edge Shadow */}
        <div className="relative">
          <div className="text-[#00ff88] font-bold mb-2">Layer 9: Header Bottom Edge (3D Shadow)</div>
          <div className="relative h-[120px] w-full overflow-visible bg-[#0a0a0a]">
            <div
              style={{
                position: 'absolute',
                top: '80px',
                left: '100px',
                right: '0',
                height: '6px',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
                borderBottomRightRadius: '24px',
                border: '2px solid #ff0000',
              }}
            />
            <div className="absolute bottom-2 right-2 text-[#ff0000] text-xs">← Right end should curve</div>
          </div>
        </div>

        {/* Layer 10: Sidebar Right Edge Shadow */}
        <div className="relative">
          <div className="text-[#00ff88] font-bold mb-2">Layer 10: Sidebar Right Edge (3D Shadow)</div>
          <div className="relative h-[300px] w-[200px] overflow-visible bg-[#0a0a0a]">
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '150px',
                width: '6px',
                bottom: '0',
                background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
                borderBottomRightRadius: '24px',
                border: '2px solid #ff0000',
              }}
            />
            <div className="absolute bottom-2 right-2 text-[#ff0000] text-xs">← Bottom should curve</div>
          </div>
        </div>

        {/* === COMBINED L-FRAME PREVIEW === */}
        <div className="col-span-2 mt-8">
          <h2 className="text-xl font-bold text-[#ffd700] mb-4">COMBINED L-FRAME (All layers stacked)</h2>
        </div>

        <div className="col-span-2">
          <div className="relative h-[500px] w-full bg-[#0a0a0a] overflow-visible">
            {/* Header Container */}
            <div
              className="absolute top-0 left-0 right-0 h-[85px] overflow-hidden"
              style={{ borderBottomRightRadius: '24px' }}
            >
              {/* Layer 1 */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(14, 14, 14, 0.98) 0%, rgba(10, 10, 10, 0.95) 100%)',
                  borderBottomRightRadius: '24px',
                }}
              />
              {/* Layer 2 */}
              <div
                className="absolute inset-0"
                style={{
                  background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 215, 0, 0.025) 2px, rgba(255, 215, 0, 0.025) 4px)`,
                  borderBottomRightRadius: '24px',
                }}
              />
              {/* Layer 3 */}
              <div
                className="absolute inset-0"
                style={{
                  background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px)`,
                  borderBottomRightRadius: '24px',
                }}
              />
              {/* Layer 4 */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)',
                  borderBottomRightRadius: '24px',
                }}
              />
            </div>

            {/* Sidebar Container */}
            <div
              className="absolute top-0 left-0 bottom-0 w-[280px] overflow-hidden"
              style={{ borderBottomRightRadius: '24px' }}
            >
              {/* Layer 5 */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(14, 14, 14, 0.98) 0%, rgba(10, 10, 10, 0.95) 100%)',
                  borderBottomRightRadius: '24px',
                }}
              />
              {/* Layer 6 */}
              <div
                className="absolute inset-0"
                style={{
                  background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 215, 0, 0.025) 2px, rgba(255, 215, 0, 0.025) 4px)`,
                  borderBottomRightRadius: '24px',
                }}
              />
              {/* Layer 7 */}
              <div
                className="absolute inset-0"
                style={{
                  background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px)`,
                  borderBottomRightRadius: '24px',
                }}
              />
              {/* Layer 8 */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)',
                  borderBottomRightRadius: '24px',
                }}
              />
            </div>

            {/* Layer 9: Header bottom shadow */}
            <div
              className="absolute"
              style={{
                top: '83px',
                left: '280px',
                right: '0',
                height: '6px',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
                borderBottomRightRadius: '24px',
              }}
            />

            {/* Layer 10: Sidebar right shadow */}
            <div
              className="absolute"
              style={{
                top: '85px',
                left: '276px',
                width: '6px',
                bottom: '0',
                background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
                borderBottomRightRadius: '24px',
              }}
            />

            {/* Corner indicators */}
            <div className="absolute top-[60px] right-4 text-[#ff0000] text-sm font-bold">← Header bottom-right corner</div>
            <div className="absolute bottom-4 left-[290px] text-[#ff0000] text-sm font-bold">← Sidebar bottom-right corner</div>
            <div className="absolute top-[90px] left-[290px] text-[#00ff88] text-sm font-bold">← Inner L corner (content top-left)</div>
          </div>
        </div>

      </div>
    </div>
  );
}
