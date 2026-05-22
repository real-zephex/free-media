"use client";

import React, { useEffect, useState } from "react";
import { MovieInfoType } from "@/utils/types";
import Link from "next/link";
import { storeIntoLocal, watchStatusRetriever } from "@/utils/localStorage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tv, Monitor, PlayCircle, Eye } from "lucide-react";

const MoviePlayer = ({
  id,
  movieData,
}: {
  id: string;
  movieData: MovieInfoType;
}) => {
  const [watchStatus, setWatchStatus] = useState<string>("Not found");
  const vidLinksArray = [
    { title: "EmbedMaster", link: `https://embedmaster.link/1imz6ldd5kpmzdyi/movie/${id}` },
    { title: "EZVidAPI", link: `https://ezvidapi.com/embed/movie/${id}` },
    { title: "2Embed", link: `https://www.2embed.stream/embed/movie/${id}` },
    { title: "VidPop", link: `https://www.vidpop.xyz/embed/?id=${id}` },
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
      alert("An error occurred while trying to save your watch status. Please try again.");
    }
  };

  return (
    <Card className="border-none bg-transparent shadow-none">
      <Tabs defaultValue="EmbedMaster" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <ScrollArea className="w-full pb-1">
            <TabsList className="bg-muted/50 p-1 rounded-xl border border-border/50 inline-flex w-max">
              {vidLinksArray.map((items) => (
                <TabsTrigger 
                  key={items.title} 
                  value={items.title} 
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold whitespace-nowrap"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  {items.title}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Status:</span>
            <Select onValueChange={handleStatusChange} value={watchStatus === "Not found" ? undefined : watchStatus}>
              <SelectTrigger className="w-[180px] bg-card border-border/50 font-bold">
                <SelectValue placeholder="Mark as?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Watching" className="font-bold">Watching</SelectItem>
                <SelectItem value="Completed" className="font-bold">Completed</SelectItem>
                <SelectItem value="Plan to Watch" className="font-bold">Plan to Watch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {vidLinksArray.map((items) => (
          <TabsContent key={items.title} value={items.title} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-black">
              <iframe
                src={items.link}
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                title={`Movie Player - ${items.title}`}
              />
            </div>
            
            <div className="mt-4 p-4 bg-muted/20 rounded-2xl border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium">
                  Streaming <span className="text-primary font-black italic">{movieData.title}</span> on 
                  <span className="ml-1 text-foreground font-bold underline decoration-primary/30 underline-offset-4 cursor-pointer hover:text-primary transition-colors">
                    Dramaflix
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                <Eye className="h-3 w-3" />
                <span>Source: {items.title}</span>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default MoviePlayer;
