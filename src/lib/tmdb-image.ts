const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

function withProxy(url: string, proxy: string | undefined): string {
  if (!proxy) return url;
  // Proxy env is a raw prefix (e.g. "https://proxy.example/fetch?url=") —
  // concatenate directly, never inject a separator.
  return `${proxy}${url}`;
}

export function tmdbImageUrl(
  path: string | null | undefined,
  size: string = "original",
): string {
  if (!path) return "/placeholder.svg";
  return withProxy(
    `${TMDB_IMAGE_BASE}/${size}${path}`,
    process.env.NEXT_PUBLIC_PROXY,
  );
}

export function tmdbImageUrlAlt(
  path: string | null | undefined,
  size: string = "w500",
): string {
  if (!path) return "/placeholder.svg";
  return withProxy(
    `${TMDB_IMAGE_BASE}/${size}${path}`,
    process.env.NEXT_PUBLIC_PROXY_2 || process.env.NEXT_PUBLIC_PROXY,
  );
}
