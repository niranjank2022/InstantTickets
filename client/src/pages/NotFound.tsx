import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light text-center">
      <h1 className="display-3 text-danger">404</h1>
      <p className="lead">Page not found.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Go to Home
      </Link>
    </div>
  );
}
