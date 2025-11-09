# 🔴 PROJECT CONTEXT - READ THIS FIRST

> **For: Claude Code and all Task agents**
> **Last Updated:** 2025-11-09

---

## ⚠️ CRITICAL INSTRUCTIONS

### Before ANY Page Building Work:

1. **ALWAYS read the [📖 PAGE BUILDING GUIDE](./📖-PAGE-BUILDING-GUIDE.md)**
2. This is **NON-NEGOTIABLE** - it contains the architecture rules
3. If spawning Task agents, **instruct them to read this file AND the guide**

---

## 🎯 Core Architecture Rules

### Rule #1: Only Master Controller Components
**NEVER create components inline in pages.**

Every component MUST come from:
```tsx
import { H1, H2, Tagline, CTAButton, ... } from '@saa/shared/components/saa';
```

### Rule #2: Rarely Add New Components
Only add to Master Controller when:
- ✅ Adds significant spectacle to the website
- ✅ Absolutely necessary functionality (e.g., scrolling gallery)
- ✅ Will be reused multiple times

**Default answer to "Should I create a new component?" is NO.**

### Rule #3: Component-Level Animations
Use the `heroAnimate` prop system:
```tsx
<H1 heroAnimate animationDelay="0.6s">Headline</H1>
<Tagline heroAnimate animationDelay="0.8s">Subtext</Tagline>
<CTAButton heroAnimate animationDelay="1.0s">Click</CTAButton>
```

---

## 📂 Project Structure

```
/home/claude-flow/
├── 🔴-PROJECT-CONTEXT.md          ← YOU ARE HERE (read first)
├── 📖-PAGE-BUILDING-GUIDE.md      ← READ NEXT (mandatory)
├── DEPENDENCY_UPGRADE_CHECKLIST.md ← Check monthly
├── README.md                       ← General project info
├── packages/
│   ├── public-site/                ← Next.js public website
│   │   └── app/
│   │       ├── page.tsx            ← Homepage
│   │       └── globals.css         ← Global styles + animations
│   └── shared/
│       └── components/saa/         ← MASTER CONTROLLER (source of truth)
│           ├── headings/
│           │   ├── H1.tsx          ← Main headlines
│           │   ├── H2.tsx          ← Section headers
│           │   └── Tagline.tsx     ← Subtitles
│           ├── buttons/
│           │   ├── CTAButton.tsx   ← Primary CTAs
│           │   └── SecondaryButton.tsx
│           ├── cards/
│           │   ├── CyberCardHolographic.tsx
│           │   └── CyberCardPrismaticGlass.tsx
│           └── [other categories]/
```

---

## 🎬 Animation System (2025)

### Hybrid Approach:
1. **Component-level**: Use `heroAnimate` prop for above-the-fold
2. **Universal**: All images auto-fade via CSS (no manual work)

### Key Features:
- ✅ GPU-accelerated (transform + opacity only)
- ✅ Apple's easing curve: `cubic-bezier(0.16, 1, 0.3, 1)`
- ✅ Proper SSR/hydration timing (0.6s+ delays)
- ✅ Respects `prefers-reduced-motion`

---

## 🤖 Instructions for Task Agents

When spawning agents for page building:

```typescript
// Example instruction to agent:
{
  prompt: `
    CRITICAL: Before starting, read these files in order:
    1. /home/claude-flow/🔴-PROJECT-CONTEXT.md
    2. /home/claude-flow/📖-PAGE-BUILDING-GUIDE.md

    Task: [your task here]

    Remember: Only use Master Controller components from @saa/shared/components/saa
  `,
  model: 'haiku' // or 'sonnet' for complex tasks
}
```

---

## 📋 Quick Decision Tree

### Creating a Page?
1. Read PROJECT_CONTEXT.md (this file) ✓
2. Read PAGE_BUILDING_GUIDE.md → **[LINK](./📖-PAGE-BUILDING-GUIDE.md)**
3. Import Master Controller components
4. Apply `heroAnimate` props for entrance animations
5. Test on all breakpoints

### Need a Component?
1. Check if it exists in `/packages/shared/components/saa/`
2. Can you achieve it with props/className on existing components?
3. Is it truly necessary and reusable?
4. If YES to all → Add to Master Controller first
5. If NO → Use existing components creatively

### Updating Styles?
1. Edit the Master Controller component (not pages)
2. Changes automatically apply everywhere
3. Test in multiple contexts

---

## 🔗 Essential Links

- **[📖 PAGE BUILDING GUIDE](./📖-PAGE-BUILDING-GUIDE.md)** ← Architecture bible
- **[DEPENDENCY UPGRADE CHECKLIST](./DEPENDENCY_UPGRADE_CHECKLIST.md)** ← Monthly check
- **[README.md](./README.md)** ← Project overview

---

## 🚨 Common Mistakes to AVOID

❌ Creating components inline in pages
❌ Duplicating Master Controller component code
❌ Manual animation classes (use `heroAnimate` prop)
❌ Inline styles for things that should be in components
❌ Adding new components without justification

✅ Always use Master Controller components
✅ Edit Master Controller for style changes
✅ Use props and className for variations
✅ Read the PAGE_BUILDING_GUIDE before work

---

**Remember: This file + PAGE_BUILDING_GUIDE = Your Architecture Bible**

If you're ever unsure, re-read these two files. They contain all architectural decisions and patterns.
