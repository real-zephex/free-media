"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Film, Tv, Sparkles } from "lucide-react";

const channels = [
  {
    title: "Cinematic Blockbusters",
    subtitle: "New Releases & Timeless Classics",
    description:
      "Explore thousands of top-rated Hollywood, world cinema, and independent films with 4K resolution and high bitrates.",
    href: "/movies",
    icon: Film,
    image: "/movie.jpg",
    badge: "MOVIES HUB",
    subColor: "text-rose-400",
    hoverBorder: "group-hover:border-rose-500/40",
    buttonHover: "group-hover:bg-primary group-hover:border-primary",
    color: "from-rose-900/30 to-transparent",
  },
  {
    title: "Binge-Worthy Web Series",
    subtitle: "Full Seasons & Daily Episodes",
    description:
      "Follow epic dramas, gripping thrillers, and award-winning series with automated episode tracking and progress memory.",
    href: "/web-series",
    icon: Tv,
    image: "/series.jpg",
    badge: "SERIES HUB",
    subColor: "text-sky-400",
    hoverBorder: "group-hover:border-sky-500/40",
    buttonHover: "group-hover:bg-[#00A8E1] group-hover:border-[#00A8E1]",
    color: "from-blue-900/30 to-transparent",
  },
];

export const BentoFeatures = () => {
  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto relative z-30">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Curated Entertainment
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white">
            Choose Your Destination
          </h2>
        </div>
        <p className="text-xs md:text-sm font-medium text-[#94A3B8] max-w-md">
          Seamlessly navigate between blockbuster feature films and episodic television series.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        {channels.map((channel, index) => (
          <motion.div
            key={channel.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className={`group relative overflow-hidden rounded-xl border border-white/10 bg-[#12151F] shadow-xl ${channel.hoverBorder} transition-all duration-500 min-h-[320px] md:min-h-[350px]`}
          >
            <Link href={channel.href} className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-8">
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-md border border-white/15 text-white">
                  {channel.badge}
                </span>

                <div className={`p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 ${channel.buttonHover} transition-all duration-300`}>
                  <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="space-y-2 z-10">
                <h3 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white transition-colors duration-300">
                  {channel.title}
                </h3>
                <p className={`text-xs sm:text-sm font-bold tracking-wide ${channel.subColor}`}>
                  {channel.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-[#94A3B8] font-medium leading-relaxed max-w-md line-clamp-2">
                  {channel.description}
                </p>
              </div>
            </Link>

            {/* Backdrop Image & Streaming Gradient */}
            <div className="absolute inset-0 z-0">
              <Image
                src={channel.image}
                alt={channel.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-35 group-hover:opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-[#090A10]/70 to-transparent" />
              <div className={`absolute inset-0 bg-gradient-to-r ${channel.color}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
