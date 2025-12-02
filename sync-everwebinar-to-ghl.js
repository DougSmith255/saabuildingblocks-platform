#!/usr/bin/env node

/**
 * EverWebinar to GoHighLevel Sync Script
 *
 * This script automatically syncs new registrants from EverWebinar to GoHighLevel.
 * It can be run manually or scheduled via cron.
 *
 * Features:
 * - Fetches all EverWebinar registrants
 * - Checks which ones don't exist in GoHighLevel
 * - Adds missing contacts with "everwebinar" tag
 * - Enriches with geolocation data from IP addresses
 * - Logs all actions for auditing
 *
 * Usage:
 *   node sync-everwebinar-to-ghl.js
 *
 * Cron example (run daily at 2 AM):
 *   0 2 * * * /usr/bin/node /home/claude-flow/sync-everwebinar-to-ghl.js >> /var/log/everwebinar-sync.log 2>&1
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// Configuration - fetch from Token Vault in production
const CONFIG = {
  everwebinar: {
    apiKey: '9e9f46b8-8bf3-471c-af17-0525da0896f6',
    webinarId: '2'
  },
  ghl: {
    apiToken: 'pit-7a10b4b4-ddb7-45a4-8460-ff2d36fbd407',
    locationId: 'wmYRsn57bNL8Z2tMlIZ7'
  },
  logDir: '/var/log',
  rateLimit: 500 // ms between API calls
};

// Logging utility
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);

  // Also write to log file
  const logFile = path.join(CONFIG.logDir, 'everwebinar-sync.log');
  try {
    fs.appendFileSync(logFile, logMessage + '\n');
  } catch (err) {
    // Ignore if can't write to log file
  }
}

// Fetch all EverWebinar registrants
async function fetchEverWebinarRegistrants() {
  const allRegistrants = [];
  let currentPage = 1;
  let hasMore = true;

  while (hasMore) {
    const body = JSON.stringify({
      api_key: CONFIG.everwebinar.apiKey,
      webinar_id: CONFIG.everwebinar.webinarId,
      page: currentPage
    });

    const registrants = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.webinarjam.com',
        path: '/everwebinar/registrants',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
      req.write(body);
      req.end();
    });

    if (registrants.registrants && registrants.registrants.length > 0) {
      allRegistrants.push(...registrants.registrants);
      log(`Fetched page ${currentPage}: ${registrants.registrants.length} registrants`);
      currentPage++;

      // Check if there are more pages
      if (registrants.registrants.length < 25) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }

    await new Promise(r => setTimeout(r, CONFIG.rateLimit));
  }

  return allRegistrants;
}

// Fetch all GHL contacts
async function fetchAllGHLContacts() {
  const allContacts = [];
  let nextPageUrl = `https://services.leadconnectorhq.com/contacts/?locationId=${CONFIG.ghl.locationId}&limit=100`;

  while (nextPageUrl) {
    const contacts = await new Promise((resolve, reject) => {
      const url = new URL(nextPageUrl);
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CONFIG.ghl.apiToken}`,
          'Version': '2021-07-28'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
      req.end();
    });

    if (contacts.contacts && contacts.contacts.length > 0) {
      allContacts.push(...contacts.contacts);
    }

    nextPageUrl = contacts.meta?.nextPageUrl || null;
    await new Promise(r => setTimeout(r, 200));
  }

  return allContacts;
}

// Get IP geolocation
function getIPGeolocation(ip) {
  return new Promise((resolve) => {
    if (!ip || ip === '') {
      resolve({ country: 'US', state: null });
      return;
    }

    const options = {
      hostname: 'ipapi.co',
      path: `/${ip}/json/`,
      method: 'GET',
      headers: {
        'User-Agent': 'curl/7.68.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({
            country: result.country_code || 'US',
            state: result.region_code || null,
            city: result.city || null,
            timezone: result.timezone || null
          });
        } catch (e) {
          resolve({ country: 'US', state: null });
        }
      });
    });

    req.on('error', () => resolve({ country: 'US', state: null }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ country: 'US', state: null });
    });
    req.end();
  });
}

// Add contact to GHL
function addContactToGHL(registrant, geoData) {
  return new Promise((resolve, reject) => {
    const payload = {
      firstName: registrant.first_name,
      lastName: registrant.last_name,
      email: registrant.email,
      locationId: CONFIG.ghl.locationId,
      tags: ['everwebinar'],
      source: 'EverWebinar',
      country: geoData.country,
      customFields: []
    };

    // Add phone if exists
    if (registrant.phone) {
      payload.phone = registrant.phone;
    }

    // Add state if available
    if (geoData.state) {
      payload.state = geoData.state;
    }

    // Add city if available
    if (geoData.city) {
      payload.city = geoData.city;
    }

    // Add timezone if available
    if (geoData.timezone) {
      payload.timezone = geoData.timezone;
    }

    const body = JSON.stringify(payload);

    const options = {
      hostname: 'services.leadconnectorhq.com',
      path: '/contacts/',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.ghl.apiToken}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve({ success: true, contact: result.contact });
          } else {
            resolve({ success: false, error: result, statusCode: res.statusCode });
          }
        } catch (e) {
          resolve({ success: false, error: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.write(body);
    req.end();
  });
}

// Main sync function
async function sync() {
  log('=== Starting EverWebinar to GoHighLevel Sync ===');

  try {
    // Fetch EverWebinar registrants
    log('Fetching EverWebinar registrants...');
    const registrants = await fetchEverWebinarRegistrants();
    log(`Total EverWebinar registrants: ${registrants.length}`);

    // Fetch GHL contacts
    log('Fetching GoHighLevel contacts...');
    const ghlContacts = await fetchAllGHLContacts();
    log(`Total GoHighLevel contacts: ${ghlContacts.length}`);

    // Create email lookup map (case-insensitive)
    const ghlEmailMap = new Map();
    ghlContacts.forEach(c => {
      if (c.email) {
        ghlEmailMap.set(c.email.toLowerCase().trim(), c);
      }
    });

    // Find missing contacts
    const missing = [];
    registrants.forEach(reg => {
      const email = reg.email.toLowerCase().trim();
      if (!ghlEmailMap.has(email)) {
        missing.push(reg);
      }
    });

    log(`Found ${missing.length} new contacts to add`);

    if (missing.length === 0) {
      log('No new contacts to sync. Exiting.');
      return;
    }

    // Add missing contacts
    let added = 0;
    let failed = 0;

    for (const reg of missing) {
      try {
        log(`Processing: ${reg.email}`);

        // Get geolocation
        const geoData = await getIPGeolocation(reg.ip);

        // Add to GHL
        const result = await addContactToGHL(reg, geoData);

        if (result.success) {
          added++;
          log(`✓ Successfully added: ${reg.email} (ID: ${result.contact.id})`);
        } else {
          failed++;
          log(`✗ Failed to add: ${reg.email} - ${JSON.stringify(result.error)}`, 'ERROR');
        }

        await new Promise(r => setTimeout(r, CONFIG.rateLimit));
      } catch (err) {
        failed++;
        log(`✗ Error processing ${reg.email}: ${err.message}`, 'ERROR');
      }
    }

    log(`=== Sync Complete ===`);
    log(`Total processed: ${missing.length}`);
    log(`Successfully added: ${added}`);
    log(`Failed to add: ${failed}`);

  } catch (err) {
    log(`Fatal error: ${err.message}`, 'ERROR');
    log(err.stack, 'ERROR');
    process.exit(1);
  }
}

// Run sync
sync().catch(err => {
  log(`Unhandled error: ${err.message}`, 'ERROR');
  process.exit(1);
});
