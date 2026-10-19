"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star, TrendingUp, ChevronLeft, ChevronRight, Tv } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FeaturedItem {
  id: number | string;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
}

interface HeroSectionProps {
  featured?: FeaturedItem;
  featuredItems?: FeaturedItem[];
}

export const HeroSection = ({ featured, featuredItems }: HeroSectionProps) => {
  // Normalize items array
  const items: FeaturedItem[] =
    featuredItems && featuredItems.length > 0
      ? featuredItems
      : featured
      ? [featured]
      : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = items.length;
  const current = items[activeIndex] || items[0];

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance every 8 seconds if not hovered
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [total, isPaused, nextSlide]);

  if (!current) return null;

  const title = current.title || current.name || "Unlimited Entertainment";
  const year =
    current.release_date?.split("-")[0] ||
    current.first_air_date?.split("-")[0] ||
    "2024";
  const rating = current.vote_average ? current.vote_average.toFixed(1) : "8.7";
  const backdropUrl = current.backdrop_path
    ? `https://image.tmdb.org/t/p/original${current.backdrop_path}`
    : current.poster_path
    ? `https://image.tmdb.org/t/p/original${current.poster_path}`
    : "/movie.jpg";

  const targetLink = `/movies/${current.id}`;

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center overflow-hidden w-full pt-16 group/hero"
    >
      {/* Background Backdrop with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id || activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={backdropUrl}
            alt={title}
            fill
            priority
            className="object-cover object-center scale-105 transform brightness-[0.72]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Vignettes */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#090A10] via-[#090A10]/75 to-transparent z-10 w-full lg:w-3/4 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-[#090A10]/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#090A10]/80 to-transparent z-10 pointer-events-none" />

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 w-full relative z-20 py-12 md:py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id || activeIndex}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl space-y-4 sm:space-y-5"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/40 px-3 py-1 rounded-md text-white text-xs font-black tracking-wider uppercase">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span>TOP #{activeIndex + 1} SPOTLIGHT</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white leading-none drop-shadow-2xl">
              {title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-[#94A3B8]">
              <span className="flex items-center gap-1 text-[#F59E0B] font-bold bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20">
                <Star className="h-3.5 w-3.5 fill-[#F59E0B]" />
                {rating}
              </span>
              <span>{year}</span>
              <Badge variant="outline" className="text-[10px] font-bold border-white/20 text-white px-1.5 py-0">
                4K ULTRA HD
              </Badge>
              <Badge variant="outline" className="text-[10px] font-bold border-white/20 text-white px-1.5 py-0">
                HDR
              </Badge>
              <Badge variant="outline" className="text-[10px] font-bold border-white/20 text-white px-1.5 py-0">
                5.1 AUDIO
              </Badge>
            </div>

            {/* Synopsis */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed line-clamp-3 md:line-clamp-4 max-w-xl drop-shadow">
              {current.overview ||
                "Stream top-rated movies, blockbuster hits, and binge-worthy television series on Dramaflix with ultra-fast playback."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link href={targetLink}>
                <Button
                  size="lg"
                  className="h-12 sm:h-14 px-7 sm:px-8 rounded-lg bg-white text-black hover:bg-white/90 font-black text-base gap-2.5 shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-105 transition-all cursor-pointer"
                >
                  <Play className="h-5 w-5 fill-black" />
                  Play Now
                </Button>
              </Link>

              <Link href={targetLink}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 sm:h-14 px-6 sm:px-7 rounded-lg bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 font-bold text-base gap-2.5 hover:scale-105 transition-all cursor-pointer"
                >
                  <Info className="h-5 w-5" />
                  More Info
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Slide Navigation Chevrons */}
      {total > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover/hero:opacity-100 transition-all duration-300 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover/hero:opacity-100 transition-all duration-300 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Slide Indicator Pills */}
          <div className="absolute bottom-8 right-6 sm:right-12 z-30 flex items-center gap-1.5">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? "w-7 bg-primary shadow-[0_0_10px_rgba(229,9,20,0.8)]"
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
