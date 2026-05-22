"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, PlayCircle, Check, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  isEpisodeWatched,
  markEpisodeWatched,
} from "@/utils/localStorage";
interface EpisodeItem {
  episode_number?: number;
  name?: string;
  still_path?: string;
  vote_average?: number;
  season_number?: number;
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
      <div className="col-span-full py-20 text-center bg-muted/20 border-2 border-dashed rounded-2xl">
        <p className="text-muted-foreground font-bold italic">
          No episodes found for this season.
        </p>
      </div>
    );
  }

  const firstUnwatched = episodes.find(
    (ep) => !watchedMap[ep.episode_number ?? -1] && ep.episode_number !== undefined,
  );

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {episodes.map((item, index) => {
        const epNum = item.episode_number ?? index + 1;
        const isWatched = watchedMap[epNum] ?? false;
        const isNextUp =
          firstUnwatched?.episode_number === epNum && !isWatched;

        return (
          <Link
            key={index}
            href={`/web-series/watch/${item.season_number ?? seasonNumber}/${epNum}/${seriesId}`}
            className="group block"
          >
            <Card
              className={`overflow-hidden border-border/50 bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:shadow-xl relative ${
                isNextUp
                  ? "ring-2 ring-primary/60 shadow-lg shadow-primary/10"
                  : ""
              }`}
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={
                    item.still_path
                      ? `${process.env.NEXT_PUBLIC_PROXY}https://image.tmdb.org/t/p/original${item.still_path}`
                      : "/placeholder.svg"
                  }
                  fill
                  placeholder="blur"
                  blurDataURL="/placeholder.svg"
                  alt={`Episode ${epNum}`}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-white/90" />
                </div>

                <div className="absolute top-2 left-2">
                  <span className="bg-black/60 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white px-2 py-0.5 rounded-full border border-white/10">
                    EP {epNum}
                  </span>
                </div>

                <button
                  className="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/80"
                  onClick={(e) => handleToggleWatched(e, epNum)}
                  title={isWatched ? "Mark unwatched" : "Mark watched"}
                >
                  {isWatched ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-white/70" />
                  )}
                </button>
              </div>
              <CardContent className="p-4">
                <h3 className="text-sm font-bold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-bold">
                      {item.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                    {isWatched ? "Watched" : isNextUp ? "Next Up" : "Stream Now"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default SeasonEpisodeGrid;
