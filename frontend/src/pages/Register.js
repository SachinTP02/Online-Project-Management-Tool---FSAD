import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Register({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DEVELOPER'); // Default role
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role })
      });
      if (!response.ok) throw new Error('Registration failed');
      if (onSuccess) onSuccess();
      else navigate('/login');
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
        <div style={{ margin: '16px 0', display: 'flex', gap: 16 }}>
          <label>
            <input
              type="radio"
              name="role"
              value="DEVELOPER"
              checked={role === 'DEVELOPER'}
              onChange={() => setRole('DEVELOPER')}
            />
            Developer
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="MANAGER"
              checked={role === 'MANAGER'}
              onChange={() => setRole('MANAGER')}
            />
            Manager
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Already have an account? <span className="link" onClick={() => { if (onSuccess) onSuccess('login'); }}>Login</span></p>
    </div>
  );
}

export default Register;
