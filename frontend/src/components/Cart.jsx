import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import PaymentGateway from "./PaymentGateway"; // Import the new component

export default function Cart({ cartItems, setCartItems }) {
  const navigate = useNavigate();
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

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

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to proceed.");
      navigate("/login");
      return;
    }
    setShowPaymentGateway(true);
  };

  const handlePaymentSuccess = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:8000/api/orders/process-payment",
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
      alert("Purchase successful! A confirmation email has been sent.");
      setCartItems([]);
      setShowPaymentGateway(false);
      navigate("/shop");
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed after payment.");
      setShowPaymentGateway(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "6rem 2rem",
          backgroundColor: "#F8F8F8",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <ShoppingBag size={64} color="#ccc" />
        <h1 style={{ fontFamily: "'Lora', serif", marginTop: "1.5rem" }}>
          Your Bag is Empty
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "#666",
            marginBottom: "2rem",
          }}
        >
          Looks like you haven’t added anything to your bag yet.
        </p>
        <Link
          to="/shop"
          style={{
            fontFamily: "'Inter', sans-serif",
            textDecoration: "none",
            color: "white",
            backgroundColor: "#111",
            padding: "12px 24px",
            borderRadius: "50px",
          }}
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      {showPaymentGateway && (
        <PaymentGateway
          total={total}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={() => setShowPaymentGateway(false)}
        />
      )}
      <div
        style={{
          backgroundColor: "#F8F8F8",
          minHeight: "calc(100vh - 80px)",
          padding: "4rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "3rem",
          }}
        >
          <div>
            <h1 style={{ fontFamily: "'Lora', serif", marginBottom: "2rem" }}>
              My Bag
            </h1>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              }}
            >
              {cartItems.map((item, index) => (
                <CartItem
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  isLast={index === cartItems.length - 1}
                />
              ))}
            </div>
          </div>
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            handleCheckout={handleProceedToCheckout}
          />
        </div>
      </div>
    </>
  );
}

const CartItem = ({ item, updateQuantity, removeItem, isLast }) => (
  <div
    style={{
      display: "flex",
      padding: "1.5rem",
      gap: "1.5rem",
      borderBottom: isLast ? "none" : "1px solid #eee",
    }}
  >
    <img
      src={item.image || `https://placehold.co/90x120/eee/ccc?text=Item`}
      alt={item.name}
      style={{
        width: "100px",
        height: "130px",
        objectFit: "cover",
        borderRadius: "4px",
      }}
    />
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h5 style={{ fontFamily: "'Lora', serif", margin: "0 0 0.5rem 0" }}>
          {item.name}
        </h5>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: "bold",
            color: "#C19A6B",
            margin: 0,
          }}
        >
          ₹{item.price.toFixed(2)}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: "50px",
          }}
        >
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            style={{
              background: "none",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            <Minus size={16} />
          </button>
          <span style={{ padding: "0 8px", fontFamily: "'Inter', sans-serif" }}>
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            style={{
              background: "none",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          onClick={() => removeItem(item.id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#999",
          }}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </div>
);

const OrderSummary = ({ subtotal, shipping, tax, total, handleCheckout }) => (
  <div style={{ position: "sticky", top: "120px" }}>
    <h2 style={{ fontFamily: "'Lora', serif", marginBottom: "2rem" }}>
      Order Summary
    </h2>
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "2rem",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <SummaryRow label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
      <SummaryRow
        label="Shipping"
        value={shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
      />
      <SummaryRow label="Tax (12%)" value={`₹${tax.toFixed(2)}`} />
      <hr
        style={{
          margin: "1.5rem 0",
          border: "none",
          borderTop: "1px solid #eee",
        }}
      />
      <SummaryRow label="Total" value={`₹${total.toFixed(2)}`} isTotal />
      <button
        onClick={handleCheckout}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "2rem",
          fontSize: "1rem",
          fontWeight: 500,
          color: "white",
          backgroundColor: "#111",
          border: "none",
          borderRadius: "50px",
          cursor: "pointer",
        }}
      >
        Proceed to Checkout
      </button>
    </div>
  </div>
);

const SummaryRow = ({ label, value, isTotal = false }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "1rem",
      fontWeight: isTotal ? "bold" : "normal",
      fontSize: isTotal ? "1.2rem" : "1rem",
    }}
  >
    <span>{label}</span>
    <span style={{ color: isTotal ? "#C19A6B" : "#111" }}>{value}</span>
  </div>
);