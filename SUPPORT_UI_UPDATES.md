# Support UI Updates

**Created:** 2026-01-25
**Status:** Completed

---

## REQUIREMENTS

### 1. Multi-Colored Pixel Question Button
- Use 4 colors from support cards
- Create gradient at 35 degree angle
- Add to Support UI section

### 2. Support Modal Popup - Use Cases (Keep Concise!)

| Support Option | Use Cases |
|----------------|-----------|
| **eXp Support** | Tech questions, eXp services, finding specific eXp tools |
| **Broker Support** | Agent production questions |
| **SAA Support** | SAA asset questions, SAA tech issues |
| **Text Doug** | Critical tech/bug issues in Agent Portal (SAA asset) |
| **Wolf Pack** | Skool, Social Agent Academy, Agent Attraction, AI Agent Accelerator, Investor Army |
| - Investor Army | Contact Connor |
| - All others | Contact Mike support |

### 3. New Support Card - My eXp App
- Place below existing support cards
- Span all columns
- Link to My eXp app (main hub)
- Features: Production stats, Revenue share stats, Skyline, Contact info, eXp Events Calendar, eXp Tools, Agent Resources

---

## IMPLEMENTATION DETAILS

### Support Card Colors (35deg gradient)
1. Blue (#3b82f6) - eXp Support
2. Purple (#a855f7) - State Broker
3. Gold (#ffd700) - SAA Support
4. Green (#22c55e) - Wolf Pack Support

### SAA Assets (From Agent Portal)
- Agent Portal itself
- Link Page
- Agent Attraction Page
- Templates (Canva)
- Team Calls
- New Agent Resources

### Wolf Pack Assets
- Skool Community
- Social Agent Academy (SAA 2.0)
- Master Agent Attraction course
- AI Agent Accelerator course
- Investor Army (Connor Steinbrook)

### Broker Use Cases
- Contract questions
- Commission splits
- Transaction issues
- Compliance questions

---

## COMPLETED CHANGES

### 1. Gradient PixelHelpButton (CSS)
**File:** `/packages/public-site/app/agent-portal/page.tsx`
- Added 'gradient' to PixelHelpButtonColor type
- Added CSS for `.pixel-help-gradient` with 35deg gradient using all 4 colors
- Applied gradient to all shared CSS selectors

### 2. Support Help Button
**File:** `/packages/public-site/app/agent-portal/page.tsx`
- Added `<PixelHelpButton color="gradient">` when `activeSection === 'support'`

### 3. Support Help Modal
**File:** `/packages/public-site/app/agent-portal/page.tsx`
- Created modal with multi-colored gradient header (35deg)
- Added concise use case sections:
  - eXp Support (blue): Tech issues with eXp tools, eXp services, resources
  - State Broker (purple): Production questions - contracts, commissions, compliance
  - SAA Support (gold): SAA assets, SAA tech issues
  - Text Doug (gold variant, indented): Critical bugs in Agent Portal only
  - Wolf Pack (green): Courses with Mike (Skool, SAA 2.0, Agent Attraction, AI Accelerator) and Connor (Investor Army)

### 4. My eXp App Card
**File:** `/packages/public-site/app/agent-portal/page.tsx`
- Added full-width card below support grid in SupportSection
- Blue accent color matching eXp Support card
- Features grid: Production Stats, Revenue Share, Skyline, Contact Info, eXp Events, eXp Tools
- Download CTA button linking to: https://myexp.page.link/exp

---

## PROGRESS

- [x] Find support card colors
- [x] Create gradient pixel button CSS
- [x] Add gradient button to Support section
- [x] Create support modal content
- [x] Add My eXp App card
- [ ] Test and verify

