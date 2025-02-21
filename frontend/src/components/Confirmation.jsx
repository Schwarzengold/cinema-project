import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './Confirmation.css';

const Confirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const message = state && state.message ? state.message : "Booking confirmed!";

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div className="confirmation-container">
        <h2>Confirmation</h2>
        <p className="confirmation-message">{message}</p>
        <button className="return-btn" onClick={handleReturn}>
          Return to Home
        </button>
      </div>
    </Layout>
  );
};

export default Confirmation;
