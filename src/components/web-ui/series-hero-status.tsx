"use client";

import React, { useEffect, useState } from "react";
import { watchStatusRetriever } from "@/utils/localStorage";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCheck, BookmarkPlus, Tv } from "lucide-react";

interface SeriesHeroStatusProps {
  seriesId: number;
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  Watching: {
    icon: <Eye className="h-3 w-3" />,
    label: "Watching",
    color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  },
  Completed: {
    icon: <CheckCheck className="h-3 w-3" />,
    label: "Completed",
    color: "border-blue-500/40 text-blue-400 bg-blue-500/10",
  },
  "Plan to Watch": {
    icon: <BookmarkPlus className="h-3 w-3" />,
    label: "Plan to Watch",
    color: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  },
};

const SeriesHeroStatus: React.FC<SeriesHeroStatusProps> = ({ seriesId }) => {
  const [status, setStatus] = useState<string>("Not found");

  useEffect(() => {
    setStatus(watchStatusRetriever(seriesId));
  }, [seriesId]);

  const baseBadge = (
    <div className="inline-flex items-center gap-1.5 bg-[#00A8E1]/20 border border-[#00A8E1]/30 text-white font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
      <Tv className="h-3 w-3 text-[#00A8E1]" />
      <span>TV SERIES</span>
    </div>
  );

  if (status === "Not found") return baseBadge;

  const config = statusConfig[status];
  if (!config) return baseBadge;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {baseBadge}
      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    </div>
  );
};

export default SeriesHeroStatus;
