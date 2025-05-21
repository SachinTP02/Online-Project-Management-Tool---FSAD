import React, { useState } from 'react';
import { FaChartLine, FaPlusCircle } from 'react-icons/fa';
import './LandingPage.css';

const mockReports = [
  { id: 1, title: 'Sprint 1 Report', summary: 'Completed initial setup and UI design.', date: '2025-05-15' },
  { id: 2, title: 'Sprint 2 Report', summary: 'Backend API implemented.', date: '2025-05-22' },
];

export default function Reporting() {
  const [reports, setReports] = useState(mockReports);
  const [form, setForm] = useState({ title: '', summary: '', date: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = e => {
    e.preventDefault();
    setReports([...reports, { ...form, id: reports.length + 1 }]);
    setForm({ title: '', summary: '', date: '' });
  };

  return (
    <div className="feature-page">
      <div className="revamp-header-row">
        <FaChartLine className="feature-icon" style={{ fontSize: 36, color: '#3b82f6', marginRight: 12 }} />
        <h2 className="revamp-title" style={{ margin: 0 }}>Project Reporting</h2>
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
          <span style={{ fontWeight: 600, fontSize: 18, color: '#334155' }}>Add New Report</span>
        </div>
        <div className="revamp-form-row" style={{ gap: 16, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Report title"
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
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            placeholder="Summary"
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
            <FaPlusCircle style={{ marginRight: 6 }} /> Add Report
          </button>
        </div>
      </form>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <table className="feature-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #e0e7ef', overflow: 'hidden' }}>
          <thead style={{ background: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '14px 18px', fontWeight: 700, color: '#334155', fontSize: 16 }}>Title</th>
              <th style={{ padding: '14px 18px', fontWeight: 700, color: '#334155', fontSize: 16 }}>Date</th>
              <th style={{ padding: '14px 18px', fontWeight: 700, color: '#334155', fontSize: 16 }}>Summary</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 18px', fontSize: 15 }}>{r.title}</td>
                <td style={{ padding: '12px 18px', fontSize: 15 }}>{r.date}</td>
                <td style={{ padding: '12px 18px', fontSize: 15, maxWidth: 400, wordBreak: 'break-word' }}>{r.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
