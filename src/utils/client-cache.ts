"use client";

const cache = new Map<string, { data: unknown; ts: number }>();
const TTL = 120_000; // 2 minutes
const MAX_SIZE = 50;

function evict() {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now - entry.ts > TTL) cache.delete(key);
  }
}

export function clientFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
): Promise<T> {
  evict();

  const existing = cache.get(key);
  if (existing) return Promise.resolve(existing.data as T);

  return fetcher().then((data) => {
    if (cache.size >= MAX_SIZE) {
      const first = cache.keys().next().value;
      if (first !== undefined) cache.delete(first);
    }
    cache.set(key, { data, ts: Date.now() });
    return data;
  });
}

export function clientCacheClear() {
  cache.clear();
}
