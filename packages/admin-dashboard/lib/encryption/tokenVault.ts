/**
 * Token Vault Encryption Library
 * Provides client-side encryption for sensitive tokens using Web Crypto API
 */

export interface TokenVaultEncryptedToken {
  encryptedValue: string;
  iv: string;
  salt: string;
}

/**
 * Validates master password meets security requirements
 */
export function validateMasterPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 10) {
    errors.push('Password must be at least 10 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculates password strength score (0-100)
 */
export function calculatePasswordStrength(password: string): {
  score: number;
  level: 'weak' | 'moderate' | 'strong' | 'very-strong';
} {
  let score = 0;

  // Length score (up to 40 points)
  score += Math.min(40, password.length * 2);

  // Character variety (up to 60 points)
  if (/[A-Z]/.test(password)) score += 10;
  if (/[a-z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;

  // Complexity bonus (up to 15 points)
  const uniqueChars = new Set(password).size;
  score += Math.min(15, uniqueChars);

  // Determine level
  let level: 'weak' | 'moderate' | 'strong' | 'very-strong';
  if (score < 40) level = 'weak';
  else if (score < 60) level = 'moderate';
  else if (score < 80) level = 'strong';
  else level = 'very-strong';

  return { score, level };
}

/**
 * Derives encryption key from master password using PBKDF2
 */
async function deriveKey(
  password: string,
  salt: Uint8Array | ArrayBuffer
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // Ensure salt is Uint8Array with proper ArrayBuffer type
  const saltArray: Uint8Array = salt instanceof Uint8Array ? salt : new Uint8Array(salt);

  // Derive AES-GCM key
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltArray as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a token value using AES-GCM
 */
export async function encryptToken(
  tokenValue: string,
  masterPassword: string
): Promise<TokenVaultEncryptedToken> {
  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Derive encryption key
  const key = await deriveKey(masterPassword, salt);

  // Encrypt token value
  const encoder = new TextEncoder();
  const data = encoder.encode(tokenValue);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    data
  );

  // Convert to base64 for storage
  return {
    encryptedValue: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv.buffer),
    salt: arrayBufferToBase64(salt.buffer)
  };
}

/**
 * Decrypts a token value using AES-GCM
 */
export async function decryptToken(
  encrypted: TokenVaultEncryptedToken,
  masterPassword: string
): Promise<string> {
  // Convert from base64
  const salt = base64ToArrayBuffer(encrypted.salt);
  const iv = base64ToArrayBuffer(encrypted.iv);
  const encryptedData = base64ToArrayBuffer(encrypted.encryptedValue);

  // Derive decryption key
  const key = await deriveKey(masterPassword, new Uint8Array(salt));

  // Decrypt
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    key,
    encryptedData
  );

  // Convert back to string
  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Hashes master password for verification (SHA-256)
 */
export async function hashMasterPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return arrayBufferToBase64(hashBuffer);
}

/**
 * Checks if vault should auto-lock based on last activity
 */
export function shouldAutoLock(
  lastActivityTime: number,
  autoLockMinutes: number
): boolean {
  const now = Date.now();
  const minutesSinceActivity = (now - lastActivityTime) / 1000 / 60;
  return minutesSinceActivity >= autoLockMinutes;
}

/**
 * Securely copies text to clipboard and clears after timeout
 */
export async function secureCopyToClipboard(
  text: string,
  clearAfterMs: number = 30000
): Promise<void> {
  await navigator.clipboard.writeText(text);

  // Clear clipboard after timeout
  setTimeout(async () => {
    try {
      // Write empty string to clear
      await navigator.clipboard.writeText('');
    } catch (error) {
      console.error('Failed to clear clipboard:', error);
    }
  }, clearAfterMs);
}

/**
 * Helper: Convert ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Helper: Convert Base64 to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
