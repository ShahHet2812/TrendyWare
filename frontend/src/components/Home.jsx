import { Link } from "react-router-dom";
import { ShoppingBag, Star, ArrowRight, Heart } from "lucide-react";
import Navbar from "./Navbar.jsx";
export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "Elegant Summer Kurti",
      price: "₹2,999",
      image: "/placeholder.svg?height=400&width=300",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Classic Denim Jacket",
      price: "₹1,999",
      image: "/placeholder.svg?height=400&width=300",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Silk Saree Blouse",
      price: "₹1,499",
      image: "/placeholder.svg?height=400&width=300",
      rating: 4.7,
    },
  ];

  const testimonials = [
    {
      name: "Neha Sharma",
      text: "Fabulous quality and modern designs! I love the ethnic fusion.",
      rating: 5,
    },
    {
      name: "Ananya Verma",
      text: "Top fashion picks at the best prices in India.",
      rating: 5,
    },
    {
      name: "Priya Das",
      text: "Great customer service and super fast delivery across states.",
      rating: 5,
    },
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Hero Section */}
      <header className="text-white text-center d-flex align-items-center justify-content-center"
  style={{
    height: "100vh",
    backgroundImage: "url('/images/hero.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  }}
>
  {/* Overlay */}
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1,
    }}
  />

  {/* Content */}
  <div style={{ zIndex: 2 }}>
    <h1 className="display-3 fw-light mb-4">Elevate Your Ethnic Style</h1>
    <p className="lead mb-4">
      Discover India's latest fashion trends, from modern wear to classic ethnic looks
    </p>
    <Link
        to="/shop"
        className="btn btn-light btn-lg px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2"
        style={{ zIndex: 2 }}>Shop Now <ArrowRight size={20} />
    </Link>
  </div>
</header>


      {/* Featured Products */}
      <section className="py-5">
        <div className="container text-center mb-5">
          <h2 className="fw-light mb-3">Featured Collections</h2>
          <p className="text-muted">Curated styles for every Indian celebration</p>
        </div>
        <div className="container">
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="position-relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: "320px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <div className="d-flex align-items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(product.rating) ? "text-warning" : "text-muted"}
                          fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                        />
                      ))}
                      <span className="ms-2 small text-muted">({product.rating})</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 text-danger">{product.price}</span>
                      <button className="btn btn-danger btn-sm rounded-pill">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-white">
        <div className="container text-center mb-5">
          <h2 className="fw-light mb-3">Voices from Our Indian Customers</h2>
          <p className="text-muted">Authentic feedback from across Bharat</p>
        </div>
        <div className="container">
          <div className="row g-4">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="col-md-4">
                <div className="bg-light p-4 h-100 rounded text-center">
                  <div className="mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={20} className="text-warning" fill="currentColor" />
                    ))}
                  </div>
                  <p className="fst-italic text-muted">"{testimonial.text}"</p>
                  <h6 className="mt-3">{testimonial.name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
