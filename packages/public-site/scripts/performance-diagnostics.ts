/**
 * Performance Diagnostics Script
 *
 * Measures website performance including:
 * - Core Web Vitals (LCP, CLS, INP)
 * - Animation FPS
 * - Long tasks (jank detection)
 * - Memory usage
 *
 * Usage:
 *   npx tsx scripts/performance-diagnostics.ts [url]
 *
 * Examples:
 *   npx tsx scripts/performance-diagnostics.ts
 *   npx tsx scripts/performance-diagnostics.ts https://saabuildingblocks.com
 */

import { chromium, type Page, type Browser } from 'playwright';

const DEFAULT_URL = 'http://localhost:3001';

interface PerformanceMetrics {
  url: string;
  timestamp: string;
  coreWebVitals: {
    lcp: number | null;
    cls: number | null;
    fcp: number | null;
    ttfb: number | null;
  };
  fps: {
    average: number;
    min: number;
    max: number;
    dropped: number;
  };
  longTasks: {
    count: number;
    totalDuration: number;
    maxDuration: number;
  };
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
  } | null;
  loadTime: number;
}

async function measureFPS(page: Page, duration: number = 5000): Promise<PerformanceMetrics['fps']> {
  return await page.evaluate((measureDuration) => {
    return new Promise<{ average: number; min: number; max: number; dropped: number }>((resolve) => {
      const frameTimes: number[] = [];
      let lastTime = performance.now();
      let animationId: number;
      const startTime = performance.now();

      function measureFrame() {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        frameTimes.push(delta);
        lastTime = currentTime;

        if (currentTime - startTime < measureDuration) {
          animationId = requestAnimationFrame(measureFrame);
        } else {
          cancelAnimationFrame(animationId);

          // Calculate FPS metrics
          const fps = frameTimes.map(delta => 1000 / delta);
          const avgFps = fps.reduce((a, b) => a + b, 0) / fps.length;
          const minFps = Math.min(...fps);
          const maxFps = Math.max(...fps);

          // Count dropped frames (< 30 FPS = dropped)
          const dropped = fps.filter(f => f < 30).length;

          resolve({
            average: Math.round(avgFps * 10) / 10,
            min: Math.round(minFps * 10) / 10,
            max: Math.round(maxFps * 10) / 10,
            dropped,
          });
        }
      }

      requestAnimationFrame(measureFrame);
    });
  }, duration);
}

async function measureCoreWebVitals(page: Page): Promise<PerformanceMetrics['coreWebVitals']> {
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');

  // Give time for LCP to settle
  await page.waitForTimeout(2000);

  return await page.evaluate(() => {
    const entries = performance.getEntriesByType('paint');
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    let lcp: number | null = null;
    let cls: number | null = null;
    let fcp: number | null = null;
    let ttfb: number | null = null;

    // FCP
    const fcpEntry = entries.find(e => e.name === 'first-contentful-paint');
    if (fcpEntry) {
      fcp = Math.round(fcpEntry.startTime);
    }

    // TTFB
    if (navigation) {
      ttfb = Math.round(navigation.responseStart - navigation.requestStart);
    }

    // LCP (from PerformanceObserver entries if available)
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
      lcp = Math.round(lcpEntries[lcpEntries.length - 1].startTime);
    }

    // CLS (simplified calculation)
    const layoutShiftEntries = performance.getEntriesByType('layout-shift') as any[];
    if (layoutShiftEntries.length > 0) {
      cls = layoutShiftEntries
        .filter(entry => !entry.hadRecentInput)
        .reduce((sum, entry) => sum + entry.value, 0);
      cls = Math.round(cls * 1000) / 1000;
    }

    return { lcp, cls, fcp, ttfb };
  });
}

async function measureLongTasks(page: Page, duration: number = 5000): Promise<PerformanceMetrics['longTasks']> {
  // Inject long task observer
  await page.evaluate(() => {
    (window as any).__longTasks = [];
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        (window as any).__longTasks.push(entry.duration);
      }
    });
    observer.observe({ entryTypes: ['longtask'] });
  });

  // Interact with page to trigger potential long tasks
  await page.mouse.move(500, 300);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(duration - 1000);

  // Collect results
  return await page.evaluate(() => {
    const tasks = (window as any).__longTasks as number[];
    return {
      count: tasks.length,
      totalDuration: Math.round(tasks.reduce((a, b) => a + b, 0)),
      maxDuration: tasks.length > 0 ? Math.round(Math.max(...tasks)) : 0,
    };
  });
}

async function measureMemory(page: Page): Promise<PerformanceMetrics['memory']> {
  try {
    const metrics = await page.evaluate(() => {
      const memory = (performance as any).memory;
      if (memory) {
        return {
          usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        };
      }
      return null;
    });
    return metrics;
  } catch {
    return null;
  }
}

async function runDiagnostics(url: string): Promise<PerformanceMetrics> {
  console.log(`\n🔍 Running performance diagnostics on: ${url}\n`);

  const browser: Browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-features=NetworkService',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  // Enable performance observer APIs
  await page.addInitScript(() => {
    // Ensure performance observers are available
    if (typeof PerformanceObserver !== 'undefined') {
      new PerformanceObserver(() => {}).observe({ entryTypes: ['largest-contentful-paint'] });
      new PerformanceObserver(() => {}).observe({ entryTypes: ['layout-shift'] });
    }
  });

  const startTime = Date.now();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (error) {
    console.error(`Failed to load ${url}:`, error);
    await browser.close();
    throw error;
  }

  const loadTime = Date.now() - startTime;

  console.log('📊 Measuring Core Web Vitals...');
  const coreWebVitals = await measureCoreWebVitals(page);

  console.log('🎬 Measuring animation FPS (5 seconds)...');
  const fps = await measureFPS(page, 5000);

  console.log('⏱️  Detecting long tasks...');
  const longTasks = await measureLongTasks(page, 3000);

  console.log('💾 Measuring memory usage...');
  const memory = await measureMemory(page);

  await browser.close();

  return {
    url,
    timestamp: new Date().toISOString(),
    coreWebVitals,
    fps,
    longTasks,
    memory,
    loadTime,
  };
}

function printReport(metrics: PerformanceMetrics) {
  console.log('\n' + '='.repeat(60));
  console.log('📈 PERFORMANCE REPORT');
  console.log('='.repeat(60));
  console.log(`URL: ${metrics.url}`);
  console.log(`Time: ${metrics.timestamp}`);
  console.log(`Page Load: ${metrics.loadTime}ms`);

  console.log('\n--- Core Web Vitals ---');
  console.log(`  LCP:  ${metrics.coreWebVitals.lcp ?? 'N/A'}ms ${metrics.coreWebVitals.lcp && metrics.coreWebVitals.lcp <= 2500 ? '✅' : '⚠️'} (target: ≤2500ms)`);
  console.log(`  CLS:  ${metrics.coreWebVitals.cls ?? 'N/A'} ${metrics.coreWebVitals.cls !== null && metrics.coreWebVitals.cls < 0.1 ? '✅' : '⚠️'} (target: <0.1)`);
  console.log(`  FCP:  ${metrics.coreWebVitals.fcp ?? 'N/A'}ms ${metrics.coreWebVitals.fcp && metrics.coreWebVitals.fcp <= 1800 ? '✅' : '⚠️'} (target: ≤1800ms)`);
  console.log(`  TTFB: ${metrics.coreWebVitals.ttfb ?? 'N/A'}ms ${metrics.coreWebVitals.ttfb && metrics.coreWebVitals.ttfb <= 800 ? '✅' : '⚠️'} (target: ≤800ms)`);

  console.log('\n--- Animation Performance ---');
  console.log(`  Avg FPS:     ${metrics.fps.average} ${metrics.fps.average >= 55 ? '✅' : '⚠️'} (target: ≥55)`);
  console.log(`  Min FPS:     ${metrics.fps.min} ${metrics.fps.min >= 30 ? '✅' : '❌'} (min acceptable: 30)`);
  console.log(`  Max FPS:     ${metrics.fps.max}`);
  console.log(`  Dropped:     ${metrics.fps.dropped} frames ${metrics.fps.dropped === 0 ? '✅' : '⚠️'}`);

  console.log('\n--- Long Tasks (Jank) ---');
  console.log(`  Count:       ${metrics.longTasks.count} ${metrics.longTasks.count === 0 ? '✅' : '⚠️'}`);
  console.log(`  Total:       ${metrics.longTasks.totalDuration}ms`);
  console.log(`  Max:         ${metrics.longTasks.maxDuration}ms ${metrics.longTasks.maxDuration < 100 ? '✅' : '⚠️'} (target: <100ms)`);

  if (metrics.memory) {
    console.log('\n--- Memory ---');
    console.log(`  Used:        ${metrics.memory.usedJSHeapSize}MB`);
    console.log(`  Total:       ${metrics.memory.totalJSHeapSize}MB`);
  }

  console.log('\n' + '='.repeat(60));

  // Overall score
  const issues: string[] = [];
  if (metrics.coreWebVitals.lcp && metrics.coreWebVitals.lcp > 2500) issues.push('LCP too high');
  if (metrics.coreWebVitals.cls !== null && metrics.coreWebVitals.cls >= 0.1) issues.push('CLS too high');
  if (metrics.fps.average < 55) issues.push('Low FPS');
  if (metrics.longTasks.count > 0) issues.push(`${metrics.longTasks.count} long tasks detected`);

  if (issues.length === 0) {
    console.log('✅ All metrics look good!');
  } else {
    console.log('⚠️  Issues found:');
    issues.forEach(issue => console.log(`   - ${issue}`));
  }
  console.log('='.repeat(60) + '\n');
}

// Main execution
const url = process.argv[2] || DEFAULT_URL;

runDiagnostics(url)
  .then(metrics => {
    printReport(metrics);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Diagnostics failed:', error.message);
    process.exit(1);
  });
