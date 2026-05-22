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
  getWatchHistoryStats,
  getSeriesProgress,
  getPlaybackProgress,
  WatchHistoryItem,
  migrateItem,
} from "@/utils/localStorage";
import { MovieInfo } from "@/utils/movie-requests/request";
import { InfoImagesCreditsTV } from "@/utils/tv-requests/request";
import { MovieInfoType, TVInfo } from "@/utils/types";

const TABS = ["All", "Watching", "Plan to Watch", "Completed"] as const;

const statusIcons: Record<string, React.ReactNode> = {
  Watching: <Eye className="h-3.5 w-3.5" />,
  Completed: <CheckCheck className="h-3.5 w-3.5" />,
  "Plan to Watch": <BookmarkPlus className="h-3.5 w-3.5" />,
};

const statusColors: Record<string, string> = {
  Watching: "text-green-400 border-green-500/30 bg-green-500/10",
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

  useEffect(() => {
    const raw = getAllHistory();
    const migrated = raw.map(migrateItem);
    if (JSON.stringify(raw) !== JSON.stringify(migrated)) {
      saveAllHistory(migrated);
    }
    setHistory(migrated);
  }, []);

  const stats = useMemo(() => getWatchHistoryStats(), [history]);

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
          data = (await MovieInfo(item.id.toString())) ?? null;
        } else {
          data = ((await InfoImagesCreditsTV({
            type: "info",
            id: item.id,
          })) as TVInfo) ?? null;
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
    <main className="container mx-auto p-4 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
            Watch <span className="text-primary">History</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Track your progress across movies and series
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {([
            { key: "watching", label: "Watching", icon: <Eye className="h-4 w-4" />, color: "text-green-400" },
            { key: "planToWatch", label: "Plan to Watch", icon: <BookmarkPlus className="h-4 w-4" />, color: "text-amber-400" },
            { key: "completed", label: "Completed", icon: <CheckCheck className="h-4 w-4" />, color: "text-blue-400" },
          ] as const).map((stat) => (
            <div
              key={stat.key}
              className="bg-muted/20 border border-border/50 rounded-2xl p-3 text-center hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => setActiveTab(stat.label)}
            >
              <div className={`flex justify-center mb-1 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-xl font-black">{stats[stat.key]}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your tracked titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/20 border-border/50 rounded-xl font-medium"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-muted/20 border-border/50 rounded-xl font-bold">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently Updated</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="progress">Progress %</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted/30 p-1 rounded-2xl max-w-lg mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                activeTab === tab
                  ? "bg-background shadow-sm text-foreground border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl border-muted">
            <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg font-medium">
              {searchQuery
                ? "No matches found"
                : "Nothing here yet"}
            </p>
            {!searchQuery && (
              <p className="text-muted-foreground/60 text-sm mt-1">
                Start tracking movies & series to see them here
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full font-bold px-8"
                  onClick={() => setDisplayCount((c) => c + 20)}
                >
                  Load More ({filtered.length - displayCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hover Popup */}
      {showHoverMenu && (
        <div
          className="fixed z-50 bg-popover text-popover-foreground rounded-xl shadow-2xl p-4 max-w-sm border border-border animate-in fade-in zoom-in duration-200"
          style={{
            left: `${hoverPosition.x + 16}px`,
            top: `${hoverPosition.y + 16}px`,
            transform:
              hoverPosition.x > (typeof window !== "undefined" ? window.innerWidth - 400 : 800)
                ? "translateX(-110%)"
                : "none",
          }}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm font-medium">Loading details...</span>
            </div>
          ) : hoverData ? (
            <div className="space-y-3">
              <h3 className="font-bold text-base leading-tight">
                {"title" in hoverData ? hoverData.title : hoverData.name}
              </h3>
              {hoverData.backdrop_path && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-inner">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${hoverData.backdrop_path}`}
                    alt="Backdrop"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground line-clamp-3">
                {hoverData.overview}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground border-t pt-2">
                {hoverData.vote_average && (
                  <div>
                    <span className="font-semibold text-primary">Rating:</span>{" "}
                    {hoverData.vote_average.toFixed(1)}/10
                  </div>
                )}
                {"runtime" in hoverData && hoverData.runtime && (
                  <div>
                    <span className="font-semibold text-primary">Runtime:</span>{" "}
                    {Math.floor(hoverData.runtime / 60)}h {hoverData.runtime % 60}m
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-destructive">Failed to load details</div>
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
  const router = useRouter();
  const prog =
    item.type === "TV"
      ? getSeriesProgress(item.id)
      : (() => {
          const p = getPlaybackProgress(item.id);
          return p
            ? { watched: 0, total: 0, percent: Math.round(p.playbackPercentage) }
            : { watched: 0, total: 0, percent: 0 };
        })();

  const statusIcon = statusIcons[item.watch_status] || null;
  const statusColor = statusColors[item.watch_status] || "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card hover:shadow-xl transition-shadow cursor-pointer"
    >
      {/* Poster */}
      <div
        className="relative aspect-[2/3] overflow-hidden"
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
          <div className="w-full h-full bg-muted/50 flex items-center justify-center">
            <Film className="h-10 w-10 text-muted-foreground" />
          </div>
        )}

        {/* Progress bar on poster */}
        {prog.percent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/30">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${prog.percent}%` }}
            />
          </div>
        )}

        {/* Hover overlay with quick actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
          <Button
            size="sm"
            variant="secondary"
            className="w-full rounded-full font-bold gap-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onResume(item);
            }}
          >
            <Play className="h-3 w-3 fill-current" />
            {item.watch_status === "Plan to Watch" ? "Start" : "Resume"}
          </Button>
          <div className="flex gap-2 w-full">
            {(["Watching", "Completed", "Plan to Watch"] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={item.watch_status === s ? "default" : "outline"}
                className={`flex-1 rounded-full text-[9px] font-bold ${
                  item.watch_status === s ? "" : "bg-background/60 hover:bg-background/80"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(item, s);
                }}
              >
                {s === "Watching" ? "W" : s === "Completed" ? "C" : "P"}
              </Button>
            ))}
          </div>
          <Button
            size="sm"
            variant="destructive"
            className="w-full rounded-full font-bold gap-2 text-xs mt-auto"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
            Remove
          </Button>
        </div>

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <Badge
            variant="outline"
            className={`text-[9px] font-black uppercase border-border/40 bg-background/60 backdrop-blur-sm flex items-center gap-1 ${statusColor}`}
          >
            {statusIcon}
            {item.type === "TV" ? "SERIES" : "MOVIE"}
          </Badge>
        </div>
      </div>

      {/* Info below poster */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center justify-between">
          {item.type === "TV" && prog.total > 0 ? (
            <span className="text-[10px] font-bold text-muted-foreground">
              {prog.watched}/{prog.total} eps
            </span>
          ) : prog.percent > 0 ? (
            <span className="text-[10px] font-bold text-muted-foreground">
              {prog.percent}% watched
            </span>
          ) : (
            <span className="text-[10px] font-bold text-muted-foreground">—</span>
          )}
          <Badge className={`text-[9px] font-black uppercase ${statusColor}`}>
            {item.watch_status}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}
