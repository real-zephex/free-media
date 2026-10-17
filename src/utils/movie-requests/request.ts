"use server";

import {
  MoviesHomepageResults,
  MovieInfoType,
  TVCredits,
  TVImages,
} from "../types";
import { cachedTmdbFetch, CACHE_TIER } from "../http";

const EMPTY_CREDITS: TVCredits = { cast: [], crew: [], id: 0 };
const EMPTY_IMAGES: TVImages = { backdrops: [], logos: [], posters: [], id: 0 };

const MOVIE_LIST_TYPES = new Set([
  "popular",
  "top_rated",
  "now_playing",
  "upcoming",
]);
const TIME_WINDOWS = new Set(["day", "week"]);

const isNumericId = (id: string) => /^\d+$/.test(id);

const tmdbRequest = async <T>(
  endpoint: string,
  queryParams: Record<string, string | number> = {},
  context: string,
  revalidate: number = CACHE_TIER.METADATA,
) => {
  return cachedTmdbFetch<T>(endpoint, queryParams, revalidate, context);
};

export async function MoviesDiscover(
  type: string,
  timeWindow: "day" | "week" = "day",
) {
  let endpoint: string;
  if (type === "trending") {
    if (!TIME_WINDOWS.has(timeWindow)) return undefined;
    endpoint = `trending/movie/${timeWindow}`;
  } else if (MOVIE_LIST_TYPES.has(type)) {
    endpoint = `movie/${type}`;
  } else {
    return undefined;
  }

  try {
    return await tmdbRequest<MoviesHomepageResults>(
      endpoint,
      {},
      `tmdb:movies:${type}`,
      CACHE_TIER.SHORT,
    );
  } catch (error) {
    return undefined;
  }
}

export async function MoviesSearchRequest(query: string) {
  try {
    return await tmdbRequest<MoviesHomepageResults>(
      "search/movie",
      { query },
      "tmdb:movies:search",
      CACHE_TIER.SHORT,
    );
  } catch (error) {
    return undefined;
  }
}

export async function MovieInfo(
  id: string,
): Promise<MovieInfoType | undefined> {
  if (!isNumericId(id)) return undefined;

  try {
    return await tmdbRequest<MovieInfoType>(
      `movie/${id}`,
      {},
      `tmdb:movie:${id}:info`,
      CACHE_TIER.METADATA,
    );
  } catch (error) {
    return undefined;
  }
}

export async function MovieRecommendations(
  id: string,
): Promise<MoviesHomepageResults | undefined> {
  if (!isNumericId(id)) return undefined;

  try {
    return await tmdbRequest<MoviesHomepageResults>(
      `movie/${id}/recommendations`,
      {},
      `tmdb:movie:${id}:recommendations`,
      CACHE_TIER.SHORT,
    );
  } catch (error) {
    return undefined;
  }
}

export async function MovieCredits({
  id,
  type = "credits",
}: {
  id: string;
  type: "credits" | "images";
}) {
  if (!isNumericId(id)) {
    return type === "credits" ? EMPTY_CREDITS : EMPTY_IMAGES;
  }

  try {
    if (type === "credits") {
      return await tmdbRequest<TVCredits>(
        `movie/${id}/credits`,
        {},
        `tmdb:movie:${id}:credits`,
        CACHE_TIER.LONG,
      );
    }

    return await tmdbRequest<TVImages>(
      `movie/${id}/images`,
      {},
      `tmdb:movie:${id}:images`,
      CACHE_TIER.LONG,
    );
  } catch (error) {
    return type === "credits" ? EMPTY_CREDITS : EMPTY_IMAGES;
  }
}
