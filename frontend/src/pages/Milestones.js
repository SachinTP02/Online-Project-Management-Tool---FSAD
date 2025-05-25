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
        <div className="feature-page revamp-main-bg" style={{ minHeight: '100vh', padding: 32 }}>
            <h2 style={{ fontWeight: 700, color: '#2563eb', marginBottom: 24 }}>Milestones</h2>
            <button
                onClick={() => navigate(-1)}
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
                    marginBottom: 16,
                }}
            >
                Back
            </button>
            <button
                className="revamp-cta-btn"
                style={{ marginBottom: 24, fontSize: 16, borderRadius: 8, padding: '10px 24px' }}
                onClick={() => setShowModal(true)}
            >
                + Add Milestone
            </button>
            <MilestoneModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onMilestoneCreated={handleMilestoneCreated}
            />
            {loading ? (
                <div>Loading milestones...</div>
            ) : error ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {milestones.length === 0 ? (
                        <li>No milestones found.</li>
                    ) : (
                        milestones.map(m => (
                            <li key={m.id} style={{ background: '#f1f5f9', marginBottom: 12, padding: 16, borderRadius: 8 }}>
                                <b>{m.name}</b><br/>
                                <span>Start: {m.startDate}</span> | <span>End: {m.endDate}</span>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default Milestones;
