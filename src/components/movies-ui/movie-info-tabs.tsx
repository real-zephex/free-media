import {
  MovieInfoType,
  MoviesHomepageResults,
  TVCredits,
  TVImages,
} from "@/utils/types";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Download, Info, Users, Image as ImageIcon, Sparkles, TrendingUp, Calendar, Clock, DollarSign, Globe, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
    <div className="w-full space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        {/* Streaming Tabs Navigation */}
        <TabsList className="w-full justify-start rounded-none bg-transparent border-b border-white/[0.08] h-12 p-0 mb-6 gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-white text-[#94A3B8] data-[state=active]:bg-transparent px-1 pb-3 pt-0 font-bold text-sm tracking-wide transition-all cursor-pointer"
          >
            Overview & Intel
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-white text-[#94A3B8] data-[state=active]:bg-transparent px-1 pb-3 pt-0 font-bold text-sm tracking-wide transition-all cursor-pointer"
          >
            More Like This
          </TabsTrigger>
          <TabsTrigger
            value="cast"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-white text-[#94A3B8] data-[state=active]:bg-transparent px-1 pb-3 pt-0 font-bold text-sm tracking-wide transition-all cursor-pointer"
          >
            Cast & Crew
          </TabsTrigger>
          <TabsTrigger
            value="artworks"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-white text-[#94A3B8] data-[state=active]:bg-transparent px-1 pb-3 pt-0 font-bold text-sm tracking-wide transition-all cursor-pointer"
          >
            Gallery
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview & Intel */}
        <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
          {data && (
            <div className="space-y-6">
              {/* Synopsis */}
              <div className="bg-[#12151F] p-6 rounded-xl border border-white/[0.08] space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Info className="h-4 w-4" /> Storyline
                </h3>
                <p className="text-base text-slate-200 font-normal leading-relaxed">
                  {data.overview || "No overview available for this title."}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#12151F] p-5 rounded-xl border border-white/[0.08] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" /> Box Office
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
                      <span>Budget</span>
                      <span className="font-bold text-white">${data.budget?.toLocaleString() || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#94A3B8]">
                      <span>Revenue</span>
                      <span className="font-bold text-emerald-400">${data.revenue?.toLocaleString() || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#12151F] p-5 rounded-xl border border-white/[0.08] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" /> Duration & Link
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
                      <span>Runtime</span>
                      <span className="font-bold text-white">{data.runtime}m</span>
                    </div>
                    <div className="flex justify-between items-center text-[#94A3B8]">
                      <span>Official Site</span>
                      {data.homepage ? (
                        <Link href={data.homepage} target="_blank" className="font-bold text-primary hover:underline truncate max-w-[120px]">
                          Visit Site
                        </Link>
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-[#12151F] p-5 rounded-xl border border-white/[0.08] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Production
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
                      <span>Release Date</span>
                      <span className="font-bold text-white">{data.release_date || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#94A3B8]">
                      <span>TMDB ID</span>
                      <span className="font-bold text-primary">#{data.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offline Download Banner */}
              <div className="bg-[#12151F] p-6 rounded-xl border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-base font-bold text-white">Save For Offline Playback</h4>
                  <p className="text-xs text-[#94A3B8]">
                    Download this title to your device in original HD quality for traveling or offline viewing.
                  </p>
                </div>
                <Link href={`https://vidvault.ru/movie/${data.id}`} target="_blank">
                  <Button className="font-bold text-xs uppercase tracking-wider px-6 h-10 bg-primary hover:bg-primary/90 text-white gap-2 rounded-lg cursor-pointer">
                    <Download className="h-4 w-4" />
                    Download Movie
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Recommendations / More Like This */}
        <TabsContent value="recommendations" className="focus-visible:outline-none">
          {recommendation_data && recommendation_data.results?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendation_data.results.slice(0, 12).map((item) => (
                <Link href={`/movies/${item.id}`} key={item.id} className="group block">
                  <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-[#12151F] border border-white/10 group-hover:border-white/25 transition-all duration-300 group-hover:scale-105">
                    <Image
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                          : "/placeholder.svg"
                      }
                      fill
                      alt={item.title}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                      <span className="text-xs font-bold text-white line-clamp-1">{item.title}</span>
                      <div className="flex items-center gap-1 text-[10px] text-[#F59E0B] font-bold">
                        <Star className="h-2.5 w-2.5 fill-[#F59E0B]" />
                        <span>{item.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs text-white truncate mt-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-[#94A3B8]">
                    {item.release_date?.split("-")[0] || ""}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-[#94A3B8]">
              No recommendations available for this movie.
            </p>
          )}
        </TabsContent>

        {/* Tab 3: Cast & Crew */}
        <TabsContent value="cast" className="focus-visible:outline-none">
          {cast_data.cast && cast_data.cast.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast_data.cast.slice(0, 18).map((actor, idx) => (
                <div key={idx} className="bg-[#12151F] p-3 rounded-lg border border-white/[0.08] space-y-2 text-center">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden border border-white/10 bg-black">
                    <Image
                      src={tmdbImageUrl(actor.profile_path)}
                      fill
                      alt={actor.name || "Actor"}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white line-clamp-1">{actor.name}</h5>
                    <p className="text-[10px] text-[#94A3B8] line-clamp-1">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-[#94A3B8]">
              No cast details on record.
            </p>
          )}
        </TabsContent>

        {/* Tab 4: Artworks */}
        <TabsContent value="artworks" className="space-y-8 focus-visible:outline-none">
          {/* Backdrops */}
          {images_data.backdrops && images_data.backdrops.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Backdrops</h4>
              <ScrollArea className="w-full pb-3">
                <div className="flex gap-4">
                  {images_data.backdrops.slice(0, 10).map((b, i) => (
                    <div key={i} className="relative w-72 sm:w-80 aspect-video shrink-0 rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={tmdbImageUrl(b.file_path)}
                        fill
                        alt="Backdrop"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}

          {/* Posters */}
          {images_data.posters && images_data.posters.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Posters</h4>
              <ScrollArea className="w-full pb-3">
                <div className="flex gap-4">
                  {images_data.posters.slice(0, 12).map((p, i) => (
                    <div key={i} className="relative w-36 sm:w-44 aspect-[2/3] shrink-0 rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={tmdbImageUrl(p.file_path)}
                        fill
                        alt="Poster"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MoreMovieInfo;
