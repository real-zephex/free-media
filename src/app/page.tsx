export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/ui/hero-section";
import { BentoFeatures } from "@/components/ui/bento-features";
import { InfiniteMarquee } from "@/components/ui/infinite-marquee";
import { TrendingTV } from "@/utils/tv-requests/request";
import { MoviesDiscover } from "@/utils/movie-requests/request";
import { Separator } from "@/components/ui/separator";

export default async function Home() {
  // Fetch trending data for the marquees
  let trendingMoviesImages: string[] = [];
  let trendingSeriesImages: string[] = [];
  
  try {
    const movies = await MoviesDiscover("trending", "week");
    const series = await TrendingTV({ time_window: "week" });
    
    if (movies?.results) {
       trendingMoviesImages = movies.results
        .filter(m => m.poster_path)
        .slice(0, 10)
        .map(m => `https://image.tmdb.org/t/p/w500${m.poster_path}`);
    }
    
    if (series?.results) {
       trendingSeriesImages = series.results
        .filter(s => s.poster_path)
        .slice(0, 10)
        .map(s => `https://image.tmdb.org/t/p/w500${s.poster_path}`);
    }
  } catch (error) {
    console.error("Failed to fetch marquee data", error);
    // Fallbacks will just render empty marquees safely
  }

  const allPosters = [...trendingMoviesImages, ...trendingSeriesImages].sort(() => 0.5 - Math.random());

  return (
    <main className="relative flex flex-col min-h-screen bg-background overflow-x-hidden">
      
      {/* 1. High-End Hero Section */}
      <HeroSection />

      {/* 2. Infinite Marquee Background Section */}
      <section className="relative py-10 rotate-[-2deg] scale-105 opacity-40 hover:opacity-100 transition-opacity duration-700 bg-background z-10">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-10 hover:backdrop-blur-0 transition-all duration-700" />
        <div className="space-y-4">
          <InfiniteMarquee items={allPosters.slice(0, 10)} direction="left" speed="normal" />
          <InfiniteMarquee items={allPosters.slice(10, 20)} direction="right" speed="normal" />
        </div>
      </section>

      {/* 3. Bento Grid Features */}
      <BentoFeatures />

      {/* Footer */}
      <Separator className="mt-20 border-border/50" />
      <footer className="py-8 relative z-30 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-primary font-display font-bold text-xl tracking-tight">Dramaflix</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground text-center md:text-left">
            Copyright © {new Date().getFullYear()} - Designed & Engineered for a premium experience.
          </p>
        </div>
      </footer>
    </main>
  );
}
