import { useEffect, useState } from "react";
import UserApis from "../services/user.api";

interface ITicket {
  bookingId: string;
  title: string;
  venue: string;
  seats: string[];
  showTime: string;
  bookingTime: string;
}

const ViewTickets = () => {
  const [tickets, setTickets] = useState<ITicket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await UserApis.getAllTickets();
      setTickets(res.tickets);
    };
    fetchTickets();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets booked yet.</p>
      ) : (
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li
              key={ticket.bookingId}
              className="border p-4 rounded-lg shadow-sm"
            >
              <div className="text-lg font-medium">{ticket.title}</div>
              <div className="text-sm text-gray-600">{ticket.venue}</div>
              <div className="text-sm">🎟️ Seats: {ticket.seats.join(", ")}</div>
              <div className="text-sm">
                📅 Date: {new Date(ticket.showTime).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                Booked at: {new Date(ticket.bookingTime).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewTickets;
