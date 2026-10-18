import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { TVSearch } from "@/utils/types";

const SeriesSearchFormatter = ({ data }: { data: TVSearch | null }) => {
  return (
    <div className="flex flex-col gap-2">
      {data?.results && data.results.length > 0 ? (
        data.results.map((item) => (
          <Link href={`/web-series/${item.id}`} key={item.id} className="group">
            <span className="sr-only">View {item.name}</span>
            <div className="flex flex-row items-center bg-[#12151F] border border-white/[0.08] rounded-lg p-2 transition-all duration-200 group-hover:bg-[#181C28] group-hover:border-white/20 overflow-hidden">
              <div className="relative h-16 w-12 shrink-0 rounded overflow-hidden bg-black">
                <Image
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
                      : "/placeholder.svg"
                  }
                  fill
                  alt={`${item.name} poster`}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col ml-3 pr-2 py-0.5 gap-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#00A8E1] transition-colors">
                  {item.name}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-[#94A3B8]">
                  {item.first_air_date && (
                    <span>{new Date(item.first_air_date).getFullYear()}</span>
                  )}
                  {typeof item.vote_average === "number" && item.vote_average > 0 && (
                    <span className="flex items-center gap-0.5 text-[#F59E0B] font-semibold">
                      <Star className="h-2.5 w-2.5 fill-[#F59E0B]" />
                      {item.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p className="py-4 text-center text-xs text-[#94A3B8]">No series found</p>
      )}
    </div>
  );
};

export default SeriesSearchFormatter;
