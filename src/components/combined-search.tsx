import MoviesSearch from "./movies-ui/movie-search-formatter";
import SeriesSearchFormatter from "./web-ui/search-cards";
import type { MoviesHomepageResults, TVSearch } from "@/utils/types";

const CombinedSearch = ({
  moviesData,
  tvData,
}: {
  moviesData: MoviesHomepageResults | undefined;
  tvData: TVSearch;
}) => {
  const hasMovies = moviesData?.results && moviesData.results.length > 0;
  const hasSeries = tvData?.results && tvData.results.length > 0;

  if (!hasMovies && !hasSeries) {
    return (
      <p className="py-10 text-center text-muted-foreground">
        No results found
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div>
        <h3 className="font-display font-bold text-lg mb-3 text-primary/80 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          Movies
        </h3>
        <MoviesSearch data={moviesData} />
      </div>
      <div>
        <h3 className="font-display font-bold text-lg mb-3 text-primary/80 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          Web Series
        </h3>
        <SeriesSearchFormatter data={tvData} />
      </div>
    </div>
  );
};

export default CombinedSearch;
