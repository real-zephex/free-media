"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Play, Info, Star, Calendar, Film, Tv } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { tmdbImageUrlAlt } from "@/lib/tmdb-image";

export interface PreviewItem {
  id: string | number;
  title: string;
  type: "movie" | "tv";
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
}

interface PreviewContextType {
  openPreview: (item: PreviewItem) => void;
  closePreview: () => void;
  activeItem: PreviewItem | null;
}

const PreviewContext = createContext<PreviewContextType>({
  openPreview: () => {},
  closePreview: () => {},
  activeItem: null,
});

export const usePreviewModal = () => useContext(PreviewContext);

export const PreviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeItem, setActiveItem] = useState<PreviewItem | null>(null);

  const openPreview = useCallback((item: PreviewItem) => {
    setActiveItem(item);
  }, []);

  const closePreview = useCallback(() => {
    setActiveItem(null);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
    };
    if (activeItem) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [activeItem, closePreview]);

  const backdropSrc = activeItem?.backdrop_path
    ? tmdbImageUrlAlt(activeItem.backdrop_path, "original")
    : activeItem?.poster_path
    ? tmdbImageUrlAlt(activeItem.poster_path, "original")
    : null;

  const playHref = activeItem
    ? activeItem.type === "movie"
      ? `/movies/${activeItem.id}`
      : `/web-series/${activeItem.id}`
    : "#";

  const releaseYear = activeItem?.release_date
    ? activeItem.release_date.split("-")[0]
    : activeItem?.first_air_date
    ? activeItem.first_air_date.split("-")[0]
    : "";

  return (
    <PreviewContext.Provider value={{ openPreview, closePreview, activeItem }}>
      {children}

      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop Dim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePreview}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-[#12151F] border border-white/15 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={closePreview}
                aria-label="Close Preview"
                className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/70 hover:bg-black/95 text-white/80 hover:text-white transition-colors border border-white/10 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Banner Image with Vignette */}
              <div className="relative aspect-video w-full bg-black shrink-0 overflow-hidden">
                {backdropSrc ? (
                  <Image
                    src={backdropSrc}
                    alt={activeItem.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <Film className="h-16 w-16 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#12151F] via-[#12151F]/40 to-transparent" />

                {/* Floating Title & CTAs inside bottom of hero */}
                <div className="absolute bottom-4 left-4 right-4 space-y-3 z-20">
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight drop-shadow-md">
                    {activeItem.title}
                  </h2>

                  <div className="flex items-center gap-3">
                    <Link
                      href={playHref}
                      onClick={closePreview}
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-5 py-2.5 rounded-md text-sm transition-transform active:scale-95 shadow-lg shadow-primary/30"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      <span>Watch Now</span>
                    </Link>

                    <Link
                      href={playHref}
                      onClick={closePreview}
                      className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2.5 rounded-md text-sm backdrop-blur-md border border-white/15 transition-colors"
                    >
                      <Info className="h-4 w-4" />
                      <span>Details</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {typeof activeItem.vote_average === "number" && activeItem.vote_average > 0 && (
                    <span className="flex items-center gap-1 bg-[#F59E0B]/15 text-[#F59E0B] font-bold px-2 py-0.5 rounded border border-[#F59E0B]/30">
                      <Star className="h-3 w-3 fill-[#F59E0B]" />
                      {activeItem.vote_average.toFixed(1)}
                    </span>
                  )}

                  {releaseYear && (
                    <span className="flex items-center gap-1 text-[#94A3B8] font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      <Calendar className="h-3 w-3" />
                      {releaseYear}
                    </span>
                  )}

                  <span className="font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">
                    HD
                  </span>

                  <span className="font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 flex items-center gap-1">
                    {activeItem.type === "movie" ? (
                      <>
                        <Film className="h-3 w-3" /> Movie
                      </>
                    ) : (
                      <>
                        <Tv className="h-3 w-3" /> TV Series
                      </>
                    )}
                  </span>
                </div>

                {/* Synopsis */}
                <div className="space-y-1">
                  <p className="text-sm leading-relaxed text-slate-300 font-medium">
                    {activeItem.overview || "No synopsis available for this title."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PreviewContext.Provider>
  );
};
