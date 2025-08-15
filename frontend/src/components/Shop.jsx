import { useState, useEffect } from "react";
import { Star, Grid, List } from "lucide-react";
import axios from "axios";

export default function Shop({ recommendations = [], cartItems, setCartItems }) {
  const [viewMode, setViewMode] = useState("grid");
  const [adminProducts, setAdminProducts] = useState([]);
  const djangoServerUrl = "http://127.0.0.1:8001/media/";

  useEffect(() => {
    const fetchAdminProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/admin-products");
        setAdminProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch admin products:", error);
      }
    };
    fetchAdminProducts();
  }, []);

  const addToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productToAdd.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...productToAdd, quantity: 1 }];
    });
    alert(`${productToAdd.name} has been added to your bag!`);
  };

  const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const productId = product.id || product._id;
    const productName = product.productDisplayName || product.name;
    const productPrice = product.price_inr || product.price;
    const productCategory = product.articleType || product.category || "Fashion";
    let imageSource = "https://placehold.co/400x550/f0f0f0/ccc?text=TrendyWare";
    if (product.imageUrl) imageSource = product.imageUrl;
    else if (product.image) imageSource = `${djangoServerUrl}${product.image}`;

    return (
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px',
          backgroundColor: '#fff'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={imageSource}
          alt={productName}
          style={{
            width: '100%',
            height: '450px',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
          onError={(e) => { e.target.src = "https://placehold.co/400x550/f0f0f0/ccc?text=Not+Found"; }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.5rem',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          color: 'white',
          transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.4s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h5 style={{ fontFamily: "'Lora', serif", margin: '0 0 0.5rem 0' }}>{productName}</h5>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 'bold', color: '#C19A6B', margin: '0 0 1rem 0' }}>₹{productPrice}</p>
          <button
            style={{
              fontFamily: "'Inter', sans-serif",
              background: 'white',
              color: 'black',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => addToCart({ id: productId, name: productName, price: productPrice, image: imageSource })}
          >
            Add to Bag
          </button>
        </div>
      </div>
    );
  };

  const renderProducts = (products) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      {products.map((p) => <ProductCard key={p.id || p._id} product={p} />)}
    </div>
  );

  return (
    <div style={{ backgroundColor: '#F8F8F8', minHeight: '100vh' }}>
      <header style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'white' }}>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: '3rem', fontWeight: 400 }}>Our Collection</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", color: '#666', marginTop: '0.5rem' }}>Timeless pieces, ethically crafted.</p>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {recommendations.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: "'Lora', serif", marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>Recommended For You</h2>
            {renderProducts(recommendations)}
          </section>
        )}
        <section>
          <h2 style={{ fontFamily: "'Lora', serif", marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>All Products</h2>
          {renderProducts(adminProducts)}
        </section>
      </div>
    </div>
  );
}