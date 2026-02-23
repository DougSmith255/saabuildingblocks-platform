'use client';

import { useState } from 'react';
import { Youtube, ExternalLink, Shield, Loader2 } from 'lucide-react';

export function YouTubeConnectPrompt() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Redirect to OAuth flow — the API route handles the redirect to Google
    window.location.href = '/api/youtube/auth';
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div
        className="max-w-lg w-full p-8 rounded-lg border text-center"
        style={{
          background: 'rgba(64, 64, 64, 0.3)',
          backdropFilter: 'blur(8px)',
          borderColor: 'rgba(255, 0, 0, 0.2)',
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(255, 0, 0, 0.15)' }}
        >
          <Youtube className="w-8 h-8 text-[#ff0000]" />
        </div>

        <h3 className="text-xl font-bold text-[#e5e4dd] mb-3">
          Connect Your YouTube Channel
        </h3>

        <p className="text-[#dcdbd5] mb-6 leading-relaxed">
          Link your YouTube channel to access detailed analytics, manage video metadata,
          and get insights on CTR, retention, keywords, and optimal upload times.
        </p>

        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          style={{
            background: isConnecting ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 0, 0, 0.3)',
            color: '#fff',
            border: '1px solid rgba(255, 0, 0, 0.4)',
          }}
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Youtube className="w-4 h-4" />
              Connect YouTube Channel
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </>
          )}
        </button>

        <div className="mt-6 flex items-start gap-2 text-left" style={{ color: '#888' }}>
          <Shield className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="text-xs leading-relaxed">
            We use OAuth2 to securely connect to your channel. Your credentials are encrypted
            at rest and never shared. You can disconnect at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
