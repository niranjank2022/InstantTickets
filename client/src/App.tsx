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

function App() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Error: UserProfile must be used within a UserProvider!");
  }

  const { logged } = userContext;

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Router>
          {logged && <Header />}
          <main className="flex-fill">
            <Routes>
              <Route element={<AdminLogin />} path="/login" />
              <Route element={<AdminVenues />} path="/admin/dashboard/venues" />
              <Route
                element={<AdminShows />}
                path="/admin/dashboard/:venueId/shows/"
              />
              <Route
                element={<SeatStatus />}
                path="/admin/:showId/seat-status"
              />
              <Route element={<AddVenue />} path="/admin/add-venue" />
              <Route element={<AddShow />} path="/admin/add-show" />

              <Route
                element={<AdminMovies />}
                path="/admin/dashboard/movies"
              />

              <Route element={<ExploreHome />} path="/explore" />
            </Routes>
          </main>
          {logged && <Footer />}
        </Router>
      </div>
    </>
  );
}

export default App;
