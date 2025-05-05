import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import UserApis, { IMovie, IShow } from "../services/user.api";
import axios from "axios";

interface ShowsByVenue {
  [venueId: string]: IShow[];
}

const ExploreShows: React.FC = () => {
  const movie = useLocation().state as IMovie | undefined;
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Error: ExploreShows must be used within a UserProvider!");
  }
  const { city } = userContext;

  // State for shows, loading, and filters
  const [showsByVenue, setShowsByVenue] = useState<ShowsByVenue>({});
  const [filteredShows, setFilteredShows] = useState<ShowsByVenue>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [languageFilter, setLanguageFilter] = useState<string>("");
  const [timeSlotFilter, setTimeSlotFilter] = useState<string>("");

  const navigate = useNavigate();

  // Fetch shows
  useEffect(() => {
    const fetchShows = async () => {
      if (!movie?.movieId || !city) {
        alert("Missing movie ID or city");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res: ShowsByVenue = await UserApis.getShowsByMovieIdAndCity(
          movie.movieId,
          city
        );
        const data = res.shows;
        console.log("API response:", data);

        // Parse dates
        const parsedData = Object.keys(data).reduce((acc, venue: string) => {
          acc[venue] = data[venue].map((show) => ({
            ...show,
            startTime: new Date(show.startTime),
            endTime: new Date(show.endTime),
          }));
          return acc;
        }, {} as ShowsByVenue);
        setShowsByVenue(parsedData);
        setFilteredShows(parsedData);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data?.message || "Failed to fetch shows");
        } else {
          alert("Failed to fetch shows");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [movie?.movieId, city]);

  // Apply filters
  useEffect(() => {
    let filtered = { ...showsByVenue };

    if (dateFilter) {
      filtered = Object.keys(filtered).reduce((acc, venue) => {
        acc[venue] = filtered[venue].filter(
          (show) =>
            new Date(show.startTime).toDateString() ===
            new Date(dateFilter).toDateString()
        );
        return acc;
      }, {} as ShowsByVenue);
    }

    if (languageFilter) {
      filtered = Object.keys(filtered).reduce((acc, venue) => {
        acc[venue] = filtered[venue].filter(
          (show) => show.language === languageFilter
        );
        return acc;
      }, {} as ShowsByVenue);
    }

    if (timeSlotFilter) {
      filtered = Object.keys(filtered).reduce((acc, venue) => {
        acc[venue] = filtered[venue].filter((show) => {
          const hour = new Date(show.startTime).getHours();
          if (timeSlotFilter === "Morning") return hour >= 0 && hour < 12;
          if (timeSlotFilter === "Evening") return hour >= 12 && hour < 18;
          if (timeSlotFilter === "Night") return hour >= 18;
          return true;
        });
        return acc;
      }, {} as ShowsByVenue);
    }

    // Remove empty venues
    filtered = Object.keys(filtered).reduce((acc, venue) => {
      if (filtered[venue].length > 0) {
        acc[venue] = filtered[venue];
      }
      return acc;
    }, {} as ShowsByVenue);

    setFilteredShows(filtered);
  }, [showsByVenue, dateFilter, languageFilter, timeSlotFilter]);

  // Redirect if movie is missing
  useEffect(() => {
    if (!movie) {
      navigate("/");
    }
  }, [movie, navigate]);

  // Get filter options
  const dates = Array.from(
    new Set(
      Object.values(showsByVenue)
        .flat()
        .map((show) => new Date(show.startTime).toDateString())
    )
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const languages = Array.from(
    new Set(
      Object.values(showsByVenue)
        .flat()
        .map((show) => show.language)
    )
  );

  const timeSlots = ["Morning", "Evening", "Night"];

  if (!movie) return null;

  return (
    <div className="container my-4">
      {/* Movie Image and Title */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-3">
          <img
            src={movie.img}
            alt={movie.title}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-9">
          <h1 className="display-5">{movie.title}</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <h3 className="h5 mb-3">Shows in {city}</h3>
        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="dateFilter" className="form-label">
              Date
            </label>
            <select
              id="dateFilter"
              className="form-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="">All Dates</option>
              {dates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="languageFilter" className="form-label">
              Language
            </label>
            <select
              id="languageFilter"
              className="form-select"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
            >
              <option value="">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="timeSlotFilter" className="form-label">
              Time Slot
            </label>
            <select
              id="timeSlotFilter"
              className="form-select"
              value={timeSlotFilter}
              onChange={(e) => setTimeSlotFilter(e.target.value)}
            >
              <option value="">All Times</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Shows Section */}
      <h2 className="h3 mb-3">Shows in {city}</h2>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading shows...</p>
        </div>
      )}

      {!loading && Object.keys(filteredShows).length === 0 && (
        <div className="alert alert-info" role="alert">
          No shows available for {movie.title} in {city}.
        </div>
      )}

      {!loading && Object.keys(filteredShows).length > 0 && (
        <div className="row">
          {Object.entries(filteredShows).map(([venueId, venueShows]) => (
            <div key={venueId} className="col-12 mb-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="h5 mb-0">{venueId}</h3>
                </div>
                <div className="card-body">
                  <div className="d-flex flex-wrap gap-2">
                    {venueShows.map((show, index) => (
                      <button
                        key={show.showId}
                        className={`btn btn-${
                          ["primary", "success", "info", "warning"][index % 4]
                        } hover-shadow`}
                        onClick={() =>
                          navigate(`/show/${show.showId}/book-seat`, {
                            state: { show, title: movie.title },
                          })
                        }
                      >
                        {new Date(show.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" - "}
                        {new Date(show.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        <br />
                        {show.language} ({show.format})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreShows;
