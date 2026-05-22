"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import SeasonEpisodeGrid from "./episode-card-grid";
import { SeasonInfo } from "@/utils/tv-requests/request";
import { TVSeasonInfo } from "@/utils/types";

interface LazySeasonGridProps {
  seriesId: number;
  seasonNumber: number;
}

const LazySeasonGrid: React.FC<LazySeasonGridProps> = ({
  seriesId,
  seasonNumber,
}) => {
  const [data, setData] = useState<TVSeasonInfo | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    SeasonInfo({ id: seriesId, season: seasonNumber })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [seriesId, seasonNumber]);

  if (error) {
    return (
      <div className="col-span-full py-10 text-center bg-muted/20 border-2 border-dashed rounded-2xl">
        <p className="text-muted-foreground font-bold italic">
          Failed to load episodes.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SeasonEpisodeGrid
      episodes={data.episodes}
      seriesId={seriesId}
      seasonNumber={seasonNumber}
    />
  );
};

export default LazySeasonGrid;
