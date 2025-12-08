# Page Standardization Progress

This document tracks the ongoing effort to standardize all pages across the SAA website to use consistent components from the shared design system.

## Goals
1. Replace all inline card styling with `GenericCard` component
2. Ensure consistent use of typography components (H1, H2, Tagline, etc.)
3. Remove hardcoded backgrounds and colors in favor of theme-aware components
4. Maintain accessibility and responsive design

---

## Homepage (`/`)

### Status: IN PROGRESS

### Completed Changes

#### Card Standardization (Dec 8, 2025)
Replaced all inline card styling (`bg-white/5 border border-white/10 hover:border-[#ffd700]/30`) with `GenericCard` component.

**Files Updated:**

| File | Component | Change |
|------|-----------|--------|
| `ValueStack.tsx` | Value items list | Changed `<div>` to `<GenericCard hover padding="md">` |
| `SocialProof.tsx` | Stats grid | Changed `<div>` to `<GenericCard hover padding="md" centered>` |
| `WhyExpRealty.tsx` | Reasons grid | Changed `<div>` to `<GenericCard hover padding="md">` |
| `WhoWeAre.tsx` | Team member cards | Changed `<div>` to `<GenericCard hover padding="lg">` |
| `PathSelectorWithContent.tsx` | Path content card | Changed `<div>` to `<GenericCard padding="lg">` |
| `BuiltForFuture.tsx` | Future points grid | Changed `<div>` to `<GenericCard hover padding="md">` |
| `FinalCTA.tsx` | CTA card | Changed `<div>` to `<GenericCard padding="xl">` |

**GenericCard Props Used:**
- `hover` - Enables hover effects (scale, border glow, cursor pointer)
- `padding` - sm/md/lg/xl for consistent spacing
- `centered` - Centers text content
- `className` - Additional classes like `flex items-center gap-4`

#### Typography Standardization (Dec 8, 2025)
Replaced all hardcoded text classes (e.g., `text-lg`, `text-xl`, `text-[#e5e4dd]`) with Master Controller typography classes (`text-h3`, `text-h4`, `text-body`, `text-caption`).

**Why this matters:**
- The Master Controller generates CSS variables with `clamp()` for fluid typography
- CSS classes like `.text-h3`, `.text-body` use these variables
- Previously, sections used hardcoded Tailwind classes (`text-lg`, `text-xl`) which bypass the Master Controller
- Now all text scales properly across viewport sizes (250px - 3000px)

**Files Updated:**

| File | Before | After |
|------|--------|-------|
| `ValueStack.tsx` | `text-lg md:text-xl`, `text-sm md:text-base` | `text-h4`, `text-body` |
| `SocialProof.tsx` | `text-3xl md:text-4xl`, `text-lg` | `text-h3`, `text-body` |
| `WhyExpRealty.tsx` | `text-lg`, `text-sm` | `text-h4`, `text-body` |
| `WhoWeAre.tsx` | `text-xl md:text-2xl`, `text-lg` | `text-h3`, `text-body` |
| `PathSelectorWithContent.tsx` | `text-lg`, hardcoded colors | `text-h4`, `text-body` |
| `BuiltForFuture.tsx` | `text-lg` | `text-h4`, `text-body` |
| `FinalCTA.tsx` | `text-lg`, `text-sm` | `text-body`, `text-caption` |

**Typography Classes Available:**
- `text-h1` through `text-h6` - Headings (use appropriate level for semantic meaning)
- `text-body` - Body/paragraph text
- `text-caption` - Small text (disclaimers, fine print)
- `text-tagline` - Taglines/subtitles
- `text-quote` - Blockquotes
- `text-link` - Link text
- `text-button` - Button text (usually handled by button components)

**Color Overrides:**
When you need a different color than the default, add the color after the text class:
```tsx
<h3 className="text-h4 text-[#ffd700]">Golden heading</h3>
<p className="text-body opacity-80">Slightly faded text</p>
```

### Remaining Work
- [ ] Review hero section for any standardization needs
- [ ] Check StaticCounter component styling
- [ ] Verify all buttons use CTAButton/SecondaryButton/GenericButton

---

## Other Pages (To Do)

### Agent Portal (`/agent-portal`)
- Status: Partially done (Dec 8 - removed hardcoded backgrounds)
- Needs: Full GenericCard audit

### eXp Commission Calculator (`/exp-commission-calculator`)
- Status: Partially done (Dec 8 - removed inline background styles)
- Needs: Full component audit

### Freebies (`/freebies`)
- Status: Updated to use GenericCard (Dec 8)
- Needs: Review for completeness

### Should You Join eXp (`/should-you-join-exp`)
- Status: Partially done (Dec 8)
- Needs: Full component audit

### About Pages
- `/about-doug-smart` - Not started
- `/about-karrie-hill` - Not started
- `/about-exp-realty` - Not started

### Other Pages
- `/our-exp-team` - Not started
- `/join-exp-sponsor-team` - Not started
- `/exp-realty-sponsor` - Not started
- `/locations` - Not started
- `/awards` - Not started
- `/exp-realty-revenue-share-calculator` - Not started
- `/best-real-estate-brokerage/*` - Not started
- `/doug-linktree` - Not started
- `/karrie-linktree` - Not started

---

## Component Reference

### GenericCard
```tsx
<GenericCard
  hover        // Enable hover effects
  padding="md" // sm | md | lg | xl
  centered     // Center text
  href="/link" // Auto-enables interactive + wraps in link
  className="" // Additional classes
>
  {children}
</GenericCard>
```

### Typography
- `H1` - Main headings with hero animation support
- `H2` - Section headings with metal plate effect
- `Tagline` - Subtitle text
- `H3`-`H6` - Subheadings

### Buttons
- `CTAButton` - Primary action (gold glow)
- `SecondaryButton` - Secondary action (outline style)
- `GenericButton` - Toggle/filter buttons
