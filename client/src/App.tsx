import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useContext } from "react";

import AdminLogin from "./pages/Login";
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

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Error: MainLayout must be used within a UserProvider!");
  }
  const { logged } = userContext;

  return (
    <div className="d-flex flex-column min-vh-100">
      {logged && <Header />}
      <main className="flex-fill">{children}</main>
      {logged && <Footer />}
    </div>
  );
};

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
            <MainLayout>
              <AdminLogin />
            </MainLayout>
          }
          path="/login"
        />
        <Route
          element={
            <MainLayout>
              <AdminVenues />
            </MainLayout>
          }
          path="/admin/dashboard/venues"
        />
        <Route
          element={
            <MainLayout>
              <AdminShows />
            </MainLayout>
          }
          path="/admin/dashboard/:venueId/shows/"
        />
        <Route
          element={
            <MainLayout>
              <SeatStatus />
            </MainLayout>
          }
          path="/admin/:showId/seat-status"
        />
        <Route
          element={
            <MainLayout>
              <AddVenue />
            </MainLayout>
          }
          path="/admin/add-venue"
        />
        <Route
          element={
            <MainLayout>
              <AddShow />
            </MainLayout>
          }
          path="/admin/add-show"
        />
        <Route
          element={
            <MainLayout>
              <AdminMovies />
            </MainLayout>
          }
          path="/admin/dashboard/movies"
        />
        <Route
          element={
            <MainLayout>
              <ExploreHome />
            </MainLayout>
          }
          path="/explore"
        />
        <Route
          element={
            <MainLayout>
              <MovieDetails />
            </MainLayout>
          }
          path="/:city/movies/:movie/:movieId"
        />
        <Route
          element={
            <MainLayout>
              <ExploreShows />
            </MainLayout>
          }
          path="/explore/:city/:movie/:movieId/shows"
        />
        {/* BookingStatus without Header/Footer */}
        <Route element={<BookingStatus />} path="/show/:showId/book-seat" />
      </Routes>
    </Router>
  );
}

export default App;
