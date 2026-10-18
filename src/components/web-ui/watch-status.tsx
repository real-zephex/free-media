"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  storeIntoLocal,
  watchStatusRetriever,
  getSeriesProgress,
  markEpisodeWatched,
} from "@/utils/localStorage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCheck } from "lucide-react";
import TrackingProgressBar from "./tracking-progress-bar";

interface WebSeriesWatchStatusProps {
  id: string;
  season: string;
  episode: string;
  posterPath: string | null;
  title: string;
  seasonEpisodeCounts?: Record<number, number>;
}

const WebSeriesWatchStatus: React.FC<WebSeriesWatchStatusProps> = ({
  id,
  season,
  episode,
  posterPath,
  title,
  seasonEpisodeCounts,
}) => {
  const [watchStatus, setWatchStatus] = useState<string>("Not found");
  const [progress, setProgress] = useState({ watched: 0, total: 0, percent: 0 });
  const [autoMarked, setAutoMarked] = useState(false);
  const autoMarkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const seriesId = Number(id);
  const seasonNum = parseInt(season);
  const episodeNum = parseInt(episode);

  useEffect(() => {
    const status = watchStatusRetriever(seriesId);
    setWatchStatus(status);
    setProgress(getSeriesProgress(seriesId, seasonEpisodeCounts));

    autoMarkTimer.current = setTimeout(() => {
      const current = watchStatusRetriever(seriesId);
      if (current === "Not found" || current === "Plan to Watch") {
        const ok = storeIntoLocal({
          type: "TV",
          movieData: {
            id: seriesId,
            title,
            poster_path: posterPath,
            overview: "",
          },
          status: "Watching",
          season: seasonNum,
          episode: episodeNum,
          seasonEpisodeCounts,
        });
        if (ok) {
          setWatchStatus("Watching");
          setAutoMarked(true);
        }
      }
      markEpisodeWatched(seriesId, seasonNum, episodeNum, true, seasonEpisodeCounts);
    }, 30000);

    return () => {
      if (autoMarkTimer.current) clearTimeout(autoMarkTimer.current);
    };
  }, [seriesId, seasonNum, episodeNum, title, posterPath, seasonEpisodeCounts]);

  function handleStatusChange(value: string) {
    const ok = storeIntoLocal({
      type: "TV",
      movieData: {
        id: seriesId,
        title,
        poster_path: posterPath,
        overview: "",
      },
      status: value as "Completed" | "Plan to Watch" | "Watching",
      season: seasonNum,
      episode: episodeNum,
    });
    if (ok) {
      setWatchStatus(value);
    } else {
      console.error("Failed to save watch status");
    }
  }

  function handleMarkWatched() {
    markEpisodeWatched(seriesId, seasonNum, episodeNum, true, seasonEpisodeCounts);
    setProgress((prev) => ({
      ...prev,
      watched: Math.min(prev.watched + 1, prev.total),
      percent:
        prev.total > 0
          ? Math.round(((Math.min(prev.watched + 1, prev.total)) / prev.total) * 100)
          : 0,
    }));
  }

  return (
    <div className="p-5 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Now Playing
            </span>
            {autoMarked && (
              <span className="text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                Auto-tracked
              </span>
            )}
          </div>
          <h4 className="font-display font-bold text-lg md:text-xl text-white">
            {title}{" "}
            <span className="text-[#94A3B8] text-sm font-semibold ml-2">
              S{season} E{episode}
            </span>
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <Select
            onValueChange={handleStatusChange}
            value={watchStatus === "Not found" ? "" : watchStatus}
          >
            <SelectTrigger className="w-[160px] bg-[#090A10] border-white/10 font-semibold text-xs text-white rounded-md h-9">
              <SelectValue placeholder="Add to List" />
            </SelectTrigger>
            <SelectContent className="bg-[#12151F] border-white/10 text-white rounded-md shadow-2xl">
              <SelectItem value="Watching" className="text-xs font-semibold cursor-pointer">
                Watching
              </SelectItem>
              <SelectItem value="Completed" className="text-xs font-semibold cursor-pointer">
                Completed
              </SelectItem>
              <SelectItem value="Plan to Watch" className="text-xs font-semibold cursor-pointer">
                Plan to Watch
              </SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={handleMarkWatched}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark Watched</span>
          </button>
        </div>
      </div>

      {progress.total > 0 && (
        <TrackingProgressBar
          watched={progress.watched}
          total={progress.total}
          percent={progress.percent}
          variant="compact"
        />
      )}
    </div>
  );
};

export default WebSeriesWatchStatus;
