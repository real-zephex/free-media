"use client";

import { SetStateAction, useEffect, useState, useCallback, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { Search as SearchIcon, Loader2, Command } from "lucide-react";

import MoviesSearch from "./movies-ui/movie-search-formatter";
import { MoviesSearchRequest } from "@/utils/movie-requests/request";
import { SearchTV } from "@/utils/tv-requests/request";
import SeriesSearchFormatter from "./web-ui/search-cards";
import { clientFetch } from "@/utils/client-cache";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Search = () => {
  const pathname = usePathname() as string;
  const [provider, setProvider] = useState<string>("movies"); // Default to movies
  const [title, setTitle] = useState<string>("");
  const [format, setFormat] = useState<ReactNode>(<></>);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const segments = pathname.split("/");
    const test = segments.length > 1 ? segments[1] : "";
    if (["movies", "web-series"].includes(test)) {
      setProvider(test);
    }
  }, [pathname]);

  const handleSearch = useCallback(
    async (event?: React.KeyboardEvent) => {
      if (event && event.key !== "Enter") return;

      if (!title.trim()) return;

      setIsLoading(true);
      setFormat(
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>,
      );

      let data;
      try {
        if (provider === "movies") {
          data = await clientFetch(`search:movies:${title}`, () =>
            MoviesSearchRequest(title),
          );
          setFormat(<MoviesSearch data={data} />);
        } else if (provider === "web-series") {
          data = await clientFetch(`search:tv:${title}`, () =>
            SearchTV({ title }),
          );
          setFormat(<SeriesSearchFormatter data={data} />);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setFormat(<div className="p-4 text-center text-destructive">Search failed. Please try again.</div>);
      } finally {
        setIsLoading(false);
      }
    },
    [title, provider],
  );

  useHotkeys("ctrl+k", (event) => {
    event.preventDefault();
    setIsOpen(true);
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 md:w-auto md:h-10 md:px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 group"
          onClick={() => setIsOpen(true)}
        >
          <SearchIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline-flex font-display text-sm font-medium">Search...</span>
          <kbd className="pointer-events-none hidden md:flex h-5 select-none items-center gap-1 rounded-full bg-white/10 px-2 font-mono text-[10px] font-medium opacity-50">
            <span className="text-[10px]">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden bg-background/60 backdrop-blur-3xl border-white/10 shadow-2xl rounded-[2rem] md:rounded-[3rem]">
        <div className="p-4 md:p-6 space-y-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 md:px-6 py-3 md:py-4 transition-all group-focus-within:border-primary/50 group-focus-within:bg-white/10">
              <SearchIcon className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 text-base md:text-xl h-auto p-0 font-display font-medium placeholder:text-muted-foreground/50"
                placeholder="What are you looking for?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleSearch}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger className="w-[100px] md:w-[140px] h-8 md:h-10 bg-white/5 border-white/10 rounded-full text-[10px] md:text-xs font-display">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/90 backdrop-blur-xl border-white/10 rounded-2xl">
                    <SelectItem value="movies">Movies</SelectItem>
                    <SelectItem value="web-series">Web-Series</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="h-8 md:h-10 rounded-full font-display font-bold px-4 md:px-6 bg-primary hover:scale-105 transition-transform"
                  onClick={() => handleSearch()}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find"}
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[50vh] md:h-[60vh] px-2">
            <div
              onClick={() => {
                setIsOpen(false);
                setTitle("");
              }}
              className="pb-4"
            >
              {format}
            </div>
            {!title && !format && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40">
                <Command className="h-16 w-16 mb-4 opacity-10" />
                <p className="font-display text-lg font-medium tracking-wide">Enter a title to begin your journey</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Search;
