import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, PlusCircle, LogOut, X } from "lucide-react";

const API_BASE_URL = "http://localhost:8000/api/admin";
const getApiEndpoint = (tab) => ({
  products: `${API_BASE_URL}/products`,
  fashionfests: `${API_BASE_URL}/fests`,
}[tab]);

export default function Admin({ handleLogout }) {
  const [activeTab, setActiveTab] = useState("products");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(getApiEndpoint(activeTab));
        setData(response.data);
      } catch (err) {
        setError(`Failed to fetch ${activeTab}. Please try again.`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleOpenDrawer = (item = null) => {
    const defaultItem = {
      products: { name: "", description: "", price: 0, category: "", imageUrl: "" },
      fashionfests: { name: "", location: "", city: "", startDate: "", endDate: "", gstNumber: "", description: "" },
    };
    setIsEditing(!!item);
    setCurrentItem(item ? { ...item } : defaultItem[activeTab]);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentItem(null);
    setError("");
  };

  const handleSave = async () => {
    const url = isEditing ? `${getApiEndpoint(activeTab)}/${currentItem._id}` : getApiEndpoint(activeTab);
    const method = isEditing ? "put" : "post";
    try {
      const response = await axios[method](url, currentItem);
      setData(isEditing ? data.map(item => item._id === currentItem._id ? response.data : item) : [...data, response.data]);
      handleCloseDrawer();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save. Please check the fields.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${getApiEndpoint(activeTab)}/${id}`);
        setData(data.filter((item) => item._id !== id));
      } catch (err) {
        alert("Failed to delete item.");
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f4f5',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Lora', serif", fontSize: '2.25rem' }}>Admin Dashboard</h1>
            <p style={{ color: '#666' }}>Manage your website's content with ease.</p>
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ddd', color: '#333', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={16} /> Logout
          </button>
        </header>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <TabButton text="Manage Products" isActive={activeTab === 'products'} onClick={() => setActiveTab('products')} />
              <TabButton text="Manage Fashion Fests" isActive={activeTab === 'fashionfests'} onClick={() => setActiveTab('fashionfests')} />
            </div>
            <button onClick={() => handleOpenDrawer()} style={{ background: '#111', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
              <PlusCircle size={18} /> Add New
            </button>
          </div>

          {loading ? <p style={{ padding: '3rem', textAlign: 'center' }}>Loading content...</p> :
            error && !isDrawerOpen ? <p style={{ padding: '3rem', textAlign: 'center', color: 'red' }}>{error}</p> :
            <DataTable data={data} activeTab={activeTab} handleEdit={handleOpenDrawer} handleDelete={handleDelete} />}
        </div>
      </div>
      <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
        <FormDrawer
          item={currentItem}
          setItem={setCurrentItem}
          tab={activeTab}
          isEditing={isEditing}
          error={error}
          onSave={handleSave}
          onClose={handleCloseDrawer}
        />
      </Drawer>
    </div>
  );
}

const TabButton = ({ text, isActive, onClick }) => (
  <button onClick={onClick} style={{
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    backgroundColor: isActive ? '#f0f0f0' : 'transparent',
    color: isActive ? '#111' : '#666',
    transition: 'all 0.3s ease'
  }}>
    {text}
  </button>
);

const DataTable = ({ data, activeTab, handleEdit, handleDelete }) => {
    // ... same as before
    const headers = {
        products: ["Image", "Name", "Category", "Price"],
        fashionfests: ["Name", "Location", "City", "Start Date"],
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                    <tr>
                        {headers[activeTab].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', color: '#666', textTransform: 'uppercase', fontSize: '0.75rem' }}>{h}</th>)}
                        <th style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                             {activeTab === "products" && <td><img src={item.imageUrl || "https://placehold.co/60"} alt={item.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: '4px', margin: '8px 16px' }} /></td>}
                            <td style={{ padding: '12px 16px', fontWeight: 500 }}>{item.name}</td>
                            {activeTab === "products" && <><td>{item.category}</td><td>₹{item.price}</td></>}
                            {activeTab === "fashionfests" && <><td>{item.location}</td><td>{item.city}</td><td>{new Date(item.startDate).toLocaleDateString()}</td></>}
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <button onClick={() => handleEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', marginRight: '1rem' }}><Edit size={16} /></button>
                                <button onClick={() => handleDelete(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const Drawer = ({ isOpen, onClose, children }) => (
  <>
    <div onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transition: 'opacity 0.3s ease',
      zIndex: 1001
    }} />
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '450px',
      maxWidth: '100vw',
      backgroundColor: 'white',
      boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease',
      zIndex: 1002,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {children}
    </div>
  </>
);

const FormDrawer = ({ item, setItem, tab, isEditing, error, onSave, onClose }) => {
    if (!item) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setItem(prev => ({ ...prev, [name]: value }));
    };

    const renderFormFields = () => {
        // ... (This function will render the correct inputs based on the tab)
        // This is a simplified version for brevity
        return Object.keys(item).filter(key => key !== '_id' && key !== '__v').map(key => (
            <div key={key} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'capitalize' }}>{key}</label>
                <input
                    type={key.includes('Date') ? 'date' : key === 'price' ? 'number' : 'text'}
                    name={key}
                    value={item[key]?.split("T")[0] || ""}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
            </div>
        ));
    };

    return (
        <>
            <header style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: "'Lora', serif", fontSize: '1.5rem', margin: 0 }}>{isEditing ? 'Edit' : 'Add'} {tab.slice(0, -1)}</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#999" /></button>
            </header>
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
                <form>
                    {renderFormFields()}
                </form>
            </div>
            <footer style={{ padding: '1.5rem', borderTop: '1px solid #eee' }}>
                 {error && <p style={{ color: '#D8000C', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                <button onClick={onSave} style={{ width: '100%', background: '#111', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}>
                    Save Changes
                </button>
            </footer>
        </>
    );
};