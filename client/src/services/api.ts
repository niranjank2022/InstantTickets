import axios from "axios";

export const BASE_URL = "http://localhost:3000";
const api = axios.create({
  baseURL: BASE_URL + "/apis",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
