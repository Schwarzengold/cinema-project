import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './AdminSessions.css';

const AdminSessions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [halls, setHalls] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingSessionId, setEditingSessionId] = useState(null);

  const [formData, setFormData] = useState({
    movieId: id,
    cinemaHallId: "",
    startTime: ""
  });

  useEffect(() => {
    fetch(`https://localhost:7091/api/admin/sessions?movieId=${id}`, {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            throw new Error(text || "Failed to fetch sessions");
          });
        }
        return res.json();
      })
      .then(data => {
        if (data && data.$values) {
          setSessions(data.$values);
        } else if (Array.isArray(data)) {
          setSessions(data);
        } else {
          console.error("Unexpected sessions data:", data);
          setSessions([]);
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage(err.message);
      });
  }, [id]);

  useEffect(() => {
    fetch("https://localhost:7091/api/cinemaHalls", {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            throw new Error(text || "Failed to load halls");
          });
        }
        return res.json();
      })
      .then(data => {
        if (data && data.$values) {
          setHalls(data.$values);
        } else if (Array.isArray(data)) {
          setHalls(data);
        } else {
          console.error("Unexpected halls data:", data);
          setHalls([]); 
        }
      })
      .catch(err => {
        console.error("Failed to load halls:", err);
      });
  }, []);
  

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:7091/api/admin/sessions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: parseInt(formData.movieId),
          cinemaHallId: parseInt(formData.cinemaHallId),
          startTime: formData.startTime
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create session");
      }
      const newSession = await response.json();
      let finalSession = newSession;
      if (newSession && newSession.$id && newSession.$values && newSession.$values[0]) {
        finalSession = newSession.$values[0];
      }
      setSessions([...sessions, finalSession]);
      setFormData({
        movieId: id,
        cinemaHallId: "",
        startTime: ""
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    }
  };

  const handleEditClick = (session) => {
    setEditingSessionId(session.id);
    setFormData({
      movieId: session.movieId.toString(),
      cinemaHallId: session.cinemaHallId.toString(),
      startTime: session.startTime ? session.startTime.substring(0, 16) : ""
    });
  };

  const handleEditSession = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://localhost:7091/api/admin/sessions/${editingSessionId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: parseInt(formData.movieId),
          cinemaHallId: parseInt(formData.cinemaHallId),
          startTime: formData.startTime
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to edit session");
      }
      const updatedSession = await response.json();
      let finalSession = updatedSession;
      if (updatedSession && updatedSession.$id && updatedSession.$values && updatedSession.$values[0]) {
        finalSession = updatedSession.$values[0];
      }
      const newSessions = sessions.map(s =>
        s.id === editingSessionId ? finalSession : s
      );
      setSessions(newSessions);
      setEditingSessionId(null);
      setFormData({
        movieId: id,
        cinemaHallId: "",
        startTime: ""
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      const response = await fetch(`https://localhost:7091/api/admin/sessions/${sessionId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete session");
      }
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    }
  };

  return (
    <Layout>
      <div className="admin-sessions">
        <h2>Manage Sessions for Movie ID: {id}</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {!editingSessionId ? (
          <>
            <h3>Add New Session</h3>
            <form onSubmit={handleCreateSession}>
              <select
                name="cinemaHallId"
                value={formData.cinemaHallId}
                onChange={handleChange}
                required
              >
                <option value="">Select Hall</option>
                {halls.map(hall => (
                  <option key={hall.id} value={hall.id}>
                    {hall.name} (Rows: {hall.totalRows}, Seats/Row: {hall.seatsPerRow})
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                name="startTime"
                placeholder="Start Time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
              <button type="submit">Add Session</button>
            </form>
          </>
        ) : (
          <>
            <h3>Edit Session (ID: {editingSessionId})</h3>
            <form onSubmit={handleEditSession}>
              <select
                name="cinemaHallId"
                value={formData.cinemaHallId}
                onChange={handleChange}
                required
              >
                <option value="">Select Hall</option>
                {halls.map(hall => (
                  <option key={hall.id} value={hall.id}>
                    {hall.name}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                name="startTime"
                placeholder="Start Time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
              <button type="submit">Save Changes</button>
              <button
                type="button"
                onClick={() => {
                  setEditingSessionId(null);
                  setFormData({ movieId: id, cinemaHallId: "", startTime: "" });
                }}
              >
                Cancel
              </button>
            </form>
          </>
        )}

        <ul>
          {sessions.map(session => (
            <li key={session.id}>
              Hall: {session.cinemaHallId}, Starts: {session.startTime}
              <div>
                <button onClick={() => handleEditClick(session)}>Edit</button>
                <button onClick={() => handleDeleteSession(session.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default AdminSessions;
