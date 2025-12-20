# Agent Portal Fixes - Implementation Checklist

## Priority 1: Bug Fixes

### 1.1 Phone Number Not Showing in Linktree Preview
- [x] Check if `show_phone` state is being read correctly in preview
- [x] Add phone number display to the Linktree preview panel (left column)
- [x] Should show phone with "(Text Only)" suffix if `phone_text_only` is true
- **DONE** - Added phone display between social icons and buttons

### 1.0 Save Button Not Working
- [ ] Debug why save is failing
- [ ] Check browser console for errors
- [ ] Check admin dashboard logs for API errors
- [ ] Verify pageData.id is being sent correctly

### 1.2 Custom Link Icons Not Showing in Preview
- [ ] Debug why `LINK_ICONS.find(i => i.name === link.icon)?.path` returns undefined
- [ ] The icon is stored as the icon name (e.g., "Home", "Building")
- [ ] Verify LINK_ICONS constant is accessible in the preview render section
- [ ] Test with console.log to see what `link.icon` value actually is

### 1.3 Second Custom Link Not Appearing in Preview
- [ ] Verify the `customLinks.map()` is iterating correctly
- [ ] Check if state is updating properly when adding second link
- [ ] Console.log `customLinks` array after adding to verify it contains both

### 1.4 Bio Character Limit
- [x] Change max from 150 to 80 characters
- [x] Change yellow warning threshold from current value to 60 characters
- [x] Update any validation messages
- **DONE** - Updated onChange limit, display, and warning thresholds

---

## Priority 2: Image Upload Modal Redesign

### Current Flow (to keep):
1. User selects image
2. Validate dimensions (min 900x900)
3. Background removal runs automatically
4. Show crop/contrast editor

### New Two-Step Flow (after background removal):

#### Step 1: Color Version
- [ ] Display header: "Step 1: Color Version"
- [ ] Subtext: "(Used for Linktree when Color Photo is enabled)"
- [ ] Show color image (with background removed)
- [ ] Crop overlay (draggable/resizable, square aspect ratio)
- [ ] Color contrast slider (separate from B&W)
- [ ] Store color contrast value in state: `colorContrastLevel`

#### Step 2: B&W Version
- [ ] Display header: "Step 2: B&W Version"
- [ ] Subtext: "(Used for Agent Page and Linktree default)"
- [ ] Show B&W image (same image with grayscale filter)
- [ ] Crop overlay is LOCKED (greyed out, not adjustable)
- [ ] Display the same crop area but not interactive
- [ ] B&W contrast slider (separate from color)
- [ ] Store B&W contrast value in state: `bwContrastLevel`

#### Button Row (3 buttons):
```
[ Cancel ]    [ Next/Back ]    [ Upload ]
```

**Initial state (Step 1, never clicked Next):**
- Cancel: visible, enabled
- Next: visible, enabled, says "Next"
- Upload: hidden (empty space)

**After clicking Next (Step 2):**
- Cancel: visible, enabled
- Next/Back: visible, enabled, transforms to say "Back"
- Upload: fades in, visible, enabled

**After clicking Back (Step 1 again):**
- Cancel: visible, enabled
- Next/Back: transforms back to say "Next"
- Upload: stays visible, enabled (user already visited Step 2)

#### State Management:
```typescript
// New state variables needed:
const [imageEditorStep, setImageEditorStep] = useState<1 | 2>(1);
const [hasVisitedStep2, setHasVisitedStep2] = useState(false);
const [colorContrastLevel, setColorContrastLevel] = useState(100); // default 100%
const [bwContrastLevel, setBwContrastLevel] = useState(130); // default 130% (current behavior)
// cropArea state already exists, just needs to be locked in Step 2
```

#### Navigation Logic:
```typescript
const handleNextBack = () => {
  if (imageEditorStep === 1) {
    setImageEditorStep(2);
    setHasVisitedStep2(true);
  } else {
    setImageEditorStep(1);
  }
};
```

#### Upload Logic:
- Apply crop to background-removed image
- Generate color version: apply `colorContrastLevel` contrast
- Generate B&W version: apply grayscale + `bwContrastLevel` contrast
- Upload both to R2:
  - Color: `profiles/{userId}-color.{ext}`
  - B&W: `profiles/{userId}.{ext}`

---

## Implementation Order

1. **Fix bugs first** (1.1, 1.2, 1.3, 1.4) - quick wins
2. **Add state variables** for two-step flow
3. **Update modal UI** with step headers and button logic
4. **Separate contrast controls** for color vs B&W
5. **Lock crop in Step 2** (visual only, not interactive)
6. **Update upload logic** to save both versions with their respective contrast
7. **Test all upload entry points:**
   - Dashboard profile picture
   - Edit Profile modal
   - My SAA Pages tab

---

## Files to Modify

- `/home/claude-flow/packages/public-site/app/agent-portal/page.tsx`
  - Linktree preview (phone, icons, multiple links)
  - Bio character limits
  - Image editor modal (two-step flow)
  - State management for contrast levels

- `/home/claude-flow/packages/admin-dashboard/app/api/agent-pages/upload-image/route.ts`
  - May need to accept both contrast values if processing server-side
  - Currently processes client-side, so may not need changes

- `/home/claude-flow/packages/admin-dashboard/app/api/agent-pages/upload-color-image/route.ts`
  - Verify it accepts contrast-adjusted image

---

## Testing Checklist

- [ ] Add custom link with icon - icon shows in preview
- [ ] Add second custom link - both show in preview
- [ ] Enable show_phone with phone number - shows in preview
- [ ] Bio at 60 chars - turns yellow
- [ ] Bio at 80 chars - cannot type more
- [ ] Upload image from Dashboard - two-step flow works
- [ ] Upload image from Edit Profile - two-step flow works
- [ ] Upload image from My SAA Pages - two-step flow works
- [ ] Crop in Step 1, locked in Step 2
- [ ] Color contrast only affects color preview
- [ ] B&W contrast only affects B&W preview
- [ ] Both versions saved correctly
- [ ] Linktree shows color when enabled, B&W when disabled
- [ ] Agent page shows B&W version
