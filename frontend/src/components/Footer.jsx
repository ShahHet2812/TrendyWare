import { Link } from "react-router-dom";

export default function Footer() {
  const linkStyle = {
    color: '#999',
    textDecoration: 'none',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.9rem',
    transition: 'color 0.3s ease'
  };

  const onHover = (e) => e.currentTarget.style.color = '#fff';
  const onLeave = (e) => e.currentTarget.style.color = '#999';

  return (
    <footer style={{ backgroundColor: '#111', color: '#999', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', borderBottom: '1px solid #333', paddingBottom: '3rem' }}>
        <div>
          <h5 style={{ fontFamily: "'Lora', serif", color: 'white', marginBottom: '1rem' }}>TrendyWare</h5>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>Crafting the future of fashion with a touch of heritage.</p>
        </div>
        <div>
          <h6 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>Navigate</h6>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/shop" style={linkStyle} onMouseOver={onHover} onMouseOut={onLeave}>Shop</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/fashion-fest" style={linkStyle} onMouseOver={onHover} onMouseOut={onLeave}>Fashion Fest</Link></li>
            <li><Link to="/ai-stylist" style={linkStyle} onMouseOver={onHover} onMouseOut={onLeave}>AI Stylist</Link></li>
          </ul>
        </div>
        <div>
          <h6 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>Connect</h6>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}><a href="https://www.instagram.com/het._.shah._?igsh=MW16dHh4Zmc2ZTZ1cA%3D%3D&utm_source=qr" style={linkStyle} onMouseOver={onHover} onMouseOut={onLeave}>Instagram</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="https://www.linkedin.com/in/het-shah-7264472b3" style={linkStyle} onMouseOver={onHover} onMouseOut={onLeave}>LinkedIn</a></li>
            <li><a href="https://x.com/SHAHHet94920284" style={linkStyle} onMouseOver={onHover} onMouseOut={onLeave}>Twitter</a></li>
          </ul>
        </div>
      </div>
      <div style={{ textAlign: 'center', paddingTop: '2rem', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem' }}>
        &copy; 2025 TrendyWare. A New Era of Style.
      </div>
    </footer>
  );
}