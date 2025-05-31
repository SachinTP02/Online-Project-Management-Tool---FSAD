import React, { useEffect, useState } from 'react';

export default function UserComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchComplaints();
    // Optionally, poll for updates or use websockets for real-time notification
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/complaints/user/${username}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch complaints');
      setComplaints(await res.json());
    } catch (err) {
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', marginTop: 32 }}>
      <h3 style={{ fontWeight: 600, fontSize: 20 }}>My Complaints</h3>
      {loading ? <div>Loading...</div> : null}
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <table style={{ width: '100%', background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px #e0e7ef', marginBottom: 24 }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ padding: 10 }}>Content</th>
            <th style={{ padding: 10 }}>Status</th>
            <th style={{ padding: 10 }}>Admin Reply</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 && !loading && (
            <tr><td colSpan={3} style={{ textAlign: 'center', color: '#888', padding: 16 }}>No complaints</td></tr>
          )}
          {complaints.map(c => (
            <tr key={c.id} style={c.status === 'CLOSED' && !c.seen ? { background: '#e0f2fe' } : {}}>
              <td style={{ padding: 10 }}>{c.content}</td>
              <td style={{ padding: 10 }}>{c.status}</td>
              <td style={{ padding: 10 }}>{c.adminComment || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
