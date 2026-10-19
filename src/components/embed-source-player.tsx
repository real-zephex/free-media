"use client";

import { useState, useEffect } from "react";
import { Tv2, ChevronDown, Check, Server, Maximize2, Minimize2, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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
  const [isTheater, setIsTheater] = useState(false);
  const active = sources[activeIndex] ?? sources[0];

  useEffect(() => {
    if (!isTheater) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsTheater(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isTheater]);

  if (!active) return null;

  return (
    <div
      className={cn(
        "w-full transition-all duration-300",
        isTheater
          ? "fixed inset-0 z-50 bg-[#090A10]/98 backdrop-blur-2xl flex flex-col justify-center items-center p-3 sm:p-6 md:p-8 overflow-y-auto"
          : "space-y-4"
      )}
    >
      <div className={cn("w-full space-y-3", isTheater && "max-w-6xl")}>
        {/* Streaming Player Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#090A10]/80 p-2.5 rounded-lg border border-white/[0.08] backdrop-blur-md">
          {/* Source Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2.5 rounded-md border border-white/10 bg-[#12151F] px-4 py-2 font-bold text-xs uppercase tracking-wider text-white hover:bg-white/10 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer w-fit">
              <Server className="h-3.5 w-3.5 text-primary" />
              <span>Server: {active.title}</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 bg-[#12151F]/95 backdrop-blur-xl border-white/10 text-white rounded-lg shadow-2xl p-1 z-[60]"
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

          {/* Controls: Header Extra + Theater Mode Toggle */}
          <div className="flex items-center gap-2">
            {headerExtra}
            <button
              onClick={() => setIsTheater((prev) => !prev)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold border transition-all cursor-pointer",
                isTheater
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                  : "bg-[#12151F] hover:bg-white/10 text-white/90 border-white/10"
              )}
              title={isTheater ? "Exit Theater Mode (Esc)" : "Cinema Theater Mode"}
            >
              {isTheater ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5 text-white" />
                  <span>Exit Theater</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">Theater Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 16:9 Video Player Frame with Ambient Glow */}
        <div className="relative">
          {/* Ambient Edge Glow */}
          <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-primary/20 via-purple-600/10 to-[#00A8E1]/20 blur-2xl opacity-60 -z-10 rounded-2xl pointer-events-none transition-opacity duration-700" />

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
        </div>

        {footer}
      </div>
    </div>
  );
};

export default EmbedSourcePlayer;
