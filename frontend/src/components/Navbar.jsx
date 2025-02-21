import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const userEmail = localStorage.getItem('userEmail');
  const isAdmin = userEmail && userEmail.toLowerCase() === "admin@gmail.com";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-group">
        <div className="navbar-brand">
          <Link to="/">Absolute Cinema</Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          {isAdmin && <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>}
        </ul>
      </div>

      <ul className="navbar-links">
        {!userEmail ? (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        ) : (
          <>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
