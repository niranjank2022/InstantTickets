import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import AdminApis from "../services/theatreAdmin.api";
import { SeatStatus, SocketStatus } from "../config/config";
import { socket } from "../services/socket";

interface ISeat {
  color?: string;
  status?: SeatStatus;
}

interface ILabel {
  [key: string]: { color: string; price: number };
}

interface ISeatUpdate {
  showId: string;
  x: number;
  y: number;
  seatStatus: SeatStatus;
}

interface ISeatResponse {
  status: SocketStatus;
  message: string;
  x: number;
  y: number;
  type: "select" | "release";
}

const getSeatId = (row: number, col: number) =>
  `${String.fromCharCode(65 + row)}${col + 1}`;

export default function BookingStatus() {
  const location = useLocation();
  const { showId, title } = location.state;
  const [seatMap, setSeatmap] = useState<(ISeat | null)[][]>([]);
  const [label, setLabel] = useState<ILabel>({});
  const [selectedSeats, setSelectedSeats] = useState<string[]>(() => {
    const saved = sessionStorage.getItem(`selectedSeats_${showId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [isConnected, setIsConnected] = useState(socket.connected);
  const selectedSeatsRef = useRef<string[]>(selectedSeats);
  const pathnameRef = useRef<string>(location.pathname);

  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    const fetchSeatMap = async () => {
      try {
        const { seatmap, label } = await AdminApis.getSeatMap(showId);
        setSeatmap(seatmap);
        setLabel(label);
      } catch (error) {
        console.error("Error fetching seat map:", error);
      }
    };

    // Always fetch seat map on mount
    fetchSeatMap();

    // Handle first-time load vs refresh
    const isReloaded = sessionStorage.getItem("reloaded");

    if (!isReloaded && !isConnected) {
      socket.connect(); // Only connect socket on first load
    }

    // Mark if it's a refresh
    const handleBeforeUnload = () => {
      sessionStorage.setItem("reloaded", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      const reloaded = sessionStorage.getItem("reloaded");
      if (!reloaded) {
        // Only clear and release seats on route change
        for (const seatId of selectedSeatsRef.current) {
          const row = seatId.charCodeAt(0) - 65;
          const col = parseInt(seatId.slice(1)) - 1;
          socket?.emit("releaseSeat", {
            showId,
            x: col,
            y: row,
          });
        }
        sessionStorage.removeItem(`selectedSeats_${showId}`);
      } else {
        sessionStorage.removeItem("reloaded");
      }
    };
  }, [showId]);

  // Initialize socket connection only once
  useEffect(() => {
    const handleSeatUpdate = (data: ISeatUpdate) => {
      const { x, y, seatStatus } = data;
      const seatId = getSeatId(y, x);
      if (
        seatStatus === SeatStatus.Available &&
        selectedSeatsRef.current.includes(seatId)
      ) {
        setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
      }

      setSeatmap((prev) =>
        prev.map((row, rowIdx) =>
          row.map((seat, colIdx) => {
            if (rowIdx === y && colIdx === x && seat) {
              return { ...seat, status: seatStatus };
            }
            return seat;
          })
        )
      );
    };

    const handleSeatResponse = (data: ISeatResponse) => {
      const { status, message, x, y, type } = data;
      const seatId = getSeatId(y, x);
      if (type === "select") {
        if (status === SocketStatus.Success) {
          setSelectedSeats((prev) => [...prev, seatId]);
        } else {
          console.error("Failed to reserve seat:", message);
        }
      } else if (type === "release") {
        if (status === SocketStatus.Success) {
          setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
        } else {
          console.error("Failed to release seat:", message);
        }
      }
    };

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    socket.on("seatUpdate", (data) => {
      handleSeatUpdate(data);
    });

    socket.on("seatResponse", (data) => {
      handleSeatResponse(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("seatUpdate");
      socket.off("seatResponse");
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      `selectedSeats_${showId}`,
      JSON.stringify(selectedSeats)
    );
  }, [selectedSeats, showId]);

  const toggleSeat = useCallback(
    (row: number, col: number) => {
      const seat = seatMap[row]?.[col];
      if (!seat) return;

      const seatId = getSeatId(row, col);
      const isSelected = selectedSeats.includes(seatId);
      const isAvailable = seat.status === SeatStatus.Available;

      if (isSelected) {
        socket?.emit("releaseSeat", {
          showId,
          x: col,
          y: row,
        });
      } else if (isAvailable) {
        socket?.emit("selectSeat", {
          showId,
          x: col,
          y: row,
        });
      }
    },
    [showId, seatMap, selectedSeats]
  );

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, id) => {
      const row = id.charCodeAt(0) - 65;
      const col = parseInt(id.slice(1)) - 1;
      const seat = seatMap[row]?.[col];
      const match = Object.values(label).find(
        (entry) => entry.color === seat?.color
      );
      return sum + (match?.price || 0);
    }, 0);
  }, [selectedSeats, seatMap, label]);

  const SeatBox = ({
    seat,
    row,
    col,
  }: {
    seat: ISeat;
    row: number;
    col: number;
  }) => {
    const seatId = getSeatId(row, col);
    const isSelected = selectedSeats.includes(seatId);
    const isAvailable = seat.status === SeatStatus.Available;
    const isBooked =
      seat.status === SeatStatus.Booked || !(isSelected || isAvailable);

    const baseStyle: React.CSSProperties = {
      width: "35px",
      height: "35px",
      fontSize: "0.7rem",
      borderRadius: "0.375rem",
      backgroundColor: isBooked
        ? "#6c757d"
        : isSelected
        ? "#198754"
        : seat.color || "#ccc",
      color: "white",
      cursor: isBooked ? "not-allowed" : "pointer",
      pointerEvents: isBooked ? "none" : "auto",
    };

    return (
      <div
        key={`${row}-${col}-${seat.status}`}
        className="d-flex align-items-center justify-content-center border rounded me-1 mb-1 position-relative"
        style={baseStyle}
        title={isSelected ? "Selected" : isAvailable ? "Available" : "Booked"}
        onClick={() => toggleSeat(row, col)}
      >
        {seatId}
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

  if (!seatMap.length) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary me-3" role="status" />
          <p className="mb-0">Loading seat map...</p>
        </main>
        <footer className="bg-dark text-white text-center py-3 mt-auto">
          <p className="mb-0">© {new Date().getFullYear()} Instant Tickets</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 container my-4">
        <div className="card shadow p-4">
          <h2 className="text-center mb-4">{title} Seat Booking Status</h2>

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
                {seatMap.map((row, rowIdx) => (
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
                      seat ? (
                        <SeatBox
                          seat={seat}
                          row={rowIdx}
                          col={colIdx}
                          key={colIdx}
                        />
                      ) : (
                        <div
                          key={`${rowIdx}-${colIdx}`}
                          className="me-1 mb-1"
                          style={{
                            width: "35px",
                            height: "35px",
                            backgroundColor: "transparent",
                          }}
                        />
                      )
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
              <div className="d-flex align-items-center">
                <div
                  className="border me-2"
                  style={{
                    backgroundColor: "#198754",
                    width: "15px",
                    height: "15px",
                    borderRadius: "3px",
                  }}
                />
                <span className="small">Selected</span>
              </div>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="mt-4 text-center">
              <h5 className="mb-3">
                Selected Seats: {selectedSeats.join(", ")} – Total: ₹
                {totalPrice}
              </h5>
              <button
                className="btn btn-success"
                onClick={() => {
                  if (window.confirm("Proceed to book selected seats?")) {
                    sessionStorage.removeItem(`selectedSeats_${showId}`);
                    setSelectedSeats([]);
                  }
                }}
              >
                Proceed to Book
              </button>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">© {new Date().getFullYear()} Instant Tickets</p>
      </footer>
    </div>
  );
}
