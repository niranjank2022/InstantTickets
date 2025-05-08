import axios from "axios";

export const BASE_URL = "https://instanttickets-server.onrender.com";
const api = axios.create({
  baseURL: BASE_URL + "/apis",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
