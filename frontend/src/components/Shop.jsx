import { useState } from "react";
import { Star, Heart, Grid, List } from "lucide-react";

export default function ShopPage({ cartItems, setCartItems }) {
  const [viewMode, setViewMode] = useState("grid");

  const products = [
    {
      id: 1,
      name: "Festive Anarkali Gown",
      price: 2999,
      originalPrice: 3899,
      image: `https://placehold.co/300x400/E63946/white?text=Anarkali`,
      rating: 4.8,
      reviews: 124,
      category: "Ethnic Wear",
    },
    {
      id: 2,
      name: "Indigo Cotton Kurta",
      price: 1199,
      image: `https://placehold.co/300x400/457B9D/white?text=Kurta`,
      rating: 4.9,
      reviews: 89,
      category: "Kurtas",
    },
    {
      id: 3,
      name: "Banarasi Silk Dupatta",
      price: 899,
      image: `https://placehold.co/300x400/A8DADC/black?text=Dupatta`,
      rating: 4.7,
      reviews: 156,
      category: "Accessories",
    },
    {
      id: 4,
      name: "Chikankari Palazzo",
      price: 1349,
      originalPrice: 1799,
      image: `https://placehold.co/300x400/F1FAEE/black?text=Palazzo`,
      rating: 4.6,
      reviews: 78,
      category: "Bottomwear",
    },
    {
      id: 5,
      name: "Kashmiri Weave Shawl",
      price: 2799,
      image: `https://placehold.co/300x400/1D3557/white?text=Shawl`,
      rating: 4.9,
      reviews: 203,
      category: "Winter",
    },
    {
      id: 6,
      name: "Printed Cotton Saree",
      price: 1599,
      image: `https://placehold.co/300x400/E63946/white?text=Saree`,
      rating: 4.5,
      reviews: 92,
      category: "Sarees",
    },
  ];

  const addToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === productToAdd.id
      );
      if (existingItem) {
        // If item exists, increase its quantity
        return prevItems.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Otherwise, add the new item with quantity 1
      return [...prevItems, { ...productToAdd, quantity: 1 }];
    });
    alert(`${productToAdd.name} has been added to your bag!`);
  };

  return (
    <div className="min-vh-100 bg-light bg-gradient">
      <header className="bg-white py-5 text-center">
        <h1 className="display-5 fw-light">Shopping Collection</h1>
        <p className="text-muted fs-5">
          Explore trending ethnic and fusion styles
        </p>
      </header>
      <div className="bg-white border-top border-bottom py-3">
        <div className="container d-flex justify-content-end align-items-center gap-3">
          <div className="d-flex gap-2">
            <button
              className={`btn ${
                viewMode === "grid" ? "btn-danger" : "btn-outline-secondary"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={16} />
            </button>
            <button
              className={`btn ${
                viewMode === "list" ? "btn-danger" : "btn-outline-secondary"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>
      <section className="container py-5">
        <div
          className={`row g-4 ${
            viewMode === "grid"
              ? "row-cols-1 row-cols-md-2 row-cols-lg-3"
              : "row-cols-1"
          }`}
        >
          {products.map((product) => (
            <div key={product.id} className="col">
              <div className="card h-100 shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <p className="text-muted small mb-1">{product.category}</p>
                  <h5 className="card-title">{product.name}</h5>
                  <div className="d-flex align-items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`me-1 ${
                          i < Math.floor(product.rating)
                            ? "text-warning"
                            : "text-secondary"
                        }`}
                        size={14}
                        fill={
                          i < Math.floor(product.rating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                    <span className="ms-2 text-muted small">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <div>
                      <span className="fw-bold text-danger fs-5 me-2">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-muted text-decoration-line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button
                      className="btn btn-danger rounded-pill"
                      onClick={() => addToCart(product)}
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
