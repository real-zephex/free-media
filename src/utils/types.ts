export interface MoviesHomepageResults {
  page: number;
  results: movieresults[];
}

interface movieresults {
  adult: boolean;
  backdrop_path?: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: string;
  poster_path?: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieInfoType {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: null | Collection;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// TV Shows
export interface TrendingPopularTopAiringTV {
  page?: number;
  results?: TVResults[];
  total_pages?: number;
  total_results?: number;
}

interface TVResults {
  backdrop_path?: string;
  id?: number;
  name?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string;
  media_type?: MediaType;
  adult?: boolean;
  original_language?: string;
  genre_ids?: number[];
  popularity?: number;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  origin_country?: string[];
}

enum MediaType {
  Tv = "tv",
}

export interface TVInfo {
  adult?: boolean;
  backdrop_path?: string;
  created_by?: any[];
  episode_run_time?: number[];
  first_air_date?: string;
  genres?: TVGenre[];
  homepage?: string;
  id?: number;
  in_production?: boolean;
  languages?: string[];
  last_air_date?: string;
  last_episode_to_air?: LastEpisodeToAir;
  name?: string;
  next_episode_to_air?: null;
  networks?: TVNetwork[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  origin_country?: string[];
  original_language?: string;
  original_name?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  production_companies?: TVNetwork[];
  production_countries?: TVProductionCountry[];
  seasons?: Season[];
  spoken_languages?: TVSpokenLanguage[];
  status?: string;
  tagline?: string;
  type?: string;
  vote_average?: number;
  vote_count?: number;
}

interface TVGenre {
  id?: number;
  name?: string;
}

interface LastEpisodeToAir {
  id?: number;
  name?: string;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  air_date?: string;
  episode_number?: number;
  episode_type?: string;
  production_code?: string;
  runtime?: number;
  season_number?: number;
  show_id?: number;
  still_path?: string;
}

interface TVNetwork {
  id?: number;
  logo_path?: string;
  name?: string;
  origin_country?: string;
}

interface TVProductionCountry {
  iso_3166_1?: string;
  name?: string;
}

interface Season {
  air_date?: string;
  episode_count?: number;
  id?: number;
  name?: string;
  overview?: string;
  poster_path?: string;
  season_number?: number;
  vote_average?: number;
}

interface TVSpokenLanguage {
  english_name?: string;
  iso_639_1?: string;
  name?: string;
}

export interface TVCredits {
  cast?: TVCast[];
  crew?: TVCast[];
  id?: number;
}

interface TVCast {
  adult?: boolean;
  gender?: number;
  id?: number;
  known_for_department?: Department;
  name?: string;
  original_name?: string;
  popularity?: number;
  profile_path?: null | string;
  character?: string;
  credit_id?: string;
  order?: number;
  department?: Department;
  job?: string;
}

enum Department {
  Acting = "Acting",
  Crew = "Crew",
  Directing = "Directing",
  Production = "Production",
  Sound = "Sound",
  Writing = "Writing",
}

export interface TVSearch {
  page?: number;
  results?: TVResults[];
  total_pages?: number;
  total_results?: number;
}

export interface TVImages {
  backdrops?: Backdrop[];
  id?: number;
  logos?: Backdrop[];
  posters?: Backdrop[];
}

interface Backdrop {
  aspect_ratio?: number;
  height?: number;
  iso_639_1?: null | string;
  file_path?: string;
  vote_average?: number;
  vote_count?: number;
  width?: number;
}

export interface TVSeasonInfo {
  _id?: string;
  air_date?: string;
  episodes?: TVEpisode[];
  name?: string;
  overview?: string;
  id?: number;
  poster_path?: string;
  season_number?: number;
  vote_average?: number;
}

interface TVEpisode {
  air_date?: string;
  episode_number?: number;
  episode_type?: string;
  id?: number;
  name?: string;
  overview?: string;
  production_code?: string;
  runtime?: number;
  season_number?: number;
  show_id?: number;
  still_path?: string;
  vote_average?: number;
  vote_count?: number;
  crew?: TVCrew[];
  guest_stars?: TVCrew[];
}

interface TVCrew {
  job?: string;
  department?: TVDepartment;
  credit_id?: string;
  adult?: boolean;
  gender?: number;
  id?: number;
  known_for_department?: TVDepartment;
  name?: string;
  original_name?: string;
  popularity?: number;
  profile_path?: null | string;
  character?: string;
  order?: number;
}

enum TVDepartment {
  Acting = "Acting",
  Camera = "Camera",
  Crew = "Crew",
  Directing = "Directing",
  Editing = "Editing",
  Production = "Production",
  Writing = "Writing",
}

export interface TVEpisodeInfo {
  air_date?: string;
  crew?: any[];
  episode_number?: number;
  guest_stars?: TVGuestStar[];
  name?: string;
  overview?: string;
  id?: number;
  production_code?: string;
  runtime?: number;
  season_number?: number;
  still_path?: string;
  vote_average?: number;
  vote_count?: number;
}

interface TVGuestStar {
  character?: string;
  credit_id?: string;
  order?: number;
  adult?: boolean;
  gender?: number;
  id?: number;
  known_for_department?: string;
  name?: string;
  original_name?: string;
  popularity?: number;
  profile_path?: string;
}
