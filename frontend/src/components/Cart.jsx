import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function Cart({ cartItems, setCartItems }) {
  const navigate = useNavigate();

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 5000 ? 0 : 99.0;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  // --- THIS IS THE FIX ---
  // This function now calls the correct endpoint on the server.
  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to proceed with your order.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      // The endpoint now matches the one defined in the updated server.js
      await axios.post(
        "http://localhost:8000/api/orders/create",
        {
          products: cartItems.map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Purchase successful! Your order has been placed.");
      setCartItems([]);
      navigate("/shop");
    } catch (err) {
      console.error("Checkout error:", err);
      alert(
        err.response?.data?.message || "Checkout failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">
        <div className="mb-4">
          <Link
            to="/shop"
            className="d-inline-flex align-items-center text-muted text-decoration-none"
          >
            <ArrowLeft className="me-2" /> Continue Shopping
          </Link>
        </div>
        <h1 className="display-5 fw-light mb-4">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <ShoppingBag size={96} className="text-secondary mb-3" />
            <h2 className="h4 text-secondary mb-3">Your cart is empty</h2>
            <Link to="/shop" className="btn btn-danger px-4 py-2 rounded-pill">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="card shadow-sm rounded-4">
                <ul className="list-group list-group-flush">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex align-items-center gap-4 p-3"
                    >
                      <img
                        src={
                          item.image ||
                          `https://placehold.co/90x120/eee/ccc?text=Item`
                        }
                        alt={item.name}
                        className="rounded"
                        style={{
                          width: "90px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.name}</h6>
                        <strong className="text-danger">
                          ₹{item.price.toFixed(2)}
                        </strong>
                      </div>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 fw-semibold">
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm ms-2"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div
                className="card shadow-sm rounded-4 sticky-top"
                style={{ top: "6rem" }}
              >
                <div className="card-body">
                  <h5 className="card-title mb-4">Order Summary</h5>
                  <ul className="list-unstyled mb-4">
                    <li className="d-flex justify-content-between">
                      <span>Subtotal</span>
                      <strong>₹{subtotal.toFixed(2)}</strong>
                    </li>
                    <li className="d-flex justify-content-between">
                      <span>Shipping</span>
                      <strong>
                        {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                      </strong>
                    </li>
                    <li className="d-flex justify-content-between">
                      <span>Tax (12%)</span>
                      <strong>₹{tax.toFixed(2)}</strong>
                    </li>
                    <hr />
                    <li className="d-flex justify-content-between fs-5 fw-bold">
                      <span>Total</span>
                      <span className="text-danger">₹{total.toFixed(2)}</span>
                    </li>
                  </ul>
                  {shipping > 0 && subtotal > 0 && (
                    <div className="alert alert-warning small text-center">
                      Add ₹{(5000 - subtotal).toFixed(2)} more for free
                      shipping!
                    </div>
                  )}
                  <button
                    onClick={handleCheckout}
                    className="btn btn-danger w-100 py-3 mb-3 rounded-pill"
                  >
                    Proceed to Checkout
                  </button>
                  <p className="text-muted text-center small mb-0">
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
