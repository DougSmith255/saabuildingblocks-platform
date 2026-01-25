# Slide-in Panel Migration Plan

**Created:** 2026-01-25
**Status:** Audit Complete - Ready for Migration
**Priority:** High

---

## Overview

Replace ALL modal popups across the main website and agent attraction page template with a new reusable slide-in panel component. The component will be based on the help panels used in the Agent Portal, with a consistent gold/yellow theme.

---

## Phase 1: Create Reusable Component

### Component Specifications

**Name:** `SlidePanel` (or `SlidePanelModal`)
**Location:** `/packages/public-site/components/shared/SlidePanel.tsx`
**Theme:** Always gold/yellow (no theme variants needed)

**Behavior (matching Agent Portal help panels):**
- **Mobile (< 950px):** Slide up from bottom, full width
- **Desktop (≥ 950px):** Slide in from right, full height
- **Close triggers:**
  - Click backdrop
  - Click close button (X)
  - Press Escape key
  - Swipe down (mobile) - only when at top of scroll
  - Swipe right (desktop)
- **Animations:**
  - Open: 300ms slide in + backdrop fade
  - Close: 250ms slide out + backdrop fade
- **Scroll behavior:**
  - Body scroll locked when open
  - Panel content scrollable
  - Sticky header with solid background

**Props Interface:**
```tsx
interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg'; // Width on desktop
}
```

**CSS Features (from Agent Portal):**
- Premium glass effect with 3D depth
- Gold accent border on left (desktop) / top (mobile)
- Backdrop blur
- Layered shadows for depth
- Rounded corners (except edge touching screen)

### CSS to Include

```css
/* Animations */
@keyframes slideInUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes slideOutDown { from { transform: translateY(0); } to { transform: translateY(100%); } }
@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes slideOutRight { from { transform: translateX(0); } to { transform: translateX(100%); } }
@keyframes backdropFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes backdropFadeOut { from { opacity: 1; } to { opacity: 0; } }

/* Panel styling */
.slide-panel {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
              linear-gradient(45deg, rgba(18, 18, 18, 0.97), rgba(28, 28, 28, 0.98));
  backdrop-filter: blur(12px) saturate(1.4);
  /* Gold theme accent */
  --panel-accent: rgba(255, 215, 0, 0.25);
  --panel-glow: rgba(255, 215, 0, 0.1);
}

/* Desktop: left border only */
@media (min-width: 950px) {
  .slide-panel {
    border: none;
    border-left: 1px solid var(--panel-accent);
    box-shadow: -20px 0 60px rgba(0, 0, 0, 0.6), ...;
  }
}
```

---

## Phase 2: Audit Existing Modals

### Files to Check

#### Main Website (public-site)
- [ ] `/app/page.tsx` (homepage)
- [ ] `/app/exp-realty-sponsor/page.tsx`
- [ ] `/app/about-exp-realty/page.tsx`
- [ ] `/app/freebies/page.tsx`
- [ ] `/app/exp-commission-calculator/page.tsx`
- [ ] `/app/exp-realty-revenue-share-calculator/page.tsx`
- [ ] `/app/best-real-estate-brokerage/page.tsx`
- [ ] `/app/blog/page.tsx`
- [ ] `/app/locations/page.tsx`
- [ ] `/app/awards/page.tsx`
- [ ] `/app/our-exp-team/page.tsx`
- [ ] `/app/about-doug-smart/page.tsx`
- [ ] `/app/about-karrie-hill/page.tsx`
- [ ] `/app/join-exp-sponsor-team/page.tsx`
- [ ] `/app/agent-portal/login/page.tsx`
- [ ] `/components/shared/*.tsx` (shared modal components)

#### Agent Attraction Page Template
- [ ] `/functions/[slug].js` - **CRITICAL: All code is inlined**

### Types of Modals to Replace

1. **Form Popups**
   - Contact forms
   - Lead capture forms
   - Newsletter signup
   - Calculator result modals

2. **Instruction Popups**
   - How-to guides
   - Tooltips that became modals
   - Info dialogs

3. **Confirmation Popups**
   - Success messages
   - Error messages
   - Action confirmations

4. **Content Popups**
   - Image lightboxes (if any)
   - Video modals (if any)
   - Detail views

---

## Phase 3: Migration Strategy

### Step 1: Create Component
1. Build `SlidePanel.tsx` component
2. Add to component exports
3. Test in isolation

### Step 2: Replace Main Site Modals
1. Search for modal usage patterns:
   - `Modal` component imports
   - `isOpen` / `onClose` patterns
   - Fixed position overlays
   - `z-index` modal patterns
2. Replace one by one
3. Test each replacement

### Step 3: Replace Agent Attraction Page Modals
1. **Special handling required:** All code in `[slug].js` is inlined
2. Cannot import external components
3. Must inline the SlidePanel CSS and HTML structure
4. Update the template string with new panel code

### Step 4: Cleanup
1. Remove old Modal component (if no longer used)
2. Remove old modal CSS
3. Update documentation

---

## Phase 4: Testing Checklist

### Functionality Tests
- [ ] Panel opens on trigger
- [ ] Panel closes on backdrop click
- [ ] Panel closes on X button
- [ ] Panel closes on Escape key
- [ ] Swipe down closes (mobile, only at top of scroll)
- [ ] Swipe right closes (desktop)
- [ ] Body scroll locked when open
- [ ] Panel content scrolls properly
- [ ] Form submissions work inside panel
- [ ] Animations smooth on all devices

### Visual Tests
- [ ] Gold theme consistent across all panels
- [ ] Premium glass effect renders correctly
- [ ] 3D shadow depth looks good
- [ ] Mobile layout (slide from bottom)
- [ ] Desktop layout (slide from right)
- [ ] Header stays visible on scroll
- [ ] Footer (if used) stays visible

### Browser Tests
- [ ] Chrome
- [ ] Safari (especially mobile Safari)
- [ ] Firefox
- [ ] Edge

---

## Search Patterns

To find existing modals:
```bash
# Find Modal component usage
grep -rn "Modal" --include="*.tsx" --include="*.js" packages/public-site/

# Find modal-related state
grep -rn "isOpen\|showModal\|modalOpen" --include="*.tsx" packages/public-site/

# Find fixed overlays that might be modals
grep -rn "fixed.*z-\[" --include="*.tsx" packages/public-site/

# Find backdrop patterns
grep -rn "backdrop\|overlay" --include="*.tsx" packages/public-site/
```

---

## Notes

- The Agent Portal already has working slide panels - use as reference
- Agent Attraction page (`[slug].js`) requires special handling due to inlined code
- All panels should have the same gold theme for consistency
- Consider adding to Master Controller's component library for future editing

---

## Files Reference

**Agent Portal slide panels:** `/packages/public-site/app/agent-portal/page.tsx`
- CSS: Lines ~620-700 (help panel styles)
- Animations: Lines ~610-620
- Swipe handlers: Lines ~962-1006
- Example panel: Lines ~3460-3540 (LinkPage help modal)

**Agent Attraction Template:** `/packages/public-site/functions/[slug].js`
- All code inlined in single file
- HTML template is a string literal
- Any modals here need inline CSS/JS

---

## Timeline Estimate

- Phase 1 (Component): 1-2 hours
- Phase 2 (Audit): 30 minutes
- Phase 3 (Migration): 2-4 hours (depending on modal count)
- Phase 4 (Testing): 1 hour

**Total: ~5-8 hours**

---

## Progress Tracking

| Task | Status | Notes |
|------|--------|-------|
| Create SlidePanel component | ✅ Complete | `/components/shared/SlidePanel.tsx` + `/packages/shared/components/saa/interactive/SlidePanel.tsx` |
| Audit main site modals | ✅ Complete | Found 4 pages with modals (8 modal instances) |
| Audit [slug].js modals | ✅ Complete | Found 4 modals (2 form + 2 iframe) |
| Replace main site modals | 🔄 In Progress | 3/8 converted (JoinModal, InstructionsModal, FreebieDownloadModal) |
| Replace [slug].js modals | ⬜ Pending | 4 modals to inline |
| Body scroll lock + hide scrollbar | ✅ Complete | CSS hides scrollbar completely (Firefox, Chrome, Safari, Edge) |
| Testing | ⬜ Pending | |
| Cleanup | ⬜ Pending | |

---

## Audit Results (Complete)

### Main Website Modals Found

#### 1. `/app/join-exp-sponsor-team/page.tsx`
- **JoinModal** - Lead capture form (name, email, phone, license info)
- **InstructionsModal** - Step-by-step joining instructions after form submit

#### 2. `/app/freebies/page.tsx`
- **FreebieDownloadModal** - Email capture for freebie downloads

#### 3. `/app/exp-realty-revenue-share-calculator/page.tsx`
- **InfoModal** - Local component for info/help popups

#### 4. `/app/agent-portal/login/page.tsx`
- **Modal** (3 instances):
  - Password reset modal
  - Username recovery modal
  - New password modal

### Agent Attraction Template Modals (`[slug].js`)

**Location:** Lines 2064-2267 (CSS) and 4138-4266 (HTML)

#### 1. `join-modal` (Line 4138)
- **Type:** Form popup
- **Purpose:** Lead capture with first name, last name, email, country
- **CSS Class:** `.modal-container`, `.modal`

#### 2. `instructions-modal` (Line 4181)
- **Type:** Instruction popup
- **Purpose:** 5-step joining instructions shown after form submit
- **CSS Class:** `.modal-container`, `.instructions-modal`

#### 3. `calculator-modal` (Line 4237)
- **Type:** Tool modal (iframe)
- **Purpose:** Commission calculator embed
- **CSS Class:** `.modal-container`, `.tool-modal`
- **Special:** Contains iframe with loading spinner

#### 4. `revshare-modal` (Line 4253)
- **Type:** Tool modal (iframe)
- **Purpose:** Revenue share visualizer embed
- **CSS Class:** `.modal-container`, `.tool-modal`
- **Special:** Contains iframe with loading spinner

### [slug].js Modal CSS Structure (Lines 2065-2209)

```css
/* Current Modal Pattern */
.modal-container {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: none; /* show with .open class */
  align-items: center;
  justify-content: center;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
}

.modal {
  background: #151517;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  max-height: 90vh;
  overflow-y: auto;
}

.tool-modal {
  border: 1px solid rgba(255,215,0,0.3);
  box-shadow: 0 0 30px rgba(255,215,0,0.2);
}
```

### Migration Priority

**High Priority (User-facing forms):**
1. join-exp-sponsor-team modals
2. [slug].js join-modal
3. freebies modal

**Medium Priority (Info/Instructions):**
4. [slug].js instructions-modal
5. exp-realty-revenue-share-calculator info modal

**Lower Priority (Auth flows):**
6. agent-portal/login modals (3)

**Special Handling (iframes):**
7. [slug].js calculator-modal
8. [slug].js revshare-modal
