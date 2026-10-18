"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Trash2,
  Play,
  Clock,
  Monitor,
  Tv,
  Search,
  ArrowUpDown,
  CheckCheck,
  BookmarkPlus,
  Eye,
  Film,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllHistory,
  removeFromHistory,
  saveAllHistory,
  getSeriesProgress,
  getPlaybackProgress,
  WatchHistoryItem,
  migrateItem,
} from "@/utils/localStorage";
import { MovieInfo } from "@/utils/movie-requests/request";
import { InfoImagesCreditsTV } from "@/utils/tv-requests/request";
import { MovieInfoType, TVInfo } from "@/utils/types";
import { clientFetch } from "@/utils/client-cache";

const TABS = ["All", "Watching", "Plan to Watch", "Completed"] as const;

const statusIcons: Record<string, React.ReactNode> = {
  Watching: <Eye className="h-3.5 w-3.5 text-emerald-400" />,
  Completed: <CheckCheck className="h-3.5 w-3.5 text-blue-400" />,
  "Plan to Watch": <BookmarkPlus className="h-3.5 w-3.5 text-amber-400" />,
};

const statusColors: Record<string, string> = {
  Watching: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  Completed: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  "Plan to Watch": "text-amber-400 border-amber-500/30 bg-amber-500/10",
};

export default function WatchHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [hoverData, setHoverData] = useState<MovieInfoType | TVInfo | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [showHoverMenu, setShowHoverMenu] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);
  const countsFetchedRef = React.useRef<Set<number>>(new Set());

  useEffect(() => {
    const raw = getAllHistory();
    const migrated = raw.map(migrateItem);
    if (JSON.stringify(raw) !== JSON.stringify(migrated)) {
      saveAllHistory(migrated);
    }
    setHistory(migrated);
  }, []);

  useEffect(() => {
    setDisplayCount(20);
  }, [activeTab, searchQuery, sortBy]);

  useEffect(() => {
    const missing = history.filter(
      (i) =>
        i.type === "TV" &&
        !i.seasonEpisodeCounts &&
        !countsFetchedRef.current.has(i.id),
    );
    if (missing.length === 0) return;

    let cancelled = false;

    (async () => {
      const updates = new Map<number, Record<string, number>>();
      await Promise.all(
        missing.map(async (item) => {
          countsFetchedRef.current.add(item.id);
          try {
            const info = (await clientFetch(`hover:tv:${item.id}`, () =>
              InfoImagesCreditsTV({ type: "info", id: item.id }),
            )) as TVInfo | undefined;
            if (info?.seasons) {
              const counts: Record<string, number> = {};
              info.seasons.forEach((s) => {
                if (s.season_number != null) {
                  counts[String(s.season_number)] = s.episode_count ?? 0;
                }
              });
              updates.set(item.id, counts);
            }
          } catch {
            // ignore
          }
        }),
      );
      if (cancelled || updates.size === 0) return;

      setHistory((prev) =>
        prev.map((i) =>
          updates.has(i.id)
            ? { ...i, seasonEpisodeCounts: updates.get(i.id) }
            : i,
        ),
      );
      saveAllHistory(
        getAllHistory().map((i) =>
          updates.has(i.id)
            ? { ...i, seasonEpisodeCounts: updates.get(i.id) }
            : i,
        ),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [history]);

  const stats = useMemo(
    () => ({
      watching: history.filter((i) => i.watch_status === "Watching").length,
      planToWatch: history.filter((i) => i.watch_status === "Plan to Watch")
        .length,
      completed: history.filter((i) => i.watch_status === "Completed").length,
      total: history.length,
    }),
    [history],
  );

  const filtered = useMemo(() => {
    let items = [...history];
    if (activeTab !== "All") {
      items = items.filter((i) => i.watch_status === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((i) => i.title.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "title":
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "progress": {
        const getProgress = (item: WatchHistoryItem) =>
          item.type === "TV"
            ? getSeriesProgress(item.id).percent
            : getPlaybackProgress(item.id)?.playbackPercentage ?? 0;
        items.sort((a, b) => getProgress(b) - getProgress(a));
        break;
      }
      case "status":
        items.sort(
          (a, b) => a.watch_status.localeCompare(b.watch_status),
        );
        break;
      default:
        items.sort(
          (a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0),
        );
    }
    return items;
  }, [history, activeTab, searchQuery, sortBy]);

  const displayed = useMemo(
    () => filtered.slice(0, displayCount),
    [filtered, displayCount],
  );

  const handleDelete = (id: number) => {
    removeFromHistory(id);
    setHistory(getAllHistory().map(migrateItem));
  };

  const handleStatusChange = (item: WatchHistoryItem, status: "Watching" | "Completed" | "Plan to Watch") => {
    const updated = getAllHistory();
    const idx = updated.findIndex((i) => i.id === item.id);
    if (idx !== -1) {
      updated[idx].watch_status = status;
      updated[idx].updatedAt = Date.now();
      saveAllHistory(updated);
      setHistory(updated.map(migrateItem));
    }
  };

  const handleResume = (item: WatchHistoryItem) => {
    if (item.type === "MOVIE") {
      router.push(`/movies/${item.id}`);
    } else {
      const season = item.lastSeason ?? 1;
      const episode = item.lastEpisode ?? 1;
      router.push(`/web-series/watch/${season}/${episode}/${item.id}`);
    }
  };

  const handleMouseEnter = useCallback(
    async (e: React.MouseEvent, item: WatchHistoryItem) => {
      setHoverPosition({ x: e.clientX, y: e.clientY });
      setShowHoverMenu(true);
      setIsLoading(true);
      try {
        let data: MovieInfoType | TVInfo | null = null;
        if (item.type === "MOVIE") {
          data = (await clientFetch(`hover:movie:${item.id}`, () =>
            MovieInfo(item.id.toString()),
          )) ?? null;
        } else {
          data = ((await clientFetch(`hover:tv:${item.id}`, () =>
            InfoImagesCreditsTV({ type: "info", id: item.id }),
          )) as TVInfo) ?? null;
        }
        setHoverData(data || null);
      } catch {
        setHoverData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const handleMouseLeave = () => {
    setHoverData(null);
    setShowHoverMenu(false);
    setIsLoading(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (showHoverMenu) {
      setHoverPosition({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto space-y-8 bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Continue Watching & Library
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight">
            Watch History
          </h1>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-2">
          {([
            { key: "watching", label: "Watching", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
            { key: "planToWatch", label: "Plan to Watch", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
            { key: "completed", label: "Completed", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
          ] as const).map((stat) => (
            <button
              key={stat.key}
              onClick={() => setActiveTab(stat.label)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${stat.color} hover:scale-105`}
            >
              <span className="font-black mr-1.5">{stats[stat.key]}</span>
              <span className="hidden sm:inline font-semibold">{stat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search, Sort, and Tabs Rail */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex bg-[#12151F] p-1 rounded-lg border border-white/10 w-full md:w-auto overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? "bg-primary text-white shadow-md"
                  : "text-[#94A3B8] hover:text-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
            <Input
              placeholder="Filter titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-[#12151F] border-white/10 rounded-lg text-xs font-medium text-white placeholder:text-[#94A3B8]/60 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px] h-9 bg-[#12151F] border-white/10 text-white font-semibold text-xs rounded-lg">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1 text-[#94A3B8]" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-[#12151F] border-white/10 text-white rounded-lg shadow-2xl">
              <SelectItem value="updated" className="text-xs font-semibold cursor-pointer">Recently Updated</SelectItem>
              <SelectItem value="title" className="text-xs font-semibold cursor-pointer">Title A-Z</SelectItem>
              <SelectItem value="progress" className="text-xs font-semibold cursor-pointer">Progress %</SelectItem>
              <SelectItem value="status" className="text-xs font-semibold cursor-pointer">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-xl bg-[#12151F]/40">
          <Film className="h-10 w-10 mx-auto text-[#94A3B8]/40 mb-3" />
          <p className="text-white text-base font-bold">
            {searchQuery ? "No matches found in your watch list" : "Your watch list is empty"}
          </p>
          {!searchQuery && (
            <p className="text-[#94A3B8] text-xs mt-1">
              Start streaming movies and series to automatically build your continue watching shelf.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <AnimatePresence mode="popLayout">
              {displayed.map((item) => (
                <RichHistoryCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onResume={handleResume}
                  onStatusChange={handleStatusChange}
                  onHoverEnter={handleMouseEnter}
                  onHoverLeave={handleMouseLeave}
                  onHoverMove={handleMouseMove}
                />
              ))}
            </AnimatePresence>
          </div>
          {displayCount < filtered.length && (
            <div className="text-center pt-6">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg font-bold text-xs px-6 bg-white/10 text-white border-white/15 hover:bg-white/20 cursor-pointer"
                onClick={() => setDisplayCount((c) => c + 20)}
              >
                Load More ({filtered.length - displayCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}

      {/* Hover Detail Modal */}
      {showHoverMenu && (
        <div
          className="fixed z-50 bg-[#12151F]/95 backdrop-blur-xl text-white rounded-lg shadow-2xl p-4 max-w-xs border border-white/15 pointer-events-none transition-all duration-150"
          style={{
            left: `${hoverPosition.x + 16}px`,
            top: `${hoverPosition.y + 16}px`,
            transform:
              hoverPosition.x > (typeof window !== "undefined" ? window.innerWidth - 350 : 800)
                ? "translateX(-110%)"
                : "none",
          }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2.5 py-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-xs font-semibold text-[#94A3B8]">Loading title details...</span>
            </div>
          ) : hoverData ? (
            <div className="space-y-2.5">
              <h3 className="font-bold text-sm leading-tight text-white">
                {"title" in hoverData ? hoverData.title : hoverData.name}
              </h3>
              {hoverData.backdrop_path && (
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${hoverData.backdrop_path}`}
                    alt="Backdrop"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-[11px] text-[#94A3B8] line-clamp-3">
                {hoverData.overview}
              </p>
              <div className="flex items-center justify-between text-[10px] text-[#94A3B8] border-t border-white/10 pt-2 font-semibold">
                {hoverData.vote_average && (
                  <span className="text-[#F59E0B]">
                    ★ {hoverData.vote_average.toFixed(1)} / 10
                  </span>
                )}
                {"runtime" in hoverData && hoverData.runtime && (
                  <span>
                    {Math.floor(hoverData.runtime / 60)}h {hoverData.runtime % 60}m
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-red-400">Failed to load preview</div>
          )}
        </div>
      )}
    </main>
  );
}

function RichHistoryCard({
  item,
  onDelete,
  onResume,
  onStatusChange,
  onHoverEnter,
  onHoverLeave,
  onHoverMove,
}: {
  item: WatchHistoryItem;
  onDelete: (id: number) => void;
  onResume: (item: WatchHistoryItem) => void;
  onStatusChange: (item: WatchHistoryItem, status: "Watching" | "Completed" | "Plan to Watch") => void;
  onHoverEnter: (e: React.MouseEvent, item: WatchHistoryItem) => void;
  onHoverLeave: () => void;
  onHoverMove: (e: React.MouseEvent) => void;
}) {
  const prog =
    item.type === "TV"
      ? getSeriesProgress(item.id)
      : (() => {
          const p = getPlaybackProgress(item.id);
          return p
            ? { watched: 0, total: 0, percent: Math.round(p.playbackPercentage) }
            : { watched: 0, total: 0, percent: 0 };
        })();

  const statusColor = statusColors[item.watch_status] || "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-lg overflow-hidden border border-white/[0.08] bg-[#12151F] hover:border-white/25 hover:shadow-xl transition-all cursor-pointer"
    >
      {/* Poster */}
      <div
        className="relative aspect-[2/3] overflow-hidden bg-black"
        onMouseEnter={(e) => onHoverEnter(e, item)}
        onMouseLeave={onHoverLeave}
        onMouseMove={onHoverMove}
        onClick={() => onResume(item)}
      >
        {item.poster ? (
          <Image
            src={
              item.poster.startsWith("http")
                ? item.poster
                : `https://image.tmdb.org/t/p/w342${item.poster}`
            }
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <Film className="h-8 w-8 text-[#94A3B8]" />
          </div>
        )}

        {/* Netflix-style Red Progress Bar Line on Poster */}
        {prog.percent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60 z-20">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${prog.percent}%` }}
            />
          </div>
        )}

        {/* Hover overlay with streaming quick actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 z-10">
          <Button
            size="sm"
            className="w-full rounded-md font-bold text-xs bg-white text-black hover:bg-white/90 gap-1.5 h-8 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onResume(item);
            }}
          >
            <Play className="h-3 w-3 fill-black ml-0.5" />
            {item.watch_status === "Plan to Watch" ? "Start" : "Resume"}
          </Button>

          <div className="flex gap-1.5 w-full">
            {(["Watching", "Completed", "Plan to Watch"] as const).map((s) => (
              <button
                key={s}
                className={`flex-1 rounded py-1 text-[9px] font-black uppercase tracking-wider border transition-colors ${
                  item.watch_status === s
                    ? "bg-primary border-primary text-white"
                    : "bg-white/10 border-white/15 text-slate-300 hover:bg-white/20"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(item, s);
                }}
              >
                {s === "Watching" ? "W" : s === "Completed" ? "C" : "P"}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="destructive"
            className="w-full rounded-md font-semibold gap-1 text-[11px] h-7 mt-auto"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
            Remove
          </Button>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-white border border-white/10">
            {item.type === "TV" ? "SERIES" : "MOVIE"}
          </span>
        </div>
      </div>

      {/* Info below poster */}
      <div className="p-2.5 space-y-1">
        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center justify-between text-[10px]">
          {item.type === "TV" && prog.total > 0 ? (
            <span className="font-semibold text-[#94A3B8]">
              {prog.watched}/{prog.total} eps
            </span>
          ) : prog.percent > 0 ? (
            <span className="font-semibold text-primary">
              {prog.percent}%
            </span>
          ) : (
            <span className="text-[#94A3B8]">—</span>
          )}
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${statusColor}`}>
            {item.watch_status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
