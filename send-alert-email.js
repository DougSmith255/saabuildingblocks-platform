#!/usr/bin/env node

/**
 * Alert Email Sender
 *
 * Sends failure notification emails for automation scripts.
 * Uses GoHighLevel API (Private Integration Token).
 *
 * Usage:
 *   node send-alert-email.js --automation "EverWebinar Sync" --error "API timeout"
 *   node send-alert-email.js --automation "Email Automation" --error "Failed to connect to database"
 */

const https = require('https');

// Configuration - Uses GoHighLevel Private Integration Token
const GHL_API_KEY = process.env.GHL_API_KEY || 'pit-7a10b4b4-ddb7-45a4-8460-ff2d36fbd407';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || 'wmYRsn57bNL8Z2tMlIZ7';
const ALERT_CONTACT_EMAIL = 'doug.smart@exprealty.com'; // Must be a contact in GHL

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    automation: 'Unknown Automation',
    error: 'Unknown error occurred',
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--automation' && args[i + 1]) {
      result.automation = args[i + 1];
      i++;
    } else if (args[i] === '--error' && args[i + 1]) {
      result.error = args[i + 1];
      i++;
    }
  }

  return result;
}

/**
 * Find contact ID by email in GoHighLevel
 */
async function getContactIdByEmail(email) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'services.leadconnectorhq.com',
      path: `/contacts/search/duplicate?locationId=${GHL_LOCATION_ID}&email=${encodeURIComponent(email)}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Version': '2021-07-28',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.contact && result.contact.id) {
            resolve(result.contact.id);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.setTimeout(10000, () => {
      req.destroy();
      resolve(null);
    });
    req.end();
  });
}

/**
 * Send alert email via GoHighLevel API
 */
async function sendAlertEmail(automation, errorMessage) {
  const timestamp = new Date().toISOString();
  const formattedDate = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // First, get the contact ID for the alert recipient
  console.log(`Looking up contact: ${ALERT_CONTACT_EMAIL}`);
  const contactId = await getContactIdByEmail(ALERT_CONTACT_EMAIL);

  if (!contactId) {
    console.error(`❌ Contact not found in GHL: ${ALERT_CONTACT_EMAIL}`);
    return false;
  }

  console.log(`Found contact ID: ${contactId}`);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fa; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
    .alert-box { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .error-box { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Automation Failure Alert</h1>
    </div>
    <div class="content">
      <div class="alert-box">
        <strong>Automation:</strong> ${automation}<br>
        <strong>Time:</strong> ${formattedDate} (EST)
      </div>

      <h3>Error Details:</h3>
      <div class="error-box">${errorMessage}</div>

      <p style="margin-top: 20px;">
        <strong>What to do:</strong>
        <ul>
          <li>Check the log file at <code>/var/log/</code></li>
          <li>Review the Master Controller Automations tab</li>
          <li>The automation will retry on its next scheduled run</li>
        </ul>
      </p>
    </div>
    <div class="footer">
      Smart Agent Alliance - Automation Monitoring<br>
      ${timestamp}
    </div>
  </div>
</body>
</html>
`;

  const payload = JSON.stringify({
    type: 'Email',
    contactId: contactId,
    subject: `🚨 [ALERT] ${automation} Failed`,
    html: htmlContent,
    emailFrom: 'doug@smartagentalliance.com',
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'services.leadconnectorhq.com',
      path: '/conversations/messages',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log(`✅ Alert email sent successfully to ${ALERT_CONTACT_EMAIL}`);
          resolve(true);
        } else {
          console.error(`❌ Failed to send alert email: ${res.statusCode} ${data}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.error(`❌ Error sending alert email: ${err.message}`);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.error('❌ Alert email request timed out');
      resolve(false);
    });

    req.write(payload);
    req.end();
  });
}

// Main execution
const { automation, error } = parseArgs();
console.log(`📧 Sending alert email for: ${automation}`);
console.log(`   Error: ${error}`);

sendAlertEmail(automation, error).then((success) => {
  process.exit(success ? 0 : 1);
});
