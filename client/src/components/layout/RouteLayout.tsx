import { useContext } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Roles } from "../../services/auth.api";
import UserContext from "../../contexts/UserContext";

function NoAccess() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light text-center">
      <h1 className="display-3 text-danger">403</h1>
      <p className="lead">You do not have permission to access this page.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Go to Home
      </Link>
    </div>
  );
}

export default function RouteLayout({
  children,
  isMain,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole?: Roles;
  isMain: boolean;
}) {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Error: MainLayout must be used within a UserProvider!");
  }

  const { role } = userContext;
  if (allowedRole && role !== allowedRole) {
    return <NoAccess />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {isMain && <Header />}
      <main className="flex-fill">{children}</main>
      {isMain && <Footer />}
    </div>
  );
}
