import React, { createContext, ReactNode, useState } from "react";

interface IMovieContext {
  languages: string[];
  setLanguages: React.Dispatch<React.SetStateAction<string[]>>;
  genres: string[];
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
  formats: string[];
  setFormats: React.Dispatch<React.SetStateAction<string[]>>;
}

const MovieContext = createContext<IMovieContext | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
  const [languages, setLanguages] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);

  return (
    <MovieContext.Provider
      value={{
        languages,
        genres,
        formats,
        setLanguages,
        setGenres,
        setFormats,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export default MovieContext;
