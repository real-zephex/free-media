import { MoviesDiscover } from "@/utils/movie-requests/request";
import { MovieCard, MovieCardSkeleton } from "./movie-card";

const MoviesGridConstructor = async ({ type }: { type: string }) => {
  const data = await MoviesDiscover(type);

  if (!data?.results || data.results.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {[...Array(12)].map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
      {data.results.map((item, index) => (
        <MovieCard key={item.id} movie={item} index={index} />
      ))}
    </div>
  );
};

export default MoviesGridConstructor;
