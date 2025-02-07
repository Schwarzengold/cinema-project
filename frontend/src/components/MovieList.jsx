import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import Layout from './Layout';
import './MovieList.css';

const API_BASE_URL = "https://localhost:7091";

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/movies`)
      .then(response => response.json())
      .then(data => {
        const moviesArray = Array.isArray(data)
          ? data
          : (data.$values ? data.$values : []);
        setMovies(moviesArray);
      })
      .catch(err => console.error("Movies fetch error:", err));
  }, []);

  return (
    <Layout>
      <div className="movie-list">
        <h2>All movies</h2>
        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MovieList;
