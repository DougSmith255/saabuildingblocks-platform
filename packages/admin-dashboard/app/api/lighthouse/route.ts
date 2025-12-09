import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';

const execAsync = promisify(exec);

/**
 * Lighthouse API Route
 *
 * Runs Lighthouse audit on a given URL and returns the results.
 * POST /api/lighthouse
 * Body: { url: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validate URL
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Generate unique filename for this report
    const reportId = randomUUID();
    const outputPath = `/tmp/lighthouse-${reportId}`;

    // Run Lighthouse with headless Chrome
    const lighthouseCommand = `npx lighthouse "${url}" --output=json --output-path=${outputPath} --chrome-flags="--headless --no-sandbox --disable-gpu --disable-dev-shm-usage" --only-categories=performance,accessibility,best-practices,seo 2>&1`;

    try {
      await execAsync(lighthouseCommand, { timeout: 120000 }); // 2 minute timeout
    } catch (execError: any) {
      // Lighthouse may exit with non-zero but still produce valid output
      if (!execError.stdout?.includes('json output written')) {
        console.error('Lighthouse execution error:', execError);
        return NextResponse.json({
          error: 'Lighthouse execution failed',
          details: execError.message
        }, { status: 500 });
      }
    }

    // Read the JSON report - try both possible paths
    // Lighthouse outputs to different paths depending on version
    let reportPath = outputPath; // Direct path (newer versions)
    let reportJson;

    try {
      const reportContent = await readFile(reportPath, 'utf8');
      reportJson = JSON.parse(reportContent);
    } catch (readError) {
      // Try with .report.json extension (older behavior)
      try {
        reportPath = `${outputPath}.report.json`;
        const reportContent = await readFile(reportPath, 'utf8');
        reportJson = JSON.parse(reportContent);
      } catch (readError2) {
        console.error('Failed to read Lighthouse report from both paths:', readError, readError2);
        return NextResponse.json({
          error: 'Failed to read Lighthouse report'
        }, { status: 500 });
      }
    }

    // Clean up temp file
    try {
      await unlink(reportPath);
    } catch {
      // Ignore cleanup errors
    }

    // Extract relevant data
    const categories = reportJson.categories;
    const audits = reportJson.audits;

    const result = {
      url: reportJson.finalUrl || url,
      fetchTime: reportJson.fetchTime,
      scores: {
        performance: Math.round((categories.performance?.score || 0) * 100),
        accessibility: Math.round((categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
        seo: Math.round((categories.seo?.score || 0) * 100),
      },
      metrics: {
        fcp: {
          value: audits['first-contentful-paint']?.numericValue || 0,
          displayValue: audits['first-contentful-paint']?.displayValue || 'N/A',
          score: audits['first-contentful-paint']?.score || 0,
        },
        lcp: {
          value: audits['largest-contentful-paint']?.numericValue || 0,
          displayValue: audits['largest-contentful-paint']?.displayValue || 'N/A',
          score: audits['largest-contentful-paint']?.score || 0,
        },
        tbt: {
          value: audits['total-blocking-time']?.numericValue || 0,
          displayValue: audits['total-blocking-time']?.displayValue || 'N/A',
          score: audits['total-blocking-time']?.score || 0,
        },
        cls: {
          value: audits['cumulative-layout-shift']?.numericValue || 0,
          displayValue: audits['cumulative-layout-shift']?.displayValue || 'N/A',
          score: audits['cumulative-layout-shift']?.score || 0,
        },
        si: {
          value: audits['speed-index']?.numericValue || 0,
          displayValue: audits['speed-index']?.displayValue || 'N/A',
          score: audits['speed-index']?.score || 0,
        },
        tti: {
          value: audits['interactive']?.numericValue || 0,
          displayValue: audits['interactive']?.displayValue || 'N/A',
          score: audits['interactive']?.score || 0,
        },
      },
      opportunities: Object.values(audits)
        .filter((audit: any) =>
          audit.details?.type === 'opportunity' &&
          audit.score !== null &&
          audit.score < 1 &&
          audit.details?.overallSavingsMs > 0
        )
        .sort((a: any, b: any) =>
          (b.details?.overallSavingsMs || 0) - (a.details?.overallSavingsMs || 0)
        )
        .slice(0, 5)
        .map((audit: any) => ({
          title: audit.title,
          description: audit.description,
          savings: audit.displayValue || `${Math.round(audit.details?.overallSavingsMs || 0)}ms`,
        })),
      diagnostics: Object.values(audits)
        .filter((audit: any) =>
          audit.details?.type === 'table' &&
          audit.score !== null &&
          audit.score < 1
        )
        .slice(0, 5)
        .map((audit: any) => ({
          title: audit.title,
          description: audit.description,
          displayValue: audit.displayValue,
        })),
    };

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Lighthouse API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}
