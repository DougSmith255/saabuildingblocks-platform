# Mobile Menu Scrollbar Technical Specification

## Problem Statement

The mobile navigation menu currently exhibits incorrect scrolling behavior where **BOTH the page background AND the menu content scroll simultaneously** when the user interacts with the menu. The intended behavior is for the menu to have its own independent scrollbar that controls ONLY the menu content while the underlying page remains completely locked and stationary.

### Specific Issues:
1. **Background page scrolling**: When the mobile menu is open and the user scrolls, the page behind the menu also moves/scrolls
2. **Inconsistent scroll locking**: The `document.body.style.overflow = 'hidden'` approach is not fully preventing background scroll on all mobile devices
3. **Lenis interference**: The Lenis smooth scroll library continues running on the background page even when the menu is open
4. **Touch event propagation**: Touch events on the mobile menu may be propagating to the underlying page content
5. **Safari mobile quirks**: iOS Safari has known issues with fixed positioning and scroll locking

---

## Current Implementation

### Technology Stack
- **Framework**: Next.js 16 with Turbopack
- **Build Mode**: Static export (`output: 'export'`) for Cloudflare Pages deployment
- **React Version**: 19.2.0
- **Smooth Scroll**: Lenis v1.3.15 (on main page)
- **Custom Scrollbar**: OverlayScrollbars v2.12.0 + overlayscrollbars-react v0.5.6
- **Browser Targets**: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

### File Structure
```
/home/claude-flow/packages/public-site/
├── components/
│   ├── shared/
│   │   └── Header.tsx                    # Main header and mobile menu component
│   └── SmoothScroll.tsx                  # Lenis smooth scroll initialization
├── app/
│   ├── layout.tsx                        # Root layout with SmoothScroll
│   └── globals.css                       # Global styles with overflow rules
└── package.json                          # Dependencies
```

### Current Mobile Menu Architecture

#### 1. **Header Component** (`/home/claude-flow/packages/public-site/components/shared/Header.tsx`)

**State Management:**
```typescript
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [openDropdown, setOpenDropdown] = useState<number | null>(null);
```

**Scroll Lock Implementation (Lines 148-165):**
```typescript
useEffect(() => {
  if (isMobileMenuOpen) {
    // Scroll to top so menu is visible
    window.scrollTo(0, 0);

    // Prevent body from scrolling
    document.body.style.overflow = 'hidden';
  } else {
    // Restore body scroll
    document.body.style.overflow = '';
  }

  // Cleanup on unmount
  return () => {
    document.body.style.overflow = '';
  };
}, [isMobileMenuOpen]);
```

**Mobile Menu DOM Structure (Lines 472-611):**
```tsx
<div
  id="mobile-menu"
  role="dialog"
  aria-label="Mobile navigation menu"
  className={`mobile-menu-overlay fixed top-0 left-0 right-0 bottom-0 z-[9990] ${
    isMobileMenuOpen ? 'menu-opening' : 'menu-closing'
  }`}
  style={{
    background: 'rgb(15, 15, 15)',
    pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
    display: isMobileMenuOpen ? undefined : 'none',
  }}
>
  <OverlayScrollbarsComponent
    options={{
      scrollbars: {
        autoHide: 'never',
        theme: 'os-theme-dark'
      }
    }}
    style={{ height: '100%', width: '100%' }}
  >
    <div
      className="mobile-menu-content pt-24 pb-32 min-h-screen"
      style={{
        animation: 'fadeIn 0.3s ease-out 0.1s both',
      }}
    >
      <nav className="px-6 space-y-2" role="navigation" aria-label="Mobile navigation">
        {/* Navigation items with dropdowns */}
      </nav>
    </div>
  </OverlayScrollbarsComponent>
</div>
```

**CSS Properties:**
- Menu overlay uses `fixed` positioning
- Full viewport coverage: `top-0 left-0 right-0 bottom-0`
- Z-index: `9990` (below hamburger at `10030`, below header at `10010`)
- Solid background: `rgb(15, 15, 15)`
- OverlayScrollbars handles internal scrolling

#### 2. **Lenis Smooth Scroll** (`/home/claude-flow/packages/public-site/components/SmoothScroll.tsx`)

**Configuration:**
```typescript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
});
```

**Lifecycle:**
- Initialized on mount (runs continuously via `requestAnimationFrame`)
- **Issue**: No mechanism to pause/stop Lenis when mobile menu opens
- Continues processing scroll events on background page

#### 3. **Global CSS** (`/home/claude-flow/packages/public-site/app/globals.css`)

**Overflow Control:**
```css
html {
  scroll-behavior: smooth;
  overflow-x: hidden;
  max-width: 100%;
}

body {
  overflow-x: hidden;
  max-width: 100%;
}
```

**Notes:**
- `overflow-x: hidden` on both `html` and `body`
- `overflow-y` is NOT explicitly set (defaults to `visible`)
- Mobile menu's `document.body.style.overflow = 'hidden'` attempts to override this

#### 4. **Navigation Items with Dropdowns**

The mobile menu contains expandable dropdown sections (e.g., "Our Team", "Resources"):
```typescript
const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About eXp', href: '/about-exp-realty/' },
  {
    label: 'Our Team',
    dropdown: [
      { label: 'Team Value', href: '/exp-realty-sponsor/' },
      { label: 'About Us', href: '/our-exp-team/' },
    ],
  },
  {
    label: 'Resources',
    dropdown: [
      { label: 'Commission & Fees Calc', href: '/agent-tools/exp-commission-and-fees-calculator/' },
      { label: 'RevShare Calc', href: '/agent-tools/exp-realty-revenue-share-calculator/' },
      // ... 4 more items
    ],
  },
  { label: 'Agent Portal', href: '/agent-portal' },
];
```

**Dropdown Toggle Animation:**
```css
.mobile-dropdown {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.dropdown-open {
  max-height: 500px;
  opacity: 1;
}

.dropdown-closed {
  max-height: 0;
  opacity: 0;
}
```

---

## Expected Behavior

### User Interaction Flow:

1. **Menu Opens** (User taps hamburger icon):
   - Mobile menu slides down from top (`slideDown` animation, 0.4s)
   - Menu covers ENTIRE viewport (100vw × 100vh)
   - Background page becomes completely invisible behind solid dark background
   - **Background page scroll is LOCKED** - no scrolling possible
   - Menu displays its own scrollbar (via OverlayScrollbars)

2. **User Scrolls Within Menu**:
   - ONLY the menu content scrolls (navigation items, dropdowns, CTA button)
   - Background page remains completely stationary
   - Scroll position of background page is preserved
   - OverlayScrollbars handles smooth scrolling within menu

3. **User Expands Dropdown** (e.g., "Resources" with 6 sub-items):
   - Dropdown smoothly expands (0.3s animation)
   - Menu scrollbar adjusts to new content height
   - Background page still completely locked
   - User can scroll to see all expanded items

4. **Menu Closes** (User taps X icon):
   - Mobile menu slides up (`slideUp` animation, 0.4s)
   - Background page becomes visible again
   - **Background page scroll is RESTORED** to original position
   - Lenis smooth scroll resumes on main page

### Visual Separation:
```
┌─────────────────────────────────────┐
│  MOBILE MENU (z-index: 9990)       │
│  ┌─────────────────────────────┐   │
│  │ [X] Close Button            │   │ ← Hamburger (z-index: 10030)
│  │                             │   │
│  │ ▼ Home                      │   │
│  │ ▼ About eXp                 │   │
│  │ ▶ Our Team                  │   │
│  │ ▼ Resources                 │   │ ← Menu scrolls here
│  │   • Commission Calc         │   │
│  │   • RevShare Calc           │   │
│  │   • Compare Brokerages      │   │
│  │   • Agent Success Hub       │   │
│  │   • Agent Freebies          │   │
│  │   • Become an Agent         │   │
│  │ ▼ Agent Portal              │   │
│  │                             │   │
│  │ [GET STARTED] CTA           │   │
│  │                             │   │
│  └──────────────[SCROLLBAR]────┘   │ ← OverlayScrollbars
│                                     │
│  BACKGROUND PAGE (LOCKED)           │
│  No scrolling, completely static    │
└─────────────────────────────────────┘
```

---

## Technical Requirements

### 1. **Cross-Browser Compatibility**

#### Chrome/Edge (Chromium 111+)
- Full support for `position: fixed` and `overflow: hidden`
- Lenis smooth scroll works natively
- OverlayScrollbars renders correctly

#### Firefox (111+)
- Similar to Chrome, good standards compliance
- May require `-moz-` prefixes for some CSS properties
- Test scrollbar customization

#### Safari (16.4+ on iOS and macOS)
- **Critical Issue**: iOS Safari has known bugs with `position: fixed` and body scroll locking
- Requires additional techniques:
  - `position: fixed` on `<body>` with top offset
  - Touch event capture/prevention
  - `-webkit-overflow-scrolling: touch` for momentum scrolling
- Elastic/rubber-band scrolling must be disabled on menu boundaries

### 2. **React/Next.js Integration**

- **Next.js Version**: 16 with Turbopack
- **React Version**: 19.2.0
- **Build Mode**: Static export (`output: 'export'`)
- Must work with client-side rendering (no SSR)
- Compatible with React 19's new hooks and concurrent features

### 3. **Smooth Animations**

**Required Animations:**
- Menu open/close: 0.4s `cubic-bezier(0.4, 0, 0.2, 1)`
- Dropdown expand/collapse: 0.3s `ease-in-out`
- Content fade-in: 0.3s with 0.1s delay
- No jank or lag during scroll (60fps minimum)

**Performance Targets:**
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1
- No reflows during menu open/close

### 4. **Dropdown Menu Handling**

- Expandable sections must work within scrollable menu
- Smooth height transitions without breaking scroll position
- Touch targets must be at least 48×48px (WCAG 2.1)
- Keyboard navigation support (Tab, Enter, Escape)

### 5. **Scroll Lock Implementation**

Must prevent ALL background scrolling methods:
- Mouse wheel scrolling
- Trackpad scrolling
- Touch/swipe gestures
- Keyboard scrolling (Space, Page Down, Arrow keys)
- Programmatic scrolling (`window.scrollTo()`, `element.scrollIntoView()`)

### 6. **Accessibility (WCAG 2.1 AA)**

- `role="dialog"` on mobile menu overlay
- `aria-label="Mobile navigation menu"`
- `aria-expanded` on hamburger button
- `aria-controls="mobile-menu"`
- Focus trap within menu when open
- Escape key closes menu
- Screen reader announces menu state changes

---

## Additional Context

### Current Dependencies (from `/home/claude-flow/packages/public-site/package.json`)

```json
{
  "dependencies": {
    "lenis": "^1.3.15",                    // Smooth scroll library
    "overlayscrollbars": "^2.12.0",        // Custom scrollbar library
    "overlayscrollbars-react": "^0.5.6",   // React wrapper
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "next": "^16.0.0"
  }
}
```

### Known Constraints

1. **Static Build**: Site uses `output: 'export'` - no server-side runtime
2. **Cloudflare Pages**: Deployed to Cloudflare Pages CDN
3. **No Dynamic Routes**: All pages are pre-generated at build time
4. **Client-Side Only**: All interactivity must work purely in browser

### Lenis Integration Points

Lenis is initialized globally in:
- **File**: `/home/claude-flow/packages/public-site/components/SmoothScroll.tsx`
- **Imported by**: `/home/claude-flow/packages/public-site/app/layout.tsx` (line 231)
- **Lifecycle**: Runs continuously via `requestAnimationFrame` loop
- **Issue**: No built-in pause/stop mechanism for modal overlays

### OverlayScrollbars Configuration

Current setup (Header.tsx, lines 486-493):
```tsx
<OverlayScrollbarsComponent
  options={{
    scrollbars: {
      autoHide: 'never',
      theme: 'os-theme-dark'
    }
  }}
  style={{ height: '100%', width: '100%' }}
>
```

**Theme**: `os-theme-dark` (dark scrollbar)
**Auto-hide**: Disabled (always visible)
**Size**: 100% width and height of container

### Z-Index Hierarchy

```
10030 - Hamburger button (always visible, fixed)
10010 - Header (slides up when hidden)
 9990 - Mobile menu overlay (when open)
    1 - Normal page content
```

---

## Research Prompt for ChatGPT

**Subject**: React/Next.js 16 Mobile Menu with Independent Scrollbar and Complete Background Scroll Lock

**Context**: Building a mobile navigation menu for a Next.js 16 static site with the following tech stack:
- Next.js 16 with Turbopack (static export)
- React 19.2.0
- Lenis 1.3.15 (smooth scroll on main page)
- OverlayScrollbars 2.12.0 (custom scrollbar in menu)
- Target browsers: Chrome 111+, Firefox 111+, Safari 16.4+, Edge 111+

**Current Problem**:
The mobile menu and background page scroll simultaneously. When the menu is open, users can still scroll the page behind it. The menu should have its own independent scrollbar that ONLY controls menu content while the background page remains completely locked.

**Current Implementation**:
1. Mobile menu is a fixed overlay (`position: fixed; top: 0; left: 0; right: 0; bottom: 0`)
2. Scroll lock uses `document.body.style.overflow = 'hidden'`
3. Menu content is wrapped in `<OverlayScrollbarsComponent>` for custom scrollbar
4. Lenis smooth scroll runs continuously on main page (no pause mechanism)
5. Menu contains expandable dropdown sections with 0.3s height animations

**Required Solution Must**:
1. **Completely lock background page scroll** when menu is open (including Safari iOS elastic scrolling)
2. **Stop/pause Lenis** smooth scroll when menu opens, resume when menu closes
3. **Provide independent scrollbar** for menu content only (using OverlayScrollbars or alternative)
4. **Handle touch events** correctly (prevent propagation to background)
5. **Work in Safari iOS** (address position: fixed and scroll locking bugs)
6. **Maintain smooth animations** (60fps) during menu open/close and dropdown expand/collapse
7. **Support keyboard navigation** (Tab, Enter, Escape) with focus trapping
8. **Preserve scroll position** of background page when menu closes
9. **Be accessible** (WCAG 2.1 AA: proper ARIA attributes, focus management)
10. **Work with static export** (no server-side code, client-side only)

**Specific Questions**:

1. **Scroll Lock Strategy**: What is the most robust cross-browser method to completely prevent background scrolling? Consider:
   - `overflow: hidden` on body vs html vs both
   - `position: fixed` on body with top offset technique
   - CSS `overscroll-behavior: none`
   - JavaScript touch event prevention
   - Safari iOS specific solutions (prevent elastic bounce)

2. **Lenis Integration**: How to properly pause/stop Lenis when menu opens?
   - Does Lenis have a built-in `.stop()` or `.pause()` method?
   - Should we use `lenis.destroy()` and reinitialize on close?
   - Alternative: Remove event listeners temporarily?

3. **OverlayScrollbars Best Practices**:
   - Correct configuration for independent scrolling within fixed overlay
   - How to prevent scroll events from bubbling to parent elements
   - Alternative libraries if OverlayScrollbars isn't ideal for this use case

4. **Touch Event Handling**:
   - Should we use `touch-action: none` on background elements?
   - Do we need to capture and preventDefault on touchstart/touchmove?
   - How to allow scrolling ONLY within menu content area?

5. **Focus Management**:
   - Best practice for focus trap implementation in React 19
   - Should we use a library like `react-focus-lock` or `focus-trap-react`?
   - How to handle focus restoration when menu closes?

6. **Safari iOS Specific**:
   - Complete solution for elastic scrolling prevention
   - Handling of viewport height changes (address bar show/hide)
   - Testing strategy for iOS Safari quirks

7. **Performance Optimization**:
   - Avoiding layout thrashing when toggling scroll lock
   - GPU acceleration for animations (`will-change`, `transform: translateZ(0)`)
   - Preventing reflows during dropdown expansions

**Code Structure Preferences**:
- Modern React patterns (hooks, not class components)
- TypeScript compatibility
- Minimal external dependencies (prefer native solutions)
- Accessible by default (semantic HTML, ARIA attributes)
- Commented code explaining WHY, not just WHAT

**Success Criteria**:
- Background page is completely frozen when menu is open (no visible or hidden scrolling)
- Menu scrollbar controls ONLY menu content
- Smooth 60fps animations with no jank
- Works identically across Chrome, Firefox, Safari (iOS and macOS), and Edge
- Passes WCAG 2.1 AA accessibility audit
- No console errors or warnings
- Maintainable, well-documented code

**Please provide**:
1. Complete, production-ready code solution with explanations
2. Browser-specific gotchas and how your solution addresses them
3. Testing recommendations for each browser/device
4. Performance optimization techniques applied
5. Accessibility considerations implemented
6. Alternative approaches considered and why you chose this solution

---

**Additional Files for Reference**:

Current implementation can be found in:
- **Header Component**: `/home/claude-flow/packages/public-site/components/shared/Header.tsx`
- **Lenis Integration**: `/home/claude-flow/packages/public-site/components/SmoothScroll.tsx`
- **Root Layout**: `/home/claude-flow/packages/public-site/app/layout.tsx`
- **Global Styles**: `/home/claude-flow/packages/public-site/app/globals.css`

Thank you for your thorough analysis and solution!
