import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './SeatSelection.css';

const API_BASE_URL = "https://localhost:7091";

const SeatSelection = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const sessionId = queryParams.get('sessionId');

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/sessions/${sessionId}/seats`)
      .then(response => response.json())
      .then(data => {
        const seatsArray = Array.isArray(data)
          ? data
          : (data.$values ? data.$values : []);
        setSeats(seatsArray);
      })
      .catch(err => console.error("Error fetching seats:", err));
  }, [sessionId]);

  const handleSeatClick = seat => {
    if (String(seat.status).toLowerCase() !== "available") return;
    setSelectedSeats(prev =>
      prev.includes(seat.id)
        ? prev.filter(id => id !== seat.id)
        : [...prev, seat.id]
    );
  };

  const handleContinue = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert("You must log in and confirm your email to purchase tickets.");
      navigate("/login");
      return;
    }
    navigate(`/ticket-type-selection?sessionId=${sessionId}&seats=${selectedSeats.join(',')}`);
  };

  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.row;
    if (!acc[row]) {
      acc[row] = [];
    }
    acc[row].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(groupedSeats).sort((a, b) => a - b);
  console.log("sortedRows:", sortedRows);
  return (
    <Layout>
      <h2 className='header-seats'>Select Seats</h2>
      <div className="seat-grid">
      <h2 className='screen-header'>S  c  r  e  e  n</h2>
      <h2 className='line-header'></h2>
        {sortedRows.map(row => (
          <div key={row} className="seat-row">
            <div className="row-label">Row {row}</div>
            <div 
              className={`${sortedRows.length > 3 ? 'large-rows' : 'small-rows'}`}
            >
              {groupedSeats[row].sort((a, b) => a.number - b.number).map(seat => (
                <div
                  key={seat.id}
                  className={`seat ${String(seat.status).toLowerCase()} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat.number}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="continue-btn" onClick={handleContinue} disabled={selectedSeats.length === 0}>
        Continue
      </button>
    </Layout>
  );
};

export default SeatSelection;
