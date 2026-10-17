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
import { Card } from "@/components/ui/card";
import { PlayCircle, Eye } from "lucide-react";
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
    <Card className="border-none bg-transparent shadow-none">
      <EmbedSourcePlayer
        sources={vidLinksArray}
        playerTitle="Movie Player"
        headerExtra={
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
              Status:
            </span>
            <Select
              onValueChange={handleStatusChange}
              value={watchStatus === "Not found" ? "" : watchStatus}
            >
              <SelectTrigger className="w-[180px] bg-card border-border/50 font-bold">
                <SelectValue placeholder="Mark as?" />
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
        }
        footer={
          <div className="mt-4 p-4 bg-muted/20 rounded-2xl border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">
                Streaming{" "}
                <span className="text-primary font-black italic">
                  {movieData.title}
                </span>{" "}
                on
                <span className="ml-1 text-foreground font-bold underline decoration-primary/30 underline-offset-4 cursor-pointer hover:text-primary transition-colors">
                  Dramaflix
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
              <Eye className="h-3 w-3" />
              <span>Switch sources from the dropdown above</span>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default MoviePlayer;
