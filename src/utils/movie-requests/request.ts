"use server";

import { VidSrcCCLinks } from "../more-types";

import {
  MoviesHomepageResults,
  MovieInfoType,
  TVCredits,
  TVImages,
  FlixHQResults,
  FlixHQMovieLinks,
} from "../types";
import { buildTmdbUrl, fetchJsonWithRetry, cachedTmdbFetch, CACHE_TIER } from "../http";

const VIDSRC_CC = "https://dramaflix-movielinks.vercel.app";
const CONSUMET = process.env.CONSUMET_API_URL;
const CACHE_DURATION = CACHE_TIER.METADATA;

const EMPTY_CREDITS: TVCredits = { cast: [], crew: [], id: 0 };
const EMPTY_IMAGES: TVImages = { backdrops: [], logos: [], posters: [], id: 0 };

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
  const endpoint =
    type === "trending" ? `trending/movie/${timeWindow}` : `movie/${type}`;

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
  recommendations: boolean = false,
): Promise<MovieInfoType | undefined> {
  const endpoint = recommendations
    ? `movie/${id}/recommendations`
    : `movie/${id}`;

  try {
    return await tmdbRequest<MovieInfoType>(
      endpoint,
      {},
      `tmdb:movie:${id}:${recommendations ? "recommendations" : "info"}`,
      recommendations ? CACHE_TIER.SHORT : CACHE_TIER.METADATA,
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

export const FlixHQResultsHandler = async ({
  movieId,
}: {
  movieId: string;
}) => {
  const url = `${CONSUMET}/meta/tmdb/info/${movieId}?type=movie`;
  const data: FlixHQResults = await fetchJsonWithRetry<FlixHQResults>(url, {
    revalidate: CACHE_DURATION,
    context: `flixhq:movie-info:${movieId}`,
  });
  let { id, episodeId, title, cover } = data;

  let subtitles: NonNullable<FlixHQMovieLinks["subtitles"]> = [];
  let headers = "";
  let movieLink: NonNullable<FlixHQMovieLinks["sources"]>[number] | undefined;
  try {
    const linksData: FlixHQMovieLinks =
      await fetchJsonWithRetry<FlixHQMovieLinks>(
        `${CONSUMET}/meta/tmdb/watch/${episodeId}?id=${id}`,
        {
          revalidate: CACHE_DURATION,
          context: `flixhq:movie-watch:${movieId}`,
        },
      );

    subtitles = linksData.subtitles || [];
    headers = linksData.headers?.Referer || "";

    movieLink = linksData.sources?.find(
      (element) => element.quality === "auto",
    );
  } catch (error) {
    subtitles = [];
    headers = "";
    movieLink = undefined;
  }

  let link2, link3;
  try {
    const vidccLinks: VidSrcCCLinks = await fetchJsonWithRetry<VidSrcCCLinks>(
      `${VIDSRC_CC}/vidsrc/${movieId}`,
      {
        revalidate: CACHE_DURATION,
        context: `vidsrc:movie:${movieId}`,
      },
    );

    if (vidccLinks.source2?.data) {
      link2 = vidccLinks.source2.data.source;
    }
    if (vidccLinks.source1?.data) {
      const tempLink = vidccLinks.source1.data.source;
      if (tempLink != movieLink?.url) {
        link3 = tempLink;
      }
    }
  } catch (error) {
    link2 = undefined;
    link3 = undefined;
  }
  return {
    movieLink,
    subtitles,
    title,
    cover,
    link2,
    link3,
    headers,
  };
};
