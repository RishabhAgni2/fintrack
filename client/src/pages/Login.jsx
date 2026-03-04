import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form.email, form.password);
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2 className="auth-title">Fintrack Login page by Rishabh Agni..</h2>

        <form onSubmit={handleSubmit}>

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
            Login
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}