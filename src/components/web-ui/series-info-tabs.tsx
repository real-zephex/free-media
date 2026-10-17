import { TVInfo, TVCredits, TVImages } from "@/utils/types";
import { Star, Users, Info, Image as ImageIcon, Tv, BarChart3, Calendar, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { tmdbImageUrl } from "@/lib/tmdb-image";

const SeriesInfoTabs = async ({
  data,
  credits,
  artwork,
}: {
  data: TVInfo;
  credits: TVCredits;
  artwork: TVImages;
}) => {
  return (
    <main className="w-full">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full justify-start rounded-none bg-transparent border-b h-12 p-0 mb-6">
          <TabsTrigger 
            value="info" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 h-full font-bold transition-all"
          >
            <Info className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="cast" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 h-full font-bold transition-all"
          >
            <Users className="h-4 w-4 mr-2" />
            Cast
          </TabsTrigger>
          <TabsTrigger 
            value="artworks" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 h-full font-bold transition-all"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Gallery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <section>
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2 tracking-tight">
              <span className="w-1.5 h-8 bg-primary rounded-full" />
              Synopsis
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg italic border-l-4 border-primary/20 pl-6 py-2 bg-muted/10 rounded-r-xl">
              {data.overview}
            </p>
          </section>

          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-muted/20 p-6 rounded-2xl border border-border/50">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-primary/60 tracking-widest flex items-center gap-1.5">
                <BarChart3 className="h-3 w-3" /> Season Stats
              </span>
              <p className="font-semibold text-lg">{data.number_of_seasons} Seasons • {data.number_of_episodes} Episodes</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-primary/60 tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3" /> Production Status
              </span>
              <p className="font-semibold text-lg">{data.status}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-primary/60 tracking-widest flex items-center gap-1.5">
                <Star className="h-3 w-3" /> Popularity
              </span>
              <p className="font-semibold text-lg flex items-center gap-1.5">
                {data.vote_average?.toFixed(1)} / 10
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 border-none" />
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-primary/60 tracking-widest flex items-center gap-1.5">
                <Calendar className="h-3 w-3" /> Aired Period
              </span>
              <p className="font-semibold text-sm">
                {data.first_air_date?.toString()} — {data.last_air_date?.toString() || "Present"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-primary/60 tracking-widest flex items-center gap-1.5">
                <Tv className="h-3 w-3" /> Networks
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.networks?.map((item) => (
                  <Badge key={item.id} variant="outline" className="text-[10px] bg-background">
                    {item.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-primary/60 tracking-widest flex items-center gap-1.5">
                <Info className="h-3 w-3" /> Genres
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.genres?.map((genre) => (
                  <Badge key={genre.id} variant="secondary" className="text-[10px]">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="cast" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {credits.cast && credits.cast.length > 0 ? (
              credits.cast.map((item, index) => (
                <Card key={index} className="overflow-hidden border-none bg-muted/30 hover:bg-muted/50 transition-all hover:-translate-y-1 group border border-border/50">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={tmdbImageUrl(item.profile_path, "w185")}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={item.name || "Cast Member"}
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{item.character}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl">No cast info found</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="artworks" className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <section>
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 tracking-tight">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Backdrops
            </h3>
            <ScrollArea className="w-full whitespace-nowrap rounded-2xl overflow-hidden">
              <div className="flex space-x-4 pb-4">
                {artwork.backdrops && artwork.backdrops.length > 0 ? (
                  artwork.backdrops.map((item, index) => (
                    <div className="relative w-[320px] aspect-video flex-shrink-0 rounded-xl overflow-hidden shadow-xl border border-border/50 group" key={index}>
                      <Image
                        src={tmdbImageUrl(item.file_path, "w780")}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="Backdrop"
                        loading="lazy"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground p-10 bg-muted/20 w-full rounded-xl text-center">No backdrops found</p>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>

          <section>
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 tracking-tight">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Posters
            </h3>
            <ScrollArea className="w-full whitespace-nowrap rounded-2xl overflow-hidden">
              <div className="flex space-x-4 pb-4">
                {artwork.posters && artwork.posters.length > 0 ? (
                  artwork.posters.map((item, index) => (
                    <div className="relative w-[180px] aspect-[2/3] flex-shrink-0 rounded-xl overflow-hidden shadow-xl border border-border/50 group" key={index}>
                      <Image
                        src={tmdbImageUrl(item.file_path, "w500")}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="Poster"
                        loading="lazy"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground p-10 bg-muted/20 w-full rounded-xl text-center">No posters found</p>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default SeriesInfoTabs;
