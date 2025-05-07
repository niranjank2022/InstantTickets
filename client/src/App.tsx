import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";

import UserContext from "./contexts/UserContext";
import RouteLayout from "./components/layout/RouteLayout";
import Login from "./pages/Login";
import AdminVenues from "./pages/AdminVenues";
import ExploreHome from "./pages/ExploreHome";
import AddVenue from "./pages/AddVenue";
import AdminShows from "./pages/AdminShows";
import AdminMovies from "./pages/AdminMovies";
import AddShow from "./pages/AddShow";
import SeatStatus from "./pages/SeatStatus";
import MovieDetails from "./pages/MovieDetails";
import ExploreShows from "./pages/ExploreShows";
import BookingStatus from "./pages/BookingStatus";
import Payment from "./pages/Payment";
import ETicket from "./pages/ETicket";
import { Roles } from "./services/auth.api";
import NotFound from "./pages/NotFound";
import ViewTickets from "./pages/ViewTickets";

function App() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Error: App must be used within a UserProvider!");
  }

  const { role } = userContext;
  return (
    <Router>
      <Routes>
        <Route
          element={
            <Navigate
              to={
                role === Roles.User
                  ? "/explore"
                  : role === Roles.TheatreAdmin
                  ? "/admin/dashboard/venues"
                  : "/admin/dashboard/movies"
              }
              replace
            />
          }
          path="/"
        />

        {/* Routes with Header and Footer */}
        <Route
          element={
            <RouteLayout isMain={false}>
              <Login />
            </RouteLayout>
          }
          path="/login"
        />
        <Route
          element={
            <RouteLayout allowedRole={Roles.TheatreAdmin} isMain={true}>
              <AdminVenues />
            </RouteLayout>
          }
          path="/admin/dashboard/venues"
        />
        <Route
          element={
            <RouteLayout allowedRole={Roles.TheatreAdmin} isMain={true}>
              <AdminShows />
            </RouteLayout>
          }
          path="/admin/dashboard/:venueId/shows/"
        />
        <Route
          element={
            <RouteLayout allowedRole={Roles.TheatreAdmin} isMain={true}>
              <SeatStatus />
            </RouteLayout>
          }
          path="/admin/:showId/seat-status"
        />
        <Route
          element={
            <RouteLayout allowedRole={Roles.TheatreAdmin} isMain={true}>
              <AddVenue />
            </RouteLayout>
          }
          path="/admin/add-venue"
        />
        <Route
          element={
            <RouteLayout allowedRole={Roles.TheatreAdmin} isMain={true}>
              <AddShow />
            </RouteLayout>
          }
          path="/admin/add-show"
        />
        <Route
          element={
            <RouteLayout allowedRole={Roles.MovieAdmin} isMain={true}>
              <AdminMovies />
            </RouteLayout>
          }
          path="/admin/dashboard/movies"
        />
        <Route
          element={
            <RouteLayout allowedRole={Roles.User} isMain={true}>
              <ExploreHome />
            </RouteLayout>
          }
          path="/explore"
        />
        <Route
          element={
            <RouteLayout allowedRole={Roles.User} isMain={true}>
              <MovieDetails />
            </RouteLayout>
          }
          path="/:city/movies/:movie/:movieId"
        />
        <Route
          element={
            <RouteLayout allowedRole={Roles.User} isMain={true}>
              <ExploreShows />
            </RouteLayout>
          }
          path="/explore/:city/:movie/:movieId/shows"
        />
        <Route
          element={
            <RouteLayout allowedRole={Roles.User} isMain={false}>
              <BookingStatus />
            </RouteLayout>
          }
          path="/show/:showId/book-seat"
        />
        <Route
          element={
            <RouteLayout allowedRole={Roles.User} isMain={true}>
              <Payment />
            </RouteLayout>
          }
          path="/payment"
        />
        <Route
          element={
            <RouteLayout allowedRole={Roles.User} isMain={true}>
              <ETicket />
            </RouteLayout>
          }
          path="/bookings/:bookingId"
        />
        <Route
          element={
            <RouteLayout allowedRole={Roles.User} isMain={true}>
              <ViewTickets />
            </RouteLayout>
          }
          path="/view-tickets"
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
