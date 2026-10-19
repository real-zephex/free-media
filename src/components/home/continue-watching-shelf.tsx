"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Sparkles, Film } from "lucide-react";
import {
  getAllHistory,
  getSeriesProgress,
  getPlaybackProgress,
  WatchHistoryItem,
} from "@/utils/localStorage";
import { MediaShelf } from "@/components/ui/media-shelf";

export const HomeContinueWatching: React.FC = () => {
  const router = useRouter();
  const [items, setItems] = useState<WatchHistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const history = getAllHistory();
    // Filter items that are either marked Watching or have playback progress
    const active = history.filter((item) => {
      if (item.watch_status === "Watching") return true;
      if (item.type === "TV") {
        return getSeriesProgress(item.id).percent > 0;
      }
      return (getPlaybackProgress(item.id)?.playbackPercentage ?? 0) > 0;
    });

    // Sort by most recently updated
    active.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
    setItems(active);
  }, []);

  if (!mounted || items.length === 0) return null;

  const handleResume = (item: WatchHistoryItem) => {
    if (item.type === "MOVIE") {
      router.push(`/movies/${item.id}`);
    } else {
      const season = item.lastSeason ?? 1;
      const episode = item.lastEpisode ?? 1;
      router.push(`/web-series/watch/${season}/${episode}/${item.id}`);
    }
  };

  return (
    <MediaShelf
      title="Continue Watching for You"
      subtitle="Pick up right where you left off"
      href="/watch-history"
      accentColor="bg-primary"
      className="pt-2"
    >
      {items.map((item) => {
        const prog =
          item.type === "TV"
            ? getSeriesProgress(item.id)
            : (() => {
                const p = getPlaybackProgress(item.id);
                return p
                  ? { watched: 0, total: 0, percent: Math.round(p.playbackPercentage) }
                  : { watched: 0, total: 0, percent: 0 };
              })();

        const posterSrc = item.poster?.startsWith("http")
          ? item.poster
          : item.poster
          ? `https://image.tmdb.org/t/p/w342${item.poster}`
          : null;

        return (
          <div
            key={item.id}
            onClick={() => handleResume(item)}
            className="group relative w-[170px] sm:w-[190px] md:w-[210px] shrink-0 rounded-lg overflow-hidden bg-[#12151F] border border-white/[0.08] hover:border-white/25 transition-all duration-300 hover:scale-[1.03] shadow-lg cursor-pointer"
          >
            {/* Poster / Thumbnail */}
            <div className="relative aspect-[2/3] w-full bg-black overflow-hidden">
              {posterSrc ? (
                <Image
                  src={posterSrc}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="210px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5">
                  <Film className="h-8 w-8 text-[#94A3B8]" />
                </div>
              )}

              {/* Progress Line */}
              {prog.percent > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/70 z-20">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${prog.percent}%` }}
                  />
                </div>
              )}

              {/* Hover Resume Button */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 z-10">
                <div className="bg-white text-black p-3 rounded-full shadow-2xl hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 fill-black ml-0.5" />
                </div>
              </div>

              {/* Top Badge */}
              <div className="absolute top-2 left-2 z-10">
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-white border border-white/10">
                  {item.type === "TV" ? "SERIES" : "MOVIE"}
                </span>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="p-2.5 space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                <span>
                  {item.type === "TV" && item.lastSeason && item.lastEpisode
                    ? `S${item.lastSeason} E${item.lastEpisode}`
                    : `${prog.percent}% watched`}
                </span>
                <span className="text-primary font-bold">Resume ▶</span>
              </div>
            </div>
          </div>
        );
      })}
    </MediaShelf>
  );
};
