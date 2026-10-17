"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Calendar, Play, Info, Tv } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { tmdbImageUrlAlt } from "@/lib/tmdb-image";

interface SeriesCardProps {
  series: any;
  index?: number;
}

export const SeriesCard = ({ series, index = 0 }: SeriesCardProps) => {
  const posterUrl = tmdbImageUrlAlt(series.poster_path, "w500");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/40 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/10"
    >
      <Link href={`/web-series/${series.id}`} className="absolute inset-0 z-20">
        <span className="sr-only">View {series.name}</span>
      </Link>

      {/* Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image
          src={posterUrl}
          alt={series.name || "Web Series"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 z-10">
           <div className="flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                <Play className="h-5 w-5 fill-current" />
              </div>
              <div className="bg-background/80 backdrop-blur-md p-3 rounded-full shadow-lg">
                <Info className="h-5 w-5" />
              </div>
           </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-yellow-500 border-none flex items-center gap-1 font-black px-2 py-1">
            <Star className="h-3 w-3 fill-yellow-500" />
            {(series.vote_average || 0).toFixed(1)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="font-black text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors duration-300 tracking-tight">
            {series.name || series.original_name}
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <Tv className="h-3 w-3" />
            {series.first_air_date ? new Date(series.first_air_date).getFullYear() : "N/A"}
          </div>
        </div>
        
        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed opacity-80 mt-1">
          {series.overview}
        </p>
      </div>
    </motion.div>
  );
};

export const SeriesCardSkeleton = () => (
  <div className="flex flex-col rounded-2xl overflow-hidden bg-card/30 animate-pulse border border-border/50 aspect-[2/3.5]">
    <div className="relative aspect-[2/3] w-full bg-muted" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/4" />
      <div className="space-y-2 pt-2">
        <div className="h-2.5 bg-muted rounded w-full" />
        <div className="h-2.5 bg-muted rounded w-5/6" />
      </div>
    </div>
  </div>
);
