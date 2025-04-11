import { api } from "./api";

export interface ISection {
  name: string;
  rows: number;
  columns: number;
  x: number;
  y: number;
  price: number;
  color: string;
}

export interface IVenueFields {
  name: string;
  city: string;
  rows: number;
  columns: number;
  sections: ISection[];
}

export interface IShowData {
  movieId: string;
  movieTitle: string;
  startTime: string;
  endTime: string;
  language: string;
  format: string;
}

const AdminApis = {
  addVenue: async function (venueFields: IVenueFields) {
    const { name, city, rows, columns, sections } = venueFields;
    const res = await api.post(
      "/venues",
      {
        name: name,
        city: city,
        rows: rows,
        columns: columns,
        sections: sections,
      },
      { withCredentials: true }
    );

    return res;
  },

  getVenues: async function () {
    const res = await api.get(`/venues/all`, { withCredentials: true });
    return res.data;
  },

  getShows: async function (venueId: string) {
    const res = await api.get(`/shows/venue/${venueId}`, {
      withCredentials: true,
    });
    return res.data;
  },

  addShow: async function (show: IShowData, venueId: string) {
    const { movieId, movieTitle, language, format, startTime, endTime } = show;
    const res = await api.post("/shows", {
      movieId: movieId,
      venueId: venueId,
      movieTitle: movieTitle,
      format: format,
      language: language,
      startTime: startTime,
      endTime: endTime,
    });
    return res.data;
  },

  getMoviesByCity: async function (city: string) {
    const res = await api.get(`movies/city/${city}`, { withCredentials: true });
    return res.data;
  },

  getSeatMap: async function (showId: string) {
    const res = await api.get(`shows/${showId}/seat-map`);
    return res.data;
  },
};

export default AdminApis;
