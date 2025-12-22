'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Cloudflare Stream SDK typings
declare global {
  interface Window {
    Stream?: (iframe: HTMLIFrameElement) => StreamPlayer;
  }
}

interface StreamPlayer {
  play: () => void;
  pause: () => void;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
}

export interface VideoPlayerProps {
  /** Cloudflare Stream video ID */
  videoId: string;
  /** Poster image URL (optional) */
  posterUrl?: string;
  /** Storage key for progress persistence (default: 'saa_video') */
  storageKey?: string;
  /** Threshold percentage to unlock CTA (default: 50) */
  unlockThreshold?: number;
  /** Callback when threshold is reached */
  onThresholdReached?: () => void;
  /** Optional className for the container */
  className?: string;
  /** Hide the progress area (for pages that don't need it) */
  hideProgressArea?: boolean;
}

/**
 * VideoPlayer - Cloudflare Stream video player with progress tracking
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/media/VideoPlayer
 *
 * Features:
 * - Cloudflare Stream embed with SDK controls
 * - Custom control bar: Play/Pause, Rewind 15s, Restart, Volume
 * - Progress bar tracking watch percentage
 * - Progress messages that change at thresholds
 * - "Book a Call" / unlock button after watching enough
 * - localStorage persistence of progress
 * - Play/pause overlay with custom controls
 *
 * @example
 * ```tsx
 * <VideoPlayer
 *   videoId="f8c3f1bd9c2db2409ed0e90f60fd4d5b"
 *   posterUrl="https://..."
 *   storageKey="homepage_video"
 *   unlockThreshold={50}
 *   onThresholdReached={() => setShowJoinButton(true)}
 * />
 * ```
 */
export function VideoPlayer({
  videoId,
  posterUrl,
  storageKey = 'saa_video',
  unlockThreshold = 50,
  onThresholdReached,
  className = '',
  hideProgressArea = false,
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<StreamPlayer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [thresholdReached, setThresholdReached] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Track the saved position to restore on load
  const savedPositionRef = useRef<number>(0);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = parseFloat(localStorage.getItem(`${storageKey}_progress`) || '0');
    const savedMaxTime = parseFloat(localStorage.getItem(`${storageKey}_maxTime`) || '0');
    const savedPosition = parseFloat(localStorage.getItem(`${storageKey}_position`) || '0');
    setProgress(savedProgress);
    setMaxWatchedTime(savedMaxTime);
    savedPositionRef.current = savedPosition;
    if (savedProgress >= unlockThreshold) {
      setThresholdReached(true);
    }
  }, [storageKey, unlockThreshold]);

  // Load Cloudflare Stream SDK
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Stream) {
      const script = document.createElement('script');
      script.src = 'https://embed.cloudflarestream.com/embed/sdk.latest.js';
      script.async = true;
      script.onload = () => {
        if (iframeRef.current && window.Stream) {
          initializePlayer();
        }
      };
      document.head.appendChild(script);
    } else if (window.Stream && iframeRef.current) {
      initializePlayer();
    }
  }, []);

  const initializePlayer = useCallback(() => {
    if (!iframeRef.current || !window.Stream) return;

    const player = window.Stream(iframeRef.current);
    playerRef.current = player;
    setIsLoaded(true);

    player.addEventListener('play', () => setIsPlaying(true));
    player.addEventListener('pause', () => setIsPlaying(false));
    player.addEventListener('ended', () => setIsPlaying(false));

    player.addEventListener('loadedmetadata', () => {
      setDuration(player.duration || 0);
      // Restore saved position when video loads
      if (savedPositionRef.current > 0 && player.duration > 0) {
        // Make sure we don't seek past the end
        const targetTime = Math.min(savedPositionRef.current, player.duration - 1);
        if (targetTime > 0) {
          player.currentTime = targetTime;
        }
      }
    });

    player.addEventListener('volumechange', () => {
      setVolume(player.volume);
      setIsMuted(player.muted);
    });

    player.addEventListener('timeupdate', () => {
      setCurrentTime(player.currentTime || 0);
      setDuration(player.duration || 0);

      // Save current position for resume on refresh/return
      localStorage.setItem(`${storageKey}_position`, player.currentTime.toString());

      if (player.duration > 0) {
        // Update max watched time (only increases)
        if (player.currentTime > maxWatchedTime) {
          const newMaxTime = player.currentTime;
          setMaxWatchedTime(newMaxTime);
          localStorage.setItem(`${storageKey}_maxTime`, newMaxTime.toString());

          // Update progress percentage
          const pct = (newMaxTime / player.duration) * 100;
          if (pct > progress) {
            setProgress(pct);
            localStorage.setItem(`${storageKey}_progress`, pct.toString());

            // Check threshold
            if (pct >= unlockThreshold && !thresholdReached) {
              setThresholdReached(true);
              onThresholdReached?.();
            }
          }
        }
      }
    });
  }, [maxWatchedTime, progress, storageKey, unlockThreshold, thresholdReached, onThresholdReached]);

  const togglePlayPause = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  }, [isPlaying]);

  const handleRewind = useCallback(() => {
    if (!playerRef.current) return;
    const newTime = Math.max(0, playerRef.current.currentTime - 15);
    playerRef.current.currentTime = newTime;
  }, []);

  const handleRestart = useCallback(() => {
    if (!playerRef.current) return;
    playerRef.current.currentTime = 0;
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current) return;
    const newVolume = parseFloat(e.target.value);
    playerRef.current.volume = newVolume;
    playerRef.current.muted = newVolume === 0;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    playerRef.current.muted = !playerRef.current.muted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Format time as M:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Build iframe URL
  const posterParam = posterUrl ? `&poster=${encodeURIComponent(posterUrl)}` : '';
  const iframeSrc = `https://customer-2twfsluc6inah5at.cloudflarestream.com/${videoId}/iframe?controls=false${posterParam}&letterboxColor=transparent`;

  // Progress message based on percentage
  const getProgressMessage = () => {
    if (progress >= unlockThreshold) {
      return "You're ready! Take the next step now.";
    }
    return `Watch at least ${unlockThreshold}% to unlock the next step.`;
  };

  return (
    <div className={`video-player-container ${className}`}>
      {/* Video Container with CyberFrame-style styling */}
      <div className="video-frame">
        <div className="video-wrapper">
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            loading="lazy"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
          {/* Click overlay for play/pause */}
          <div
            className={`video-overlay ${isPlaying ? 'is-playing' : ''}`}
            onClick={togglePlayPause}
          >
            <div className={`overlay-play-btn ${isPlaying ? 'is-playing' : ''}`}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"/>
                  <rect x="14" y="4" width="4" height="16"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Video Controls Bar */}
        <div className="video-controls">
          {/* Play/Pause Button */}
          <button
            className="control-btn control-btn--play"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
          </button>

          {/* Rewind 15s Button */}
          <button
            className="control-btn"
            onClick={handleRewind}
            aria-label="Rewind 15 seconds"
            title="Rewind 15s"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            <span className="rewind-text">15</span>
          </button>

          {/* Restart Button */}
          <button
            className="control-btn"
            onClick={handleRestart}
            aria-label="Restart video"
            title="Restart"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 2v6h6"/>
              <path d="M21 12A9 9 0 0 0 6 5.3L3 8"/>
              <path d="M21 22v-6h-6"/>
              <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/>
            </svg>
          </button>

          {/* Time Display */}
          <div className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Volume Controls */}
          <div className="volume-controls">
            <button
              className="control-btn"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              ) : volume < 0.5 ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      {/* Progress Area */}
      {!hideProgressArea && (
        <div className="progress-area">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="progress-text">{getProgressMessage()}</p>
        </div>
      )}

      <style jsx>{`
        .video-player-container {
          width: 100%;
        }

        .video-frame {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          background: #1a1a1a;
          /* Metal frame styling */
          padding: 4px;
          background: linear-gradient(145deg, rgba(80,80,80,0.6) 0%, rgba(40,40,40,0.8) 50%, rgba(60,60,60,0.6) 100%);
          border: 1px solid rgba(150,150,150,0.4);
        }

        .video-wrapper {
          position: relative;
          padding-top: 56.25%; /* 16:9 aspect ratio */
          background: #1a1a1a;
          border-radius: 8px 8px 0 0;
          overflow: hidden;
        }

        .video-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          pointer-events: none; /* Click handled by overlay */
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          cursor: pointer;
          background: transparent;
          transition: background 0.2s ease;
        }

        .video-overlay:hover {
          background: rgba(0, 0, 0, 0.15);
        }

        .video-overlay:hover .overlay-play-btn {
          transform: scale(1.1);
        }

        .overlay-play-btn {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 215, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.3);
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .overlay-play-btn svg {
          width: 36px;
          height: 36px;
          fill: #1a1a1a;
          margin-left: 4px; /* Optical centering for play triangle */
        }

        .overlay-play-btn.is-playing svg {
          margin-left: 0;
        }

        /* Hide overlay button when playing (show on hover) */
        .video-overlay.is-playing .overlay-play-btn {
          opacity: 0;
        }

        .video-overlay.is-playing:hover .overlay-play-btn {
          opacity: 1;
        }

        /* Video Controls Bar */
        .video-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.95) 100%);
          border-top: 1px solid rgba(255,215,0,0.2);
          border-radius: 0 0 8px 8px;
        }

        .control-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .control-btn:hover {
          background: rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.4);
          color: #ffd700;
        }

        .control-btn:active {
          transform: scale(0.95);
        }

        .control-btn svg {
          width: 18px;
          height: 18px;
        }

        .control-btn--play {
          background: linear-gradient(135deg, #ffd700 0%, #e6c200 100%);
          border-color: #ffd700;
          color: #1a1a1a;
          width: 40px;
          height: 40px;
        }

        .control-btn--play:hover {
          background: linear-gradient(135deg, #ffe033 0%, #ffd700 100%);
          color: #1a1a1a;
        }

        .control-btn--play svg {
          width: 20px;
          height: 20px;
          fill: #1a1a1a;
          stroke: #1a1a1a;
        }

        .rewind-text {
          position: absolute;
          font-size: 8px;
          font-weight: 700;
          bottom: 4px;
          right: 4px;
        }

        .time-display {
          font-family: var(--font-synonym, monospace);
          font-size: 0.85rem;
          color: #bfbdb0;
          margin: 0 0.5rem;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .volume-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: auto;
        }

        .volume-slider {
          width: 80px;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          cursor: pointer;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: #ffd700;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.1s ease;
        }

        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #ffd700;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .progress-area {
          text-align: center;
          margin-top: 1.5rem;
        }

        .progress-bar {
          width: 100%;
          max-width: 400px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          margin: 0 auto 1rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #ffd700, #00ff88);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .progress-text {
          color: #bfbdb0;
          font-size: 0.9rem;
          margin: 0;
        }

        /* Responsive adjustments */
        @media (max-width: 600px) {
          .video-controls {
            flex-wrap: wrap;
            gap: 0.4rem;
            padding: 0.5rem;
          }

          .time-display {
            order: 10;
            width: 100%;
            text-align: center;
            margin: 0.25rem 0 0;
          }

          .volume-controls {
            margin-left: 0;
          }

          .volume-slider {
            width: 60px;
          }
        }
      `}</style>
    </div>
  );
}

export default VideoPlayer;
