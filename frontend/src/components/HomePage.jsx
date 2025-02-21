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
  
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/movies`)
      .then(response => response.json())
      .then(data => {
        const moviesArray = Array.isArray(data) ? data : (data.$values || []);
        setMovies(moviesArray);
        if (moviesArray.length > 2) {
          setBgImage(moviesArray[2].bannerUrl);
        }
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const settings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    initialSlide: 2,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: false,
    pauseOnDotsHover: false,
    swipe: false,
    draggable: false,
    className: "movie-slider",

    afterChange: (currentSlide) => {
      const centerIndex = (currentSlide + 0) % movies.length;
      if (movies[centerIndex]) {
        setBgImage(movies[centerIndex].bannerUrl);
      }
    },
  };

  return (
    <Layout>
      <section
        className="homepage-section"
        style={{ "--bg-image": `url(${bgImage})` }}
      >
        <div className="homepage-header">
          <h2>Now Showing</h2>
          <hr className="section-divider" />
        </div>

        <Slider {...settings}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Slider>
      </section>
    </Layout>
  );
};

export default HomePage;
