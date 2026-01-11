# Email & UI Fixes Todo List

## Email Fixes (Priority) - COMPLETED
1. [x] Fix logo in all emails - switched to hosted URL (`https://saabuildingblocks.pages.dev/images/saa-logo-gold.png`)
2. [x] Change "Hi [name]" greeting to WHITE color (not gold) - standardized across all emails
3. [x] Button colors already correct - brand yellow (#ffd700) background with off-black text
4. [x] DELETED duplicate InvitationEmail template and sendInvitationEmail function
5. [x] Standardized signature block across ALL emails:
   ```
   Best regards,
   The SAA Team
   Smart Agent Alliance
   team@smartagentalliance.com
   ```

## Remaining Email Fixes
6. [ ] Fix mobile background extending outside border on all emails (needs investigation)

## Agent Portal Fixes
7. [ ] Fix template previews not showing in templates tab
8. [ ] Combine B&W template versions to save space (need to discuss approach)

## Dashboard Icon Fixes
9. [ ] Update dashboard icons with 3D effect like home page "Why eXp Realty?" section
    - Match style of "Industry Leading Splits" and "Passive Income Potential" cards
    - Adjust highlight color (main color + slightly lighter highlight)
    - Apply same shadow/3D effect

## Email Branding Fixes
10. [ ] Set up BIMI for S logo in email sender avatar (requires DNS configuration)

## Files Modified
- `/home/claude-flow/packages/admin-dashboard/lib/email/templates/components/Layout.tsx` - Logo URL, greeting color, signature
- `/home/claude-flow/packages/admin-dashboard/lib/email/templates/PasswordResetEmail.tsx` - Added EmailSignature
- `/home/claude-flow/packages/admin-dashboard/lib/email/templates/UsernameReminderEmail.tsx` - Updated EmailSignature
- `/home/claude-flow/packages/admin-dashboard/lib/email/templates/WelcomeEmail.tsx` - Updated EmailSignature
- `/home/claude-flow/packages/admin-dashboard/lib/email/templates/AccountLockedEmail.tsx` - Updated EmailSignature
- `/home/claude-flow/packages/admin-dashboard/lib/email/templates/ApplyInstructionsEmail.tsx` - Updated signature, greeting color

## Files Deleted
- `/home/claude-flow/packages/admin-dashboard/lib/email/templates/InvitationEmail.tsx`

## Functions Removed
- `sendInvitationEmail` from `/home/claude-flow/packages/admin-dashboard/lib/email/send.ts`

## Test Emails Sent
All 5 emails sent to sheldontosmart@gmail.com for verification.
