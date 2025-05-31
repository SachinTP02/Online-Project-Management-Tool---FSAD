import React, { useState, useEffect } from 'react';
import { FaUserShield } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import ComplaintModal from './ComplaintModal';

export default function Admin() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState('');
  const [user, setUser] = useState(null);
  const [showName, setShowName] = useState(false);
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'admin';
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [complaintError, setComplaintError] = useState('');
  const [reply, setReply] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setUser({ username: storedUsername });
    } else {
      setUser(null);
    }
  }, []);

  const refreshPendingUsers = () => {
    setLoadingUsers(true);
    setUserError('');
    fetch('http://localhost:8080/api/auth/pending-users', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(data => {
        const users = Array.isArray(data) ? data : (Array.isArray(data.body) ? data.body : []);
        setPendingUsers(users);
        setLoadingUsers(false);
      })
      .catch((err) => {
        setUserError('Failed to load pending users: ' + (err.message || 'Unknown error'));
        setLoadingUsers(false);
      });
  };

  useEffect(() => {
    if (isAdmin) {
      refreshPendingUsers();
    }
  }, [isAdmin]);

  const handleUserAction = (username, status) => {
    fetch('http://localhost:8080/api/auth/statusUpdate', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ username, status })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update user');
        setPendingUsers(pendingUsers.filter(u => u.username !== username));
      })
      .catch(() => setUserError('Failed to update user status'));
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoadingComplaints(true);
    setComplaintError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setComplaintError('You are not logged in. Please log in again.');
      setLoadingComplaints(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/api/complaints', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch complaints');
      setComplaints(await res.json());
    } catch (err) {
      setComplaintError('Failed to load complaints');
    } finally {
      setLoadingComplaints(false);
    }
  };

  const handleReply = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:8080/api/complaints/${id}/close`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ adminComment: reply[id] || '' })
    });
    setReply({ ...reply, [id]: '' });
    fetchComplaints();
  };

  if (!isAdmin) {
    return (
      <div className="feature-page">
        <div className="revamp-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserShield className="feature-icon" style={{ fontSize: 36, color: '#3b82f6', marginRight: 12 }} />
            <h2 className="revamp-title">Administration</h2>
          </div>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 22px',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 1px 4px #dbeafe',
              marginLeft: 16,
              marginRight: 12,
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#1d4ed8';
              e.currentTarget.style.boxShadow = '0 2px 8px #93c5fd';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.boxShadow = '0 1px 4px #dbeafe';
            }}
          >
            Back to Home
          </button>
        </div>
        <div style={{ color: '#ef4444', fontWeight: 600, fontSize: 20, marginTop: 40, textAlign: 'center' }}>
          Access Denied: You do not have permission to view this page.
        </div>
      </div>
    );
  }

  return (
    <div className="feature-page revamp-main-bg" style={{ minHeight: '100vh', padding: 0, background: '#f1f5f9' }}>
      <header className="landing-header landing-revamp-header" style={{
        width: '100vw',
        margin: 0,
        padding: 0,
        left: 0,
        right: 0,
        borderRadius: 0,
        position: 'relative',
        boxSizing: 'border-box',
        background: '#fff',
        borderBottom: '1.5px solid #e0e7ef',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 26,
              cursor: 'pointer',
              marginLeft: 0, // flush with left edge
              marginRight: '1.5rem', // space between back and logo
              color: '#2563eb',
              padding: 0,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 19L9 12L15.5 5" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="logo-title landing-revamp-logo">
            <span className="logo-circle">OPM</span>
          </div>
        </div>
        <nav className="landing-nav landing-revamp-nav">
          {user ? (
            <div className="landing-user-info">
              <span
                className="landing-user-avatar revamp-user-avatar"
                onClick={() => setShowName(v => !v)}
                style={{ cursor: 'pointer' }}
                title="Show name"
              >
                {user.username[0].toUpperCase()}
              </span>
              {showName && (
                <span className="landing-user-name">{user.username}</span>
              )}
              <button
                className="nav-btn"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('username');
                  setUser(null);
                  window.location.href = '/';
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button className="nav-btn nav-btn-primary" onClick={() => window.location.href = '/login'} style={{ marginRight: 12 }}>Login</button>
              <button className="nav-btn" onClick={() => window.location.href = '/register'}>Register</button>
            </>
          )}
        </nav>
      </header>
      <div className="revamp-header-row" style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: '1.1rem',
        boxShadow: '0 2px 8px 0 rgba(44,62,80,0.06)',
        border: '1.5px solid #e0e7ef',
        padding: '1.5rem 2.2rem',
        marginBottom: 28,
        marginTop: 0,
        marginLeft: 0,
        position: 'relative',
        overflow: 'visible',
        gap: 24,
        width: '100%',
        maxWidth: '100%',
        justifyContent: 'flex-start',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, width: '100%' }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: '#f3f4f6',
            boxShadow: '0 1px 4px #e0e7ef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
            border: '1.5px solid #e0e7ef',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 28, color: '#3b82f6', fontWeight: 900 }}>A</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="revamp-title" style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#232946',
              marginBottom: 2,
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>Admin Approvals</h2>
            <div style={{ color: '#6c6f7b', fontWeight: 500, fontSize: '1.08rem', marginTop: 2, letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Approve or reject pending user requests.
            </div>
          </div>
        </div>
      </div>
      <div style={{
        background: 'linear-gradient(90deg, #f8fafc 60%, #e0e7ef 100%)',
        borderRadius: 16,
        boxShadow: '0 4px 18px #e0e7ef',
        border: '1.5px solid #dbeafe',
        padding: 32,
        maxWidth: 900,
        margin: '0 auto',
        marginBottom: 32,
        position: 'relative',
        transition: 'box-shadow 0.2s, transform 0.2s',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontWeight: 600, fontSize: 20 }}>Pending User Approvals</h3>
          <button onClick={refreshPendingUsers} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }}>Refresh</button>
        </div>
        {loadingUsers ? <div>Loading users...</div> : null}
        {userError && <div style={{ color: 'red', marginBottom: 8 }}>{userError}</div>}
        <table style={{ width: '100%', maxWidth: 700, background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #e0e7ef', marginBottom: 24 }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ padding: 10 }}>Username</th>
              <th style={{ padding: 10 }}>Email</th>
              <th style={{ padding: 10 }}>Role</th>
              <th style={{ padding: 10 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map(user => (
              <tr key={user.username}>
                <td style={{ padding: 10 }}>{user.username}</td>
                <td style={{ padding: 10 }}>{user.email}</td>
                <td style={{ padding: 10 }}>{user.role}</td>
                <td style={{ padding: 10 }}>
                  <button style={{ marginRight: 8, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }} onClick={() => handleUserAction(user.username, 'ACCEPTED')}>Approve</button>
                  <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }} onClick={() => handleUserAction(user.username, 'REJECTED')}>Reject</button>
                </td>
              </tr>
            ))}
            {pendingUsers.length === 0 && !loadingUsers && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888', padding: 16 }}>No pending users</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ maxWidth: 900, margin: '0 auto', marginTop: 32 }}>
        <h3 style={{ fontWeight: 600, fontSize: 20 }}>Complaints</h3>
        {loadingComplaints ? <div>Loading complaints...</div> : null}
        {complaintError && <div style={{ color: 'red', marginBottom: 8 }}>{complaintError}</div>}
        <table style={{ width: '100%', background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #e0e7ef', marginBottom: 24 }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ padding: 10 }}>User</th>
              <th style={{ padding: 10 }}>Content</th>
              <th style={{ padding: 10 }}>Status</th>
              <th style={{ padding: 10 }}>Admin Comment</th>
              <th style={{ padding: 10 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 && !loadingComplaints && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: 16 }}>No complaints</td></tr>
            )}
            {complaints.map(c => (
              <tr key={c.id}>
                <td style={{ padding: 10 }}>{c.username}</td>
                <td style={{ padding: 10 }}>{c.content}</td>
                <td style={{ padding: 10 }}>{c.status}</td>
                <td style={{ padding: 10 }}>{c.adminComment || (c.status === 'OPEN' ? (
                  <input
                    type="text"
                    value={reply[c.id] || ''}
                    onChange={e => setReply({ ...reply, [c.id]: e.target.value })}
                    placeholder="Type reply..."
                    style={{ width: 120 }}
                  />
                ) : '')}</td>
                <td style={{ padding: 10 }}>
                  {c.status === 'OPEN' ? (
                    <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }} onClick={() => handleReply(c.id)}>Reply & Close</button>
                  ) : 'Closed'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
