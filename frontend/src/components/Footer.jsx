import { Link } from "react-router-dom"
export default function Footer(){
    return(
        <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3">
              <h5 className="text-danger">TrendyWare</h5>
              <p className="text-white-50">India's destination for modern fashion trends.</p>
            </div>
            <div className="col-md-3">
              <h6 className="fw-bold">Quick Links</h6>
              <ul className="list-unstyled text-white-50">
                <li><Link className="text-white-50 text-decoration-none" to="/shop">Shop</Link></li>
                <li><Link className="text-white-50 text-decoration-none" to="/fashion-fest">Fashion Fest</Link></li>
                <li><Link className="text-white-50 text-decoration-none" to="/ai-stylist">AI Stylist</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="fw-bold">Connect With Us</h6>
              <ul className="list-unstyled text-white-50">
                <li><a href="https://www.instagram.com/het._.shah._?igsh=MW16dHh4Zmc2ZTZ1cA%3D%3D&utm_source=qr" className="text-white-50 text-decoration-none">Instagram</a></li>
                <li><a href="https://www.linkedin.com/in/het-shah-7264472b3" className="text-white-50 text-decoration-none">LinkedIn</a></li>
                <li><a href="https://x.com/SHAHHet94920284" className="text-white-50 text-decoration-none">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-top border-secondary mt-4 pt-3 text-center text-white-50">
            &copy; 2025 TrendyWare. All rights reserved.
          </div>
        </div>
      </footer>
    )
}