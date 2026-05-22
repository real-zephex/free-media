import { InfoImagesCreditsTV } from "@/utils/tv-requests/request";
import { TVInfo, TVCredits, TVImages } from "@/utils/types";
import { Metadata, ResolvingMetadata } from "next";
import SeriesInfoTabs from "@/components/web-ui/series-info-tabs";
import SeriesTrackingPanel from "@/components/web-ui/series-tracking-panel";
import SeriesHeroStatus from "@/components/web-ui/series-hero-status";
import SeasonAccordion from "@/components/web-ui/season-accordion";

import Image from "next/image";
import React from "react";

interface Season {
  seasonNumber: number;
  seasonTitle: string;
}

const WebSeriesInfoPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const seriesIdNum = parseInt(id);

  const series_info: TVInfo = await InfoImagesCreditsTV({
    type: "info",
    id: seriesIdNum,
  });
  const credits_data: TVCredits = await InfoImagesCreditsTV({
    type: "credits",
    id: seriesIdNum,
  });
  const images: TVImages = await InfoImagesCreditsTV({
    type: "images",
    id: seriesIdNum,
  });

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

  return (
    <main className="min-h-screen pb-20">
      <div className="relative w-full h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 z-0 scale-110 blur-[2px] opacity-40"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${series_info.backdrop_path})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent z-10" />

        <div className="container mx-auto h-full flex items-end px-4 pb-12 relative z-20">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
            <div className="relative w-48 md:w-64 aspect-2/3 shrink-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-background transform -rotate-1 md:rotate-0">
              <Image
                src={
                  series_info.poster_path
                    ? `https://image.tmdb.org/t/p/original${series_info.poster_path}`
                    : "/placeholder.svg"
                }
                fill
                alt="Series poster"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <SeriesHeroStatus seriesId={seriesIdNum} />
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none uppercase italic">
                  {series_info.name}
                </h1>
              </div>
              {series_info.tagline && (
                <p className="text-xl md:text-2xl font-medium text-muted-foreground/80 italic border-l-4 border-primary/40 pl-4">
                  {series_info.tagline}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <SeriesInfoTabs
          data={series_info}
          credits={credits_data}
          artwork={images}
        />

        <div className="mt-8">
          <SeriesTrackingPanel
            seriesId={seriesIdNum}
            seriesTitle={series_info.name ?? ""}
            posterPath={series_info.poster_path ?? null}
            overview={series_info.overview ?? ""}
            seasonEpisodeCounts={seasonEpisodeCounts}
          />
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-3">
            <span className="w-2 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
            Season Archives
          </h2>
          <SeasonAccordion
            data={SeasonInfo}
            seriesId={seriesIdNum}
            seasonEpisodeCounts={seasonEpisodeCounts}
          />
        </div>
      </div>
    </main>
  );
};

export async function generateMetadata(
  { params }: { params: { id: string } },
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const { id } = await params;
    const seriesInfo = (await InfoImagesCreditsTV({
      type: "info",
      id: parseInt(id),
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
