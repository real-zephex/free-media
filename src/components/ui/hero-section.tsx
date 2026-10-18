"use client";

import { motion } from "framer-motion";
import { Play, Info, Star, TrendingUp, Sparkles, Tv, Film } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  featured?: {
    id: number | string;
    title?: string;
    name?: string;
    overview?: string;
    backdrop_path?: string | null;
    poster_path?: string | null;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
  };
}

export const HeroSection = ({ featured }: HeroSectionProps) => {
  const title = featured?.title || featured?.name || "Unlimited Entertainment";
  const year = featured?.release_date?.split("-")[0] || featured?.first_air_date?.split("-")[0] || "2024";
  const rating = featured?.vote_average ? featured.vote_average.toFixed(1) : "8.7";
  const backdropUrl = featured?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${featured.backdrop_path}`
    : featured?.poster_path
    ? `https://image.tmdb.org/t/p/original${featured.poster_path}`
    : "/movie.jpg";

  const targetLink = featured ? `/movies/${featured.id}` : "/movies";

  return (
    <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center overflow-hidden w-full pt-16">
      {/* Background Image / Backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backdropUrl}
          alt={title}
          fill
          priority
          className="object-cover object-center scale-105 transform brightness-[0.75] transition-all duration-1000"
        />
        {/* Cinematic Vignettes: Left to Right and Bottom to Top (Authentic Streaming Style) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090A10] via-[#090A10]/75 to-transparent z-10 w-full lg:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-[#090A10]/50 to-transparent z-10" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#090A10]/80 to-transparent z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 w-full relative z-20 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl space-y-5"
        >
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/40 px-3.5 py-1.5 rounded-md text-white text-xs font-black tracking-wider uppercase">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span>TOP 10 THIS WEEK</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white leading-none drop-shadow-2xl">
            {title}
          </h1>

          {/* Meta Info Row */}
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

          {/* Synopsis Overview */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed line-clamp-3 md:line-clamp-4 max-w-xl drop-shadow">
            {featured?.overview ||
              "Stream top-rated movies, blockbuster hits, and binge-worthy television series on Dramaflix with ultra-fast playback."}
          </p>

          {/* CTAs: Netflix & Prime style buttons */}
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

            <Link href="/web-series">
              <Button
                size="lg"
                variant="ghost"
                className="h-12 sm:h-14 px-5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 font-semibold text-sm gap-2"
              >
                <Tv className="h-4 w-4 text-primary" />
                Browse Series
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
