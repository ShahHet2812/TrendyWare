import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "2rem",
      }}
    >
      <h1 className="display-1 fw-bold text-danger mb-4">404</h1>
      <h2 className="fw-light mb-3">Page Not Found</h2>
      <p className="text-muted mb-4">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="btn btn-dark btn-lg px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2"
      >
        <ArrowLeft size={20} /> Go Back to Home
      </Link>
    </div>
  );
}