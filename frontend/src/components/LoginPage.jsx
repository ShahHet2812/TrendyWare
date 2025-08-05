import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import axios from "axios";

export default function LoginPage({ setIsAuthenticated, setUserRole }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("user"); // 'user' or 'admin'
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? `/login` : `/signup`;
    const baseUrl = `http://localhost:8000${role === "admin" ? "/admin" : ""}`;

    if (!email || !password || (!isLogin && role === "user" && !name)) {
      return setError("Please fill in all required fields.");
    }
    if (!isLogin && password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    const payload = isLogin
      ? { email, password }
      : role === "user"
      ? { name, email, password }
      : { email, password };

    try {
      const res = await axios.post(`${baseUrl}${endpoint}`, payload);

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        setIsAuthenticated(true);
        setUserRole(res.data.role);
        navigate(res.data.role === "admin" ? "/admin" : "/shop");
      } else {
        alert(res.data.message);
        setIsLogin(true);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong.";
      setError(message);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light py-5 px-3">
      <div className="w-100" style={{ maxWidth: 500 }}>
        <div className="text-center mb-4">
          <a href="/" className="text-decoration-none fs-2 fw-bold text-danger">
            TrendyWare
          </a>
          <p className="text-muted mt-2">Welcome to premium fashion</p>
        </div>
        <div className="card shadow rounded-4 p-4">
          <div className="btn-group mb-4">
            <button
              className={`btn ${
                role === "user" ? "btn-danger" : "btn-outline-secondary"
              }`}
              onClick={() => setRole("user")}
            >
              User
            </button>
            <button
              className={`btn ${
                role === "admin" ? "btn-danger" : "btn-outline-secondary"
              }`}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>
          <div className="btn-group w-100 mb-4" role="group">
            <button
              type="button"
              className={`btn ${
                isLogin ? "btn-danger" : "btn-outline-secondary"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              type="button"
              className={`btn ${
                !isLogin ? "btn-danger" : "btn-outline-secondary"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>
          {error && (
            <div className="alert alert-danger small p-2 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {!isLogin && role === "user" && (
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}
            <button type="submit" className="btn btn-danger w-100 mb-2">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
