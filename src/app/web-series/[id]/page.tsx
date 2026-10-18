import { InfoImagesCreditsTV } from "@/utils/tv-requests/request";
import { TVInfo, TVCredits, TVImages } from "@/utils/types";
import { Metadata, ResolvingMetadata } from "next";
import SeriesInfoTabs from "@/components/web-ui/series-info-tabs";
import SeriesTrackingPanel from "@/components/web-ui/series-tracking-panel";
import SeriesHeroStatus from "@/components/web-ui/series-hero-status";
import SeasonAccordion from "@/components/web-ui/season-accordion";

import Image from "next/image";
import React from "react";
import { notFound } from "next/navigation";
import { Star, Calendar, Layers, Tv } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Season {
  seasonNumber: number;
  seasonTitle: string;
}

const EMPTY_CREDITS: TVCredits = { cast: [], crew: [], id: 0 };
const EMPTY_IMAGES: TVImages = { backdrops: [], logos: [], posters: [], id: 0 };

const WebSeriesInfoPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const seriesIdNum = parseInt(id, 10);

  const series_info: TVInfo = await InfoImagesCreditsTV({
    type: "info",
    id: seriesIdNum,
  });
  if (!series_info?.id) notFound();

  let credits_data: TVCredits = EMPTY_CREDITS;
  let images: TVImages = EMPTY_IMAGES;
  try {
    credits_data = await InfoImagesCreditsTV({
      type: "credits",
      id: seriesIdNum,
    });
    images = await InfoImagesCreditsTV({
      type: "images",
      id: seriesIdNum,
    });
  } catch (error) {
    console.error("Error fetching series credits/images:", error);
  }

  let tempSeasonInfo: Season[] = [];
  const seasonEpisodeCounts: Record<number, number> = {};

  if (series_info && series_info.seasons) {
    series_info.seasons.forEach((s) => {
      const num = s.season_number!;
      tempSeasonInfo.push({
        seasonNumber: num,
        seasonTitle: s.name || `Season ${num}`,
      });
      seasonEpisodeCounts[num] = s.episode_count ?? 0;
    });
  }

  if (tempSeasonInfo.length === 0 && series_info?.number_of_seasons) {
    for (let i = 0; i < series_info.number_of_seasons; i++) {
      tempSeasonInfo.push({ seasonNumber: i + 1, seasonTitle: `Season ${i + 1}` });
      seasonEpisodeCounts[i + 1] = seasonEpisodeCounts[i + 1] ?? 0;
    }
  }

  const SeasonInfo = tempSeasonInfo;
  const backdropUrl = series_info.backdrop_path || series_info.poster_path;
  const year = series_info.first_air_date
    ? new Date(series_info.first_air_date).getFullYear()
    : "";

  return (
    <main className="min-h-screen pb-24 bg-background text-foreground">
      {/* 1. Immersive Hero Backdrop Header */}
      <section className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden flex items-end">
        {backdropUrl && (
          <Image
            src={`https://image.tmdb.org/t/p/original${backdropUrl}`}
            alt={series_info.name || "Series"}
            fill
            priority
            className="object-cover object-center brightness-70 scale-105 transition-all duration-1000"
          />
        )}
        {/* Streaming Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-[#090A10]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090A10] via-[#090A10]/70 to-transparent z-10 w-full md:w-3/4" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#090A10]/80 to-transparent z-10" />

        {/* Billboard Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pb-12 relative z-20 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 text-center md:text-left">
            {/* Poster Thumbnail */}
            <div className="relative w-36 sm:w-44 md:w-52 aspect-[2/3] shrink-0 rounded-lg overflow-hidden shadow-2xl border border-white/20 bg-[#12151F]">
              <Image
                src={
                  series_info.poster_path
                    ? `https://image.tmdb.org/t/p/w500${series_info.poster_path}`
                    : "/placeholder.svg"
                }
                fill
                priority
                alt={`${series_info.name} poster`}
                className="object-cover"
              />
            </div>

            {/* Info details */}
            <div className="space-y-3 max-w-3xl">
              <SeriesHeroStatus seriesId={seriesIdNum} />

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white leading-none">
                {series_info.name}
              </h1>

              {series_info.tagline && (
                <p className="text-base sm:text-lg text-slate-300 italic font-medium">
                  &ldquo;{series_info.tagline}&rdquo;
                </p>
              )}

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs sm:text-sm font-semibold text-[#94A3B8]">
                {series_info.vote_average && series_info.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-[#F59E0B] font-bold bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20">
                    <Star className="h-3.5 w-3.5 fill-[#F59E0B]" />
                    {series_info.vote_average.toFixed(1)}
                  </span>
                )}
                {year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {year}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" />
                  {series_info.number_of_seasons || 1} Seasons
                </span>
                <Badge variant="outline" className="text-[10px] font-bold border-white/20 text-white px-1.5 py-0">
                  HD
                </Badge>
              </div>

              {/* Genre Chips */}
              {series_info.genres && series_info.genres.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
                  {series_info.genres.map((g) => (
                    <span
                      key={g.id}
                      className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded border border-white/10"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Container: Tracking Panel, Tabs, and Season Episodes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 mt-8 space-y-10">
        {/* Tracking Panel */}
        <SeriesTrackingPanel
          seriesId={seriesIdNum}
          seriesTitle={series_info.name ?? ""}
          posterPath={series_info.poster_path ?? null}
          overview={series_info.overview ?? ""}
          seasonEpisodeCounts={seasonEpisodeCounts}
        />

        {/* Season Archives */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-white/[0.08] pb-3">
            <span className="w-1.5 h-6 bg-[#00A8E1] rounded-full" />
            <h2 className="text-xl md:text-2xl font-display font-black tracking-tight text-white">
              Seasons & Episodes
            </h2>
          </div>
          <SeasonAccordion
            data={SeasonInfo}
            seriesId={seriesIdNum}
            seasonEpisodeCounts={seasonEpisodeCounts}
          />
        </section>

        {/* Info Tabs */}
        <section className="pt-4">
          <SeriesInfoTabs
            data={series_info}
            credits={credits_data}
            artwork={images}
          />
        </section>
      </div>
    </main>
  );
};

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const { id } = await params;
    if (!/^\d+$/.test(id)) {
      return { title: "Series Not Found" };
    }
    const seriesInfo = (await InfoImagesCreditsTV({
      type: "info",
      id: parseInt(id, 10),
    })) as TVInfo;

    if (!seriesInfo) {
      return { title: "Series Not Found" };
    }

    const releaseYear = seriesInfo.first_air_date
      ? new Date(seriesInfo.first_air_date).getFullYear()
      : "";
    const title = `${seriesInfo.name}${releaseYear ? ` (${releaseYear})` : ""} - Dramaflix`;

    return {
      title,
      description:
        seriesInfo.overview || `Watch ${seriesInfo.name} on Dramaflix`,
      openGraph: {
        title,
        images: [
          {
            url: `https://image.tmdb.org/t/p/original${seriesInfo.backdrop_path || seriesInfo.poster_path}`,
          },
        ],
      },
    };
  } catch (error) {
    return { title: "TV Series - Dramaflix" };
  }
}

export default WebSeriesInfoPage;
