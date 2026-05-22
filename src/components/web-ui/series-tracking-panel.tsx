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
} from "@/utils/localStorage";
import TrackingProgressBar from "./tracking-progress-bar";
import { Play, BarChart3 } from "lucide-react";
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
    });
    if (ok) {
      setStatus(value);
    }
  };

  const handleResume = () => {
    const item = (
      JSON.parse(localStorage.getItem("watchHistory") || "[]") as any[]
    ).find((i: any) => i.id === seriesId);
    const season = item?.lastSeason ?? 1;
    const episode = item?.lastEpisode ?? 1;
    router.push(`/web-series/watch/${season}/${episode}/${seriesId}`);
  };

  return (
    <div className="bg-muted/20 border border-border/50 rounded-3xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 flex items-center gap-1.5">
            <BarChart3 className="h-3 w-3" />
            Tracking Intel
          </span>
          <h3 className="text-xl font-black italic tracking-tight">
            {seriesTitle}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {status !== "Not found" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 font-bold rounded-full"
              onClick={handleResume}
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Resume
            </Button>
          )}
          <Select
            onValueChange={handleStatusChange}
            value={status === "Not found" ? undefined : status}
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
