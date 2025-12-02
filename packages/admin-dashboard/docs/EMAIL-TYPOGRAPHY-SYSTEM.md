# Email Typography System

## Overview

The email typography system provides **automatic, centralized font and style management** for all email templates. When you update typography settings in the UI, all future emails automatically use the new styles without any manual template modifications.

## How It Works Automatically

### Architecture Flow

```
1. User updates typography in Master Controller → Typography Tab
   ↓
2. Settings saved to email_typography_settings table (Supabase)
   ↓
3. Email sending triggered (schedule or manual)
   ↓
4. System calls /api/email-automations/render-template
   ↓
5. Render API fetches active typography settings from database
   ↓
6. CSS generated dynamically with generateEmailTypographyCSS()
   ↓
7. Custom fonts injected via generateFontFaceCSS()
   ↓
8. Typography CSS injected into base template
   ↓
9. Placeholders replaced ({{emailBody}}, {{emailTitle}}, etc.)
   ↓
10. Fully rendered HTML sent via GoHighLevel
```

### Key Components

#### 1. Database Table: `email_typography_settings`

Stores all typography settings with columns for:
- **H1 Settings**: font_family, font_weight, font_size, color, line_height, letter_spacing, text_shadow
- **H2 Settings**: font_family, font_weight, font_size, color, line_height, letter_spacing
- **H3 Settings**: font_family, font_weight, font_size, color, line_height, letter_spacing
- **Body Settings**: font_family, font_weight, font_size, color, line_height, letter_spacing
- **Link Settings**: link_color, link_hover_color
- **Metadata**: is_active, created_at, updated_at

Only one row has `is_active = true` at a time.

#### 2. API Endpoints

**GET /api/email-automations/typography**
- Fetches the active typography settings
- Returns defaults if no settings exist
- Used by the Typography Section UI

**PUT /api/email-automations/typography**
- Updates or inserts typography settings
- Sets updated_at timestamp
- UI automatically refetches after save

**POST /api/email-automations/render-template**
- Renders email with dynamic typography
- Required body: `{ baseTemplate, emailBody, emailTitle, unsubscribeUrl? }`
- Returns fully rendered HTML with typography applied

#### 3. Typography Generator Library (`lib/email-typography-generator.ts`)

**generateEmailTypographyCSS(settings)**
- Converts database settings to email-safe CSS
- Includes web-safe font fallbacks (Georgia, Arial)
- Targets `.body-content` selector for scoped styles

**generateFontFaceCSS()**
- Creates @font-face declarations for custom fonts
- Fonts hosted on Cloudflare R2: https://assets.saabuildingblocks.com/fonts/
- Supports: Taskor, Amulya, Synonym

**injectTypographyIntoTemplate(templateHtml, settings)**
- Finds `</style>` tag in template
- Injects combined CSS (fonts + typography)
- Falls back to `</head>` injection if no style tag found

#### 4. Email Automation Sender (`lib/email-automation-sender.ts`)

**sendAutomatedEmail(options)**
- Fetches contact from GoHighLevel
- Replaces personalization tokens
- Calls render-template API for typography injection
- Creates send log entry
- Sends via GoHighLevel API
- Updates send log with result

**sendBatchEmails(options)**
- Processes multiple contacts sequentially
- Avoids rate limits with 1-second delay
- Tracks success/failure counts
- Updates schedule status when complete

#### 5. Schedule Trigger (`app/api/email-automations/schedules/[id]/trigger/route.ts`)

- Fetches schedule with template data
- Loads contacts from GoHighLevel (test or production mode)
- Calls `sendBatchEmails()` which automatically uses dynamic typography
- Returns statistics (totalSent, totalFailed, results)

## When You Add New Categories & Templates

**YES, they automatically use the typography system!**

Here's why:

### 1. All Email Sends Go Through `sendAutomatedEmail()`

When you create a new category or template, the email sending flow is:

```typescript
// New category template created in UI
// ↓
// Schedule created for that template
// ↓
// Schedule triggered (manually or via cron)
// ↓
// schedule/[id]/trigger calls sendBatchEmails()
// ↓
// sendBatchEmails() calls sendAutomatedEmail() for each contact
// ↓
// sendAutomatedEmail() calls renderEmailWithTypography()
// ↓
// renderEmailWithTypography() fetches active typography settings
// ↓
// CSS generated and injected automatically
```

### 2. No Manual Integration Required

The system is **completely automatic** because:

1. **Centralized rendering** - All emails go through `/api/email-automations/render-template`
2. **Database-driven** - Typography settings fetched from single source of truth
3. **Template-agnostic** - Works with any HTML content in `{{emailBody}}`
4. **Base template system** - Two templates (team/external) both support dynamic typography

### 3. Template Structure

**Category Templates Store Only Content**
```html
<!-- holiday_email_templates.email_html -->
<h1>Happy Halloween!</h1>
<p>Dear {{firstName}},</p>
<p>Enjoy this spooky season...</p>
```

**Base Templates Provide Structure**
```html
<!-- templates/base-email-template-external.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Static styles */
  </style>
  <!-- Dynamic typography injected here by injectTypographyIntoTemplate() -->
</head>
<body>
  <div class="body-content">
    {{emailBody}} <!-- Category template content inserted here -->
  </div>
</body>
</html>
```

**Final Rendered Output**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Static styles */

    /* Dynamic Typography Settings */
    @font-face { font-family: 'Taskor'; ... }
    .body-content h1 {
      color: #ffd700;
      font-family: 'Taskor', Georgia, serif;
      font-size: 32px;
      /* ... all typography settings */
    }
  </style>
</head>
<body>
  <div class="body-content">
    <h1>Happy Halloween!</h1>
    <p>Dear John,</p>
    <p>Enjoy this spooky season...</p>
  </div>
</body>
</html>
```

## Updating Typography

### UI Flow

1. Navigate to **Master Controller → Email Automations → Typography**
2. Adjust settings using color pickers, font selectors, and inputs
3. See changes **live in the preview** section
4. Click **"Save Changes"**
5. All future emails automatically use new settings

### Supported Fonts

**Custom Fonts (from Cloudflare R2)**
- **Taskor** - Serif, professional, elegant
- **Amulya** - Variable font, 100-900 weight
- **Synonym** - Variable font, clean sans-serif

**Web-Safe Fallbacks**
- Taskor → Georgia, "Times New Roman", serif
- Amulya → Georgia, "Times New Roman", serif
- Synonym → Arial, Helvetica, sans-serif

### Typography Settings

**H1 (Main Headlines)**
- Font Family
- Font Weight (100-900)
- Font Size (px)
- Color
- Line Height
- Letter Spacing
- Text Shadow (optional, for glow effects)

**H2 (Section Headers)**
- Font Family
- Font Weight
- Font Size
- Color
- Line Height
- Letter Spacing

**H3 (Subheadings)**
- Font Family
- Font Weight
- Font Size
- Color
- Line Height
- Letter Spacing

**Body Text**
- Font Family
- Font Weight
- Font Size
- Color
- Line Height
- Letter Spacing

**Links**
- Link Color
- Hover Color

## Testing Typography

### Test via Schedule Trigger

```bash
# 1. Create test schedule with template
# 2. Trigger with test_mode

POST /api/email-automations/schedules/{id}/trigger
{
  "test_mode": true,
  "test_emails": ["your-email@example.com"]
}
```

### Test via Direct API Call

```bash
curl -X POST http://localhost:3000/api/email-automations/render-template \
  -H "Content-Type: application/json" \
  -d '{
    "baseTemplate": "external",
    "emailBody": "<h1>Test Heading</h1><p>Test body content with <a href=\"#\">a link</a></p>",
    "emailTitle": "Test Email Subject",
    "unsubscribeUrl": "https://example.com/unsubscribe"
  }'
```

## Future Enhancements

1. **Multiple Typography Presets** - Save and switch between different style sets
2. **A/B Testing** - Test different typography settings with contact segments
3. **Typography Templates** - Pre-built style packages (Modern, Classic, Bold)
4. **Font Upload** - Allow custom font file uploads beyond the 3 included fonts
5. **Per-Category Overrides** - Allow specific categories to use different typography
6. **Template-Specific Typography** - Individual templates can override global settings

## Technical Notes

### Email Client Compatibility

- **Custom Fonts**: Work in most modern email clients (Gmail, Outlook.com, Apple Mail)
- **Fallback Fonts**: Ensure readability when custom fonts fail to load
- **Inline Styles**: Generated CSS uses class selectors for better maintainability
- **Web Fonts**: WOFF2 format provides best compression and browser support

### Performance

- **Typography Fetch**: Single database query per email render
- **CSS Generation**: Lightweight string interpolation
- **Caching**: Typography settings can be cached (future enhancement)
- **Font Loading**: Fonts loaded from CDN (Cloudflare R2) with `font-display: swap`

### Security

- **SQL Injection**: Protected by Supabase parameterized queries
- **XSS Prevention**: Template content sanitized before rendering
- **API Authentication**: Service role key required for render-template API
- **Font URLs**: Served from trusted Cloudflare R2 bucket

## Summary

**Question**: "whenever we add a new category and template, they will use the same system right? automatically?"

**Answer**: **YES! Absolutely automatic.**

Every email sent through the system:
1. Goes through the centralized `sendAutomatedEmail()` function
2. Which calls `renderEmailWithTypography()`
3. Which fetches the active typography settings from the database
4. Which generates and injects dynamic CSS
5. Which is applied to all content in `{{emailBody}}`

**No manual steps required. No template modifications needed. It just works.**
