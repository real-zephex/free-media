"use client";

import { useState } from "react";
import { Monitor, ChevronDown, Check } from "lucide-react";
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
  frameClassName = "rounded-2xl shadow-2xl",
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
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-muted/50 px-4 py-2.5 font-bold whitespace-nowrap hover:bg-muted/80 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer">
            <Monitor className="h-4 w-4 text-primary" />
            <span>{active.title}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Playback Source
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sources.map((source, index) => (
              <DropdownMenuItem
                key={source.title}
                onSelect={() => setActiveIndex(index)}
                className="font-bold gap-3 cursor-pointer"
              >
                <span className="w-4">
                  {index === activeIndex && <Check className="h-4 w-4 text-primary" />}
                </span>
                {source.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {headerExtra}
      </div>

      <div
        className={`relative aspect-video w-full overflow-hidden border border-border/50 bg-black ${frameClassName}`}
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
