import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Upload, Sparkles } from "lucide-react";

export default function AIStylist({ setRecommendations }) {
  const [file, setFile] = useState(null);
  const [season, setSeason] = useState("Summer");
  const [usage, setUsage] = useState("Casual");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setError("");
    const selectedFile = event.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please upload an image.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("season", season);
    formData.append("usage", usage);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8001/api/stylist/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data && response.data.recommendations) {
        setRecommendations(response.data.recommendations);
        navigate("/shop");
      } else {
        setError("Failed to get valid recommendations.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 80px)",
        padding: "2rem",
        backgroundColor: "#F8F8F8",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Sparkles size={48} color="#C19A6B" style={{ marginBottom: "1rem" }} />
        <h1
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
          }}
        >
          AI Stylist
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "#666",
            marginBottom: "3rem",
          }}
        >
          Upload an image to discover your personalized style recommendations.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
            padding: "2.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          <label
            htmlFor="file-upload"
            style={{
              display: "block",
              padding: "2rem",
              border: "2px dashed #ddd",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "1.5rem",
              transition: "border-color 0.3s ease, background-color 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#C19A6B";
              e.currentTarget.style.backgroundColor = "#fafafa";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#ddd";
              e.currentTarget.style.backgroundColor = "white";
            }}
          >
            <Upload
              size={32}
              color="#999"
              style={{ margin: "0 auto 0.5rem" }}
            />
            <span style={{ fontFamily: "'Inter', sans-serif", color: "#666" }}>
              {file ? file.name : "Click to upload an image"}
            </span>
            <input
              type="file"
              id="file-upload"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <Select
              id="season-select"
              label="Season"
              value={season}
              onChange={setSeason}
              options={["Summer", "Winter", "Fall", "Spring"]}
            />
            <Select
              id="usage-select"
              label="Occasion"
              value={usage}
              onChange={setUsage}
              options={[
                "Casual",
                "Formal",
                "Sports",
                "Party",
                "Work",
                "Ethnic",
              ]}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            style={{
              width: "100%",
              padding: "12px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "1rem",
              fontWeight: 500,
              color: "white",
              backgroundColor: loading || !file ? "#ccc" : "#111",
              border: "none",
              borderRadius: "50px",
              cursor: loading || !file ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            {loading ? "Analyzing..." : "Get Recommendations"}
          </button>
          {error && (
            <p
              style={{
                color: "#D8000C",
                marginTop: "1rem",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

const Select = ({ id, label, value, onChange, options }) => (
  <div style={{ flex: 1, textAlign: "left" }}>
    <label
      htmlFor={id}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.9rem",
        marginBottom: "0.5rem",
        display: "block",
      }}
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontFamily: "'Inter', sans-serif",
        fontSize: "1rem",
      }}
    >
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);
