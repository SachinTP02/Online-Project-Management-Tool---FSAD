import React, { useState, useEffect } from 'react';
import { FaUserShield, FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const mockComplaints = [
  { id: 1, user: 'Alice', message: 'Cannot upload file', date: '2025-05-20', status: 'Open' },
  { id: 2, user: 'Bob', message: 'Task not assigned', date: '2025-05-19', status: 'Closed' },
];

export default function Admin() {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [form, setForm] = useState({ user: '', message: '', date: '', status: 'Open' });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState('');
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'admin';
  const navigate = useNavigate();

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
        // Support both direct array and { body: [...] } response
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

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = e => {
    e.preventDefault();
    setComplaints([...complaints, { ...form, id: complaints.length + 1 }]);
    setForm({ user: '', message: '', date: '', status: 'Open' });
  };

  if (!isAdmin) {
    return (
      <div className="feature-page">
        <div className="revamp-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserShield className="feature-icon" style={{ fontSize: 36, color: '#3b82f6', marginRight: 12 }} />
            <h2 className="revamp-title">Administration / Complaints</h2>
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
      <div style={{ margin: '32px 0' }}>
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
      <form className="feature-form revamp-form" onSubmit={handleAdd} style={{
        marginBottom: 32,
        background: '#f8fafc',
        borderRadius: 16,
        padding: 28,
        boxShadow: '0 2px 12px #e0e7ef',
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <FaPlusCircle style={{ fontSize: 22, color: '#3b82f6', marginRight: 8 }} />
          <span style={{ fontWeight: 600, fontSize: 18, color: '#334155' }}>Add Complaint</span>
        </div>
        <div className="revamp-form-row" style={{ gap: 16, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input
            name="user"
            value={form.user}
            onChange={handleChange}
            placeholder="User"
            required
            className="revamp-input"
            style={{
              borderRadius: 10,
              border: '1px solid #d1d5db',
              padding: '10px 14px',
              fontSize: 16,
              background: '#fff',
              boxShadow: '0 1px 2px #f1f5f9',
              outline: 'none',
              minWidth: 220,
              marginBottom: 8,
              transition: 'border 0.2s',
            }}
            onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
            onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
          />
          <input
            name="date"
            value={form.date}
            onChange={handleChange}
            type="date"
            required
            className="revamp-input"
            style={{
              borderRadius: 10,
              border: '1px solid #d1d5db',
              padding: '10px 14px',
              fontSize: 16,
              background: '#fff',
              boxShadow: '0 1px 2px #f1f5f9',
              outline: 'none',
              minWidth: 220,
              marginBottom: 8,
              transition: 'border 0.2s',
            }}
            onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
            onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
          />
          <input
            name="status"
            value={form.status}
            onChange={handleChange}
            placeholder="Status"
            required
            className="revamp-input"
            style={{
              borderRadius: 10,
              border: '1px solid #d1d5db',
              padding: '10px 14px',
              fontSize: 16,
              background: '#fff',
              boxShadow: '0 1px 2px #f1f5f9',
              outline: 'none',
              minWidth: 220,
              marginBottom: 8,
              transition: 'border 0.2s',
            }}
            onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
            onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
            required
            className="revamp-input"
            style={{
              borderRadius: 10,
              border: '1px solid #d1d5db',
              padding: '10px 14px',
              fontSize: 16,
              background: '#fff',
              boxShadow: '0 1px 2px #f1f5f9',
              outline: 'none',
              minWidth: 460,
              minHeight: 44,
              marginBottom: 8,
              transition: 'border 0.2s',
              resize: 'vertical',
              maxWidth: 600,
            }}
            onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
            onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
          />
          <button type="submit" className="revamp-cta-btn" style={{ minWidth: 120, height: 44, fontSize: 16, borderRadius: 10, marginLeft: 16 }}>
            <FaPlusCircle style={{ marginRight: 6 }} /> Add Complaint
          </button>
        </div>
      </form>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <table className="feature-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #e0e7ef', overflow: 'hidden' }}>
          <thead style={{ background: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '14px 18px', fontWeight: 700, color: '#334155', fontSize: 16 }}>User</th>
              <th style={{ padding: '14px 18px', fontWeight: 700, color: '#334155', fontSize: 16 }}>Date</th>
              <th style={{ padding: '14px 18px', fontWeight: 700, color: '#334155', fontSize: 16 }}>Status</th>
              <th style={{ padding: '14px 18px', fontWeight: 700, color: '#334155', fontSize: 16 }}>Message</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 18px', fontSize: 15 }}>{c.user}</td>
                <td style={{ padding: '12px 18px', fontSize: 15 }}>{c.date}</td>
                <td style={{ padding: '12px 18px', fontSize: 15 }}>{c.status}</td>
                <td style={{ padding: '12px 18px', fontSize: 15, maxWidth: 400, wordBreak: 'break-word' }}>{c.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
