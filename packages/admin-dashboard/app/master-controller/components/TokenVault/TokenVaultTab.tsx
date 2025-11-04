'use client';

import React, { useEffect } from 'react';
import { useTokenVaultStore } from '../../stores/tokenVaultStore';
import { MasterPasswordPrompt } from './MasterPasswordPrompt';
import { TokenList } from './TokenList';

export const TokenVaultTab: React.FC = () => {
  const {
    isLocked,
    isLoading,
    error,
    initialize,
    checkAutoLock,
    clearError
  } = useTokenVaultStore();

  // Initialize on mount (empty deps to prevent infinite loop)
  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check auto-lock every minute (empty deps to prevent infinite loop)
  useEffect(() => {
    const interval = setInterval(() => {
      checkAutoLock();
    }, 60000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#404040]">
        <div>
          <h2 className="text-[clamp(1.5rem,1.5vw+0.5rem,1.875rem)] leading-[1.3] font-semibold text-[#e5e4dd]">
            🔐 Token Vault
          </h2>
          <p className="text-[clamp(0.8125rem,0.125vw+0.75rem,0.875rem)] leading-[1.75] text-[#dcdbd5] mt-1">
            Securely manage your API credentials with client-side AES-256 encryption
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 rounded-lg bg-[#ff4444]/10 border border-[#ff4444]/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#ff4444] font-medium">Error</p>
              <p className="text-[#dcdbd5] text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-[#dcdbd5] hover:text-[#e5e4dd] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Token List - Always render (handles its own loading state) */}
      {!error && <TokenList />}

      {/* Security Info Footer */}
      <div className="mt-8 p-4 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30">
        <p className="text-[clamp(0.8125rem,0.125vw+0.75rem,0.875rem)] leading-[1.75] text-[#dcdbd5]">
          <strong className="text-[#ffd700] font-medium">🔒 Security:</strong> All encryption/decryption happens client-side using AES-256-GCM.
        </p>
      </div>
    </div>
  );
};
