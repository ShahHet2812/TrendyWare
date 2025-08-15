import { useState, useEffect } from "react";
import { Star, MessageSquare, X } from "lucide-react";
import axios from "axios";

// --- ReviewsModal Component ---
const ReviewsModal = ({ product, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("view"); // 'view' or 'add'

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/products/${product.id}/reviews`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "view") {
      fetchReviews();
    }
  }, [product.id, activeTab]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to post a review.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8000/api/products/${product.id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      setRating(5);
      setActiveTab("view"); // Switch back to view reviews after posting
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post review.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <header
          style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontFamily: "'Lora', serif", margin: 0 }}>
            Reviews for {product.name}
          </h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={24} color="#666" />
          </button>
        </header>
        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
          {activeTab === "view" && (
            <>
              {loading ? (
                <p>Loading reviews...</p>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      paddingBottom: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <p style={{ fontWeight: "bold", margin: 0 }}>
                        {review.username}
                      </p>
                      <div style={{ display: "flex" }}>
                        {Array(review.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              color="#C19A6B"
                              fill="#C19A6B"
                            />
                          ))}
                        {Array(5 - review.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} size={16} color="#e0e0e0" />
                          ))}
                      </div>
                    </div>
                    <p style={{ color: "#555", margin: 0 }}>{review.comment}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first!</p>
              )}
            </>
          )}

          {activeTab === "add" && (
            <form onSubmit={handleSubmitReview}>
              <h4 style={{ marginTop: 0, fontFamily: "'Lora', serif" }}>
                Write a Review
              </h4>
              <div style={{ marginBottom: "1rem" }}>
                <label>Rating:</label>
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      color={star <= rating ? "#C19A6B" : "#e0e0e0"}
                      fill={star <= rating ? "#C19A6B" : "none"}
                      onClick={() => setRating(star)}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </div>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                required
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
              {error && (
                <p
                  style={{
                    color: "#D8000C",
                    fontSize: "0.9rem",
                    textAlign: "center",
                  }}
                >
                  {error}
                </p>
              )}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "1rem",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#111",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
        {isAuthenticated && (
          <footer
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid #eee",
              backgroundColor: "#f8f8f8",
            }}
          >
            {activeTab === "view" ? (
              <button
                onClick={() => setActiveTab("add")}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Write a Review
              </button>
            ) : (
              <button
                onClick={() => setActiveTab("view")}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                View Reviews
              </button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
};

export default function Shop({
  recommendations = [],
  cartItems,
  setCartItems,
}) {
  const [adminProducts, setAdminProducts] = useState([]);
  const [selectedProductForReviews, setSelectedProductForReviews] =
    useState(null);
  const djangoServerUrl = "http://127.0.0.1:8001/media/";

  useEffect(() => {
    const fetchAdminProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin-products"
        );
        setAdminProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch admin products:", error);
      }
    };
    fetchAdminProducts();
  }, []);

  const addToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === productToAdd.id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...productToAdd, quantity: 1 }];
    });
    alert(`${productToAdd.name} has been added to your bag!`);
  };

  const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const productId = product.id || product._id;
    const productName = product.productDisplayName || product.name;
    const productPrice = product.price_inr || product.price;
    let imageSource = "https://placehold.co/400x550/f0f0f0/ccc?text=TrendyWare";
    if (product.imageUrl) imageSource = product.imageUrl;
    else if (product.image) imageSource = `${djangoServerUrl}${product.image}`;

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
          position: "relative",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ height: "400px", overflow: "hidden" }}>
          <img
            src={imageSource}
            alt={productName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/400x550/f0f0f0/ccc?text=Not+Found";
            }}
          />
        </div>

        <button
          onClick={() =>
            setSelectedProductForReviews({ id: productId, name: productName })
          }
          title="See Reviews"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "rgba(255,255,255,0.9)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            transition: "transform 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <MessageSquare size={18} color="#333" />
        </button>

        <div style={{ padding: "1.5rem" }}>
          <h3
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "1.25rem",
              marginBottom: "0.5rem",
              minHeight: "48px", // To prevent layout shift
            }}
          >
            {productName}
          </h3>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "#C19A6B",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            ₹{productPrice}
          </p>
          <button
            onClick={() =>
              addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: imageSource,
              })
            }
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
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#333")
            }
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#111")}
          >
            Add to Bag
          </button>
        </div>
      </div>
    );
  };

  const renderProducts = (products) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2rem",
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.id || p._id} product={p} />
      ))}
    </div>
  );

  return (
    <div style={{ backgroundColor: "#F8F8F8", minHeight: "100vh" }}>
      {selectedProductForReviews && (
        <ReviewsModal
          product={selectedProductForReviews}
          onClose={() => setSelectedProductForReviews(null)}
        />
      )}
      <header
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        <h1
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "3rem",
            fontWeight: 400,
          }}
        >
          Our Collection
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "#666",
            marginTop: "0.5rem",
          }}
        >
          Timeless pieces, ethically crafted.
        </p>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {recommendations.length > 0 && (
          <section style={{ marginBottom: "4rem" }}>
            <h2
              style={{
                fontFamily: "'Lora', serif",
                marginBottom: "2rem",
                borderBottom: "1px solid #ddd",
                paddingBottom: "1rem",
              }}
            >
              Recommended For You
            </h2>
            {renderProducts(recommendations)}
          </section>
        )}
        <section>
          <h2
            style={{
              fontFamily: "'Lora', serif",
              marginBottom: "2rem",
              borderBottom: "1px solid #ddd",
              paddingBottom: "1rem",
            }}
          >
            All Products
          </h2>
          {renderProducts(adminProducts)}
        </section>
      </div>
    </div>
  );
}
