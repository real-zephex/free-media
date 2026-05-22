"use client";

import React from "react";

interface TrackingProgressBarProps {
  watched: number;
  total: number;
  percent: number;
  variant?: "default" | "season" | "compact";
  className?: string;
}

const TrackingProgressBar: React.FC<TrackingProgressBarProps> = ({
  watched,
  total,
  percent,
  variant = "default",
  className = "",
}) => {
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="h-1.5 flex-1 rounded-full bg-muted/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[10px] font-black text-muted-foreground tabular-nums">
          {percent}%
        </span>
      </div>
    );
  }

  if (variant === "season") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="h-1.5 w-16 rounded-full bg-muted/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/70 transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground tabular-nums">
          {watched}/{total}
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground">
          {watched}/{total} episodes
        </span>
        <span className="text-xs font-black text-primary tabular-nums">
          {percent}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default TrackingProgressBar;
