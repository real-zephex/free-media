import Link from "next/link";
import { Film, Home, Clapperboard, Tv, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[#00A8E1]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Film Perforation Decorative Borders */}
      <div className="relative z-10 max-w-xl w-full text-center space-y-8 bg-[#12151F]/60 backdrop-blur-xl border border-white/[0.08] p-8 sm:p-12 rounded-2xl shadow-2xl">
        {/* Reel Clapperboard Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center shadow-xl">
            <Clapperboard className="h-10 w-10 text-primary" />
          </div>
          <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary text-white border border-white/20">
            Cut!
          </span>
        </div>

        {/* Cinematic Headline & Subtitle */}
        <div className="space-y-3">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
            Error 404 • Lost Footage
          </p>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            This Frame Didn&apos;t Make the Cut
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] font-medium leading-relaxed max-w-md mx-auto">
            The title, episode, or destination you requested doesn&apos;t exist, was archived, or was moved to another reel.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            asChild
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-md text-sm gap-2 shadow-lg shadow-primary/20"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold px-5 py-2.5 rounded-md text-sm gap-2"
          >
            <Link href="/movies">
              <Film className="h-4 w-4 text-primary" />
              <span>Explore Movies</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold px-5 py-2.5 rounded-md text-sm gap-2"
          >
            <Link href="/web-series">
              <Tv className="h-4 w-4 text-[#00A8E1]" />
              <span>Explore Series</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
