import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import UserApis from "../services/user.api";

interface ITicket {
  bookingId: string;
  title: string;
  venue: string;
  seats: string[];
  showTime: string;
  bookingTime: string;
}

export default function ETicketPage() {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      const res = await UserApis.getTicketByBookingId(bookingId!);
      setTicket(res);
    };
    fetchTicket();
  }, [bookingId]);

  const generatePdf = async () => {
    if (!ticketRef.current) return;
    const canvas = await html2canvas(ticketRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`e-ticket-${ticket?.bookingId}.pdf`);
  };

  if (!ticket)
    return <div className="text-center mt-5">Loading your e-ticket...</div>;

  return (
    <div className="container my-5">
      <div ref={ticketRef} style={{ background: "#f9fafb", padding: "20px" }}>
        <div
          className="ticket"
          style={{
            maxWidth: "520px",
            margin: "auto",
            background: "#fff",
            borderRadius: "16px",
            padding: "30px 24px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <h2 style={{ fontFamily: "Lobster, cursive", fontSize: "1.8rem" }}>
              Instant⚡Tickets
            </h2>
            <p style={{ color: "#777", fontSize: "14px", marginTop: "4px" }}>
              E Ticket
            </p>
          </div>

          <div
            style={{ margin: "20px 0", lineHeight: "1.8", fontSize: "16px" }}
          >
            <p>
              <strong>Booking ID:</strong> {ticket.bookingId}
            </p>
            <p>
              <strong>Booking Time:</strong>{" "}
              {new Date(ticket.bookingTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Movie:</strong> {ticket.title}
            </p>
            <p>
              <strong>Venue:</strong> {ticket.venue}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(ticket.showTime).toLocaleDateString()}
            </p>
            <p>
              <strong>Show Time:</strong>{" "}
              {new Date(ticket.showTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Seats:</strong> {ticket.seats.join(", ")}
            </p>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p style={{ fontSize: "14px", color: "#777" }}>
              Thank you for booking with us! Enjoy your movie!
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={generatePdf}>
          Download as PDF
        </button>
      </div>
    </div>
  );
}
