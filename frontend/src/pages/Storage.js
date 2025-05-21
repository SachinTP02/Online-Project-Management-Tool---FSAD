import React, { useState } from 'react';
import { FaCloudUploadAlt, FaFileAlt, FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const mockFiles = [
  { id: 1, name: 'requirements.pdf', uploadedBy: 'Alice', date: '2025-05-10' },
  { id: 2, name: 'design.png', uploadedBy: 'Bob', date: '2025-05-12' },
];

export default function Storage() {
  const [files, setFiles] = useState(mockFiles);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedBy, setUploadedBy] = useState('');
  const navigate = useNavigate();

  // Handle file input change
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploading(true);
    }
  };

  // Handle upload (mock, no backend)
  const handleUpload = e => {
    e.preventDefault();
    if (!selectedFile || !uploadedBy) return;
    setFiles([
      ...files,
      {
        id: files.length + 1,
        name: selectedFile.name,
        uploadedBy,
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setSelectedFile(null);
    setUploadedBy('');
    setUploading(false);
  };

  return (
    <div className="feature-page storage-page revamp-main-bg">
      <div className="revamp-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaCloudUploadAlt className="feature-icon" style={{ fontSize: 36, color: '#3b82f6', marginRight: 12 }} />
          <h2 className="revamp-title" style={{ margin: 0 }}>Online Storage</h2>
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
      <form className="feature-form revamp-form" onSubmit={handleUpload} style={{ marginBottom: 32, background: '#f8fafc', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e0e7ef', display: 'flex', alignItems: 'center', gap: 18 }}>
        <input
          type="file"
          id="file-upload"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="revamp-cta-btn"
          style={{ minWidth: 120, marginLeft: 6, display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <FaPlusCircle style={{ marginRight: 6 }} /> {selectedFile ? 'Change File' : 'Select File'}
        </button>
        {selectedFile && (
          <span style={{ fontWeight: 500, color: '#334155', fontSize: 15 }}>{selectedFile.name}</span>
        )}
        <input
          name="uploadedBy"
          value={uploadedBy}
          onChange={e => setUploadedBy(e.target.value)}
          placeholder="Uploaded by"
          required
          className="revamp-input"
          style={{ borderRadius: 10, border: '1px solid #d1d5db', padding: '10px 14px', fontSize: 16, background: '#fff', boxShadow: '0 1px 2px #f1f5f9', outline: 'none', minWidth: 140, marginBottom: 8, transition: 'border 0.2s' }}
          onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
          onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
        />
        <button
          type="submit"
          className="revamp-cta-btn"
          style={{ minWidth: 120, marginLeft: 6 }}
          disabled={!selectedFile || !uploadedBy}
        >
          <FaCloudUploadAlt style={{ marginRight: 6 }} /> Upload
        </button>
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
