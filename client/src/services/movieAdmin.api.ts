import { api } from "./api";

export interface IMovie {
  movieId: string;
  title: string;
  rating: number;
  img: string;
  languages: string[];
  formats: string[];
  genres: string[];
  cities: string[];
}

const MovieAdminApis = {
  createMovie: async function (movieFields: Partial<IMovie>) {
    const { title, img, languages, formats, genres, cities } = movieFields;
    const res = await api.post(
      "/movies",
      {
        title: title,
        img: img,
        languages: languages,
        formats: formats,
        genres: genres,
        cities: cities,
      },
      { withCredentials: true }
    );

    return res.data;
  },

  getMovies: async function () {
    const res = await api.get(`/movies/all`, { withCredentials: true });
    return res.data;
  },

  updateMovie: async function (movie: IMovie) {
    const { movieId, title, img, languages, formats, genres, cities } = movie;
    const res = await api.put(
      `/movies/${movieId}`,
      {
        title: title,
        img: img,
        languages: languages,
        formats: formats,
        genres: genres,
        cities: cities,
      },
      { withCredentials: true }
    );
    return res.data;
  },
};

export default MovieAdminApis;
