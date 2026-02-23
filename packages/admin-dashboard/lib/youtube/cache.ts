interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

// TTLs in milliseconds
export const CACHE_TTL = {
  CHANNEL: 30 * 60 * 1000,    // 30 minutes
  VIDEOS: 15 * 60 * 1000,     // 15 minutes
  ANALYTICS: 30 * 60 * 1000,  // 30 minutes
  RETENTION: 60 * 60 * 1000,  // 60 minutes
  KEYWORDS: 60 * 60 * 1000,   // 60 minutes
} as const;

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

export function invalidateCache(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

export function clearAllCache(): void {
  cache.clear();
}
