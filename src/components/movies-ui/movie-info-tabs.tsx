import {
  MovieInfoType,
  MoviesHomepageResults,
  TVCredits,
  TVImages,
} from "@/utils/types";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { ThumbsUp, Download, Info, Users, Image as ImageIcon, Sparkles, TrendingUp, Calendar, Clock, DollarSign, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { tmdbImageUrl } from "@/lib/tmdb-image";

const MoreMovieInfo = async ({
  data,
  recommendation_data,
  cast_data,
  images_data,
}: {
  data: MovieInfoType | null;
  recommendation_data?: MoviesHomepageResults | null;
  cast_data: TVCredits;
  images_data: TVImages;
}) => {
  return (
    <div className="w-full">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full justify-start rounded-none bg-transparent border-b h-14 p-0 mb-8 overflow-x-auto overflow-y-hidden">
          <TabsTrigger 
            value="info" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 h-full font-black uppercase text-xs tracking-widest transition-all"
          >
            <Info className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 h-full font-black uppercase text-xs tracking-widest transition-all"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Similar
          </TabsTrigger>
          <TabsTrigger 
            value="cast" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 h-full font-black uppercase text-xs tracking-widest transition-all"
          >
            <Users className="h-4 w-4 mr-2" />
            Cast
          </TabsTrigger>
          <TabsTrigger 
            value="artworks" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 h-full font-black uppercase text-xs tracking-widest transition-all"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Gallery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {data && (
            <div className="space-y-8">
               <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 group transition-colors hover:bg-muted/50">
                     <span className="text-[10px] font-black uppercase text-primary/50 tracking-widest flex items-center gap-2 mb-2">
                        <TrendingUp className="h-3 w-3" /> Financials
                     </span>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm border-b border-border/30 pb-2">
                           <span className="text-muted-foreground flex items-center gap-1.5"><DollarSign className="h-3 w-3" /> Budget</span>
                           <span className="font-bold">${data.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-muted-foreground flex items-center gap-1.5"><TrendingUp className="h-3 w-3" /> Revenue</span>
                           <span className="font-bold text-green-500">${data.revenue.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 group transition-colors hover:bg-muted/50">
                     <span className="text-[10px] font-black uppercase text-primary/50 tracking-widest flex items-center gap-2 mb-2">
                        <Clock className="h-3 w-3" /> Duration & Web
                     </span>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm border-b border-border/30 pb-2">
                           <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3" /> Runtime</span>
                           <span className="font-bold">{data.runtime}m</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-muted-foreground flex items-center gap-1.5"><Globe className="h-3 w-3" /> Website</span>
                           <Link href={data.homepage} target="_blank" className="font-bold text-primary hover:underline truncate max-w-[120px]">Visit</Link>
                        </div>
                     </div>
                  </div>

                  <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 group transition-colors hover:bg-muted/50">
                     <span className="text-[10px] font-black uppercase text-primary/50 tracking-widest flex items-center gap-2 mb-2">
                        <Calendar className="h-3 w-3" /> Chronology
                     </span>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm border-b border-border/30 pb-2">
                           <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Release</span>
                           <span className="font-bold">{data.release_date}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-muted-foreground flex items-center gap-1.5"><Info className="h-3 w-3" /> ID</span>
                           <span className="font-bold text-primary">TMDB-{data.id}</span>
                        </div>
                     </div>
                  </div>
               </section>

               <section className="bg-primary/5 p-8 rounded-3xl border-2 border-dashed border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center md:text-left">
                  <h4 className="text-xl font-black uppercase tracking-tighter">Offline Download</h4>
                  <p className="text-sm text-muted-foreground italic">Download this movie for offline viewing in high quality.</p>
                  </div>
                  <Link
                    href={`https://vidvault.ru/movie/${data.id}`}
                    target="_blank"
                  >
                    <Button size="lg" className="font-black uppercase tracking-widest shadow-xl group">
                      Download <Download className="ml-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                    </Button>
                  </Link>
               </section>

               <section className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 flex items-center gap-2">
                    Classification Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.genres.map((item) => (
                      <Badge key={item.id} variant="secondary" className="px-4 py-1 bg-primary/10 text-primary border-primary/20 font-black text-[10px] tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all">
                        {item.name}
                      </Badge>
                    ))}
                  </div>
               </section>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ScrollArea className="h-[500px] w-full pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
              {recommendation_data &&
                recommendation_data.results.slice(0, 12).map((item) => (
                  <Link href={`/movies/${item.id}`} key={item.id} className="block group">
                    <Card className="overflow-hidden border-border/50 bg-muted/30 group-hover:bg-muted/50 transition-all duration-300 group-hover:-translate-y-1">
                      <div className="flex items-center gap-4 p-3">
                        <div className="relative w-16 aspect-[2/3] shrink-0 rounded-md overflow-hidden shadow-md">
                          <Image
                            src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                            fill
                            alt="Movie Poster"
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">
                            {item.release_date.split('-')[0]}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] font-black text-yellow-500 mt-2">
                            <TrendingUp className="h-2.5 w-2.5" />
                            <span>{item.vote_average.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="cast" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {cast_data.cast && cast_data.cast.length > 0 ? (
              cast_data.cast.slice(0, 15).map((item, index) => (
                <div key={index} className="group relative">
                   <div className="aspect-[4/5] relative rounded-2xl overflow-hidden border border-border/50 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      <Image
                        src={tmdbImageUrl(item.profile_path)}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                        alt={item.name || "Cast member"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 pb-4 flex flex-col justify-end">
                         <h4 className="font-black text-xs uppercase text-white tracking-widest">{item.name}</h4>
                         <p className="text-[10px] text-muted-foreground italic truncate">{item.character}</p>
                      </div>
                   </div>
                   <div className="mt-3 px-1 md:hidden">
                      <h4 className="font-bold text-xs truncate">{item.name}</h4>
                      <p className="text-[10px] text-muted-foreground truncate">{item.character}</p>
                   </div>
                </div>
              ))
            ) : (
              <p className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-2xl">
                No cast information available.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="artworks" className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-12">
          <section>
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 italic tracking-tight uppercase">
              <span className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"></span>
              Backdrops
            </h3>
            <ScrollArea className="w-full whitespace-nowrap rounded-[2rem] overflow-hidden">
              <div className="flex w-max space-x-6 p-2">
                {images_data.backdrops && images_data.backdrops.length > 0 ? (
                  images_data.backdrops.map((item, index) => (
                    <div className="relative w-[380px] aspect-video flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-border/40 group cursor-pointer" key={index}>
                      <Image
                        src={tmdbImageUrl(item.file_path)}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        alt="Backdrop"
                        unoptimized
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Badge variant="outline" className="text-white border-white/40 bg-black/40 backdrop-blur-md">TMDB ID-{index + 100}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-10 text-muted-foreground italic">None on record</p>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>

          <section>
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 italic tracking-tight uppercase">
              <span className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"></span>
              Posters
            </h3>
            <ScrollArea className="w-full whitespace-nowrap rounded-4xl overflow-hidden">
              <div className="flex w-max space-x-6 p-2">
                {images_data.posters && images_data.posters.length > 0 ? (
                  images_data.posters.map((item, index) => (
                    <div className="relative w-50 aspect-2/3 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-border/40 group cursor-pointer" key={index}>
                      <Image
                        src={tmdbImageUrl(item.file_path)}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        alt="Poster"
                        unoptimized
                        loading="lazy"
                      />
                    </div>
                   ))
                ) : (
                  <p className="p-10 text-muted-foreground italic">None on record</p>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MoreMovieInfo;
