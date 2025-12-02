# 📧 Email Automation System - Comprehensive Implementation To-Do List

> **Project**: Add Email Automation System to Master Controller
> **Created**: 2025-11-22
> **Status**: Planning Phase
> **Priority**: HIGH

---

## 📋 Table of Contents
1. [Architecture Analysis](#architecture-analysis)
2. [Database Schema Design](#database-schema-design)
3. [Backend API Development](#backend-api-development)
4. [Frontend UI Development](#frontend-ui-development)
5. [GoHighLevel Integration](#gohighlevel-integration)
6. [Email Editor Integration](#email-editor-integration)
7. [WordPress Mail SMTP Integration](#wordpress-mail-smtp-integration)
8. [Automated Scheduling System](#automated-scheduling-system)
9. [Testing & Quality Assurance](#testing--quality-assurance)
10. [Deployment & Monitoring](#deployment--monitoring)

---

## 🏗️ Architecture Analysis

### ✅ Existing Infrastructure Discovered

**GoHighLevel Integration:**
- ✅ `/lib/gohighlevel-client.ts` - Full GHL API client with retry logic
- ✅ `/lib/gohighlevel/ghl-service.ts` - Service layer with contact management
- ✅ `/lib/gohighlevel/contact-sync.ts` - Bi-directional sync with Supabase
- ✅ `/app/api/gohighlevel/contacts/route.ts` - REST API endpoints
- ✅ Environment: `GOHIGHLEVEL_API_KEY`, `GOHIGHLEVEL_LOCATION_ID`

**Email Infrastructure:**
- ✅ `/lib/email/email-service.ts` - Advanced email service with:
  - Resend API integration
  - n8n webhook fallback
  - Queue management & retry logic
  - Batch sending capabilities
  - Email delivery tracking
- ✅ Environment: `RESEND_API_KEY`, `N8N_EMAIL_WEBHOOK_URL`

**Master Controller:**
- ✅ Tab system with dynamic imports (SSR disabled)
- ✅ URL-based routing (`/master-controller?tab=<tabId>`)
- ✅ RBAC (Role-Based Access Control) integrated
- ✅ Zustand stores for state management
- ✅ Supabase integration for data persistence

**Database:**
- ✅ PostgreSQL via Supabase
- ✅ PostgREST MCP server configured and working
- ✅ Existing tables: users, user_profiles, master_controller_settings, audit_logs

---

## 📊 Database Schema Design

### Task 1: Create Email Automation Tables

#### 1.1 Create `email_automation_categories` table
```sql
CREATE TABLE email_automation_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE, -- e.g., "Greeting Emails"
  slug VARCHAR(255) NOT NULL UNIQUE, -- e.g., "greeting-emails"
  description TEXT,
  icon VARCHAR(50), -- lucide-react icon name
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_email_categories_slug ON email_automation_categories(slug);
CREATE INDEX idx_email_categories_active ON email_automation_categories(is_active);
```

#### 1.2 Create `holiday_email_templates` table
```sql
CREATE TABLE holiday_email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES email_automation_categories(id) ON DELETE CASCADE,

  -- Holiday Information
  holiday_name VARCHAR(255) NOT NULL, -- e.g., "New Year's Day"
  holiday_slug VARCHAR(255) NOT NULL, -- e.g., "new-years-day"
  holiday_date_type VARCHAR(50) DEFAULT 'fixed', -- 'fixed' or 'variable'
  holiday_month INTEGER, -- 1-12 for fixed dates
  holiday_day INTEGER, -- day of month for fixed dates

  -- Email Content
  subject_line TEXT NOT NULL,
  preview_text TEXT,
  email_html TEXT NOT NULL, -- Full HTML content
  email_json TEXT, -- JSON from email editor for future editing

  -- Personalization
  personalization_tokens JSONB DEFAULT '[]'::jsonb, -- e.g., [{"token": "{{firstName}}", "description": "Contact first name"}]

  -- Branding
  use_brand_theme BOOLEAN DEFAULT true,
  custom_colors JSONB, -- Override brand colors if needed

  -- Status & Metadata
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  last_edited_by UUID REFERENCES users(id),

  UNIQUE(category_id, holiday_slug)
);

CREATE INDEX idx_holiday_templates_category ON holiday_email_templates(category_id);
CREATE INDEX idx_holiday_templates_slug ON holiday_email_templates(holiday_slug);
CREATE INDEX idx_holiday_templates_active ON holiday_email_templates(is_active);
CREATE INDEX idx_holiday_templates_date ON holiday_email_templates(holiday_month, holiday_day);
```

#### 1.3 Create `email_automation_schedules` table
```sql
CREATE TABLE email_automation_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES holiday_email_templates(id) ON DELETE CASCADE,

  -- Scheduling Configuration
  schedule_name VARCHAR(255) NOT NULL,
  schedule_year INTEGER NOT NULL, -- Year to send (e.g., 2025)
  send_date DATE NOT NULL, -- Calculated send date
  send_time TIME DEFAULT '09:00:00', -- Time to send (user's timezone)
  timezone VARCHAR(50) DEFAULT 'America/New_York',

  -- GoHighLevel Tag Filter
  ghl_tag_filter VARCHAR(255) DEFAULT 'active-downline', -- Tag to filter contacts

  -- Execution Status
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'processing', 'completed', 'failed', 'cancelled'
  contacts_count INTEGER DEFAULT 0, -- Total contacts to send to
  emails_sent INTEGER DEFAULT 0,
  emails_failed INTEGER DEFAULT 0,

  -- Execution Metadata
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_schedules_template ON email_automation_schedules(template_id);
CREATE INDEX idx_schedules_status ON email_automation_schedules(status);
CREATE INDEX idx_schedules_send_date ON email_automation_schedules(send_date);
CREATE INDEX idx_schedules_year ON email_automation_schedules(schedule_year);
```

#### 1.4 Create `email_send_logs` table
```sql
CREATE TABLE email_send_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES email_automation_schedules(id) ON DELETE CASCADE,
  template_id UUID REFERENCES holiday_email_templates(id),

  -- Recipient Information
  ghl_contact_id VARCHAR(255) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),

  -- Email Details
  subject_line TEXT NOT NULL,
  personalized_content TEXT, -- Content after token replacement

  -- Delivery Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'bounced', 'failed'
  email_provider VARCHAR(50), -- 'wordpress-smtp', 'resend', 'n8n-fallback'
  message_id VARCHAR(255), -- Provider's message ID

  -- Timestamps
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,

  -- Error Tracking
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_send_logs_schedule ON email_send_logs(schedule_id);
CREATE INDEX idx_send_logs_contact ON email_send_logs(ghl_contact_id);
CREATE INDEX idx_send_logs_email ON email_send_logs(recipient_email);
CREATE INDEX idx_send_logs_status ON email_send_logs(status);
CREATE INDEX idx_send_logs_sent_at ON email_send_logs(sent_at);
```

#### 1.5 Create Row-Level Security (RLS) Policies
```sql
-- Enable RLS on all tables
ALTER TABLE email_automation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE holiday_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_automation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_send_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only access for categories
CREATE POLICY "Admin full access to categories" ON email_automation_categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Admin-only access for templates
CREATE POLICY "Admin full access to templates" ON holiday_email_templates
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Admin-only access for schedules
CREATE POLICY "Admin full access to schedules" ON email_automation_schedules
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Admin can view all logs, others can view their own
CREATE POLICY "Admin view all logs" ON email_send_logs
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
```

**Files to create:**
- [ ] `/home/claude-flow/database/migrations/20251122_email_automation_schema.sql`
- [ ] `/home/claude-flow/database/migrations/20251122_email_automation_rls.sql`

---

## 🔧 Backend API Development

### Task 2: Email Automation API Routes

#### 2.1 Category Management API
**File:** `/app/api/email-automations/categories/route.ts`

**Endpoints:**
- `GET /api/email-automations/categories` - List all categories
- `POST /api/email-automations/categories` - Create category (admin only)
- `PUT /api/email-automations/categories/[id]` - Update category (admin only)
- `DELETE /api/email-automations/categories/[id]` - Delete category (admin only)

**Implementation checklist:**
- [ ] Create route file with request validation (Zod schema)
- [ ] Implement RBAC middleware (admin-only for mutations)
- [ ] Add Supabase queries with error handling
- [ ] Add audit logging for all mutations
- [ ] Write unit tests

#### 2.2 Holiday Template API
**File:** `/app/api/email-automations/templates/route.ts`

**Endpoints:**
- `GET /api/email-automations/templates` - List templates (with category filter)
- `GET /api/email-automations/templates/[id]` - Get single template
- `POST /api/email-automations/templates` - Create template (admin only)
- `PUT /api/email-automations/templates/[id]` - Update template (admin only)
- `DELETE /api/email-automations/templates/[id]` - Delete template (admin only)
- `POST /api/email-automations/templates/[id]/duplicate` - Duplicate template

**Implementation checklist:**
- [ ] Create route files with Zod validation
- [ ] Implement JSON/HTML content validation
- [ ] Add template versioning support
- [ ] Implement duplicate template logic
- [ ] Add preview endpoint for templates
- [ ] Write integration tests

#### 2.3 Scheduling API
**File:** `/app/api/email-automations/schedules/route.ts`

**Endpoints:**
- `GET /api/email-automations/schedules` - List schedules (with filters)
- `POST /api/email-automations/schedules` - Create schedule (admin only)
- `PUT /api/email-automations/schedules/[id]` - Update schedule (admin only)
- `DELETE /api/email-automations/schedules/[id]` - Cancel schedule (admin only)
- `POST /api/email-automations/schedules/[id]/execute` - Manually trigger execution

**Implementation checklist:**
- [ ] Create route files
- [ ] Implement schedule validation (dates, times)
- [ ] Add timezone conversion logic
- [ ] Implement manual execution endpoint
- [ ] Add schedule status update logic
- [ ] Write integration tests

#### 2.4 Send Logs API
**File:** `/app/api/email-automations/logs/route.ts`

**Endpoints:**
- `GET /api/email-automations/logs` - List send logs (with pagination)
- `GET /api/email-automations/logs/[id]` - Get single log
- `GET /api/email-automations/logs/stats` - Get statistics dashboard data

**Implementation checklist:**
- [ ] Create route files
- [ ] Implement pagination (limit/offset)
- [ ] Add filtering by status, schedule, date range
- [ ] Create statistics aggregation queries
- [ ] Add export to CSV functionality
- [ ] Write integration tests

---

## 🎨 Frontend UI Development

### Task 3: Master Controller Email Tab

#### 3.1 Update Master Controller Structure

**File:** `/app/master-controller/page.tsx`

**Changes needed:**
```typescript
// Update TabId type
type TabId = 'typography' | 'colors' | 'spacing' | 'templates' | 'components' | 'vault' | 'deployment' | 'performance' | 'email-automations';

// Add new tab to tabs array
{ id: 'email-automations' as TabId, label: 'Email Automations', icon: Mail },
```

**Checklist:**
- [ ] Add 'email-automations' to TabId type
- [ ] Import `Mail` icon from lucide-react
- [ ] Add tab to tabs array
- [ ] Add tab routing case in tab content section
- [ ] Update Quick Stats to include email automation stats

#### 3.2 Create EmailAutomationsTab Component

**File:** `/app/master-controller/components/tabs/EmailAutomationsTab.tsx`

**Component structure:**
```typescript
'use client';

export function EmailAutomationsTab() {
  const [activeSubTab, setActiveSubTab] = useState<'categories' | 'templates' | 'schedules' | 'logs'>('templates');

  return (
    <div>
      {/* Sub-tab navigation */}
      <div className="flex gap-4 mb-6">
        <SubTabButton active={activeSubTab === 'categories'} onClick={() => setActiveSubTab('categories')}>
          Categories
        </SubTabButton>
        <SubTabButton active={activeSubTab === 'templates'} onClick={() => setActiveSubTab('templates')}>
          Holiday Templates
        </SubTabButton>
        <SubTabButton active={activeSubTab === 'schedules'} onClick={() => setActiveSubTab('schedules')}>
          Schedules
        </SubTabButton>
        <SubTabButton active={activeSubTab === 'logs'} onClick={() => setActiveSubTab('logs')}>
          Send Logs
        </SubTabButton>
      </div>

      {/* Sub-tab content */}
      {activeSubTab === 'categories' && <CategoriesSection />}
      {activeSubTab === 'templates' && <HolidayTemplatesSection />}
      {activeSubTab === 'schedules' && <SchedulesSection />}
      {activeSubTab === 'logs' && <SendLogsSection />}
    </div>
  );
}
```

**Checklist:**
- [ ] Create EmailAutomationsTab.tsx with sub-tab navigation
- [ ] Implement responsive design matching existing tabs
- [ ] Add loading states for all sections
- [ ] Add error boundaries
- [ ] Ensure RBAC (read-only for non-admin users)

#### 3.3 Categories Section Component

**File:** `/app/master-controller/components/EmailAutomations/CategoriesSection.tsx`

**Features:**
- List view of all categories
- Create/edit category modal
- Delete confirmation
- Drag-and-drop reordering (display_order)

**Checklist:**
- [ ] Create CategoriesSection component
- [ ] Implement category list with cards
- [ ] Add create/edit modal with form validation
- [ ] Implement delete confirmation dialog
- [ ] Add drag-and-drop with @dnd-kit/core
- [ ] Connect to API endpoints

#### 3.4 Holiday Templates Section Component

**File:** `/app/master-controller/components/EmailAutomations/HolidayTemplatesSection.tsx`

**Features:**
- Grid view of holiday templates (grouped by category)
- Create new template button
- Edit template (opens editor modal)
- Duplicate template
- Delete template
- Preview template
- Filter by category, active status

**Checklist:**
- [ ] Create HolidayTemplatesSection component
- [ ] Implement template grid with preview cards
- [ ] Add category filter dropdown
- [ ] Create template editor modal (integrate email editor)
- [ ] Implement duplicate template action
- [ ] Add preview modal with responsive preview
- [ ] Connect to API endpoints

#### 3.5 Schedules Section Component

**File:** `/app/master-controller/components/EmailAutomations/SchedulesSection.tsx`

**Features:**
- Calendar view of scheduled sends
- List view of schedules (table format)
- Create schedule modal
- Edit schedule
- Cancel schedule
- View execution status
- Manual trigger button

**Checklist:**
- [ ] Create SchedulesSection component
- [ ] Implement calendar view (using @fullcalendar or similar)
- [ ] Create schedules table with sorting/filtering
- [ ] Add create/edit schedule modal
- [ ] Implement cancel schedule confirmation
- [ ] Add manual trigger button with confirmation
- [ ] Show execution progress/status
- [ ] Connect to API endpoints

#### 3.6 Send Logs Section Component

**File:** `/app/master-controller/components/EmailAutomations/SendLogsSection.tsx`

**Features:**
- Table view of send logs
- Filtering (by status, schedule, date range)
- Pagination
- Export to CSV
- Statistics dashboard
- Individual log details modal

**Checklist:**
- [ ] Create SendLogsSection component
- [ ] Implement logs table with pagination
- [ ] Add filter controls (status, date range)
- [ ] Create statistics dashboard cards
- [ ] Implement CSV export functionality
- [ ] Add log details modal
- [ ] Connect to API endpoints

---

## 🔗 GoHighLevel Integration

### Task 4: Contact Fetching with Tag Filter

#### 4.1 Extend GHL Client for Tag Filtering

**File:** `/lib/gohighlevel-client.ts`

**New method:**
```typescript
/**
 * Get contacts by tag
 */
async getContactsByTag(tag: string, limit: number = 100): Promise<GHLApiResponse<{ contacts: GHLContact[] }>> {
  const params = new URLSearchParams({
    locationId: this.locationId,
    tags: tag,
    limit: limit.toString(),
  });

  return this.makeRequest<{ contacts: GHLContact[] }>(`/contacts/?${params}`);
}
```

**Checklist:**
- [ ] Add `getContactsByTag` method to GoHighLevelClient
- [ ] Add pagination support for large contact lists
- [ ] Implement contact caching to reduce API calls
- [ ] Add rate limit handling
- [ ] Write unit tests

#### 4.2 Create Contact Fetching Service

**File:** `/lib/gohighlevel/contact-fetcher.ts`

**Features:**
- Fetch contacts by tag with pagination
- Filter contacts (active, has email, etc.)
- Deduplicate contacts
- Cache results temporarily

**Checklist:**
- [ ] Create ContactFetcherService class
- [ ] Implement pagination logic
- [ ] Add contact validation (valid email, etc.)
- [ ] Implement deduplication by email
- [ ] Add in-memory caching with TTL
- [ ] Write integration tests

---

## ✉️ Email Editor Integration

### Task 5: Research & Select Email Editor Library

**Requirements:**
- Must be compatible with Next.js 16 and React 19
- Modern, 2025-standard drag-and-drop interface
- Exports HTML and JSON
- Supports custom branding/themes
- Mobile-responsive preview
- Personalization token support

**Options to evaluate:**
1. **React Email** (react.email)
   - Pros: Modern, component-based, excellent Next.js support
   - Cons: More code-based than drag-and-drop

2. **Unlayer Email Editor** (unlayer.com)
   - Pros: Drag-and-drop, JSON export, theme support
   - Cons: Paid service, external dependency

3. **GrapeJS Email Builder**
   - Pros: Open-source, highly customizable
   - Cons: Requires wrapper for React integration

4. **Easy Email Editor** (@easyemailjs/editor)
   - Pros: Modern, React-based, open-source
   - Cons: Newer library, less mature

**Checklist:**
- [ ] Research all 4 options
- [ ] Test compatibility with Next.js 16 & React 19
- [ ] Evaluate licensing costs
- [ ] Create proof-of-concept for top 2 choices
- [ ] Make final selection based on:
  - Ease of use
  - Customization capabilities
  - Brand theme integration
  - Export quality (HTML/JSON)
  - Community support & documentation

### Task 6: Integrate Selected Email Editor

**File:** `/app/master-controller/components/EmailAutomations/EmailEditor/EmailEditorModal.tsx`

**Features:**
- Full-screen modal with email editor
- Brand theme injection (colors, fonts from master controller)
- Personalization token toolbar
- Mobile/desktop preview toggle
- Save draft functionality
- Export HTML/JSON
- Import existing template for editing

**Checklist:**
- [ ] Install selected email editor package
- [ ] Create EmailEditorModal component
- [ ] Integrate brand theme from useBrandColorsStore
- [ ] Integrate typography from useTypographyStore
- [ ] Add personalization token picker UI
- [ ] Implement save/load functionality
- [ ] Add preview modes (mobile/desktop/tablet)
- [ ] Test HTML output quality
- [ ] Write component tests

---

## 📬 WordPress Mail SMTP Integration

### Task 7: WordPress API Integration

#### 7.1 WordPress REST API Setup

**Environment variables needed:**
```env
WORDPRESS_API_URL=https://saabuildingblocks.com/wp-json
WORDPRESS_APP_PASSWORD=your-app-password-here
WORDPRESS_USERNAME=admin
```

**Checklist:**
- [ ] Create WordPress application password
- [ ] Test WP REST API access with credentials
- [ ] Document API endpoints needed
- [ ] Add environment variables to .env.example

#### 7.2 Create WordPress Email Service

**File:** `/lib/email/wordpress-smtp-service.ts`

**Features:**
```typescript
export class WordPressEmailService {
  private apiUrl: string;
  private username: string;
  private password: string;

  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
  }): Promise<{ success: boolean; error?: string }> {
    // POST to custom WP endpoint that uses WP Mail SMTP
    // Endpoint: /wp-json/saa/v1/send-email
  }

  async sendBatch(emails: Array<EmailOptions>): Promise<EmailResult[]> {
    // Batch sending with rate limiting
  }
}
```

**Checklist:**
- [ ] Create WordPressEmailService class
- [ ] Implement authentication with app password
- [ ] Add retry logic with exponential backoff
- [ ] Implement batch sending with rate limiting
- [ ] Add delivery status tracking
- [ ] Handle WordPress errors gracefully
- [ ] Write integration tests

#### 7.3 WordPress Custom Endpoint (PHP)

**File:** `wordpress/wp-content/plugins/saa-email-api/saa-email-api.php`

**Custom endpoint:**
```php
<?php
// POST /wp-json/saa/v1/send-email
add_action('rest_api_init', function() {
  register_rest_route('saa/v1', '/send-email', [
    'methods' => 'POST',
    'callback' => 'saa_send_email_callback',
    'permission_callback' => function() {
      return current_user_can('edit_posts');
    }
  ]);
});

function saa_send_email_callback($request) {
  $params = $request->get_params();

  $to = sanitize_email($params['to']);
  $subject = sanitize_text_field($params['subject']);
  $message = wp_kses_post($params['html']);
  $headers = ['Content-Type: text/html; charset=UTF-8'];

  if (!empty($params['replyTo'])) {
    $headers[] = 'Reply-To: ' . sanitize_email($params['replyTo']);
  }

  $sent = wp_mail($to, $subject, $message, $headers);

  return [
    'success' => $sent,
    'message' => $sent ? 'Email sent successfully' : 'Failed to send email'
  ];
}
```

**Checklist:**
- [ ] Create WordPress plugin directory
- [ ] Create plugin main file
- [ ] Register REST API endpoint
- [ ] Implement wp_mail wrapper
- [ ] Add authentication checks
- [ ] Test with WP Mail SMTP plugin
- [ ] Document plugin installation

---

## ⏰ Automated Scheduling System

### Task 8: Cron Job / Background Worker

#### 8.1 Choose Scheduling Approach

**Options:**
1. **Vercel Cron** (if deployed on Vercel)
   - Simple, built-in
   - Limited to certain plans

2. **Node-cron** (self-hosted)
   - Full control
   - Requires persistent Node process

3. **External service** (cron-job.org, EasyCron)
   - Reliable
   - External dependency

**Decision criteria:**
- [ ] Evaluate hosting environment (Vercel vs self-hosted)
- [ ] Check pricing for cron features
- [ ] Select best option based on reliability & cost

#### 8.2 Create Schedule Executor Service

**File:** `/lib/email-automations/schedule-executor.ts`

**Features:**
```typescript
export class ScheduleExecutor {
  /**
   * Check for schedules due today and execute
   */
  async executeDueSchedules(): Promise<ExecutionReport> {
    // 1. Query schedules where send_date = TODAY and status = 'scheduled'
    // 2. For each schedule:
    //    - Update status to 'processing'
    //    - Fetch contacts from GHL with tag filter
    //    - For each contact:
    //      - Load template
    //      - Replace personalization tokens
    //      - Send email via WordPress SMTP
    //      - Log send result
    //    - Update schedule status to 'completed' or 'failed'
    // 3. Return execution report
  }

  async executeSchedule(scheduleId: string): Promise<ExecutionResult> {
    // Execute single schedule
  }
}
```

**Checklist:**
- [ ] Create ScheduleExecutor class
- [ ] Implement due schedule query
- [ ] Add contact fetching from GHL
- [ ] Implement token replacement logic
- [ ] Integrate WordPress email sending
- [ ] Add comprehensive error handling
- [ ] Implement retry logic for failed sends
- [ ] Add execution progress tracking
- [ ] Write integration tests

#### 8.3 Create Cron API Endpoint

**File:** `/app/api/cron/execute-email-schedules/route.ts`

```typescript
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const executor = new ScheduleExecutor();
  const report = await executor.executeDueSchedules();

  return NextResponse.json(report);
}
```

**Checklist:**
- [ ] Create cron API route
- [ ] Add secret authentication
- [ ] Implement timeout protection (max execution time)
- [ ] Add comprehensive logging
- [ ] Return execution report
- [ ] Write integration tests

#### 8.4 Configure Cron Schedule

**For Vercel:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/execute-email-schedules",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**For external cron:**
```bash
# crontab
0 9 * * * curl -H "Authorization: Bearer $CRON_SECRET" https://saabuildingblocks.com/api/cron/execute-email-schedules
```

**Checklist:**
- [ ] Add CRON_SECRET to environment variables
- [ ] Configure cron schedule (daily at 9 AM)
- [ ] Test cron execution manually
- [ ] Monitor cron execution logs
- [ ] Set up failure alerts

---

## 🧪 Testing & Quality Assurance

### Task 9: Unit Tests

**Checklist:**
- [ ] Email editor component tests
- [ ] API route handler tests
- [ ] GHL contact fetcher tests
- [ ] WordPress email service tests
- [ ] Schedule executor tests
- [ ] Token replacement logic tests

### Task 10: Integration Tests

**Checklist:**
- [ ] End-to-end template creation workflow
- [ ] Schedule creation and execution
- [ ] Contact fetching from GHL
- [ ] Email sending via WordPress
- [ ] Error handling and retry logic
- [ ] Database transaction tests

### Task 11: Manual QA Checklist

**UI Testing:**
- [ ] Test all tabs in master controller
- [ ] Test email editor drag-and-drop
- [ ] Test template preview on mobile/desktop
- [ ] Test schedule calendar view
- [ ] Test send logs filtering and pagination
- [ ] Test CSV export

**Functional Testing:**
- [ ] Create category
- [ ] Create holiday template
- [ ] Edit template in email editor
- [ ] Create schedule for future date
- [ ] Manually trigger schedule execution
- [ ] Verify emails sent to test contacts
- [ ] Check send logs accuracy
- [ ] Test error scenarios (invalid email, API failures)

**RBAC Testing:**
- [ ] Admin can create/edit/delete
- [ ] Non-admin users see read-only views
- [ ] Unauthorized users cannot access API

---

## 🚀 Deployment & Monitoring

### Task 12: Environment Setup

**Production environment variables:**
```env
# GoHighLevel
GOHIGHLEVEL_API_KEY=pit-...
GOHIGHLEVEL_LOCATION_ID=...

# WordPress
WORDPRESS_API_URL=https://saabuildingblocks.com/wp-json
WORDPRESS_USERNAME=...
WORDPRESS_APP_PASSWORD=...

# Email
RESEND_API_KEY=... (fallback)
N8N_EMAIL_WEBHOOK_URL=... (fallback)

# Cron
CRON_SECRET=... (secure random string)

# Database
DATABASE_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**Checklist:**
- [ ] Add all environment variables to production
- [ ] Verify WordPress API access
- [ ] Verify GHL API access
- [ ] Test email sending
- [ ] Configure cron secret

### Task 13: Database Migration

**Checklist:**
- [ ] Backup production database
- [ ] Run migration scripts in transaction
- [ ] Verify table creation
- [ ] Verify RLS policies
- [ ] Test API access from application
- [ ] Rollback plan documented

### Task 14: Deployment

**Checklist:**
- [ ] Build and test locally
- [ ] Deploy to staging environment
- [ ] Run full QA on staging
- [ ] Deploy to production
- [ ] Smoke test all features
- [ ] Monitor error logs for 24 hours

### Task 15: Monitoring & Alerts

**Checklist:**
- [ ] Set up Supabase logging for email_send_logs
- [ ] Configure alerts for failed schedule executions
- [ ] Monitor API rate limits (GHL, WordPress)
- [ ] Set up dashboard for email statistics
- [ ] Document troubleshooting procedures

---

## 📝 Documentation

### Task 16: User Documentation

**Checklist:**
- [ ] Write user guide for creating email templates
- [ ] Document personalization tokens
- [ ] Explain scheduling system
- [ ] Create troubleshooting guide
- [ ] Record video tutorial

### Task 17: Developer Documentation

**Checklist:**
- [ ] API endpoint documentation
- [ ] Database schema documentation
- [ ] Architecture diagram
- [ ] Deployment guide
- [ ] Contributing guidelines

---

## 🎯 Success Criteria

**The email automation system is complete when:**

✅ **Database**
- All 4 tables created with proper indexes and RLS
- Migration scripts tested and documented

✅ **Backend**
- All API endpoints implemented and tested
- GoHighLevel tag filtering works
- WordPress email sending works
- Cron job executes schedules automatically

✅ **Frontend**
- Email Automations tab visible in master controller
- Users can create categories and templates
- Email editor works smoothly
- Templates can be scheduled
- Send logs are visible and filterable

✅ **Integration**
- Contacts fetched from GHL with "active-downline" tag
- Emails sent via WordPress Mail SMTP
- Personalization tokens replaced correctly
- Brand theme applied to emails

✅ **Testing**
- All unit tests passing
- Integration tests passing
- Manual QA completed
- No critical bugs

✅ **Deployment**
- Deployed to production
- Cron job running daily
- Monitoring and alerts configured

---

## 🗓️ Estimated Timeline

**Phase 1: Foundation (1 week)**
- Database schema design & migration
- Backend API skeleton
- Master controller tab structure

**Phase 2: Core Features (2 weeks)**
- Email editor integration
- Template CRUD operations
- GoHighLevel contact fetching
- WordPress email service

**Phase 3: Automation (1 week)**
- Schedule management
- Cron job implementation
- Token replacement logic
- Send logging

**Phase 4: Polish & Testing (1 week)**
- UI refinements
- Comprehensive testing
- Bug fixes
- Documentation

**Phase 5: Deployment (3 days)**
- Production deployment
- Monitoring setup
- User training

**Total: ~5-6 weeks for full implementation**

---

## 📌 Priority Order

**HIGH PRIORITY (Week 1):**
1. Database schema creation
2. Category & Template API
3. Email Automations tab UI
4. Email editor integration

**MEDIUM PRIORITY (Week 2-3):**
5. GoHighLevel contact fetching
6. WordPress email service
7. Schedule management
8. Send logging

**LOW PRIORITY (Week 4-5):**
9. Cron automation
10. Statistics dashboard
11. CSV export
12. Advanced filtering

---

## 🔗 Related Files & Dependencies

**Existing Files to Reference:**
- `/app/master-controller/page.tsx` - Tab structure
- `/lib/gohighlevel-client.ts` - GHL API client
- `/lib/email/email-service.ts` - Email service base
- `/app/api/gohighlevel/contacts/route.ts` - GHL API patterns

**New Files to Create:**
- `/app/master-controller/components/tabs/EmailAutomationsTab.tsx`
- `/app/master-controller/components/EmailAutomations/...` (all subcomponents)
- `/app/api/email-automations/...` (all API routes)
- `/lib/email-automations/...` (all services)
- `/database/migrations/20251122_email_automation_*.sql`

**Dependencies to Install:**
```bash
# Email editor (decision pending - see Task 5)
npm install <selected-email-editor>

# Calendar view
npm install @fullcalendar/react @fullcalendar/daygrid

# CSV export
npm install papaparse
npm install -D @types/papaparse

# Date/time utilities
npm install date-fns
npm install date-fns-tz
```

---

**Created by:** Claude Code
**Last updated:** 2025-11-22
**Status:** Ready for implementation
