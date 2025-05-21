import React, { useState } from 'react';
import { FaCloudUploadAlt, FaFileAlt, FaPlusCircle } from 'react-icons/fa';
import './LandingPage.css';

const mockFiles = [
  { id: 1, name: 'requirements.pdf', uploadedBy: 'Alice', date: '2025-05-10' },
  { id: 2, name: 'design.png', uploadedBy: 'Bob', date: '2025-05-12' },
];

export default function Storage() {
  const [files, setFiles] = useState(mockFiles);
  const [form, setForm] = useState({ name: '', uploadedBy: '', date: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = e => {
    e.preventDefault();
    setFiles([...files, { ...form, id: files.length + 1 }]);
    setForm({ name: '', uploadedBy: '', date: '' });
  };

  return (
    <div className="feature-page storage-page revamp-main-bg">
      <div className="revamp-header-row">
        <FaCloudUploadAlt className="feature-icon" style={{ fontSize: 36, color: '#3b82f6', marginRight: 12 }} />
        <h2 className="revamp-title" style={{ margin: 0 }}>Online Storage</h2>
      </div>
      <form className="feature-form revamp-form" onSubmit={handleAdd} style={{ marginBottom: 32, background: '#f8fafc', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e0e7ef' }}>
        <div className="revamp-form-row">
          <input name="name" value={form.name} onChange={handleChange} placeholder="File name" required className="revamp-input" style={{ borderRadius: 10, border: '1px solid #d1d5db', padding: '10px 14px', fontSize: 16, background: '#fff', boxShadow: '0 1px 2px #f1f5f9', outline: 'none', minWidth: 140, marginBottom: 8, transition: 'border 0.2s' }} onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')} onBlur={e => (e.target.style.border = '1px solid #d1d5db')} />
          <input name="uploadedBy" value={form.uploadedBy} onChange={handleChange} placeholder="Uploaded by" required className="revamp-input" style={{ borderRadius: 10, border: '1px solid #d1d5db', padding: '10px 14px', fontSize: 16, background: '#fff', boxShadow: '0 1px 2px #f1f5f9', outline: 'none', minWidth: 140, marginBottom: 8, transition: 'border 0.2s' }} onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')} onBlur={e => (e.target.style.border = '1px solid #d1d5db')} />
          <input name="date" value={form.date} onChange={handleChange} type="date" required className="revamp-input" style={{ borderRadius: 10, border: '1px solid #d1d5db', padding: '10px 14px', fontSize: 16, background: '#fff', boxShadow: '0 1px 2px #f1f5f9', outline: 'none', minWidth: 140, marginBottom: 8, transition: 'border 0.2s' }} onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')} onBlur={e => (e.target.style.border = '1px solid #d1d5db')} />
          <button type="submit" className="revamp-cta-btn" style={{ minWidth: 120, marginLeft: 6  }}>
            <FaPlusCircle style={{ marginRight: 6}} /> Upload
          </button>
        </div>
      </form>
      <div className="revamp-features-grid storage-grid">
        {files.map(f => (
          <div className="revamp-feature-card storage-card" key={f.id} style={{ minWidth: 220, maxWidth: 320, margin: '0 auto' }}>
            <div className="revamp-feature-icon" style={{ marginBottom: 8 }}>
              <FaFileAlt style={{ fontSize: 32, color: '#6366f1' }} />
            </div>
            <div className="revamp-feature-content">
              <h4 style={{ margin: '0 0 6px 0', fontWeight: 600 }}>{f.name}</h4>
              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>Uploaded by <b>{f.uploadedBy}</b></div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>Date: {f.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
