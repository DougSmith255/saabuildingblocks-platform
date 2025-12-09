'use client';

import { useEffect } from 'react';
import { H1 } from '@saa/shared/components/saa';
import HeroSection from '@/components/shared/HeroSection';

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
    <main className="min-h-screen">
      {/* Hero Section - wrapped for LCP optimization */}
      <HeroSection
        className="relative px-4 sm:px-8 md:px-12 py-24 flex items-center justify-center"
      >
        <div className="max-w-[2500px] mx-auto w-full text-center">
          <H1 heroAnimate animationDelay="0.6s">
            EXP COMMISSION & FEES CALCULATOR
          </H1>
        </div>
      </HeroSection>

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
