import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import axios from "axios";

export default function Home({ setCartItems }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products");
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
      return [
        ...prevItems,
        { ...productToAdd, id: productToAdd._id, quantity: 1 },
      ];
    });
    alert(`${productToAdd.name} has been added to your cart!`);
  };

  return (
    <div>
      <header
        style={{
          height: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          position: "relative",
          backgroundImage: "url('/images/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />
        <div style={{ zIndex: 1, padding: "2rem" }}>
          <h1
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "4.5rem",
              fontWeight: 500,
            }}
          >
            The Art of Style
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.2rem",
              maxWidth: "600px",
              margin: "1rem auto",
            }}
          >
            Discover curated collections that blend timeless tradition with
            contemporary elegance.
          </p>
          <Link
            to="/shop"
            style={{
              fontFamily: "'Inter', sans-serif",
              textDecoration: "none",
              color: "#111",
              backgroundColor: "white",
              padding: "12px 24px",
              borderRadius: "50px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "1rem",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Explore Collections <ArrowRight size={20} />
          </Link>
        </div>
      </header>

      <section style={{ padding: "6rem 2rem", backgroundColor: "#F8F8F8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: "2.5rem" }}>
              Featured Pieces
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#666" }}>
              Handpicked for the modern connoisseur.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const ProductCard = ({ product, addToCart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ height: "400px", overflow: "hidden" }}>
        <img
          src={
            product.imageUrl ||
            "https://placehold.co/300x400/EEE/31343C?text=Image+Not+Found"
          }
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
      </div>
      <div style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "1.25rem",
            marginBottom: "0.5rem",
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "#C19A6B",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          ₹{product.price}
        </p>
        <button
          onClick={() => addToCart(product)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "1rem",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "white",
            backgroundColor: "#111",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#111")}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
