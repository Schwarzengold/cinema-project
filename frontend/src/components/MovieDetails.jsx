import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './MovieDetails.css';
import './StarRating.css';

const API_BASE_URL = "https://localhost:7091";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0); 
  const [userRating, setUserRating] = useState(0);
  const [showRatingPopup, setShowRatingPopup] = useState(false);

  const isUserLoggedIn = !!localStorage.getItem('userEmail');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/movies/${id}`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Movie get error:", err);
        setIsLoading(false);
      });

    fetch(`${API_BASE_URL}/api/sessions?movieId=${id}`)
      .then(res => res.json())
      .then(data => {
        const sessionsArray = Array.isArray(data)
          ? data
          : (data.$values ? data.$values : []);
        setSessions(sessionsArray);
      })
      .catch(err => console.error("Session get error:", err));

    fetch(`${API_BASE_URL}/api/movies/${id}/averageRating`)
      .then(res => res.json())
      .then(avg => setAverageRating(avg))
      .catch(err => console.error("Rating fetch error:", err));

  }, [id]);

  const handleBuyTicket = (sessionId) => {
    navigate(`/seat-selection?sessionId=${sessionId}`);
  };

  const handleRatingMouseEnter = () => setShowRatingPopup(true);
  const handleRatingMouseLeave = () => setShowRatingPopup(false);

  const handleStarClick = async (ratingValue) => {
    if (!isUserLoggedIn) return;
    setUserRating(ratingValue);

    try {
      const response = await fetch(`${API_BASE_URL}/api/movies/${id}/rate`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: ratingValue })
      });

      if (!response.ok) {
        const errTxt = await response.text();
        console.error("Rating update error:", errTxt);
        return;
      }

      const data = await response.json();
      setAverageRating(data.averageRating);
    } catch (err) {
      console.error("Failed to rate movie:", err);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="loading-message">
          <p>Load movie data...</p>
        </div>
      </Layout>
    );
  }

  if (!movie) {
    return (
      <Layout>
        <div className="loading-message">
          <p>No movie found or error.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="movie-details-section">
        <div className="movie-details-header">
          <h1 className="movie-title">{movie.title}</h1>
          <div
            className="star-rating-display"
            onMouseEnter={handleRatingMouseEnter}
            onMouseLeave={handleRatingMouseLeave}
          >
            <div className="stars-outer">
              <div
                className="stars-inner"
                style={{ width: `${(averageRating / 5) * 100}%` }}
              />
            </div>
            <span className="rating-number">{averageRating.toFixed(1)}</span>

            {showRatingPopup && (
              <div className="rating-popup">
                {isUserLoggedIn ? (
                  <>
                    <p>Rate this film!</p>
                    <div className="interactive-star-rating">
                      {[1,2,3,4,5].map(starValue => (
                        <span
                          key={starValue}
                          className={
                            starValue <= userRating
                              ? "star star-full"
                              : "star star-empty"
                          }
                          onClick={() => handleStarClick(starValue)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>You must be logged in to rate this film.</p>
                )}
              </div>
            )}
          </div>

          <hr className="section-divider" />
        </div>

        <div className="movie-details-content">
          {movie.trailerUrl && (
            <div className="trailer-container">
              <iframe
                src={movie.trailerUrl}
                title="Movie Trailer"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          )}
          <div className="movie-info">
            <p className="movie-description">{movie.description}</p>
          </div>
        </div>

        <div className="sessions-section">
          <h2>Sessions</h2>
          <hr className="section-divider" />
          {sessions.length === 0 ? (
            <p className="no-sessions-message">
              No active sessions on this movie
            </p>
          ) : (
            <div className="sessions-grid">
              {sessions.map((session) => (
                <div key={session.id} className="session-card">
                  <div className="session-info">
                    <p>Hall: {session.cinemaHall?.name || "No data"}</p>
                    <p>Start: {new Date(session.startTime).toLocaleString()}</p>
                  </div>
                  <button
                    className="buy-ticket-btn"
                    onClick={() => handleBuyTicket(session.id)}
                  >
                    Buy ticket
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MovieDetails;
