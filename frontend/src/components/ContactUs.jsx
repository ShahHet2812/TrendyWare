import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const h1Style = {
  fontFamily: "'Lora', serif",
  fontSize: "3.5rem",
  fontWeight: 500,
  color: "white",
};

const infoCardStyle = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
};

const iconWrapperStyle = {
  backgroundColor: "#C19A6B",
  color: "white",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 1.5rem auto",
};

export default function ContactUs() {
  return (
    <div
      style={{ backgroundColor: "#F8F8F8", fontFamily: "'Inter', sans-serif" }}
    >
      <header
        style={{
          padding: "6rem 2rem",
          textAlign: "center",
          background: "linear-gradient(to right, #232526, #414345)",
        }}
      >
        <h1 style={h1Style}>Get In Touch</h1>
        <p style={{ fontSize: "1.2rem", color: "#ccc", marginTop: "1rem" }}>
          We'd love to hear from you. Here's how you can reach us.
        </p>
      </header>

      <div
        style={{
          maxWidth: "1200px",
          margin: "-3rem auto 4rem auto",
          padding: "0 2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          <div style={infoCardStyle}>
            <div style={iconWrapperStyle}>
              <Mail size={28} />
            </div>
            <h3 style={{ fontFamily: "'Lora', serif" }}>Email Us</h3>
            <p style={{ color: "#666", lineHeight: 1.6 }}>
              For support, inquiries, or feedback.
            </p>
            <a
              href="mailto:support@trendyware.com"
              style={{
                color: "#C19A6B",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              support@trendyware.com
            </a>
          </div>

          <div style={infoCardStyle}>
            <div style={iconWrapperStyle}>
              <Phone size={28} />
            </div>
            <h3 style={{ fontFamily: "'Lora', serif" }}>Call Us</h3>
            <p style={{ color: "#666", lineHeight: 1.6 }}>
              Mon-Fri, 9am to 6pm IST.
            </p>
            <a
              href="tel:+911234567890"
              style={{
                color: "#C19A6B",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              +91 123 456 7890
            </a>
          </div>

          <div style={infoCardStyle}>
            <div style={iconWrapperStyle}>
              <MapPin size={28} />
            </div>
            <h3 style={{ fontFamily: "'Lora', serif" }}>Visit Us</h3>
            <p style={{ color: "#666", lineHeight: 1.6 }}>
              123 Fashion Avenue,
              <br />
              Ahmedabad, Gujarat, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
