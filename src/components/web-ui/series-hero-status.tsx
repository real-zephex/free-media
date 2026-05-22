"use client";

import React, { useEffect, useState } from "react";
import { watchStatusRetriever } from "@/utils/localStorage";
import { Badge } from "@/components/ui/badge";
import { Play, Eye, CheckCheck, BookmarkPlus } from "lucide-react";

interface SeriesHeroStatusProps {
  seriesId: number;
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  Watching: {
    icon: <Eye className="h-3 w-3" />,
    label: "Watching",
    color: "border-green-500/50 text-green-400",
  },
  Completed: {
    icon: <CheckCheck className="h-3 w-3" />,
    label: "Completed",
    color: "border-blue-500/50 text-blue-400",
  },
  "Plan to Watch": {
    icon: <BookmarkPlus className="h-3 w-3" />,
    label: "Plan to Watch",
    color: "border-amber-500/50 text-amber-400",
  },
};

const SeriesHeroStatus: React.FC<SeriesHeroStatusProps> = ({ seriesId }) => {
  const [status, setStatus] = useState<string>("Not found");

  useEffect(() => {
    setStatus(watchStatusRetriever(seriesId));
  }, [seriesId]);

  if (status === "Not found") return (
    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/30 text-primary bg-primary/5 px-3">
      TV SERIES
    </Badge>
  );

  const config = statusConfig[status] || null;
  if (!config) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/30 text-primary bg-primary/5 px-3">
        TV SERIES
      </Badge>
      <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest bg-background/60 backdrop-blur-sm px-3 flex items-center gap-1.5 ${config.color}`}>
        {config.icon}
        {config.label}
      </Badge>
    </div>
  );
};

export default SeriesHeroStatus;
