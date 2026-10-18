"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  storeIntoLocal,
  watchStatusRetriever,
  getSeriesProgress,
  getWatchHistoryItem,
} from "@/utils/localStorage";
import TrackingProgressBar from "./tracking-progress-bar";
import { Play, BarChart3, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";

interface SeriesTrackingPanelProps {
  seriesId: number;
  seriesTitle: string;
  posterPath: string | null;
  overview: string;
  seasonEpisodeCounts?: Record<number, number>;
}

const SeriesTrackingPanel: React.FC<SeriesTrackingPanelProps> = ({
  seriesId,
  seriesTitle,
  posterPath,
  overview,
  seasonEpisodeCounts,
}) => {
  const router = useRouter();
  const [status, setStatus] = useState<string>("Not found");
  const [progress, setProgress] = useState({ watched: 0, total: 0, percent: 0 });

  const refreshProgress = useCallback(() => {
    const p = getSeriesProgress(seriesId, seasonEpisodeCounts);
    setProgress(p);
  }, [seriesId, seasonEpisodeCounts]);

  useEffect(() => {
    const s = watchStatusRetriever(seriesId);
    setStatus(s);
    refreshProgress();
  }, [seriesId, refreshProgress]);

  const handleStatusChange = (value: string) => {
    const ok = storeIntoLocal({
      type: "TV",
      movieData: {
        id: seriesId,
        title: seriesTitle,
        poster_path: posterPath,
        overview,
      },
      status: value as "Completed" | "Plan to Watch" | "Watching",
      seasonEpisodeCounts,
    });
    if (ok) {
      setStatus(value);
    }
  };

  const handleResume = () => {
    const item = getWatchHistoryItem(seriesId);
    const season = item?.lastSeason ?? 1;
    const episode = item?.lastEpisode ?? 1;
    router.push(`/web-series/watch/${season}/${episode}/${seriesId}`);
  };

  return (
    <div className="bg-[#12151F] border border-white/[0.08] rounded-xl p-5 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            Watch Progress
          </span>
          <h3 className="text-lg md:text-xl font-display font-black text-white">
            {seriesTitle}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {status !== "Not found" && (
            <Button
              size="sm"
              className="gap-2 font-bold text-xs bg-white text-black hover:bg-white/90 rounded-md px-4 h-9 shadow-md cursor-pointer"
              onClick={handleResume}
            >
              <Play className="h-3.5 w-3.5 fill-black" />
              Resume
            </Button>
          )}
          <Select
            onValueChange={handleStatusChange}
            value={status === "Not found" ? "" : status}
          >
            <SelectTrigger className="w-[160px] bg-[#090A10] border-white/10 text-white font-semibold text-xs rounded-md h-9">
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
        </div>
      </div>

      {progress.total > 0 && (
        <TrackingProgressBar
          watched={progress.watched}
          total={progress.total}
          percent={progress.percent}
          variant="default"
        />
      )}
    </div>
  );
};

export default SeriesTrackingPanel;
