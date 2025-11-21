'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTokenVaultStore } from '../../stores/tokenVaultStore';
import type { Token } from '../../stores/tokenVaultStore';
import { AddTokenForm } from './AddTokenForm';

export const TokenList: React.FC = () => {
  const {
    tokens,
    isLoading,
    fetchTokens,
    getExpiringTokens
  } = useTokenVaultStore();

  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [editingToken, setEditingToken] = useState<Token | null>(null);
  const [newTokenValue, setNewTokenValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showAddTokenForm, setShowAddTokenForm] = useState(false);

  // Load tokens on mount (empty deps to prevent infinite loop)
  useEffect(() => {
    fetchTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get expiring tokens for warning banner
  const expiringTokens = useMemo(() => getExpiringTokens(30), [getExpiringTokens]);

  // Sort by priority (critical > high > medium > low) and then by service name
  const sortedTokens = useMemo(() => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return [...tokens].sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.serviceName.localeCompare(b.serviceName);
    });
  }, [tokens]);

  // Handle copy to clipboard (tokens stored in plain text)
  const handleCopyToken = async (token: Token) => {
    try {
      // Copy token value directly (no decryption needed - stored in plain text)
      await navigator.clipboard.writeText(token.encryptedValue);
      setCopySuccess(token.id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('Failed to copy token:', error);
      alert('Failed to copy token to clipboard. Please try again.');
    }
  };

  // Handle opening edit modal
  const handleEditToken = (token: Token) => {
    setEditingToken(token);
    setNewTokenValue(token.encryptedValue);
    setSaveError(null);
  };

  // Handle closing edit modal
  const handleCloseModal = () => {
    setEditingToken(null);
    setNewTokenValue('');
    setSaveError(null);
    setIsSaving(false);
  };

  // Handle saving edited token
  const handleSaveToken = async () => {
    if (!editingToken || !newTokenValue.trim()) {
      setSaveError('Token value cannot be empty');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(`/api/tokens/${editingToken.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encrypted_value: newTokenValue.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update token');
      }

      // Success - refresh tokens and close modal
      await fetchTokens();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save token:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save token. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: Token['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-[#ff4444]/10 border-[#ff4444]/30 text-[#ff4444]';
      case 'high': return 'bg-[#ffd700]/10 border-[#ffd700]/30 text-[#ffd700]';
      case 'medium': return 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]';
      case 'low': return 'bg-[#dcdbd5]/10 border-[#dcdbd5]/30 text-[#dcdbd5]';
      default: return 'bg-[#404040]/10 border-[#404040]/30 text-[#dcdbd5]';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Add Token Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddTokenForm(true)}
          className="px-6 py-3 rounded-md bg-[#00ff88] text-[#191818] font-semibold
                   hover:bg-[#00ff88]/90 transition-all flex items-center gap-2 shadow-lg"
        >
          <span className="text-xl">+</span>
          <span>Add New Token</span>
        </button>
      </div>

      {/* Expiring Tokens Warning Banner */}
      {expiringTokens.length > 0 && (
        <div className="p-4 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-[#ffd700] font-medium">
                {expiringTokens.length} token{expiringTokens.length > 1 ? 's' : ''} expiring soon
              </p>
              <p className="text-[#dcdbd5] text-sm mt-1">
                {expiringTokens.map(t => t.serviceName).join(', ')} need{expiringTokens.length === 1 ? 's' : ''} to be regenerated
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tokens Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ff88]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTokens.map((token) => (
            <div
              key={token.id}
              className="p-6 rounded-lg bg-[#191818] border border-[#404040] hover:border-[#00ff88]/30 transition-all"
            >
              {/* Service Name */}
              <div className="mb-4">
                <h3 className="text-[#e5e4dd] font-semibold text-lg mb-1">
                  {token.serviceName}
                </h3>
                <p className="text-[#dcdbd5]/60 text-sm">{token.tokenType}</p>
              </div>

              {/* Priority Badge */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-md text-xs font-medium border ${getPriorityColor(token.priority)}`}>
                  {token.priority.toUpperCase()}
                </span>
              </div>

              {/* Usage Notes (if available) */}
              {token.usageNotes && (
                <div className="mb-4 p-3 rounded-md bg-[#404040]/20 border border-[#404040]/50">
                  <p className="text-[#dcdbd5] text-sm">{token.usageNotes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {/* Copy Token Button */}
                <button
                  onClick={() => handleCopyToken(token)}
                  className="flex-1 px-4 py-2 rounded-md bg-[#00ff88] text-[#191818] font-medium
                           hover:bg-[#00ff88]/90 transition-all text-sm"
                  title="Copy Token"
                >
                  {copySuccess === token.id ? '✓ Copied' : '📋 Copy Token'}
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => handleEditToken(token)}
                  className="px-4 py-2 rounded-md bg-[#404040] text-[#e5e4dd] font-medium
                           hover:bg-[#00ff88] hover:text-[#191818] transition-all text-sm"
                  title="Edit Token"
                >
                  ✏️
                </button>

                {/* Regenerate Button (if regeneration_url exists) */}
                {token.regenerationUrl && (
                  <a
                    href={token.regenerationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-md bg-[#ffd700] text-[#191818] font-medium
                             hover:bg-[#ffd700]/90 transition-all text-sm"
                    title="Regenerate Token"
                  >
                    🔄
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Token Modal */}
      {editingToken && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[#191818] border border-[#404040] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-[#404040]">
              <h2 className="text-2xl font-semibold text-[#e5e4dd]">
                Edit Token
              </h2>
              <p className="text-[#dcdbd5]/60 text-sm mt-1">
                Update the token value for {editingToken.serviceName}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Token Details (Read-only) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#dcdbd5] mb-1">
                    Service Name
                  </label>
                  <div className="px-4 py-2 rounded-md bg-[#404040]/30 border border-[#404040]/50 text-[#e5e4dd]">
                    {editingToken.serviceName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#dcdbd5] mb-1">
                    Token Type
                  </label>
                  <div className="px-4 py-2 rounded-md bg-[#404040]/30 border border-[#404040]/50 text-[#e5e4dd]">
                    {editingToken.tokenType}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#dcdbd5] mb-1">
                    Priority
                  </label>
                  <div className="px-4 py-2 rounded-md bg-[#404040]/30 border border-[#404040]/50">
                    <span className={`px-3 py-1 rounded-md text-xs font-medium border ${getPriorityColor(editingToken.priority)}`}>
                      {editingToken.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* New Token Value Input */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  New Token Value
                </label>
                <textarea
                  value={newTokenValue}
                  onChange={(e) => setNewTokenValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-[#0a0a0a] border border-[#404040]
                           text-[#e5e4dd] font-mono text-sm resize-none
                           focus:outline-none focus:border-[#00ff88] transition-colors"
                  rows={4}
                  placeholder="Paste new token value here..."
                  disabled={isSaving}
                />
              </div>

              {/* Error Message */}
              {saveError && (
                <div className="p-4 rounded-md bg-[#ff4444]/10 border border-[#ff4444]/30">
                  <p className="text-[#ff4444] text-sm">{saveError}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#404040] flex gap-3 justify-end">
              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="px-6 py-2 rounded-md bg-[#404040] text-[#e5e4dd] font-medium
                         hover:bg-[#404040]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveToken}
                disabled={isSaving || !newTokenValue.trim()}
                className="px-6 py-2 rounded-md bg-[#00ff88] text-[#191818] font-medium
                         hover:bg-[#00ff88]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#191818]"></div>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Token Form Modal */}
      {showAddTokenForm && (
        <AddTokenForm
          onClose={() => setShowAddTokenForm(false)}
          onAdded={() => {
            fetchTokens();
            setShowAddTokenForm(false);
          }}
        />
      )}
    </div>
  );
};
