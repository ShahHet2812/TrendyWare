import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function Navbar({
  isAuthenticated,
  setIsAuthenticated,
  cartItems,
  handleLogout,
}) {
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow sticky-top">
      <div className="container">
        <Link className="navbar-brand text-danger fw-bold" to="/">
          TrendyWare
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto me-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shop">
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fashion-fest">
                Fashion Fest
              </Link>
            </li>
            <li className="nav-item">
              {" "}
              {/* <-- ADD THIS LINK */}
              <Link className="nav-link" to="/ai-stylist">
                AI Stylist
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            <Link to="/cart" className="position-relative">
              <ShoppingBag className="text-secondary" />
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItems}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger px-3 rounded-pill"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="btn btn-danger text-white px-3 rounded-pill"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
