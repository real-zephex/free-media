export const dynamic = "force-dynamic";

import React from "react";
import MoviesGridConstructor from "@/components/movies-ui/movies-formatter";
import { Metadata } from "next";
import { MoviesDiscover } from "@/utils/movie-requests/request";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Info, Star, Flame, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Movies - Dramaflix",
  description:
    "Explore blockbusters, new releases, and timeless cinema on Dramaflix.",
};

const MovieHomepage = async () => {
  const trendingData = await MoviesDiscover("trending", "week");
  const heroMovie = trendingData?.results?.[0];

  const categories = [
    { title: "Popular", type: "popular" },
    { title: "Trending", type: "trending" },
    { title: "Top Rated", type: "top_rated" },
    { title: "Now Playing", type: "now_playing" },
  ];

  return (
    <main className="min-h-screen pb-24 overflow-x-hidden bg-background text-foreground">
      {/* 1. Cinematic Billboard Spotlight */}
      {heroMovie && (
        <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden flex items-end">
          <Image
            src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
            alt={heroMovie.title}
            fill
            className="object-cover object-center brightness-75 transition-transform duration-1000"
            priority
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-[#090A10]/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090A10] via-[#090A10]/70 to-transparent z-10 w-full md:w-3/4" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#090A10]/80 to-transparent z-10" />

          {/* Billboard Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pb-16 md:pb-24 relative z-20 w-full">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/40 px-3 py-1 rounded-md text-white text-xs font-black uppercase tracking-wider">
                <Flame className="h-3.5 w-3.5 text-primary" />
                #1 MOVIE THIS WEEK
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white leading-none drop-shadow-2xl">
                {heroMovie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-[#94A3B8]">
                <span className="flex items-center gap-1 text-[#F59E0B] font-bold bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20">
                  <Star className="h-3.5 w-3.5 fill-[#F59E0B]" />
                  {heroMovie.vote_average.toFixed(1)}
                </span>
                <span>{heroMovie.release_date?.split("-")[0]}</span>
                <Badge variant="outline" className="text-[10px] font-bold border-white/20 text-white px-1.5 py-0">
                  4K ULTRA HD
                </Badge>
              </div>

              <p className="text-sm sm:text-base text-slate-300 font-normal line-clamp-3 leading-relaxed max-w-xl">
                {heroMovie.overview}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href={`/movies/${heroMovie.id}`}>
                  <Button
                    size="lg"
                    className="h-12 px-7 rounded-lg bg-white text-black hover:bg-white/90 font-black text-sm gap-2.5 shadow-lg hover:scale-105 transition-all"
                  >
                    <Play className="h-4 w-4 fill-black" />
                    Play Now
                  </Button>
                </Link>
                <Link href={`/movies/${heroMovie.id}`}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 px-6 rounded-lg bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 font-bold text-sm gap-2 hover:scale-105 transition-all"
                  >
                    <Info className="h-4 w-4" />
                    More Info
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Categories & Catalog Rails */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 -mt-8 sm:-mt-12 relative z-30 space-y-8">
        <Tabs defaultValue="popular" className="w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white">
                Explore Movies
              </h2>
            </div>

            {/* Streaming Category Switcher */}
            <TabsList className="bg-[#12151F] border border-white/10 p-1 h-auto rounded-lg overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.type}
                  value={cat.type}
                  className="rounded-md px-4 py-2 font-bold text-xs uppercase tracking-wider text-[#94A3B8] data-[state=active]:bg-primary data-[state=active]:text-white transition-all cursor-pointer"
                >
                  {cat.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((cat) => (
            <TabsContent
              key={cat.type}
              value={cat.type}
              className="mt-0 focus-visible:outline-none"
            >
              <MoviesGridConstructor type={cat.type} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
};

export default MovieHomepage;
