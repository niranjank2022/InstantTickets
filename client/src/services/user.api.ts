import { io, Socket } from "socket.io-client";
import api, { BASE_URL } from "./api";

export interface IMovie {
  movieId: string;
  title: string;
  rating: number;
  img: string;
  languages: string[];
  formats: string[];
  genres: string[];
}

export interface IShow {
  showId: string;
  venueId: string;
  startTime: Date | string;
  endTime: Date | string;
  language: string;
  format: string;
}

const UserApis = {
  getMoviesByCity: async function (city: string) {
    const res = await api.get(`movies/city/${city}`, { withCredentials: true });
    return res.data;
  },

  getShowsByMovieIdAndCity: async function (movieId: string, city: string) {
    const res = await api.get(`/shows/movie/${movieId}/${city}`, {
      withCredentials: true,
    });
    return res.data;
  },

  initializeSocket: function () {
    const socket = io(BASE_URL);
    return socket;
  },
};

export default UserApis;
