"use client";

import { useState, useCallback, ReactNode } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Search as SearchIcon, Loader2, Sparkles } from "lucide-react";

import { MoviesSearchRequest } from "@/utils/movie-requests/request";
import { SearchTV } from "@/utils/tv-requests/request";
import CombinedSearch from "./combined-search";
import { clientFetch } from "@/utils/client-cache";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Search = () => {
  const [title, setTitle] = useState<string>("");
  const [format, setFormat] = useState<ReactNode>(<></>);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(
    async (event?: React.KeyboardEvent) => {
      if (event && event.key !== "Enter") return;

      if (!title.trim()) return;

      setIsLoading(true);
      setFormat(
        <div className="flex h-[240px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>,
      );

      try {
        const [moviesData, tvData] = await Promise.all([
          clientFetch(`search:movies:${title}`, () =>
            MoviesSearchRequest(title),
          ),
          clientFetch(`search:tv:${title}`, () =>
            SearchTV({ title }),
          ),
        ]);

        setFormat(<CombinedSearch moviesData={moviesData} tvData={tvData} />);
      } catch (error) {
        console.error("Search failed:", error);
        setFormat(<div className="p-4 text-center text-red-400 text-xs">Search failed. Please try again.</div>);
      } finally {
        setIsLoading(false);
      }
    },
    [title],
  );

  useHotkeys(["ctrl+k", "meta+k"], (event) => {
    event.preventDefault();
    setIsOpen(true);
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="relative h-9 px-3 rounded-md bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-[#94A3B8] hover:text-white transition-all flex items-center gap-2.5 cursor-pointer text-xs font-semibold"
          onClick={() => setIsOpen(true)}
        >
          <SearchIcon className="h-3.5 w-3.5 text-white/70" />
          <span className="hidden sm:inline-flex">Search catalog...</span>
          <kbd className="pointer-events-none hidden sm:flex h-4 select-none items-center gap-0.5 rounded bg-white/10 px-1.5 font-mono text-[9px] text-[#94A3B8]">
            ⌘K
          </kbd>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden bg-[#090A10]/95 backdrop-blur-2xl border-white/15 shadow-2xl rounded-xl text-white">
        <div className="p-5 md:p-6 space-y-4">
          <div className="relative flex items-center gap-3 bg-[#12151F] border border-white/15 rounded-lg px-4 py-2.5 focus-within:border-primary/60 transition-colors">
            <SearchIcon className="h-4 w-4 text-[#94A3B8]" />
            <Input
              className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 text-sm md:text-base h-auto p-0 font-sans font-medium text-white placeholder:text-[#94A3B8]/60"
              placeholder="Search movies, TV shows, actors..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleSearch}
              autoFocus
            />
            <Button
              size="sm"
              className="h-8 rounded-md font-bold text-xs px-4 bg-primary hover:bg-primary/90 text-white cursor-pointer"
              onClick={() => handleSearch()}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Search"}
            </Button>
          </div>

          <ScrollArea className="h-[50vh] pr-2">
            <div
              onClick={() => {
                setIsOpen(false);
                setTitle("");
              }}
              className="pb-2"
            >
              {format}
            </div>
            {!title && !format && (
              <div className="flex flex-col items-center justify-center py-16 text-[#94A3B8]/60 space-y-2">
                <Sparkles className="h-8 w-8 opacity-40 text-primary" />
                <p className="text-xs font-medium">Type a title and press Enter or Search</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Search;
