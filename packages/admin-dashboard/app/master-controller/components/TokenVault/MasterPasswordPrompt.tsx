'use client';

import React, { useState } from 'react';
import { useTokenVaultStore } from '../../stores/tokenVaultStore';

export const MasterPasswordPrompt: React.FC = () => {
  const { unlock, isLoading } = useTokenVaultStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = async () => {
    setError('');

    // Attempt unlock
    const success = await unlock(password);
    if (!success) {
      setError('Incorrect master password');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="p-6 rounded-lg bg-[#404040]/30 border border-[#404040]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="text-xl font-semibold text-[#e5e4dd] mb-2">
            Unlock Token Vault
          </h3>
          <p className="text-sm text-[#dcdbd5]">
            Enter your master password to access encrypted tokens
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-[#ff4444]/10 border border-[#ff4444]/30">
            <p className="text-[#ff4444] text-sm">{error}</p>
          </div>
        )}

        {/* Password Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
              Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                         text-[#e5e4dd] placeholder-[#dcdbd5]/40
                         focus:outline-none focus:border-[#00ff88] transition-colors"
                disabled={isLoading}
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#dcdbd5] hover:text-[#e5e4dd]"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Unlock Button */}
          <button
            onClick={handleUnlock}
            disabled={isLoading || !password}
            className="w-full px-4 py-3 rounded-md bg-[#00ff88] text-[#191818] font-semibold
                     hover:bg-[#00ff88]/90 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#191818]"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>🔓 Unlock Vault</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
