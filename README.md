# Smart Agent Alliance - Monorepo

> Public-facing website and admin dashboard for Smart Agent Alliance

---

## 📖 **CRITICAL: READ THIS FIRST BEFORE BUILDING ANY PAGE**

### **[📖 PAGE BUILDING GUIDE](./📖-PAGE-BUILDING-GUIDE.md)** ← **MANDATORY READING**

**This guide is THE source of truth for:**
- ✅ Which components to use (only Master Controller components!)
- ✅ When to add new components (rarely!)
- ✅ How to implement 2025 animation system
- ✅ Architecture patterns and best practices

**🚨 ALWAYS read this guide before:**
- Creating a new page
- Adding any components
- Spawning Task agents for page building

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run public site (port 3001)
npm run dev:public

# Run admin dashboard
npm run dev:admin

# Build everything
npm run build:all
```

## 📦 Workspaces

- **`packages/public-site/`** - Public-facing Next.js site (port 3001)
- **`packages/shared/`** - Shared components and utilities

## ⚠️ IMPORTANT MAINTENANCE

### 📋 [DEPENDENCY UPGRADE CHECKLIST](./DEPENDENCY_UPGRADE_CHECKLIST.md)

**→ Check this monthly!** Track and update all critical dependencies.

**Status:** ✅ All packages up to date! (Last checked: 2025-11-09)

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (RC/canary)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4.1
- **Animations:** Framer Motion 12
- **Testing:** Playwright
- **Deployment:** Cloudflare Pages (via Wrangler)
- **Language:** TypeScript 5.9

## 📁 Project Structure

```
/home/ubuntu/saabuildingblocks-platform/
├── packages/
│   ├── public-site/        # Static site → Cloudflare Pages
│   ├── admin-dashboard/    # Dynamic site → VPS PM2
│   └── shared/             # Shared components and utilities
├── package.json            # Root package.json
├── CLAUDE.md               # Project configuration (source of truth)
└── README.md               # This file
```

## 🔧 Common Commands

```bash
# Development
npm run dev:public         # Start public site dev server
npm run dev:admin          # Start admin dev server
npm run dev:all            # Start all workspaces

# Building
npm run build:public       # Build public site
npm run build:admin        # Build admin dashboard
npm run build:all          # Build all workspaces

# Testing & Quality
npm run test:all           # Run all tests
npm run lint:all           # Lint all workspaces
npm run type-check:all     # TypeScript checks

# Cleanup
npm run clean              # Remove node_modules and build artifacts
npm run clean:build        # Remove only build artifacts
```

## 🌐 Deployment

The public site is deployed to Cloudflare Pages and accessible at:
- **Production:** https://saabuildingblocks.pages.dev
- **Master Controller (dev preview):** https://31.97.103.71

## 📊 Performance

Run performance tests:
```bash
npm run test:performance --workspace=@saa/public-site
```

## 🔗 Important Files

### 🔴 **CRITICAL - Read Before Any Work:**
- **[📖 PAGE BUILDING GUIDE](./📖-PAGE-BUILDING-GUIDE.md)** - **MANDATORY** for all page creation

### 🟠 **Important - Check Regularly:**
- **[Dependency Upgrade Checklist](./DEPENDENCY_UPGRADE_CHECKLIST.md)** - Monthly maintenance checklist

### 🔵 **Reference:**
- **[MCP Server Config](./.vscode-server/data/User/workspaceStorage/.../mcp/mcp-servers.json)** - Claude MCP configuration

## 💡 Development Notes

### Next.js 16 (Canary)
This project uses Next.js 16 RC, which includes:
- Turbopack by default
- React 19 support
- Improved build performance

### Tailwind CSS 4
Using Tailwind CSS v4 with:
- New `@import "tailwindcss"` syntax
- Updated PostCSS configuration
- Enhanced performance

### TypeScript
**⚠️ ACTION REQUIRED:** Upgrade from 5.7.2 to 5.9.3

## 🆘 Troubleshooting

### Build Issues
```bash
# Clear everything and reinstall
npm run clean
npm install
npm run build:all
```

### Type Errors
```bash
# Check types without building
npm run type-check:all
```

### Performance Issues
```bash
# Run performance tests
npm run test:performance --workspace=@saa/public-site
```

## 📝 License

Private - Smart Agent Alliance

---

## 🚨 CRITICAL REMINDERS

### For Claude Code:
1. **📖 [PAGE BUILDING GUIDE](./📖-PAGE-BUILDING-GUIDE.md)** - Read before ANY page work
2. **🔴 [PROJECT CONTEXT](./🔴-PROJECT-CONTEXT.md)** - Architecture overview
3. **🚨 [REMINDER FILE](./🚨-REMINDER-FOR-CLAUDE.md)** - Instructions for spawning agents

### For Maintenance:
**🔔 Remember:** Check the [Dependency Upgrade Checklist](./DEPENDENCY_UPGRADE_CHECKLIST.md) monthly!
