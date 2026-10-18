"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, Menu, Film, Tv, History, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Search from "../global-search";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Compass },
  { name: "Movies", href: "/movies", icon: Film },
  { name: "TV Shows", href: "/web-series", icon: Tv },
  { name: "Watch History", href: "/watch-history", icon: History },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        isScrolled
          ? "bg-[#090A10]/95 backdrop-blur-md border-b border-white/[0.08] shadow-2xl py-3 px-4 md:px-10 lg:px-16"
          : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4 md:py-6 px-4 md:px-10 lg:px-16"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand + Desktop Navigation */}
        <div className="flex items-center gap-8 md:gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-primary rounded-md p-1.5 shadow-[0_0_18px_rgba(229,9,20,0.6)] group-hover:scale-105 transition-transform duration-300">
              <Play className="h-4 w-4 md:h-5 md:w-5 text-white fill-current ml-0.5" />
            </div>
            <span className="font-display font-black text-xl md:text-2xl tracking-tighter text-white group-hover:text-primary transition-colors">
              DRAMAFLIX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-semibold tracking-wide transition-colors py-1 hover:text-white",
                    isActive
                      ? "text-white font-bold"
                      : "text-[#94A3B8]"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-line"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(229,9,20,0.8)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Search />

          {/* Mobile Menu */}
          <div className="flex md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg hover:bg-white/10 text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-3 p-2 bg-[#12151F]/95 backdrop-blur-xl border-white/10 rounded-xl shadow-2xl text-white"
              >
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                          isActive
                            ? "bg-primary/20 text-white font-bold"
                            : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                        )}
                      >
                        <item.icon className="h-4 w-4 text-primary" />
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
