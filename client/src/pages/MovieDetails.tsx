import { useLocation, useNavigate } from "react-router-dom";
import { Bubble } from "../components/ui/Bubble";

export default function MovieDetails() {
  const navigate = useNavigate();
  const { movie, city } = useLocation().state;
  if (!movie) {
    return (
      <div className="container text-center mt-5">
        <h3>Movie data not found!</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="row">
        <div className="col-md-4 text-center">
          <img
            src={movie.img}
            alt={movie.title}
            className="img-fluid rounded shadow-sm"
            style={{ height: "400px", width: "270px", objectFit: "contain" }}
          />
        </div>

        <div className="col-md-8">
          <h2 className="fw-bold mb-3">{movie.title}</h2>

          <p>
            <strong>Rating:</strong>{" "}
            {movie.rating !== 0 ? movie.rating : "Not Rated Yet"}
          </p>
          <p>
            <strong>Language:</strong>{" "}
            {movie.languages.map((lang: string) => (
              <Bubble key={lang} text={lang} variant="success" />
            ))}
          </p>
          <p>
            <strong>Format:</strong>{" "}
            {movie.formats.map((fmt: string) => (
              <Bubble key={fmt} text={fmt} variant="info" />
            ))}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {movie.genres.map((g: string) => (
              <Bubble key={g} text={g} />
            ))}
          </p>
          {/* <p>
            <strong>Duration:</strong> {movie.duration} minutes
          </p> */}
          <p>
            <strong>Description:</strong>{" "}
            {movie.description || "No description available."}
          </p>
          <button
            className="btn btn-primary mt-4 px-4 py-2"
            onClick={() =>
              navigate(
                `/explore/${city.toLowerCase()}/${movie.title.toLowerCase()}/${movie.movieId}/shows`,
                {
                  state: movie,
                }
              )
            }
          >
            🎟️ Book Ticket Now
          </button>
        </div>
      </div>
    </div>
  );
}
