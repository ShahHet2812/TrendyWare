// frontend/src/components/AIStylist.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './AIStylist.css'; // Import the CSS file

const AIStylist = () => {
  const [file, setFile] = useState(null);
  const [season, setSeason] = useState('Summer');
  const [usage, setUsage] = useState('Casual');
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setRecommendations([]);
    setLoading(true);

    if (!file) {
      setError('Please upload an image.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('season', season);
    formData.append('usage', usage);

    try {
      // Make sure your Django backend is running on port 8000
      const response = await axios.post('http://localhost:8001/api/stylist/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.outfits) {
        setRecommendations(response.data.outfits);
      } else {
        setError('Failed to get recommendations from the server.');
      }
    } catch (err) {
      setError('An error occurred while fetching recommendations.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stylist-container">
      <h2>AI Fashion Stylist</h2>
      <p>Upload your photo and let our AI find the perfect outfits for you.</p>

      <form onSubmit={handleSubmit} className="stylist-form">
        <input type="file" onChange={handleFileChange} accept="image/*" required />
        <div className="form-inputs">
          <select value={season} onChange={(e) => setSeason(e.target.value)}>
            <option>Summer</option>
            <option>Winter</option>
            <option>Fall</option>
            <option>Spring</option>
          </select>
          <select value={usage} onChange={(e) => setUsage(e.target.value)}>
            <option>Casual</option>
            <option>Formal</option>
            <option>Sports</option>
            <option>Party</option>
            <option>Work</option>
            <option>Ethnic</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Get Recommendations'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {recommendations.length > 0 && (
        <>
          <h3>Top Recommendations</h3>
          <div className="recommendations-grid">
            {recommendations.map((src, index) => (
              <img key={index} src={src} alt={`Outfit recommendation ${index + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AIStylist;