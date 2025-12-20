# Agent Attraction Page - Implementation TODO

## Overview
Create dynamic agent attraction pages that render at `/{agent-slug}` URLs (e.g., `/doug-smart`).
These pages should be personalized versions of the homepage hero with the agent's info.

## Current State
- Agent pages return 404 (no dynamic route exists)
- Only static linktree pages exist for Doug/Karrie
- Agent data is stored in Supabase `agent_pages` table
- Agent data is synced to Cloudflare KV for edge delivery

## Implementation Tasks

### 1. Create Dynamic Route
- Create `/app/[agentSlug]/page.tsx`
- Fetch agent data from KV (or fallback to Supabase)
- Handle 404 for non-existent/inactive agents

### 2. Page Template Design
Based on homepage hero, personalized with:
- Agent's profile image (B&W with background removed)
- Agent's name in neon H1 styling
- Agent's bio/tagline
- Social links (if configured)
- Phone number (if show_phone enabled)
- CTAs: "Join [Agent Name]'s Team" / "Learn About SAA"

### 3. Data Fetching
- Use KV for fast edge delivery: `AGENT_PAGE:{slug}`
- Fallback to Supabase if KV miss
- ISR revalidation when agent updates profile

### 4. Components to Reuse
- H1 neon effect from shared components
- ProfileCyberFrame for image
- CTAButton for actions
- FixedHeroWrapper for parallax effect

### 5. SEO
- Dynamic meta tags with agent name
- Structured data for person
- Canonical URL

## Files to Create
- `/app/[agentSlug]/page.tsx` - Main agent page
- `/app/[agentSlug]/layout.tsx` - Optional layout
- `/app/[agentSlug]-links/page.tsx` - Dynamic linktree (replaces static ones)

## Priority
HIGH - Currently all agent page URLs return 404
