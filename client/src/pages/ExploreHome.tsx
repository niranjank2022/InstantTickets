import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import UserApis, { IMovie } from "../services/user.api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ExploreHome() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Error: CityDropdown must be used within a UserProvider!");
  }

  const navigate = useNavigate();
  const { city } = userContext;
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        const res = await UserApis.getMoviesByCity(city);
        setMovies(res.movies);
      } catch (error) {
        if (axios.isAxiosError(error)) alert(error.response?.data.message);
        else alert("Failed to fetch movies");
      }
    })();
  }, [city]);

  const renderMovieCard = (movie: IMovie) => (
    <div className="col-md-4 text-center mb-4" key={movie.movieId}>
      <img
        src={movie.img}
        alt={movie.title}
        className="img-fluid rounded shadow-sm"
        style={{
          height: "350px",
          width: "210px",
          objectFit: "contain",
        }}
        onClick={() =>
          navigate(
            `/${city.toLowerCase()}/movies/${movie.title.toLowerCase()}/${
              movie.movieId
            }`,
            { state: { movie, city } }
          )
        }
      />
      <h5 className="mt-2">{movie.title}</h5>
      <p className="text-muted">
        {movie.rating !== 0 ? movie.rating : "Rate Now"}
      </p>
    </div>
  );

  return (
    <div className="container-fluid">
      <section
        style={{
          height: "70vh",
          backgroundImage: 'url("./cover.gif")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></section>

      <div className="container p-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="fs-2 fw-bold">
            {showAll ? `Movies in ${city}` : "Movie Highlights"}
          </span>
          {movies.length > 0 && (
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Back to Highlights" : "See All"}
            </span>
          )}
        </div>

        {showAll ? (
          <div className="row">{movies.map(renderMovieCard)}</div>
        ) : (
          <div
            id="movieCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {movies.length === 0 && (
                <div className="carousel-item active text-center">
                  <p>No movies available.</p>
                </div>
              )}

              {movies
                .reduce((acc: React.JSX.Element[][], movie, index) => {
                  if (index % 3 === 0) acc.push([]);
                  acc[acc.length - 1].push(renderMovieCard(movie));
                  return acc;
                }, [])
                .map((slide, index) => (
                  <div
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                    key={index}
                  >
                    <div className="row justify-content-center">{slide}</div>
                  </div>
                ))}
            </div>

            {movies.length > 3 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#movieCarousel"
                  data-bs-slide="prev"
                >
                  <span aria-hidden="true">
                    <i
                      className="fas fa-chevron-left fs-1"
                      style={{ color: "#5d2fb1" }}
                    ></i>
                  </span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#movieCarousel"
                  data-bs-slide="next"
                >
                  <span aria-hidden="true">
                    <i
                      className="fas fa-chevron-right fs-1"
                      style={{ color: "#5d2fb1" }}
                    ></i>
                  </span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
