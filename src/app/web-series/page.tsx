export const dynamic = "force-dynamic";

import { TopPopularAiringTV, TrendingTV } from "@/utils/tv-requests/request";
import { Metadata } from "next";
import WebHomepageCards from "@/components/web-ui/homepage-cards";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Info, TrendingUp, Star, Calendar, ArrowRight, Tv } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const trending = await TrendingTV({ time_window: "day" });
    const featuredShow = trending?.results?.[0];
    const title = "TV Shows & Web Series - Dramaflix";
    const description = "Discover and watch the best TV shows and web series on Dramaflix.";
    const imageUrl = featuredShow?.backdrop_path
      ? `${process.env.NEXT_PUBLIC_PROXY}https://image.tmdb.org/t/p/original${featuredShow.backdrop_path}`
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
    <main className="min-h-screen pb-20 overflow-x-hidden">
      {/* Hero Section */}
      {heroShow && (
        <section className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/original${heroShow.backdrop_path}`}
            alt={heroShow.name || "Hero Show"}
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
                  Streaming Sensation
               </div>
               
               <div className="max-w-3xl space-y-4">
                  <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none drop-shadow-2xl">
                    {heroShow.name || heroShow.original_name}
                  </h1>
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-black">
                      <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                      {heroShow.vote_average?.toFixed(1)}
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-black">
                      <Calendar className="h-3 w-3 mr-1" />
                      {heroShow.first_air_date ? new Date(heroShow.first_air_date).getFullYear() : "N/A"}
                    </Badge>
                  </div>

                  <p className="text-lg md:text-xl text-muted-foreground font-medium line-clamp-3 md:line-clamp-none max-w-2xl leading-relaxed drop-shadow-md">
                    {heroShow.overview}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <Link href={`/web-series/${heroShow.id}`}>
                      <Button size="lg" className="h-14 px-8 rounded-full font-black text-lg gap-3 shadow-xl hover:scale-105 transition-all">
                        <Play className="h-6 w-6 fill-current" />
                        Explore Series
                      </Button>
                    </Link>
                    <Link href={`/web-series/${heroShow.id}`}>
                      <Button size="lg" variant="secondary" className="h-14 px-8 rounded-full font-black text-lg gap-3 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all">
                        <Info className="h-6 w-6" />
                        Series Info
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
        <Tabs defaultValue="trending" className="w-full space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                <span className="w-2 h-10 bg-primary rounded-full hidden md:block" />
                Web Series
              </h2>
              <p className="text-muted-foreground font-bold text-sm tracking-wide flex items-center gap-2">
                Binge-worthy series handpicked for you <ArrowRight className="h-4 w-4" />
              </p>
            </div>
            
            <TabsList className="bg-card/40 backdrop-blur-xl border border-border/50 p-1.5 h-auto rounded-full shadow-2xl overflow-x-auto no-scrollbar flex-shrink-0">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="rounded-full px-6 py-2.5 font-black text-sm transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
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
              className="mt-0 ring-offset-background focus-visible:outline-none"
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
