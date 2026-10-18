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
      <div className="py-12 text-center text-sm text-[#94A3B8]">
        No matching movies or series found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
      <div>
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-2 mb-3">
          <span className="w-1 h-3.5 bg-primary rounded-full" />
          Movies
        </h3>
        <MoviesSearch data={moviesData} />
      </div>
      <div>
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#00A8E1] flex items-center gap-2 mb-3">
          <span className="w-1 h-3.5 bg-[#00A8E1] rounded-full" />
          TV Series
        </h3>
        <SeriesSearchFormatter data={tvData} />
      </div>
    </div>
  );
};

export default CombinedSearch;
