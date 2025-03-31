import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import axios from "axios";

export default function AdminVenues() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<
    { venueId: string; name: string; city: string }[]
  >([]);

  useEffect(() => {
    (async function () {
      try {
        const res = await api.get(`venues/all/`, { withCredentials: true });
        setVenues(res.data.venues);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          alert(err.response.data.message);
        } else {
          alert("Unknown error occurred");
        }
      }
    })();
  }, []);

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/buses/add-bus")}
          >
            Add Venue
          </button>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>City</th>
              <th>Shows</th>
              <th>Seat Layout</th>
            </tr>
          </thead>

          <tbody>
            {venues.map((venue, i) => (
              <tr key={i + 1}>
                <td>{i + 1}</td>
                <td>{venue.name}</td>
                <td>{venue.city}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate(`/admin/dashboard/${venue.venueId}/shows`, {
                        state: { venueId: venue.venueId },
                      })
                    }
                  >
                    View
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate(
                        `/admin/dashboard/${venue.venueId}/seat-layout`,
                        {
                          state: { venueId: venue.venueId },
                        }
                      )
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
