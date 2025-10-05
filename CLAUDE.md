# Claude Code Configuration - SPARC Development Environment

## 🔄 SESSION INITIALIZATION PROTOCOL

**⚠️ CRITICAL: RUN THIS BEFORE ANY TASK!**

### Automatic Context Loading

**✅ AUTOMATIC WHEN USING HIVE MIND WIZARD:**
```bash
su - claude-flow
npx claude-flow@alpha hive-mind wizard
```
The wizard automatically runs `/home/claude-flow/.claude/hooks/session-init.sh` which loads all context.

**Manual initialization (if needed):**
```bash
bash /home/claude-flow/scripts/init-session.sh
```

This script will:
1. **Discover all credentials** - Scans project for .env files, configs, and API keys (including `/var/www/html/credentials`)
2. **Load project registry** - Reads `/home/claude-flow/config/project-registry.json`
3. **Display tech stack** - Shows all technologies, frameworks, and services
4. **Store in MCP memory** - Makes context available to all agents
5. **Health checks** - Verifies all required files and tools are present

### Quick Context Check

If you need quick info without full initialization:

```bash
# View project registry
cat /home/claude-flow/config/project-registry.json | jq '.'

# View specific credentials
cat /home/claude-flow/config/project-registry.json | jq '.credentials'

# View tech stack
cat /home/claude-flow/config/project-registry.json | jq '.tech_stack'
```

### Key Files to Check

Before starting work on any feature:
1. **Architecture**: `/home/claude-flow/docs/NEXTJS-MIGRATION-ARCHITECTURE.md`
2. **Credentials**: `/home/claude-flow/config/project-registry.json`
3. **Standards**: `/home/claude-flow/docs/CODING-STANDARDS.md`
4. **Protocols**: `/home/claude-flow/docs/SWARM-PROTOCOLS.md`

### Available Services

All credentials and configurations are centrally managed:
- **Cloudflare** - API tokens, account IDs, zone IDs, R2, KV
- **WordPress** - Headless CMS API endpoints
- **Supabase** - Master Controller backend
- **n8n** - Automation platform and webhooks
- **SSL Certificates** - Let's Encrypt paths

### Why This Matters

**Problem Solved:** Agents no longer need to search for credentials or ask users for information that was already provided. Everything is discoverable and centrally registered.

---

## 🏗️ Architecture Overview

**You are using Claude Code** - Anthropic's AI-powered development environment.

### What is Claude Code?
Claude Code is the main system you're interacting with. It has:
- Native tools (Task, Read, Write, Bash, TodoWrite, etc.)
- MCP server support (extensions that add specialized capabilities)
- Agent coordination (spawn multiple AI agents to work in parallel)

### What are MCPs?
**MCP (Model Context Protocol) servers** are extensions that give Claude Code additional capabilities:
- Think of them like plugins or extensions
- Each MCP provides specialized tools
- All MCPs are equal in importance - use what you need
- MCPs are NOT separate systems - they're part of Claude Code's toolkit

### Example: claude-flow MCP
`claude-flow` is ONE of the 10 MCP servers. It provides:
- Swarm coordination tools (`swarm_init`, `agent_spawn`)
- Neural training capabilities
- Task orchestration features

**It's not a separate "Claude Flow" system** - it's an extension that adds swarm coordination to Claude Code.

### The Complete Picture:
```
Claude Code (Main System)
    │
    ├── Native Tools
    │   ├── Task (spawn agents)
    │   ├── Read/Write/Edit (file operations)
    │   ├── Bash (terminal)
    │   └── TodoWrite (task tracking)
    │
    └── MCP Extensions (10 servers)
        ├── claude-flow (swarm coordination)
        ├── github (GitHub operations)
        ├── playwright (browser automation)
        ├── memory (persistent context)
        ├── postgres (database queries)
        ├── brave-search (web research)
        ├── filesystem (advanced file ops)
        ├── context7 (library docs)
        ├── ruv-swarm (enhanced coordination)
        └── flow-nexus (cloud features)
```

---

## 🚨 CRITICAL: CONCURRENT EXECUTION & FILE MANAGEMENT

**ABSOLUTE RULES**:
1. ALL operations MUST be concurrent/parallel in a single message
2. **NEVER save working files, text/mds and tests to the root folder**
3. ALWAYS organize files in appropriate subdirectories
4. **USE CLAUDE CODE'S TASK TOOL** for spawning agents concurrently, not just MCP

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL RELATED OPERATIONS"

**MANDATORY PATTERNS:**
- **TodoWrite**: ALWAYS batch ALL todos in ONE call (5-10+ todos minimum)
- **Task tool (Claude Code)**: ALWAYS spawn ALL agents in ONE message with full instructions
- **File operations**: ALWAYS batch ALL reads/writes/edits in ONE message
- **Bash commands**: ALWAYS batch ALL terminal operations in ONE message
- **Memory operations**: ALWAYS batch ALL memory store/retrieve in ONE message

### 🎯 CRITICAL: Claude Code Task Tool for Agent Execution

**Claude Code's Task tool is the PRIMARY way to spawn agents:**
```javascript
// ✅ CORRECT: Use Claude Code's Task tool for parallel agent execution
[Single Message]:
  Task("Research agent", "Analyze requirements and patterns...", "researcher")
  Task("Coder agent", "Implement core features...", "coder")
  Task("Tester agent", "Create comprehensive tests...", "tester")
  Task("Reviewer agent", "Review code quality...", "reviewer")
  Task("Architect agent", "Design system architecture...", "system-architect")
```

**⚠️ CRITICAL: MCP Tools Are Fundamental, Not Just Coordination**

MCPs must be evaluated on EVERY task with the same importance as core technologies (Cloudflare, Next.js, PostgreSQL, etc.).

**Pre-Task MCP Evaluation Checklist** - Check ALL 10 MCPs BEFORE starting work:

1. **`mcp__github`** - Repository operations, PRs, issues, code search
2. **`mcp__brave-search`** - Real-time web research, current information (2025 data)
3. **`mcp__memory`** - Persistent context, cross-session learning
4. **`mcp__filesystem`** - Advanced file operations, bulk operations
5. **`mcp__postgres`** - Database queries (read-only)
6. **`mcp__playwright`** - Browser automation, UI testing
7. **`mcp__context7`** - Current library documentation (prevents API hallucinations)
8. **`mcp__claude-flow`** - Swarm coordination, neural training
9. **`mcp__ruv-swarm`** - Enhanced coordination, DAA
10. **`mcp__flow-nexus`** - Cloud features, E2B sandboxes (requires auth)

**When to Use Each MCP:**

- **GitHub**: Creating PRs, searching code, analyzing repos, automating workflows
- **Brave Search**: Latest framework features, current best practices, real-time info
- **Memory**: Storing decisions, cross-session persistence, building knowledge graphs
- **Filesystem**: Bulk file operations, cross-directory management, file analysis
- **Postgres**: Schema analysis, data verification, query validation
- **Playwright**: UI testing, form automation, screenshots, E2E workflows
- **Context7**: Current library docs (Next.js 15, React 19, Tailwind v4, etc.)
- **Claude Flow**: Swarm coordination, task orchestration, neural patterns
- **RUV Swarm**: Advanced coordination, autonomous agents, distributed learning
- **Flow Nexus**: Cloud execution, template deployment, distributed neural networks

**Multi-MCP Integration Patterns:**

**Pattern 1: Research → Code → Test**
```javascript
// Get current docs
mcp__context7 resolve-library-id "next.js"
mcp__context7 get-library-docs "/vercel/next.js/15"

// Check existing code
mcp__github search_code "useRouter" repo:myorg/myapp

// Store decisions
mcp__memory create_entities

// Test implementation
mcp__playwright navigate "http://localhost:3000"
```

**Pattern 2: Database → Memory → Implementation**
```javascript
// Query schema
mcp__postgres query "SELECT * FROM users LIMIT 1"

// Store for reference
mcp__memory create_entities "database_schema"

// Implement based on schema
Task("Build API using schema from memory")
```

**Pattern 3: Search → GitHub → Automation**
```javascript
// Research latest practices
mcp__brave-search web_search "React 2025 testing best practices"

// Check existing patterns
mcp__github search_code "test" repo:myorg/myapp

// Automate testing
mcp__playwright navigate "http://localhost:3000"
```

**Common Mistakes to Avoid:**
- ❌ Ignoring MCP opportunities (e.g., not using Playwright for UI tests)
- ❌ Using outdated knowledge instead of Context7 for current docs
- ❌ Not persisting learnings in Memory for cross-session use
- ❌ Manual GitHub operations when automation is available

**Full MCP Documentation:** See `/docs/self-learning/MCP-DECISION-TREE.md` for complete usage guide.

### 📁 File Organization Rules

**NEVER save to root folder. Use these directories:**
- `/src` - Source code files
- `/tests` - Test files
- `/docs` - Documentation and markdown files
- `/config` - Configuration files
- `/scripts` - Utility scripts
- `/examples` - Example code

## Project Overview

This project uses SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) methodology with Claude-Flow orchestration for systematic Test-Driven Development.

## SPARC Commands

### Core Commands
- `npx claude-flow sparc modes` - List available modes
- `npx claude-flow sparc run <mode> "<task>"` - Execute specific mode
- `npx claude-flow sparc tdd "<feature>"` - Run complete TDD workflow
- `npx claude-flow sparc info <mode>` - Get mode details

### Batchtools Commands
- `npx claude-flow sparc batch <modes> "<task>"` - Parallel execution
- `npx claude-flow sparc pipeline "<task>"` - Full pipeline processing
- `npx claude-flow sparc concurrent <mode> "<tasks-file>"` - Multi-task processing

### Build Commands
- `npm run build` - Build project
- `npm run test` - Run tests
- `npm run lint` - Linting
- `npm run typecheck` - Type checking

## SPARC Workflow Phases

1. **Specification** - Requirements analysis (`sparc run spec-pseudocode`)
2. **Pseudocode** - Algorithm design (`sparc run spec-pseudocode`)
3. **Architecture** - System design (`sparc run architect`)
4. **Refinement** - TDD implementation (`sparc tdd`)
5. **Completion** - Integration (`sparc run integration`)

## Code Style & Best Practices

- **Modular Design**: Files under 500 lines
- **Environment Safety**: Never hardcode secrets
- **Test-First**: Write tests before implementation
- **Clean Architecture**: Separate concerns
- **Documentation**: Keep updated

**📚 Comprehensive Standards Documentation:**
- [CODING-STANDARDS.md](/docs/CODING-STANDARDS.md) - Complete coding standards, patterns, and checklists
- [CSS-FRAMEWORK-GUIDE.md](/docs/CSS-FRAMEWORK-GUIDE.md) - Tailwind CSS v4 + ShadCN/UI implementation guide
- [SWARM-PROTOCOLS.md](/docs/SWARM-PROTOCOLS.md) - Hive mind coordination and memory protocols

## 🚀 Available Agents (54 Total)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`, `collective-intelligence-coordinator`, `swarm-memory-manager`

### Consensus & Distributed
`byzantine-coordinator`, `raft-manager`, `gossip-coordinator`, `consensus-builder`, `crdt-synchronizer`, `quorum-manager`, `security-manager`

### Performance & Optimization
`perf-analyzer`, `performance-benchmarker`, `task-orchestrator`, `memory-coordinator`, `smart-agent`

### GitHub & Repository
`github-modes`, `pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`, `workflow-automation`, `project-board-sync`, `repo-architect`, `multi-repo-swarm`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`, `refinement`

### Specialized Development
`backend-dev`, `mobile-dev`, `ml-developer`, `cicd-engineer`, `api-docs`, `system-architect`, `code-analyzer`, `base-template-generator`

### Testing & Validation
`tdd-london-swarm`, `production-validator`

### Migration & Planning
`migration-planner`, `swarm-init`

## 🎯 System Architecture

You are in **Claude Code** - the AI-powered development environment.

### Native Tools (Built into Claude Code):
- **Task** - Spawn agents concurrently for complex work
- **File Operations** - Read, Write, Edit, Glob, Grep
- **Terminal** - Bash commands and system operations
- **Task Management** - TodoWrite for tracking progress
- **Git Operations** - Version control integration

### MCP Servers (Extensions - All Equal Importance):

MCPs are extension servers that provide specialized capabilities to Claude Code. They are NOT separate systems - they're tools you can use through Claude Code.

**All 10 MCP servers:**

1. **claude-flow** - Swarm coordination, task orchestration, neural training
   - `swarm_init`, `agent_spawn`, `task_orchestrate`
   - Enables multi-agent coordination patterns

2. **github** - Repository operations, PRs, issues, code search
   - `search_code`, `create_issue`, `create_pull_request`
   - Automates GitHub workflows

3. **brave-search** - Real-time web research (2025 data)
   - `web_search`, `local_search`
   - Current information and documentation

4. **memory** - Persistent context across sessions
   - `create_entities`, `create_relations`, `search_nodes`
   - Knowledge graphs and cross-session learning

5. **filesystem** - Advanced file operations
   - `read_multiple_files`, `search_files`, `directory_tree`
   - Bulk operations and file analysis

6. **postgres** - Database queries (read-only)
   - `query` - SQL execution
   - Schema analysis and data verification

7. **playwright** - Browser automation and testing
   - `navigate`, `click`, `fill`, `screenshot`
   - UI testing and web scraping

8. **context7** - Current library documentation
   - `resolve_library_id`, `get_library_docs`
   - Prevents API hallucinations with up-to-date docs

9. **ruv-swarm** - Enhanced coordination features
   - `daa_agent_create`, `neural_train`, `cognitive_analyze`
   - Autonomous agents and distributed learning

10. **flow-nexus** - Cloud-based execution (requires auth)
    - `sandbox_create`, `neural_train`, `template_deploy`
    - E2B sandboxes and distributed computing

**Key Point:** All MCPs are equal-importance extensions. Use whichever MCP provides the capabilities you need for the task at hand.

---

## 🔧 @modelcontextprotocol MCP Auto-Selection Protocol

**CRITICAL: ALWAYS check if task requires @modelcontextprotocol MCPs BEFORE starting work**

### 📋 MCP Selection Checklist (Check BEFORE Every Task)

**Step 1: Analyze Task Requirements**
- Does task involve GitHub operations? → Use `mcp__github`
- Need web/news search? → Use `mcp__brave-search`
- Requires persistent memory? → Use `mcp__memory`
- Local file operations? → Use `mcp__filesystem`
- Database queries? → Use `mcp__postgres`
- Browser automation/testing? → Use `mcp__playwright`
- Need library documentation? → Use `mcp__context7`

**Step 2: Use Explicit MCP Calls**
```
✅ CORRECT: "Use mcp__github to search for authentication issues in repo/project"
✅ CORRECT: "Use mcp__playwright to test the login flow at example.com"
❌ WRONG: "Test the login flow" (no MCP specified)
```

---

## 🎯 @modelcontextprotocol MCP Usage Guide

### 1. **GitHub MCP** (`mcp__github`)

**When to Use:**
- Managing GitHub issues and pull requests
- Searching code across repositories
- Automating GitHub workflows
- Repository analysis and code reviews
- CI/CD pipeline monitoring
- Creating/updating files in repos
- Branch management

**Available Tools:**
- Repository operations (browse, search, clone, fork)
- Issue & PR management (create, update, list, comment)
- Code search (with language/path filters)
- Branch management
- CI/CD workflow monitoring
- Security analysis (Dependabot alerts)

**Example Usage:**
```
"Use mcp__github to search for 'authentication' in owner/repo and create an issue for vulnerabilities found"
```

---

### 2. **Brave Search MCP** (`mcp__brave-search`)

**When to Use:**
- Real-time web research
- Finding current news and articles
- Local business/service discovery
- General information gathering
- Up-to-date market data

**Available Tools:**
- `brave_web_search` - General web search
- `brave_local_search` - Business/service search

**Example Usage:**
```
"Use mcp__brave-search to find the latest React 19 features announced in 2025"
```

---

### 3. **Memory MCP** (`mcp__memory`)

**When to Use:**
- Maintaining user context across sessions
- Building persistent user profiles
- Storing project decisions and rationale
- Relationship mapping
- Preserving conversation context

**Data Types:**
- **Entities**: People, places, things
- **Relations**: Connections (active voice)
- **Observations**: Facts and details

**Example Usage:**
```
"Use mcp__memory to store user preference for dark mode and TypeScript"
```

---

### 4. **Filesystem MCP** (`mcp__filesystem`)

**When to Use:**
- Local file management outside project scope
- Bulk file operations
- Cross-directory operations
- File system analysis
- Secure sandboxed file access

**Available Tools:**
- Read/write files
- Create/list directories
- Move/rename files
- Search files
- Get file metadata

**Example Usage:**
```
"Use mcp__filesystem to read all .env files in /var/www/html and check for exposed secrets"
```

---

### 5. **PostgreSQL MCP** (`mcp__postgres`)

**When to Use:**
- Database schema analysis
- Read-only data queries
- Database structure exploration
- Data verification and inspection
- SQL query validation

**Limitations:** Read-only access (no INSERT/UPDATE/DELETE)

**Example Usage:**
```
"Use mcp__postgres to query user table and show schema for authentication fields"
```

---

### 6. **Playwright MCP** (`mcp__playwright`)

**When to Use:**
- Automated browser testing
- Web scraping and data extraction
- UI interaction automation
- Form filling and submission
- Screenshot capture
- E2E testing workflows

**Available Tools:**
- Navigate, click, type, fill forms
- Take screenshots
- Wait for elements
- Execute JavaScript

**Example Usage:**
```
"Use mcp__playwright to navigate to example.com, fill login form with test credentials, and verify dashboard loads"
```

---

### 7. **Context7 MCP** (`mcp__context7`)

**When to Use:**
- Getting current library documentation
- Version-specific code examples
- Preventing API hallucinations
- Learning new frameworks
- Ensuring up-to-date code patterns

**Available Tools:**
- `resolve-library-id` - Find library
- `get-library-docs` - Fetch docs

**Example Usage:**
```
"Use mcp__context7 to get the latest Next.js 15 App Router documentation"
```

---

## ⚡ MCP Integration Rules

### BEFORE Starting ANY Task:

1. **Analyze Requirements** - What MCPs are needed?
2. **Use Explicit Calls** - Always specify MCP name
3. **Combine When Needed** - Multiple MCPs can work together
4. **Document Usage** - Store MCP interactions in memory

### Integration Patterns:

**Pattern 1: Research → Code → Test**
```javascript
[Single Message]:
  // Use Context7 for docs
  mcp__context7 resolve-library-id "next.js"
  mcp__context7 get-library-docs "/vercel/next.js/15"

  // Use GitHub to check existing code
  mcp__github search_code "useRouter" repo:myorg/myapp

  // Spawn agents with documentation
  Task("Coder", "Implement using Next.js 15 patterns from Context7 docs", "coder")
  Task("Tester", "Use Playwright MCP to test routing", "tester")
```

**Pattern 2: Database → Memory → Implementation**
```javascript
[Single Message]:
  // Query database
  mcp__postgres query "SELECT * FROM users LIMIT 1"

  // Store schema in memory
  mcp__memory create_entities "database_schema"

  // Use for implementation
  Task("Coder", "Build API based on schema in memory", "coder")
```

**Pattern 3: Search → GitHub → Automation**
```javascript
[Single Message]:
  // Research best practices
  mcp__brave-search web_search "React testing best practices 2025"

  // Check existing tests
  mcp__github search_code "test" repo:myorg/myapp

  // Automate testing
  mcp__playwright navigate "http://localhost:3000"
```

---

## 🚨 CRITICAL MCP Rules

1. **ALWAYS use explicit MCP calls** - Never rely on implicit selection
2. **Check task requirements FIRST** - Before spawning agents
3. **Combine MCPs when logical** - GitHub + Memory, Playwright + Context7
4. **Store MCP results in memory** - For swarm coordination
5. **Document MCP usage** - In task descriptions for agents

**Remember:** Claude Code has NO automatic MCP routing. YOU must explicitly specify which MCP to use for each task.

## 🚀 MCP Server Setup

MCPs extend Claude Code with specialized capabilities. Install the ones you need:

```bash
# Swarm coordination (multi-agent orchestration)
claude mcp add claude-flow npx claude-flow@alpha mcp start

# Enhanced coordination features
claude mcp add ruv-swarm npx ruv-swarm mcp start

# Cloud execution and distributed computing
claude mcp add flow-nexus npx flow-nexus@latest mcp start

# GitHub automation (if not already installed)
claude mcp add github npx @modelcontextprotocol/server-github

# Browser automation
claude mcp add playwright npx @modelcontextprotocol/server-playwright

# And 5 more MCPs available...
```

**All MCPs are optional extensions.** Use what you need for your workflow.

## MCP Tool Categories

### Coordination
`swarm_init`, `agent_spawn`, `task_orchestrate`

### Monitoring
`swarm_status`, `agent_list`, `agent_metrics`, `task_status`, `task_results`

### Memory & Neural
`memory_usage`, `neural_status`, `neural_train`, `neural_patterns`

### GitHub Integration
`github_swarm`, `repo_analyze`, `pr_enhance`, `issue_triage`, `code_review`

### System
`benchmark_run`, `features_detect`, `swarm_monitor`

### Flow-Nexus MCP Tools (Optional Advanced Features)
Flow-Nexus extends MCP capabilities with 70+ cloud-based orchestration tools:

**Key MCP Tool Categories:**
- **Swarm & Agents**: `swarm_init`, `swarm_scale`, `agent_spawn`, `task_orchestrate`
- **Sandboxes**: `sandbox_create`, `sandbox_execute`, `sandbox_upload` (cloud execution)
- **Templates**: `template_list`, `template_deploy` (pre-built project templates)
- **Neural AI**: `neural_train`, `neural_patterns`, `seraphina_chat` (AI assistant)
- **GitHub**: `github_repo_analyze`, `github_pr_manage` (repository management)
- **Real-time**: `execution_stream_subscribe`, `realtime_subscribe` (live monitoring)
- **Storage**: `storage_upload`, `storage_list` (cloud file management)

**Authentication Required:**
- Register: `mcp__flow-nexus__user_register` or `npx flow-nexus@latest register`
- Login: `mcp__flow-nexus__user_login` or `npx flow-nexus@latest login`
- Access 70+ specialized MCP tools for advanced orchestration

## 🚀 Agent Execution with Claude Code

### How to Spawn Agents:

Use Claude Code's **Task tool** to spawn agents concurrently. Each agent can use any MCP tools they need.

### Example: Full-Stack Development

```javascript
// Single message - spawn all agents concurrently
Task("Backend Developer", "Build REST API with Express. Use claude-flow MCP for coordination if needed.", "backend-dev")
Task("Frontend Developer", "Create React UI. Use memory MCP to coordinate with backend.", "coder")
Task("Database Architect", "Design PostgreSQL schema. Use postgres MCP to verify. Store in memory MCP.", "code-analyzer")
Task("Test Engineer", "Write tests. Use playwright MCP for UI tests.", "tester")
Task("DevOps Engineer", "Setup Docker and CI/CD. Use github MCP for workflow automation.", "cicd-engineer")
Task("Security Auditor", "Review authentication. Use github MCP to check for vulnerabilities.", "reviewer")

// Batch all todos together
TodoWrite { todos: [...8-10 todos...] }

// File operations
Write "backend/server.js"
Write "frontend/App.jsx"
Write "database/schema.sql"
```

### When to Use claude-flow MCP:

The claude-flow MCP is useful when you need:
- **Swarm coordination** - `swarm_init` to set up agent topology
- **Task orchestration** - `task_orchestrate` for complex workflows
- **Neural training** - `neural_train` to learn from patterns
- **Performance tracking** - `swarm_monitor`, `agent_metrics`

But it's OPTIONAL. You can spawn agents with just the Task tool and let them use whatever MCPs they need (github, playwright, memory, etc.).

## 📋 Agent Coordination Protocol

### Every Agent Spawned via Task Tool MUST:

**1️⃣ BEFORE Work:**
```bash
npx claude-flow@alpha hooks pre-task --description "[task]"
npx claude-flow@alpha hooks session-restore --session-id "swarm-[id]"
```

**2️⃣ DURING Work:**
```bash
npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "swarm/[agent]/[step]"
npx claude-flow@alpha hooks notify --message "[what was done]"
```

**3️⃣ AFTER Work:**
```bash
npx claude-flow@alpha hooks post-task --task-id "[task]"
npx claude-flow@alpha hooks session-end --export-metrics true
```

## 🎯 Concurrent Execution Examples

### ✅ CORRECT WORKFLOW: Concurrent Agent Execution

```javascript
// Single message - spawn all agents with MCP capabilities
[Parallel Agent Execution]:
  // Claude Code's Task tool spawns agents concurrently
  // Each agent can use any MCP tools they need (github, memory, playwright, etc.)
  Task("Research agent", "Analyze API requirements. Use brave-search MCP for latest practices. Store findings in memory MCP.", "researcher")
  Task("Coder agent", "Implement REST endpoints. Use context7 MCP for Express docs. Coordinate via memory MCP.", "coder")
  Task("Database agent", "Design schema. Use postgres MCP to verify existing structure. Store in memory MCP.", "code-analyzer")
  Task("Tester agent", "Create tests. Use playwright MCP for E2E testing with 90% coverage.", "tester")
  Task("Reviewer agent", "Review code quality. Use github MCP to check for security vulnerabilities.", "reviewer")

  // Batch ALL todos in ONE call
  TodoWrite { todos: [
    {id: "1", content: "Research API patterns", status: "in_progress", priority: "high"},
    {id: "2", content: "Design database schema", status: "in_progress", priority: "high"},
    {id: "3", content: "Implement authentication", status: "pending", priority: "high"},
    {id: "4", content: "Build REST endpoints", status: "pending", priority: "high"},
    {id: "5", content: "Write unit tests", status: "pending", priority: "medium"},
    {id: "6", content: "Integration tests", status: "pending", priority: "medium"},
    {id: "7", content: "API documentation", status: "pending", priority: "low"},
    {id: "8", content: "Performance optimization", status: "pending", priority: "low"}
  ]}

  // Parallel file operations
  Bash "mkdir -p app/{src,tests,docs,config}"
  Write "app/package.json"
  Write "app/src/server.js"
  Write "app/tests/server.test.js"
  Write "app/docs/API.md"
```

**Note:** You can optionally use `mcp__claude-flow__swarm_init` for advanced coordination patterns, but it's not required. The Task tool is sufficient for most concurrent execution needs.

### ❌ WRONG (Multiple Messages):
```javascript
Message 1: mcp__claude-flow__swarm_init
Message 2: Task("agent 1")
Message 3: TodoWrite { todos: [single todo] }
Message 4: Write "file.js"
// This breaks parallel coordination!
```

## Performance Benefits

- **84.8% SWE-Bench solve rate**
- **32.3% token reduction**
- **2.8-4.4x speed improvement**
- **27+ neural models**

## Hooks Integration

### Pre-Operation
- Auto-assign agents by file type
- Validate commands for safety
- Prepare resources automatically
- Optimize topology by complexity
- Cache searches

### Post-Operation
- Auto-format code
- Train neural patterns
- Update memory
- Analyze performance
- Track token usage

### Session Management
- Generate summaries
- Persist state
- Track metrics
- Restore context
- Export workflows

## Advanced Features (v2.0.0)

- 🚀 Automatic Topology Selection
- ⚡ Parallel Execution (2.8-4.4x speed)
- 🧠 Neural Training
- 📊 Bottleneck Analysis
- 🤖 Smart Auto-Spawning
- 🛡️ Self-Healing Workflows
- 💾 Cross-Session Memory
- 🔗 GitHub Integration

## Integration Tips

1. Start with basic swarm init
2. Scale agents gradually
3. Use memory for context
4. Monitor progress regularly
5. Train patterns from success
6. Enable hooks automation
7. Use GitHub tools first

## Support

- Documentation: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues
- Flow-Nexus Platform: https://flow-nexus.ruv.io (registration required for cloud features)

## Project Documentation Index

### Core Standards
- [CODING-STANDARDS.md](/docs/CODING-STANDARDS.md) - Comprehensive coding standards for 2025
  - CSS Framework standards (Tailwind CSS v4 + ShadCN/UI)
  - Component architecture patterns
  - Responsive design and dark mode
  - Performance and accessibility requirements
  - Testing and quality standards
  - Quick reference checklists

### Framework Guide
- [CSS-FRAMEWORK-GUIDE.md](/docs/CSS-FRAMEWORK-GUIDE.md) - Complete CSS framework implementation
  - Tailwind CSS v4 setup and configuration
  - ShadCN/UI integration patterns
  - Component templates and examples
  - Performance optimization techniques
  - Migration guides from other frameworks
  - Advanced patterns and best practices

### Swarm Coordination
- [SWARM-PROTOCOLS.md](/docs/SWARM-PROTOCOLS.md) - Hive mind coordination protocols
  - Agent roles and responsibilities
  - Memory coordination patterns
  - Lifecycle hooks integration
  - Parallel execution strategies
  - Error handling and recovery
  - Performance metrics and monitoring

### Self-Learning System
- [ARCHITECTURE.md](/docs/self-learning/ARCHITECTURE.md) - Self-learning system architecture
  - Pattern detection and mistake identification
  - Persistent memory using `mcp__memory`
  - Automated CLAUDE.md optimization
  - MCP usage analytics and recommendations
  - Cross-session learning and improvement
- [MCP-DECISION-TREE.md](/docs/self-learning/MCP-DECISION-TREE.md) - Complete MCP usage guide
  - Pre-task evaluation checklist (all 10 MCPs)
  - When-to-use criteria for each MCP
  - Multi-MCP integration patterns
  - Common mistakes and solutions
  - Continuous improvement tracking

**How Self-Learning Works:**
1. **Pattern Detection** - Identifies recurring mistakes and optimal patterns
2. **Persistent Memory** - Uses `mcp__memory` to store learnings across sessions
3. **Automatic Optimization** - Updates CLAUDE.md based on detected improvements
4. **MCP Analytics** - Tracks when MCPs should be used vs. actually used
5. **Feedback Loops** - Post-task analysis runs automatically via hooks

**Implementation Files:**
- `/scripts/self-learning/pattern-detector.ts` - Detects patterns and mistakes
- `/scripts/self-learning/claude-optimizer.ts` - Optimizes CLAUDE.md automatically
- `/scripts/self-learning/mcp-analyzer.ts` - Analyzes MCP usage patterns
- `/scripts/self-learning/memory-manager.ts` - Manages persistent memory
- `/scripts/self-learning/feedback-loop.ts` - Automates continuous improvement

The system learns from every conversation and stores insights persistently, ensuring continuous improvement across all sessions.

---

Remember: **You're in Claude Code. MCPs are powerful extensions - use them!**

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
Never save working files, text/mds and tests to the root folder.
