# Link Page Medium Screen Layout Requirements

## Overview
Reconfigure the Link Page for screens below 1650px wide with a 2-column tabbed interface.

---

## AFTER LINK PAGE REFACTOR - Mobile Menu Tasks

### 1. 3D Edge Effect
- REMOVE current 3D edge effect from mobile menu bar
- Apply the SAME edge effect that's on the main website header
- Effect should NOT go down the sides - just the top like the main header

### 2. Burger Menu Animation Delays
- 0.2s delay when OPENING the menu (burger clicked to open)
- 0.2s delay when CLOSING the menu

---

## Layout Structure

### Left Column (Tabbed Interface)
- **Width**: Fill remaining space (flexible)
- **Contains**: 3-tab pill selector + content based on selected tab

### Right Column (Preview)
- **Width**: Keep current fixed width (340px)
- **Contains**: Preview/Button Links section - DO NOT CHANGE THIS AT ALL

## Tab Selector Requirements

### Styling
- Copy the EXACT same pill selector styling used in the Style section
- Use Taskor font for the tab titles

### Three Tabs
1. **"Profile & Contact"** - When selected, shows Profile section + Contact section below
2. **"Style"** - When selected, shows Style section
3. **"Socials & Actions"** - When selected, shows Social Links section + Page Actions section below

## CRITICAL RULES

### DO NOT RECREATE ANYTHING
- The ONLY new thing to build is the pill tab selector above the left column
- All sections (Profile, Contact, Style, Social Links, Page Actions) already exist
- Just MOVE/REFERENCE the existing sections based on tab selection
- DO NOT rebuild or duplicate any section content

### Section Widths
- Allow sections inside each tab to expand to full column width
- Remove any fixed widths that might constrain them

### Preserve Existing Code
- Keep all existing section JSX exactly as-is
- Only wrap them in conditional rendering based on selected tab
- The desktop layout (>=1650px) should remain unchanged

## Implementation Approach

1. Add state for medium screen tab selection (e.g., `mediumScreenTab`)
2. Create the 2-column grid layout for screens < 1650px
3. Build ONLY the pill selector UI (copy styling from Style section's pill selectors)
4. Conditionally render existing sections based on selected tab
5. Right column shows Preview/Button Links section unchanged

## File Location
`/home/ubuntu/saabuildingblocks-platform/packages/public-site/app/agent-portal/page.tsx`

## Reference: Existing Pill Selector Styling (from Style section)
Look for the Background/Accent color pill selector around line 11160 for the exact styling to copy.
