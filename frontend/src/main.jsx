import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/Home.jsx";
import Shop from "./components/Shop.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LoginPage from "./components/LoginPage.jsx";
import FashionFest from "./components/FashionFest.jsx";
import AIStylist from "./components/AIStylist.jsx";
import Cart from "./components/Cart.jsx";
import Admin from "./components/Admin.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [cartItems, setCartItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      setIsAuthenticated(!!token);
      setUserRole(role);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <BrowserRouter>
      {userRole !== "admin" && (
        <Navbar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          cartItems={cartItems}
          handleLogout={handleLogout}
        />
      )}
      <Routes>
        {userRole === "admin" ? (
          <>
            <Route
              path="/admin"
              element={<Admin handleLogout={handleLogout} />}
            />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route
              path="/shop"
              element={
                <Shop
                  recommendations={recommendations}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              }
            />
            <Route
              path="/login"
              element={
                <LoginPage
                  setIsAuthenticated={setIsAuthenticated}
                  setUserRole={setUserRole}
                />
              }
            />
            <Route path="/fashion-fest" element={<FashionFest />} />
            <Route
              path="/cart"
              element={
                <Cart cartItems={cartItems} setCartItems={setCartItems} />
              }
            />
            <Route
              path="/ai-stylist"
              element={<AIStylist setRecommendations={setRecommendations} />}
            />
            <Route path="/admin" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
      {userRole !== "admin" && <Footer />}
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
