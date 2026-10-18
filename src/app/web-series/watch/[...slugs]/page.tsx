import Link from "next/link";
import Image from "next/image";
import { Star, Download, Info, Monitor, Layers, ChevronLeft, ArrowRight } from "lucide-react";
import { EpisodeInfo, InfoImagesCreditsTV } from "@/utils/tv-requests/request";
import { TVInfo, TVEpisodeInfo } from "@/utils/types";
import { Metadata, ResolvingMetadata } from "next";
import WebSeriesWatchStatus from "@/components/web-ui/watch-status";
import EmbedSourcePlayer, {
  EmbedSource,
} from "@/components/embed-source-player";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slugs: string[] }>;
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

    if (!/^\d+$/.test(series_id)) {
      return { title: "Watch Episode | Dramaflix" };
    }

    const seriesInfo = (await InfoImagesCreditsTV({
      type: "info",
      id: parseInt(series_id, 10),
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

const SeriesPlayer = async ({ params }: Props) => {
  const { slugs } = await params;

  if (slugs.length < 3) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-4">
        <h1 className="text-2xl font-bold">Invalid parameters provided.</h1>
      </div>
    );
  }

  const season_number = slugs[0];
  const episode_number = slugs[1];
  const series_id = slugs[2];

  if (!/^\d+$/.test(series_id)) {
    notFound();
  }

  const seriesIdNum = parseInt(series_id, 10);

  let epData: TVEpisodeInfo | undefined;
  let seriesData: TVInfo | undefined;
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
    const seriesInfo = (await InfoImagesCreditsTV({
      type: "info",
      id: seriesIdNum,
    })) as TVInfo;
    seriesData = seriesInfo;
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

  const seriesLinksArray: EmbedSource[] = [
    {
      title: "EmbedMaster",
      link: `https://embedmaster.link/1imz6ldd5kpmzdyi/tv/${series_id}/${season_number}/${episode_number}`,
    },
    {
      title: "VidSrcBuzz",
      link: `https://vidsrc.buzz/embed/tv/${series_id}/${season_number}/${episode_number}`,
    },
    {
      title: "VidFast",
      link: `https://vidfast.vc/tv/${series_id}/${season_number}/${episode_number}`,
    },
    {
      title: "Videasy",
      link: `https://player.videasy.ws/embed/tv/${series_id}/${season_number}/${episode_number}`,
    },
    {
      title: "2Embed",
      link: `https://www.2embed.stream/embed/tv/${series_id}/${season_number}/${episode_number}`,
    },
    {
      title: "EmbedAPI",
      link: `https://player.embed-api.stream/?id=${series_id}&s=${season_number}&e=${episode_number}`,
    },
    {
      title: "VixSrc",
      link: `https://vixsrc.to/tv/${series_id}/${season_number}/${episode_number}`,
    },
  ];

  const currentEpNum = parseInt(episode_number, 10);
  const totalEpsInSeason = seasonEpisodeCounts?.[parseInt(season_number, 10)] ?? 999;
  const hasNextEpisode = currentEpNum < totalEpsInSeason;

  return (
    <main className="min-h-screen pb-24 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-24 pb-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/web-series/${series_id}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#94A3B8] hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to {seriesData?.name || "Series"}</span>
          </Link>

          {hasNextEpisode && (
            <Link
              href={`/web-series/watch/${season_number}/${currentEpNum + 1}/${series_id}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <span>Next: Episode {currentEpNum + 1}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Video Player Theater */}
        <div className="bg-[#12151F] border border-white/[0.08] rounded-xl p-4 md:p-6 shadow-2xl relative">
          <EmbedSourcePlayer
            sources={seriesLinksArray}
            playerTitle="Series Player"
            headerExtra={
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-[#00A8E1]/20 border border-[#00A8E1]/40 text-white px-3 py-1 rounded-md uppercase tracking-wider">
                  Season {season_number} • Episode {episode_number}
                </span>
              </div>
            }
          />
        </div>

        {/* Status Tracker & Download Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#12151F] border border-white/[0.08] rounded-xl overflow-hidden">
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
          </div>

          {/* Download Card */}
          <div className="bg-[#12151F] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" /> Offline Access
              </span>
              <h4 className="font-bold text-sm text-white">Download Episode</h4>
              <p className="text-xs text-[#94A3B8]">
                Save Episode {episode_number} in high definition for offline streaming.
              </p>
            </div>
            <Link
              href={`https://vidvault.to/tv/${series_id}/${season_number}/${episode_number}`}
              target="_blank"
              className="w-full"
            >
              <Button className="w-full font-bold text-xs uppercase tracking-wider h-10 bg-white/10 hover:bg-white/20 text-white border border-white/15 gap-2 rounded-lg cursor-pointer">
                <Download className="h-3.5 w-3.5" />
                Download S{season_number} E{episode_number}
              </Button>
            </Link>
          </div>
        </div>

        {/* Episode Info Spotlight */}
        {epData && (
          <section className="bg-[#12151F] border border-white/[0.08] rounded-xl p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="relative md:w-72 aspect-video shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black">
                <Image
                  src={
                    epData.still_path
                      ? `https://image.tmdb.org/t/p/original${epData.still_path}`
                      : "/placeholder.svg"
                  }
                  fill
                  alt="Episode Poster"
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2">
                  <span className="bg-black/80 backdrop-blur-md text-[10px] font-bold text-white px-2 py-0.5 rounded">
                    EPISODE {episode_number}
                  </span>
                </div>
              </div>

              {/* Text Meta */}
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#F59E0B]">
                    <Star className="h-4 w-4 fill-[#F59E0B]" />
                    <span className="text-sm font-bold">
                      {epData.vote_average?.toFixed(1) || "N/A"}
                    </span>
                    <span className="text-xs text-[#94A3B8] font-normal">/ 10</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight">
                    {epData.name || `Episode ${episode_number}`}
                  </h2>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {epData.overview || "No overview available for this episode."}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-1 rounded border border-white/10">
                    Season {season_number}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-1 rounded border border-white/10">
                    TMDB ID: {series_id}
                  </span>
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
