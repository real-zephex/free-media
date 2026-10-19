"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Play, Info } from "lucide-react";
import { tmdbImageUrlAlt } from "@/lib/tmdb-image";
import { usePreviewModal } from "@/components/ui/quick-preview-modal";
import { cn } from "@/lib/utils";

interface SeriesCardProps {
  series: any;
  index?: number;
  className?: string;
}

export const SeriesCard = ({ series, index = 0, className }: SeriesCardProps) => {
  const { openPreview } = usePreviewModal();
  const posterUrl = tmdbImageUrlAlt(series.poster_path, "w500");
  const year = series.first_air_date ? new Date(series.first_air_date).getFullYear() : "";
  const rating = (series.vote_average || 0).toFixed(1);
  const name = series.name || series.original_name || "TV Series";

  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openPreview({
      id: series.id,
      title: name,
      type: "tv",
      overview: series.overview,
      poster_path: series.poster_path,
      backdrop_path: series.backdrop_path,
      vote_average: series.vote_average,
      first_air_date: series.first_air_date,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
      className={cn(
        "group relative flex flex-col rounded-lg overflow-hidden bg-[#12151F] border border-white/[0.07] hover:border-white/25 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-black/70 hover:scale-[1.03] z-10 hover:z-20",
        className
      )}
    >
      <Link href={`/web-series/${series.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {name}</span>
      </Link>

      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted/20">
        <Image
          src={posterUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
        />

        {/* Streaming Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-20 pointer-events-none">
          <div className="flex items-center gap-2 mb-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto">
            <Link
              href={`/web-series/${series.id}`}
              className="bg-white text-black p-2.5 rounded-full shadow-lg hover:bg-white/90 transition-transform active:scale-90"
              aria-label={`Play ${name}`}
            >
              <Play className="h-4 w-4 fill-black ml-0.5" />
            </Link>
            <button
              onClick={handleInfoClick}
              aria-label="Quick Preview"
              className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white border border-white/20 hover:bg-white/30 transition-transform active:scale-90 cursor-pointer"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
            {series.overview}
          </p>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1 z-20 pointer-events-none">
          {series.vote_average > 0 && (
            <span className="bg-black/70 backdrop-blur-md text-[#F59E0B] text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/10 flex items-center gap-1">
              <Star className="h-2.5 w-2.5 fill-[#F59E0B]" />
              {rating}
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-[#00A8E1]/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
            SERIES
          </span>
        </div>
      </div>

      {/* Under-Card Metadata */}
      <div className="p-2.5 space-y-1">
        <h3 className="font-display font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
          {name}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-[#94A3B8] font-medium">
          <span>{year}</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">TV Show</span>
        </div>
      </div>
    </motion.div>
  );
};

export const SeriesCardSkeleton = () => (
  <div className="flex flex-col rounded-lg overflow-hidden bg-[#12151F] border border-white/[0.07] animate-pulse">
    <div className="relative aspect-[2/3] w-full bg-white/5" />
    <div className="p-2.5 space-y-2">
      <div className="h-3.5 bg-white/10 rounded w-3/4" />
      <div className="h-2.5 bg-white/5 rounded w-1/3" />
    </div>
  </div>
);
