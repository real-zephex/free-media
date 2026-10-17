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
      title: data.title,
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

  return (
    <main className="min-h-screen pb-20">
      {/* Hero Banner with Glassmorphism */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 z-0 scale-110 blur-[2px] opacity-40"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${data.backdrop_path || data.poster_path})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />

        <div className="container mx-auto h-full flex flex-col justify-end px-4 pb-12 relative z-20">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
            <div className="relative w-48 md:w-64 aspect-[2/3] shrink-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-background transform -rotate-2 md:rotate-0">
              <Image
                src={
                  data.poster_path
                    ? `https://image.tmdb.org/t/p/original${data.poster_path}`
                    : "/placeholder.svg"
                }
                fill
                alt={`${data.title} poster`}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/30 text-primary bg-primary/5 px-3">
                  FEATURE FILM
                </Badge>
                <h1 className="text-4xl md:text-7xl font-display font-bold tracking-tighter leading-none uppercase italic">
                  {data.title} {data.title !== data.original_title && <span className="text-xl md:text-3xl text-muted-foreground ml-2">({data.original_title})</span>}
                </h1>
              </div>
              {data.tagline && (
                <p className="text-xl md:text-2xl font-medium text-muted-foreground/80 italic border-l-4 border-primary/40 pl-4">
                  {data.tagline.replace(/"/g, '&quot;')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 space-y-12">
        {/* Video Player Section */}
        <section className="bg-muted/10 border border-border/50 rounded-3xl p-4 md:p-8 backdrop-blur-sm shadow-xl">
          <MoviePlayer id={id} movieData={data} />
        </section>

        {/* Detailed Info Tabs */}
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
