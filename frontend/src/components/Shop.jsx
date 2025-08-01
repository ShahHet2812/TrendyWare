import { useState } from "react";
import { Star, Grid, List } from "lucide-react";

export default function Shop({ recommendations = [], cartItems, setCartItems }) {
  const [viewMode, setViewMode] = useState("grid");

  // --- FIX #1: Define the base URL for your Django server's media files ---
  const djangoServerUrl = "http://127.0.0.1:8001/media/";

  const addToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productToAdd.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...productToAdd, quantity: 1 }];
    });
    alert(`${productToAdd.productDisplayName || productToAdd.name} has been added to your bag!`);
  };

  const renderProductCard = (product) => (
    <div key={product.id} className="col">
      <div className="card h-100 shadow-sm">
        {/* --- FIX #2: Construct the full image URL using the correct property name --- */}
        <img
          src={`${djangoServerUrl}${product.image}`}
          alt={product.productDisplayName}
          className="card-img-top"
          style={{ height: "300px", objectFit: "cover" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/300x400/EEE/31343C?text=Image+Not+Found";
          }}
        />
        <div className="card-body d-flex flex-column">
          <p className="text-muted small mb-1">{product.articleType || "Fashion"}</p>
          <h5 className="card-title">{product.productDisplayName}</h5>
          <div className="d-flex align-items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`me-1 text-warning`}
                size={14}
                fill={"currentColor"}
              />
            ))}
            <span className="ms-2 text-muted small">(Recommended)</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <div>
              <span className="fw-bold text-danger fs-5 me-2">₹{product.price_inr}</span>
            </div>
            <button
              className="btn btn-danger rounded-pill"
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.productDisplayName,
                  price: product.price_inr,
                  // --- FIX #3: Use the full URL for the cart item image as well ---
                  image: `${djangoServerUrl}${product.image}`,
                })
              }
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100 bg-light bg-gradient">
      <header className="bg-white py-5 text-center">
        <h1 className="display-5 fw-light">Shopping Collection</h1>
        <p className="text-muted fs-5">Explore trending ethnic and fusion styles</p>
      </header>
      <div className="bg-white border-top border-bottom py-3">
        <div className="container d-flex justify-content-end align-items-center gap-3">
          <div className="d-flex gap-2">
            <button
              className={`btn ${viewMode === "grid" ? "btn-danger" : "btn-outline-secondary"}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={16} />
            </button>
            <button
              className={`btn ${viewMode === "list" ? "btn-danger" : "btn-outline-secondary"}`}
              onClick={() => setViewMode("list")}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {recommendations && recommendations.length > 0 && (
        <section className="container py-5">
          <h2 className="mb-4">Recommended For You</h2>
          <div
            className={`row g-4 ${
              viewMode === "grid"
                ? "row-cols-1 row-cols-md-2 row-cols-lg-3"
                : "row-cols-1"
            }`}
          >
            {recommendations.map(renderProductCard)}
          </div>
        </section>
      )}
    </div>
  );
}