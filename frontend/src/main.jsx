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
import NotFound from "./components/NotFound.jsx"; // Import the NotFound component
import PaymentPage from "./components/PaymentPage.jsx";

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
            {/* For admins, any other path redirects to NotFound */}
            <Route path="*" element={<NotFound />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home setCartItems={setCartItems} />} />
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
            <Route path="/payment" element={<PaymentPage />} />
            {/*
              If a non-admin tries to access /admin, redirect to login.
              This maintains the original security logic.
            */}
            <Route path="/admin" element={<Navigate to="/login" />} />
            {/* For any other path, show the NotFound page */}
            <Route path="*" element={<NotFound />} />
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