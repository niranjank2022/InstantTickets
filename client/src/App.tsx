import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useContext } from "react";

import AdminLogin from "./pages/AdminLogin";
import AdminVenues from "./pages/AdminVenues";
import UserContext from "./contexts/UserContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ExploreHome from "./pages/ExploreHome";

function App() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Error: UserProfile must be used within a UserProvider!");
  }

  const { logged } = userContext;

  return (
    <>
      <Router>
        {logged && <Header />}
        <Routes>
          <Route element={<AdminLogin />} path="/admin/login" />
          <Route element={<AdminVenues />} path="/admin/dashboard/venues" />

          <Route element={<ExploreHome />} path="/explore" />
        </Routes>
        {logged && <Footer />}
      </Router>
    </>
  );
}

export default App;
