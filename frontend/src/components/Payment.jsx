import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './Payment.css';

const API_BASE_URL = "https://localhost:7091";

const Payment = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const sessionId = queryParams.get('sessionId');
  const seatIds = queryParams.get('seats') 
    ? queryParams.get('seats').split(',').map(Number) 
    : [];
  const ticketTypes = queryParams.get('ticketTypes') 
    ? JSON.parse(decodeURIComponent(queryParams.get('ticketTypes'))) 
    : {};

  const handlePayment = async () => {
    const payload = {
      sessionId: parseInt(sessionId),
      seatIds: seatIds,
      ticketTypes: ticketTypes,
      userId: localStorage.getItem('userEmail')
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/booking/confirm`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Booking error (${response.status}): ${errorText}`);
        return;
      }

      const data = await response.json();
      navigate("/confirmation", { state: { message: data.Message } });
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred during payment. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="payment-container">
        <h2>Payment</h2>
        <div className="payment-details">
          <p><strong>Session:</strong> {sessionId}</p>
          <p><strong>Seats:</strong> {seatIds.join(', ')}</p>
          <p><strong>Ticket Types:</strong> {JSON.stringify(ticketTypes)}</p>
        </div>
        <button className="payment-btn" onClick={handlePayment}>
          Complete Purchase
        </button>
      </div>
    </Layout>
  );
};

export default Payment;
