"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Playback / Application Error:", error);
  }, [error]);

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Card Content */}
      <div className="relative z-10 max-w-xl w-full text-center space-y-8 bg-[#12151F]/70 backdrop-blur-xl border border-white/[0.08] p-8 sm:p-12 rounded-2xl shadow-2xl">
        {/* Signal Interruption Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-black/60 border border-primary/30 flex items-center justify-center shadow-xl">
            <AlertCircle className="h-10 w-10 text-primary" />
          </div>
          <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary text-white border border-white/20 animate-pulse">
            Signal Lost
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
            Broadcast Interruption
          </p>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Playback Interrupted
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] font-medium leading-relaxed max-w-md mx-auto">
            A temporary streaming feed error occurred while retrieving this media. Reloading the reel usually solves the issue.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-md text-sm gap-2 shadow-lg shadow-primary/20 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reload Stream</span>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold px-5 py-2.5 rounded-md text-sm gap-2"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>

        {/* Development Error Diagnostics */}
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="mt-6 text-left rounded-lg bg-black/50 border border-white/10 p-3.5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-wider block font-bold">
              Debug Information
            </span>
            <p className="text-xs font-mono text-red-400 break-all">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
