import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, PlusCircle, LogOut } from "lucide-react";

// Define the base URL for your API, now pointing to port 8000.
const API_BASE_URL = "http://localhost:8000/api/admin";
const getApiEndpoint = (tab) => {
  switch (tab) {
    case "products":
      return `${API_BASE_URL}/products`;
    case "fashionfests":
      return `${API_BASE_URL}/fests`;
    default:
      throw new Error("Invalid tab");
  }
};

export default function Admin({ handleLogout }) {
  const [activeTab, setActiveTab] = useState("products");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for the modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const endpoint = getApiEndpoint(activeTab);
        const response = await axios.get(endpoint);
        setData(response.data);
      } catch (err) {
        setError(`Failed to fetch ${activeTab}. Please try again.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setCurrentItem({ ...item });
    } else {
      setIsEditing(false);
      const defaultItem = {
        products: {
          name: "",
          description: "",
          price: 0,
          category: "",
          imageUrl: "",
        },
        fashionfests: {
          name: "",
          location: "",
          city: "",
          startDate: "",
          endDate: "",
          gstNumber: "",
          description: "",
        },
      };
      setCurrentItem(defaultItem[activeTab]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const endpoint = getApiEndpoint(activeTab);
    // Use _id for editing, which is the default for MongoDB documents
    const url = isEditing ? `${endpoint}/${currentItem._id}` : endpoint;
    const method = isEditing ? "put" : "post";

    try {
      // NOTE: For a real app, add token to headers if auth is re-enabled
      const response = await axios[method](url, currentItem);
      if (isEditing) {
        setData((prev) =>
          prev.map((item) =>
            item._id === currentItem._id ? response.data : item
          )
        );
      } else {
        setData((prev) => [...prev, response.data]);
      }
      handleCloseModal();
    } catch (err) {
      setError(
        `Failed to save item. ${err.response?.data?.message || err.message}`
      );
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const endpoint = getApiEndpoint(activeTab);
        // NOTE: For a real app, add token to headers if auth is re-enabled
        await axios.delete(`${endpoint}/${id}`);
        setData((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        setError(
          `Failed to delete item. ${err.response?.data?.message || err.message}`
        );
        console.error(err);
      }
    }
  };

  const renderModalForm = () => {
    if (!currentItem) return null;

    switch (activeTab) {
      case "products":
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={currentItem.name}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={currentItem.description}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                value={currentItem.price}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                value={currentItem.category}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                name="imageUrl"
                value={currentItem.imageUrl}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </>
        );
      case "fashionfests":
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Fest Name</label>
              <input
                type="text"
                name="name"
                value={currentItem.name}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={currentItem.description}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={
                    currentItem.startDate
                      ? currentItem.startDate.split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={
                    currentItem.endDate ? currentItem.endDate.split("T")[0] : ""
                  }
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={currentItem.location}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={currentItem.city}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={currentItem.gstNumber}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderTable = () => {
    if (loading)
      return (
        <div className="text-center p-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    if (error && !showModal)
      return <div className="alert alert-danger">{error}</div>;

    const headers = {
      products: ["Image", "Name", "Category", "Price", "Actions"],
      fashionfests: ["Name", "Location", "City", "Start Date", "Actions"],
    };

    return (
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              {headers[activeTab].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                {activeTab === "products" && (
                  <td>
                    <img
                      src={item.imageUrl || "https://placehold.co/60"}
                      alt={item.name}
                      className="img-thumbnail"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                )}
                <td>{item.name}</td>
                {activeTab === "products" && <td>{item.category}</td>}
                {activeTab === "products" && (
                  <td className="text-danger fw-bold">₹{item.price}</td>
                )}
                {activeTab === "fashionfests" && <td>{item.location}</td>}
                {activeTab === "fashionfests" && <td>{item.city}</td>}
                {activeTab === "fashionfests" && (
                  <td>{new Date(item.startDate).toLocaleDateString()}</td>
                )}
                <td>
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="btn btn-outline-primary btn-sm me-2"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div className="text-center flex-grow-1">
            <h2 className="fw-light">Admin Dashboard</h2>
            <p className="text-muted">Manage your website's content</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger d-flex align-items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
        <div className="card shadow-sm">
          <div className="card-header bg-white border-0">
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "products" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("products")}
                >
                  Manage Products
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "fashionfests" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("fashionfests")}
                >
                  Manage Fashion Fests
                </button>
              </li>
            </ul>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-end mb-3">
              <button
                onClick={() => handleOpenModal()}
                className="btn btn-danger rounded-pill d-inline-flex align-items-center gap-2"
              >
                <PlusCircle size={20} />
                Add New
              </button>
            </div>
            {renderTable()}
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-light">
                    {isEditing ? "Edit" : "Add"} Item
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <form>{renderModalForm()}</form>
                </div>
                {error && (
                  <div className="alert alert-danger mx-3">{error}</div>
                )}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
}
