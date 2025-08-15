import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThumbsUp, Plus, Calendar, MapPin, X } from "lucide-react";

const API_URL = "http://localhost:8000/api/fests";

export default function FashionFestPage() {
  const [fests, setFests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'view', 'add', 'edit'
  const [selectedFest, setSelectedFest] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFests = async () => {
      try {
        const response = await axios.get(API_URL);
        setFests(response.data);
      } catch (error) {
        console.error("Error fetching fests:", error);
      }
    };
    fetchFests();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });

  const handleOpenModal = (mode, fest = null) => {
    setError("");
    setModalMode(mode);
    setSelectedFest(fest);
    if (mode === "add") {
      setFormData({
        name: "",
        location: "",
        city: "",
        startDate: "",
        endDate: "",
        gstNumber: "",
        description: "",
      });
    } else if (mode === "edit" && fest) {
      setFormData({
        ...fest,
        startDate: fest.startDate.split("T")[0],
        endDate: fest.endDate.split("T")[0],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMode(null);
    setSelectedFest(null);
  };

  const handleUpvote = async (festId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to upvote.");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/${festId}/upvote`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedFest = response.data;
      setFests(fests.map((fest) => (fest._id === festId ? updatedFest : fest)));
      if (selectedFest && selectedFest._id === festId) {
        setSelectedFest(updatedFest);
      }
    } catch (error) {
      console.error("Error upvoting:", error);
      alert("Failed to upvote fest.");
    }
  };

  return (
    <div style={{ backgroundColor: "#F8F8F8", minHeight: "100vh" }}>
      <header
        style={{
          padding: "6rem 2rem",
          textAlign: "center",
          background: "linear-gradient(to right, #232526, #414345)",
          color: "white",
        }}
      >
        <h1
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "3.5rem",
            fontWeight: 500,
          }}
        >
          Fashion Fests
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.2rem",
            color: "#ccc",
            marginTop: "1rem",
          }}
        >
          Discover exclusive fashion events and showcases across India.
        </p>
      </header>

      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >
          {fests.map((fest) => (
            <FestCard
              key={fest._id}
              fest={fest}
              onSelect={() => handleOpenModal("view", fest)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => handleOpenModal("add")}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#111",
          color: "white",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          transition: "transform 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Plus size={24} />
      </button>

      {showModal && (
        <Modal
          mode={modalMode}
          fest={selectedFest}
          onClose={handleCloseModal}
          onUpvote={handleUpvote}
        />
      )}
    </div>
  );
}

const FestCard = ({ fest, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "2rem",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        cursor: "pointer",
        border: "1px solid #eee",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <h3 style={{ fontFamily: "'Lora', serif", fontSize: "1.5rem" }}>
        {fest.name}
      </h3>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "#666",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          margin: "1rem 0",
        }}
      >
        <MapPin size={16} color="#C19A6B" /> {fest.city}
      </p>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "#666",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Calendar size={16} color="#C19A6B" />{" "}
        {new Date(fest.startDate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })}
      </p>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "#888",
          fontSize: "0.9rem",
          lineHeight: 1.6,
          marginTop: "1rem",
          height: "70px",
          overflow: "hidden",
        }}
      >
        {fest.description.slice(0, 100)}...
      </p>
    </div>
  );
};

const Modal = ({ mode, fest, onClose, onUpvote }) => {
  if (!mode) return null;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "600px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <X size={24} color="#999" />
        </button>

        {mode === "view" && fest && (
          <>
            <h2 style={{ fontFamily: "'Lora', serif", marginTop: 0 }}>
              {fest.name}
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#666" }}>
              <strong>Location:</strong> {fest.location}, {fest.city}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#666" }}>
              <strong>Dates:</strong> {formatDate(fest.startDate)} to{" "}
              {formatDate(fest.endDate)}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "#666" }}>
              {fest.description}
            </p>
            <button
              onClick={() => onUpvote(fest._id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#111",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "50px",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              <ThumbsUp size={16} /> {fest.upvotes.length} Interested
            </button>
          </>
        )}

        {(mode === "add" || mode === "edit") && (
          <p>
            Add/Edit form would be here. Due to complexity, this is a
            placeholder.
          </p>
        )}
      </div>
    </div>
  );
};
