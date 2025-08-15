import { Link } from "react-router-dom";
import { Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const linkStyle = {
    color: "#999",
    textDecoration: "none",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.9rem",
    transition: "color 0.3s ease, letter-spacing 0.3s ease",
    display: "inline-block",
  };

  const onHover = (e) => {
    e.currentTarget.style.color = "#fff";
    e.currentTarget.style.letterSpacing = "0.5px";
  };
  const onLeave = (e) => {
    e.currentTarget.style.color = "#999";
    e.currentTarget.style.letterSpacing = "normal";
  };

  const socialIconStyle = {
    color: "#999",
    transition: "transform 0.3s ease, color 0.3s ease",
  };

  const onSocialHover = (e) => {
    e.currentTarget.style.transform = "scale(1.2)";
    e.currentTarget.style.color = "#fff";
  };

  const onSocialLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.color = "#999";
  };

  return (
    <footer
      style={{
        backgroundColor: "#111",
        color: "#999",
        padding: "5rem 2rem 2rem",
        marginTop: "4rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2rem",
          borderBottom: "1px solid #333",
          paddingBottom: "3rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h5
            style={{
              fontFamily: "'Lora', serif",
              color: "white",
              marginBottom: "1.5rem",
              fontSize: "1.5rem",
            }}
          >
            TrendyWare
          </h5>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#aaa" }}>
            Crafting the future of fashion with a touch of heritage and a vision
            for tomorrow.
          </p>
        </div>
        <div>
          <h6 style={h6Style}>Explore</h6>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <Link
                to="/shop"
                style={linkStyle}
                onMouseOver={onHover}
                onMouseOut={onLeave}
              >
                Shop
              </Link>
            </li>
            <li style={liStyle}>
              <Link
                to="/fashion-fest"
                style={linkStyle}
                onMouseOver={onHover}
                onMouseOut={onLeave}
              >
                Fashion Fests
              </Link>
            </li>
            <li style={liStyle}>
              <Link
                to="/ai-stylist"
                style={linkStyle}
                onMouseOver={onHover}
                onMouseOut={onLeave}
              >
                AI Stylist
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h6 style={h6Style}>Support</h6>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <Link
                to="/contact-us"
                style={linkStyle}
                onMouseOver={onHover}
                onMouseOut={onLeave}
              >
                Contact Us
              </Link>
            </li>
            <li style={liStyle}>
              <Link
                to="/faqs"
                style={linkStyle}
                onMouseOver={onHover}
                onMouseOut={onLeave}
              >
                FAQs
              </Link>
            </li>
            <li style={liStyle}>
              <Link
                to="/privacy-policy"
                style={linkStyle}
                onMouseOver={onHover}
                onMouseOut={onLeave}
              >
                Privacy Policy
              </Link>
            </li>
            <li style={liStyle}>
              <Link
                to="/terms-of-service"
                style={linkStyle}
                onMouseOver={onHover}
                onMouseOut={onLeave}
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h6 style={h6Style}>Connect</h6>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={socialIconStyle}
              onMouseOver={onSocialHover}
              onMouseOut={onSocialLeave}
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              style={socialIconStyle}
              onMouseOver={onSocialHover}
              onMouseOut={onSocialLeave}
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={socialIconStyle}
              onMouseOver={onSocialHover}
              onMouseOut={onSocialLeave}
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.85rem",
          color: "#777",
        }}
      >
        &copy; {new Date().getFullYear()} TrendyWare. A New Era of Style.
      </div>
    </footer>
  );
}

const h6Style = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: "600",
  color: "white",
  marginBottom: "1.5rem",
  textTransform: "uppercase",
  letterSpacing: "1px",
  fontSize: "0.9rem",
};

const ulStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const liStyle = {
  marginBottom: "0.8rem",
};
