'use client';

import { useEffect, useState, useRef } from 'react';

// Rotating symbols (Claude Code style)
const SYMBOLS = ['·', '✢', '✳', '✶', '✻', '✽'];

// Random loading words (Claude Code style)
const LOADING_WORDS = [
  'Accomplishing',
  'Actualizing',
  'Brewing',
  'Calculating',
  'Cerebrating',
  'Churning',
  'Cogitating',
  'Computing',
  'Concocting',
  'Considering',
  'Contemplating',
  'Crafting',
  'Creating',
  'Crunching',
  'Deciphering',
  'Deliberating',
  'Determining',
  'Effecting',
  'Elucidating',
  'Enchanting',
  'Envisioning',
  'Finagling',
  'Forging',
  'Forming',
  'Generating',
  'Germinating',
  'Hatching',
  'Ideating',
  'Imagining',
  'Incubating',
  'Inferring',
  'Materializing',
  'Musing',
  'Orchestrating',
  'Pondering',
  'Processing',
  'Reasoning',
  'Reflecting',
  'Ruminating',
  'Synthesizing',
  'Thinking',
  'Transmuting',
  'Weaving',
  'Wondering',
];

export interface ClaudeLoaderProps {
  /** Whether the loader is visible */
  visible?: boolean;
  /** Custom color for the loader (default: #ffd700 gold) */
  color?: string;
  /** Font size in pixels (default: 24) */
  fontSize?: number;
  /** Custom class name for the container */
  className?: string;
  /** Symbol rotation speed in ms (default: 150) */
  symbolSpeed?: number;
}

/**
 * ClaudeLoader - Claude Code style loading indicator
 *
 * Features a rotating symbol and a random "thinking" word.
 * Inspired by the Claude Code terminal loading animation.
 *
 * @example
 * <ClaudeLoader visible={isLoading} />
 * <ClaudeLoader visible={true} color="#00ff88" fontSize={18} />
 */
export function ClaudeLoader({
  visible = true,
  color = '#ffd700',
  fontSize = 24,
  className = '',
  symbolSpeed = 150,
}: ClaudeLoaderProps) {
  const [currentSymbol, setCurrentSymbol] = useState(SYMBOLS[0]);
  const [currentWord, setCurrentWord] = useState(LOADING_WORDS[0]);
  const symbolIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      // Pick a random word when loader becomes visible
      setCurrentWord(LOADING_WORDS[Math.floor(Math.random() * LOADING_WORDS.length)]);

      // Start symbol rotation
      let symbolIndex = 0;
      symbolIntervalRef.current = setInterval(() => {
        symbolIndex = (symbolIndex + 1) % SYMBOLS.length;
        setCurrentSymbol(SYMBOLS[symbolIndex]);
      }, symbolSpeed);
    } else {
      if (symbolIntervalRef.current) {
        clearInterval(symbolIntervalRef.current);
        symbolIntervalRef.current = null;
      }
    }

    return () => {
      if (symbolIntervalRef.current) {
        clearInterval(symbolIntervalRef.current);
      }
    };
  }, [visible, symbolSpeed]);

  if (!visible) return null;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: '"Courier New", Courier, monospace',
      }}
    >
      <span
        style={{
          color,
          fontSize: `${fontSize}px`,
          lineHeight: '1.5em',
          height: '1.5em',
          textAlign: 'center',
          textShadow: `0 0 10px ${color}80`,
        }}
      >
        {currentSymbol}
      </span>
      <span
        style={{
          color,
          fontSize: `${fontSize}px`,
          lineHeight: '1.5em',
          height: '1.5em',
          textShadow: `0 0 10px ${color}80`,
        }}
      >
        {currentWord}
      </span>
    </div>
  );
}

export default ClaudeLoader;
