# Profile Image Upload Refactor Plan

## Overview
Remove all modal/editing UI. Keep automatic background processing. Spinners only.

---

## Target Flow (Super Simple)

1. User clicks profile image OR upload button (in Link Page UI)
2. Native file picker opens
3. User selects image
4. **Spinners appear on profile image placeholders**
5. **Background processing (user doesn't see):**
   - Upload original color image
   - Run background removal
   - Convert to B&W with semi-high contrast (percentile auto-levels + S-curve)
   - Save both images to same locations as before
6. Spinners stop, new images appear
7. Done!

**NO modal, NO panel, NO editing UI, NO contrast slider**

---

## What to REMOVE

- [ ] Image editor modal/popup (entire component)
- [ ] Background removal toggle/option in UI
- [ ] B&W preview step
- [ ] Contrast slider
- [ ] Any "Apply" or "Save" buttons in modal
- [ ] Step indicators (if any)

## What to KEEP

- [ ] File input trigger (clicking profile image opens file picker)
- [ ] Spinner/loading state on profile images
- [ ] Background removal logic (runs automatically)
- [ ] B&W conversion logic (runs automatically)
- [ ] Image upload to storage (same locations)
- [ ] Success/error handling

## What to ADD/MODIFY

- [ ] Auto-contrast algorithm (percentile + S-curve)
- [ ] Make all processing automatic (no user choices)
- [ ] Ensure spinners show during entire process

---

## Code Sections to Find & Modify

### 1. Find the Modal Component
Search for: image editor modal, crop modal, photo modal
**Action:** Remove entirely or gut the UI

### 2. Find Upload Handler
Location: `handleImageUpload` around line 10020
**Action:** Simplify to just trigger automatic processing

### 3. Find Background Removal Calls
Locations: ~1767, ~1871, ~10078, ~10117
**Action:** Keep but make automatic (no user toggle)

### 4. Find B&W Conversion
**Action:** Add auto-contrast, make automatic

### 5. Find Spinner/Loading States
**Action:** Ensure they show during full process

### 6. Find Where Images Save
**Action:** Don't change - keep saving to same locations

---

## Auto-Contrast Algorithm

```javascript
// Semi-high contrast B&W processing
async function processToContrastBW(imageBlob) {
  // 1. Load image into canvas
  const img = await loadImage(imageBlob);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // 2. Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // 3. Convert to grayscale and collect values
  const grayValues = [];
  for (let i = 0; i < data.length; i += 4) {
    // Luminance formula
    const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
    grayValues.push(gray);
  }

  // 4. Find 2nd and 98th percentile
  const sorted = [...grayValues].sort((a, b) => a - b);
  const low = sorted[Math.floor(sorted.length * 0.02)];
  const high = sorted[Math.floor(sorted.length * 0.98)];

  // 5. Apply levels stretch + S-curve
  let idx = 0;
  for (let i = 0; i < data.length; i += 4) {
    let gray = grayValues[idx++];

    // Stretch to full range
    gray = ((gray - low) / (high - low)) * 255;
    gray = Math.max(0, Math.min(255, gray));

    // S-curve for punch (strength ~0.3)
    gray = gray / 255;
    gray = gray < 0.5
      ? 0.5 * Math.pow(2 * gray, 1.3)
      : 1 - 0.5 * Math.pow(2 * (1 - gray), 1.3);
    gray = gray * 255;

    data[i] = data[i+1] = data[i+2] = Math.round(gray);
    // Alpha (data[i+3]) stays the same
  }

  ctx.putImageData(imageData, 0, 0);

  // 6. Return as blob
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}
```

---

## Implementation Steps

### Step 1: Find & Document Current Code
- [ ] Locate modal component
- [ ] Locate all upload-related state
- [ ] Locate where images are saved
- [ ] Understand current flow

### Step 2: Remove Modal UI
- [ ] Remove modal component/JSX
- [ ] Remove modal state variables
- [ ] Remove modal open/close handlers

### Step 3: Simplify Upload Handler
- [ ] Modify handleImageUpload to:
  - Show spinners immediately
  - Run all processing automatically
  - No user interaction needed
  - Hide spinners when done

### Step 4: Implement Auto-Contrast
- [ ] Add percentile-based auto-levels
- [ ] Add S-curve for punch
- [ ] Test with varied images

### Step 5: Test
- [ ] Upload bright image
- [ ] Upload dark image
- [ ] Upload low-contrast image
- [ ] Verify both color & B&W save correctly
- [ ] Verify spinners work properly

---

## Progress Tracker

- [x] Plan written
- [x] Step 1: Find & document current code
- [x] Step 2: Remove modal UI
- [x] Step 3: Simplify upload handler
- [x] Step 4: Implement auto-contrast
- [ ] Step 5: Test

---

## Research Findings (Step 1 Complete)

### State Variables (around lines 927-946)
```javascript
const [showImageEditor, setShowImageEditor] = useState(false);        // line 927 - REMOVE
const [pendingImageFile, setPendingImageFile] = useState(null);       // line 928 - KEEP
const [pendingImageUrl, setPendingImageUrl] = useState(null);         // line 929 - REMOVE
const [pendingBgRemovedUrl, setPendingBgRemovedUrl] = useState(null); // line 932 - REMOVE
const [isRemovingBackground, setIsRemovingBackground] = useState(false); // line 933 - REMOVE
const [imageEditorRef] = useRef();                                    // line 938 - REMOVE
const [imageEditorStep, setImageEditorStep] = useState(1);            // line 943 - REMOVE
const [colorContrastLevel, setColorContrastLevel] = useState(100);    // line 945 - REMOVE (will use auto)
const [bwContrastLevel, setBwContrastLevel] = useState(130);          // line 946 - REMOVE (will use auto)
```

### Modal UI: Lines 4932-5213
- REMOVE ENTIRE BLOCK

### Key Functions
1. `handleConfirmImageEdit` (line 1833-2017) - THE SAVE FUNCTION
   - This is what we need to call directly (simplified)
   - Currently does: crop → bg removal → B&W filter → color filter → uploads

2. `handleCancelImageEdit` (line 2019-2032)
   - REMOVE (no modal = no cancel)

3. Upload flow (handleConfirmImageEdit):
   - Line 1867: Crop image (using cropArea state)
   - Line 1871-1880: Remove background
   - Line 1884: Apply B&W contrast filter
   - Line 1888: Apply color contrast filter
   - Line 1896-1915: Upload to profile-picture API
   - Line 1919-1968: Upload B&W to agent-pages
   - Line 1970-1997: Upload COLOR to agent-pages/upload-color-image

### Spinner States (Already Exist)
- `isUploadingDashboardImage` - set true during upload
- `setStatus()` - shows progress text

### Where Images Are Saved
1. `/api/users/profile-picture` - B&W version (line 1896)
2. `/api/agent-pages/upload-image` - B&W version for agent page (line 1951)
3. `/api/agent-pages/upload-color-image` - COLOR version (line 1976)

---

## Detailed Implementation Plan

### Step 2: Remove Modal UI
1. Delete lines 4932-5213 (modal JSX)
2. Remove state variables:
   - `showImageEditor`
   - `pendingImageUrl`
   - `pendingBgRemovedUrl`
   - `isRemovingBackground`
   - `imageEditorRef`
   - `imageEditorStep`
   - `hasVisitedStep2`
   - `colorContrastLevel`
   - `bwContrastLevel`
   - `cropArea` (will use default center crop)
   - `minCropSizePercent`
3. Remove `handleCancelImageEdit` function
4. Remove `isAnyPopupOpen` check for `showImageEditor`

### Step 3: Simplify Upload Handler
Modify `handleImageUpload` to:
1. Accept file
2. Set spinner state immediately
3. Call simplified processing function directly (no modal)

Create new `processAndUploadImage(file)` function that:
1. Show spinner
2. Default crop (center, 80% of image)
3. Remove background
4. Apply AUTO B&W contrast (percentile + S-curve)
5. Apply light color contrast (auto)
6. Upload all three versions
7. Hide spinner
8. Update UI

### Step 4: Auto-Contrast Function
Replace manual slider with automatic contrast:
```javascript
async function applyAutoContrastBW(blob) {
  // 1. Load to canvas
  // 2. Convert to grayscale
  // 3. Calculate 2nd/98th percentile
  // 4. Stretch levels
  // 5. Apply S-curve
  // 6. Return blob
}
```

---

## Files Summary

**Main file:** `/packages/public-site/app/agent-portal/page.tsx`

**Lines to DELETE:**
- 4932-5213 (modal)
- Parts of 927-946 (state)
- 2019-2032 (handleCancelImageEdit)

**Lines to MODIFY:**
- 1833-2017 (handleConfirmImageEdit → processAndUploadImage)
- handleImageUpload functions (~1700s and ~10020s)

**Lines to ADD:**
- Auto-contrast function

---

## Notes

_Step 1 research complete. Ready for Step 2._

