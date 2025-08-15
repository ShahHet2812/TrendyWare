import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, User, LogOut, Menu, X } from "lucide-react";

export default function Navbar({ isAuthenticated, cartItems, handleLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkStyle = {
    fontFamily: "'Inter', sans-serif",
    textDecoration: "none",
    color: "#333",
    padding: "8px 16px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
  };

  const activeLinkStyle = {
    ...linkStyle,
    color: "#111",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  };

  // A component for the navigation links to avoid repetition
  const NavLinks = ({ isMobile }) => {
    const mobileStyles = {
      display: "block",
      width: "100%",
      textAlign: "center",
      padding: "1rem 0",
    };

    return (
      <>
        <NavLink
          to="/shop"
          // FIX: Added the className here
          className="nav-link-hover"
          style={({ isActive }) => ({
            ...(isMobile ? mobileStyles : linkStyle),
            ...(isActive ? activeLinkStyle : {}),
          })}
          onClick={() => setIsMenuOpen(false)}
        >
          Shop
        </NavLink>
        <NavLink
          to="/fashion-fest"
          // FIX: Added the className here
          className="nav-link-hover"
          style={({ isActive }) => ({
            ...(isMobile ? mobileStyles : linkStyle),
            ...(isActive ? activeLinkStyle : {}),
          })}
          onClick={() => setIsMenuOpen(false)}
        >
          Fashion Fest
        </NavLink>
        <NavLink
          to="/ai-stylist"
          // FIX: Added the className here
          className="nav-link-hover"
          style={({ isActive }) => ({
            ...(isMobile ? mobileStyles : linkStyle),
            ...(isActive ? activeLinkStyle : {}),
          })}
          onClick={() => setIsMenuOpen(false)}
        >
          AI Stylist
        </NavLink>
      </>
    );
  };

  return (
    <>
      <style>
        {`
          /* This class is now correctly applied to the links */
          .nav-link-hover:hover {
            background-color: rgba(0, 0, 0, 0.05);
            transform: translateY(-2px);
          }
          .icon-hover:hover {
            transform: scale(1.1);
            color: #000;
          }
          .mobile-menu {
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            opacity: 0;
            pointer-events: none;
          }
          .mobile-menu.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }
           @media (min-width: 768px) {
            .desktop-nav {
              display: flex !important;
            }
            .mobile-menu-button {
              display: none !important;
            }
          }
           @media (max-width: 767px) {
            .desktop-nav {
              display: none !important;
            }
            .mobile-menu-button {
              display: block !important;
            }
          }
        `}
      </style>
      <nav
        style={{
          padding: "1rem 2rem",
          backgroundColor: isScrolled
            ? "rgba(255, 255, 255, 0.7)"
            : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #eee",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "padding 0.3s ease, background-color 0.3s ease",
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textDecoration: "none",
            color: "#111",
            transition: "transform 0.3s ease",
          }}
          className="icon-hover"
        >
          TrendyWare
        </Link>

        <div
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <NavLinks />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link
            to="/cart"
            style={{
              position: "relative",
              color: "#333",
              transition: "transform 0.2s ease",
            }}
            className="icon-hover"
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-8px",
                  backgroundColor: "#C19A6B",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#333",
                transition: "transform 0.2s ease",
              }}
              className="icon-hover"
            >
              <LogOut size={22} />
            </button>
          ) : (
            <Link
              to="/login"
              style={{ color: "#333", transition: "transform 0.2s ease" }}
              className="icon-hover"
            >
              <User size={22} />
            </Link>
          )}

          <div className="mobile-menu-button">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#333",
                zIndex: 1100,
              }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      <div
        className={`mobile-menu ${isMenuOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          top: "73px", // Height of the navbar
          left: 0,
          right: 0,
          backgroundColor: "white",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem 2rem 2rem",
          borderBottom: "1px solid #eee",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          zIndex: 999,
        }}
      >
        <NavLinks isMobile={true} />
      </div>
    </>
  );
}
