import MoviePlayer from "@/components/movies-ui/movie-players";
import {
  MovieInfo,
  MovieCredits,
  MovieRecommendations,
} from "@/utils/movie-requests/request";
import MoreMovieInfo from "@/components/movies-ui/movie-info-tabs";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import { Star, Clock, Calendar, Film } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const { id } = await params;
    const data = await MovieInfo(id);

    if (!data) {
      return {
        title: "Movie Not Found",
        description: "The requested movie could not be found.",
      };
    }

    return {
      title: `${data.title} - Dramaflix`,
      description: data.overview || `Watch ${data.title} on Dramaflix`,
      openGraph: {
        title: data.title,
        description: data.overview || `Watch ${data.title} on Dramaflix`,
        images: [
          {
            url: tmdbImageUrl(data.backdrop_path || data.poster_path),
            width: 800,
            height: 600,
            alt: `${data.title} poster`,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: "Error",
      description: "Failed to load movie information",
    };
  }
}

const MovieInfoPage = async ({ params }: Props) => {
  const { id } = await params;

  const data = await MovieInfo(id);
  const recommendations = await MovieRecommendations(id);
  const movieCast = await MovieCredits({ id, type: "credits" });
  const imagesData = await MovieCredits({ id, type: "images" });

  if (!data) notFound();

  const backdropUrl = data.backdrop_path || data.poster_path;
  const year = data.release_date?.split("-")[0];

  return (
    <main className="min-h-screen pb-24 bg-background text-foreground">
      {/* 1. Immersive Hero Backdrop Header */}
      <section className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden flex items-end">
        {backdropUrl && (
          <Image
            src={`https://image.tmdb.org/t/p/original${backdropUrl}`}
            alt={data.title}
            fill
            priority
            className="object-cover object-center brightness-70 scale-105 transition-all duration-1000"
          />
        )}
        {/* Streaming Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-[#090A10]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090A10] via-[#090A10]/70 to-transparent z-10 w-full md:w-3/4" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#090A10]/80 to-transparent z-10" />

        {/* Billboard Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pb-12 relative z-20 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 text-center md:text-left">
            {/* Poster Thumbnail */}
            <div className="relative w-36 sm:w-44 md:w-52 aspect-[2/3] shrink-0 rounded-lg overflow-hidden shadow-2xl border border-white/20 bg-[#12151F]">
              <Image
                src={
                  data.poster_path
                    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                    : "/placeholder.svg"
                }
                fill
                priority
                alt={`${data.title} poster`}
                className="object-cover"
              />
            </div>

            {/* Info details */}
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-md text-white text-xs font-bold uppercase tracking-wider">
                <Film className="h-3.5 w-3.5 text-primary" />
                FEATURE FILM
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white leading-none">
                {data.title}
                {data.original_title && data.original_title !== data.title && (
                  <span className="text-xl md:text-2xl text-[#94A3B8] font-normal ml-3 block sm:inline">
                    ({data.original_title})
                  </span>
                )}
              </h1>

              {data.tagline && (
                <p className="text-base sm:text-lg text-slate-300 italic font-medium">
                  &ldquo;{data.tagline}&rdquo;
                </p>
              )}

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs sm:text-sm font-semibold text-[#94A3B8]">
                {data.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-[#F59E0B] font-bold bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20">
                    <Star className="h-3.5 w-3.5 fill-[#F59E0B]" />
                    {data.vote_average.toFixed(1)}
                  </span>
                )}
                {year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {year}
                  </span>
                )}
                {data.runtime > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
                  </span>
                )}
                <Badge variant="outline" className="text-[10px] font-bold border-white/20 text-white px-1.5 py-0">
                  4K ULTRA HD
                </Badge>
              </div>

              {/* Genre Chips */}
              {data.genres && data.genres.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
                  {data.genres.map((g) => (
                    <span
                      key={g.id}
                      className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded border border-white/10"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Video Player & Cinema Theater */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 mt-8 space-y-12">
        <section className="bg-[#12151F] border border-white/[0.08] rounded-xl p-4 md:p-6 shadow-2xl relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-transparent to-primary/10 rounded-xl blur-sm -z-10" />
          <MoviePlayer id={id} movieData={data} />
        </section>

        {/* 3. Detailed Information & Tabs */}
        <section>
          <MoreMovieInfo
            data={data}
            recommendation_data={recommendations}
            cast_data={movieCast}
            images_data={imagesData}
          />
        </section>
      </div>
    </main>
  );
};

export default MovieInfoPage;
