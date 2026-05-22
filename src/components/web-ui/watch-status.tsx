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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Monitor, CheckCheck } from "lucide-react";
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
        });
        if (ok) {
          setWatchStatus("Watching");
          setAutoMarked(true);
        }
      }
      markEpisodeWatched(seriesId, seasonNum, episodeNum, true);
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
      alert("Error saving watch status. Please try again.");
    }
  }

  function handleMarkWatched() {
    markEpisodeWatched(seriesId, seasonNum, episodeNum, true);
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
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">
              Now Playing
            </span>
            {autoMarked && (
              <Badge
                variant="outline"
                className="text-[9px] font-black uppercase bg-green-500/10 text-green-400 border-green-500/30"
              >
                Auto-tracked
              </Badge>
            )}
          </div>
          <h4 className="font-black text-xl italic tracking-tight leading-none">
            {title}{" "}
            <span className="text-muted-foreground text-sm font-bold ml-2">
              S{season} E{episode}
            </span>
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <Select
            onValueChange={handleStatusChange}
            value={watchStatus === "Not found" ? undefined : watchStatus}
          >
            <SelectTrigger className="w-[170px] bg-card border-border/50 font-bold rounded-full">
              <SelectValue placeholder="Track Series" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Watching" className="font-bold">
                Watching
              </SelectItem>
              <SelectItem value="Completed" className="font-bold">
                Completed
              </SelectItem>
              <SelectItem value="Plan to Watch" className="font-bold">
                Plan to Watch
              </SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={handleMarkWatched}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors text-xs font-black uppercase tracking-wider"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Done
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
