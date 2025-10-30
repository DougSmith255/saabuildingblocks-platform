# Token Propagation System - Architecture

## System Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                                │
│                                                                          │
│  ┌──────────────┐         ┌──────────────┐        ┌──────────────┐    │
│  │ Token Vault  │────────▶│ Propagate    │───────▶│ Confirmation │    │
│  │     UI       │         │   Button     │        │    Dialog    │    │
│  └──────────────┘         └──────────────┘        └──────────────┘    │
│         │                        │                        │             │
│         │                        │                        │             │
│         ▼                        ▼                        ▼             │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │              useTokenPropagation Hook                         │     │
│  │  • propagate(tokenId, value)                                  │     │
│  │  • dryRun(tokenId)                                            │     │
│  │  • isLoading, result, error                                   │     │
│  └──────────────────────────────────────────────────────────────┘     │
└────────────────────────┬───────────────────────────────────────────────┘
                         │
                         │ HTTP POST
                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          API LAYER                                      │
│                                                                          │
│  POST /api/tokens/propagate                                             │
│  ┌────────────────────────────────────────────────────────┐            │
│  │ 1. Authenticate user (Supabase)                        │            │
│  │ 2. Fetch token from database                           │            │
│  │ 3. Validate configuration                              │            │
│  │ 4. If dry_run: preview only                            │            │
│  │ 5. Else: call propagateTokenUpdate()                   │            │
│  │ 6. Log audit entry                                     │            │
│  │ 7. Return results                                      │            │
│  └────────────────────────────────────────────────────────┘            │
│                         │                                               │
└─────────────────────────┼───────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       PROPAGATION LIBRARY                               │
│                   lib/tokenPropagation.ts                               │
│                                                                          │
│  propagateTokenUpdate(token, decryptedValue)                            │
│  ┌────────────────────────────────────────────────────────┐            │
│  │                                                         │            │
│  │  ┌───────────────────────────────────────────┐        │            │
│  │  │ validatePropagationConfig(token)          │        │            │
│  │  │ • Check used_by metadata exists           │        │            │
│  │  │ • Validate ENV/GITHUB prefixes            │        │            │
│  │  │ • Return errors/warnings                  │        │            │
│  │  └───────────────────────────────────────────┘        │            │
│  │                    │                                    │            │
│  │                    ▼                                    │            │
│  │  ┌──────────────────────────┬──────────────────────┐  │            │
│  │  │                          │                      │  │            │
│  │  ▼                          ▼                      │  │            │
│  │  propagateToEnvFile()      propagateToGitHub()    │  │            │
│  │                                                     │  │            │
│  └─────────────────────────────────────────────────────┘  │            │
│           │                              │                              │
└───────────┼──────────────────────────────┼──────────────────────────────┘
            │                              │
            ▼                              ▼
┌────────────────────────┐    ┌────────────────────────────────────────┐
│  .env.local File       │    │     GitHub Secrets API                 │
│                        │    │                                        │
│  1. Read file          │    │  1. Get repo public key                │
│  2. Find variable:     │    │  2. Initialize libsodium               │
│     CLOUDFLARE_API_... │    │  3. Encrypt secret value               │
│  3. Replace value      │    │  4. Call GitHub API:                   │
│  4. Write file back    │    │     PUT /repos/.../secrets/{name}      │
│  5. Return success     │    │  5. Return result                      │
│                        │    │                                        │
└────────────────────────┘    └────────────────────────────────────────┘
```

## Data Flow

### 1. Token Configuration

```
Supabase Database (master_controller_tokens table)
    │
    ├─ id: uuid
    ├─ service_name: "Cloudflare"
    ├─ token_type: "API Token"
    ├─ encrypted_value: "..." (encrypted token)
    └─ used_by: [
           "ENV:CLOUDFLARE_API_TOKEN",
           "GITHUB:CLOUDFLARE_API_TOKEN"
       ]
```

### 2. Propagation Request

```
User Action
    ↓
Frontend calls: propagate(tokenId, decryptedValue)
    ↓
HTTP POST to /api/tokens/propagate
    {
      "token_id": "uuid",
      "decrypted_value": "cf_token_12345...",
      "dry_run": false
    }
    ↓
API validates and processes
```

### 3. Propagation Execution

```
propagateTokenUpdate()
    ├─→ propagateToEnvFile()
    │       ↓
    │   Read .env.local
    │   Find: CLOUDFLARE_API_TOKEN=old_value
    │   Replace: CLOUDFLARE_API_TOKEN=cf_token_12345...
    │   Write file
    │   Return: { success: true, location: ".env.local" }
    │
    └─→ propagateToGitHub()
            ↓
        Get GitHub PAT from vault
        Initialize Octokit client
        Get repository public key
        Encrypt token with libsodium
        Update secret via API
        Return: { success: true, location: "GitHub:owner/repo" }
```

### 4. Result Aggregation

```
PropagationResult {
    success: true,
    timestamp: "2025-10-30T03:15:00.000Z",
    token: {
        id: "uuid",
        service_name: "Cloudflare",
        token_type: "API Token"
    },
    locations: {
        env: {
            success: true,
            location: ".env.local",
            details: "Updated CLOUDFLARE_API_TOKEN"
        },
        github: {
            success: true,
            location: "GitHub:owner/repo",
            details: "Updated secret CLOUDFLARE_API_TOKEN"
        }
    },
    errors: [],
    summary: "Successfully propagated to all 2 locations"
}
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────────┐
│                    Token Vault Component                     │
│                                                               │
│  const { propagate, dryRun, result } = useTokenPropagation()│
│                                                               │
│  [Propagate Button] ──────────────┐                          │
│                                    │                          │
│                                    ▼                          │
│                         handlePropagateClick()                │
│                                    │                          │
│                         ┌──────────┴──────────┐              │
│                         │                     │              │
│                         ▼                     ▼              │
│                    dryRun()            propagate()           │
│                         │                     │              │
│                         ▼                     │              │
│              <PropagationPreview>             │              │
│              • Shows locations                │              │
│              • Shows warnings                 │              │
│              • [Confirm] button ──────────────┘              │
│                                               │              │
│                                               ▼              │
│                                      <PropagationResults>    │
│                                      • Shows success/failure │
│                                      • Lists each location   │
│                                      • Displays errors       │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Security Layer

```
┌────────────────────────────────────────────────────────────┐
│                      Security Measures                      │
│                                                              │
│  1. Authentication                                           │
│     └─ Supabase auth required for API access                │
│                                                              │
│  2. Encryption                                               │
│     ├─ Tokens encrypted at rest (Supabase)                  │
│     └─ GitHub secrets encrypted in transit (libsodium)      │
│                                                              │
│  3. Access Control                                           │
│     ├─ User ID verification                                 │
│     └─ Token ownership check                                │
│                                                              │
│  4. Audit Logging                                            │
│     ├─ All propagation attempts logged                      │
│     ├─ User ID recorded                                     │
│     └─ Timestamp and results stored                         │
│                                                              │
│  5. Error Handling                                           │
│     ├─ No sensitive data in error messages                  │
│     ├─ Decrypted values never logged                        │
│     └─ Graceful degradation (partial success)               │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
propagateTokenUpdate()
    │
    ├─→ Try: propagateToEnvFile()
    │       ├─ Success ──────────→ Add to locations.env
    │       └─ Error ────────────→ Add to errors[], continue
    │
    └─→ Try: propagateToGitHub()
            ├─ Success ──────────→ Add to locations.github
            └─ Error ────────────→ Add to errors[], continue
                │
                ▼
        Evaluate Overall Success
            ├─ All succeeded ────→ success: true, summary: "all locations"
            ├─ Some succeeded ───→ success: true, summary: "N/M locations"
            └─ None succeeded ───→ success: false, summary: "failed"
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     Technology Stack                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend:                                                    │
│  ├─ React 19 (hooks)                                         │
│  ├─ TypeScript                                               │
│  └─ Tailwind CSS v4                                          │
│                                                               │
│  Backend:                                                     │
│  ├─ Next.js 16 API Routes                                    │
│  ├─ Node.js fs/promises                                      │
│  └─ Supabase (database + auth)                               │
│                                                               │
│  External APIs:                                               │
│  ├─ @octokit/rest (GitHub API)                               │
│  └─ libsodium-wrappers (encryption)                          │
│                                                               │
│  Storage:                                                     │
│  ├─ Supabase PostgreSQL (encrypted tokens)                   │
│  ├─ .env.local (plaintext configs)                           │
│  └─ GitHub Secrets (encrypted via API)                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Considerations

```
┌─────────────────────────────────────────────────────────────┐
│                    Deployment Notes                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  VPS Deployment:                                              │
│  ├─ .env.local propagation works ✓                           │
│  ├─ GitHub API accessible ✓                                  │
│  └─ File system writable ✓                                   │
│                                                               │
│  Cloudflare Pages (Static Export):                           │
│  ├─ .env.local propagation N/A (no file system)             │
│  ├─ GitHub API propagation N/A (no backend)                 │
│  └─ Propagation must run on VPS ⚠️                           │
│                                                               │
│  GitHub Actions:                                              │
│  ├─ Can receive propagated secrets ✓                         │
│  ├─ Secrets encrypted in transit ✓                           │
│  └─ Auto-deployment on secret update (optional) ✓            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Future Extension Points

```
┌─────────────────────────────────────────────────────────────┐
│                  Extension Architecture                      │
│                                                               │
│  propagateTokenUpdate(token, value)                          │
│      │                                                        │
│      ├─→ propagateToEnvFile()         [Current]             │
│      ├─→ propagateToGitHub()          [Current]             │
│      │                                                        │
│      ├─→ propagateToDockerSecrets()   [Future]              │
│      ├─→ propagateToKubernetes()      [Future]              │
│      ├─→ propagateToAWSSecrets()      [Future]              │
│      ├─→ propagateToAzureKeyVault()   [Future]              │
│      └─→ propagateToCloudflareWorkers() [Future]            │
│                                                               │
│  Each propagator implements:                                 │
│  • validate() - Check configuration                          │
│  • execute() - Perform propagation                           │
│  • rollback() - Undo on failure (future)                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

**Built:** 2025-10-30  
**Status:** Production Ready  
**Version:** 1.0.0
