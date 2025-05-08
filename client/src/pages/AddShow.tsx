import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminApis, { IShowData } from "../services/theatreAdmin.api";
import axios from "axios";

interface IMovie {
  movieId: string;
  title: string;
  img: string;
  languages: string[];
  formats: string[];
}

const AddShow: React.FC = () => {
  const navigate = useNavigate();
  const { city, venueId, venueName } = useLocation().state || {};
  const [form, setForm] = useState<IShowData>({
    movieId: "",
    movieTitle: "",
    startTime: "",
    endTime: "",
    language: "",
    format: "",
  });
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof IShowData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { movies } = await AdminApis.getMoviesByCity(city);
        setMovies(movies);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          alert(err.response.data.message);
        } else {
          alert("Unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [city]);

  useEffect(() => {
    if (selectedMovie) {
      setForm((prev) => ({
        ...prev,
        movieId: selectedMovie.movieId,
        language: "",
        format: "",
      }));
    }
  }, [selectedMovie]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof IShowData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (name === "movieTitle") {
      setSelectedMovie(movies.find((m) => m.title === value) || null);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof IShowData, string>> = {};
    if (!form.movieTitle) newErrors.movieTitle = "Movie is required";
    if (!form.language) newErrors.language = "Language is required";
    if (!form.format) newErrors.format = "Format is required";
    if (!form.startTime) newErrors.startTime = "Start time is required";
    if (!form.endTime) newErrors.endTime = "End time is required";
    if (
      form.startTime &&
      form.endTime &&
      new Date(form.endTime) <= new Date(form.startTime)
    ) {
      newErrors.endTime = "End time must be after start time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await AdminApis.addShow(form, venueId);
      alert("Show added successfully!");
      navigate(`/admin/dashboard/${venueId}/shows`, {
        state: { venueName, city },
        replace: true,
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message);
      } else {
        alert("Unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 container mt-4">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">Add Show in {venueName}</h3>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2">Loading movies...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {selectedMovie && (
                  <div className="text-center mb-4">
                    <img
                      src={selectedMovie.img || "/placeholder-movie.jpg"}
                      alt={selectedMovie.title}
                      className="img-fluid rounded mb-2"
                      style={{ maxHeight: "200px" }}
                    />
                    <h4>{selectedMovie.title}</h4>
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="movieTitle" className="form-label">
                    Movie
                  </label>
                  <select
                    id="movieTitle"
                    name="movieTitle"
                    value={form.movieTitle}
                    onChange={handleChange}
                    className={`form-select ${
                      errors.movieTitle ? "is-invalid" : ""
                    }`}
                  >
                    <option value="">Select a movie</option>
                    {movies.map((movie) => (
                      <option key={movie.movieId} value={movie.title}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                  {errors.movieTitle && (
                    <div className="invalid-feedback">{errors.movieTitle}</div>
                  )}
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="language" className="form-label">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={form.language}
                      onChange={handleChange}
                      className={`form-select ${
                        errors.language ? "is-invalid" : ""
                      }`}
                      disabled={!selectedMovie}
                    >
                      <option value="">Select language</option>
                      {selectedMovie?.languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                    {errors.language && (
                      <div className="invalid-feedback">{errors.language}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="format" className="form-label">
                      Format
                    </label>
                    <select
                      id="format"
                      name="format"
                      value={form.format}
                      onChange={handleChange}
                      className={`form-select ${
                        errors.format ? "is-invalid" : ""
                      }`}
                      disabled={!selectedMovie}
                    >
                      <option value="">Select format</option>
                      {selectedMovie?.formats.map((fmt) => (
                        <option key={fmt} value={fmt}>
                          {fmt}
                        </option>
                      ))}
                    </select>
                    {errors.format && (
                      <div className="invalid-feedback">{errors.format}</div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="startTime" className="form-label">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.startTime ? "is-invalid" : ""
                      }`}
                    />
                    {errors.startTime && (
                      <div className="invalid-feedback">{errors.startTime}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="endTime" className="form-label">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      id="endTime"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.endTime ? "is-invalid" : ""
                      }`}
                    />
                    {errors.endTime && (
                      <div className="invalid-feedback">{errors.endTime}</div>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Saving...
                      </>
                    ) : (
                      "Add Show"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">
          © {new Date().getFullYear()} Theatre Admin. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AddShow;
