'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { H2 } from '@saa/shared/components/saa';

const BRAND_YELLOW = '#ffd700';

function GrayscaleDataStream() {
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const scrollSpeedRef = useRef(1);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const BASE_SPEED = 0.0004;
    let lastTimestamp = 0;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollDelta = Math.abs(currentY - lastScrollY.current);
      lastScrollY.current = currentY;
      scrollSpeedRef.current = 1 + Math.min(scrollDelta * 0.05, 3);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;
      timeRef.current += BASE_SPEED * deltaTime * scrollSpeedRef.current;
      setTime(timeRef.current);
      scrollSpeedRef.current = Math.max(1, scrollSpeedRef.current * 0.95);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const columnConfigs = useMemo(() => [...Array(20)].map((_, i) => ({
    x: i * 5,
    speed: 0.8 + (i % 4) * 0.4,
    offset: (i * 17) % 100,
  })), []);

  const getChar = (colIndex: number, charIndex: number) => {
    const flipRate = 0.6 + (colIndex % 3) * 0.3;
    const charSeed = Math.floor(time * 15 * flipRate + colIndex * 7 + charIndex * 13);
    return String.fromCharCode(0x30A0 + (charSeed % 96));
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute top-0 left-0 right-0 h-20 z-10" style={{ background: 'linear-gradient(to bottom, #1c1c1c 0%, transparent 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-20 z-10" style={{ background: 'linear-gradient(to top, #1c1c1c 0%, transparent 100%)' }} />
      {columnConfigs.map((col, i) => {
        const columnOffset = (time * col.speed * 80 + col.offset) % 110;
        const numChars = 22;
        return (
          <div key={i} className="absolute" style={{ left: col.x + '%', top: 0, width: '4%', height: '100%', overflow: 'hidden', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.4' }}>
            {[...Array(numChars)].map((_, j) => {
              const baseY = j * 5;
              const charY = (baseY + columnOffset) % 110 - 10;
              const headPosition = (columnOffset / 5) % numChars;
              const distanceFromHead = (j - headPosition + numChars) % numChars;
              const isHead = distanceFromHead === 0;
              const trailBrightness = isHead ? 1 : Math.max(0, 1 - distanceFromHead * 0.08);
              const edgeFade = charY < 12 ? Math.max(0, charY / 12) : charY > 88 ? Math.max(0, (100 - charY) / 12) : 1;
              const headColor = 'rgba(220,220,220,' + (0.9 * edgeFade) + ')';
              const trailColor = 'rgba(160,160,160,' + (trailBrightness * 0.6 * edgeFade) + ')';
              return (
                <div key={j} style={{ position: 'absolute', top: charY + '%', color: isHead ? headColor : trailColor, textShadow: isHead ? '0 0 12px rgba(200,200,200,' + (0.7 * edgeFade) + ')' : '0 0 4px rgba(150,150,150,' + (0.2 * edgeFade) + ')', opacity: edgeFade }}>
                  {getChar(i, j)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

const FUTURE_HEADLINE = "Built for Where Real Estate Is Going";
const FUTURE_SUBLINE = "The future of real estate is cloud-based, global, and technology-driven. SAA is already there.";

const FUTURE_POINTS = [
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-cloud/public', text: "Cloud-first brokerage model", imgClass: "w-full h-full object-contain", imgStyle: {}, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-ai-bot/public', text: "AI-powered tools and training", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(1.25) translate(10px, 18px)' }, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-mobile-first/public', text: "Mobile-first workflows", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(0.95) translate(3px, 10px)' }, bgColor: 'rgba(17,17,17,0.5)' },
  { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-income-benjamins/public', text: "Sustainable income paths beyond transactions", imgClass: "w-full h-full object-cover", imgStyle: { transform: 'scale(1.15) translateX(5px)' }, bgColor: '#111' },
];

export function BuiltForFuture() {
  const { ref, isVisible } = useScrollReveal();
  const getIconDelay = (index: number) => 0.5 + (index * 0.25);
  const getTextDelay = (index: number) => 0.5 + (index * 0.25) + 0.15;

  return (
    <section ref={ref} className="py-16 md:py-24 px-6 overflow-hidden relative">
      {/* Section separator gradients */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-20" style={{ background: 'linear-gradient(to bottom, #1c1c1c 0%, transparent 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-20" style={{ background: 'linear-gradient(to top, #1c1c1c 0%, transparent 100%)' }} />
      <GrayscaleDataStream />
      <style>{`
        @keyframes drawLine { from { width: 0; } to { width: 100%; } }
        .future-line { animation: drawLine 1s ease-out forwards; animation-delay: 0.5s; }
      `}</style>
      <div className="mx-auto text-center relative z-10" style={{ maxWidth: '1300px' }}>
        <div className="transition-all duration-700 mb-5" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
          <H2>{FUTURE_HEADLINE}</H2>
        </div>
        <p className="text-body opacity-70 mb-12 transition-all duration-700" style={{ opacity: isVisible ? 0.7 : 0, transitionDelay: '0.15s' }}>
          {FUTURE_SUBLINE}
        </p>
        <div className="relative mb-12">
          <div className="absolute top-[60px] left-0 right-0 h-px bg-white/10 hidden md:block">
            {isVisible && <div className="future-line h-full w-0" style={{ background: 'linear-gradient(90deg, transparent, ' + BRAND_YELLOW + ', transparent)' }} />}
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4">
            {FUTURE_POINTS.map((point, i) => (
              <div key={i} className="flex-1 relative z-10 flex flex-col items-center">
                <div className="w-[120px] h-[120px] rounded-full mb-4 flex items-center justify-center transition-all duration-500 overflow-hidden" style={{ backgroundColor: point.bgColor, border: '3px solid ' + BRAND_YELLOW, boxShadow: isVisible ? '0 0 30px rgba(255,215,0,0.4)' : 'none', opacity: isVisible ? 1 : 0, transform: isVisible ? 'scale(1)' : 'scale(0.5)', transitionDelay: getIconDelay(i) + 's' }}>
                  <img src={point.image} alt={point.text} className={point.imgClass} style={point.imgStyle} />
                </div>
                <p className="text-body text-sm transition-all duration-500" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(-10px)', transitionDelay: getTextDelay(i) + 's' }}>
                  {point.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
