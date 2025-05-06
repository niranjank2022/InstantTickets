import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import AuthApis, { Roles } from "../services/auth.api";

interface IFormFields {
  email: string;
  password: string;
  confirm_password?: string;
  role: Roles;
}

export default function Login() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Error: UserProfile must be used within UserProvider");
  }

  const { logged, toggleLogged, changeRole } = userContext;
  const [signinFields, setAdminSigninFields] = useState<IFormFields>({
    email: "",
    password: "",
    role: Roles.User, // Doesn't matter what we choose since it will be overwritten
  });

  const [signupFields, setAdminSignupFields] = useState<IFormFields>({
    email: "",
    password: "",
    confirm_password: "",
    role: Roles.User, // Doesn't matter what we choose since it will be overwritten
  });

  const [signingIn, setSigningIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  const handleAdminSigninChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAdminSigninFields((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  const handleAdminSignupChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      setSigningIn(true);
      const res = await AuthApis.signin(
        signinFields.email,
        signinFields.password,
        signinFields.role
      );

      if (!logged) toggleLogged();
      alert(res.message);
      if (signinFields.role === Roles.TheatreAdmin) {
        changeRole(Roles.TheatreAdmin);
        navigate("/admin/dashboard/venues", { replace: true });
      } else if (signinFields.role === Roles.MovieAdmin) {
        changeRole(Roles.MovieAdmin);
        navigate("/admin/dashboard/movies", { replace: true });
      } else {
        changeRole(Roles.User);
        navigate("/explore", { replace: true });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message);
      } else {
        alert("Unknown error occurred");
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleAdminSignupSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      if (signupFields.password !== signupFields.confirm_password) {
        alert("Passwords do not match!");
        return;
      }

      if (!signupFields.role) {
        alert("Select your role before signing up.");
        return;
      }

      setSigningUp(true);
      const res = await AuthApis.signup(
        signupFields.email,
        signupFields.password,
        signupFields.role
      );

      if (!logged) toggleLogged();
      alert(res.message);

      if (signupFields.role === Roles.TheatreAdmin) {
        changeRole(Roles.TheatreAdmin);
        navigate("/admin/dashboard/venues/", { replace: true });
      } else if (signupFields.role === Roles.MovieAdmin) {
        changeRole(Roles.MovieAdmin);
        navigate("/admin/dashboard/movies/", { replace: true });
      } else {
        changeRole(Roles.User);
        navigate("/explore", { replace: true });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message);
      } else {
        alert("Unknown error occurred");
      }
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <div className="container pt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
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
                <h3 className="text-center mb-4">Login</h3>

                {/* Sign In */}
                <div
                  className="tab-pane active show fade"
                  id="signin"
                  role="tabpanel"
                >
                  <form onSubmit={handleAdminSigninSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="signin-email">
                        Email
                      </label>
                      <input
                        className="form-control"
                        id="signin-email"
                        type="email"
                        name="email"
                        onChange={handleAdminSigninChange}
                        value={signinFields.email}
                        autoComplete="current-password"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="role">
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        className="form-select"
                        value={signinFields.role}
                        onChange={handleAdminSigninChange}
                        required
                      >
                        <option value="">Select a role</option>
                        <option value={Roles.User}>User</option>
                        <option value={Roles.TheatreAdmin}>
                          Theatre Admin
                        </option>
                        <option value={Roles.MovieAdmin}>Movie Admin</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="signin-password">
                        Password
                      </label>
                      <input
                        className="form-control"
                        id="signin-password"
                        type="password"
                        name="password"
                        onChange={handleAdminSigninChange}
                        value={signinFields.password}
                        required
                      />
                    </div>
                    <div className="d-grid">
                      <button className="btn btn-primary" disabled={signingIn}>
                        {signingIn ? "Signing In..." : "Sign In"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Sign Up */}
                <div className="tab-pane show fade" id="signup" role="tabpanel">
                  <form onSubmit={handleAdminSignupSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="signup-email">
                        Email
                      </label>
                      <input
                        className="form-control"
                        id="signup-email"
                        type="email"
                        name="email"
                        onChange={handleAdminSignupChange}
                        value={signupFields.email}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="role">
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        className="form-select"
                        value={signupFields.role}
                        onChange={handleAdminSignupChange}
                        required
                      >
                        <option value="">Select a role</option>
                        <option value={Roles.User}>User</option>
                        <option value={Roles.TheatreAdmin}>
                          Theatre Admin
                        </option>
                        <option value={Roles.MovieAdmin}>Movie Admin</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="signup-password">
                        Password
                      </label>
                      <input
                        className="form-control"
                        id="signup-password"
                        type="password"
                        name="password"
                        onChange={handleAdminSignupChange}
                        value={signupFields.password}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="signup-cpassword">
                        Confirm Password
                      </label>
                      <input
                        className="form-control"
                        id="signup-cpassword"
                        type="password"
                        name="confirm_password"
                        onChange={handleAdminSignupChange}
                        value={signupFields.confirm_password}
                        required
                      />
                    </div>
                    <div className="d-grid">
                      <button className="btn btn-primary" disabled={signingUp}>
                        {signingUp ? "Signing Up..." : "Sign Up"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
