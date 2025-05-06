import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React, { useContext } from "react";

import Login from "./pages/Login";
import AdminVenues from "./pages/AdminVenues";
import UserContext from "./contexts/UserContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
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

function RouteLayout({
  children,
  isProtected,
  isMain,
}: {
  children: React.ReactNode;
  isProtected: boolean;
  isMain: boolean;
}) {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Error: MainLayout must be used within a UserProvider!");
  }

  const { logged } = userContext;
  if (isProtected && !logged) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {isMain && <Header />}
      <main className="flex-fill">{children}</main>
      {isMain && <Footer />}
    </div>
  );
}

function App() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Error: App must be used within a UserProvider!");
  }

  return (
    <Router>
      <Routes>
        {/* Routes with Header and Footer */}
        <Route
          element={
            <RouteLayout isProtected={false} isMain={false}>
              <Login />
            </RouteLayout>
          }
          path="/login"
        />
        <Route
          element={
            <RouteLayout isProtected={true} isMain={true}>
              <AdminVenues />
            </RouteLayout>
          }
          path="/admin/dashboard/venues"
        />
        <Route
          element={
            <RouteLayout isProtected={true} isMain={true}>
              <AdminShows />
            </RouteLayout>
          }
          path="/admin/dashboard/:venueId/shows/"
        />
        <Route
          element={
            <RouteLayout isProtected={true} isMain={true}>
              <SeatStatus />
            </RouteLayout>
          }
          path="/admin/:showId/seat-status"
        />
        <Route
          element={
            <RouteLayout isProtected={true} isMain={true}>
              <AddVenue />
            </RouteLayout>
          }
          path="/admin/add-venue"
        />
        <Route
          element={
            <RouteLayout isProtected={true} isMain={true}>
              <AddShow />
            </RouteLayout>
          }
          path="/admin/add-show"
        />
        <Route
          element={
            <RouteLayout isProtected={true} isMain={true}>
              <AdminMovies />
            </RouteLayout>
          }
          path="/admin/dashboard/movies"
        />
        <Route
          element={
            <RouteLayout isProtected={false} isMain={true}>
              <ExploreHome />
            </RouteLayout>
          }
          path="/explore"
        />
        <Route
          element={
            <RouteLayout isProtected={false} isMain={true}>
              <MovieDetails />
            </RouteLayout>
          }
          path="/:city/movies/:movie/:movieId"
        />
        <Route
          element={
            <RouteLayout isProtected={false} isMain={true}>
              <ExploreShows />
            </RouteLayout>
          }
          path="/explore/:city/:movie/:movieId/shows"
        />
        <Route
          element={
            <RouteLayout isProtected={false} isMain={false}>
              <BookingStatus />
            </RouteLayout>
          }
          path="/show/:showId/book-seat"
        />
        <Route
          element={
            <RouteLayout isProtected={false} isMain={true}>
              <Payment />
            </RouteLayout>
          }
          path="/payment"
        />
        <Route
          element={
            <RouteLayout isProtected={false} isMain={true}>
              <ETicket />
            </RouteLayout>
          }
          path="/bookings/:bookingId"
        />
      </Routes>
    </Router>
  );
}

export default App;
