"use server";

import {
  FlixHQSeriesInfo,
  FlixHQSeriesLinks,
  VidSrcCCLinks,
} from "../more-types";
import {
  TrendingPopularTopAiringTV,
  TVSearch,
  TVCredits,
  TVImages,
  TVInfo,
  TVSeasonInfo,
  TVEpisodeInfo,
  FlixHQMovieLinks,
} from "../types";
import { buildTmdbUrl, fetchJsonWithRetry, cachedTmdbFetch, CACHE_TIER } from "../http";

const CONSUMET = process.env.CONSUMET_API_URL;
const CACHE_DURATION = CACHE_TIER.METADATA;
const VIDSRC_CC = "https://dramaflix-movielinks.vercel.app";

const requestHandler = async <T>(url: string, context: string) => {
  try {
    return await fetchJsonWithRetry<T>(url, {
      revalidate: CACHE_DURATION,
      context,
    });
  } catch (error) {
    return {} as T;
  }
};

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

  if (!url) {
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
  return await requestTmdb<TVEpisodeInfo>(
    `tv/${id}/season/${season}/episode/${episode}`,
    {},
    `tmdb:tv:${id}:s${season}e${episode}`,
    CACHE_TIER.LONG,
  );
};

export const FlixHQEpisodeInfo = async ({
  seriesId,
  season,
  episode,
}: {
  seriesId: string;
  season: string;
  episode: string;
}) => {
  const infoUrl = `${CONSUMET}/meta/tmdb/info/${seriesId}?type=tv`;
  const infoData: FlixHQSeriesInfo = await requestHandler<FlixHQSeriesInfo>(
    infoUrl,
    `flixhq:tv-info:${seriesId}`,
  );

  const { title, id } = infoData;

  const seasonSection = infoData.seasons?.find(
    (element) => element.season?.toString() == season,
  );
  const episodeId = seasonSection?.episodes?.find(
    (element) => element.episode?.toString() == episode,
  );

  const cover = episodeId?.img?.hd;

  const seriesVideoLink = `${CONSUMET}/meta/tmdb/watch/${episodeId?.id}?id=${id}`;
  const videoData: FlixHQSeriesLinks = await requestHandler<FlixHQSeriesLinks>(
    seriesVideoLink,
    `flixhq:tv-watch:${seriesId}:s${season}e${episode}`,
  );

  const videoURL = videoData.sources?.find(
    (element) => element.quality === "auto",
  );

  const subs = videoData.subtitles;

  let link2, link3;
  try {
    const vidsrcData: VidSrcCCLinks = await requestHandler<VidSrcCCLinks>(
      `${VIDSRC_CC}/vidsrc/${seriesId}?s=${season}&e=${episode}`,
      `vidsrc:tv:${seriesId}:s${season}e${episode}`,
    );

    if (vidsrcData.source2?.data) {
      link2 = vidsrcData.source2.data.source;
    }
    if (vidsrcData.source1?.data) {
      const tempLink = vidsrcData.source1.data.source;
      if (tempLink != videoURL?.url) {
        link3 = tempLink;
      }
    }
  } catch (error) {
    link2 = undefined;
    link3 = undefined;
  }

  return {
    title,
    cover,
    videoURL,
    subs,
    link2,
    link3,
  };
};
