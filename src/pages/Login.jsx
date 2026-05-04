import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import snuLogo from "../assets/snu-logo.png";
import "./Auth.css";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      {/* Background */}
      <div className="auth-bg" />

      {/* Card */}
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo-section">
          <img src={snuLogo} alt="SNU Logo" className="logo-img" />
          <div className="logo-text">
            <h1>SNU</h1>
            <p>
              Sister Nivedita
              <br />
              University
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2>Welcome Back</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FiUser className="input-icon" />
            <input
              type="text"
              placeholder="UserID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className="auth-submit-btn">
            Login
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>

      {/* Footer */}
      <div className="auth-footer">© {new Date().getFullYear()} SNU ERP System</div>
    </div>
  );
};

export default Login;
