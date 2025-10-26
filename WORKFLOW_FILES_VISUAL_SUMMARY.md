# GitHub Workflows Visual Summary

## File Location Map

```
/home/claude-flow/
│
├── .github/workflows/               ← ROOT (Repository-wide workflows)
│   ├── ci.yml                       [73483582...] CI Pipeline
│   ├── codeql.yml                   [c631527f...] Security Scan
│   ├── dependabot-auto-merge.yml    [98cfad19...] Auto-merge
│   ├── deploy-cloudflare.yml        [a0004e81...] ⚠️  SIMPLE VERSION (60 lines)
│   ├── deploy.yml                   [3a83ee36...] SSH Deployment
│   ├── e2e-tests.yml                [5c5d64af...] E2E Tests
│   └── test.yml                     [93b835ac...] Test Suite
│
└── nextjs-frontend/.github/workflows/  ← FRONTEND (Next.js-specific workflows)
    ├── deploy-cloudflare.yml        [b0822f2c...] ⚠️  ADVANCED VERSION (434 lines)
    ├── deploy-static-export-safe.yml [27d27325...] Safe Export
    ├── typography-persistence-tests.yml [a023fc85...] Typography Tests
    └── wordpress-content-update.yml  [9d58a12d...] WordPress Automation
```

## Name Collision Detected

```
⚠️  DUPLICATE NAME (Different Files)
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  File: deploy-cloudflare.yml                              │
│  ─────────────────────────────────────────────────────────│
│                                                            │
│  Location 1: /.github/workflows/                          │
│  Checksum: a0004e81...                                    │
│  Size: 60 lines (~2.5 KB)                                 │
│  Type: SIMPLE                                             │
│  ─────────────────────────────────────────────────────────│
│                                                            │
│  Location 2: /nextjs-frontend/.github/workflows/          │
│  Checksum: b0822f2c...                                    │
│  Size: 434 lines (~18 KB)                                 │
│  Type: PRODUCTION-GRADE                                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Comparison at a Glance

### Root Version (Simple)
```yaml
✅ Trigger: Push to main (nextjs-frontend/**)
✅ Jobs: 1 (deploy)
❌ Caching: None
❌ Retries: None
❌ Notifications: None
✅ Build: bash scripts/build-static.sh
✅ Target: saa-static-export
```

### Frontend Version (Production)
```yaml
✅ Trigger: repository_dispatch + workflow_dispatch
✅ Jobs: 3 (build, deploy, notify)
✅ Caching: node_modules + Next.js build
✅ Retries: 3 attempts with backoff
✅ Notifications: Email (Resend) + GitHub comments
✅ Build: Direct npm build with config swap
✅ Target: saa-static
✅ Features: Build hash, artifacts, change detection
```

## Feature Comparison Matrix

| Feature | Root | Frontend |
|---------|:----:|:--------:|
| Lines of code | 60 | 434 |
| Caching | ❌ | ✅ |
| Retry logic | ❌ | ✅ |
| Build artifacts | ❌ | ✅ |
| CSS generation | ❌ | ✅ |
| Notifications | ❌ | ✅ |
| Change detection | ❌ | ✅ |
| Multi-job | ❌ | ✅ |
| WordPress integration | ❌ | ✅ |

## Workflow Purpose Overview

```
┌─────────────────────────────────────────────────────────────┐
│ ROOT WORKFLOWS (Repository-wide)                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ci.yml                   → Lint, test, accessibility, E2E │
│  codeql.yml               → Security scanning (CodeQL)     │
│  dependabot-auto-merge.yml → Auto-merge dependency PRs     │
│  deploy-cloudflare.yml     → ⚠️  Simple Cloudflare deploy  │
│  deploy.yml               → SSH-based production deploy    │
│  e2e-tests.yml            → Multi-browser E2E tests        │
│  test.yml                 → Full test suite + deploy       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FRONTEND WORKFLOWS (Next.js-specific)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  deploy-cloudflare.yml     → ⚠️  Production Cloudflare     │
│  deploy-static-export-safe.yml → Safe static export        │
│  typography-persistence-tests.yml → Typography E2E tests   │
│  wordpress-content-update.yml → WordPress automation       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Quick Decision Guide

### Which `deploy-cloudflare.yml` to Use?

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Question: Which workflow should I use?            │
│  ──────────────────────────────────────────────────│
│                                                     │
│  ✅ FOR PRODUCTION:                                │
│     Use: /nextjs-frontend/.github/workflows/       │
│     File: deploy-cloudflare.yml                    │
│     Reason: Full-featured, battle-tested           │
│                                                     │
│  ⚠️  FOR TESTING/DEVELOPMENT:                      │
│     Use: /.github/workflows/                       │
│     File: deploy-cloudflare.yml                    │
│     Reason: Simple, fast, no frills                │
│                                                     │
│  💡 RECOMMENDATION:                                │
│     Rename one to avoid confusion                  │
│     Suggested: deploy-cloudflare-simple.yml        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## GitHub Actions Standard Location

```
✅ CORRECT: /.github/workflows/*.yml
           (Relative to repository root)

❌ INCORRECT: /nextjs-frontend/.github/workflows/*.yml
              (Only works if nextjs-frontend IS the repo root)
```

## Recommended Actions

```
Priority | Action | Impact
─────────┼────────────────────────────────────┼──────────
   1     │ Consolidate deploy-cloudflare.yml │ High
   2     │ Move all workflows to root        │ Medium
   3     │ Standardize naming (prefixes)     │ Medium
   4     │ Document workflow purposes        │ Low
   5     │ Add workflow diagrams             │ Low
```

## File Size Visualization

```
Root deploy-cloudflare.yml:
████████ 60 lines

Frontend deploy-cloudflare.yml:
████████████████████████████████████████████████████████ 434 lines
(7.2x larger)
```

## Checksum Quick Reference

```
Root Workflows:
  ci.yml                     → 73483582...
  codeql.yml                 → c631527f...
  dependabot-auto-merge.yml  → 98cfad19...
  deploy-cloudflare.yml      → a0004e81... ⚠️
  deploy.yml                 → 3a83ee36...
  e2e-tests.yml              → 5c5d64af...
  test.yml                   → 93b835ac...

Frontend Workflows:
  deploy-cloudflare.yml      → b0822f2c... ⚠️
  deploy-static-export-safe.yml → 27d27325...
  typography-persistence-tests.yml → a023fc85...
  wordpress-content-update.yml → 9d58a12d...
```

## Status Summary

```
┌──────────────────────────────────────────────────┐
│ DUPLICATE DETECTION RESULTS                     │
├──────────────────────────────────────────────────┤
│                                                  │
│  ✅ Exact duplicates: 0                         │
│  ⚠️  Name collisions: 1 (deploy-cloudflare.yml) │
│  ✅ Unique files: 10                            │
│  📊 Total analyzed: 11                          │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

**Last Updated:** 2025-10-26
**For detailed analysis, see:** [GITHUB_WORKFLOWS_COMPARISON_REPORT.md](/home/claude-flow/GITHUB_WORKFLOWS_COMPARISON_REPORT.md)
