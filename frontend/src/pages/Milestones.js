// src/components/Milestone.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MilestoneModal from './MilestoneModal';
import { useNavigate } from 'react-router-dom';

const Milestones = () => {
    const [milestones, setMilestones] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMilestones = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8080/api/milestones', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMilestones(res.data);
            } catch (err) {
                setError('Failed to fetch milestones');
            } finally {
                setLoading(false);
            }
        };
        fetchMilestones();
    }, []);

    const handleMilestoneCreated = (milestone) => {
        setMilestones([...milestones, milestone]);
    };

    return (
        <div className="feature-page revamp-main-bg" style={{ minHeight: '100vh', padding: 32, background: '#f1f5f9' }}>
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
                        <span style={{ fontSize: 28, color: '#3b82f6', fontWeight: 900 }}>M</span>
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
                        }}>Milestones</h2>
                        <div style={{ color: '#6c6f7b', fontWeight: 500, fontSize: '1.08rem', marginTop: 2, letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Plan, track, and manage project milestones.
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <button
                    className="revamp-cta-btn"
                    style={{ marginBottom: 24, fontSize: 16, borderRadius: 10, padding: '10px 24px', background: '#2563eb', color: '#fff', fontWeight: 700, border: 'none', boxShadow: '0 1px 4px #dbeafe', cursor: 'pointer', transition: 'background 0.2s' }}
                    onClick={() => setShowModal(true)}
                    onMouseOver={e => (e.target.style.background = '#1d4ed8')}
                    onMouseOut={e => (e.target.style.background = '#2563eb')}
                >
                    + Add Milestone
                </button>
                <MilestoneModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onMilestoneCreated={handleMilestoneCreated}
                />
                {loading ? (
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: 18 }}>Loading milestones...</div>
                ) : error ? (
                    <div style={{ color: 'red', textAlign: 'center', margin: 24 }}>{error}</div>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%', maxWidth: 700 }}>
                        {milestones.length === 0 ? (
                            <li style={{ color: '#64748b', fontWeight: 500, fontSize: 16, textAlign: 'center', padding: 24, background: '#fff', borderRadius: 12, border: '1.5px solid #e0e7ef', boxShadow: '0 1px 6px #e0e7ef' }}>No milestones found.</li>
                        ) : (
                            milestones.map(m => (
                                <li key={m.id} style={{
                                    background: 'linear-gradient(90deg, #f8fafc 60%, #e0e7ef 100%)',
                                    marginBottom: 20,
                                    padding: 28,
                                    borderRadius: 16,
                                    boxShadow: '0 4px 18px #e0e7ef',
                                    border: '1.5px solid #dbeafe',
                                    position: 'relative',
                                    transition: 'box-shadow 0.2s, transform 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8,
                                    overflow: 'hidden',
                                    minHeight: 90,
                                }}
                                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 32px #c7d2fe'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)'; }}
                                onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 18px #e0e7ef'; e.currentTarget.style.transform = 'none'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                        <div style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: '50%',
                                            background: '#e0e7ef',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 14,
                                            boxShadow: '0 1px 4px #dbeafe',
                                            border: '1.5px solid #dbeafe',
                                            fontWeight: 800,
                                            fontSize: 18,
                                            color: '#3b82f6',
                                        }}>{m.name[0]}</div>
                                        <strong style={{ fontSize: 18, color: '#1e293b', fontWeight: 800, letterSpacing: 0.1 }}>{m.name}</strong>
                                        <span style={{ marginLeft: 12, fontSize: 13, fontWeight: 700, color: '#2563eb', background: '#e0e7ef', borderRadius: 8, padding: '2px 12px', border: '1.2px solid #dbeafe', marginRight: 8 }}>ID: {m.id}</span>
                                    </div>
                                    <div style={{ color: '#64748b', fontSize: 15, marginBottom: 2, fontWeight: 500, paddingLeft: 52 }}>Start: {m.startDate} &nbsp;|&nbsp; End: {m.endDate}</div>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Milestones;
