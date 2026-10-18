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
      <p className="text-center py-12 text-[#94A3B8] border border-dashed border-white/10 rounded-xl">
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
      className="w-full space-y-3"
    >
      {data.map((item, index) => (
        <AccordionItem
          key={index}
          value={`season-${item.seasonNumber}`}
          className="border border-white/[0.08] bg-[#12151F] rounded-xl px-5 overflow-hidden data-[state=open]:border-white/20 transition-all shadow-md"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 w-full pr-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-[#00A8E1]/10 text-[#00A8E1]">
                  <Layers className="h-4 w-4 shrink-0" />
                </div>
                <span className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
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
          <AccordionContent className="pb-5 pt-2">
            {openedSeasons.has(item.seasonNumber) ? (
              <LazySeasonGrid
                seriesId={seriesId}
                seasonNumber={item.seasonNumber}
              />
            ) : (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-[#94A3B8]" />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default SeasonAccordion;
