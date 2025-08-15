import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, User, LogOut } from "lucide-react";

export default function Navbar({ isAuthenticated, cartItems, handleLogout }) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const linkStyle = {
    fontFamily: "'Inter', sans-serif",
    textDecoration: 'none',
    color: '#333',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'background-color 0.3s ease',
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#f0f0f0',
  };

  return (
    <nav style={{
      padding: '1.5rem 2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #eee',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Link to="/" style={{
        fontFamily: "'Lora', serif",
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        color: '#111'
      }}>
        TrendyWare
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <NavLink to="/shop" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Shop</NavLink>
        <NavLink to="/fashion-fest" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Fashion Fest</NavLink>
        <NavLink to="/ai-stylist" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>AI Stylist</NavLink>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/cart" style={{ position: 'relative', color: '#333' }}>
          <ShoppingBag size={22} />
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-8px',
              backgroundColor: '#C19A6B',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold'
            }}>
              {totalItems}
            </span>
          )}
        </Link>
        {isAuthenticated ? (
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}>
            <LogOut size={22} />
          </button>
        ) : (
          <Link to="/login" style={{ color: '#333' }}>
            <User size={22} />
          </Link>
        )}
      </div>
    </nav>
  );
}