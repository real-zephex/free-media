"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Layers, Loader2 } from "lucide-react";
import SeasonProgressBadge from "./season-progress-badge";
import LazySeasonGrid from "./lazy-season-grid";

interface Season {
  seasonNumber: number;
  seasonTitle: string;
}

interface SeasonAccordionProps {
  data: Season[];
  seriesId: number;
  seasonEpisodeCounts: Record<number, number>;
}

const SeasonAccordion: React.FC<SeasonAccordionProps> = ({
  data,
  seriesId,
  seasonEpisodeCounts,
}) => {
  const [accordionValue, setAccordionValue] = useState("");
  const [openedSeasons, setOpenedSeasons] = useState<Set<number>>(new Set());

  const handleValueChange = useCallback((value: string) => {
    setAccordionValue(value);
  }, []);

  useEffect(() => {
    if (!accordionValue) return;
    const match = accordionValue.match(/^season-(\d+)$/);
    if (match) {
      const num = parseInt(match[1]);
      setOpenedSeasons((prev) => {
        if (prev.has(num)) return prev;
        const next = new Set(prev);
        next.add(num);
        return next;
      });
    }
  }, [accordionValue]);

  if (!data || data.length === 0) {
    return (
      <p className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-2xl">
        No seasons found
      </p>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={handleValueChange}
      className="w-full space-y-2 mt-8"
    >
      {data.map((item, index) => (
        <AccordionItem
          key={index}
          value={`season-${item.seasonNumber}`}
          className="border border-border/50 bg-muted/20 rounded-2xl px-6 overflow-hidden data-[state=open]:bg-muted/30 transition-all"
        >
          <AccordionTrigger className="hover:no-underline py-5">
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5 text-primary shrink-0" />
                <span className="text-xl font-black italic tracking-tighter uppercase">
                  {item.seasonTitle}
                </span>
              </div>
              <SeasonProgressBadge
                seriesId={seriesId}
                season={item.seasonNumber}
                totalEpisodes={
                  seasonEpisodeCounts[item.seasonNumber] ?? 0
                }
              />
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            {openedSeasons.has(item.seasonNumber) ? (
              <LazySeasonGrid
                seriesId={seriesId}
                seasonNumber={item.seasonNumber}
              />
            ) : (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default SeasonAccordion;
