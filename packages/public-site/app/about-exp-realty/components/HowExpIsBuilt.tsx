'use client';

import { useEffect, useRef, useState } from 'react';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds';
import { H2 } from '@saa/shared/components/saa/headings';

export default function HowExpIsBuilt() {
  const revshareRef = useRef<HTMLDivElement>(null);
  const stockRef = useRef<HTMLDivElement>(null);
  const [revshareVisible, setRevshareVisible] = useState(false);
  const [stockVisible, setStockVisible] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    if (revshareRef.current) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setRevshareVisible(true);
            obs.disconnect();
          }
        },
        { threshold: 1.0, rootMargin: '0px 0px -80px 0px' }
      );
      obs.observe(revshareRef.current);
      observers.push(obs);
    }

    if (stockRef.current) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setStockVisible(true);
            obs.disconnect();
          }
        },
        { threshold: 0.5, rootMargin: '0px 0px -60px 0px' }
      );
      obs.observe(stockRef.current);
      observers.push(obs);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <GlassPanel variant="expBlueCrosshatch">
    <section className="py-[50px]">
      <div className="how-exp-section">
        <div className="how-exp-heading">
          <H2>How eXp is Built for Agents</H2>
        </div>

        {/* ═══ Comparison ═══ */}
        <div className="how-exp-comparison">
          <div className="how-exp-comparison-side how-exp-comparison-left">
            <div className="how-exp-comparison-icon how-exp-comparison-icon-red">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff5050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <div className="how-exp-comparison-label">Traditional Brokerages</div>
            <p className="how-exp-comparison-text how-exp-comparison-text-red">Most brokerages focus on transactions.</p>
          </div>

          <div className="how-exp-comparison-divider" />
          <div className="how-exp-vs-badge">VS</div>

          <div className="how-exp-comparison-side how-exp-comparison-right">
            <div className="how-exp-bg-image">
              <svg viewBox="0 0 500 400" fill="none" style={{ width: '100%', height: '100%' }}>
                <circle cx="100" cy="150" r="40" stroke="#00bfff" strokeWidth="1" opacity="0.4" />
                <circle cx="250" cy="100" r="60" stroke="#00bfff" strokeWidth="1" opacity="0.3" />
                <circle cx="400" cy="180" r="35" stroke="#00bfff" strokeWidth="1" opacity="0.35" />
                <circle cx="180" cy="300" r="50" stroke="#00bfff" strokeWidth="1" opacity="0.25" />
                <circle cx="350" cy="320" r="45" stroke="#00bfff" strokeWidth="1" opacity="0.3" />
                <line x1="130" y1="130" x2="210" y2="110" stroke="#00bfff" strokeWidth="0.5" opacity="0.3" />
                <line x1="290" y1="120" x2="380" y2="165" stroke="#00bfff" strokeWidth="0.5" opacity="0.25" />
                <line x1="230" y1="140" x2="200" y2="270" stroke="#00bfff" strokeWidth="0.5" opacity="0.2" />
                <line x1="120" y1="180" x2="160" y2="270" stroke="#00bfff" strokeWidth="0.5" opacity="0.2" />
                <line x1="370" y1="200" x2="360" y2="290" stroke="#00bfff" strokeWidth="0.5" opacity="0.25" />
                <circle cx="100" cy="150" r="4" fill="#00bfff" opacity="0.5" />
                <circle cx="250" cy="100" r="5" fill="#00bfff" opacity="0.4" />
                <circle cx="400" cy="180" r="3" fill="#00bfff" opacity="0.5" />
                <circle cx="180" cy="300" r="4" fill="#00bfff" opacity="0.3" />
                <circle cx="350" cy="320" r="4" fill="#00bfff" opacity="0.4" />
              </svg>
            </div>
            <div className="how-exp-comparison-icon how-exp-comparison-icon-blue">
              <img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-x-logo-icon/public" alt="eXp" width="28" height="28" style={{ filter: 'drop-shadow(0 0 6px rgba(0,191,255,0.5))' }} />
            </div>
            <div className="how-exp-comparison-label">eXp Realty</div>
            <p className="how-exp-comparison-text how-exp-comparison-text-blue">
              eXp focuses on transactions <em>and income beyond.</em>
            </p>
          </div>
        </div>

        {/* ═══ Transition strip ═══ */}
        <div className="how-exp-transition">
          <div className="how-exp-transition-line" />
          <span className="how-exp-transition-text">eXp is structured to help agents</span>
          <div className="how-exp-transition-line" />
        </div>

        {/* ═══ Bento Grid ═══ */}
        <div className="how-exp-bento">
          {/* Card 1: Income */}
          <div className="how-exp-card how-exp-card-income">
            <div className="how-exp-glow how-exp-glow-income" />
            <div className="how-exp-texture" />
            <span className="how-exp-num how-exp-num-income">01</span>
            <div className="how-exp-visual how-exp-visual-income">
              <svg viewBox="0 0 300 220" fill="none">
                <path d="M0 200 L60 200 L60 160 L120 160 L120 120 L180 120 L180 80 L240 80 L240 40 L300 40 L300 0" stroke="rgba(0,191,255,0.15)" strokeWidth="2" fill="none" />
                <path d="M0 200 L60 200 L60 160 L120 160 L120 120 L180 120 L180 80 L240 80 L240 40 L300 40 L300 0 L300 220 L0 220 Z" fill="url(#incomeGrad)" />
                <defs>
                  <linearGradient id="howExpIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,191,255,0.08)" />
                    <stop offset="100%" stopColor="rgba(0,191,255,0)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="how-exp-icon how-exp-icon-blue">
                <div className="how-exp-icon-outer" />
                <div className="how-exp-icon-inner">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
              <p className="how-exp-keyword how-exp-keyword-income">Keep more take-home income</p>
              <p className="how-exp-desc">80/20 split until a $16,000 annual cap, then 100% commission. No royalties, no desk fees, no franchise fees.</p>
            </div>
            <div className="how-exp-stat">
              <div className="how-exp-stat-number">100%</div>
              <div className="how-exp-stat-label">commission after cap</div>
            </div>
          </div>

          {/* Card 2: Stock */}
          <div ref={stockRef} className={`how-exp-card how-exp-card-stock${stockVisible ? ' in-view' : ''}`}>
            <div className="how-exp-glow how-exp-glow-stock" />
            <div className="how-exp-texture" />
            <span className="how-exp-num how-exp-num-stock">02</span>
            <div className="how-exp-visual how-exp-visual-stock">
              <svg viewBox="0 0 300 80" preserveAspectRatio="none" fill="none">
                <path d="M0 60 L30 55 L60 58 L90 40 L120 45 L150 30 L180 35 L210 20 L240 25 L270 12 L300 15" stroke="#4cd964" strokeWidth="2" className="how-exp-stock-line" />
                <path d="M0 60 L30 55 L60 58 L90 40 L120 45 L150 30 L180 35 L210 20 L240 25 L270 12 L300 15 L300 80 L0 80 Z" fill="url(#howExpStockGrad)" />
                <defs>
                  <linearGradient id="howExpStockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(76,217,100,0.15)" />
                    <stop offset="100%" stopColor="rgba(76,217,100,0)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="how-exp-icon how-exp-icon-green" style={{ position: 'relative', zIndex: 1 }}>
              <div className="how-exp-icon-outer" />
              <div className="how-exp-icon-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
            </div>
            <p className="how-exp-keyword" style={{ position: 'relative', zIndex: 1 }}>Earn stock</p>
            <p className="how-exp-desc" style={{ position: 'relative', zIndex: 1 }}>in a publicly traded company</p>
            <div className="how-exp-chip how-exp-chip-green">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /></svg>
              EXPI · NYSE
            </div>
          </div>

          {/* Card 3: Collaboration */}
          <div className="how-exp-card how-exp-card-collab">
            <div className="how-exp-glow how-exp-glow-collab" />
            <div className="how-exp-texture" />
            <span className="how-exp-num how-exp-num-collab">03</span>
            <div className="how-exp-visual how-exp-visual-collab">
              <svg viewBox="0 0 300 300" fill="none">
                <line x1="80" y1="60" x2="200" y2="40" stroke="#9933ff" strokeWidth="0.5" opacity="0.5" />
                <line x1="200" y1="40" x2="260" y2="120" stroke="#9933ff" strokeWidth="0.5" opacity="0.4" />
                <line x1="80" y1="60" x2="50" y2="160" stroke="#9933ff" strokeWidth="0.5" opacity="0.4" />
                <line x1="50" y1="160" x2="150" y2="200" stroke="#9933ff" strokeWidth="0.5" opacity="0.3" />
                <line x1="260" y1="120" x2="220" y2="230" stroke="#9933ff" strokeWidth="0.5" opacity="0.35" />
                <line x1="150" y1="200" x2="220" y2="230" stroke="#9933ff" strokeWidth="0.5" opacity="0.3" />
                <line x1="200" y1="40" x2="150" y2="200" stroke="#9933ff" strokeWidth="0.5" opacity="0.2" />
                <line x1="80" y1="60" x2="260" y2="120" stroke="#9933ff" strokeWidth="0.5" opacity="0.15" />
                <circle className="how-exp-node" cx="80" cy="60" r="4" fill="#9933ff" opacity="0.5" />
                <circle className="how-exp-node" cx="200" cy="40" r="5" fill="#9933ff" opacity="0.4" />
                <circle className="how-exp-node" cx="260" cy="120" r="3" fill="#9933ff" opacity="0.5" />
                <circle className="how-exp-node" cx="50" cy="160" r="4" fill="#9933ff" opacity="0.3" />
                <circle className="how-exp-node" cx="150" cy="200" r="5" fill="#9933ff" opacity="0.4" />
                <circle className="how-exp-node" cx="220" cy="230" r="3" fill="#9933ff" opacity="0.35" />
                <circle cx="80" cy="60" r="12" stroke="#9933ff" strokeWidth="0.5" opacity="0.15" />
                <circle cx="200" cy="40" r="15" stroke="#9933ff" strokeWidth="0.5" opacity="0.1" />
                <circle cx="150" cy="200" r="14" stroke="#9933ff" strokeWidth="0.5" opacity="0.12" />
              </svg>
            </div>
            <div className="how-exp-icon how-exp-icon-purple" style={{ position: 'relative', zIndex: 1 }}>
              <div className="how-exp-icon-outer" />
              <div className="how-exp-icon-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <p className="how-exp-keyword" style={{ position: 'relative', zIndex: 1 }}>Gain more business</p>
            <p className="how-exp-desc" style={{ position: 'relative', zIndex: 1 }}>through collaboration</p>
            <div className="how-exp-chip how-exp-chip-purple">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /></svg>
              90,000+ agents
            </div>
          </div>

          {/* Card 4: Revenue Share */}
          <div className={`how-exp-card how-exp-card-revshare${revshareVisible ? ' in-view' : ''}`}>
            <div className="how-exp-glow how-exp-glow-revshare" />
            <div className="how-exp-texture" />
            <span className="how-exp-num how-exp-num-revshare">04</span>
            <div className="how-exp-visual how-exp-visual-revshare">
              <svg viewBox="0 0 800 200" preserveAspectRatio="none" fill="none" style={{ width: '100%', height: '100%' }}>
                <path d="M0 180 C200 180, 200 100, 400 100 C600 100, 600 40, 800 40" stroke="rgba(255,215,0,0.12)" strokeWidth="2" />
                <path d="M0 160 C200 160, 250 120, 400 120 C550 120, 600 70, 800 70" stroke="rgba(255,215,0,0.08)" strokeWidth="1.5" />
                <path d="M0 140 C150 140, 300 80, 500 80 C700 80, 650 30, 800 20" stroke="rgba(255,215,0,0.06)" strokeWidth="1" />
              </svg>
            </div>
            <div className="how-exp-icon how-exp-icon-gold" style={{ position: 'relative', zIndex: 1 }}>
              <div className="how-exp-icon-outer" />
              <div className="how-exp-icon-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
                </svg>
              </div>
            </div>
            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
              <p className="how-exp-keyword how-exp-keyword-revshare">Build income beyond closings</p>
              <p className="how-exp-desc">Revenue share, stock awards, and ICON status create income streams that aren't tied to individual transactions.</p>
              <div ref={revshareRef} className="how-exp-bars">
                <div className="how-exp-bar" /><div className="how-exp-bar" /><div className="how-exp-bar" />
                <div className="how-exp-bar" /><div className="how-exp-bar" /><div className="how-exp-bar" />
                <div className="how-exp-bar" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ═══ Section ═══ */
        .how-exp-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .how-exp-heading {
          text-align: center;
          margin-bottom: 24px;
        }

        /* ═══ Comparison ═══ */
        .how-exp-comparison {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0;
          margin-bottom: 56px;
          position: relative;
          min-height: 300px;
          border-radius: 24px;
          overflow: hidden;
        }
        .how-exp-comparison::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(255,60,60,0.3), rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, rgba(0,191,255,0.3));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          z-index: 3;
          pointer-events: none;
        }
        .how-exp-comparison-side {
          padding: 56px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        .how-exp-comparison-left {
          background: linear-gradient(160deg, rgba(50,15,15,0.9) 0%, rgba(15,8,8,0.98) 100%);
        }
        .how-exp-comparison-right {
          background: linear-gradient(160deg, rgba(8,25,45,0.9) 0%, rgba(5,12,25,0.98) 100%);
        }
        .how-exp-comparison-left::before {
          content: '';
          position: absolute;
          top: 30%; left: 20%;
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(255,60,60,0.12) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 0;
          animation: howExpOrbFloat 8s ease-in-out infinite;
        }
        .how-exp-comparison-right::before {
          content: '';
          position: absolute;
          top: 20%; right: 15%;
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(0,191,255,0.12) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 0;
          animation: howExpOrbFloat 8s ease-in-out infinite reverse;
        }
        @keyframes howExpOrbFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -20px); }
        }
        .how-exp-bg-image {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.06;
          pointer-events: none;
        }
        .how-exp-comparison-icon {
          width: 64px; height: 64px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }
        .how-exp-comparison-icon-red {
          background: rgba(255,60,60,0.08);
          border: 1px solid rgba(255,60,60,0.2);
          box-shadow: 0 0 40px rgba(255,60,60,0.1), inset 0 0 20px rgba(255,60,60,0.05);
        }
        .how-exp-comparison-icon-blue {
          background: rgba(0,191,255,0.08);
          border: 1px solid rgba(0,191,255,0.2);
          box-shadow: 0 0 40px rgba(0,191,255,0.1), inset 0 0 20px rgba(0,191,255,0.05);
        }
        .how-exp-comparison-label {
          font-family: var(--font-synonym), sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 14px;
          opacity: 0.45;
          position: relative;
          z-index: 1;
        }
        .how-exp-comparison-text {
          font-family: var(--font-amulya), sans-serif;
          font-size: clamp(18px, 2.5vw, 28px);
          font-weight: 600;
          line-height: 1.45;
          max-width: 380px;
          position: relative;
          z-index: 1;
        }
        .how-exp-comparison-text-red { color: #e8a0a0; }
        .how-exp-comparison-text-blue { color: #b0d4e8; }
        .how-exp-comparison-text-blue em { color: #5ad4ff; font-style: normal; font-weight: 700; }
        .how-exp-comparison-divider {
          width: 0;
          position: relative;
          z-index: 4;
        }
        .how-exp-comparison-divider::before {
          content: '';
          position: absolute;
          top: 0; bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: 1px;
          background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.15) 15%, rgba(255,255,255,0.15) 85%, transparent 100%);
        }
        .how-exp-vs-badge {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: 0.2em;
          color: #fff;
          background: radial-gradient(ellipse at center, rgba(255,80,80,0.3) 0%, rgba(0,191,255,0.25) 50%, rgba(10,10,15,0.97) 70%);
          border: 2px solid rgba(255,255,255,0.18);
          box-shadow: 0 0 30px rgba(255,80,80,0.15), 0 0 30px rgba(0,191,255,0.15), 0 0 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.05);
          z-index: 5;
          animation: howExpVsPulse 3s ease-in-out infinite;
        }
        @keyframes howExpVsPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(255,80,80,0.15), 0 0 30px rgba(0,191,255,0.15), 0 0 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.05); }
          50% { box-shadow: 0 0 45px rgba(255,80,80,0.25), 0 0 45px rgba(0,191,255,0.25), 0 0 80px rgba(0,0,0,0.5), inset 0 0 25px rgba(255,255,255,0.08); }
        }

        /* ═══ Transition ═══ */
        .how-exp-transition {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 48px;
          padding: 0 48px;
        }
        .how-exp-transition-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,191,255,0.2), transparent);
        }
        .how-exp-transition-text {
          font-family: var(--font-synonym), sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: rgba(229,228,221,0.7);
          white-space: nowrap;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* ═══ Bento Grid ═══ */
        .how-exp-bento {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 16px;
        }

        /* ═══ Base Card ═══ */
        .how-exp-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .how-exp-card:hover { transform: translateY(-4px); }

        .how-exp-card-income {
          grid-row: span 2;
          text-align: left;
          align-items: flex-start;
          padding: 40px 32px;
          justify-content: space-between;
          background: linear-gradient(170deg, rgba(8,22,40,0.95) 0%, rgba(8,12,20,0.98) 100%);
          border: 1px solid rgba(0,191,255,0.15);
        }
        .how-exp-card-income:hover { border-color: rgba(0,191,255,0.3); box-shadow: 0 0 40px rgba(0,191,255,0.08); }

        .how-exp-card-stock {
          background: linear-gradient(160deg, rgba(18,18,18,0.97) 0%, rgba(10,10,10,0.99) 100%);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .how-exp-card-stock:hover { border-color: rgba(76,217,100,0.2); box-shadow: 0 0 30px rgba(76,217,100,0.06); }

        .how-exp-card-collab {
          background: linear-gradient(160deg, rgba(18,18,18,0.97) 0%, rgba(10,10,10,0.99) 100%);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .how-exp-card-collab:hover { border-color: rgba(153,51,255,0.2); box-shadow: 0 0 30px rgba(153,51,255,0.06); }

        .how-exp-card-revshare {
          grid-column: span 2;
          flex-direction: row;
          text-align: left;
          gap: 28px;
          align-items: center;
          padding: 36px 32px;
          background: linear-gradient(160deg, rgba(20,18,12,0.97) 0%, rgba(10,10,10,0.99) 100%);
          border: 1px solid rgba(255,215,0,0.12);
        }
        .how-exp-card-revshare:hover { border-color: rgba(255,215,0,0.25); box-shadow: 0 0 30px rgba(255,215,0,0.06); }

        /* Glow + texture */
        .how-exp-glow {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 0;
        }
        .how-exp-card:hover .how-exp-glow { opacity: 1; }
        .how-exp-glow-income { background: radial-gradient(ellipse 80% 50% at 30% 20%, rgba(0,191,255,0.06) 0%, transparent 70%); }
        .how-exp-glow-stock { background: radial-gradient(ellipse 80% 70% at 50% 20%, rgba(76,217,100,0.05) 0%, transparent 70%); }
        .how-exp-glow-collab { background: radial-gradient(ellipse 80% 70% at 50% 20%, rgba(153,51,255,0.05) 0%, transparent 70%); }
        .how-exp-glow-revshare { background: radial-gradient(ellipse 60% 80% at 30% 50%, rgba(255,215,0,0.04) 0%, transparent 70%); }

        .how-exp-texture {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 20px;
          background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, transparent 1px, transparent 8px),
                             repeating-linear-gradient(-45deg, rgba(255,255,255,0.015) 0px, transparent 1px, transparent 8px);
          background-size: 20px 20px;
          z-index: 0;
        }

        /* ═══ Card Visuals ═══ */
        .how-exp-visual {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          border-radius: 20px;
        }
        .how-exp-visual-income svg {
          position: absolute;
          bottom: 60px; right: -10px;
          width: 280px; height: 200px;
          opacity: 0.06;
        }
        .how-exp-visual-stock svg {
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 80px;
          opacity: 0.12;
        }
        .how-exp-visual-collab svg {
          position: absolute;
          top: 0; right: 0;
          width: 100%; height: 100%;
          opacity: 0.08;
        }
        .how-exp-visual-revshare svg {
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 100%;
          opacity: 0.06;
        }

        /* ═══ Icons ═══ */
        .how-exp-icon {
          width: 72px; height: 72px;
          border-radius: 20px;
          position: relative;
          margin-bottom: 20px;
          flex-shrink: 0;
        }
        .how-exp-card-revshare .how-exp-icon { width: 80px; height: 80px; margin-bottom: 0; }

        .how-exp-icon-outer {
          position: absolute; inset: 0; border-radius: 20px;
        }
        .how-exp-icon-inner {
          position: absolute; inset: 5px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
        }
        .how-exp-icon-inner svg { width: 30px; height: 30px; }
        .how-exp-card-revshare .how-exp-icon-inner svg { width: 36px; height: 36px; }

        .how-exp-icon-blue .how-exp-icon-outer {
          background: linear-gradient(135deg, rgba(0,191,255,0.2), rgba(0,120,200,0.08));
          box-shadow: 0 0 30px rgba(0,191,255,0.15), inset 0 0 15px rgba(0,191,255,0.08);
          animation: howExpPulseCyan 4s ease-in-out infinite;
        }
        .how-exp-icon-blue .how-exp-icon-inner {
          background: linear-gradient(180deg, rgba(10,20,35,0.95), rgba(5,10,25,0.99));
          border: 1px solid rgba(0,191,255,0.25);
        }
        .how-exp-icon-blue .how-exp-icon-inner svg { color: #00bfff; filter: drop-shadow(0 0 8px rgba(0,191,255,0.5)); }

        .how-exp-icon-green .how-exp-icon-outer {
          background: linear-gradient(135deg, rgba(76,217,100,0.18), rgba(40,160,60,0.08));
          box-shadow: 0 0 30px rgba(76,217,100,0.12), inset 0 0 15px rgba(76,217,100,0.06);
          animation: howExpPulseGreen 4s ease-in-out infinite 1s;
        }
        .how-exp-icon-green .how-exp-icon-inner {
          background: linear-gradient(180deg, rgba(12,22,14,0.95), rgba(8,15,10,0.99));
          border: 1px solid rgba(76,217,100,0.25);
        }
        .how-exp-icon-green .how-exp-icon-inner svg { color: #4cd964; filter: drop-shadow(0 0 8px rgba(76,217,100,0.5)); }

        .how-exp-icon-purple .how-exp-icon-outer {
          background: linear-gradient(135deg, rgba(153,51,255,0.18), rgba(102,34,170,0.08));
          box-shadow: 0 0 30px rgba(153,51,255,0.12), inset 0 0 15px rgba(153,51,255,0.06);
          animation: howExpPulsePurple 4s ease-in-out infinite 2s;
        }
        .how-exp-icon-purple .how-exp-icon-inner {
          background: linear-gradient(180deg, rgba(18,14,28,0.95), rgba(10,8,20,0.99));
          border: 1px solid rgba(153,51,255,0.25);
        }
        .how-exp-icon-purple .how-exp-icon-inner svg { color: #9933ff; filter: drop-shadow(0 0 8px rgba(153,51,255,0.5)); }

        .how-exp-icon-gold .how-exp-icon-outer {
          background: linear-gradient(135deg, rgba(255,215,0,0.18), rgba(200,170,0,0.08));
          box-shadow: 0 0 30px rgba(255,215,0,0.12), inset 0 0 15px rgba(255,215,0,0.06);
          animation: howExpPulseGold 4s ease-in-out infinite 0.5s;
        }
        .how-exp-icon-gold .how-exp-icon-inner {
          background: linear-gradient(180deg, rgba(22,18,8,0.95), rgba(14,12,5,0.99));
          border: 1px solid rgba(255,215,0,0.25);
        }
        .how-exp-icon-gold .how-exp-icon-inner svg { color: #ffd700; filter: drop-shadow(0 0 8px rgba(255,215,0,0.5)); }

        @keyframes howExpPulseCyan {
          0%, 100% { box-shadow: 0 0 30px rgba(0,191,255,0.15), inset 0 0 15px rgba(0,191,255,0.08); }
          50% { box-shadow: 0 0 45px rgba(0,191,255,0.22), inset 0 0 25px rgba(0,191,255,0.12); }
        }
        @keyframes howExpPulseGreen {
          0%, 100% { box-shadow: 0 0 30px rgba(76,217,100,0.12), inset 0 0 15px rgba(76,217,100,0.06); }
          50% { box-shadow: 0 0 40px rgba(76,217,100,0.2), inset 0 0 22px rgba(76,217,100,0.1); }
        }
        @keyframes howExpPulsePurple {
          0%, 100% { box-shadow: 0 0 30px rgba(153,51,255,0.12), inset 0 0 15px rgba(153,51,255,0.06); }
          50% { box-shadow: 0 0 40px rgba(153,51,255,0.2), inset 0 0 22px rgba(153,51,255,0.1); }
        }
        @keyframes howExpPulseGold {
          0%, 100% { box-shadow: 0 0 30px rgba(255,215,0,0.12), inset 0 0 15px rgba(255,215,0,0.06); }
          50% { box-shadow: 0 0 40px rgba(255,215,0,0.2), inset 0 0 22px rgba(255,215,0,0.1); }
        }

        /* ═══ Number badge ═══ */
        .how-exp-num {
          position: absolute;
          top: 14px; right: 16px;
          font-size: 52px;
          font-weight: 900;
          line-height: 1;
          pointer-events: none;
          z-index: 1;
        }
        .how-exp-num-income { color: rgba(0,191,255,0.05); }
        .how-exp-num-stock { color: rgba(76,217,100,0.05); }
        .how-exp-num-collab { color: rgba(153,51,255,0.05); }
        .how-exp-num-revshare { font-size: 72px; color: rgba(255,215,0,0.04); }

        /* ═══ Text ═══ */
        .how-exp-keyword {
          font-family: var(--font-amulya), sans-serif;
          font-size: clamp(17px, 1.5vw, 21px);
          font-weight: 700;
          color: #e5e4dd;
          margin-bottom: 6px;
          position: relative;
          z-index: 1;
        }
        .how-exp-keyword-income { font-size: clamp(22px, 2vw, 28px); margin-bottom: 10px; }
        .how-exp-keyword-revshare { font-size: clamp(20px, 2vw, 26px); }

        .how-exp-desc {
          font-family: var(--font-synonym), sans-serif;
          font-size: clamp(13px, 1.1vw, 15px);
          color: #bfbdb0;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }
        .how-exp-card-income .how-exp-desc { font-size: 15px; }

        /* ═══ Stat callout ═══ */
        .how-exp-stat {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid rgba(0,191,255,0.1);
          width: 100%;
          position: relative;
          z-index: 1;
        }
        .how-exp-stat-number {
          font-size: 52px;
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(135deg, #00bfff, #0099cc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 15px rgba(0,191,255,0.3));
        }
        .how-exp-stat-label {
          font-family: var(--font-synonym), sans-serif;
          font-size: 13px;
          color: rgba(191,189,176,0.45);
          margin-top: 4px;
          letter-spacing: 0.03em;
        }

        /* ═══ Chips ═══ */
        .how-exp-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 16px;
          padding: 6px 14px;
          border-radius: 20px;
          font-family: var(--font-synonym), sans-serif;
          font-size: 12px;
          font-weight: 600;
          position: relative;
          z-index: 1;
        }
        .how-exp-chip-green { background: rgba(76,217,100,0.08); border: 1px solid rgba(76,217,100,0.15); color: rgba(76,217,100,0.8); }
        .how-exp-chip-purple { background: rgba(153,51,255,0.08); border: 1px solid rgba(153,51,255,0.15); color: rgba(153,51,255,0.8); }

        /* ═══ Revshare bars ═══ */
        .how-exp-bars {
          display: flex;
          gap: 4px;
          align-items: flex-end;
          margin-top: 12px;
          height: 40px;
          position: relative;
          z-index: 1;
        }
        .how-exp-bar {
          width: 6px;
          border-radius: 3px;
          background: linear-gradient(180deg, #ffd700, rgba(255,215,0,0.3));
          transform: scaleY(0);
          transform-origin: bottom;
          opacity: 0;
        }
        .how-exp-bar:nth-child(1) { height: 40%; }
        .how-exp-bar:nth-child(2) { height: 55%; }
        .how-exp-bar:nth-child(3) { height: 70%; }
        .how-exp-bar:nth-child(4) { height: 85%; }
        .how-exp-bar:nth-child(5) { height: 100%; }
        .how-exp-bar:nth-child(6) { height: 90%; }
        .how-exp-bar:nth-child(7) { height: 75%; }

        .in-view .how-exp-bar {
          animation: howExpBarEnter 0.6s ease-out forwards, howExpBarPulse 2s ease-in-out 0.6s infinite;
        }
        .in-view .how-exp-bar:nth-child(1) { animation-delay: 0s, 0.6s; }
        .in-view .how-exp-bar:nth-child(2) { animation-delay: 0.08s, 0.68s; }
        .in-view .how-exp-bar:nth-child(3) { animation-delay: 0.16s, 0.76s; }
        .in-view .how-exp-bar:nth-child(4) { animation-delay: 0.24s, 0.84s; }
        .in-view .how-exp-bar:nth-child(5) { animation-delay: 0.32s, 0.92s; }
        .in-view .how-exp-bar:nth-child(6) { animation-delay: 0.40s, 1.0s; }
        .in-view .how-exp-bar:nth-child(7) { animation-delay: 0.48s, 1.08s; }

        @keyframes howExpBarEnter {
          from { transform: scaleY(0); opacity: 0; }
          to { transform: scaleY(1); opacity: 1; }
        }
        @keyframes howExpBarPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        /* ═══ Stock line ═══ */
        .how-exp-stock-line {
          stroke-dasharray: 500;
          stroke-dashoffset: 500;
        }
        .in-view .how-exp-stock-line {
          animation: howExpStockDraw 3s ease-out forwards;
        }
        @keyframes howExpStockDraw {
          from { stroke-dashoffset: 500; }
          to { stroke-dashoffset: 0; }
        }

        /* ═══ Network pulse ═══ */
        @keyframes howExpNodePulse {
          0%, 100% { r: 3; opacity: 0.4; }
          50% { r: 5; opacity: 0.8; }
        }
        .how-exp-node { animation: howExpNodePulse 3s ease-in-out infinite; }
        .how-exp-node:nth-child(2) { animation-delay: 0.5s; }
        .how-exp-node:nth-child(3) { animation-delay: 1s; }
        .how-exp-node:nth-child(4) { animation-delay: 1.5s; }
        .how-exp-node:nth-child(5) { animation-delay: 2s; }

        /* ═══ Mobile ═══ */
        @media (max-width: 768px) {
          .how-exp-section { padding: 0 16px; }
          .how-exp-heading { margin-bottom: 18px; }

          .how-exp-comparison {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            min-height: auto;
            margin-bottom: 40px;
            border-radius: 20px;
          }
          .how-exp-comparison::before { border-radius: 20px; }
          .how-exp-comparison-side { padding: 36px 28px; }
          .how-exp-comparison-divider {
            width: 100%; height: 1px;
          }
          .how-exp-comparison-divider::before {
            top: 50%; bottom: auto; left: 0; right: 0;
            width: 100%; height: 1px; transform: none;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          }
          .how-exp-vs-badge {
            position: relative;
            top: auto;
            left: auto;
            transform: none;
            margin: -28px auto -28px auto;
            z-index: 5;
          }

          .how-exp-transition { padding: 0 16px; margin-bottom: 32px; }
          .how-exp-transition-text { font-size: 15px; }

          .how-exp-bento {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            gap: 14px;
          }
          .how-exp-card-income { grid-row: span 1; padding: 28px 24px; }
          .how-exp-card-revshare {
            grid-column: span 1;
            flex-direction: column;
            text-align: center;
            align-items: center;
            gap: 16px;
            padding: 28px 24px;
          }
          .how-exp-card-revshare .how-exp-icon { margin-bottom: 0; }
          .how-exp-card-stock, .how-exp-card-collab { padding: 28px 24px; }

          .how-exp-stat-number { font-size: 40px; }
          .how-exp-num { font-size: 40px; }
          .how-exp-num-revshare { font-size: 52px; }
          .how-exp-icon { width: 64px; height: 64px; }
          .how-exp-card-revshare .how-exp-icon { width: 72px; height: 72px; }
          .how-exp-keyword-income { font-size: 22px; }
          .how-exp-keyword { font-size: 18px; }
          .how-exp-keyword-revshare { font-size: 20px; }
          .how-exp-desc, .how-exp-card-income .how-exp-desc { font-size: 14px; }
          .how-exp-bars { justify-content: center; }
        }

        @media (max-width: 400px) {
          .how-exp-section { padding: 0 12px; }
          .how-exp-comparison-side { padding: 28px 20px; }
        }
      `}</style>
    </section>
    </GlassPanel>
  );
}
