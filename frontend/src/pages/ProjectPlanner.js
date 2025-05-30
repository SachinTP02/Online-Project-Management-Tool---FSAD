import React, { useState, useEffect } from 'react';
import { FaTasks, FaUser, FaPlusCircle } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function ProjectPlanner() {
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState({
        name: '',
        description: '',
        ownername: '',
        ownerId: '',
        targetDate: '',
        files: [], // updated from file: null
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [milestones, setMilestones] = useState([]);
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    const isManagerOrAdmin = userRole === 'manager' || userRole === 'admin';
    const [user, setUser] = useState(null);
    const [showName, setShowName] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            setUser({ username: storedUsername });
        } else {
            setUser(null);
        }
    }, []);

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

            const formData = new FormData();
            const projectPayload = {
                name: form.name,
                description: form.description,
                ownername: username,
                milestoneId: selectedMilestone.id,
                startDate: selectedMilestone.startDate,
                endDate: selectedMilestone.endDate,
                targetDate: form.targetDate,
            };

            formData.append(
                'data',
                new Blob([JSON.stringify(projectPayload)], {
                    type: 'application/json',
                })
            );

            // Append all selected files
            form.files.forEach(file => {
                formData.append('files', file); // 'files' should match controller param name
            });

            const res = await axios.post('http://localhost:8080/api/projects', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setProjects([...projects, res.data]);
            setForm({ name: '', description: '', ownername: '', ownerId: '', targetDate: '', files: [] });
            setSelectedMilestone(null);
        } catch (err) {
            console.error(err);
            setError('Failed to add project.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="landing-root landing-revamp">
            {/* Doodle SVG watermark background for project management/corporate theme - always visible, behind all content */}
            <div className="landing-doodle-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', opacity: 0.85 }}>
                <svg viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100vw', height: '100vh', display: 'block' }}>
                    <g stroke="#b6c2d9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        {/* Doodle: calendar */}
                        <rect x="120" y="80" width="120" height="90" rx="16" />
                        <line x1="120" y1="110" x2="240" y2="110" />
                        <circle cx="140" cy="130" r="7" />
                        <circle cx="170" cy="130" r="7" />
                        <circle cx="200" cy="130" r="7" />
                        {/* Doodle: pie chart */}
                        <circle cx="350" cy="200" r="40" />
                        <path d="M350 200 L390 200 A40 40 0 0 0 350 160 Z" />
                        {/* Doodle: task list */}
                        <rect x="1600" y="120" width="140" height="80" rx="14" />
                        <line x1="1620" y1="150" x2="1720" y2="150" />
                        <rect x="1620" y="170" width="18" height="18" rx="4" />
                        <line x1="1640" y1="179" x2="1720" y2="179" />
                        {/* Doodle: document */}
                        <rect x="300" y="900" width="90" height="120" rx="12" />
                        <line x1="320" y1="930" x2="370" y2="930" />
                        <line x1="320" y1="950" x2="370" y2="950" />
                        {/* Doodle: chat bubble */}
                        <ellipse cx="1700" cy="950" rx="60" ry="38" />
                        <ellipse cx="1700" cy="950" rx="40" ry="20" fill="#e0e7ef" />
                        {/* Doodle: milestone flag */}
                        <rect x="900" y="900" width="60" height="18" rx="6" />
                        <polygon points="960,900 990,909 960,918" />
                        {/* Additional doodles for more visual interest */}
                        {/* Bar chart */}
                        <rect x="600" y="800" width="18" height="60" rx="4" />
                        <rect x="630" y="830" width="18" height="30" rx="4" />
                        <rect x="660" y="810" width="18" height="50" rx="4" />
                        {/* Clock */}
                        <circle cx="1550" cy="300" r="32" />
                        <line x1="1550" y1="300" x2="1550" y2="275" />
                        <line x1="1550" y1="300" x2="1570" y2="300" />
                        {/* Lightbulb (idea) */}
                        <ellipse cx="1800" cy="400" rx="22" ry="30" />
                        <line x1="1800" y1="430" x2="1800" y2="450" />
                        <line x1="1790" y1="450" x2="1810" y2="450" />
                        {/* Laptop */}
                        <rect x="1200" y="800" width="70" height="30" rx="6" />
                        <rect x="1210" y="830" width="50" height="10" rx="2" />
                        {/* Teamwork (three heads) */}
                        <circle cx="500" cy="1000" r="18" />
                        <circle cx="540" cy="1000" r="18" />
                        <circle cx="520" cy="1040" r="18" />
                        {/* Cloud */}
                        <ellipse cx="300" cy="400" rx="40" ry="18" />
                        <ellipse cx="340" cy="400" rx="20" ry="10" />
                        {/* Pen (edit) */}
                        <rect x="1700" y="700" width="60" height="10" rx="4" transform="rotate(-20 1700 700)" />
                        <rect x="1750" y="690" width="10" height="20" rx="3" />
                        {/* More doodles for extra density and visibility */}
                        {/* Trophy (achievement) */}
                        <rect x="800" y="100" width="40" height="60" rx="10" />
                        <ellipse cx="820" cy="100" rx="20" ry="10" />
                        <line x1="820" y1="160" x2="820" y2="180" />
                        {/* Star (success) */}
                        <polygon points="1500,800 1507,818 1526,818 1511,830 1517,848 1500,838 1483,848 1489,830 1474,818 1493,818" />
                        {/* Graph/line chart */}
                        <polyline points="200,600 300,550 400,650 500,500 600,700" />
                        {/* Folder */}
                        <rect x="1100" y="200" width="70" height="40" rx="8" />
                        <rect x="1100" y="190" width="40" height="20" rx="6" />
                        {/* Bell (notification) */}
                        <ellipse cx="1800" cy="800" rx="18" ry="22" />
                        <rect x="1792" y="822" width="16" height="8" rx="3" />
                        {/* Magnifier (search) */}
                        <circle cx="300" cy="700" r="18" />
                        <line x1="312" y1="712" x2="330" y2="730" />
                        {/* User avatar */}
                        <circle cx="170" cy="900" r="22" />
                        <ellipse cx="170" cy="930" rx="18" ry="10" />
                        {/* Checklist */}
                        <rect x="1400" y="600" width="60" height="80" rx="10" />
                        <line x1="1410" y1="620" x2="1450" y2="620" />
                        <line x1="1410" y1="640" x2="1450" y2="640" />
                        <rect x="1410" y1="660" width="12" height="12" rx="3" />
                        <rect x="1430" y1="660" width="12" height="12" rx="3" />
                    </g>
                </svg>
            </div>
            <header className="landing-header landing-revamp-header">
                <div className="logo-title landing-revamp-logo">
                    <span className="logo-circle">OPM</span>
                </div>
                <nav className="landing-nav landing-revamp-nav">
                    {user ? (
                        <div className="landing-user-info">
                            <span
                                className="landing-user-avatar revamp-user-avatar"
                                onClick={() => setShowName(v => !v)}
                                style={{ cursor: 'pointer' }}
                                title="Show name"
                            >
                                {user.username[0].toUpperCase()}
                            </span>
                            {showName && (
                                <span className="landing-user-name">{user.username}</span>
                            )}
                            <button
                                className="nav-btn"
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('username');
                                    setUser(null);
                                    navigate('/');
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : null}
                </nav>
            </header>
            <div className="feature-page planner-page revamp-main-bg">
                <div className="revamp-header-row" style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fff',
                    borderRadius: '1.1rem',
                    boxShadow: '0 2px 8px 0 rgba(44,62,80,0.06)',
                    border: '1.5px solid #e0e7ef',
                    padding: '1.5rem 2.2rem',
                    marginBottom: 28,
                    marginTop: 16,
                    position: 'relative',
                    overflow: 'visible',
                    gap: 24,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
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
                        }}>
                            <FaTasks style={{ fontSize: 28, color: '#3b82f6' }} />
                        </div>
                        <div>
                            <h2 className="revamp-title" style={{
                                fontSize: '1.45rem',
                                fontWeight: 800,
                                color: '#232946',
                                marginBottom: 2,
                                letterSpacing: '0.01em',
                            }}>Project Planner</h2>
                            <div style={{ color: '#6c6f7b', fontWeight: 500, fontSize: '1.08rem', marginTop: 2, letterSpacing: '0.01em' }}>
                                Plan, assign, and track your projects.
                            </div>
                        </div>
                    </div>
                </div>

                {isManagerOrAdmin && (
                    <form
                        className="feature-form revamp-form"
                        onSubmit={handleAdd}
                        style={{
                            marginBottom: 28,
                            background: 'linear-gradient(90deg, #f8fafc 60%, #e0e7ef 100%)',
                            borderRadius: 14,
                            padding: 22,
                            boxShadow: '0 2px 10px #e0e7ef',
                            maxWidth: 480,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            border: '1.2px solid #dbeafe',
                            gap: 0,
                            position: 'relative',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, alignSelf: 'flex-start' }}>
                            <FaPlusCircle style={{ fontSize: 20, color: '#3b82f6', marginRight: 8 }} />
                            <span style={{ fontWeight: 700, fontSize: 16, color: '#334155', letterSpacing: 0.2 }}>Add New Project</span>
                        </div>
                        {selectedMilestone && (
                            <div style={{ width: '100%', marginBottom: 8, color: '#2563eb', fontWeight: 500, fontSize: 13 }}>
                                Milestone PID: <b>{selectedMilestone.id}</b> | Start: <b>{selectedMilestone.startDate}</b> | End: <b>{selectedMilestone.endDate}</b>
                            </div>
                        )}
                        <div className="revamp-form-row" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            width: '100%',
                            marginBottom: 8,
                        }}>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Project name"
                                required
                                className="revamp-input"
                                style={{
                                    borderRadius: 10,
                                    border: '1.2px solid #d1d5db',
                                    padding: '10px 14px',
                                    fontSize: 15,
                                    background: '#fff',
                                    boxShadow: '0 1px 2px #f1f5f9',
                                    outline: 'none',
                                    minWidth: 140,
                                    transition: 'border 0.2s',
                                }}
                                onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
                                onBlur={e => (e.target.style.border = '1.2px solid #d1d5db')}
                            />
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Description"
                                required
                                className="revamp-input"
                                style={{
                                    borderRadius: 10,
                                    border: '1.2px solid #d1d5db',
                                    padding: '10px 14px',
                                    fontSize: 15,
                                    background: '#fff',
                                    boxShadow: '0 1px 2px #f1f5f9',
                                    outline: 'none',
                                    minWidth: 140,
                                    minHeight: 44,
                                    resize: 'vertical',
                                    transition: 'border 0.2s',
                                }}
                                onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
                                onBlur={e => (e.target.style.border = '1.2px solid #d1d5db')}
                            />
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
                                    border: '1.2px solid #d1d5db',
                                    padding: '10px 14px',
                                    fontSize: 15,
                                    background: '#fff',
                                    boxShadow: '0 1px 2px #f1f5f9',
                                    outline: 'none',
                                    minWidth: 140,
                                    marginBottom: 4,
                                    transition: 'border 0.2s',
                                }}
                                onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
                                onBlur={e => (e.target.style.border = '1.2px solid #d1d5db')}
                            >
                                <option value="">Select Milestone</option>
                                {milestones.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.name} (PID: {m.id}, {m.startDate} to {m.endDate})
                                    </option>
                                ))}
                            </select>
                            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginBottom: 2, marginTop: 2 }}>
                                Target Date (for when this project should be completed):
                            </div>
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
                                    border: '1.2px solid #d1d5db',
                                    padding: '10px 14px',
                                    fontSize: 15,
                                    background: '#fff',
                                    boxShadow: '0 1px 2px #f1f5f9',
                                    outline: 'none',
                                    minWidth: 140,
                                    marginBottom: 4,
                                    transition: 'border 0.2s',
                                }}
                                onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
                                onBlur={e => (e.target.style.border = '1.2px solid #d1d5db')}
                            />
                            <input
                                type="file"
                                name="files"
                                multiple
                                onChange={e => setForm({ ...form, files: Array.from(e.target.files) })}
                                accept="*"
                                className="revamp-input"
                                style={{
                                    borderRadius: 10,
                                    border: '1.2px solid #d1d5db',
                                    padding: '10px 14px',
                                    fontSize: 15,
                                    background: '#fff',
                                    boxShadow: '0 1px 2px #f1f5f9',
                                    outline: 'none',
                                    minWidth: 140,
                                    marginBottom: 4,
                                    transition: 'border 0.2s',
                                }}
                                onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
                                onBlur={e => (e.target.style.border = '1.2px solid #d1d5db')}
                            />
                        </div>
                        <button
                            type="submit"
                            className="revamp-cta-btn"
                            style={{
                                minWidth: 110,
                                height: 38,
                                fontSize: 15,
                                borderRadius: 10,
                                marginTop: 8,
                                background: '#2563eb',
                                color: '#fff',
                                fontWeight: 700,
                                border: 'none',
                                boxShadow: '0 1px 4px #dbeafe',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                alignSelf: 'flex-end',
                            }}
                            onMouseOver={e => (e.target.style.background = '#1d4ed8')}
                            onMouseOut={e => (e.target.style.background = '#2563eb')}
                        >
                            <FaPlusCircle style={{ marginRight: 6 }} /> Add Project
                        </button>
                        {error && <div style={{ color: 'red', marginTop: 8, fontSize: 13 }}>{error}</div>}
                    </form>
                )}
                {!isManagerOrAdmin && (
                    <div style={{textAlign: 'center', color: '#64748b', fontSize: 18, margin: '32px 0'}}>
                        You have view-only access to projects.
                    </div>
                )}

                {loading ? (
                    <div style={{textAlign: 'center', color: '#64748b', fontSize: 18 }}>Loading projects...</div>
                ) : (
                    <div className="revamp-features-grid planner-grid" style={{gap: '2.5rem 2.5rem', justifyContent: 'center', padding: '2rem 0'}}>
                        {projects.length === 0 ? (
                            <div style={{color: '#b6c2d9', fontSize: '1.25rem', fontWeight: 600, opacity: 0.32, letterSpacing: '0.01em', background: 'none', borderRadius: 18, border: '2px dashed #e0e7ef', margin: '2.5rem 0', textAlign: 'center', pointerEvents: 'none', userSelect: 'none', minHeight: 180, width: '100%'}}>No projects found.</div>
                        ) : (
                            projects.map(p => (
                                <div
                                    className="revamp-feature-card planner-card premium-project-card"
                                    key={p.id}
                                    onClick={() => navigate(`/taskplanner/${p.id}`)}
                                    style={{
                                        minWidth: 260,
                                        maxWidth: 370,
                                        margin: '0 auto',
                                        border: 'none',
                                        borderRadius: '1.7rem',
                                        background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
                                        boxShadow: '0 8px 32px 0 rgba(79,140,255,0.10), 0 2px 8px 0 #e0e7ef',
                                        padding: '2.2rem 2rem 2rem 2rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        gap: '1.2rem',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'visible',
                                        transition: 'box-shadow 0.18s, transform 0.18s, background 0.18s',
                                        backgroundBlendMode: 'lighten',
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.boxShadow = '0 16px 48px 0 rgba(79,140,255,0.18)';
                                        e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #e0e7ef 60%, #f8fafc 100%)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(79,140,255,0.10), 0 2px 8px 0 #e0e7ef';
                                        e.currentTarget.style.transform = 'none';
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)';
                                    }}
                                >
                                    {/* Glass avatar + icon */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-32px',
                                        left: '1.5rem',
                                        width: 64,
                                        height: 64,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.7)',
                                        boxShadow: '0 4px 18px 0 rgba(34,34,59,0.08), 0 2px 8px 0 #e0e7ef',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 2,
                                        border: '2.5px solid #e0e7ef',
                                        fontSize: 32,
                                        color: '#3b82f6',
                                    }}>
                                        <FaTasks />
                                    </div>
                                    {/* Project Title & Owner */}
                                    <div style={{marginTop: 24, width: '100%'}}>
                                        <h4 className="revamp-feature-title" style={{fontSize: '1.25rem', fontWeight: 800, color: '#232946', marginBottom: 6, letterSpacing: '0.01em'}}>{p.name}</h4>
                                        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2}}>
                                            <span style={{background: 'linear-gradient(135deg, #4f8cff 0%, #3b82f6 100%)', color: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px #e0e7ef'}}>
                                                {p.ownerUsername ? p.ownerUsername[0] : (p.ownername ? p.ownername[0] : '?')}
                                            </span>
                                            <span style={{fontWeight: 600, color: '#3b82f6', fontSize: '1.05rem'}}>Owner: {p.ownerUsername || p.ownername || ''}</span>
                                        </div>
                                    </div>
                                    {/* Project Description */}
                                    <div style={{color: '#6c6f7b', fontSize: '1.05rem', fontWeight: 500, marginBottom: 6, marginTop: 2, width: '100%'}}>
                                        {p.description}
                                    </div>
                                    {/* Project Details Row */}
                                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '1.2rem 2.2rem', marginTop: 8, width: '100%'}}>
                                        <div style={{color: '#a0a1b5', fontSize: '0.98rem', fontWeight: 600}}>
                                            <span style={{color: '#232946', fontWeight: 700}}>Start:</span> {p.startDate || '-'}
                                        </div>
                                        <div style={{color: '#a0a1b5', fontSize: '0.98rem', fontWeight: 600}}>
                                            <span style={{color: '#232946', fontWeight: 700}}>End:</span> {p.endDate || '-'}
                                        </div>
                                        {p.milestoneName || p.milestone ? (
                                            <div style={{color: '#a0a1b5', fontSize: '0.98rem', fontWeight: 600}}>
                                                <span style={{color: '#232946', fontWeight: 700}}>Milestone:</span> {p.milestoneName || (p.milestone?.name || p.milestone?.id || p.milestoneId || '')}
                                            </div>
                                        ) : null}
                                        {p.status ? (
                                            <div style={{color: '#10b981', fontWeight: 700, fontSize: '0.98rem', background: '#e0fdf4', borderRadius: 8, padding: '2px 12px', marginLeft: 4}}>
                                                {p.status}
                                            </div>
                                        ) : null}
                                    </div>
                                    {/* File count or attachments */}
                                    {Array.isArray(p.files) && p.files.length > 0 && (
                                        <div style={{marginTop: 10, color: '#f59e0b', fontWeight: 600, fontSize: '0.98rem'}}>
                                            <span style={{marginRight: 6}}>📎</span>{p.files.length} file{p.files.length > 1 ? 's' : ''} attached
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
