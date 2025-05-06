import { useContext } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import CityDropdown from "./CityDropdown";
import UserProfile from "./UserProfile";
import { Roles } from "../../services/auth.api";
import UserContext from "../../contexts/UserContext";

export default function Header() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Error: UserProfile must be used within a UserProvider!");
  }

  const { role } = userContext;

  return (
    <>
      <header className="container-fluid p-4 text-center">
        <div className="row align-items-center">
          <div className="col-9 d-flex justify-content-start">
            <div className="d-flex align-items-center w-100">
              <div className="col-3">
                <Link
                  to={
                    role === Roles.User
                      ? "/explore"
                      : role === Roles.TheatreAdmin
                      ? "/admin/dashboard/venues"
                      : "/admin/dashboard/movies"
                  }
                  className="text-decoration-none text-dark"
                >
                  <span className="lobster-regular fs-3">Instant⚡Tickets</span>
                </Link>
              </div>
              <div className="col-9">
                <SearchBar />
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="row align-items-center">
              <div className="col-6">
                <CityDropdown />
              </div>
              <div className="col-6">
                <UserProfile />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
