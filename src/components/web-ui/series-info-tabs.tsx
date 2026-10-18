import { TVInfo, TVCredits, TVImages } from "@/utils/types";
import { Star, Users, Info, Image as ImageIcon, Tv, BarChart3, Calendar, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
    <div className="w-full space-y-6">
      <Tabs defaultValue="info" className="w-full">
        {/* Streaming Tabs Navigation */}
        <TabsList className="w-full justify-start rounded-none bg-transparent border-b border-white/[0.08] h-12 p-0 mb-6 gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
          <TabsTrigger
            value="info"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-white text-[#94A3B8] data-[state=active]:bg-transparent px-1 pb-3 pt-0 font-bold text-sm tracking-wide transition-all cursor-pointer"
          >
            Overview & Stats
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

        {/* Tab 1: Overview */}
        <TabsContent value="info" className="space-y-6 focus-visible:outline-none">
          {/* Synopsis */}
          <div className="bg-[#12151F] p-6 rounded-xl border border-white/[0.08] space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Info className="h-4 w-4" /> Series Synopsis
            </h3>
            <p className="text-base text-slate-200 font-normal leading-relaxed">
              {data.overview || "No overview available for this series."}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#12151F] p-5 rounded-xl border border-white/[0.08] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-primary" /> Season Stats
              </span>
              <p className="font-bold text-base text-white">
                {data.number_of_seasons} Seasons • {data.number_of_episodes} Episodes
              </p>
            </div>

            <div className="bg-[#12151F] p-5 rounded-xl border border-white/[0.08] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Production Status
              </span>
              <p className="font-bold text-base text-white">{data.status || "Ongoing"}</p>
            </div>

            <div className="bg-[#12151F] p-5 rounded-xl border border-white/[0.08] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-[#F59E0B]" /> Rating
              </span>
              <div className="flex items-center gap-1.5 text-white font-bold text-base">
                <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                <span>{data.vote_average?.toFixed(1) || "N/A"}</span>
                <span className="text-xs text-[#94A3B8] font-normal">/ 10</span>
              </div>
            </div>

            <div className="bg-[#12151F] p-5 rounded-xl border border-white/[0.08] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Broadcast Timeline
              </span>
              <p className="font-bold text-xs sm:text-sm text-white">
                {data.first_air_date?.toString() || "Unknown"} — {data.last_air_date?.toString() || "Present"}
              </p>
            </div>

            <div className="bg-[#12151F] p-5 rounded-xl border border-white/[0.08] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <Tv className="h-3.5 w-3.5 text-primary" /> Networks
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.networks?.map((item) => (
                  <span
                    key={item.id}
                    className="text-[10px] font-semibold text-slate-300 bg-white/10 px-2 py-0.5 rounded border border-white/10"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#12151F] p-5 rounded-xl border border-white/[0.08] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-primary" /> Genres
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.genres?.map((g) => (
                  <span
                    key={g.id}
                    className="text-[10px] font-semibold text-slate-300 bg-white/10 px-2 py-0.5 rounded border border-white/10"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Cast */}
        <TabsContent value="cast" className="focus-visible:outline-none">
          {credits.cast && credits.cast.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {credits.cast.slice(0, 18).map((actor, idx) => (
                <div key={idx} className="bg-[#12151F] p-3 rounded-lg border border-white/[0.08] space-y-2 text-center">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden border border-white/10 bg-black">
                    <Image
                      src={tmdbImageUrl(actor.profile_path, "w185")}
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

        {/* Tab 3: Artworks */}
        <TabsContent value="artworks" className="space-y-8 focus-visible:outline-none">
          {artwork.backdrops && artwork.backdrops.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Backdrops</h4>
              <ScrollArea className="w-full pb-3">
                <div className="flex gap-4">
                  {artwork.backdrops.slice(0, 10).map((b, i) => (
                    <div key={i} className="relative w-72 sm:w-80 aspect-video shrink-0 rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={tmdbImageUrl(b.file_path, "w780")}
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

          {artwork.posters && artwork.posters.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Posters</h4>
              <ScrollArea className="w-full pb-3">
                <div className="flex gap-4">
                  {artwork.posters.slice(0, 12).map((p, i) => (
                    <div key={i} className="relative w-36 sm:w-44 aspect-[2/3] shrink-0 rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={tmdbImageUrl(p.file_path, "w500")}
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

export default SeriesInfoTabs;
