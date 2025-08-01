import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react"; // Optional: for a nice icon

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
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!file) {
      setError("Please upload an image.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("season", season);
    formData.append("usage", usage);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8001/api/stylist/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.recommendations) {
        setRecommendations(response.data.recommendations);
        navigate("/shop");
      } else {
        setError("Failed to get valid recommendations from the server.");
      }
    } catch (err) {
      console.error("Full error object:", err);

      if (err.response) {
        if (err.response.status === 500) {
          setError("There was a problem on our server. Please try again later.");
        } else {
          setError(`Error: ${err.response.status} - ${err.response.statusText}`);
        }
        console.error("Server responded with:", err.response.data);
      } else if (err.request) {
        setError("Could not connect to the server. Please check your network connection.");
      } else {
        setError("An unexpected error occurred while sending the request.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="text-center mb-5">
            <h2 className="fw-light">AI Fashion Stylist</h2>
            <p className="text-muted">Upload your photo and let our AI find the perfect outfits for you.</p>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="file-upload" className="form-label">Upload Image</label>
                  <div className="input-group">
                      <input
                        type="file"
                        id="file-upload"
                        className="form-control"
                        onChange={handleFileChange}
                        accept="image/*"
                        aria-describedby="file-upload-help"
                      />
                  </div>
                   <div id="file-upload-help" className="form-text">
                    {file ? `Selected: ${file.name}` : "Please choose a photo."}
                   </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col">
                    <label htmlFor="season-select" className="form-label">Season</label>
                    <select id="season-select" className="form-select" value={season} onChange={(e) => setSeason(e.target.value)}>
                      <option>Summer</option>
                      <option>Winter</option>
                      <option>Fall</option>
                      <option>Spring</option>
                    </select>
                  </div>
                  <div className="col">
                    <label htmlFor="usage-select" className="form-label">Occasion</label>
                    <select id="usage-select" className="form-select" value={usage} onChange={(e) => setUsage(e.target.value)}>
                      <option>Casual</option>
                      <option>Formal</option>
                      <option>Sports</option>
                      <option>Party</option>
                      <option>Work</option>
                      <option>Ethnic</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-danger btn-lg w-100 rounded-pill" disabled={loading || !file}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="ms-2">Analyzing...</span>
                    </>
                  ) : (
                    "Get Recommendations"
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {error && (
            <div className="alert alert-danger mt-4" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}