import React, { useState } from 'react';
import { FaTasks, FaUser, FaCalendarAlt, FaPlusCircle } from 'react-icons/fa';
import './LandingPage.css';

const statusColors = {
  'To Do': '#fbbf24',
  'In Progress': '#3b82f6',
  'Done': '#22c55e',
};

const dummyTasks = [
  {
    id: 1,
    name: 'Design UI Mockups',
    assignedTo: { username: 'alice' },
    due: '2025-06-10',
    status: 'To Do',
  },
  {
    id: 2,
    name: 'Setup Database',
    assignedTo: { username: 'bob' },
    due: '2025-06-12',
    status: 'In Progress',
  },
  {
    id: 3,
    name: 'API Integration',
    assignedTo: { username: 'carol' },
    due: '2025-06-15',
    status: 'Done',
  },
];

export default function ProjectPlanner() {
  const [tasks, setTasks] = useState(dummyTasks);
  const [form, setForm] = useState({ name: '', assignedTo: '', due: '', status: 'To Do' });
  const [loading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Add task locally
  const handleAdd = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.assignedTo || !form.due) {
      setError('Please fill all fields');
      return;
    }
    const newTask = {
      id: tasks.length + 1,
      name: form.name,
      assignedTo: { username: form.assignedTo },
      due: form.due,
      status: form.status,
    };
    setTasks([...tasks, newTask]);
    setForm({ name: '', assignedTo: '', due: '', status: 'To Do' });
  };

  return (
    <div className="feature-page planner-page revamp-main-bg">
      <div className="revamp-header-row">
        <FaTasks className="feature-icon" style={{ fontSize: 36, color: '#3b82f6', marginRight: 12 }} />
        <h2 className="revamp-title" style={{ margin: 0 }}>Project Planner</h2>
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
          <span style={{ fontWeight: 600, fontSize: 18, color: '#334155' }}>Add New Task</span>
        </div>
        <div className="revamp-form-row" style={{ gap: 16, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Task name"
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
              minWidth: 140,
              marginBottom: 8,
              transition: 'border 0.2s',
            }}
            onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
            onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
          />
          <input
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            placeholder="Assigned to (user name)"
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
              minWidth: 140,
              marginBottom: 8,
              transition: 'border 0.2s',
            }}
            onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
            onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
          />
          <input
            name="due"
            value={form.due}
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
              minWidth: 140,
              marginBottom: 8,
              transition: 'border 0.2s',
            }}
            onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
            onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="revamp-input"
            style={{
              borderRadius: 10,
              border: '1px solid #d1d5db',
              padding: '10px 14px',
              fontSize: 16,
              background: '#fff',
              boxShadow: '0 1px 2px #f1f5f9',
              outline: 'none',
              minWidth: 140,
              marginBottom: 8,
              transition: 'border 0.2s',
            }}
            onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
            onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <button type="submit" className="revamp-cta-btn" style={{ minWidth: 120, height: 44, fontSize: 16, borderRadius: 10, marginLeft: 16 }}>
            <FaPlusCircle style={{ marginRight: 6 }} /> Add Task
          </button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </form>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: 18 }}>Loading tasks...</div>
      ) : (
        <div className="revamp-features-grid planner-grid">
          {tasks.map(t => (
            <div className="revamp-feature-card planner-card" key={t.id} style={{ minWidth: 220, maxWidth: 320, margin: '0 auto', borderTop: `4px solid ${statusColors[t.status] || '#d1d5db'}` }}>
              <div className="revamp-feature-content">
                <h4 style={{ margin: '0 0 8px 0', fontWeight: 600 }}>{t.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#64748b', marginBottom: 4 }}>
                  <FaUser style={{ marginRight: 6, color: '#6366f1' }} /> {t.assignedTo ? t.assignedTo.username || t.assignedTo : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>
                  <FaCalendarAlt style={{ marginRight: 6, color: '#f59e42' }} /> Due: {t.due || t.endDate || ''}
                </div>
                <span style={{ background: statusColors[t.status] || '#64748b', color: '#fff', borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 500 }}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
