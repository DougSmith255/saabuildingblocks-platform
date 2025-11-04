'use client';

import React, { useState } from 'react';
import { useTokenVaultStore } from '../../stores/tokenVaultStore';
import { validateMasterPassword } from '@/lib/encryption/tokenVault';
import type { Token } from '../../stores/tokenVaultStore';

interface AddTokenFormProps {
  onClose: () => void;
  onAdded?: () => void;
}

export const AddTokenForm: React.FC<AddTokenFormProps> = ({ onClose, onAdded }) => {
  const { addToken } = useTokenVaultStore();

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Token details, Step 2: Master password
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    serviceName: '',
    tokenType: '',
    tokenValue: '',
    regenerationUrl: '',
    regenerationInstructions: '',
    expirationDate: '',
    usageNotes: '',
    priority: 'medium' as Token['priority'],
    status: 'active' as Token['status'],
    tags: ''
  });

  // Master password
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Common service names and token types
  const commonServices = [
    'Cloudflare',
    'Supabase',
    'GitHub',
    'WordPress',
    'n8n',
    'GoHighLevel',
    'Stripe',
    'SendGrid',
    'Twilio',
    'AWS',
    'Google Cloud',
    'Azure',
    'Other'
  ];

  const commonTypes = [
    'API Token',
    'API Key',
    'Service Role Key',
    'OAuth Token',
    'Personal Access Token',
    'Application Password',
    'Secret Key',
    'JWT Token',
    'Webhook URL',
    'SSH Key',
    'Other'
  ];

  // Validate step 1
  const validateStep1 = () => {
    if (!formData.serviceName.trim()) {
      setError('Service name is required');
      return false;
    }
    if (!formData.tokenType.trim()) {
      setError('Token type is required');
      return false;
    }
    if (!formData.tokenValue.trim()) {
      setError('Token value is required');
      return false;
    }
    return true;
  };

  // Handle step 1 next
  const handleStep1Next = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  // Handle final submit
  const handleSubmit = async () => {
    setError('');

    if (!masterPassword) {
      setError('Master password is required');
      return;
    }

    const validation = validateMasterPassword(masterPassword);
    if (!validation.valid) {
      setError(validation.errors[0]);
      return;
    }

    setIsSubmitting(true);

    try {
      await addToken({
        serviceName: formData.serviceName,
        tokenType: formData.tokenType,
        encryptedValue: formData.tokenValue, // Will be encrypted by addToken
        regenerationUrl: formData.regenerationUrl || undefined,
        regenerationInstructions: formData.regenerationInstructions || undefined,
        expirationDate: formData.expirationDate || undefined,
        usageNotes: formData.usageNotes || undefined,
        priority: formData.priority,
        status: formData.status,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      } as any, masterPassword);

      onAdded?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add token');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#191818] border border-[#404040] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#191818] border-b border-[#404040] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#e5e4dd]">
              {step === 1 ? 'Add New Token' : 'Encrypt & Save'}
            </h2>
            <p className="text-sm text-[#dcdbd5] mt-1">
              {step === 1 ? 'Step 1 of 2: Enter token details' : 'Step 2 of 2: Confirm with master password'}
            </p>
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

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {step === 1 ? (
            <>
              {/* Step 1: Token Details */}

              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Service Name <span className="text-[#ff4444]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                  placeholder="e.g., Cloudflare, Supabase, GitHub"
                  list="service-names"
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] placeholder-[#dcdbd5]/40
                           focus:outline-none focus:border-[#00ff88] transition-colors"
                  autoFocus
                />
                <datalist id="service-names">
                  {commonServices.map(service => (
                    <option key={service} value={service} />
                  ))}
                </datalist>
              </div>

              {/* Token Type */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Token Type <span className="text-[#ff4444]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tokenType}
                  onChange={(e) => setFormData({ ...formData, tokenType: e.target.value })}
                  placeholder="e.g., API Token, OAuth Token"
                  list="token-types"
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] placeholder-[#dcdbd5]/40
                           focus:outline-none focus:border-[#00ff88] transition-colors"
                />
                <datalist id="token-types">
                  {commonTypes.map(type => (
                    <option key={type} value={type} />
                  ))}
                </datalist>
              </div>

              {/* Token Value */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Token Value <span className="text-[#ff4444]">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={formData.tokenValue}
                    onChange={(e) => setFormData({ ...formData, tokenValue: e.target.value })}
                    placeholder="Paste your token here (will be encrypted)"
                    rows={4}
                    className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                             text-[#e5e4dd] placeholder-[#dcdbd5]/40 font-mono text-sm
                             focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
                  />
                </div>
                <p className="text-xs text-[#dcdbd5]/60 mt-1">
                  🔒 This will be encrypted with AES-256-GCM before saving
                </p>
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Token['status'] })}
                    className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                             text-[#e5e4dd] focus:outline-none focus:border-[#00ff88] transition-colors"
                  >
                    <option value="active">Active</option>
                    <option value="testing">Testing</option>
                    <option value="expired">Expired</option>
                    <option value="revoked">Revoked</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#dcdbd5] mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Token['priority'] })}
                    className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                             text-[#e5e4dd] focus:outline-none focus:border-[#00ff88] transition-colors"
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
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Regeneration URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.regenerationUrl}
                  onChange={(e) => setFormData({ ...formData, regenerationUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] placeholder-[#dcdbd5]/40
                           focus:outline-none focus:border-[#00ff88] transition-colors"
                />
                <p className="text-xs text-[#dcdbd5]/60 mt-1">
                  Link to where you can regenerate this token
                </p>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] focus:outline-none focus:border-[#00ff88] transition-colors"
                />
              </div>

              {/* Regeneration Instructions */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Regeneration Instructions (Optional)
                </label>
                <textarea
                  value={formData.regenerationInstructions}
                  onChange={(e) => setFormData({ ...formData, regenerationInstructions: e.target.value })}
                  placeholder="Step-by-step instructions for regenerating this token..."
                  rows={4}
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] placeholder-[#dcdbd5]/40
                           focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
                />
              </div>

              {/* Usage Notes */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Usage Notes (Optional)
                </label>
                <textarea
                  value={formData.usageNotes}
                  onChange={(e) => setFormData({ ...formData, usageNotes: e.target.value })}
                  placeholder="Where this token is used, which services depend on it..."
                  rows={3}
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] placeholder-[#dcdbd5]/40
                           focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="production, api, critical (comma-separated)"
                  className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                           text-[#e5e4dd] placeholder-[#dcdbd5]/40
                           focus:outline-none focus:border-[#00ff88] transition-colors"
                />
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Master Password Confirmation */}

              {/* Summary of what will be saved */}
              <div className="p-4 rounded-lg bg-[#404040]/30 border border-[#404040]">
                <h3 className="text-sm font-medium text-[#e5e4dd] mb-3">Token Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#dcdbd5]/60">Service:</span>
                    <span className="text-[#e5e4dd] font-medium">{formData.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#dcdbd5]/60">Type:</span>
                    <span className="text-[#e5e4dd]">{formData.tokenType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#dcdbd5]/60">Priority:</span>
                    <span className="text-[#e5e4dd]">{formData.priority.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#dcdbd5]/60">Status:</span>
                    <span className="text-[#e5e4dd]">{formData.status.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Master Password Input */}
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Master Password <span className="text-[#ff4444]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Enter your master password to encrypt"
                    className="w-full px-4 py-2 bg-[#191818] border border-[#404040] rounded-md
                             text-[#e5e4dd] placeholder-[#dcdbd5]/40
                             focus:outline-none focus:border-[#00ff88] transition-colors"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#dcdbd5] hover:text-[#e5e4dd]"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <p className="text-xs text-[#dcdbd5]/60 mt-1">
                  🔒 Your master password is required to encrypt this token
                </p>
              </div>

              {/* Security Notice */}
              <div className="p-4 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30">
                <p className="text-sm text-[#dcdbd5]">
                  <strong className="text-[#00ff88]">🔐 Security:</strong> Your token will be encrypted with AES-256-GCM
                  using your master password. The encrypted value will be stored in the database. Your master password
                  is never stored.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-[#191818] border-t border-[#404040] p-6 flex justify-between">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-[#404040] text-[#dcdbd5]
                         hover:bg-[#404040]/80 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStep1Next}
                className="px-6 py-2 rounded-md bg-[#00ff88] text-[#191818] font-medium
                         hover:bg-[#00ff88]/90 transition-all"
              >
                Next: Encrypt & Save →
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-md bg-[#404040] text-[#dcdbd5]
                         hover:bg-[#404040]/80 transition-all disabled:opacity-50"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-md bg-[#00ff88] text-[#191818] font-medium
                         hover:bg-[#00ff88]/90 transition-all disabled:opacity-50
                         flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#191818]"></div>
                    <span>Encrypting...</span>
                  </>
                ) : (
                  <>
                    <span>💾 Save Token</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
