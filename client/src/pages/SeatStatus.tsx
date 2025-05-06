import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminApis from "../services/theatreAdmin.api";
import { SeatStatus } from "../config/config";

interface ISeatMap {
  color?: string;
  status?: SeatStatus;
}

interface ILabel {
  [key: string]: { color: string; price: number };
}

const SeatMap: React.FC = () => {
  const { show } = useLocation().state || {};
  const [seatmap, setSeatmap] = useState<(ISeatMap | null)[][]>([]);
  const [label, setLabel] = useState<ILabel>({});

  useEffect(() => {
    const fetchSeatMap = async () => {
      try {
        const { seatmap, label } = await AdminApis.getSeatMap(show.showId);
        setSeatmap(seatmap);
        setLabel(label);
      } catch (err) {
        console.error("Failed to fetch seatmap:", err);
      }
    };
    fetchSeatMap();
  }, [show?.showId]);

  const getSeatStyle = (seat: ISeatMap | null) => {
    if (!seat) {
      return {
        width: "35px",
        height: "35px",
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
        cursor: "default",
      };
    }

    return {
      width: "35px",
      height: "35px",
      fontSize: "0.7rem",
      backgroundColor:
        seat.status === SeatStatus.Booked ? "#6c757d" : seat.color || "#f8f9fa",
      color: seat.status === SeatStatus.Booked ? "white" : "black",
      cursor: seat.status === SeatStatus.Booked ? "not-allowed" : "pointer",
    };
  };

  const renderSeat = (seat: ISeatMap | null, row: number, col: number) => {
    const seatLabel = seat ? `${String.fromCharCode(65 + row)}${col + 1}` : "";
    const isBooked = seat?.status === SeatStatus.Booked;

    return (
      <div
        key={`${row}-${col}`}
        className={`d-flex align-items-center justify-content-center rounded me-1 mb-1 position-relative ${
          seat ? "border" : ""
        }`}
        style={getSeatStyle(seat)}
        title={seat?.status || ""}
      >
        {seat && seatLabel}
        {isBooked && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              fontSize: "1.2rem",
              borderRadius: "0.375rem",
            }}
          >
            ✕
          </div>
        )}
      </div>
    );
  };

  if (!seatmap.length) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary me-3" role="status" />
          <p className="mb-0">Loading seat map...</p>
        </main>
        <footer className="bg-dark text-white text-center py-3 mt-auto">
          <p className="mb-0">© {new Date().getFullYear()} Theatre Admin</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 container my-4">
        <div className="card shadow p-4">
          <div className="position-relative mb-4">
            <button
              className="btn btn-outline-secondary position-absolute start-0"
              onClick={() => window.history.back()}
            >
              ← Back
            </button>
            <h2 className="text-center">{show?.title} Seat Booking Status</h2>
          </div>

          <div className="d-flex justify-content-center mb-4">
            <div
              className="text-center text-muted"
              style={{
                width: "60%",
                padding: "8px 0",
                borderTop: "4px solid #ccc",
                borderRadius: "50% / 10%",
                fontWeight: "bold",
              }}
            >
              SCREEN
            </div>
          </div>
          <div className="overflow-auto pb-3">
            <div className="d-flex justify-content-center">
              <div className="d-flex flex-column align-items-center">
                {seatmap.map((row, rowIdx) => (
                  <div
                    key={`row-${rowIdx}`}
                    className="d-flex align-items-center mb-1"
                  >
                    <div
                      className="fw-bold text-secondary me-1"
                      style={{
                        width: "35px",
                        height: "35px",
                        lineHeight: "35px",
                      }}
                    >
                      {String.fromCharCode(65 + rowIdx)}
                    </div>
                    {row.map((seat, colIdx) =>
                      renderSeat(seat, rowIdx, colIdx)
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-top">
            <h6 className="fw-bold mb-3">Legend</h6>
            <div className="d-flex flex-wrap gap-3">
              {Object.entries(label).map(([name, { color, price }]) => (
                <div key={name} className="d-flex align-items-center">
                  <div
                    className="border me-2"
                    style={{
                      backgroundColor: color,
                      width: "15px",
                      height: "15px",
                      borderRadius: "3px",
                    }}
                  />
                  <span className="small">
                    {name} - ₹{price}
                  </span>
                </div>
              ))}
              <div className="d-flex align-items-center">
                <div
                  className="position-relative border me-2"
                  style={{
                    width: "15px",
                    height: "15px",
                    backgroundColor: "#6c757d",
                    borderRadius: "3px",
                  }}
                >
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "white",
                      fontSize: "0.8rem",
                    }}
                  >
                    ✕
                  </div>
                </div>
                <span className="small">Booked</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeatMap;
