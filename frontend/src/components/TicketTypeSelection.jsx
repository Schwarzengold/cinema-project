import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './TicketTypeSelection.css';

const TicketTypeSelection = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const sessionId = queryParams.get('sessionId');
  const seatIds = queryParams.get('seats')
    ? queryParams.get('seats').split(',').map(Number)
    : [];

  const initialTicketTypes = {};
  seatIds.forEach(id => {
    initialTicketTypes[id] = 'Adult';
  });

  const [ticketTypes, setTicketTypes] = useState(initialTicketTypes);

  const handleChange = (seatId, value) => {
    setTicketTypes(prev => ({ ...prev, [seatId]: value }));
  };

  const handleContinue = () => {
    const ticketTypesParam = encodeURIComponent(JSON.stringify(ticketTypes));
    navigate(
      `/payment?sessionId=${sessionId}&seats=${seatIds.join(
        ','
      )}&ticketTypes=${ticketTypesParam}`
    );
  };

  return (
    <Layout>
      <div className="ticket-selection">
        <h2>Select Ticket Types</h2>
        <div className="ticket-list">
          {seatIds.map(seatId => (
            <div key={seatId} className="ticket-item">
              <span className="seat-label">Seat {seatId}</span>
              <select
                value={ticketTypes[seatId]}
                onChange={e => handleChange(seatId, e.target.value)}
              >
                <option value="Adult">Adult</option>
                <option value="Child">Child</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          ))}
        </div>
        <button className="continue-btn" onClick={handleContinue}>
          Continue to Payment
        </button>
      </div>
    </Layout>
  );
};

export default TicketTypeSelection;
