import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './Registration.css';

const API_BASE_URL = "https://localhost:7091";

const Registration = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/api/account/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (response.ok) {
      navigate('/login', { state: { registrationMessage: "Registration successful. Please check your email to confirm your account before logging in." } });
    } else {
      setMessage("Registration failed: " + JSON.stringify(data));
    }
  };

  return (
    <Layout>
      <div className="registration-container">
        <h2>Register</h2>
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
          <button type="submit">Register</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </Layout>
  );
};

export default Registration;
