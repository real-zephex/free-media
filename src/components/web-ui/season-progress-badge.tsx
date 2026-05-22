"use client";

import React, { useEffect, useState } from "react";
import { getSeasonProgress } from "@/utils/localStorage";

interface SeasonProgressBadgeProps {
  seriesId: number;
  season: number;
  totalEpisodes: number;
}

const SeasonProgressBadge: React.FC<SeasonProgressBadgeProps> = ({
  seriesId,
  season,
  totalEpisodes,
}) => {
  const [progress, setProgress] = useState({ watched: 0, total: 0, percent: 0 });

  useEffect(() => {
    setProgress(getSeasonProgress(seriesId, season, totalEpisodes));
  }, [seriesId, season, totalEpisodes]);

  if (progress.total === 0) return null;

  return (
    <div className="flex items-center gap-2 ml-auto">
      <div className="h-1.5 w-20 rounded-full bg-muted/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary/60 transition-all duration-500 ease-out"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <span className="text-[10px] font-black text-muted-foreground tabular-nums whitespace-nowrap">
        {progress.watched}/{progress.total}
      </span>
    </div>
  );
};

export default SeasonProgressBadge;
