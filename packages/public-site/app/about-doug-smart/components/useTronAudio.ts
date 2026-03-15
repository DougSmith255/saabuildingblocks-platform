'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

export interface AudioBands {
  bass: number;
  mids: number;
  highs: number;
  overall: number;
  raw: Uint8Array;
}

const EMPTY: AudioBands = {
  bass: 0, mids: 0, highs: 0, overall: 0, raw: new Uint8Array(64),
};

/**
 * Hook: audio playback + Web Audio API frequency analysis.
 * Sets CSS custom properties on the container for audio-reactive CSS.
 * Canvas components read bandsRef.current directly in their RAF loops.
 */
export function useTronAudio(url: string, startAt = 0) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bandsRef = useRef<AudioBands>({ ...EMPTY });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const rafRef = useRef(0);
  /** Timestamp (ms) when audio was last started - used for init animation */
  const initTimeRef = useRef(0);

  const toggle = useCallback(async () => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.src = url;
      audio.currentTime = startAt;
      audioRef.current = audio;

      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.75;
        // Reduce volume to 40% - prevents being too loud on mobile
        const gain = ctx.createGain();
        gain.gain.value = 0.4;
        source.connect(analyser);
        analyser.connect(gain);
        gain.connect(ctx.destination);
        ctxRef.current = ctx;
        analyserRef.current = analyser;
      } catch {
        // Web Audio not available - music plays without visualization
      }

      audio.addEventListener('ended', () => setIsPlaying(false));
    }

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (ctxRef.current?.state === 'suspended') await ctxRef.current.resume();
      await audio.play();
      initTimeRef.current = Date.now();
      setIsPlaying(true);
    }
  }, [url, startAt, isPlaying]);

  // Analysis loop: updates ref + CSS vars at 60fps
  useEffect(() => {
    const el = containerRef.current;
    if (!isPlaying || !analyserRef.current) {
      if (el) {
        el.style.setProperty('--ab', '0');
        el.style.setProperty('--am', '0');
        el.style.setProperty('--ah', '0');
        el.style.setProperty('--ao', '0');
      }
      return;
    }

    const analyser = analyserRef.current;
    const len = analyser.frequencyBinCount;
    const data = new Uint8Array(len);

    const update = () => {
      analyser.getByteFrequencyData(data);

      const bassEnd = Math.floor(len * 0.12);
      const midsEnd = Math.floor(len * 0.45);
      let b = 0, m = 0, h = 0;
      for (let i = 0; i < len; i++) {
        if (i < bassEnd) b += data[i];
        else if (i < midsEnd) m += data[i];
        else h += data[i];
      }

      const bass = bassEnd > 0 ? b / (bassEnd * 255) : 0;
      const mids = (midsEnd - bassEnd) > 0 ? m / ((midsEnd - bassEnd) * 255) : 0;
      const highs = (len - midsEnd) > 0 ? h / ((len - midsEnd) * 255) : 0;
      const overall = bass * 0.5 + mids * 0.3 + highs * 0.2;

      bandsRef.current = { bass, mids, highs, overall, raw: new Uint8Array(data) };

      if (el) {
        el.style.setProperty('--ab', bass.toFixed(3));
        el.style.setProperty('--am', mids.toFixed(3));
        el.style.setProperty('--ah', highs.toFixed(3));
        el.style.setProperty('--ao', overall.toFixed(3));
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      ctxRef.current?.close();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { isPlaying, toggle, bandsRef, containerRef, analyserRef, initTimeRef };
}
