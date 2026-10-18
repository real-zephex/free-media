export const dynamic = "force-dynamic";

import Link from "next/link";
import { HeroSection } from "@/components/ui/hero-section";
import { BentoFeatures } from "@/components/ui/bento-features";
import { InfiniteMarquee } from "@/components/ui/infinite-marquee";
import { TrendingTV } from "@/utils/tv-requests/request";
import { MoviesDiscover } from "@/utils/movie-requests/request";
import { MovieCard } from "@/components/movies-ui/movie-card";
import { SeriesCard } from "@/components/web-ui/series-card";
import { ChevronRight, Film, Tv, Flame } from "lucide-react";

export default async function Home() {
  let trendingMovies: any[] = [];
  let trendingSeries: any[] = [];
  let trendingMoviesImages: string[] = [];
  let trendingSeriesImages: string[] = [];

  try {
    const movies = await MoviesDiscover("trending", "week");
    const series = await TrendingTV({ time_window: "week" });

    if (movies?.results) {
      trendingMovies = movies.results;
      trendingMoviesImages = movies.results
        .filter((m) => m.poster_path)
        .slice(0, 10)
        .map((m) => `https://image.tmdb.org/t/p/w500${m.poster_path}`);
    }

    if (series?.results) {
      trendingSeries = series.results;
      trendingSeriesImages = series.results
        .filter((s) => s.poster_path)
        .slice(0, 10)
        .map((s) => `https://image.tmdb.org/t/p/w500${s.poster_path}`);
    }
  } catch (error) {
    console.error("Failed to fetch home page data", error);
  }

  // Interleave posters for the marquee
  const allPosters: string[] = [];
  for (let i = 0; i < 10; i++) {
    if (trendingMoviesImages[i]) allPosters.push(trendingMoviesImages[i]);
    if (trendingSeriesImages[i]) allPosters.push(trendingSeriesImages[i]);
  }

  const featuredItem = trendingMovies[0] || trendingSeries[0];

  return (
    <main className="relative flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* 1. Cinematic Spotlight Billboard Hero */}
      <HeroSection featured={featuredItem} />

      {/* 2. Streaming Rails Container */}
      <div className="relative z-20 space-y-12 md:space-y-16 -mt-10 sm:-mt-16 md:-mt-24 px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto w-full">
        {/* Shelf 1: Trending Movies */}
        {trendingMovies.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Link
                href="/movies"
                className="group inline-flex items-center gap-2 text-xl md:text-2xl font-display font-black tracking-tight text-white hover:text-primary transition-colors"
              >
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                <span>Trending Movies</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
              <Link
                href="/movies"
                className="text-xs md:text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors"
              >
                Explore All
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {trendingMovies.slice(0, 6).map((movie, idx) => (
                <MovieCard key={movie.id} movie={movie} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* Shelf 2: Binge-Worthy TV Shows */}
        {trendingSeries.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Link
                href="/web-series"
                className="group inline-flex items-center gap-2 text-xl md:text-2xl font-display font-black tracking-tight text-white hover:text-primary transition-colors"
              >
                <span className="w-1.5 h-6 bg-[#00A8E1] rounded-full" />
                <span>Popular TV Series</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
              <Link
                href="/web-series"
                className="text-xs md:text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors"
              >
                Explore All
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {trendingSeries.slice(0, 6).map((show, idx) => (
                <SeriesCard key={show.id} series={show} index={idx} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 3. Ambient Infinite Marquee Divider */}
      {allPosters.length > 0 && (
        <section className="relative py-16 my-10 overflow-hidden bg-background">
          <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="space-y-4 opacity-50 hover:opacity-90 transition-opacity duration-500">
            <InfiniteMarquee items={allPosters.slice(0, 10)} direction="left" speed="normal" />
            <InfiniteMarquee items={allPosters.slice(10, 20)} direction="right" speed="normal" />
          </div>
        </section>
      )}

      {/* 4. Curated Destinations Showcase */}
      <BentoFeatures />

      {/* 5. Minimalist Streaming Footer */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#090A10] py-12 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-6 text-center md:text-left">
            <span className="font-display font-black text-xl text-white tracking-wider">
              DRAMAFLIX
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <p className="text-xs text-[#94A3B8] font-medium">
              A high-end cinematic movie and TV streaming client.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#94A3B8] font-semibold">
            <Link href="/movies" className="hover:text-white transition-colors">
              Movies
            </Link>
            <Link href="/web-series" className="hover:text-white transition-colors">
              TV Shows
            </Link>
            <Link href="/watch-history" className="hover:text-white transition-colors">
              Watch History
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
