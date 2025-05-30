import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import ProjectPlanner from './pages/ProjectPlanner';
import Reporting from './pages/Reporting';
import Storage from './pages/Storage';
import Calendar from './pages/Calendar';
import Admin from './pages/Admin';
import Milestones from './pages/Milestones';
import TaskPlanner from './pages/TaskPlanner';
import Dashboard from './pages/Dashboard';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) throw new Error('Invalid credentials');
      const data = await response.json();
      localStorage.setItem('token', data.token);
      // Try to get role from data, fallback to authorities, fallback to 'developer'
      let role = data.role || data.userRole;
      if (!role && data.authorities && Array.isArray(data.authorities) && data.authorities.length > 0) {
        role = data.authorities[0].authority?.replace('ROLE_', '').toLowerCase();
      }
      localStorage.setItem('userRole', role || 'developer');
      localStorage.setItem('username', username);
      // Use both navigate and window.location for maximum reliability
      navigate('/dashboard');
      setTimeout(() => { window.location.href = '/dashboard'; }, 100);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (!response.ok) throw new Error('Registration failed');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/planner" element={<ProjectPlanner />} />
        <Route path="/reporting" element={<Reporting />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/milestones" element={<Milestones />} />
        <Route path="/milestone" element={<Milestones />} />
        <Route path="/taskplanner/:projectId" element={<TaskPlanner />} />
      </Routes>
    </Router>
  );
}

export default App;
