import { cache } from "react";
import { getRandomApiKey } from "./api-key-randomizer";

const errorLogWindow = new Map<string, number>();
const LOG_THROTTLE_MS = 30_000;

const RETRIABLE_NETWORK_CODES = new Set([
  "ECONNRESET",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "ENOTFOUND",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_SOCKET",
]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function logErrorThrottled(key: string, message: string, error: unknown) {
  const now = Date.now();
  const previous = errorLogWindow.get(key) ?? 0;

  if (now - previous < LOG_THROTTLE_MS) {
    return;
  }

  errorLogWindow.set(key, now);
  console.warn(message, error);
}

function isRetriableStatus(status: number) {
  return status === 429 || status >= 500;
}

function isRetriableNetworkError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const code =
    (error as { code?: string; cause?: { code?: string } }).cause?.code ??
    (error as { code?: string }).code;

  if (code && RETRIABLE_NETWORK_CODES.has(code)) {
    return true;
  }

  return error.name === "TypeError" || error.name === "AbortError";
}

export async function fetchJsonWithRetry<T>(
  url: string,
  {
    revalidate,
    retries = 2,
    timeoutMs = 12_000,
    context,
  }: {
    revalidate?: number;
    retries?: number;
    timeoutMs?: number;
    context?: string;
  } = {},
): Promise<T> {
  const key = context ?? url;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        ...(revalidate ? { next: { revalidate } } : {}),
      });

      if (!response.ok) {
        if (attempt < retries && isRetriableStatus(response.status)) {
          await sleep(250 * (attempt + 1));
          continue;
        }

        throw new Error(`HTTP ${response.status} for ${key}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (attempt < retries && isRetriableNetworkError(error)) {
        await sleep(250 * (attempt + 1));
        continue;
      }

      logErrorThrottled(
        key,
        `[request] ${key} failed after ${attempt + 1} attempt(s):`,
        error,
      );
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  throw new Error(`Unreachable fetch retry branch for ${key}`);
}

export function buildTmdbUrl(
  endpoint: string,
  queryParams: Record<string, string | number> = {},
) {
  const url = new URL(
    `https://api.themoviedb.org/3/${endpoint.replace(/^\//, "")}`,
  );
  url.searchParams.set("api_key", getRandomApiKey());

  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export const CACHE_TIER = {
  SHORT: 86400,
  METADATA: 43200,
  LONG: 604800,
} as const;

export const cachedTmdbFetch = cache(
  async <T>(
    endpoint: string,
    queryParams: Record<string, string | number>,
    revalidate: number,
    context: string,
  ): Promise<T> => {
    const url = buildTmdbUrl(endpoint, queryParams);
    return fetchJsonWithRetry<T>(url, { revalidate, context });
  },
);
