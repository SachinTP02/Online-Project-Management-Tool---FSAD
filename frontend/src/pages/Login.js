import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Login({ onSuccess }) {
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
      // Set all possible role keys for compatibility
      if (data.role) {
        localStorage.setItem('role', data.role.toLowerCase());
        localStorage.setItem('userRole', data.role.toLowerCase());
      } else if (data.userRole) {
        localStorage.setItem('role', data.userRole.toLowerCase());
        localStorage.setItem('userRole', data.userRole.toLowerCase());
      } else if (data.authorities && Array.isArray(data.authorities) && data.authorities.length > 0) {
        const role = data.authorities[0].authority?.replace('ROLE_', '').toLowerCase();
        localStorage.setItem('role', role);
        localStorage.setItem('userRole', role);
      }
      localStorage.setItem('username', username);
      if (onSuccess) onSuccess(username);
      else navigate('/dashboard');
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
      <p>Don't have an account? <span className="link" onClick={() => { if (onSuccess) onSuccess('register'); }}>Register</span></p>
    </div>
  );
}

export default Login;
