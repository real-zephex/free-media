export interface WatchHistoryItem {
  id: number;
  title: string;
  poster: string | null;
  description: string;
  watch_status: "Watching" | "Completed" | "Plan to Watch";
  type: "MOVIE" | "TV";
  lastSeason?: number;
  lastEpisode?: number;
  episodes?: Record<string, Record<string, boolean>>;
  updatedAt?: number;
}

function getAllHistory(): WatchHistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem("watchHistory") || "[]");
  } catch {
    return [];
  }
}

function saveAllHistory(history: WatchHistoryItem[]) {
  localStorage.setItem("watchHistory", JSON.stringify(history));
}

function migrateItem(item: WatchHistoryItem): WatchHistoryItem {
  if (item.type === "TV" && !item.episodes) {
    const patched: WatchHistoryItem = {
      ...item,
      episodes: {},
      lastSeason: item.lastSeason ?? 1,
      lastEpisode: item.lastEpisode ?? 1,
    };
    if ((item as any).overview && typeof (item as any).overview === "string") {
      const match = (item as any).overview.match(
        /Season\s+(\d+),\s+Episode\s+(\d+)/,
      );
      if (match) {
        patched.lastSeason = parseInt(match[1]);
        patched.lastEpisode = parseInt(match[2]);
      }
    }
    patched.episodes = patched.episodes ?? {};
    const sKey = String(patched.lastSeason ?? 1);
    const eKey = String(patched.lastEpisode ?? 1);
    patched.episodes[sKey] = patched.episodes[sKey] ?? {};
    patched.episodes[sKey][eKey] = true;
    return patched;
  }
  if (!item.updatedAt) {
    item.updatedAt = Date.now();
  }
  return item;
}

function storeIntoLocal({
  movieData,
  status,
  type,
  season,
  episode,
}: {
  movieData: { id: any; title: string; poster_path: string | null; overview?: string };
  status: "Completed" | "Plan to Watch" | "Watching";
  type: "MOVIE" | "TV";
  season?: number;
  episode?: number;
}) {
  try {
    const parsed = getAllHistory();
    const existingIndex = parsed.findIndex(
      (item) => item.id === movieData.id,
    );

    if (existingIndex !== -1) {
      const item = migrateItem(parsed[existingIndex]);
      item.watch_status = status;
      item.updatedAt = Date.now();
      if (type === "TV") {
        item.description = movieData.overview ?? item.description;
        item.poster = movieData.poster_path ?? item.poster;
        item.title = movieData.title;
        if (season !== undefined && episode !== undefined) {
          item.lastSeason = season;
          item.lastEpisode = episode;
        }
      }
      parsed[existingIndex] = item;
    } else {
      const item: WatchHistoryItem = {
        id: Number(movieData.id),
        title: movieData.title,
        poster: movieData.poster_path,
        description: movieData.overview ?? "",
        watch_status: status,
        type,
        updatedAt: Date.now(),
      };
      if (type === "TV") {
        item.episodes = {};
        if (season !== undefined && episode !== undefined) {
          item.lastSeason = season;
          item.lastEpisode = episode;
          const sKey = String(season);
          const eKey = String(episode);
          item.episodes[sKey] = { [eKey]: true };
        }
      }
      parsed.push(item);
    }
    saveAllHistory(parsed);
    return true;
  } catch {
    console.error("Error saving watch data.");
    return false;
  }
}

function watchStatusRetriever(id: number | string): string {
  const parsed = getAllHistory();
  if (parsed.length === 0) return "Not found";
  const item = parsed.find((i) => i.id === Number(id));
  return item?.watch_status ?? "Not found";
}

function getWatchHistoryItem(id: number | string): WatchHistoryItem | null {
  const parsed = getAllHistory();
  const item = parsed.find((i) => i.id === Number(id));
  return item ? migrateItem(item) : null;
}

function markEpisodeWatched(
  seriesId: number | string,
  season: number,
  episode: number,
  watched: boolean,
) {
  const parsed = getAllHistory();
  const idx = parsed.findIndex((i) => i.id === Number(seriesId));
  if (idx === -1) return;

  const item = migrateItem(parsed[idx]);
  if (!item.episodes) item.episodes = {};
  const sKey = String(season);
  const eKey = String(episode);
  item.episodes[sKey] = item.episodes[sKey] || {};
  item.episodes[sKey][eKey] = watched;
  item.lastSeason = season;
  item.lastEpisode = episode;
  item.updatedAt = Date.now();
  parsed[idx] = item;
  saveAllHistory(parsed);
}

function isEpisodeWatched(
  seriesId: number | string,
  season: number,
  episode: number,
): boolean {
  const item = getWatchHistoryItem(seriesId);
  if (!item?.episodes) return false;
  const sKey = String(season);
  const eKey = String(episode);
  return !!item.episodes[sKey]?.[eKey];
}

function getSeriesProgress(
  seriesId: number | string,
  seasonEpisodeCounts?: Record<number, number>,
): { watched: number; total: number; percent: number } {
  const item = getWatchHistoryItem(seriesId);
  if (!item?.episodes) return { watched: 0, total: 0, percent: 0 };

  let watched = 0;
  let total = 0;

  if (seasonEpisodeCounts) {
    for (const [sStr, count] of Object.entries(seasonEpisodeCounts)) {
      total += count;
      const seasonEpisodes = item.episodes[sStr];
      if (seasonEpisodes) {
        for (let e = 1; e <= count; e++) {
          if (seasonEpisodes[String(e)]) watched++;
        }
      }
    }
  } else {
    for (const seasonEpisodes of Object.values(item.episodes)) {
      total += Object.keys(seasonEpisodes).length;
      watched += Object.values(seasonEpisodes).filter(Boolean).length;
    }
  }

  return {
    watched,
    total,
    percent: total > 0 ? Math.round((watched / total) * 100) : 0,
  };
}

function getSeasonProgress(
  seriesId: number | string,
  season: number,
  totalEpisodes: number,
): { watched: number; total: number; percent: number } {
  const item = getWatchHistoryItem(seriesId);
  if (!item?.episodes) return { watched: 0, total: totalEpisodes, percent: 0 };

  const sKey = String(season);
  const seasonEpisodes = item.episodes[sKey];
  if (!seasonEpisodes) return { watched: 0, total: totalEpisodes, percent: 0 };

  const watched = Object.values(seasonEpisodes).filter(Boolean).length;
  return {
    watched,
    total: totalEpisodes,
    percent: totalEpisodes > 0 ? Math.round((watched / totalEpisodes) * 100) : 0,
  };
}

function getPlaybackProgress(
  mediaId: number | string,
): { currentTime: number; playbackPercentage: number } | null {
  try {
    const data = JSON.parse(
      localStorage.getItem("all_episode_times") || "{}",
    );
    return data[String(mediaId)] ?? null;
  } catch {
    return null;
  }
}

function getPlaybackProgressPerEpisode(
  seriesId: number | string,
  season: number,
  episode: number,
): { currentTime: number; playbackPercentage: number } | null {
  const key = `${seriesId}-S${season}E${episode}`;
  return getPlaybackProgress(key);
}

function removeFromHistory(id: number | string) {
  const parsed = getAllHistory();
  const filtered = parsed.filter((i) => i.id !== Number(id));
  saveAllHistory(filtered);
}

function getWatchHistoryStats() {
  const parsed = getAllHistory();
  return {
    watching: parsed.filter((i) => i.watch_status === "Watching").length,
    planToWatch: parsed.filter((i) => i.watch_status === "Plan to Watch").length,
    completed: parsed.filter((i) => i.watch_status === "Completed").length,
    total: parsed.length,
  };
}

export {
  storeIntoLocal,
  watchStatusRetriever,
  getWatchHistoryItem,
  getAllHistory,
  saveAllHistory,
  markEpisodeWatched,
  isEpisodeWatched,
  getSeriesProgress,
  getSeasonProgress,
  getPlaybackProgress,
  getPlaybackProgressPerEpisode,
  removeFromHistory,
  getWatchHistoryStats,
  migrateItem,
};
