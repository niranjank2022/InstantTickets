import { useContext } from "react";
import UserContext from "../../contexts/UserContext";

export default function UserProfile() {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("Error: UserProfile must be used within a UserProvider!");
  }

  const { logged, toggleLogged, username } = userContext;

  return (
    <div>
      {logged ? (
        <div className="row align-items-center">
          <div
            className="border border-dark rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "25px",
              height: "25px",
              backgroundColor: "#f0f0f0", // Optional background color
            }}
          >
            <i className="fa-solid fa-user" style={{ fontSize: "16px" }}></i>
          </div>
          <div className="col-6 text-nowrap">
            Hi, {username}!
          </div>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={() => toggleLogged()}>
          Log In
        </button>
      )}
    </div>
  );
}
