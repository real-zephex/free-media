"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Play, Check, Circle } from "lucide-react";
import {
  isEpisodeWatched,
  markEpisodeWatched,
} from "@/utils/localStorage";
import { tmdbImageUrl } from "@/lib/tmdb-image";

interface EpisodeItem {
  episode_number?: number;
  name?: string;
  still_path?: string;
  vote_average?: number;
  season_number?: number;
  overview?: string;
}

interface SeasonEpisodeGridProps {
  episodes: EpisodeItem[] | undefined;
  seriesId: number;
  seasonNumber: number;
}

const SeasonEpisodeGrid: React.FC<SeasonEpisodeGridProps> = ({
  episodes,
  seriesId,
  seasonNumber,
}) => {
  const [watchedMap, setWatchedMap] = useState<Record<number, boolean>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!episodes) return;
    const map: Record<number, boolean> = {};
    episodes.forEach((ep) => {
      if (ep.episode_number !== undefined) {
        map[ep.episode_number] = isEpisodeWatched(
          seriesId,
          seasonNumber,
          ep.episode_number,
        );
      }
    });
    setWatchedMap(map);
  }, [episodes, seriesId, seasonNumber, refreshKey]);

  const handleToggleWatched = (e: React.MouseEvent, episodeNumber: number) => {
    e.preventDefault();
    e.stopPropagation();
    const current = watchedMap[episodeNumber] ?? false;
    const next = !current;
    markEpisodeWatched(seriesId, seasonNumber, episodeNumber, next);
    setWatchedMap((prev) => ({ ...prev, [episodeNumber]: next }));
    setRefreshKey((k) => k + 1);
  };

  if (!episodes || episodes.length === 0) {
    return (
      <div className="col-span-full py-16 text-center bg-[#090A10]/50 border border-dashed border-white/10 rounded-xl">
        <p className="text-[#94A3B8] font-medium text-sm">
          No episodes found for this season.
        </p>
      </div>
    );
  }

  const firstUnwatched = episodes.find(
    (ep) => !watchedMap[ep.episode_number ?? -1] && ep.episode_number !== undefined,
  );

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {episodes.map((item, index) => {
        const epNum = item.episode_number ?? index + 1;
        const isWatched = watchedMap[epNum] ?? false;
        const isNextUp = firstUnwatched?.episode_number === epNum && !isWatched;

        return (
          <Link
            key={index}
            href={`/web-series/watch/${item.season_number ?? seasonNumber}/${epNum}/${seriesId}`}
            className="group block"
          >
            <div
              className={`overflow-hidden rounded-lg bg-[#090A10] border transition-all duration-300 hover:scale-[1.02] ${
                isNextUp
                  ? "border-primary shadow-[0_0_15px_rgba(229,9,20,0.25)]"
                  : isWatched
                  ? "border-emerald-500/20 opacity-90"
                  : "border-white/[0.08] hover:border-white/20"
              }`}
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                <Image
                  src={tmdbImageUrl(item.still_path)}
                  fill
                  alt={`Episode ${epNum}`}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover Play Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white text-black p-3 rounded-full shadow-xl">
                    <Play className="h-5 w-5 fill-black ml-0.5" />
                  </div>
                </div>

                {/* Episode Badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-black/80 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded border border-white/10">
                    EP {epNum}
                  </span>
                </div>

                {/* Mark as Watched Button */}
                <button
                  className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary"
                  onClick={(e) => handleToggleWatched(e, epNum)}
                  title={isWatched ? "Mark unwatched" : "Mark watched"}
                >
                  {isWatched ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-white/70" />
                  )}
                </button>
              </div>

              <div className="p-3 space-y-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                  {item.name || `Episode ${epNum}`}
                </h4>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-[#F59E0B] font-bold">
                    <Star className="h-3 w-3 fill-[#F59E0B]" />
                    <span>{item.vote_average?.toFixed(1) || "N/A"}</span>
                  </div>
                  <span
                    className={`font-bold uppercase tracking-wider text-[10px] ${
                      isWatched
                        ? "text-emerald-400"
                        : isNextUp
                        ? "text-primary font-black"
                        : "text-[#94A3B8]"
                    }`}
                  >
                    {isWatched ? "Watched" : isNextUp ? "Next Up" : "Stream"}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SeasonEpisodeGrid;
