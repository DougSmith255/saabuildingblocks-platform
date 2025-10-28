/**
 * Performance Monitor for CSS Injection
 * Tracks injection frequency, bundle size, and generation time
 */

interface InjectionMetric {
  timestamp: number;
  generationTime: number;
  bundleSize: number;
}

class PerformanceMonitor {
  private injections: InjectionMetric[] = [];
  private readonly maxHistory = 100; // Circular buffer size
  private injectionCount = 0;

  /**
   * Record a CSS injection event
   */
  recordInjection(generationTime: number, bundleSize: number): void {
    const metric: InjectionMetric = {
      timestamp: Date.now(),
      generationTime,
      bundleSize,
    };

    this.injections.push(metric);
    this.injectionCount++;

    // Maintain circular buffer of last 100 injections
    if (this.injections.length > this.maxHistory) {
      this.injections.shift();
    }
  }

  /**
   * Get average CSS generation time (ms)
   */
  getAverageGenerationTime(): number {
    if (this.injections.length === 0) return 0;
    const total = this.injections.reduce((sum, m) => sum + m.generationTime, 0);
    return total / this.injections.length;
  }

  /**
   * Get average CSS bundle size (bytes)
   */
  getAverageBundleSize(): number {
    if (this.injections.length === 0) return 0;
    const total = this.injections.reduce((sum, m) => sum + m.bundleSize, 0);
    return total / this.injections.length;
  }

  /**
   * Calculate injections per second in the last N milliseconds
   */
  getInjectionsPerSecond(windowMs: number = 1000): number {
    const now = Date.now();
    const recentInjections = this.injections.filter(
      (m) => now - m.timestamp <= windowMs
    );
    return (recentInjections.length / windowMs) * 1000;
  }

  /**
   * Get complete performance metrics
   */
  getPerformanceMetrics() {
    const last10Injections = this.injections.slice(-10);

    return {
      totalInjections: this.injectionCount,
      bufferedInjections: this.injections.length,
      averageGenerationTime: this.getAverageGenerationTime(),
      averageBundleSize: this.getAverageBundleSize(),
      injectionsPerSecond: this.getInjectionsPerSecond(),
      last10Injections,
      lastInjection: this.injections[this.injections.length - 1] || null,
      performanceScore: this.calculatePerformanceScore(),
    };
  }

  /**
   * Calculate performance score (0-100)
   * Based on generation time and bundle size
   */
  private calculatePerformanceScore(): number {
    const avgGenTime = this.getAverageGenerationTime();
    const avgBundleSize = this.getAverageBundleSize();

    // Target: < 5ms generation, < 50KB bundle
    const timeScore = Math.max(0, 100 - (avgGenTime / 5) * 100);
    const sizeScore = Math.max(0, 100 - (avgBundleSize / 50000) * 100);

    return Math.round((timeScore + sizeScore) / 2);
  }

  /**
   * Check if performance is within acceptable limits
   */
  isPerformanceAcceptable(): boolean {
    const metrics = this.getPerformanceMetrics();
    return (
      metrics.averageGenerationTime < 5 && // < 5ms
      metrics.averageBundleSize < 50000 && // < 50KB
      metrics.injectionsPerSecond < 10 // Not hammering the DOM
    );
  }

  /**
   * Get performance warnings
   */
  getWarnings(): string[] {
    const warnings: string[] = [];
    const metrics = this.getPerformanceMetrics();

    if (metrics.averageGenerationTime > 5) {
      warnings.push(
        `CSS generation slow: ${metrics.averageGenerationTime.toFixed(2)}ms (target: <5ms)`
      );
    }

    if (metrics.averageBundleSize > 50000) {
      warnings.push(
        `CSS bundle large: ${(metrics.averageBundleSize / 1024).toFixed(2)}KB (target: <50KB)`
      );
    }

    if (metrics.injectionsPerSecond > 10) {
      warnings.push(
        `High injection frequency: ${metrics.injectionsPerSecond.toFixed(2)}/s (may cause jank)`
      );
    }

    return warnings;
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.injections = [];
    this.injectionCount = 0;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export class for testing
export { PerformanceMonitor };

/**
 * Export metrics getter for debugging
 */
export function getPerformanceMetrics() {
  return performanceMonitor.getPerformanceMetrics();
}
