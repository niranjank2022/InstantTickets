import { api } from "./api";

export enum Roles {
  User = "USER",
  MovieAdmin = "MOVIE_ADMIN",
  TheatreAdmin = "THEATRE_ADMIN",
}

const AuthApis = {
  signin: async function (email: string, password: string, role: Roles) {
    const res = await api.post("/auth/signin", {
      email: email,
      password: password,
      role: role,
    });

    return res.data;
  },

  signup: async function (email: string, password: string, role: Roles) {
    const res = await api.post("/auth/signup", {
      email: email,
      password: password,
      role: role,
    });

    return res.data;
  },

  logout: async function () {
    await api.post("/auth/logout", {}, { withCredentials: true });
  },
};

export default AuthApis;
