import api from "./api";

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

  createBooking: async function (email: string, showId: string, bookedSeats: string[]) {
    const res = await api.post(
      `/bookings`,
      {
        email: email,
        showId: showId,
        bookedSeats: bookedSeats,
      },
    );
    return res.data;
  }
};

export default UserApis;
