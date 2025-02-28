import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './Payment.css';

const API_BASE_URL = "https://localhost:7091";

const Payment = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(search), [search]);
  const sessionId = queryParams.get('sessionId') || "";
  const seatsParam = queryParams.get('seats');
  const seatIds = useMemo(
    () => (seatsParam ? seatsParam.split(',').map(Number) : []),
    [seatsParam]
  );

  const ticketTypesParam = queryParams.get('ticketTypes');
  const ticketTypesFromQuery = ticketTypesParam
    ? JSON.parse(decodeURIComponent(ticketTypesParam))
    : {};

  const [session, setSession] = useState(null);
  const [allSeats, setAllSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    fetch(`${API_BASE_URL}/api/sessions/${sessionId}`, { credentials: "include" })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => { throw new Error(text || "Failed to load session data"); });
        }
        return res.json();
      })
      .then(data => setSession(data))
      .catch(err => {
        console.error("Failed to load session data:", err);
        setErrorMessage(err.message);
      });
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`${API_BASE_URL}/api/sessions/${sessionId}/seats`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const seatsArray = Array.isArray(data) ? data : (data.$values || []);
        setAllSeats(seatsArray);
      })
      .catch(err => console.error("Failed to load seats:", err));
  }, [sessionId]);

  useEffect(() => {
    const filtered = allSeats.filter(seat => seatIds.includes(seat.id));
    setSelectedSeats(filtered);
  }, [allSeats, seatIds]);

  const getTicketPrice = (seatId) => {
    if (!session) return 0;
    const type = ticketTypesFromQuery[seatId];
    if (!type) return 0;

    switch (type) {
      case "Adult":
        return session.adultPrice || 0;
      case "Child":
        return session.childPrice || 0;
      case "Disabled":
        return session.disabledPrice || 0;
      default:
        return 0;
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((sum, seat) => sum + getTicketPrice(seat.id), 0);
  };

  const handlePayment = async () => {
    const payload = {
      sessionId: parseInt(sessionId),
      seatIds,
      ticketTypes: ticketTypesFromQuery,
      userId: localStorage.getItem('userEmail')
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/booking/confirm`, {
        method: "POST",
        credentials: "include",
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
        {errorMessage && <p className="error">{errorMessage}</p>}
        {session ? (
          <div className="payment-details">
            <p><strong>Movie:</strong><span className='bold-font'> {session.movie ? session.movie.title : "Unknown Movie"}</span></p>
            <p><strong>Hall:</strong><span className='bold-font'> {session.cinemaHall ? session.cinemaHall.name : "Unknown Hall"}</span></p>
            <p>
              <strong>Seats:</strong><span className='bold-font'>{" "}
              {selectedSeats.map(seat => `Row ${seat.row}, Seat ${seat.number}`).join(" | ")}
            </span></p>
            <p><strong>Total Price: </strong><span className='bold-font'>{calculateTotal().toFixed(2)}$</span></p>
          </div>
        ) : (
          <p>Loading session details...</p>
        )}

        <button className="payment-btn" onClick={handlePayment}>
          Complete Purchase
        </button>
      </div>
    </Layout>
  );
};

export default Payment;
