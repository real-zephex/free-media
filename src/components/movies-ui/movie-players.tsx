"use client";

import React, { useEffect, useState } from "react";
import { MovieInfoType } from "@/utils/types";
import { storeIntoLocal, watchStatusRetriever } from "@/utils/localStorage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlayCircle, Eye, Bookmark, CheckCheck } from "lucide-react";
import EmbedSourcePlayer, { EmbedSource } from "@/components/embed-source-player";

const MoviePlayer = ({
  id,
  movieData,
}: {
  id: string;
  movieData: MovieInfoType;
}) => {
  const [watchStatus, setWatchStatus] = useState<string>("Not found");
  const vidLinksArray: EmbedSource[] = [
    { title: "EmbedMaster", link: `https://embedmaster.link/1imz6ldd5kpmzdyi/movie/${id}` },
    { title: "VidSrcBuzz", link: `https://vidsrc.buzz/embed/movie/${id}` },
    { title: "VidFast", link: `https://vidfast.vc/movie/${id}` },
    { title: "Videasy", link: `https://player.videasy.ws/embed/movie/${id}` },
    { title: "2Embed", link: `https://www.2embed.stream/embed/movie/${id}` },
    { title: "VixSrc", link: `https://vixsrc.to/movie/${id}` },
    { title: "CineSrc", link: `https://cinesrc.st/embed/movie/${id}` },
  ];

  useEffect(() => {
    const status = watchStatusRetriever(String(movieData.id));
    setWatchStatus(status);
  }, [movieData.id]);

  const handleStatusChange = (value: string) => {
    const watchOperationStatus = storeIntoLocal({
      type: "MOVIE",
      movieData,
      status: value as "Completed" | "Plan to Watch" | "Watching",
    });
    if (watchOperationStatus) {
      setWatchStatus(value);
    } else {
      console.error("Failed to save watch status");
    }
  };

  return (
    <div className="w-full">
      <EmbedSourcePlayer
        sources={vidLinksArray}
        playerTitle="Movie Player"
        headerExtra={
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Track Status:
            </span>
            <Select
              onValueChange={handleStatusChange}
              value={watchStatus === "Not found" ? "" : watchStatus}
            >
              <SelectTrigger className="w-[160px] bg-[#12151F] border-white/10 text-white font-semibold text-xs rounded-md">
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
        }
        footer={
          <div className="mt-3 p-3 bg-[#090A10]/60 rounded-lg border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <PlayCircle className="h-4 w-4 text-primary" />
              <span>
                Streaming <strong className="text-white font-bold">{movieData.title}</strong> in High Definition
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]/70">
              <Eye className="h-3 w-3" />
              <span>Switch servers if video buffers</span>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default MoviePlayer;
