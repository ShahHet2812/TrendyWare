import React, { useState } from "react";
import axios from "axios";
import { ShieldCheck } from "lucide-react";

export default function OtpVerification({
  email,
  role,
  onVerificationSuccess,
}) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = role === "admin" ? "/admin/verify-otp" : "/verify-otp";

    try {
      const response = await axios.post(`http://localhost:8000${endpoint}`, {
        email,
        otp,
      });
      onVerificationSuccess(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem 0" }}>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <ShieldCheck size={40} color="#C19A6B" style={{ margin: "0 auto" }} />
        <h2 style={{ fontFamily: "'Lora', serif", marginTop: "1rem" }}>
          Verify Your Email
        </h2>
        <p style={{ color: "#666" }}>
          An OTP has been sent to <strong>{email}</strong>. Please enter it
          below.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength="6"
          placeholder="Enter 6-digit OTP"
          required
          style={{
            width: "100%",
            padding: "12px",
            textAlign: "center",
            fontSize: "1.5rem",
            letterSpacing: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ddd",
            marginBottom: "1rem",
          }}
        />
        {error && (
          <p
            style={{
              color: "#D8000C",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "1rem",
            fontFamily: "'Inter', sans-serif",
            fontSize: "1rem",
            fontWeight: 500,
            color: "white",
            backgroundColor: loading ? "#ccc" : "#111",
            border: "none",
            borderRadius: "50px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Verifying..." : "Verify & Register"}
        </button>
      </form>
    </div>
  );
}
