import axios from "axios";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import MovieAdminApis, { IMovie } from "../services/movieAdmin.api";
import { Bubble } from "../components/ui/Bubble";
import {
  ALL_CITIES,
  ALL_FORMATS,
  ALL_GENRES,
  ALL_LANGUAGES,
} from "../config/config";

type MovieArrayFields = "languages" | "formats" | "genres" | "cities";

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMovie, setModalMovie] = useState<IMovie | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { movies } = await MovieAdminApis.getMovies();
        setMovies(movies);
      } catch (err) {
        if (axios.isAxiosError(err)) alert(err.response?.data.message);
        else alert("Failed to save movie");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modalMovie?.title) return;

    try {
      if (isAdding) {
        const { movieId } = await MovieAdminApis.createMovie(modalMovie);
        setMovies([...movies, { ...modalMovie, movieId, rating: 0 }]);
      } else {
        await MovieAdminApis.updateMovie(modalMovie);
        setMovies(
          movies.map((m) => (m.movieId === modalMovie.movieId ? modalMovie : m))
        );
      }
      closeModal();
    } catch (err) {
      if (axios.isAxiosError(err)) alert(err.response?.data.message);
      else alert("Failed to save movie");
    }
  };

  const closeModal = () => {
    setModalMovie(null);
    setIsAdding(false);
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: MovieArrayFields
  ) => {
    const { value, checked } = e.target;
    setModalMovie((prev) => {
      if (!prev) return prev;

      const currentValues = prev[field];
      const updatedValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);

      return { ...prev, [field]: updatedValues };
    });
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Movies</h2>
        <button
          className="btn btn-success"
          onClick={() => {
            setModalMovie({
              movieId: "",
              title: "",
              rating: 0,
              img: "",
              languages: [],
              formats: [],
              genres: [],
              cities: [],
            });
            setIsAdding(true);
          }}
        >
          + Add Movie
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
        </div>
      ) : movies.length === 0 ? (
        <p className="text-center">No movies found. Add some!</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Rating</th>
                <th>Languages</th>
                <th>Formats</th>
                <th>Genres</th>
                <th>Cities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.movieId}>
                  <td>
                    <div
                      className="d-flex align-items-center text-nowrap"
                      style={{ gap: "10px" }}
                    >
                      {movie.img && (
                        <img
                          src={movie.img}
                          alt={movie.title}
                          style={{
                            width: "150px",
                            height: "auto",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <span>{movie.title}</span>
                    </div>
                  </td>

                  <td>{movie.rating.toFixed(1)}</td>
                  <td>
                    {movie.languages.map((lang) => (
                      <Bubble key={lang} text={lang} variant="success" />
                    ))}
                  </td>
                  <td>
                    {movie.formats.map((fmt) => (
                      <Bubble key={fmt} text={fmt} variant="info" />
                    ))}
                  </td>
                  <td>
                    {movie.genres.map((g) => (
                      <Bubble key={g} text={g} />
                    ))}
                  </td>
                  <td>
                    {movie.cities.length > 0
                      ? movie.cities.map((c) => (
                          <Bubble key={c} text={c} variant="secondary" />
                        ))
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setModalMovie({ ...movie })}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalMovie && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5>{isAdding ? "Add Movie" : `Edit ${modalMovie.title}`}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  />
                </div>
                <div className="modal-body">
                  {isAdding && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={modalMovie.title}
                          onChange={(e) =>
                            setModalMovie({
                              ...modalMovie,
                              title: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Image URL</label>
                        <input
                          type="text"
                          className="form-control"
                          value={modalMovie.img}
                          onChange={(e) =>
                            setModalMovie({
                              ...modalMovie,
                              img: e.target.value,
                            })
                          }
                        />
                        {modalMovie.img && (
                          <img
                            src={modalMovie.img}
                            alt="Preview"
                            className="mt-2"
                            style={{ maxWidth: "100%", maxHeight: "150px" }}
                          />
                        )}
                      </div>
                    </>
                  )}

                  {[
                    {
                      label: "Languages",
                      options: ALL_LANGUAGES,
                      key: "languages",
                    },
                    { label: "Formats", options: ALL_FORMATS, key: "formats" },
                    { label: "Genres", options: ALL_GENRES, key: "genres" },
                    { label: "Cities", options: ALL_CITIES, key: "cities" },
                  ].map(({ label, options, key }) => {
                    const typedKey = key as MovieArrayFields;

                    return (
                      <div className="mb-3" key={key}>
                        <label className="form-label fw-bold">{label}</label>
                        <div>
                          {options.map((option) => (
                            <div
                              className="form-check form-check-inline"
                              key={option}
                            >
                              <input
                                type="checkbox"
                                className="form-check-input"
                                value={option}
                                checked={
                                  modalMovie[typedKey]?.includes(option) ||
                                  false
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(e, typedKey)
                                }
                              />
                              <label className="form-check-label">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    {isAdding ? "Add" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList;
