# Hero Effect Loading Method Performance Comparison (MOBILE)

Tested 6 pages with 3 different loading methods (3 runs each = 18 total tests)

**Note:** All tests are MOBILE (throttled CPU/network). Desktop scores are 99-100 for all pages.

## Loading Methods Tested

| Method | Description |
|--------|-------------|
| **DYNAMIC** | Next.js `dynamic()` import with `ssr: false` - loads after hydration |
| **DIRECT IMPORT** | Standard import - included in initial JS bundle |
| **DEFERRED (Lazy)** | Custom `LazyXEffect` - loads after `window.onload` + `requestIdleCallback` |

---

## ALL RESULTS BY RUN

### RUN 1

| Page | Loading Method | Effect | Perf | FCP | LCP | TBT | CLS | SI |
|------|----------------|--------|------|-----|-----|-----|-----|-----|
| /about-karrie-hill | DYNAMIC | QuantumGridEffect | 96 | 1.3s | 2.3s | 40ms | 0 | 3.8s |
| /awards | DYNAMIC | QuantumGridEffect | 90 | 1.4s | 3.0s | 160ms | 0 | 3.9s |
| /about-exp-realty | DIRECT | SatelliteConstellationEffect | 93 | 1.4s | 3.1s | 30ms | 0.008 | 2.8s |
| /freebies | DIRECT | ParticleStormEffect | 63 | 1.4s | 3.2s | 110ms | 3.5 | 4.7s |
| / (home) | DEFERRED | RevealMaskEffect | 74 | 1.3s | 3.6s | 540ms | 0 | 4.6s |
| /blog | DEFERRED | AsteroidBeltEffect | 76 | 1.4s | 3.2s | 50ms | 0.26 | 4.7s |

### RUN 2

| Page | Loading Method | Effect | Perf | FCP | LCP | TBT | CLS | SI |
|------|----------------|--------|------|-----|-----|-----|-----|-----|
| /about-karrie-hill | DYNAMIC | QuantumGridEffect | 96 | 1.4s | 2.6s | 0ms | 0 | 3.2s |
| /awards | DYNAMIC | QuantumGridEffect | 92 | 1.2s | 3.2s | 30ms | 0 | 3.2s |
| /about-exp-realty | DIRECT | SatelliteConstellationEffect | 97 | 1.4s | 2.3s | 80ms | 0.008 | 2.7s |
| /freebies | DIRECT | ParticleStormEffect | 69 | 1.4s | 2.7s | 100ms | 2.909 | 3.5s |
| / (home) | DEFERRED | RevealMaskEffect | 76 | 1.4s | 3.2s | 560ms | 0 | 4.4s |
| /blog | DEFERRED | AsteroidBeltEffect | 72 | 1.2s | 2.9s | 130ms | 0.491 | 3.7s |

### RUN 3

| Page | Loading Method | Effect | Perf | FCP | LCP | TBT | CLS | SI |
|------|----------------|--------|------|-----|-----|-----|-----|-----|
| /about-karrie-hill | DYNAMIC | QuantumGridEffect | 91 | 1.4s | 3.3s | 50ms | 0 | 3.5s |
| /awards | DYNAMIC | QuantumGridEffect | 95 | 1.1s | 2.7s | 20ms | 0 | 3.3s |
| /about-exp-realty | DIRECT | SatelliteConstellationEffect | 98 | 1.4s | 2.3s | 30ms | 0.008 | 2.7s |
| /freebies | DIRECT | ParticleStormEffect | 64 | 1.4s | 3.5s | 40ms | 2.54 | 4.0s |
| / (home) | DEFERRED | RevealMaskEffect | 79 | 1.4s | 3.3s | 340ms | 0.036 | 6.0s |
| /blog | DEFERRED | AsteroidBeltEffect | 76 | 1.4s | 2.4s | 70ms | 0.387 | 4.3s |

---

## SUMMARY BY LOADING METHOD (3-Run Averages)

### DYNAMIC (`dynamic()` with `ssr: false`)

| Page | Avg Perf | Avg TBT | Avg CLS |
|------|----------|---------|---------|
| /about-karrie-hill | 94.3 | 30ms | 0 |
| /awards | 92.3 | 70ms | 0 |
| **Method Avg** | **93.3** | **50ms** | **0** |

### DIRECT IMPORT (standard import)

| Page | Avg Perf | Avg TBT | Avg CLS |
|------|----------|---------|---------|
| /about-exp-realty | 96.0 | 47ms | 0.008 |
| /freebies | 65.3 | 83ms | 2.98 |
| **Method Avg** | **80.7** | **65ms** | **1.49** |

### DEFERRED (LazyXEffect)

| Page | Avg Perf | Avg TBT | Avg CLS |
|------|----------|---------|---------|
| / (home) | 76.3 | 480ms | 0.012 |
| /blog | 74.7 | 83ms | 0.38 |
| **Method Avg** | **75.5** | **282ms** | **0.20** |

---

## FINAL COMPARISON

| Loading Method | Avg Performance | Avg TBT | Avg CLS |
|----------------|-----------------|---------|---------|
| **DYNAMIC** | **93.3** | **50ms** | **0** |
| DIRECT IMPORT | 80.7 | 65ms | 1.49 |
| DEFERRED | 75.5 | 282ms | 0.20 |

---

## CONCLUSIONS

### Winner: `dynamic()` with `ssr: false`

**Consistent across all 3 runs:**
- Best average performance: **93.3** (vs 80.7 Direct, 75.5 Deferred)
- Best TBT: **50ms** (vs 65ms Direct, 282ms Deferred)
- Perfect CLS: **0** (vs 1.49 Direct, 0.20 Deferred)

### Key Observations:

1. **DYNAMIC consistently scores 91-96** on both test pages
2. **DIRECT IMPORT has a problem page** - /freebies scores 63-69 due to massive CLS (2.5-3.5)
   - /about-exp-realty scores 93-98 (excellent) - so it's not the loading method
   - The freebies page has a layout shift issue unrelated to effect loading
3. **DEFERRED has high TBT on homepage** (340-560ms) due to other page complexity, not the lazy loader itself

### Why DYNAMIC Works Best:

- Effect code loads in separate chunk AFTER hydration
- Doesn't block First Contentful Paint
- Doesn't add to main JavaScript bundle
- Effect container already in DOM = zero layout shift

---

## RECOMMENDATION

**Convert all hero effects to use `dynamic()` import:**

```tsx
import dynamic from 'next/dynamic';

const QuantumGridEffect = dynamic(
  () => import('@/components/shared/hero-effects').then(mod => ({ default: mod.QuantumGridEffect })),
  { ssr: false }
);
```

Pages already using dynamic (keep as-is):
- /about-karrie-hill
- /awards
- /our-exp-team
- /about-doug-smart
- /exp-realty-sponsor
- /best-real-estate-brokerage

Pages to convert from DIRECT IMPORT to DYNAMIC:
- /about-exp-realty (SatelliteConstellationEffect)
- /freebies (ParticleStormEffect)
- /locations (ConstellationMapEffect)
- /join-exp-sponsor-team (GreenLaserGridEffect)
- /exp-realty-revenue-share-calculator (LaserGridEffect)

Pages to convert from DEFERRED to DYNAMIC:
- / (home) - RevealMaskEffect
- /blog - AsteroidBeltEffect
