import React, { useState } from 'react';
import axios from 'axios';

export default function MilestoneModal({ show, onClose, onMilestoneCreated }) {
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', targetDate: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.startDate || !form.endDate || !form.targetDate) {
      setError('Please fill all fields');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8080/api/milestones', {
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
        targetDate: form.targetDate,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onMilestoneCreated(res.data);
      setForm({ name: '', startDate: '', endDate: '', targetDate: '' });
      onClose();
    } catch (err) {
      setError('Failed to create milestone');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 340, boxShadow: '0 2px 16px #cbd5e1', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button>
        <h3 style={{ marginBottom: 18, fontWeight: 600, fontSize: 20 }}>Add Milestone</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Milestone Name" required style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16 }} />
          <label style={{fontWeight:500, color:'#334155'}}>Start Date</label>
          <input name="startDate" value={form.startDate} onChange={handleChange} type="date" required style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16 }} />
          <label style={{fontWeight:500, color:'#334155'}}>End Date</label>
          <input name="endDate" value={form.endDate} onChange={handleChange} type="date" required style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16 }} />
          <label style={{fontWeight:500, color:'#334155'}}>Target Date</label>
          <input name="targetDate" value={form.targetDate} onChange={handleChange} type="date" required style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16 }} placeholder="Target Date" />
          <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, marginTop: 8 }} disabled={loading}>{loading ? 'Saving...' : 'Save Milestone'}</button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </div>
    </div>
  );
}
