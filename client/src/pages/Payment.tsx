import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "../services/socket";
import UserApis from "../services/user.api";
import axios from "axios";

// Payment session duration: 3 minutes
const PAYMENT_SESSION_DURATION = 3 * 60 * 1000;

export default function PaymentPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { showId, title, selectedSeats, totalPrice } = state || {};
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    // Redirect if accessed directly
    if (!showId || !selectedSeats?.length) {
      navigate("/explore");
    }
  }, [showId, selectedSeats, navigate]);

  useEffect(() => {
    const existingStart = sessionStorage.getItem("paymentStart");
    const now = Date.now();
    const startTime = existingStart ? parseInt(existingStart) : now;

    if (!existingStart) {
      sessionStorage.setItem("paymentStart", startTime.toString());
    }

    const expiryTime = startTime + PAYMENT_SESSION_DURATION;

    // Check if the session already expired when the page loads
    const remaining = expiryTime - now;
    if (remaining <= 0) {
      alert("Payment session expired!");
      sessionStorage.removeItem("paymentStart");
      navigate(-2); // Close the page or redirect
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = expiryTime - now;
      setTimeLeft(Math.max(remaining, 0));

      if (remaining <= 0) {
        clearInterval(interval);
        sessionStorage.removeItem("paymentStart");

        // Redirect or close the page
        alert("Payment session expired!");
        socket.disconnect();
        navigate(-2);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Format time as minutes and seconds
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  // Release selected seats when cancelled or expired
  const releaseSeats = () => {
    console.log("Releasing seats:", selectedSeats);

    selectedSeats.forEach((seatId: string) => {
      const row = seatId.charCodeAt(0) - 65;
      const col = parseInt(seatId.slice(1)) - 1;
      socket.emit("releaseSeat", { showId, x: col, y: row });
      console.log(row, col);
    });
    sessionStorage.removeItem(`selectedSeats_${showId}`);
    sessionStorage.removeItem("paymentStart");
    sessionStorage.removeItem("selectedSeats");
  };

  // Book selected seats when upon successful payment
  const bookSeats = async () => {
    const res = await UserApis.createBooking(email, showId, selectedSeats);
    const bookingId = res.bookingId;
    sessionStorage.removeItem(`selectedSeats_${showId}`);
    sessionStorage.removeItem("paymentStart");
    sessionStorage.removeItem("selectedSeats");
    return bookingId;
  };

  const handleCancel = () => {
    releaseSeats();
    socket.disconnect();
    navigate(-2);
  };

  const handlePay = async () => {
    // Validate email and phone
    if (!email || !phone) {
      alert("Please fill in both email and phone number.");
      return;
    }

    // Phone number validation regex
    const phoneRegex = /^\+(\d{2})\s(\d{5})\s(\d{5})$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError(
        "Please enter a valid phone number in the format +xx xxxxx xxxxx."
      );
      return;
    }

    setPhoneError(""); // Clear error if phone is valid
    try {
      alert(`Payment initiated for ₹${totalPrice}`);
      sessionStorage.removeItem(`selectedSeats_${showId}`);
      const bookingId = await bookSeats();
      alert("Payment successful! Thank you for your purchase.");
      socket.disconnect();
      navigate("/bookings/" + bookingId, { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to book seats");
      } else {
        alert("Failed to book seats");
      }
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h2>Complete Your Payment</h2>
        <p className="text-danger">
          Session expires in: {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </p>
        <h3 className="text-center mb-4">Payment Details</h3>

        <p>
          <strong>Movie:</strong> {title}
        </p>
        <p>
          <strong>Selected Seats:</strong> {selectedSeats?.join(", ")}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹{totalPrice}
        </p>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            placeholder="+xx xxxxx xxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {phoneError && <p className="text-danger">{phoneError}</p>}
        </div>

        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-success" onClick={handlePay}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
