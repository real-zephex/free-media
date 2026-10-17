"use server";

import {
  TrendingPopularTopAiringTV,
  TVSearch,
  TVCredits,
  TVImages,
  TVInfo,
  TVSeasonInfo,
  TVEpisodeInfo,
} from "../types";
import { cachedTmdbFetch, CACHE_TIER } from "../http";

const TV_LIST_TYPES = new Set(["airing_today", "top_rated", "popular"]);
const TIME_WINDOWS = new Set(["day", "week"]);

const isPositiveInt = (value: number) =>
  Number.isInteger(value) && value > 0;

const requestTmdb = async <T>(
  endpoint: string,
  queryParams: Record<string, string | number> = {},
  context: string,
  revalidate: number = CACHE_TIER.METADATA,
) => {
  return cachedTmdbFetch<T>(endpoint, queryParams, revalidate, context);
};

export const TopPopularAiringTV = async ({
  type = "popular",
}: {
  type: "airing_today" | "top_rated" | "popular";
}) => {
  if (!TV_LIST_TYPES.has(type)) {
    throw new Error("Invalid TV list type provided");
  }

  return await requestTmdb<TrendingPopularTopAiringTV>(
    `tv/${type}`,
    {},
    `tmdb:tv:${type}`,
    CACHE_TIER.SHORT,
  );
};

export const InfoImagesCreditsTV = async ({
  type,
  id,
}: {
  type: "info" | "images" | "credits";
  id: number;
}) => {
  const urlMap: Record<string, string> = {
    info: `tv/${id}`,
    images: `tv/${id}/images`,
    credits: `tv/${id}/credits`,
  };

  const url = urlMap[type];

  if (!url || !isPositiveInt(id)) {
    throw new Error("Invalid type provided");
  }

  const isInfo = type === "info";

  const response = await requestTmdb<TVCredits | TVImages | TVInfo>(
    url,
    {},
    `tmdb:tv:${id}:${type}`,
    isInfo ? CACHE_TIER.METADATA : CACHE_TIER.LONG,
  );

  switch (type) {
    case "credits":
      return response as TVCredits;
    case "images":
      return response as TVImages;
    case "info":
    default:
      return response as TVInfo;
  }
};

export const SearchTV = async ({ title }: { title: string }) => {
  return await requestTmdb<TVSearch>(
    "search/tv",
    { query: title },
    "tmdb:tv:search",
    CACHE_TIER.SHORT,
  );
};

export const TrendingTV = async ({
  time_window = "day",
}: {
  time_window: "day" | "week";
}) => {
  if (!TIME_WINDOWS.has(time_window)) {
    throw new Error("Invalid time window provided");
  }

  return await requestTmdb<TrendingPopularTopAiringTV>(
    `trending/tv/${time_window}`,
    {},
    `tmdb:tv:trending:${time_window}`,
    CACHE_TIER.SHORT,
  );
};

export const SeasonInfo = async ({
  id,
  season,
}: {
  id: number;
  season: number;
}) => {
  if (!isPositiveInt(id) || !isPositiveInt(season)) {
    throw new Error("Invalid season parameters provided");
  }

  return await requestTmdb<TVSeasonInfo>(
    `tv/${id}/season/${season}`,
    {},
    `tmdb:tv:${id}:season:${season}`,
    CACHE_TIER.LONG,
  );
};

export const EpisodeInfo = async ({
  id,
  season,
  episode,
}: {
  id: string;
  season: string;
  episode: string;
}) => {
  if (!/^\d+$/.test(id) || !/^\d+$/.test(season) || !/^\d+$/.test(episode)) {
    throw new Error("Invalid episode parameters provided");
  }

  return await requestTmdb<TVEpisodeInfo>(
    `tv/${id}/season/${season}/episode/${episode}`,
    {},
    `tmdb:tv:${id}:s${season}e${episode}`,
    CACHE_TIER.LONG,
  );
};
