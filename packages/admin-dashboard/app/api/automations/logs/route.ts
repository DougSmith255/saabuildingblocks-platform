import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Allowed log files (whitelist for security)
const ALLOWED_LOGS: Record<string, string> = {
  'everwebinar-sync.log': '/var/log/everwebinar-sync.log',
  'email-automation.log': '/var/log/email-automation.log',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');
    const lines = parseInt(searchParams.get('lines') || '100', 10);

    if (!file) {
      return NextResponse.json(
        { error: 'Missing file parameter' },
        { status: 400 }
      );
    }

    // Security: Only allow whitelisted log files
    const logPath = ALLOWED_LOGS[file];
    if (!logPath) {
      return NextResponse.json(
        { error: 'Invalid log file' },
        { status: 400 }
      );
    }

    // Check if file exists
    try {
      await fs.access(logPath);
    } catch {
      return NextResponse.json(
        { error: 'Log file not found', file },
        { status: 404 }
      );
    }

    // Read the log file
    const content = await fs.readFile(logPath, 'utf-8');
    const allLines = content.trim().split('\n');

    // Get the last N lines
    const lastLines = allLines.slice(-Math.min(lines, allLines.length));

    // Return as formatted HTML for easy viewing
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Log: ${file}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      background: #1a1a1a;
      color: #e5e4dd;
      padding: 20px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: #2a2a2a;
      border-radius: 8px 8px 0 0;
      border-bottom: 1px solid #404040;
    }
    .header h1 {
      font-size: 18px;
      color: #ffd700;
    }
    .header .meta {
      font-size: 12px;
      color: #888;
    }
    .log-container {
      background: #0d0d0d;
      border: 1px solid #404040;
      border-radius: 0 0 8px 8px;
      overflow: auto;
      max-height: calc(100vh - 120px);
    }
    .log-line {
      padding: 4px 20px;
      white-space: pre-wrap;
      word-break: break-all;
      border-bottom: 1px solid #222;
      font-size: 13px;
    }
    .log-line:hover {
      background: #1a1a1a;
    }
    .log-line.info { color: #00ff88; }
    .log-line.error { color: #ff6b6b; background: rgba(255,0,0,0.05); }
    .log-line.warning { color: #ffd700; }
    .timestamp { color: #888; margin-right: 10px; }
    .refresh-btn {
      background: #404040;
      color: #e5e4dd;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    }
    .refresh-btn:hover { background: #505050; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📄 ${file}</h1>
    <div>
      <span class="meta">Showing last ${lastLines.length} lines</span>
      <button class="refresh-btn" onclick="location.reload()">↻ Refresh</button>
    </div>
  </div>
  <div class="log-container">
    ${lastLines.map(line => {
      const isError = line.includes('[ERROR]') || line.includes('Error') || line.includes('✗');
      const isWarning = line.includes('[WARN]') || line.includes('Warning');
      const className = isError ? 'error' : isWarning ? 'warning' : 'info';

      // Extract and format timestamp
      const timestampMatch = line.match(/^\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)\]/);
      if (timestampMatch) {
        const timestamp = new Date(timestampMatch[1]).toLocaleString();
        const rest = line.substring(timestampMatch[0].length);
        return `<div class="log-line ${className}"><span class="timestamp">${timestamp}</span>${escapeHtml(rest)}</div>`;
      }
      return `<div class="log-line ${className}">${escapeHtml(line)}</div>`;
    }).join('\n')}
  </div>
  <script>
    // Auto-scroll to bottom
    document.querySelector('.log-container').scrollTop = document.querySelector('.log-container').scrollHeight;
  </script>
</body>
</html>
    `.trim();

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error reading log file:', error);
    return NextResponse.json(
      { error: 'Failed to read log file' },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
