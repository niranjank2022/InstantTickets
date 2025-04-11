import SearchBar from "./SearchBar";
import CityDropdown from "./CityDropdown";
import UserProfile from "./UserProfile";

export default function Header() {
  return (
    <>
      <header className="container-fluid p-4 text-center">
        <div className="row align-items-center">
          <div className="col-9 d-flex justify-content-start">
            <div className="d-flex align-items-center w-100">
              <div className="col-3">
                <span className="lobster-regular fs-3">Instant⚡Tickets</span>
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
