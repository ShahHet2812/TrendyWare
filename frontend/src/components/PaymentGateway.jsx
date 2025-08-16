import React, { useState } from "react";
import { Lock, CreditCard, Calendar, User, X } from "lucide-react";

export default function PaymentGateway({
  total,
  onPaymentSuccess,
  onPaymentCancel,
}) {
  const [card, setCard] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!card.name.trim()) newErrors.name = "Cardholder name is required.";

    const cardNumber = card.number.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cardNumber))
      newErrors.number = "Card number must be 16 digits.";

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) {
      newErrors.expiry = "Expiry must be in MM/YY format.";
    } else {
      const [month, year] = card.expiry.split("/");
      const expiryDate = new Date(`20${year}`, month - 1);
      const today = new Date();
      if (expiryDate < new Date(today.getFullYear(), today.getMonth())) {
        newErrors.expiry = "Card has expired.";
      }
    }

    if (!/^\d{3,4}$/.test(card.cvv))
      newErrors.cvv = "CVV must be 3 or 4 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      // Simulating a network request to a payment processor
      setTimeout(() => {
        setLoading(false);
        onPaymentSuccess();
      }, 2000);
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === "number") {
      value = value.replace(/\D/g, "").substring(0, 16);
      value = value.replace(/(.{4})/g, "$1 ").trim();
    }
    if (name === "expiry") {
      value = value.replace(/\D/g, "").substring(0, 4);
      if (value.length > 2) {
        value = `${value.substring(0, 2)}/${value.substring(2)}`;
      }
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "").substring(0, 4);
    }

    setCard({ ...card, [name]: value });
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <header style={modalHeaderStyle}>
          <h2 style={{ fontFamily: "'Lora', serif", margin: 0 }}>
            Secure Payment
          </h2>
          <button onClick={onPaymentCancel} style={closeButtonStyle}>
            <X size={24} />
          </button>
        </header>
        <form onSubmit={handleSubmit} style={{ padding: "2rem" }}>
          <InputField
            label="Cardholder Name"
            name="name"
            value={card.name}
            onChange={handleInputChange}
            error={errors.name}
            icon={<User />}
          />
          <InputField
            label="Card Number"
            name="number"
            value={card.number}
            onChange={handleInputChange}
            error={errors.number}
            icon={<CreditCard />}
          />
          <div style={{ display: "flex", gap: "1rem" }}>
            <InputField
              label="Expiry (MM/YY)"
              name="expiry"
              value={card.expiry}
              onChange={handleInputChange}
              error={errors.expiry}
              icon={<Calendar />}
            />
            <InputField
              label="CVV"
              name="cvv"
              value={card.cvv}
              onChange={handleInputChange}
              error={errors.cvv}
              icon={<Lock />}
            />
          </div>
          <button type="submit" style={payButtonStyle} disabled={loading}>
            {loading ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}

const InputField = ({ label, name, value, onChange, error, icon }) => (
  <div style={{ marginBottom: "1.5rem", width: "100%" }}>
    <label
      style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}
    >
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#999",
        }}
      >
        {React.cloneElement(icon, { size: 20 })}
      </span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        style={{
          ...inputStyle,
          paddingLeft: "40px",
          borderColor: error ? "red" : "#ddd",
        }}
      />
    </div>
    {error && (
      <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.25rem" }}>
        {error}
      </p>
    )}
  </div>
);

// Styles
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1050,
};
const modalContentStyle = {
  backgroundColor: "white",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "450px",
  boxShadow: "0 5px 25px rgba(0,0,0,0.15)",
  fontFamily: "'Inter', sans-serif",
};
const modalHeaderStyle = {
  padding: "1.5rem",
  borderBottom: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const closeButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#999",
};
const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  boxSizing: "border-box",
};
const payButtonStyle = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#111",
  color: "white",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 500,
  transition: "background-color 0.3s ease",
};