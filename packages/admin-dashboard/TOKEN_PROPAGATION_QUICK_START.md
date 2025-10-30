# Token Propagation - Quick Start Guide

## What Is This?

Automatically sync token updates from the Token Vault to:
- `.env.local` file
- GitHub repository secrets

When you update a token, it propagates everywhere instantly. No more manual copy-paste!

---

## 5-Minute Setup

### 1. Configure Token Metadata

Add `used_by` to your token:

```typescript
{
  service_name: "Cloudflare",
  token_type: "API Token",
  used_by: [
    "ENV:CLOUDFLARE_API_TOKEN",      // Updates .env.local
    "GITHUB:CLOUDFLARE_API_TOKEN"    // Updates GitHub secret
  ]
}
```

### 2. Use in Code

```typescript
import { useTokenPropagation } from '@/lib/hooks/useTokenPropagation';

function TokenVault() {
  const { propagate, dryRun } = useTokenPropagation();

  const handlePropagate = async () => {
    // Preview first
    const preview = await dryRun(tokenId);
    console.log('Will update:', preview.locations);

    // Confirm and execute
    const result = await propagate(tokenId, decryptedValue);
    console.log(result.summary);
  };

  return <button onClick={handlePropagate}>Propagate</button>;
}
```

### 3. Test

```bash
# Verify system
bash scripts/verify-propagation-system.sh

# Test dry run
curl -X POST http://localhost:3001/api/tokens/propagate \
  -H "Content-Type: application/json" \
  -d '{"token_id": "uuid", "dry_run": true}'
```

---

## API Endpoints

### POST /api/tokens/propagate

**Dry Run (Preview):**
```bash
curl -X POST /api/tokens/propagate \
  -H "Content-Type: application/json" \
  -d '{"token_id": "uuid", "dry_run": true}'
```

**Actual Propagation:**
```bash
curl -X POST /api/tokens/propagate \
  -H "Content-Type: application/json" \
  -d '{"token_id": "uuid", "decrypted_value": "new_value"}'
```

---

## Token Configuration Examples

### Cloudflare API Token
```typescript
{
  service_name: "Cloudflare",
  used_by: ["ENV:CLOUDFLARE_API_TOKEN", "GITHUB:CLOUDFLARE_API_TOKEN"]
}
```

### GitHub PAT
```typescript
{
  service_name: "GitHub",
  used_by: ["ENV:GITHUB_TOKEN"]
}
```

### Supabase Service Role
```typescript
{
  service_name: "Supabase",
  used_by: ["ENV:SUPABASE_SERVICE_ROLE_KEY", "GITHUB:SUPABASE_SERVICE_ROLE_KEY"]
}
```

---

## Common Patterns

### Auto-Propagate on Save

```typescript
const handleSaveToken = async (token, newValue) => {
  // Save to vault
  await updateToken(token.id, newValue);

  // Auto-propagate
  await propagate(token.id, newValue);

  toast.success('Token saved and propagated!');
};
```

### Confirm Before Propagate

```typescript
const handlePropagate = async () => {
  const preview = await dryRun(tokenId);

  if (confirm(`Update ${preview.locations.length} locations?`)) {
    await propagate(tokenId, decryptedValue);
  }
};
```

### Show Results

```typescript
import { PropagationResults } from '@/app/master-controller/components/TokenVault/PropagationResults';

function TokenVault() {
  const { result } = useTokenPropagation();

  return result && <PropagationResults {...result} />;
}
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "No used_by metadata" | Add `used_by` array to token |
| ".env.local not found" | Create `.env.local` file |
| "Variable not found" | Check variable name matches |
| "GitHub PAT not found" | Add GitHub token to vault |

---

## Files Reference

```
lib/
  ├── tokenPropagation.ts              # Core library
  ├── tokenPropagation.README.md       # Full docs
  └── hooks/
      └── useTokenPropagation.ts       # React hook

app/
  ├── api/tokens/propagate/route.ts    # API endpoint
  └── master-controller/components/TokenVault/
      └── PropagationResults.tsx       # UI components
```

---

## Complete Documentation

- **Full Guide:** `lib/tokenPropagation.README.md`
- **Integration:** `lib/tokenPropagation.INTEGRATION.md`
- **Summary:** `TOKEN_PROPAGATION_SYSTEM.md`

---

## Status

✅ **READY FOR USE**

- Dependencies installed
- API endpoint configured
- React components ready
- Documentation complete

**Next:** Add propagation button to Token Vault UI!
