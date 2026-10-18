"use client";

import { useState } from "react";
import { Tv2, ChevronDown, Check, Server } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface EmbedSource {
  title: string;
  link: string;
}

const EmbedSourcePlayer = ({
  sources,
  playerTitle,
  headerExtra,
  footer,
  frameClassName = "rounded-lg shadow-2xl",
}: {
  sources: EmbedSource[];
  playerTitle: string;
  headerExtra?: React.ReactNode;
  footer?: React.ReactNode;
  frameClassName?: string;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sources[activeIndex] ?? sources[0];

  if (!active) return null;

  return (
    <div className="w-full space-y-4">
      {/* Streaming Player Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#090A10]/60 p-2.5 rounded-lg border border-white/[0.08]">
        {/* Source Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2.5 rounded-md border border-white/10 bg-[#12151F] px-4 py-2 font-bold text-xs uppercase tracking-wider text-white hover:bg-white/10 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer w-fit">
            <Server className="h-3.5 w-3.5 text-primary" />
            <span>Server: {active.title}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-56 bg-[#12151F]/95 backdrop-blur-xl border-white/10 text-white rounded-lg shadow-2xl p-1"
          >
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] px-2 py-1.5">
              Available Stream Servers
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            {sources.map((source, index) => (
              <DropdownMenuItem
                key={source.title}
                onSelect={() => setActiveIndex(index)}
                className="font-semibold text-xs gap-2.5 cursor-pointer rounded-md hover:bg-white/10 py-2"
              >
                <span className="w-4 flex items-center justify-center">
                  {index === activeIndex && <Check className="h-3.5 w-3.5 text-primary" />}
                </span>
                <span>{source.title}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {headerExtra}
      </div>

      {/* 16:9 Video Player Frame */}
      <div
        className={`relative aspect-video w-full overflow-hidden border border-white/10 bg-black ${frameClassName}`}
      >
        <iframe
          key={active.link}
          src={active.link}
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title={`${playerTitle} - ${active.title}`}
        />
      </div>

      {footer}
    </div>
  );
};

export default EmbedSourcePlayer;
