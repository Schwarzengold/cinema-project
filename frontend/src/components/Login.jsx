import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import './Login.css';

const API_BASE_URL = "https://localhost:7091";

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.registrationMessage) {
      setMessage(location.state.registrationMessage);
    }
  }, [location.state]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/account/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log("Login response:", data);
      if (response.ok) {
        localStorage.setItem('userEmail', formData.email);
        setMessage(data.Message);
        navigate('/');
      } else {
        setMessage("Login failed: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login error: " + error.message);
    }
  };

  return (
    <Layout>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? "text" : "password"}
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
            <button 
              type="button" 
              className="toggle-password" 
              onClick={toggleShowPassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit">Login</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </Layout>
  );
};

export default Login;
