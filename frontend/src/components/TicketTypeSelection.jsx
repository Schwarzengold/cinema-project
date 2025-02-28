import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './TicketTypeSelection.css';

const API_BASE_URL = "https://localhost:7091";

const TicketTypeSelection = () => {
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

  const initialTicketTypes = useMemo(() => {
    const init = {};
    seatIds.forEach((id) => {
      init[id] = ticketTypesFromQuery[id] || "Adult";
    });
    return init;
  }, [seatIds, ticketTypesFromQuery]);

  const [ticketTypes, setTicketTypes] = useState(initialTicketTypes);
  const [session, setSession] = useState(null);
  const [allSeats, setAllSeats] = useState([]); 
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`${API_BASE_URL}/api/sessions/${sessionId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text || "Failed to load session data");
          });
        }
        return res.json();
      })
      .then((data) => setSession(data))
      .catch((err) => console.error("Failed to load session data:", err));
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`${API_BASE_URL}/api/sessions/${sessionId}/seats`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const seatsArray = Array.isArray(data) ? data : data.$values || [];
        setAllSeats(seatsArray);
      })
      .catch((err) => console.error("Failed to load seats:", err));
  }, [sessionId]);

  useEffect(() => {
    const filtered = allSeats.filter((seat) => seatIds.includes(seat.id));
    setSelectedSeats(filtered);
  }, [allSeats, seatIds]);

  const handleChange = (seatId, value) => {
    setTicketTypes((prev) => ({ ...prev, [seatId]: value }));
  };

  const getTicketPrice = (seatId) => {
    if (!session) return 0;
    const type = ticketTypes[seatId];
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

  const handleContinue = () => {
    const ticketTypesParam = encodeURIComponent(JSON.stringify(ticketTypes));
    navigate(`/payment?sessionId=${sessionId}&seats=${seatIds.join(',')}&ticketTypes=${ticketTypesParam}`);
  };

  return (
    <Layout>
      <div className="ticket-selection">
        <h2>Select Ticket Types</h2>
        <div className="ticket-list">
          {selectedSeats.map((seat) => (
            <div key={seat.id} className="ticket-item">
              <span className="seat-label">
                Row {seat.row}, Seat {seat.number}
              </span>
              <select
                value={ticketTypes[seat.id] || "Adult"}
                onChange={(e) => handleChange(seat.id, e.target.value)}
              >
                <option value="Adult">Adult</option>
                <option value="Child">Child</option>
                <option value="Disabled">Disabled</option>
              </select>
              <span className="ticket-price">
                Price: {getTicketPrice(seat.id).toFixed(2)}$
              </span>
            </div>
          ))}
        </div>
        <div className="total-price">
          <strong>Total: {calculateTotal().toFixed(2)}$</strong>
        </div>
        <button className="continue-btn1" onClick={handleContinue}>
          Continue to Payment
        </button>
      </div>
    </Layout>
  );
};

export default TicketTypeSelection;
