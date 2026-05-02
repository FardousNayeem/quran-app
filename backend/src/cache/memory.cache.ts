import { CACHE_MAX_ENTRIES } from "@/config/constants";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  constructor(private readonly maxEntries = CACHE_MAX_ENTRIES) {}

  set<T>(key: string, value: T, ttlMs: number): void {
    if (ttlMs <= 0) return;

    // Refresh insertion order (LRU-style evict).
    this.store.delete(key);
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });

    this.evictExpired();
    this.evictOldestEntries();
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    // Mark used recent.
    this.store.delete(key);
    this.store.set(key, entry);

    return entry.value as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    this.evictExpired();
    return this.store.size;
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) this.store.delete(key);
    }
  }

  private evictOldestEntries(): void {
    while (this.store.size > this.maxEntries) {
      const oldestKey = this.store.keys().next().value as string | undefined;
      if (!oldestKey) break;
      this.store.delete(oldestKey);
    }
  }
}

// Singleton used across services.
export const cache = new MemoryCache();
