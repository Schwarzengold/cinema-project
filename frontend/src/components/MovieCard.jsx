import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movies/${movie.id}`);
  };

  const handleBuyTicket = (e) => {
    e.stopPropagation();
    navigate(`/movies/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <img src={movie.bannerUrl} alt={movie.title} />
      <div className="movie-card-info">
        <h3>{movie.title}</h3>
        <button onClick={handleBuyTicket}>Buy Ticket</button>
      </div>
    </div>
  );
};

export default MovieCard;
