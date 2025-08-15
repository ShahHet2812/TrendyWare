import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import axios from "axios";

export default function LoginPage({ setIsAuthenticated, setUserRole }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/");
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 80px)",
        backgroundColor: "#F8F8F8",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "450px",
          width: "100%",
          backgroundColor: "white",
          padding: "3rem",
          borderRadius: "8px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontFamily: "'Lora', serif",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "#666",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          {isLogin ? "Sign in to continue" : "Join the TrendyWare family"}
        </p>

        <div
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            border: "1px solid #eee",
            borderRadius: "50px",
            padding: "4px",
          }}
        >
          <TabButton
            text="User"
            isActive={role === "user"}
            onClick={() => setRole("user")}
          />
          <TabButton
            text="Admin"
            isActive={role === "admin"}
            onClick={() => setRole("admin")}
          />
        </div>

        <AuthForm
          isLogin={isLogin}
          role={role}
          setIsAuthenticated={setIsAuthenticated}
          setUserRole={setUserRole}
          navigate={navigate}
        />

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: "none",
              border: "none",
              color: "#C19A6B",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}

const AuthForm = ({
  isLogin,
  role,
  setIsAuthenticated,
  setUserRole,
  navigate,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? `/login` : `/signup`;
    const baseUrl = `http://localhost:8000${role === "admin" ? "/admin" : ""}`;

    if (!isLogin && password !== confirmPassword)
      return setError("Passwords do not match.");

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
        window.location.reload(); // Quick way to switch to login form after signup
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isLogin && role === "user" && (
        <Input
          icon={<User />}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={setName}
        />
      )}
      <Input
        icon={<Mail />}
        type="email"
        placeholder="Email"
        value={email}
        onChange={setEmail}
      />
      <Input
        icon={<Lock />}
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={setPassword}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#999",
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />
      {!isLogin && (
        <Input
          icon={<Lock />}
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
      )}

      {error && (
        <p
          style={{ color: "#D8000C", textAlign: "center", fontSize: "0.9rem" }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "1rem",
          fontFamily: "'Inter', sans-serif",
          fontSize: "1rem",
          fontWeight: 500,
          color: "white",
          backgroundColor: "#111",
          border: "none",
          borderRadius: "50px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#111")}
      >
        {isLogin ? "Sign In" : "Create Account"}
      </button>
    </form>
  );
};

const Input = ({ icon, rightIcon, type, placeholder, value, onChange }) => (
  <div
    style={{
      position: "relative",
      marginBottom: "1rem",
    }}
  >
    <span
      style={{
        position: "absolute",
        left: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#999",
      }}
    >
      {React.cloneElement(icon, { size: 18 })}
    </span>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      style={{
        width: "100%",
        padding: "12px 12px 12px 50px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontFamily: "'Inter', sans-serif",
        fontSize: "1rem",
      }}
    />
    {rightIcon && (
      <span
        style={{
          position: "absolute",
          right: "15px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {rightIcon}
      </span>
    )}
  </div>
);

const TabButton = ({ text, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      flex: 1,
      padding: "10px",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500,
      backgroundColor: isActive ? "#111" : "transparent",
      color: isActive ? "white" : "#666",
      transition: "all 0.3s ease",
    }}
  >
    {text}
  </button>
);
