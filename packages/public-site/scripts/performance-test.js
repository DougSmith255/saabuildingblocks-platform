/**
 * Playwright Performance Testing Script
 *
 * Measures comprehensive performance metrics for the Next.js application:
 * - FPS during counter animation
 * - Page load performance
 * - Scroll performance
 * - Core Web Vitals (LCP, FID, CLS)
 * - Tests at multiple viewport sizes
 *
 * Usage:
 *   node scripts/performance-test.js [url]
 *
 * Example:
 *   node scripts/performance-test.js https://saabuildingblocks.pages.dev/
 */

const { chromium } = require('@playwright/test');

// Configuration
const TEST_URL = process.argv[2] || 'https://saabuildingblocks.pages.dev/';
const VIEWPORT_SIZES = [
  { width: 1024, height: 768, name: 'Desktop Small' },
  { width: 1500, height: 900, name: 'Desktop Medium' },
  { width: 1920, height: 1080, name: 'Desktop Large' },
];

// Performance thresholds
const THRESHOLDS = {
  minFPS: 30,
  maxPageLoad: 3000, // ms
  maxLCP: 2500, // ms (Good = < 2.5s)
  maxFID: 100, // ms (Good = < 100ms)
  maxCLS: 0.1, // Good = < 0.1
};

/**
 * Calculate FPS from frame timestamps
 */
function calculateFPS(timestamps) {
  if (timestamps.length < 2) return 0;

  const deltas = [];
  for (let i = 1; i < timestamps.length; i++) {
    deltas.push(timestamps[i] - timestamps[i - 1]);
  }

  const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  return avgDelta > 0 ? Math.round(1000 / avgDelta) : 0;
}

/**
 * Measure FPS during counter animation
 */
async function measureAnimationFPS(page) {
  const frameTimestamps = await page.evaluate(() => {
    return new Promise((resolve) => {
      const timestamps = [];
      const startTime = performance.now();
      const duration = 3000; // Measure for 3 seconds

      function recordFrame(timestamp) {
        timestamps.push(timestamp);

        if (timestamp - startTime < duration) {
          requestAnimationFrame(recordFrame);
        } else {
          resolve(timestamps);
        }
      }

      requestAnimationFrame(recordFrame);
    });
  });

  return calculateFPS(frameTimestamps);
}

/**
 * Measure scroll performance
 */
async function measureScrollPerformance(page) {
  const scrollMetrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      const frameTimestamps = [];
      let scrolling = false;

      const startScroll = () => {
        scrolling = true;
        const startTime = performance.now();

        function recordFrame(timestamp) {
          frameTimestamps.push(timestamp);

          if (scrolling && timestamp - startTime < 2000) {
            requestAnimationFrame(recordFrame);
          } else {
            scrolling = false;
            resolve({
              timestamps: frameTimestamps,
              scrollHeight: document.documentElement.scrollHeight,
            });
          }
        }

        requestAnimationFrame(recordFrame);

        // Smooth scroll to bottom
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      };

      // Wait a bit for page to settle, then start scroll
      setTimeout(startScroll, 500);
    });
  });

  return {
    fps: calculateFPS(scrollMetrics.timestamps),
    scrollHeight: scrollMetrics.scrollHeight,
  };
}

/**
 * Capture Core Web Vitals
 */
async function getCoreWebVitals(page) {
  const vitals = await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals = {
        LCP: null,
        FID: null,
        CLS: null,
        FCP: null,
        TTFB: null,
      };

      // Use PerformanceObserver to capture metrics
      try {
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.LCP = lastEntry.renderTime || lastEntry.loadTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            vitals.FID = entry.processingStart - entry.startTime;
          });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          let clsValue = 0;
          list.getEntries().forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          vitals.CLS = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });

        // First Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              vitals.FCP = entry.startTime;
            }
          });
        }).observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('PerformanceObserver not fully supported:', e.message);
      }

      // Get navigation timing
      const navTiming = performance.getEntriesByType('navigation')[0];
      if (navTiming) {
        vitals.TTFB = navTiming.responseStart - navTiming.requestStart;
      }

      // Wait for metrics to settle
      setTimeout(() => {
        resolve(vitals);
      }, 3000);
    });
  });

  return vitals;
}

/**
 * Get page load timing metrics
 */
async function getPageLoadMetrics(page) {
  const metrics = await page.evaluate(() => {
    const navTiming = performance.getEntriesByType('navigation')[0];
    if (!navTiming) return null;

    return {
      domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.fetchStart,
      loadComplete: navTiming.loadEventEnd - navTiming.fetchStart,
      domInteractive: navTiming.domInteractive - navTiming.fetchStart,
      firstByte: navTiming.responseStart - navTiming.requestStart,
      dnsLookup: navTiming.domainLookupEnd - navTiming.domainLookupStart,
      tcpConnection: navTiming.connectEnd - navTiming.connectStart,
      serverResponse: navTiming.responseEnd - navTiming.responseStart,
    };
  });

  return metrics;
}

/**
 * Run comprehensive performance test for a specific viewport
 */
async function runTestForViewport(browser, viewport) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
  console.log('='.repeat(60));

  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });

  const page = await context.newPage();

  try {
    // Navigate to page and wait for network idle
    console.log(`Loading: ${TEST_URL}`);
    const startTime = Date.now();
    await page.goto(TEST_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    const loadTime = Date.now() - startTime;
    console.log(`Page loaded in ${loadTime}ms`);

    // Wait for counter element to be visible
    await page.waitForSelector('.counter-numbers', { timeout: 5000 });

    // Measure page load metrics
    const loadMetrics = await getPageLoadMetrics(page);

    // Measure Core Web Vitals
    const webVitals = await getCoreWebVitals(page);

    // Measure animation FPS
    console.log('Measuring animation FPS...');
    const animationFPS = await measureAnimationFPS(page);

    // Measure scroll performance
    console.log('Measuring scroll performance...');
    const scrollPerf = await measureScrollPerformance(page);

    // Compile results
    const results = {
      viewport: viewport.name,
      dimensions: `${viewport.width}x${viewport.height}`,
      pageLoad: {
        totalTime: loadTime,
        ...loadMetrics,
      },
      webVitals: {
        LCP: webVitals.LCP ? Math.round(webVitals.LCP) : 'N/A',
        FID: webVitals.FID ? Math.round(webVitals.FID) : 'N/A',
        CLS: webVitals.CLS ? webVitals.CLS.toFixed(3) : 'N/A',
        FCP: webVitals.FCP ? Math.round(webVitals.FCP) : 'N/A',
        TTFB: webVitals.TTFB ? Math.round(webVitals.TTFB) : 'N/A',
      },
      animation: {
        averageFPS: animationFPS,
        meetsThreshold: animationFPS >= THRESHOLDS.minFPS,
      },
      scroll: {
        averageFPS: scrollPerf.fps,
        scrollHeight: scrollPerf.scrollHeight,
        meetsThreshold: scrollPerf.fps >= THRESHOLDS.minFPS,
      },
    };

    return results;
  } catch (error) {
    console.error(`Error testing ${viewport.name}:`, error.message);
    return {
      viewport: viewport.name,
      error: error.message,
    };
  } finally {
    await context.close();
  }
}

/**
 * Generate performance report
 */
function generateReport(results) {
  console.log('\n\n');
  console.log('█'.repeat(70));
  console.log('█' + ' '.repeat(68) + '█');
  console.log('█' + '  PERFORMANCE TEST REPORT'.padEnd(68) + '█');
  console.log('█' + ' '.repeat(68) + '█');
  console.log('█'.repeat(70));
  console.log('');

  console.log(`Test URL: ${TEST_URL}`);
  console.log(`Test Date: ${new Date().toISOString()}`);
  console.log('');

  const warnings = [];
  const recommendations = [];

  results.forEach((result, index) => {
    if (result.error) {
      console.log(`\n[${index + 1}] ${result.viewport}: ERROR - ${result.error}`);
      return;
    }

    console.log(`\n${'─'.repeat(70)}`);
    console.log(`[${index + 1}] ${result.viewport} (${result.dimensions})`);
    console.log('─'.repeat(70));

    // Page Load Metrics
    console.log('\n📊 Page Load Metrics:');
    console.log(`   Total Load Time:        ${result.pageLoad.totalTime}ms`);
    console.log(`   DOM Content Loaded:     ${Math.round(result.pageLoad.domContentLoaded)}ms`);
    console.log(`   Load Complete:          ${Math.round(result.pageLoad.loadComplete)}ms`);
    console.log(`   Time to Interactive:    ${Math.round(result.pageLoad.domInteractive)}ms`);
    console.log(`   First Byte (TTFB):      ${Math.round(result.pageLoad.firstByte)}ms`);

    if (result.pageLoad.totalTime > THRESHOLDS.maxPageLoad) {
      warnings.push(`${result.viewport}: Page load time (${result.pageLoad.totalTime}ms) exceeds threshold (${THRESHOLDS.maxPageLoad}ms)`);
    }

    // Core Web Vitals
    console.log('\n🎯 Core Web Vitals:');
    console.log(`   LCP (Largest Contentful Paint):  ${result.webVitals.LCP}ms ${result.webVitals.LCP !== 'N/A' && result.webVitals.LCP < THRESHOLDS.maxLCP ? '✓' : result.webVitals.LCP !== 'N/A' ? '⚠' : ''}`);
    console.log(`   FID (First Input Delay):         ${result.webVitals.FID}ms ${result.webVitals.FID !== 'N/A' && result.webVitals.FID < THRESHOLDS.maxFID ? '✓' : result.webVitals.FID !== 'N/A' ? '⚠' : ''}`);
    console.log(`   CLS (Cumulative Layout Shift):   ${result.webVitals.CLS} ${result.webVitals.CLS !== 'N/A' && parseFloat(result.webVitals.CLS) < THRESHOLDS.maxCLS ? '✓' : result.webVitals.CLS !== 'N/A' ? '⚠' : ''}`);
    console.log(`   FCP (First Contentful Paint):    ${result.webVitals.FCP}ms`);
    console.log(`   TTFB (Time to First Byte):       ${result.webVitals.TTFB}ms`);

    if (result.webVitals.LCP !== 'N/A' && result.webVitals.LCP > THRESHOLDS.maxLCP) {
      warnings.push(`${result.viewport}: LCP (${result.webVitals.LCP}ms) exceeds "Good" threshold (${THRESHOLDS.maxLCP}ms)`);
      recommendations.push('Consider optimizing images and critical rendering path to improve LCP');
    }

    if (result.webVitals.CLS !== 'N/A' && parseFloat(result.webVitals.CLS) > THRESHOLDS.maxCLS) {
      warnings.push(`${result.viewport}: CLS (${result.webVitals.CLS}) exceeds "Good" threshold (${THRESHOLDS.maxCLS})`);
      recommendations.push('Review layout shifts - ensure images have dimensions and avoid dynamic content insertion');
    }

    // Animation Performance
    console.log('\n🎬 Animation Performance:');
    console.log(`   Average FPS:            ${result.animation.averageFPS} FPS ${result.animation.meetsThreshold ? '✓' : '⚠'}`);
    console.log(`   Threshold:              ${THRESHOLDS.minFPS} FPS minimum`);

    if (!result.animation.meetsThreshold) {
      warnings.push(`${result.viewport}: Animation FPS (${result.animation.averageFPS}) below threshold (${THRESHOLDS.minFPS})`);
      recommendations.push('Consider using CSS animations or reducing animation complexity');
    }

    // Scroll Performance
    console.log('\n📜 Scroll Performance:');
    console.log(`   Average FPS:            ${result.scroll.averageFPS} FPS ${result.scroll.meetsThreshold ? '✓' : '⚠'}`);
    console.log(`   Scroll Height:          ${result.scroll.scrollHeight}px`);
    console.log(`   Threshold:              ${THRESHOLDS.minFPS} FPS minimum`);

    if (!result.scroll.meetsThreshold) {
      warnings.push(`${result.viewport}: Scroll FPS (${result.scroll.averageFPS}) below threshold (${THRESHOLDS.minFPS})`);
      recommendations.push('Consider using will-change CSS property or reducing scroll-linked effects');
    }
  });

  // Summary
  console.log(`\n\n${'═'.repeat(70)}`);
  console.log('SUMMARY');
  console.log('═'.repeat(70));

  if (warnings.length === 0) {
    console.log('\n✓ All performance metrics meet thresholds!');
  } else {
    console.log(`\n⚠ ${warnings.length} performance warning(s) detected:\n`);
    warnings.forEach((warning, i) => {
      console.log(`   ${i + 1}. ${warning}`);
    });
  }

  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:\n');
    const uniqueRecommendations = [...new Set(recommendations)];
    uniqueRecommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });
  }

  console.log('\n' + '═'.repeat(70) + '\n');

  return {
    warnings,
    recommendations: [...new Set(recommendations)],
  };
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🚀 Starting Performance Tests...\n');
  console.log(`Target URL: ${TEST_URL}`);
  console.log(`Viewports: ${VIEWPORT_SIZES.map(v => v.name).join(', ')}`);

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const results = [];

    for (const viewport of VIEWPORT_SIZES) {
      const result = await runTestForViewport(browser, viewport);
      results.push(result);
    }

    const summary = generateReport(results);

    // Exit with error code if there are critical warnings
    const criticalWarnings = summary.warnings.filter(w =>
      w.includes('FPS') || w.includes('load time')
    );

    if (criticalWarnings.length > 0) {
      console.log('⚠ Critical performance issues detected. Review warnings above.');
      process.exit(1);
    } else {
      console.log('✓ Performance tests completed successfully.');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Test execution failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
