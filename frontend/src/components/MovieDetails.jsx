import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './MovieDetails.css';

const API_BASE_URL = "https://localhost:7091";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/movies/${id}`)
      .then(response => response.json())
      .then(data => setMovie(data))
      .catch(err => console.error("Error getting movie:", err));

    fetch(`${API_BASE_URL}/api/sessions?movieId=${id}`)
      .then(response => response.json())
      .then(data => {
        const sessionsArray = Array.isArray(data)
          ? data
          : (data.$values ? data.$values : []);
        setSessions(sessionsArray);
      })
      .catch(err => console.error("Error getting sessions:", err));
  }, [id]);

  const handleBuyTicket = (sessionId) => {
    navigate(`/seat-selection?sessionId=${sessionId}`);
  };

  if (!movie) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="movie-details">
        <img src={movie.bannerUrl} alt={movie.title} />
        <h2>{movie.title}</h2>
        <p>{movie.description}</p>
        <div className="sessions">
          <h3>Sessions</h3>
          {sessions.map(session => (
            <div key={session.id} className="session-card">
              <div className="session-info">
                <p>Hall: {session.cinemaHall.name}</p>
                <p>Start: {new Date(session.startTime).toLocaleString()}</p>
              </div>
              <button onClick={() => handleBuyTicket(session.id)}>Buy a ticket</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MovieDetails;
