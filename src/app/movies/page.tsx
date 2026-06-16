export const dynamic = "force-dynamic";

import React from "react";
import MoviesGridConstructor from "@/components/movies-ui/movies-formatter";
import { Metadata } from "next";
import { MoviesDiscover } from "@/utils/movie-requests/request";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Info, TrendingUp, Star, Calendar, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Movies | Dramaflix",
  description:
    "Watch the latest and greatest movies on Dramaflix. From trending blockbusters to timeless classics.",
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
    <main className="min-h-screen pb-20 overflow-x-hidden">
      {/* Hero Section */}
      {heroMovie && (
        <section className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
            alt={heroMovie.title}
            fill
            className="object-cover scale-105 blur-[2px] opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent hidden md:block" />

          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8 space-y-6">
               <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-2 rounded-full text-primary text-xs font-black uppercase tracking-widest animate-bounce">
                  <TrendingUp className="h-4 w-4" />
                  Weekly Top Pick
               </div>
               
               <div className="max-w-3xl space-y-4">
                  <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none drop-shadow-2xl">
                    {heroMovie.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-black">
                      <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                      {heroMovie.vote_average.toFixed(1)}
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-black">
                      <Calendar className="h-3 w-3 mr-1" />
                      {heroMovie.release_date?.split("-")[0]}
                    </Badge>
                  </div>

                  <p className="text-lg md:text-xl text-muted-foreground font-medium line-clamp-3 md:line-clamp-none max-w-2xl leading-relaxed drop-shadow-md">
                    {heroMovie.overview}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <Link href={`/movies/${heroMovie.id}`}>
                      <Button size="lg" className="h-14 px-8 rounded-full font-black text-lg gap-3 shadow-xl hover:scale-105 transition-all">
                        <Play className="h-6 w-6 fill-current" />
                        Watch Now
                      </Button>
                    </Link>
                    <Link href={`/movies/${heroMovie.id}`}>
                      <Button size="lg" variant="secondary" className="h-14 px-8 rounded-full font-black text-lg gap-3 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all">
                        <Info className="h-6 w-6" />
                        More Info
                      </Button>
                    </Link>
                  </div>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Tabs Section */}
      <div className="container mx-auto px-4 md:px-8 -mt-10 md:-mt-20 relative z-30">
        <Tabs defaultValue="popular" className="w-full space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                <span className="w-2 h-10 bg-primary rounded-full hidden md:block" />
                Exploration
              </h2>
              <p className="text-muted-foreground font-bold text-sm tracking-wide flex items-center gap-2">
                Discover the perfect movie for your mood <ArrowRight className="h-4 w-4" />
              </p>
            </div>
            
            <TabsList className="bg-card/40 backdrop-blur-xl border border-border/50 p-1.5 h-auto rounded-full shadow-2xl overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.type}
                  value={cat.type}
                  className="rounded-full px-6 py-2.5 font-black text-sm transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
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
              className="mt-0 ring-offset-background focus-visible:outline-none"
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
