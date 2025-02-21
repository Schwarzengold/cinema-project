import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './AdminMovieForm.css';

const AdminMovieForm = ({ mode }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bannerUrl: "",
    trailerUrl: "",
    releaseDate: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = mode === "edit";
  const API_BASE_URL = "https://localhost:7091/api/admin/movies";

  useEffect(() => {
    if (isEditMode && id) {
      fetch(`https://localhost:7091/api/movies/${id}`, { credentials: "include" })
        .then(res => {
          if (!res.ok) {
            return res.text().then(text => {
              throw new Error(text || "Failed to fetch movie");
            });
          }
          return res.json();
        })
        .then(data => {
          if (data && data.$values && data.$values[0]) {
            data = data.$values[0];
          }
          setFormData({
            title: data.title,
            description: data.description,
            bannerUrl: data.bannerUrl,
            trailerUrl: data.trailerUrl,
            releaseDate: data.releaseDate ? data.releaseDate.substring(0, 10) : ""
          });
        })
        .catch(err => {
          console.error(err);
          setErrorMessage(err.message);
        });
    }
  }, [isEditMode, id]);
  

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = API_BASE_URL;
      let method = "POST";
      if (isEditMode) {
        url = `${API_BASE_URL}/${id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to ${isEditMode ? 'edit' : 'create'} movie`);
      }
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    }
  };

  return (
    <Layout>
      <div className="admin-movie-form">
        <h2>{isEditMode ? "Edit Movie" : "Create Movie"}</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="bannerUrl"
            placeholder="Banner URL"
            value={formData.bannerUrl}
            onChange={handleChange}
          />
          <input
            type="text"
            name="trailerUrl"
            placeholder="Trailer URL"
            value={formData.trailerUrl}
            onChange={handleChange}
          />
          <input
            type="date"
            name="releaseDate"
            placeholder="Release Date"
            value={formData.releaseDate}
            onChange={handleChange}
            required
          />
          <button type="submit">{isEditMode ? "Save Changes" : "Add Movie"}</button>
        </form>
      </div>
    </Layout>
  );
};

export default AdminMovieForm;
