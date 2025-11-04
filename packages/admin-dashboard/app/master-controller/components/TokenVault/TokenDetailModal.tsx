'use client';

import React, { useState, useEffect } from 'react';
import { useTokenVaultStore } from '../../stores/tokenVaultStore';
import type { Token } from '../../stores/tokenVaultStore';

interface TokenDetailModalProps {
  token: Token;
  onClose: () => void;
  onDeleted?: () => void;
}

export const TokenDetailModal: React.FC<TokenDetailModalProps> = ({ token, onClose, onDeleted }) => {
  const { decryptTokenValue, updateToken, deleteToken } = useTokenVaultStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [revealedValue, setRevealedValue] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    serviceName: token.serviceName,
    tokenType: token.tokenType,
    regenerationUrl: token.regenerationUrl || '',
    regenerationInstructions: token.regenerationInstructions || '',
    expirationDate: token.expirationDate || '',
    usageNotes: token.usageNotes || '',
    priority: token.priority,
    status: token.status,
    tags: token.tags.join(', ')
  });

  // Handle reveal token
  const handleReveal = async () => {
    if (!masterPassword) {
      setError('Master password is required');
      return;
    }

    try {
      setError('');
      const value = await decryptTokenValue(token.id, masterPassword);
      if (value) {
        setRevealedValue(value);
        setIsRevealing(false);
        setMasterPassword('');
      } else {
        setError('Incorrect master password');
      }
    } catch (err) {
      setError('Failed to decrypt token');
      console.error(err);
    }
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (revealedValue) {
      await navigator.clipboard.writeText(revealedValue);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Handle hide token
  const handleHide = () => {
    setRevealedValue(null);
  };

  // Handle save edits
  const handleSave = async () => {
    try {
      setError('');
      await updateToken(token.id, {
        serviceName: editForm.serviceName,
        tokenType: editForm.tokenType,
        regenerationUrl: editForm.regenerationUrl || undefined,
        regenerationInstructions: editForm.regenerationInstructions || undefined,
        expirationDate: editForm.expirationDate || undefined,
        usageNotes: editForm.usageNotes || undefined,
        priority: editForm.priority,
        status: editForm.status,
        tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update token');
      console.error(err);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the ${token.serviceName} token? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteToken(token.id);
      onDeleted?.();
      onClose();
    } catch (err) {
      setError('Failed to delete token');
      console.error(err);
    }
  };

  // Get status badge color
  const getStatusColor = (status: Token['status']) => {
    switch (status) {
      case 'active': return 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]';
      case 'expired': return 'bg-[#ff4444]/10 border-[#ff4444]/30 text-[#ff4444]';
      case 'revoked': return 'bg-[#dcdbd5]/10 border-[#dcdbd5]/30 text-[#dcdbd5]';
      case 'testing': return 'bg-[#ffd700]/10 border-[#ffd700]/30 text-[#ffd700]';
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: Token['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-[#ff4444]/10 border-[#ff4444]/30 text-[#ff4444]';
      case 'high': return 'bg-[#ffd700]/10 border-[#ffd700]/30 text-[#ffd700]';
      case 'medium': return 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]';
      case 'low': return 'bg-[#dcdbd5]/10 border-[#dcdbd5]/30 text-[#dcdbd5]';
    }
  };

  // Check if expiring soon
  const isExpiringSoon = token.expirationDate &&
    Math.floor((new Date(token.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 30;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#191818] border border-[#404040] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#191818] border-b border-[#404040] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#e5e4dd]">
              {isEditing ? 'Edit Token' : token.serviceName}
            </h2>
            <p className="text-sm text-[#dcdbd5] mt-1">{token.tokenType}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#dcdbd5] hover:text-[#e5e4dd] text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-md bg-[#ff4444]/10 border border-[#ff4444]/30">
            <p className="text-[#ff4444] text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Priority Badges */}
          <div className="flex gap-3">
            <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getStatusColor(isEditing ? editForm.status : token.status)}`}>
              {(isEditing ? editForm.status : token.status).toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getPriorityColor(isEditing ? editForm.priority : token.priority)}`}>
              {(isEditing ? editForm.priority : token.priority).toUpperCase()} PRIORITY
            </span>
          </div>

          {!isEditing ? (
            <>
              {/* View Mode */}

              {/* Token Value */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Token Value</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-md
                               text-[#e5e4dd] font-mono text-sm">
                    {revealedValue || '••••••••••••••••••••••••••••••••'}
                  </div>
                  {!revealedValue ? (
                    <button
                      onClick={() => setIsRevealing(true)}
                      className="px-4 py-2 rounded-md bg-[#00ff88] text-[#191818] font-medium
                               hover:bg-[#00ff88]/90 transition-all whitespace-nowrap"
                    >
                      👁️ Reveal
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCopy}
                        className="px-4 py-2 rounded-md bg-[#00ff88] text-[#191818] font-medium
                                 hover:bg-[#00ff88]/90 transition-all whitespace-nowrap"
                      >
                        {copySuccess ? '✓ Copied' : '📋 Copy'}
                      </button>
                      <button
                        onClick={handleHide}
                        className="px-4 py-2 rounded-md bg-[#404040] text-[#dcdbd5]
                                 hover:bg-[#404040]/80 transition-all whitespace-nowrap"
                      >
                        🙈 Hide
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Expiration Warning */}
              {isExpiringSoon && (
                <div className="p-3 rounded-md bg-[#ffd700]/10 border border-[#ffd700]/30">
                  <p className="text-[#ffd700] text-sm font-medium">
                    ⚠️ This token expires on {new Date(token.expirationDate!).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Regeneration URL */}
              {token.regenerationUrl && (
                <div>
                  <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Regeneration URL</label>
                  <a
                    href={token.regenerationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00ff88] hover:underline text-sm"
                  >
                    {token.regenerationUrl}
                  </a>
                </div>
              )}

              {/* Regeneration Instructions */}
              {token.regenerationInstructions && (
                <div>
                  <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Regeneration Instructions</label>
                  <div className="p-4 bg-[#404040]/30 border border-[#404040] rounded-md text-[#dcdbd5] text-sm whitespace-pre-wrap">
                    {token.regenerationInstructions}
                  </div>
                </div>
              )}

              {/* Usage Notes */}
              {token.usageNotes && (
                <div>
                  <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Usage Notes</label>
                  <div className="p-4 bg-[#404040]/30 border border-[#404040] rounded-md text-[#dcdbd5] text-sm whitespace-pre-wrap">
                    {token.usageNotes}
                  </div>
                </div>
              )}

              {/* Tags */}
              {token.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Tags</label>
                  <div className="flex gap-2 flex-wrap">
                    {token.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-[#404040]/50 text-[#dcdbd5] text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#404040]">
                <div>
                  <label className="block text-xs font-medium text-[#dcdbd5]/60 mb-1">Created</label>
                  <p className="text-[#dcdbd5] text-sm">{new Date(token.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#dcdbd5]/60 mb-1">Last Updated</label>
                  <p className="text-[#dcdbd5] text-sm">{new Date(token.lastUpdated).toLocaleString()}</p>
                </div>
                {token.lastAccessed && (
                  <div>
                    <label className="block text-xs font-medium text-[#dcdbd5]/60 mb-1">Last Accessed</label>
                    <p className="text-[#dcdbd5] text-sm">{new Date(token.lastAccessed).toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-[#dcdbd5]/60 mb-1">Access Count</label>
                  <p className="text-[#dcdbd5] text-sm">{token.accessCount || 0} times</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Edit Mode */}

              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Service Name</label>
                <input
                  type="text"
                  value={editForm.serviceName}
                  onChange={(e) => setEditForm({ ...editForm, serviceName: e.target.value })}
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] focus:outline-none focus:border-[#00ff88]"
                />
              </div>

              {/* Token Type */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Token Type</label>
                <input
                  type="text"
                  value={editForm.tokenType}
                  onChange={(e) => setEditForm({ ...editForm, tokenType: e.target.value })}
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] focus:outline-none focus:border-[#00ff88]"
                />
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Token['status'] })}
                    className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                             text-[#e5e4dd] focus:outline-none focus:border-[#00ff88]"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="revoked">Revoked</option>
                    <option value="testing">Testing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as Token['priority'] })}
                    className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                             text-[#e5e4dd] focus:outline-none focus:border-[#00ff88]"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Regeneration URL */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Regeneration URL</label>
                <input
                  type="url"
                  value={editForm.regenerationUrl}
                  onChange={(e) => setEditForm({ ...editForm, regenerationUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] focus:outline-none focus:border-[#00ff88]"
                />
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Expiration Date</label>
                <input
                  type="date"
                  value={editForm.expirationDate}
                  onChange={(e) => setEditForm({ ...editForm, expirationDate: e.target.value })}
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] focus:outline-none focus:border-[#00ff88]"
                />
              </div>

              {/* Regeneration Instructions */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Regeneration Instructions</label>
                <textarea
                  value={editForm.regenerationInstructions}
                  onChange={(e) => setEditForm({ ...editForm, regenerationInstructions: e.target.value })}
                  rows={4}
                  placeholder="Step-by-step instructions..."
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] focus:outline-none focus:border-[#00ff88] resize-none"
                />
              </div>

              {/* Usage Notes */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Usage Notes</label>
                <textarea
                  value={editForm.usageNotes}
                  onChange={(e) => setEditForm({ ...editForm, usageNotes: e.target.value })}
                  rows={3}
                  placeholder="Where this token is used..."
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] focus:outline-none focus:border-[#00ff88] resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  placeholder="production, api, cloudflare"
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] focus:outline-none focus:border-[#00ff88]"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-[#191818] border-t border-[#404040] p-6 flex justify-between">
          <div>
            {!isEditing && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-[#ff4444] text-[#191818] font-medium
                         hover:bg-[#ff4444]/90 transition-all"
              >
                🗑️ Delete Token
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md bg-[#404040] text-[#dcdbd5]
                           hover:bg-[#404040]/80 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-md bg-[#00ff88] text-[#191818] font-medium
                           hover:bg-[#00ff88]/90 transition-all"
                >
                  ✏️ Edit Token
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-md bg-[#404040] text-[#dcdbd5]
                           hover:bg-[#404040]/80 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-md bg-[#00ff88] text-[#191818] font-medium
                           hover:bg-[#00ff88]/90 transition-all"
                >
                  💾 Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Master Password Prompt Overlay */}
      {isRevealing && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]">
          <div className="bg-[#191818] border border-[#404040] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-[#e5e4dd] mb-4">Enter Master Password</h3>
            <p className="text-sm text-[#dcdbd5] mb-4">Your master password is required to decrypt this token.</p>

            {error && (
              <div className="mb-4 p-3 rounded-md bg-[#ff4444]/10 border border-[#ff4444]/30">
                <p className="text-[#ff4444] text-sm">{error}</p>
              </div>
            )}

            <input
              type="password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleReveal()}
              placeholder="Enter master password"
              className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                       text-[#e5e4dd] focus:outline-none focus:border-[#00ff88] mb-4"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsRevealing(false);
                  setMasterPassword('');
                  setError('');
                }}
                className="flex-1 px-4 py-2 rounded-md bg-[#404040] text-[#dcdbd5]
                         hover:bg-[#404040]/80 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReveal}
                className="flex-1 px-4 py-2 rounded-md bg-[#00ff88] text-[#191818] font-medium
                         hover:bg-[#00ff88]/90 transition-all"
              >
                🔓 Reveal Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
