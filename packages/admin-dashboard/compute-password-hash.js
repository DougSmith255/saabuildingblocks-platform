/**
 * Compute SHA-256 hash of master password "Dstv666666."
 * This matches the hashMasterPassword() function in tokenVault.ts
 */

const crypto = require('crypto');

const password = "Dstv666666.";

// Create SHA-256 hash
const hash = crypto.createHash('sha256');
hash.update(password);
const hashBuffer = hash.digest();

// Convert to base64 (matches arrayBufferToBase64 function)
const hashBase64 = hashBuffer.toString('base64');

console.log('Master Password:', password);
console.log('SHA-256 Hash (Base64):', hashBase64);
console.log('\nUse this hash in tokenVaultStore.ts:');
console.log(`masterPasswordHash: '${hashBase64}',`);
