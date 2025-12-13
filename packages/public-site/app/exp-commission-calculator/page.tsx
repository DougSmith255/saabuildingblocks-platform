'use client';

import { useEffect, useState, useRef } from 'react';
import { H1, Tagline } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import { StickyHeroWrapper } from '@/components/shared/hero-effects';

// Initial progress values for the data stream effect
const INITIAL_PROGRESS_START = 0.05;
const INITIAL_PROGRESS_END = 0.5;

/**
 * eXp Commission & Fees Calculator Page
 *
 * Calculator code copied directly from WordPress for exact functionality.
 */
export default function ExpCommissionCalculator() {
  useEffect(() => {
    // Initialize calculations when component mounts
    const slider = document.getElementById('transactions') as HTMLInputElement;
    if (slider) {
      updateSlider(slider);
      updateCalculation();
    }
  }, []);

  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <CalculatorDataStreamEffect />
          <div className="relative z-10 max-w-[1900px] mx-auto w-full text-center">
            <H1>KNOW YOUR NUMBERS</H1>
            <Tagline className="mt-4">
              No hidden fees. Just facts.
            </Tagline>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Calculator Section */}
      <section
        className="py-8 px-4"
      >
        <div className="max-w-[1000px] mx-auto">
          {/* Calculator Module - Code copied from WordPress */}
          <div className="calculator-module">
            <style jsx>{`
              @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Exo:wght@400;700&display=swap');

              .calculator-module {
                  font-family: 'Open Sans', sans-serif;
                  background-color: #fff;
                  width: 100%;
                  max-width: 1000px;
                  margin: 0 auto;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }

              .calculator-inputs {
                  margin-bottom: 30px;
              }

              .calculator-inputs input {
                  width: 100%;
                  padding: 12px;
                  border: 2px solid #004CF4;
                  border-radius: 8px;
                  font-size: 16px;
                  margin-top: 8px;
              }

              .slider-container {
                  position: relative;
                  margin: 40px 0;
              }

              .slider-wrapper {
                  position: relative;
                  height: 50px;
              }

              #transactionValue {
                  position: absolute;
                  top: -30px;
                  left: 0;
                  transform: translateX(-50%);
                  background: #004CF4;
                  color: white;
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-family: 'Exo', sans-serif;
                  transition: left 0.1s ease;
              }

              input[type="range"] {
                  -webkit-appearance: none;
                  width: 100%;
                  height: 6px;
                  background: linear-gradient(to right, #004CF4 var(--progress), #ddd var(--progress));
                  border-radius: 3px;
                  margin: 20px 0;
              }

              input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  width: 24px;
                  height: 24px;
                  background: #004CF4;
                  border-radius: 50%;
                  cursor: pointer;
                  position: relative;
                  z-index: 2;
              }

              .results {
                  display: flex;
                  justify-content: center;
                  gap: 40px;
                  margin-top: 30px;
                  padding: 25px;
                  background-color: #333;
                  border-radius: 10px;
              }

              .result-item {
                  text-align: center;
              }

              .result-item h3 {
                  color: white;
                  margin: 0 0 10px 0;
                  font-size: 18px;
              }

              .result-item p {
                  color: white;
                  margin: 0;
                  font-size: 28px;
                  font-family: 'Exo', sans-serif;
                  font-weight: bold;
              }

              .breakdown-rows {
                  display: flex;
                  flex-direction: column;
                  gap: 15px;
                  margin: 20px 0;
              }

              .breakdown-row {
                  display: grid;
                  gap: 15px;
              }

              .breakdown-row.top {
                  grid-template-columns: repeat(3, 1fr);
              }

              .breakdown-row.bottom {
                  grid-template-columns: repeat(2, 1fr);
              }

              .breakdown-item {
                  text-align: center;
                  padding: 15px;
                  background: #333;
                  border-radius: 8px;
                  color: white;
              }

              .breakdown-item h4 {
                  margin: 0 0 8px 0;
                  font-size: 14px;
                  font-weight: 400;
                  color: white;
              }

              .breakdown-item p {
                  margin: 0;
                  font-size: 18px;
                  font-family: 'Exo', sans-serif;
                  font-weight: bold;
              }

              @media (max-width: 768px) {
                  .breakdown-row.top,
                  .breakdown-row.bottom {
                      grid-template-columns: 1fr;
                  }

                  .results {
                      flex-direction: column;
                      gap: 20px;
                  }
              }
            `}</style>

            <div className="calculator-inputs">
              <label htmlFor="avgCommission" style={{ color: '#333', fontWeight: 'bold' }}>
                Average Commission Per Deal ($)
              </label>
              <input
                type="number"
                id="avgCommission"
                defaultValue={10000}
                min={1}
                onInput={() => updateCalculation()}
              />
            </div>

            <div className="slider-container">
              <div className="slider-wrapper">
                <div id="transactionValue">1</div>
                <input
                  type="range"
                  id="transactions"
                  min={1}
                  max={50}
                  defaultValue={1}
                  onInput={(e) => updateSlider(e.target as HTMLInputElement)}
                  style={{ '--progress': '0%' } as React.CSSProperties}
                />
              </div>
            </div>

            <div className="breakdown-rows">
              <div className="breakdown-row top">
                <div className="breakdown-item">
                  <h4>To eXp (20%)</h4>
                  <p id="expSplit">$0</p>
                </div>
                <div className="breakdown-item">
                  <h4>$25/Deal Review</h4>
                  <p id="brokerFee">$0</p>
                </div>
                <div className="breakdown-item">
                  <h4>E&O Insurance</h4>
                  <p id="eoFee">$0</p>
                </div>
              </div>
              <div className="breakdown-row bottom">
                <div className="breakdown-item">
                  <h4>Post-Cap $250/deal</h4>
                  <p id="postCap250">$0</p>
                </div>
                <div className="breakdown-item">
                  <h4>Post 20 Deals $75/deal</h4>
                  <p id="postCap75">$0</p>
                </div>
              </div>
            </div>

            <div className="results">
              <div className="result-item">
                <h3>Total Fees</h3>
                <p id="totalFees">$0</p>
              </div>
              <div className="result-item">
                <h3>Net Commission</h3>
                <p id="netCommission">$0</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <LazySection height={350}>
            <div
              className="mt-8 p-5 bg-white rounded-lg text-center"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.16)',
                lineHeight: '1.6'
              }}
            >
              <p className="text-gray-700 mb-4">
                This calculator shows real estate agents their net commission at eXp Realty. It factors in:
              </p>
              <p className="text-gray-700"><strong>20% to eXp</strong> (capped at $16k annually)</p>
              <p className="text-gray-700"><strong>$25/deal broker review</strong></p>
              <p className="text-gray-700"><strong>$60/deal E&O Insurance</strong> (capped at $750)</p>
              <p className="text-gray-700"><strong>$250/deal Post-cap</strong> (After 100% commission)</p>
              <p className="text-gray-700"><strong>$75/deal after 20 more transactions Post-cap</strong></p>
              <p className="text-gray-700 mt-4">
                Adjust the average commission per deal and number of transactions (1-50) to see instant results.
              </p>
              <p className="text-gray-700 mt-4">
                <strong>(Calculator does not include additional stock awards, ICON rewards, or revenue share income)</strong>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 mb-12">
              <a
                href="/about-exp-realty/fees/"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-lg text-center hover:opacity-90 transition-opacity"
              >
                eXp Fees Fully Explained Blog
              </a>
              <a
                href="/about-exp-realty/commission/"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-lg text-center hover:opacity-90 transition-opacity"
              >
                eXp Commission Fully Explained Blog
              </a>
            </div>
          </LazySection>
        </div>
      </section>
    </main>
  );
}

// Calculator functions - copied from WordPress
function updateSlider(element: HTMLInputElement) {
  const transactions = parseInt(element.value);
  const percent = ((transactions - 1) / 49) * 100;
  element.style.setProperty('--progress', `${percent}%`);

  const bubble = document.getElementById('transactionValue');
  if (bubble) {
    const sliderWidth = element.offsetWidth;
    const bubblePosition = (transactions - 1) / 49 * sliderWidth;
    bubble.style.left = `${bubblePosition}px`;
    bubble.textContent = String(transactions);
  }
  updateCalculation();
}

function updateCalculation() {
  const transactionsEl = document.getElementById('transactions') as HTMLInputElement;
  const avgCommissionEl = document.getElementById('avgCommission') as HTMLInputElement;

  if (!transactionsEl || !avgCommissionEl) return;

  const transactions = parseInt(transactionsEl.value);
  const avgCommission = parseFloat(avgCommissionEl.value) || 10000;
  const totalCommission = transactions * avgCommission;

  // Corrected commission calculation
  const commissionPerDealToExp = 0.2 * avgCommission;
  const potentialExpCommission = transactions * commissionPerDealToExp;
  const expCommission = Math.min(potentialExpCommission, 16000);

  // Post-cap fees calculation
  const dealsAfterCap = Math.max((potentialExpCommission - 16000) / commissionPerDealToExp, 0);
  const postCapFirstTier = Math.min(dealsAfterCap, 20);
  const postCapSecondTier = Math.max(dealsAfterCap - 20, 0);
  const postCap250 = postCapFirstTier * 250;
  const postCap75 = postCapSecondTier * 75;

  // Other fees
  const eoFee = Math.min(transactions * 60, 750);
  const brokerFee = transactions * 25;

  // Total calculations
  const totalFees = expCommission + eoFee + brokerFee + postCap250 + postCap75;
  const netCommission = totalCommission - totalFees;

  // Update breakdown display
  const expSplitEl = document.getElementById('expSplit');
  const brokerFeeEl = document.getElementById('brokerFee');
  const eoFeeEl = document.getElementById('eoFee');
  const postCap250El = document.getElementById('postCap250');
  const postCap75El = document.getElementById('postCap75');
  const totalFeesEl = document.getElementById('totalFees');
  const netCommissionEl = document.getElementById('netCommission');

  if (expSplitEl) expSplitEl.textContent = `$${Math.round(expCommission).toLocaleString()}`;
  if (brokerFeeEl) brokerFeeEl.textContent = `$${Math.round(brokerFee).toLocaleString()}`;
  if (eoFeeEl) eoFeeEl.textContent = `$${Math.round(eoFee).toLocaleString()}`;
  if (postCap250El) postCap250El.textContent = `$${Math.round(postCap250).toLocaleString()}`;
  if (postCap75El) postCap75El.textContent = `$${Math.round(postCap75).toLocaleString()}`;

  // Update total display
  if (totalFeesEl) totalFeesEl.textContent = `$${Math.round(totalFees).toLocaleString()}`;
  if (netCommissionEl) netCommissionEl.textContent = `$${Math.round(netCommission).toLocaleString()}`;
}

/**
 * Data Stream Effect - Green Matrix-style rain (copied from login page)
 */
function CalculatorDataStreamEffect() {
  const [progress, setProgress] = useState(INITIAL_PROGRESS_START);
  const currentRef = useRef(INITIAL_PROGRESS_START);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const introStartTimeRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const scrollVelocityRef = useRef(0);

  useEffect(() => {
    const INTRO_DURATION = 3000;
    const INTRO_VELOCITY = (INITIAL_PROGRESS_END - INITIAL_PROGRESS_START) / INTRO_DURATION;
    const IDLE_VELOCITY = 0.000008;
    const SCROLL_VELOCITY_MULTIPLIER = 0.0003;
    const VELOCITY_DECAY = 0.995;
    const TRANSITION_DURATION = 2000;
    let lastTimestamp = 0;
    let introEndTime: number | null = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (scrollDelta > 0) {
        scrollVelocityRef.current = Math.min(scrollDelta * SCROLL_VELOCITY_MULTIPLIER, 0.002);
      }
    };

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;

      if (introStartTimeRef.current === null) {
        introStartTimeRef.current = timestamp;
      }

      const elapsed = timestamp - introStartTimeRef.current;

      // Phase 1: Intro animation
      if (elapsed < INTRO_DURATION) {
        const introProgress = elapsed / INTRO_DURATION;
        const eased = 1 - Math.pow(1 - introProgress, 3);
        currentRef.current = INITIAL_PROGRESS_START + eased * (INITIAL_PROGRESS_END - INITIAL_PROGRESS_START);
        velocityRef.current = INTRO_VELOCITY * (1 - introProgress);
      }
      // Phase 2: Transition from intro to idle
      else if (elapsed < INTRO_DURATION + TRANSITION_DURATION) {
        if (introEndTime === null) {
          introEndTime = timestamp;
          velocityRef.current = INTRO_VELOCITY * 0.1;
        }

        const transitionProgress = (elapsed - INTRO_DURATION) / TRANSITION_DURATION;
        const blendedVelocity = velocityRef.current * (1 - transitionProgress) + IDLE_VELOCITY * transitionProgress;
        const totalVelocity = blendedVelocity + scrollVelocityRef.current;

        currentRef.current += totalVelocity * deltaTime;
        scrollVelocityRef.current *= VELOCITY_DECAY;
      }
      // Phase 3: Continuous idle animation
      else {
        const totalVelocity = IDLE_VELOCITY + scrollVelocityRef.current;
        currentRef.current += totalVelocity * deltaTime;
        scrollVelocityRef.current *= VELOCITY_DECAY;
      }

      if (currentRef.current > 2) {
        currentRef.current = 2;
      }

      setProgress(currentRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    lastScrollY.current = window.scrollY;
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Generate data columns
  const columns = [...Array(20)].map((_, i) => ({
    x: i * 5,
    speed: 0.5 + (i % 4) * 0.3,
    length: 5 + (i % 6),
    delay: (i * 0.02) % 0.4,
    chars: [...Array(22)].map(() => String.fromCharCode(0x30A0 + Math.random() * 96)),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" lang="en" translate="no">
      {/* Green data columns */}
      {columns.map((col, i) => {
        const colProgress = Math.max(0, (progress - col.delay) * col.speed * 2);
        const yOffset = colProgress * 100;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${col.x}%`,
              top: 0,
              width: '3%',
              height: '100%',
              overflow: 'hidden',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.2',
            }}
          >
            {col.chars.map((char, j) => {
              const charY = ((j * 5 + yOffset) % 105);
              const isHead = j === Math.floor(colProgress * col.chars.length) % col.chars.length;
              const brightness = isHead ? 1 : Math.max(0, 1 - j * 0.06);
              const fadeAtBottom = charY > 70 ? Math.max(0, 1 - (charY - 70) / 30) : 1;

              return (
                <div
                  key={j}
                  style={{
                    position: 'absolute',
                    top: `${charY}%`,
                    color: isHead
                      ? `rgba(255,255,255,${0.95 * fadeAtBottom})`
                      : `rgba(100,255,100,${brightness * 0.7 * fadeAtBottom})`,
                    textShadow: isHead
                      ? `0 0 15px rgba(100,255,100,${0.8 * fadeAtBottom})`
                      : `0 0 5px rgba(100,255,100,${brightness * 0.3 * fadeAtBottom})`,
                  }}
                >
                  {char}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}
