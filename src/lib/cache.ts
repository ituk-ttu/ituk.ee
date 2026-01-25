/**
 * Simple in-memory cache with TTL (time-to-live)
 * Reduces Firebase reads for data that rarely changes
 */

interface CacheEntry<T> {
    data: T;
    expires: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

// Default TTL: 5 minutes (in milliseconds)
const DEFAULT_TTL = 5 * 60 * 1000;

/**
 * Get cached data or fetch fresh data if cache is expired/missing
 */
export async function getCached<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = DEFAULT_TTL
): Promise<T> {
    const now = Date.now();
    const cached = cache.get(key) as CacheEntry<T> | undefined;

    // Return cached data if still valid
    if (cached && cached.expires > now) {
        return cached.data;
    }

    // Fetch fresh data
    const data = await fetcher();

    // Store in cache
    cache.set(key, {
        data,
        expires: now + ttl
    });

    return data;
}

/**
 * Invalidate a specific cache entry
 */
export function invalidateCache(key: string): void {
    cache.delete(key);
}

/**
 * Invalidate all cache entries matching a prefix
 */
export function invalidateCacheByPrefix(prefix: string): void {
    for (const key of cache.keys()) {
        if (key.startsWith(prefix)) {
            cache.delete(key);
        }
    }
}

/**
 * Clear entire cache
 */
export function clearCache(): void {
    cache.clear();
}

// Cache keys
export const CACHE_KEYS = {
    BOARD_MEMBERS: 'board_members',
    TIMELINE_EVENTS: 'timeline_events',
    EVENTS: 'events',
    EVENTS_BY_CATEGORY: (cat: string) => `events_${cat}`,
    EVENT_BY_HANDLE: (handle: string) => `event_${handle}`,
    EVENT_YEARS: (eventId: string) => `event_years_${eventId}`,
    RENT_ITEMS: 'rent_items',
    PARTNERS: 'partners',
    SPONSORS: 'sponsors',
    SETTINGS: (key: string) => `setting_${key}`,
} as const;
