
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import MovieCard from './MovieCard';
import Layout from './Layout';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomePage.css';

const API_BASE_URL = "https://localhost:7091";

const HomePage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/movies`)
      .then(response => response.json())
      .then(data => {
        const moviesArray = Array.isArray(data) ? data : (data.$values || []);
        setMovies(moviesArray);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  return (
    <Layout>
      <section className="homepage-section">
        <h2 style={{fontWeight: "600"}}>Now Showing</h2>
        <Slider {...settings}>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Slider>
      </section>
    </Layout>
  );
};

export default HomePage;
