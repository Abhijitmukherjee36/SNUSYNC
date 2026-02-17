import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff, FiMail, FiUserPlus } from 'react-icons/fi';
import snuLogo from '../assets/snu-logo.png';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    userId: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
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
            <p>Sister Nivedita<br />University</p>
          </div>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2>Create Account</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FiUserPlus className="input-icon" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FiUser className="input-icon" />
            <input
              type="text"
              name="userId"
              placeholder="UserID"
              value={formData.userId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
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

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <button type="submit" className="auth-submit-btn" style={{ marginTop: '8px' }}>
            Sign Up
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>

      {/* Footer */}
      <div className="auth-footer">
        © 2025 SNU ERP System
      </div>
    </div>
  );
};

export default Signup;
