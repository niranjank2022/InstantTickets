import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import AuthApis from "../../services/auth.api";

export default function UserProfile() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!userContext) {
    throw new Error("Error: UserProfile must be used within a UserProvider!");
  }

  const { logged, toggleLogged, username } = userContext;
  const handleLogout = async () => {
    try {
      await AuthApis.logout();
      toggleLogged();
      localStorage.removeItem("logged");
      setIsOpen(false);
      alert("Logged out successfully");
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message);
      } else {
        alert("Unknown error occurred");
      }
    }
  };

  return (
    <div className="position-relative">
      {logged ? (
        <div>
          {/* Profile Icon - Click to Toggle Dropdown */}
          <div
            className="border border-dark rounded-circle d-flex justify-content-center align-items-center"
            role="button"
            tabIndex={0}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
            }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className="fa-solid fa-user" style={{ fontSize: "18px" }}></i>
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              className="position-absolute bg-white border rounded shadow p-2"
              style={{
                top: "40px",
                right: "0",
                width: "150px",
                zIndex: 1000,
              }}
            >
              <p className="m-0 text-center">Hi, {username}!</p>
              <hr className="my-2" />
              <button className="btn btn-danger w-100" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="btn btn-primary" onClick={() => toggleLogged()}>
          Log In
        </button>
      )}
    </div>
  );
}
