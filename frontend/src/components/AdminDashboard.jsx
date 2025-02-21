import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:7091/api/admin/movies", {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            throw new Error(text || "Failed to fetch movies");
          });
        }
        return res.json();
      })
      .then(data => {
        if (data && data.$values) {
          setMovies(data.$values);
        } else if (Array.isArray(data)) {
          setMovies(data);
        } else {
          console.error("Unexpected response data:", data);
          setMovies([]);
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage(err.message);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://localhost:7091/api/admin/movies/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete movie");
      }
      setMovies(movies.filter(movie => movie.id !== id));
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    }
  };

  return (
    <Layout>
      <section className="admin-dashboard-section">
        <div className="admin-dashboard-header">
          <h2>Admin Dashboard</h2>
          <hr className="section-divider" />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="admin-actions">
          <button
            onClick={() => navigate("/admin/movies/create")}
            className="add-movie-btn"
          >
            Add Movie
          </button>
        </div>

        <ul className="admin-movie-list">
          {movies.map(movie => (
            <li key={movie.id} className="movie-item">
              <div className="movie-info">
                <span className="movie-title">{movie.title}</span>
              </div>
              <div className="movie-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/admin/movies/edit/${movie.id}`)}
                >
                  Edit
                </button>
                <button
                  className="sessions-btn"
                  onClick={() => navigate(`/admin/movies/${movie.id}/sessions`)}
                >
                  Sessions
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(movie.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
