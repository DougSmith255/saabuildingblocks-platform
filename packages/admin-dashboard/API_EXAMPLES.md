# Master Controller Deployment API Examples

**Created:** 2025-10-30
**Purpose:** Example API requests and responses for testing and integration

---

## Table of Contents

1. [CSS Regeneration API](#css-regeneration-api)
2. [Deployment API](#deployment-api)
3. [WordPress Webhook API](#wordpress-webhook-api)
4. [Testing with cURL](#testing-with-curl)
5. [Frontend Integration Examples](#frontend-integration-examples)

---

## CSS Regeneration API

### POST /api/master-controller/regenerate-css

Triggers CSS regeneration from Master Controller settings stored in Supabase.

#### Request

```bash
POST /api/master-controller/regenerate-css
Authorization: Basic YnVpbGRlcl91c2VyOks4bU4jQnVpbGQ3JFEy
Content-Type: application/json
```

No request body required.

#### Success Response (200)

```json
{
  "success": true,
  "message": "CSS regenerated successfully",
  "data": {
    "filePath": "/static-master-controller.css",
    "fileSize": "12KB",
    "fileSizeBytes": 12345,
    "source": "database",
    "timestamp": "2025-10-30T12:34:56.789Z",
    "duration": "1234ms",
    "generatedAt": "2025-10-30T12:34:56.789Z"
  }
}
```

**Field Descriptions:**
- `filePath`: Public URL path to the CSS file
- `fileSize`: Human-readable file size
- `fileSizeBytes`: Exact file size in bytes
- `source`: Either "database" (from Supabase) or "defaults" (fallback)
- `timestamp`: File modification timestamp
- `duration`: Time taken to regenerate CSS
- `generatedAt`: When the regeneration completed

#### Error Response (500)

```json
{
  "success": false,
  "error": "Failed to regenerate CSS",
  "details": "npm ENOENT: no such file or directory",
  "duration": "567ms",
  "stack": "Error: ...\n    at ..." // Only in development
}
```

---

### GET /api/master-controller/regenerate-css

Get status of current CSS file without regenerating.

#### Request

```bash
GET /api/master-controller/regenerate-css
Authorization: Basic YnVpbGRlcl91c2VyOks4bU4jQnVpbGQ3JFEy
```

#### Success Response - File Exists (200)

```json
{
  "success": true,
  "data": {
    "exists": true,
    "filePath": "/static-master-controller.css",
    "fileSize": "12KB",
    "fileSizeBytes": 12345,
    "lastModified": "2025-10-30T12:34:56.789Z",
    "age": 3600000
  }
}
```

**Field Descriptions:**
- `exists`: Whether the CSS file exists
- `age`: Time since last modification (milliseconds)

#### Success Response - File Not Found (200)

```json
{
  "success": true,
  "data": {
    "exists": false,
    "filePath": "/static-master-controller.css",
    "message": "CSS file not yet generated"
  }
}
```

---

## Deployment API

### POST /api/master-controller/deploy

Triggers GitHub Actions workflow to deploy static site to Cloudflare Pages.

**Rate Limit:** 1 deployment per 5 minutes

#### Request

```bash
POST /api/master-controller/deploy
Authorization: Basic YnVpbGRlcl91c2VyOks4bU4jQnVpbGQ3JFEy
Content-Type: application/json
```

**Body (all fields optional):**

```json
{
  "deploymentType": "incremental",
  "skipBuildCache": false
}
```

**Field Descriptions:**
- `deploymentType`: Either "incremental" or "full" (default: "incremental")
- `skipBuildCache`: Skip Next.js build cache (default: false)

#### Success Response (200)

```json
{
  "success": true,
  "message": "Deployment triggered successfully",
  "data": {
    "workflowUrl": "https://github.com/DougSmith255/saabuildingblocks-platform/actions/workflows/deploy-cloudflare.yml",
    "status": "triggered",
    "deploymentType": "incremental",
    "skipBuildCache": false,
    "duration": "234ms",
    "triggeredAt": "2025-10-30T12:34:56.789Z",
    "note": "Workflow will start shortly. Check GitHub Actions for progress."
  }
}
```

**Field Descriptions:**
- `workflowUrl`: GitHub Actions workflow page to monitor progress
- `status`: Current status ("triggered")
- `triggeredAt`: Timestamp when workflow was triggered

#### Rate Limit Error (429)

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please wait 243 seconds before deploying again",
  "remainingSeconds": 243
}
```

#### Error Response (500)

```json
{
  "success": false,
  "error": "Failed to trigger deployment",
  "details": "GitHub API error: 401 Bad credentials",
  "duration": "123ms",
  "stack": "Error: ...\n    at ..." // Only in development
}
```

---

### GET /api/master-controller/deploy

Get deployment status and rate limit information.

#### Request

```bash
GET /api/master-controller/deploy
Authorization: Basic YnVpbGRlcl91c2VyOks4bU4jQnVpbGQ3JFEy
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "canDeploy": true,
    "remainingSeconds": 0,
    "lastDeployment": "2025-10-30T11:55:00.000Z",
    "cooldownMinutes": 5,
    "recentDeployments": [
      {
        "id": "uuid-here",
        "created_at": "2025-10-30T11:55:00.000Z",
        "trigger_type": "deploy",
        "triggered_by": "master-controller",
        "status": "triggered",
        "duration": 234,
        "metadata": {
          "deployment_type": "incremental",
          "skip_build_cache": false
        }
      }
    ]
  }
}
```

**Field Descriptions:**
- `canDeploy`: Whether deployment is allowed (not rate limited)
- `remainingSeconds`: Seconds to wait before next deployment (0 if can deploy)
- `lastDeployment`: ISO timestamp of last deployment (null if none)
- `cooldownMinutes`: Rate limit duration in minutes
- `recentDeployments`: Last 5 deployments from database

---

## WordPress Webhook API

### POST /api/webhooks/wordpress

Receives WordPress blog post publish/update events and triggers deployment.

**Security:** Whitelisted in middleware (no HTTP Basic Auth required)

#### Request (from WordPress plugin)

```bash
POST /api/webhooks/wordpress
Content-Type: application/json
User-Agent: WordPress/6.4; https://wp.saabuildingblocks.com
```

**Body:**

```json
{
  "post_id": 123,
  "post_slug": "my-awesome-blog-post",
  "post_title": "My Awesome Blog Post",
  "event_type": "publish"
}
```

**Required Fields:**
- `post_id`: WordPress post ID (number)
- `post_slug`: Post slug (string)

**Optional Fields:**
- `post_title`: Post title (string)
- `event_type`: Event type (e.g., "publish", "update")

#### Success Response (200)

```json
{
  "success": true,
  "message": "Deployment triggered successfully",
  "data": {
    "post_id": 123,
    "post_slug": "my-awesome-blog-post",
    "workflowUrl": "https://github.com/DougSmith255/saabuildingblocks-platform/actions/workflows/deploy-cloudflare.yml",
    "status": "triggered",
    "duration": "234ms",
    "triggeredAt": "2025-10-30T12:34:56.789Z"
  }
}
```

#### Validation Error (400)

```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "post_id and post_slug are required"
}
```

#### Error Response (500)

```json
{
  "success": false,
  "error": "Failed to trigger deployment",
  "details": "GitHub API error: 401 Bad credentials",
  "duration": "123ms"
}
```

---

### GET /api/webhooks/wordpress

Health check endpoint for WordPress webhook.

#### Request

```bash
GET /api/webhooks/wordpress
```

#### Response (200)

```json
{
  "success": true,
  "message": "WordPress webhook endpoint operational",
  "endpoint": "/api/webhooks/wordpress",
  "method": "POST",
  "expectedPayload": {
    "post_id": "number (required)",
    "post_slug": "string (required)",
    "post_title": "string (optional)",
    "event_type": "string (optional, e.g., \"publish\" or \"update\")"
  }
}
```

---

## Testing with cURL

### Test CSS Regeneration

```bash
# Regenerate CSS
curl -X POST http://localhost:3001/api/master-controller/regenerate-css \
  -u builder_user:'K8mN#Build7$Q2' \
  -H "Content-Type: application/json" \
  | jq

# Check CSS status
curl -X GET http://localhost:3001/api/master-controller/regenerate-css \
  -u builder_user:'K8mN#Build7$Q2' \
  | jq
```

### Test Deployment API

```bash
# Check deployment status
curl -X GET http://localhost:3001/api/master-controller/deploy \
  -u builder_user:'K8mN#Build7$Q2' \
  | jq

# Trigger incremental deployment
curl -X POST http://localhost:3001/api/master-controller/deploy \
  -u builder_user:'K8mN#Build7$Q2' \
  -H "Content-Type: application/json" \
  -d '{"deploymentType": "incremental", "skipBuildCache": false}' \
  | jq

# Trigger full deployment (skip cache)
curl -X POST http://localhost:3001/api/master-controller/deploy \
  -u builder_user:'K8mN#Build7$Q2' \
  -H "Content-Type: application/json" \
  -d '{"deploymentType": "full", "skipBuildCache": true}' \
  | jq
```

### Test WordPress Webhook

```bash
# Health check
curl -X GET http://localhost:3001/api/webhooks/wordpress | jq

# Simulate WordPress webhook
curl -X POST http://localhost:3001/api/webhooks/wordpress \
  -H "Content-Type: application/json" \
  -H "User-Agent: WordPress/6.4; https://wp.saabuildingblocks.com" \
  -d '{
    "post_id": 123,
    "post_slug": "test-blog-post",
    "post_title": "Test Blog Post",
    "event_type": "publish"
  }' \
  | jq
```

---

## Frontend Integration Examples

### React/TypeScript Examples

#### CSS Regeneration Button

```typescript
'use client';

import { useState } from 'react';

export function RegenerateCSSButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/master-controller/regenerate-css', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to regenerate CSS');
      }

      setResult(data.data);
      console.log('CSS regenerated:', data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleRegenerate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Regenerating...' : 'Regenerate CSS'}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="font-semibold">Success!</p>
          <p>File Size: {result.fileSize}</p>
          <p>Source: {result.source}</p>
          <p>Duration: {result.duration}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="font-semibold text-red-700">Error: {error}</p>
        </div>
      )}
    </div>
  );
}
```

#### Deploy Button with Rate Limit

```typescript
'use client';

import { useState, useEffect } from 'react';

interface DeployStatus {
  canDeploy: boolean;
  remainingSeconds: number;
  lastDeployment: string | null;
}

export function DeployButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<DeployStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch deployment status
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/master-controller/deploy');
      const data = await response.json();
      if (data.success) {
        setStatus(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch deployment status:', err);
    }
  };

  const handleDeploy = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/master-controller/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deploymentType: 'incremental',
          skipBuildCache: false,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || data.message || 'Failed to deploy');
      }

      console.log('Deployment triggered:', data.data);

      // Open GitHub Actions in new tab
      window.open(data.data.workflowUrl, '_blank');

      // Refresh status
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const canDeploy = status?.canDeploy ?? false;
  const remainingSeconds = status?.remainingSeconds ?? 0;

  return (
    <div>
      <button
        onClick={handleDeploy}
        disabled={loading || !canDeploy}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Deploying...' : 'Deploy to Cloudflare'}
      </button>

      {!canDeploy && remainingSeconds > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          Rate limited. Wait {remainingSeconds} seconds.
        </p>
      )}

      {status?.lastDeployment && (
        <p className="mt-2 text-sm text-gray-600">
          Last deployment: {new Date(status.lastDeployment).toLocaleString()}
        </p>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="font-semibold text-red-700">Error: {error}</p>
        </div>
      )}
    </div>
  );
}
```

#### Combined Workflow

```typescript
'use client';

import { useState } from 'react';

export function MasterControllerDeploymentPanel() {
  const [step, setStep] = useState<'idle' | 'regen' | 'deploy'>('idle');
  const [loading, setLoading] = useState(false);

  const handleFullWorkflow = async () => {
    setLoading(true);

    try {
      // Step 1: Regenerate CSS
      setStep('regen');
      const cssResponse = await fetch('/api/master-controller/regenerate-css', {
        method: 'POST',
      });
      const cssData = await cssResponse.json();

      if (!cssData.success) {
        throw new Error('Failed to regenerate CSS');
      }

      console.log('CSS regenerated:', cssData.data);

      // Step 2: Deploy to Cloudflare
      setStep('deploy');
      const deployResponse = await fetch('/api/master-controller/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deploymentType: 'incremental' }),
      });
      const deployData = await deployResponse.json();

      if (!deployData.success) {
        throw new Error(deployData.error || 'Failed to deploy');
      }

      console.log('Deployment triggered:', deployData.data);
      window.open(deployData.data.workflowUrl, '_blank');

      setStep('idle');
    } catch (err) {
      console.error('Workflow error:', err);
      alert(err instanceof Error ? err.message : 'Workflow failed');
      setStep('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleFullWorkflow}
        disabled={loading}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? (
          <>
            {step === 'regen' && 'Regenerating CSS...'}
            {step === 'deploy' && 'Deploying to Cloudflare...'}
          </>
        ) : (
          'Deploy Changes'
        )}
      </button>
    </div>
  );
}
```

---

## Error Handling Best Practices

### Check Response Status

```typescript
const response = await fetch('/api/master-controller/deploy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ deploymentType: 'incremental' }),
});

if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.error || `HTTP ${response.status}`);
}

const data = await response.json();
```

### Handle Rate Limits

```typescript
try {
  const response = await fetch('/api/master-controller/deploy', {
    method: 'POST',
  });
  const data = await response.json();

  if (response.status === 429) {
    // Rate limited
    alert(`Please wait ${data.remainingSeconds} seconds before deploying again`);
    return;
  }

  if (!data.success) {
    throw new Error(data.error);
  }

  // Success
  console.log('Deployed:', data.data);
} catch (err) {
  console.error('Deployment failed:', err);
}
```

---

## Monitoring Queries

### Check Recent Deployments

```sql
SELECT
  id,
  created_at,
  trigger_type,
  triggered_by,
  status,
  duration,
  metadata->>'deployment_type' as deployment_type,
  metadata->>'post_id' as post_id
FROM deployment_logs
ORDER BY created_at DESC
LIMIT 20;
```

### Deployment Success Rate

```sql
SELECT
  trigger_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'triggered') as triggered,
  COUNT(*) FILTER (WHERE status = 'error') as errors,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'triggered') / COUNT(*), 2) as success_rate
FROM deployment_logs
GROUP BY trigger_type;
```

### Average Deployment Duration

```sql
SELECT
  trigger_type,
  AVG(duration) as avg_duration_ms,
  MAX(duration) as max_duration_ms,
  MIN(duration) as min_duration_ms
FROM deployment_logs
WHERE status = 'triggered'
GROUP BY trigger_type;
```

---

## Related Documentation

- [Deployment API Setup Guide](./DEPLOYMENT_API_SETUP.md)
- [Master Controller Architecture](/home/claude-flow/docs/DUAL-DEPLOYMENT-ARCHITECTURE.md)
- [GitHub Actions Workflow](/home/claude-flow/.github/workflows/deploy-cloudflare.yml)

---

**Last Updated:** 2025-10-30
**Version:** 1.0.0
