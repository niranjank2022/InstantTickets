import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AdminApis from "../services/theatreAdmin.api";

export default function AdminShows() {
  const navigate = useNavigate();
  const { venueId } = useParams();
  const { venueName, city } = useLocation().state;
  const [shows, setShows] = useState<
    {
      showId: string;
      movieTitle: string;
      startTime: Date;
      endTime: Date;
      language: string;
      format: string;
    }[]
  >([]);

  useEffect(() => {
    (async function () {
      try {
        const res = await AdminApis.getShowsByVenueId(venueId!);
        setShows(res.shows);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          alert(err.response.data.message);
        } else {
          alert("Unknown error occurred");
        }
      }
    })();
  }, [venueId]);

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-between mb-3">
          <h3>
            {venueName}, {city}
          </h3>
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/admin/add-show", {
                state: { city: city, venueId: venueId, venueName: venueName },
              })
            }
          >
            Add Show
          </button>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Movie Name</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Language</th>
              <th>Format</th>
              <th>Booking Status</th>
            </tr>
          </thead>

          <tbody>
            {shows.length > 0 ? (
              shows.map((show, i) => (
                <tr key={i + 1}>
                  <td>{i + 1}</td>
                  <td>{show.movieTitle}</td>
                  <td>{new Date(show.startTime).toLocaleString()}</td>
                  <td>{new Date(show.endTime).toLocaleString()}</td>
                  <td>{show.language}</td>
                  <td>{show.format}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        navigate(`/admin/${show.showId}/seat-status`, {
                          state: { venueId: venueId, show: show },
                        })
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">
                  Add shows to see them
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
