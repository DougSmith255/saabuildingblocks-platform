# 🚨 REMINDER FOR CLAUDE CODE

> **This file exists to remind you and all Task agents to read critical documentation**

---

## 📋 Before ANY Page Building Work:

### Step 1: Read Project Context
**File:** [🔴-PROJECT-CONTEXT.md](./🔴-PROJECT-CONTEXT.md)
- Quick overview of architecture
- Core rules
- Decision trees

### Step 2: Read Page Building Guide
**File:** [📖-PAGE-BUILDING-GUIDE.md](./📖-PAGE-BUILDING-GUIDE.md)
- Detailed component usage
- Animation system
- Code patterns
- Quality checklist

---

## 🤖 When Spawning Task Agents:

**ALWAYS include this in your prompt:**

```typescript
{
  prompt: `
    CRITICAL: Before starting ANY work, read these files:
    1. /home/claude-flow/🔴-PROJECT-CONTEXT.md
    2. /home/claude-flow/📖-PAGE-BUILDING-GUIDE.md

    These contain ALL architecture rules, including:
    - Only use Master Controller components from @saa/shared/components/saa
    - Use heroAnimate prop for entrance animations
    - Never create inline components

    [Your task description here]
  `
}
```

---

## ✅ Quick Checklist

Before writing ANY code for pages:

- [ ] Read 🔴-PROJECT-CONTEXT.md
- [ ] Read 📖-PAGE-BUILDING-GUIDE.md
- [ ] Confirmed task uses ONLY Master Controller components
- [ ] Confirmed NOT creating new components (unless absolutely necessary)
- [ ] Confirmed using `heroAnimate` props for animations

---

## 📍 File Locations

All critical docs are in the root directory:

```
/home/claude-flow/
├── 🔴-PROJECT-CONTEXT.md          ← Read FIRST
├── 📖-PAGE-BUILDING-GUIDE.md      ← Read SECOND
├── 🚨-REMINDER-FOR-CLAUDE.md      ← This file
└── packages/
    └── public-site/
        ├── 🔴-READ-FIRST.md       ← Symlink to PROJECT-CONTEXT
        └── 📖-READ-ME-BEFORE-BUILDING.md  ← Symlink to GUIDE
```

---

**Don't forget: These docs are THE source of truth for architecture!**
