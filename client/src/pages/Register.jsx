import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form.name, form.email, form.password);
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2 className="auth-title">Create Account</h2>

        <form onSubmit={handleSubmit}>

          <div className="auth-group">
            <label className="auth-label">Name</label>
            <input
              type="text"
              required
              className="auth-input"
              placeholder="Enter your name"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="auth-group">
            <label className="auth-label">Email</label>
            <input
              type="email"
              required
              className="auth-input"
              placeholder="Enter your email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="auth-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              required
              className="auth-input"
              placeholder="Enter your password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button type="submit" className="auth-button">
            Sign Up
          </button>

        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}