import React, { useState } from 'react';

export default function ComplaintModal({ show, onClose, onSubmit }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(content);
      setContent('');
      onClose();
    } catch (err) {
      setError('Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 340, boxShadow: '0 2px 16px #cbd5e1', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button>
        <h3 style={{ marginBottom: 18, fontWeight: 600, fontSize: 20 }}>Submit a Complaint</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Describe your complaint..." required style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16, minHeight: 80 }} />
          <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, marginTop: 8 }} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </div>
    </div>
  );
}
