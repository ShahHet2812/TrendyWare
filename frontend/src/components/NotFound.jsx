import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "calc(100vh - 80px)",
        backgroundColor: "#F8F8F8",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontFamily: "'Lora', serif",
          fontSize: "6rem",
          fontWeight: "bold",
          color: "#ddd",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontFamily: "'Lora', serif",
          fontSize: "2rem",
          marginTop: "-1rem",
          marginBottom: "1rem",
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "#666",
          maxWidth: "400px",
          marginBottom: "2rem",
        }}
      >
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          fontFamily: "'Inter', sans-serif",
          textDecoration: "none",
          color: "white",
          backgroundColor: "#111",
          padding: "12px 24px",
          borderRadius: "50px",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          transition: "transform 0.3s ease",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.transform = "translateY(-3px)")
        }
        onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <ArrowLeft size={20} /> Go Back to Home
      </Link>
    </div>
  );
}
