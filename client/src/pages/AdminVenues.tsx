import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminApis from "../services/theatreAdmin.api";

export default function AdminVenues() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<
    { venueId: string; name: string; city: string }[]
  >([]);
  const title = (s: string) =>
    s.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );

  useEffect(() => {
    (async function () {
      try {
        const res = await AdminApis.getVenues();
        setVenues(res.venues);
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
            onClick={() => navigate("/admin/add-venue")}
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
            </tr>
          </thead>

          <tbody>
            {venues.length > 0 ? (
              venues.map((venue, i) => (
                <tr key={i + 1}>
                  <td>{i + 1}</td>
                  <td>{venue.name}</td>
                  <td>{title(venue.city)}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        navigate(`/admin/dashboard/${venue.venueId}/shows`, {
                          state: {
                            venueName: venue.name,
                            city: title(venue.city),
                          },
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
                <td colSpan={5} className="text-center">
                  Add venues to see them
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
