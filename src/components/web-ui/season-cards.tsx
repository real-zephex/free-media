import { SeasonInfo } from "@/utils/tv-requests/request";
import SeasonEpisodeGrid from "./episode-card-grid";

const TVSeriesSeasonCardGen = async ({
  id,
  seasonNumber,
}: {
  id: number;
  seasonNumber: number;
}) => {
  const data = await SeasonInfo({ id, season: seasonNumber });

  return (
    <SeasonEpisodeGrid
      episodes={data?.episodes}
      seriesId={id}
      seasonNumber={seasonNumber}
    />
  );
};

export default TVSeriesSeasonCardGen;
