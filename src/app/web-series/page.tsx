export const dynamic = "force-dynamic";

import { TopPopularAiringTV, TrendingTV } from "@/utils/tv-requests/request";
import { Metadata } from "next";
import WebHomepageCards from "@/components/web-ui/homepage-cards";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Info, Star, Tv } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { tmdbImageUrl } from "@/lib/tmdb-image";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const trending = await TrendingTV({ time_window: "day" });
    const featuredShow = trending?.results?.[0];
    const title = "TV Shows & Web Series - Dramaflix";
    const description = "Discover and watch the best TV shows and web series on Dramaflix.";
    const imageUrl = featuredShow?.backdrop_path
      ? tmdbImageUrl(featuredShow.backdrop_path)
      : "/placeholder.svg";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: imageUrl }],
      },
    };
  } catch (error) {
    return { title: "TV Shows - Dramaflix" };
  }
}

const WebSeriesHomepage = async () => {
  const popular = await TopPopularAiringTV({ type: "popular" });
  const top = await TopPopularAiringTV({ type: "top_rated" });
  const airing = await TopPopularAiringTV({ type: "airing_today" });
  const trending = await TrendingTV({ time_window: "day" });

  const heroShow = trending?.results?.[0];

  const categories = [
    { title: "Trending", value: "trending", data: trending },
    { title: "Popular", value: "popular", data: popular },
    { title: "Top Rated", value: "top_rated", data: top },
    { title: "Airing Now", value: "airing", data: airing },
  ];

  return (
    <main className="min-h-screen pb-24 overflow-x-hidden bg-background text-foreground">
      {/* 1. Cinematic Billboard Spotlight */}
      {heroShow && (
        <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden flex items-end">
          <Image
            src={`https://image.tmdb.org/t/p/original${heroShow.backdrop_path}`}
            alt={heroShow.name || "Hero Show"}
            fill
            className="object-cover object-center brightness-75 transition-transform duration-1000"
            priority
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-[#090A10]/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090A10] via-[#090A10]/70 to-transparent z-10 w-full md:w-3/4" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#090A10]/80 to-transparent z-10" />

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pb-16 md:pb-24 relative z-20 w-full">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#00A8E1]/20 backdrop-blur-md border border-[#00A8E1]/40 px-3 py-1 rounded-md text-white text-xs font-black uppercase tracking-wider">
                <Tv className="h-3.5 w-3.5 text-[#00A8E1]" />
                #1 SERIES TODAY
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white leading-none drop-shadow-2xl">
                {heroShow.name || heroShow.original_name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-[#94A3B8]">
                <span className="flex items-center gap-1 text-[#F59E0B] font-bold bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20">
                  <Star className="h-3.5 w-3.5 fill-[#F59E0B]" />
                  {heroShow.vote_average?.toFixed(1)}
                </span>
                <span>
                  {heroShow.first_air_date
                    ? new Date(heroShow.first_air_date).getFullYear()
                    : ""}
                </span>
                <Badge variant="outline" className="text-[10px] font-bold border-white/20 text-white px-1.5 py-0">
                  SERIES
                </Badge>
                <Badge variant="outline" className="text-[10px] font-bold border-white/20 text-white px-1.5 py-0">
                  HD
                </Badge>
              </div>

              <p className="text-sm sm:text-base text-slate-300 font-normal line-clamp-3 leading-relaxed max-w-xl">
                {heroShow.overview}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href={`/web-series/${heroShow.id}`}>
                  <Button
                    size="lg"
                    className="h-12 px-7 rounded-lg bg-white text-black hover:bg-white/90 font-black text-sm gap-2.5 shadow-lg hover:scale-105 transition-all"
                  >
                    <Play className="h-4 w-4 fill-black" />
                    Explore Series
                  </Button>
                </Link>
                <Link href={`/web-series/${heroShow.id}`}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 px-6 rounded-lg bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 font-bold text-sm gap-2 hover:scale-105 transition-all"
                  >
                    <Info className="h-4 w-4" />
                    Series Info
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Categories & Catalog Rails */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 -mt-8 sm:-mt-12 relative z-30 space-y-8">
        <Tabs defaultValue="trending" className="w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#00A8E1] rounded-full" />
              <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white">
                Explore Web Series
              </h2>
            </div>

            {/* Streaming Category Switcher */}
            <TabsList className="bg-[#12151F] border border-white/10 p-1 h-auto rounded-lg overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="rounded-md px-4 py-2 font-bold text-xs uppercase tracking-wider text-[#94A3B8] data-[state=active]:bg-[#00A8E1] data-[state=active]:text-white transition-all cursor-pointer"
                >
                  {cat.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((cat) => (
            <TabsContent
              key={cat.value}
              value={cat.value}
              className="mt-0 focus-visible:outline-none"
            >
              <WebHomepageCards data={cat.data} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
};

export default WebSeriesHomepage;
