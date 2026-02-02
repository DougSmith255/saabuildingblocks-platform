# Mobile Link Page UI — Fix List

## Issue 1: Preview panel should use the EXISTING mobile menu panel, not a separate portal

**Problem:** A second fixed-bottom panel was created via `createPortal`. This is wrong — the preview should live inside the existing mobile bottom bar panel that already exists (lines ~2798-3008 in the parent component). When the user taps the hamburger, the panel transitions to the menu (same transition as page switches). When the user taps any link page UI element, it transitions back to the preview.

**Fix:**
- Remove the entire `createPortal` mobile preview panel from `AgentPagesSection`
- Instead, integrate the preview content into the existing mobile bottom bar in the parent `AgentPortal` component
- When `activeSection === 'linktree'`, the mobile bottom bar shows the preview panel content (profile image, social icons, contact row, or full phone mockup for buttons tab)
- Hamburger toggles between preview and the normal mobile menu (same transition/animation as existing page transitions)
- Tapping any Link Page UI item (tab, card element) switches the panel back to preview mode
- This keeps one seamless panel experience, not two separate ones

## Issue 2: Tab bar needs to work on ultra-small laptops (no drag-to-scroll assumption)

**Problem:** Pill bar assumes touch drag scrolling. Ultra-small laptops (trackpad users) can't easily drag-scroll a horizontal pill bar. Need a different approach to conserve horizontal space.

**Options to consider:**
- Dropdown/select menu (compact, works everywhere)
- Segmented control with abbreviated labels or icons only
- Two-row grid of smaller buttons
- Collapsible accordion sections instead of tabs
- Left/right arrow buttons flanking visible tabs (carousel-style)
- Compact icon-only tabs with tooltip labels

**Decision:** TBD — need to pick an approach that works for both touch and trackpad.

## Issue 3: Buttons tab preview goes too high — should not exceed the tab bar

**Problem:** When the Buttons tab is selected, the preview/button links interface expands to `calc(100vh - 52px)`, which pushes above the tab selector bar. It should never go above the tab/settings selector area.

**Fix:**
- The preview panel height when on the Buttons tab should be constrained so the top edge sits just below the tab bar
- Use a calculation relative to the tab bar's bottom position, not viewport height minus a fixed pixel value
- Something like `calc(100vh - tabBarBottom)` or use a ref to measure the tab bar

## Issue 4: Phone mockup not visible on non-button tabs

**Problem:** The simplified `renderMobilePreviewContent()` shows a flat compact preview (profile image, name, social icons, contact buttons) but NOT the actual phone mockup frame. The user expects to see the phone mockup on all tabs, not just the Buttons tab.

**Fix:**
- Show the phone mockup on ALL tabs, not just Buttons
- For non-button tabs, render the phone mockup in read-only/non-interactive mode (no button controls, no add/edit/reorder)
- For the Buttons tab, render the full interactive phone mockup with controls
- May need a `readOnly` or `interactive` parameter on `renderPreviewButtonLinksCard` instead of completely different render functions

---

## Summary of changes needed:
1. **Remove** the `createPortal` mobile panel from `AgentPagesSection`
2. **Integrate** preview into the existing mobile bottom bar in parent `AgentPortal`
3. **Replace** horizontal pill bar with a more compact tab approach (TBD)
4. **Constrain** Buttons tab preview height to not exceed the tab bar
5. **Show phone mockup** on all tabs (not just Buttons), using bare mode read-only for non-button tabs
