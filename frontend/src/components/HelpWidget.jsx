import React, { useState } from "react";
import axios from "axios";
import { HelpCircle, X, Send } from "lucide-react";

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/complaints", formData);
      setSuccess("Your message has been sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => {
        setIsOpen(false);
        setSuccess("");
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          backgroundColor: "#111",
          color: "white",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          zIndex: 1010,
          transition: "transform 0.3s ease, background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {isOpen ? <X size={28} /> : <HelpCircle size={28} />}
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "6.5rem",
            right: "2rem",
            width: "350px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            zIndex: 1009,
            fontFamily: "'Inter', sans-serif",
            overflow: "hidden",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            transform: isOpen ? "translateY(0)" : "translateY(20px)",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <header
            style={{
              padding: "1rem 1.5rem",
              backgroundColor: "#f8f8f8",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
              Contact Support
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={20} color="#666" />
            </button>
          </header>
          <form onSubmit={handleSubmit} style={{ padding: "1.5rem" }}>
            {success ? (
              <p
                style={{
                  color: "green",
                  textAlign: "center",
                  height: "280px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {success}
              </p>
            ) : (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
                <textarea
                  name="message"
                  placeholder="How can we help?"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  style={{ ...inputStyle, height: "100px", resize: "none" }}
                />
                {error && (
                  <p
                    style={{
                      color: "#D8000C",
                      fontSize: "0.9rem",
                      margin: "0 0 1rem 0",
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </p>
                )}
                <button type="submit" style={buttonStyle} disabled={loading}>
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  marginBottom: "1rem",
  fontSize: "0.9rem",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#111",
  color: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontSize: "0.95rem",
  fontWeight: 500,
};
