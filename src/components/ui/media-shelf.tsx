"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaShelfProps {
  title: string;
  href?: string;
  accentColor?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const MediaShelf: React.FC<MediaShelfProps> = ({
  title,
  href,
  accentColor = "bg-primary",
  subtitle,
  children,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const distance = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className={cn("space-y-3 relative group/shelf", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          {href ? (
            <Link
              href={href}
              className="group/title inline-flex items-center gap-2 text-xl md:text-2xl font-display font-black tracking-tight text-white hover:text-primary transition-colors"
            >
              <span className={cn("w-1.5 h-6 rounded-full shrink-0", accentColor)} />
              <span>{title}</span>
              <ChevronRight className="h-5 w-5 text-[#94A3B8] group-hover/title:text-primary group-hover/title:translate-x-1 transition-all" />
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 text-xl md:text-2xl font-display font-black tracking-tight text-white">
              <span className={cn("w-1.5 h-6 rounded-full shrink-0", accentColor)} />
              <span>{title}</span>
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-[#94A3B8] font-medium pl-3.5">
              {subtitle}
            </p>
          )}
        </div>

        {href && (
          <Link
            href={href}
            className="text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors uppercase tracking-wider"
          >
            Explore All
          </Link>
        )}
      </div>

      {/* Rail Container with Chevrons */}
      <div className="relative -mx-2 px-2">
        {/* Left Chevron */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-[80%] w-10 sm:w-12 bg-black/80 hover:bg-black/95 text-white flex items-center justify-center opacity-0 group-hover/shelf:opacity-100 transition-all duration-300 rounded-r-md cursor-pointer backdrop-blur-sm border-r border-y border-white/10 shadow-2xl"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-3 px-1"
        >
          {children}
        </div>

        {/* Right Chevron */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 h-[80%] w-10 sm:w-12 bg-black/80 hover:bg-black/95 text-white flex items-center justify-center opacity-0 group-hover/shelf:opacity-100 transition-all duration-300 rounded-l-md cursor-pointer backdrop-blur-sm border-l border-y border-white/10 shadow-2xl"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        )}
      </div>
    </section>
  );
};
