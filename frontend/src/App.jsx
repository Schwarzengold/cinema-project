import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import Registration from './components/Registration';
import Login from './components/Login';
import SeatSelection from './components/SeatSelection';
import TicketTypeSelection from './components/TicketTypeSelection';
import Payment from './components/Payment';
import Confirmation from './components/Confirmation';
import AdminDashboard from './components/AdminDashboard';
import AdminMovieForm from './components/AdminMovieForm';
import AdminSessions from './components/AdminSessions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/seat-selection" element={<SeatSelection />} />
        <Route path="/ticket-type-selection" element={<TicketTypeSelection />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/movies/create" element={<AdminMovieForm mode="create" />} />
        <Route path="/admin/movies/edit/:id" element={<AdminMovieForm mode="edit" />} />
        <Route path="/admin/movies/:id/sessions" element={<AdminSessions />} />
      </Routes>
    </Router>
  );
}

export default App;
