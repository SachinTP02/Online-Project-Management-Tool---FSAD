import React, { useState, useEffect } from 'react';
import { FaTasks, FaUser, FaPlusCircle } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function ProjectPlanner() {
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', ownername: '', ownerId: '', targetDate: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [milestones, setMilestones] = useState([]);
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    const isManagerOrAdmin = userRole === 'manager' || userRole === 'admin';

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8080/api/projects', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProjects(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch projects.');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        // Fetch milestones for manager
        const fetchMilestones = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8080/api/milestones', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMilestones(res.data);
            } catch (err) {
                setMilestones([]);
            }
        };
        if (isManagerOrAdmin) fetchMilestones();
    }, [isManagerOrAdmin]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleAdd = async e => {
        e.preventDefault();
        setError('');
        const username = localStorage.getItem('username');
        if (!form.name || !form.description || !selectedMilestone) {
            setError('Please fill all fields and select a milestone');
            return;
        }
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.post(
                'http://localhost:8080/api/projects',
                {
                    name: form.name,
                    description: form.description,
                    ownername: username,
                    milestoneId: selectedMilestone.id,
                    startDate: selectedMilestone.startDate,
                    endDate: selectedMilestone.endDate,
                    targetDate: form.targetDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setProjects([...projects, res.data]);
            setForm({ name: '', description: '', ownername: '', ownerId: '', targetDate: '' });
            setSelectedMilestone(null);
        } catch (err) {
            console.error(err);
            setError('Failed to add project.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feature-page planner-page revamp-main-bg">
            <div
                className="revamp-header-row"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaTasks
                        className="feature-icon"
                        style={{ fontSize: 36, color: '#3b82f6', marginRight: 12 }}
                    />
                    <h2 className="revamp-title">Project Planner</h2>
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

            {isManagerOrAdmin && (
                <>
                <form
                    className="feature-form revamp-form"
                    onSubmit={handleAdd}
                    style={{
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
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                        <FaPlusCircle style={{ fontSize: 22, color: '#3b82f6', marginRight: 8 }} />
                        <span style={{ fontWeight: 600, fontSize: 18, color: '#334155' }}>Add New Project</span>
                    </div>
                    {selectedMilestone && (
                        <div style={{ width: '100%', marginBottom: 12, color: '#2563eb', fontWeight: 500, fontSize: 15 }}>
                            Milestone PID: <b>{selectedMilestone.id}</b> | Start: <b>{selectedMilestone.startDate}</b> | End: <b>{selectedMilestone.endDate}</b> | Target: <b>{selectedMilestone.targetDate}</b>
                        </div>
                    )}
                    <div
                        className="revamp-form-row"
                        style={{ gap: 16, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}
                    >
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Project name"
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
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Description"
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
                        {/* Milestone selection - required */}
                        <select
                            name="milestoneId"
                            value={selectedMilestone ? selectedMilestone.id : ''}
                            onChange={e => {
                                const m = milestones.find(m => String(m.id) === e.target.value);
                                setSelectedMilestone(m);
                            }}
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
                                minWidth: 180,
                                marginBottom: 8,
                                transition: 'border 0.2s',
                            }}
                        >
                            <option value="">Select Milestone</option>
                            {milestones.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.name} (PID: {m.id}, {m.startDate} to {m.endDate})
                                </option>
                            ))}
                        </select>
                        <input
                            name="startDate"
                            value={selectedMilestone ? selectedMilestone.startDate : ''}
                            readOnly
                            placeholder="Start Date"
                            className="revamp-input"
                            style={{ borderRadius: 10, border: '1px solid #d1d5db', padding: '10px 14px', fontSize: 16, background: '#f1f5f9', minWidth: 140, marginBottom: 8 }}
                        />
                        <input
                            name="endDate"
                            value={selectedMilestone ? selectedMilestone.endDate : ''}
                            readOnly
                            placeholder="End Date"
                            className="revamp-input"
                            style={{ borderRadius: 10, border: '1px solid #d1d5db', padding: '10px 14px', fontSize: 16, background: '#f1f5f9', minWidth: 140, marginBottom: 8 }}
                        />
                        <label style={{ fontWeight: 500, color: '#334155', marginBottom: 4 }}>Target Date</label>
                        <input
                            name="targetDate"
                            type="date"
                            value={form.targetDate}
                            onChange={handleChange}
                            placeholder="Select Target Date"
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
                        <button
                            type="submit"
                            className="revamp-cta-btn"
                            style={{ minWidth: 120, height: 44, fontSize: 16, borderRadius: 10, marginLeft: 16 }}
                        >
                            <FaPlusCircle style={{ marginRight: 6 }} /> Add Project
                        </button>
                    </div>
                    {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
                </form>
                </>
            )}
            {!isManagerOrAdmin && (
                <div style={{textAlign: 'center', color: '#64748b', fontSize: 18, margin: '32px 0'}}>
                    You have view-only access to projects.
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', color: '#64748b', fontSize: 18 }}>Loading projects...</div>
            ) : (
                <div className="revamp-features-grid planner-grid">
                    {projects.map(p => (
                        <div
                            className="revamp-feature-card planner-card"
                            key={p.id}
                            onClick={() => navigate(`/taskplanner/${p.id}`)}
                            style={{ minWidth: 220, maxWidth: 320, margin: '0 auto', borderTop: `4px solid #3b82f6`, cursor: 'pointer' }}
                        >
                            <div className="revamp-feature-content">
                                <h4 className="revamp-feature-title">{p.name}</h4>
                                <div className="revamp-feature-meta">
                                    <FaUser className="revamp-feature-icon" /> {p.ownerUsername || p.ownername || ''}
                                </div>
                                <div className="revamp-feature-meta">{p.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
