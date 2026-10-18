import { TrendingPopularTopAiringTV } from "@/utils/types";
import { SeriesCard, SeriesCardSkeleton } from "./series-card";

const WebHomepageCards = async ({
  data,
}: {
  data: TrendingPopularTopAiringTV;
}) => {
  if (!data?.results || data.results.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {[...Array(8)].map((_, i) => (
          <SeriesCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
      {data.results.slice(0, 18).map((item, index) => (
        <SeriesCard key={item.id} series={item} index={index} />
      ))}
    </div>
  );
};

export default WebHomepageCards;
