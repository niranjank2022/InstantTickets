import { useContext, useState } from "react";
import { api } from "../services/api";
import UserContext from "../contexts/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface IFormFields {
  email: string;
  password: string;
  confirm_password?: string;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Error: UserProfile must be used within a UserProvider!");
  }

  const { logged, toggleLogged } = userContext;
  const [adminSigninFields, setAdminSigninFields] = useState<IFormFields>({
    email: "",
    password: "",
    confirm_password: undefined,
  });

  const [adminSignupFields, setAdminSignupFields] = useState<IFormFields>({
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleAdminSigninChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAdminSigninFields((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  const handleAdminSignupChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAdminSignupFields((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  const handleAdminSigninSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      const res = await api.post("/auth/signin/", {
        email: adminSigninFields.email,
        password: adminSigninFields.password,
      });

      const userRes = res.data;
      if (!logged) toggleLogged();
      alert(userRes.message);
      navigate("/admin/dashboard/venues/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message);
      } else {
        alert("Unknown error occurred");
      }
    }
  };

  const handleAdminSignupSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      if (adminSignupFields.password != adminSignupFields.confirm_password) {
        alert("Passwords do not match!");
        return;
      }

      const res = await api.post("/auth/signup/", {
        email: adminSignupFields.email,
        password: adminSignupFields.password,
      });
      const userRes = res.data;

      if (!logged) toggleLogged();
      alert(userRes.message);
      navigate("/admin/dashboard/venues/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message);
      } else {
        alert("Unknown error occurred");
      }
    }
  };

  return (
    <>
      <div className="container pt-5">
        <div className="container-fluid">
          <div className="card-header">
            <ul className="nav nav-pills nav-justified" role="tablist">
              <li className="nav-item">
                <button
                  className="nav-link btn active"
                  role="tab"
                  data-bs-toggle="tab"
                  data-bs-target="#signin"
                  type="button"
                >
                  Sign In
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn"
                  role="tab"
                  data-bs-toggle="tab"
                  data-bs-target="#signup"
                  type="button"
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </div>
          <div className="card-body">
            <div className="tab-content">
              <h3>Admin - Login</h3>
              <div
                className="tab-pane active show fade"
                id="signin"
                role="tabpanel"
              >
                <form onSubmit={handleAdminSigninSubmit}>
                  <div>
                    <label className="form-label" htmlFor="signin-email">
                      Email
                    </label>
                    <input
                      className="form-control"
                      id="signin-email"
                      type="email"
                      name="email"
                      onChange={handleAdminSigninChange}
                      value={adminSigninFields["email"]}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="signin-password">
                      Password
                    </label>
                    <input
                      className="form-control"
                      id="signin-password"
                      type="password"
                      name="password"
                      onChange={handleAdminSigninChange}
                      value={adminSigninFields["password"]}
                      required
                    />
                  </div>
                  <div>
                    <button className="btn btn-primary">Sign In</button>
                  </div>
                </form>
              </div>
              <div className="tab-pane show fade" id="signup" role="tabpanel">
                <form onSubmit={handleAdminSignupSubmit}>
                  <div>
                    <label className="form-label" htmlFor="signup-email">
                      Email
                    </label>
                    <input
                      className="form-control"
                      id="signup-email"
                      type="email"
                      name="email"
                      onChange={handleAdminSignupChange}
                      value={adminSignupFields["email"]}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="signup-password">
                      Password
                    </label>
                    <input
                      className="form-control"
                      id="signup-password"
                      type="password"
                      name="password"
                      onChange={handleAdminSignupChange}
                      value={adminSignupFields["password"]}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="signup-cpassword">
                      Confirm Password
                    </label>
                    <input
                      className="form-control"
                      id="signup-cpassword"
                      type="password"
                      name="confirm_password"
                      onChange={handleAdminSignupChange}
                      value={adminSignupFields["confirm_password"]}
                      required
                    />
                  </div>
                  <div>
                    <button className="btn btn-primary">Sign Up</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
