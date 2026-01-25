# Safari Left Padding/Margin Issue - Troubleshooting

**Created:** 2026-01-25
**Status:** IN PROGRESS
**Browser:** Safari (macOS and iOS)
**Issue:** Entire website appears pushed inward from the left side by ~10-15px on Safari only

---

## Problem Description

On Safari browsers specifically, there is extra space/padding on the LEFT side of the viewport that pushes the entire website content inward. This does NOT occur on Chrome, Firefox, or other browsers.

**Affected:** All pages on the site
**Amount:** Approximately 10-15 pixels (possibly percentage-based)

---

## Attempted Fixes

### Attempt 1: CSS @supports Safari Override (2026-01-25)
**File:** `packages/public-site/app/globals.css`
**Lines:** ~50-76

```css
@supports (-webkit-touch-callout: none) {
  html, body {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    scrollbar-gutter: auto !important;
    box-sizing: border-box !important;
  }
  html {
    position: relative;
    left: 0 !important;
    right: 0 !important;
  }
  body {
    position: relative;
    left: 0 !important;
  }
}
```

**Result:** ❌ Did not fix the issue

---

### Attempt 2: Simplified approach - direct margin/padding reset (2026-01-25)
**File:** `packages/public-site/app/globals.css`
**Lines:** ~37-55

Removed the @supports block and added simpler resets directly to html/body:

```css
html {
  overflow-x: hidden;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

body {
  overflow-x: hidden;
  max-width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  left: 0;
  right: 0;
}
```

**Result:** ⏳ Pending deployment and testing

---

## Potential Causes to Investigate

### 1. Scrollbar Width Calculation
Safari may calculate `100vw` differently, including scrollbar width which causes overflow and compensation.

**Check for:**
- Any element using `width: 100vw` (found in agent-portal loading screen - already fixed)
- Container elements that might overflow

### 2. Safe Area Insets
Safari on devices with notches uses `env(safe-area-inset-*)` which could add padding.

**Check for:**
- Any CSS using `env(safe-area-inset-left)`
- PWA meta tags that might affect viewport

### 3. Viewport Meta Tag
The viewport meta tag configuration might affect Safari differently.

**Current viewport:** (check in layout.tsx or _document)

### 4. Position Fixed Elements
Elements with `position: fixed` and `left: 0` might render differently.

**Check:**
- StarBackgroundCanvas (uses position: fixed)
- Header component
- Any other fixed overlays

### 5. Overflow-x Hidden Interaction
Safari handles `overflow-x: hidden` on html/body differently than other browsers.

**Current state:**
- `html { overflow-x: hidden; }`
- `body { overflow-x: hidden; }`

### 6. Body/HTML Background
Safari might render background differently causing visual offset.

---

## Debugging Steps

### Step 1: Identify the exact offset
- [ ] Use Safari dev tools to measure exact pixel offset
- [ ] Check if offset is consistent across all pages
- [ ] Check if offset changes at different viewport widths

### Step 2: Isolate the cause
- [ ] Temporarily remove StarBackgroundCanvas - does issue persist?
- [ ] Temporarily remove Header - does issue persist?
- [ ] Check if issue exists on a minimal page (just body content)

### Step 3: Check computed styles
- [ ] In Safari dev tools, check computed styles on `html` element
- [ ] Check computed styles on `body` element
- [ ] Look for any unexpected margin/padding values

### Step 4: Test specific fixes
- [ ] Try removing `overflow-x: hidden` from html/body
- [ ] Try setting explicit `margin: 0; padding: 0;` inline on body in layout.tsx
- [ ] Try adding `-webkit-` prefixed properties

---

## Files to Check

1. **`app/layout.tsx`** - Root layout, body styles
2. **`app/globals.css`** - Global CSS including Safari overrides
3. **`app/styles/critical.css`** - Critical CSS loaded first
4. **`components/shared/StarBackgroundCanvas.tsx`** - Fixed position background
5. **`components/shared/Header.tsx`** - Fixed position header

---

## Safari-Specific CSS Properties to Consider

```css
/* Potential fixes to try */
-webkit-overflow-scrolling: touch;
-webkit-transform: translateZ(0);
-webkit-backface-visibility: hidden;

/* Remove scrollbar influence */
scrollbar-width: none;
-webkit-scrollbar { display: none; }

/* Force layout */
transform: translate3d(0,0,0);
```

---

## Notes

- Issue was reported after multiple Safari-specific fixes were deployed
- May be a regression from one of the Safari fixes
- Could be related to the `@supports (-webkit-touch-callout: none)` block

---

## Resolution

**Status:** Pending further investigation

**Next steps:**
1. User to provide Safari dev tools screenshot showing computed styles on html/body
2. Test removing the Safari @supports block to see if that's causing it
3. Systematically test each potential cause listed above
