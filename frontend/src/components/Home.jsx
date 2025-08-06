import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, ArrowRight } from "lucide-react";
import axios from "axios";

export default function Home({ setCartItems }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products");
        // Shuffle the products and take the first 3
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const addToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === productToAdd._id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...productToAdd, id: productToAdd._id, quantity: 1 }];
    });
    alert(`${productToAdd.name} has been added to your bag!`);
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Hero Section */}
      <header
        className="text-white text-center d-flex align-items-center justify-content-center"
        style={{
          height: "100vh",
          backgroundImage: "url('/images/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div style={{ zIndex: 2 }}>
          <h1 className="display-3 fw-light mb-4">Elevate Your Ethnic Style</h1>
          <p className="lead mb-4">
            Discover India's latest fashion trends, from modern wear to classic
            ethnic looks
          </p>
          <Link
            to="/shop"
            className="btn btn-light btn-lg px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2"
            style={{ zIndex: 2 }}
          >
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </header>

      {/* Featured Products */}
      <section className="py-5">
        <div className="container text-center mb-5">
          <h2 className="fw-light mb-3">Featured Collections</h2>
          <p className="text-muted">
            Curated styles for every Indian celebration
          </p>
        </div>
        <div className="container">
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div key={product._id} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="position-relative">
                    <img
                      src={product.imageUrl || "https://placehold.co/300x400/EEE/31343C?text=Image+Not+Found"}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: "320px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <div className="d-flex align-items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={"text-warning"}
                          fill={"currentColor"}
                        />
                      ))}
                      <span className="ms-2 small text-muted">(4.5)</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="h5 text-danger">₹{product.price}</span>
                      <button
                        className="btn btn-danger btn-sm rounded-pill"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}