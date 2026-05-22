import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Download,
  PlayCircle,
  Eye,
  Info,
  Monitor,
  Layers,
} from "lucide-react";
import { EpisodeInfo, InfoImagesCreditsTV } from "@/utils/tv-requests/request";
import { TVInfo, TVEpisodeInfo } from "@/utils/types";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";
import WebSeriesWatchStatus from "@/components/web-ui/watch-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: { slugs: string[] };
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const p = await params;
    const slugs = p.slugs || [];
    if (slugs.length < 3) return { title: "Watch Episode | Dramaflix" };

    const series_id = slugs[2];
    const season_number = slugs[0];
    const episode_number = slugs[1];

    const seriesInfo = (await InfoImagesCreditsTV({
      type: "info",
      id: parseInt(series_id),
    })) as TVInfo;

    const episodeInfo = (await EpisodeInfo({
      id: series_id,
      season: season_number,
      episode: episode_number,
    })) as TVEpisodeInfo;

    if (!seriesInfo) return { title: "Series Not Found" };

    const title = `${seriesInfo.name} - S${season_number} E${episode_number} ${episodeInfo?.name ? `- ${episodeInfo.name}` : ""}`;
    return {
      title: `${title} | Dramaflix`,
      description: episodeInfo?.overview || seriesInfo.overview,
      openGraph: {
        title,
        images: [
          {
            url: `https://image.tmdb.org/t/p/original${seriesInfo.poster_path}`,
          },
        ],
      },
    };
  } catch (error) {
    return { title: "Watch Episode - Dramaflix" };
  }
}

const SeriesPlayer = async ({ params }: { params: { slugs: string[] } }) => {
  const { slugs } = await params;

  if (slugs.length < 3) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-4">
        <h1 className="text-2xl font-bold">Invalid parameters provided.</h1>
      </div>
    );
  }

  const series_id = slugs[2];
  const season_number = slugs[0];
  const episode_number = slugs[1];
  const seriesIdNum = parseInt(series_id);

  let epData: TVEpisodeInfo | undefined;
  let seasonEpisodeCounts: Record<number, number> | undefined;

  try {
    epData = await EpisodeInfo({
      id: series_id,
      season: season_number,
      episode: episode_number,
    });
  } catch (error) {
    console.error("Error fetching episode info:", error);
  }

  try {
    const seriesInfo = await InfoImagesCreditsTV({
      type: "info",
      id: seriesIdNum,
    }) as TVInfo;
    if (seriesInfo?.seasons) {
      seasonEpisodeCounts = {};
      seriesInfo.seasons.forEach((s) => {
        if (s.season_number != null) {
          seasonEpisodeCounts![s.season_number] = s.episode_count ?? 0;
        }
      });
    }
  } catch (error) {
    console.error("Error fetching series info for progress:", error);
  }

  const seriesLinksArray = [
    {
      title: "Server 1",
      link: `https://embedmaster.link/1imz6ldd5kpmzdyi/tv/${series_id}/${season_number}/${episode_number}`,
    },
    {
      title: "Server 2",
      link: `https://vidsrc.vip/embed/tv/${series_id}/${season_number}/${episode_number}`,
    },
    {
      title: "Server 3",
      link: `https://vidsrc.icu/embed/tv/${series_id}/${season_number}/${episode_number}`,
    },
    {
      title: "Server 4",
      link: `https://vidzen.fun/tv/${series_id}/${season_number}/${episode_number}`,
    },
  ];

  return (
    <main className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="Server 1" className="w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <TabsList className="bg-muted/50 p-1 border border-border/50 rounded-xl">
              {seriesLinksArray.map((items) => (
                <TabsTrigger
                  key={items.title}
                  value={items.title}
                  className="rounded-lg px-6 font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  {items.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="px-4 py-1.5 border-primary/30 text-primary-foreground bg-primary font-black italic tracking-widest uppercase"
              >
                Watching S{season_number} E{episode_number}
              </Badge>
            </div>
          </div>

          {seriesLinksArray.map((items) => (
            <TabsContent
              key={items.title}
              value={items.title}
              className="mt-0 outline-none"
            >
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-border/50 bg-black group">
                <iframe
                  src={items.link}
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  title={`Series Player - ${items.title}`}
                />
              </div>

              <div className="mt-6 flex flex-col lg:flex-row gap-6">
                {/* Status and Actions Card */}
                <Card className="flex-1 bg-card/40 border-border/50 rounded-3xl overflow-hidden">
                  <CardContent className="p-0">
                    <WebSeriesWatchStatus
                      id={series_id}
                      season={season_number}
                      episode={episode_number}
                      title={
                        epData && epData.name
                          ? epData.name
                          : `Episode ${episode_number}`
                      }
                      posterPath={
                        epData && epData.still_path
                          ? epData.still_path
                          : "/placeholder.svg"
                      }
                      seasonEpisodeCounts={seasonEpisodeCounts}
                    />
                  </CardContent>
                </Card>

                {/* Download and Share Card */}
                <Card className="lg:w-80 bg-primary/5 border-primary/20 border-dashed rounded-3xl">
                  <CardContent className="p-6 flex flex-col justify-center items-center gap-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Download className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold">Quality Source</h4>
                      <p className="text-xs text-muted-foreground italic">
                        Download this episode for offline viewing in high
                        quality.
                      </p>
                    </div>
                    <Link
                      href={`https://dl.vidsrc.vip/tv/${series_id}/${season_number}/${episode_number}`}
                      target="_blank"
                      className="w-full"
                    >
                      <Button className="w-full font-black uppercase tracking-widest group shadow-lg">
                        Download{" "}
                        <Download className="ml-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Episode Detailed Info Section */}
        {epData && (
          <section className="mt-12 group">
            <div className="flex flex-col md:flex-row gap-8 bg-muted/20 border border-border/50 rounded-[2.5rem] p-6 lg:p-8 transition-all hover:bg-muted/30">
              <div className="relative md:w-80 aspect-video shrink-0 rounded-2xl overflow-hidden shadow-xl border border-border/50">
                <Image
                  src={
                    epData.still_path
                      ? `https://image.tmdb.org/t/p/original${epData.still_path}`
                      : "/placeholder.svg"
                  }
                  fill
                  alt="Episode Poster"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-primary/90 text-primary-foreground font-black">
                    EPISODE {episode_number}
                  </Badge>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-yellow-500">
                    <Star className="h-5 w-5 fill-yellow-500" />
                    <span className="text-xl font-black">
                      {epData.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground/40 font-black">
                      / 10
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
                    {epData.name}
                  </h2>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 flex items-center gap-2">
                    <Info className="h-3 w-3" /> Intel Report
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed italic border-l-4 border-primary/20 pl-6">
                    {epData.overview ||
                      "No transmission data available for this episode snippet."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border border-border/50 shadow-sm">
                    <Monitor className="h-4 w-4 text-primary" />
                    <span className="text-xs font-black uppercase">
                      Season {season_number}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border border-border/50 shadow-sm">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="text-xs font-black uppercase">
                      TMDB ID: {series_id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default SeriesPlayer;
