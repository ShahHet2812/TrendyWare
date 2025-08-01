import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home.jsx";
import Shop from "./components/Shop.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LoginPage from "./components/LoginPage.jsx";
import FashionFest from "./components/FashionFest.jsx";
import AIStylist from "./components/AIStylist.jsx";
import Cart from "./components/Cart.jsx";
// import AIStylist from "./components/AIStylist.jsx"; // 👈 Uncomment this line after you create the component

// Main App component to hold state
function App() {
  // State for authentication, initialized from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  // State for the shopping cart
  const [cartItems, setCartItems] = useState([]);

  // This effect syncs the auth state if the token is changed in another tab
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        cartItems={cartItems}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/shop"
          element={<Shop cartItems={cartItems} setCartItems={setCartItems} />}
        />
        <Route
          path="/login"
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/fashion-fest" element={<FashionFest />} />
        <Route
          path="/cart"
          element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
        />
        {/* 👇 This route was causing the error. Uncomment it after creating and importing the AIStylist component. */}
        <Route path="/ai-stylist" element={<AIStylist />} /> 
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);