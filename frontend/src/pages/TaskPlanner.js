import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaTasks, FaUser, FaPlusCircle } from 'react-icons/fa';
import './LandingPage.css';

const TaskPlanner = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [milestone, setMilestone] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        assignedUserIds: [],
    });
    const [editedStatuses, setEditedStatuses] = useState({});
    const [showName, setShowName] = useState(false);
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    const isManagerOrAdmin = userRole === 'manager' || userRole === 'admin';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectRes, tasksRes, usersRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/projects/${projectId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`http://localhost:8080/api/tasks/project/${projectId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:8080/api/users/developers', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                ]);
                console.log('Project API response:', projectRes.data); // Debug log
                setProject(projectRes.data);
                setTasks(tasksRes.data);
                setUsers(usersRes.data);
                if (projectRes.data.milestoneId) {
                    setMilestone({ id: projectRes.data.milestoneId, name: null });
                    try {
                        const milestoneRes = await axios.get(`http://localhost:8080/api/milestones/${projectRes.data.milestoneId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        console.log('Milestone API response:', milestoneRes.data); // Debug log
                        setMilestone({ id: projectRes.data.milestoneId, name: milestoneRes.data.name });
                    } catch (e) {
                        // fallback: just id
                    }
                } else if (projectRes.data.milestone && projectRes.data.milestone.id) {
                    setMilestone({ id: projectRes.data.milestone.id, name: projectRes.data.milestone.name });
                } else {
                    setMilestone(null);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data');
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const milestoneId = project && project.milestoneId ? project.milestoneId : (milestone && milestone.id ? milestone.id : null);
        const payload = {
            ...formData,
            projectId: parseInt(projectId),
            milestoneId
        };
        console.log('Task creation payload:', payload);
        try {
            await axios.post('http://localhost:8080/api/tasks', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const tasksRes = await axios.get(`http://localhost:8080/api/tasks/project/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(tasksRes.data);
            setFormData({ name: '', description: '', assignedUserIds: [] });
        } catch (err) {
            console.error('Error creating task:', err);
            alert('Failed to create task');
        }
    };

    const handleStatusChange = (taskId, newStatus) => {
        setEditedStatuses(prev => ({ ...prev, [taskId]: newStatus }));
    };

    const handleUpdateStatus = async (taskId) => {
        const newStatus = editedStatuses[taskId];
        if (!newStatus) return;
        try {
            await axios.put(
                `http://localhost:8080/api/tasks/${taskId}/status?status=${newStatus}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh tasks after update
            const tasksRes = await axios.get(`http://localhost:8080/api/tasks/project/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(tasksRes.data);
            setEditedStatuses(prev => ({ ...prev, [taskId]: undefined }));
        } catch (err) {
            alert('Failed to update task status');
        }
    };

    // Filter tasks for developers
    const visibleTasks = isManagerOrAdmin
        ? tasks
        : tasks.filter(task =>
            Array.isArray(task.assignedUsers) &&
            task.assignedUsers.some(u => u.username === username)
        );

    // Get user info for header
    const user = username ? { username } : null;

    return (
        <div className="landing-root landing-revamp">
            {/* Doodle SVG watermark background for project management/corporate theme - always visible, behind all content */}
            <div className="landing-doodle-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', opacity: 0.17 }}>
                <svg viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100vw', height: '100vh', display: 'block' }}>
                    <g stroke="#b6c2d9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        {/* Doodle: calendar */}
                        <rect x="120" y="80" width="120" height="90" rx="16" />
                        <line x1="120" y1="110" x2="240" y2="110" />
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
                        <rect x="1410" y="660" width="12" height="12" rx="3" />
                        <rect x="1430" y="660" width="12" height="12" rx="3" />
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
                                    window.location.href = '/';
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : null}
                </nav>
            </header>
            <div className="feature-page revamp-main-bg" style={{ minHeight: '100vh', padding: 32, background: '#f1f5f9', marginTop: 0 }}>
                <div className="revamp-header-row" style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fff',
                    borderRadius: '1.1rem',
                    boxShadow: '0 2px 8px 0 rgba(44,62,80,0.06)',
                    border: '1.5px solid #e0e7ef',
                    padding: '1.5rem 2.2rem',
                    marginBottom: 28,
                    marginTop: 0, // flush with top
                    marginLeft: 0, // flush with left edge
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
                            <FaTasks style={{ fontSize: 28, color: '#3b82f6' }} />
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
                            }}>Tasks</h2>
                            <div style={{ color: '#6c6f7b', fontWeight: 500, fontSize: '1.08rem', marginTop: 2, letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Plan, assign, and track your tasks.
                            </div>
                        </div>
                    </div>
                </div>
                {loading ? (
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: 18 }}>Loading...</div>
                ) : error ? (
                    <div style={{ color: 'red', textAlign: 'center', margin: 24 }}>{error}</div>
                ) : (
                    <>
                        {/* Blended project details and task creation form horizontally */}
                        <div className="revamp-blended-card" style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 36,
                            background: '#fff',
                            borderRadius: 18,
                            boxShadow: '0 2px 16px #e0e7ef',
                            border: '1.5px solid #e0e7ef',
                            padding: 32,
                            marginBottom: 36,
                            maxWidth: 1100,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                        }}>
                            {/* Project Details */}
                            {project && (
                                <div style={{
                                    flex: 1,
                                    minWidth: 260,
                                    maxWidth: 400,
                                    marginRight: 0,
                                    borderRight: isManagerOrAdmin ? '1.5px solid #e5e7eb' : 'none',
                                    paddingRight: isManagerOrAdmin ? 32 : 0,
                                    marginBottom: isManagerOrAdmin ? 0 : 24,
                                }}>
                                    <h3 style={{ color: '#2563eb', fontWeight: 800, marginBottom: 8, fontSize: 24 }}>{project.name}</h3>
                                    <div style={{ color: '#334155', marginBottom: 6, fontWeight: 500 }}><FaUser style={{ marginRight: 6 }} />Owner: {project.ownerUsername}</div>
                                    <div style={{ color: '#64748b', marginBottom: 6, fontWeight: 500 }}>Start: {project.startDate} | End: {project.endDate}</div>
                                    <div style={{ color: '#64748b', marginBottom: 6, fontWeight: 500 }}>Milestone: {milestone ? `${milestone.name ? milestone.name + ' ' : ''}(ID: ${milestone.id})` : 'None'}</div>
                                    <div style={{ color: '#64748b', fontSize: 15 }}>{project.description}</div>
                                </div>
                            )}
                            {/* Task Creation Form (only for managers/admins) */}
                            {isManagerOrAdmin && (
                                <form onSubmit={handleSubmit} className="feature-form revamp-form" style={{
                                    flex: 1.2,
                                    minWidth: 280,
                                    maxWidth: 520,
                                    marginLeft: project ? 32 : 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'stretch', // changed from center for better alignment
                                    background: 'transparent',
                                    border: 'none',
                                    boxShadow: 'none',
                                    padding: 0,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, alignSelf: 'flex-start' }}>
                                        <FaPlusCircle style={{ fontSize: 24, color: '#3b82f6', marginRight: 10 }} />
                                        <span style={{ fontWeight: 700, fontSize: 20, color: '#334155', letterSpacing: 0.2 }}>Add New Task</span>
                                    </div>
                                    <div className="revamp-form-row" style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 14,
                                        width: '100%',
                                        marginBottom: 12,
                                    }}>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Task Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="revamp-input"
                                            style={{
                                                borderRadius: 12,
                                                border: '1.5px solid #d1d5db',
                                                padding: '12px 16px',
                                                fontSize: 17,
                                                background: '#f8fafc',
                                                boxShadow: '0 1px 2px #f1f5f9',
                                                outline: 'none',
                                                minWidth: 200,
                                                transition: 'border 0.2s',
                                            }}
                                            onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
                                            onBlur={e => (e.target.style.border = '1.5px solid #d1d5db')}
                                        />
                                        <textarea
                                            name="description"
                                            placeholder="Task Description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            className="revamp-input"
                                            style={{
                                                borderRadius: 12,
                                                border: '1.5px solid #d1d5db',
                                                padding: '12px 16px',
                                                fontSize: 17,
                                                background: '#f8fafc',
                                                boxShadow: '0 1px 2px #f1f5f9',
                                                outline: 'none',
                                                minWidth: 200,
                                                minHeight: 60,
                                                resize: 'vertical',
                                                transition: 'border 0.2s',
                                            }}
                                            onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
                                            onBlur={e => (e.target.style.border = '1.5px solid #d1d5db')}
                                        />
                                        {/* Developer checklist for multi-select */}
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            minWidth: 200,
                                            maxHeight: 120,
                                            overflowY: 'auto',
                                            border: '1.5px solid #d1d5db',
                                            borderRadius: 12,
                                            padding: 10,
                                            background: '#f8fafc',
                                            boxShadow: '0 1px 2px #f1f5f9',
                                        }}>
                                            <label style={{ fontWeight: 600, color: '#334155', marginBottom: 6, fontSize: 15 }}>Assign Developers</label>
                                            {users.filter(u => u.role === 'DEVELOPER').map(u => (
                                                <label key={u.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 4, fontSize: 15, color: '#334155', cursor: 'pointer', fontWeight: 500 }}>
                                                    <input
                                                        type="checkbox"
                                                        value={u.id}
                                                        checked={formData.assignedUserIds.includes(u.id)}
                                                        onChange={e => {
                                                            const id = parseInt(e.target.value);
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                assignedUserIds: e.target.checked
                                                                    ? [...prev.assignedUserIds, id]
                                                                    : prev.assignedUserIds.filter(uid => uid !== id)
                                                            }));
                                                        }}
                                                        style={{ marginRight: 8 }}
                                                    />
                                                    {u.username}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <button type="submit" className="revamp-cta-btn" style={{
                                        minWidth: 130,
                                        height: 46,
                                        fontSize: 17,
                                        borderRadius: 12,
                                        marginTop: 10,
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
                                    >Create Task</button>
                                </form>
                            )}
                        </div>
                        <div style={{ maxWidth: 700, margin: '0 auto' }}>
                            <h4 style={{ fontWeight: 700, color: '#334155', marginBottom: 16, fontSize: 20, letterSpacing: 0.2 }}>Tasks</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {visibleTasks.length > 0 ? (
                                    visibleTasks.map(task => {
                                        const currentStatus = editedStatuses[task.id] ?? task.status;
                                        const isChanged = editedStatuses[task.id] && editedStatuses[task.id] !== task.status;
                                        return (
                                            <li key={task.id} style={{
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
                                                minHeight: 120,
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
                                                    }}>
                                                        <FaTasks style={{ color: '#3b82f6', fontSize: 20 }} />
                                                    </div>
                                                    <strong style={{ fontSize: 19, color: '#1e293b', fontWeight: 800, letterSpacing: 0.1 }}>{task.name}</strong>
                                                    <span style={{
                                                        marginLeft: 12,
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        color: currentStatus === 'DONE' ? '#22c55e' : currentStatus === 'IN_PROGRESS' ? '#f59e42' : '#2563eb',
                                                        background: currentStatus === 'DONE' ? '#e7fbe9' : currentStatus === 'IN_PROGRESS' ? '#fff7ed' : '#e0e7ef',
                                                        borderRadius: 8,
                                                        padding: '2px 12px',
                                                        border: '1.2px solid #dbeafe',
                                                        marginRight: 8,
                                                    }}>{currentStatus.replace('_', ' ')}</span>
                                                </div>
                                                <div style={{ color: '#64748b', fontSize: 15, marginBottom: 2, fontWeight: 500, paddingLeft: 52 }}>{task.description}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', paddingLeft: 52 }}>
                                                    <div style={{ color: '#64748b', fontSize: 14 }}>
                                                        <em style={{ color: '#334155', fontWeight: 600 }}>Milestone:</em> {task.milestone?.name || task.milestone?.id || task.milestoneId || 'None'}
                                                    </div>
                                                    <div style={{ color: '#64748b', fontSize: 14 }}>
                                                        <em style={{ color: '#334155', fontWeight: 600 }}>Assigned:</em> {Array.isArray(task.assignedUsers) && task.assignedUsers.length > 0 ? task.assignedUsers.map(u => u.username).join(', ') : 'None'}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, paddingLeft: 52 }}>
                                                    <em style={{ color: '#334155', fontWeight: 600, fontSize: 15 }}>Status:</em>
                                                    <select
                                                        value={currentStatus}
                                                        onChange={e => handleStatusChange(task.id, e.target.value)}
                                                        style={{
                                                            borderRadius: 8,
                                                            border: '1.5px solid #d1d5db',
                                                            padding: '6px 14px',
                                                            fontSize: 15,
                                                            background: '#f8fafc',
                                                            outline: 'none',
                                                            fontWeight: 600,
                                                            color: currentStatus === 'DONE' ? '#22c55e' : currentStatus === 'IN_PROGRESS' ? '#f59e42' : '#2563eb',
                                                            transition: 'border 0.2s',
                                                        }}
                                                        onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
                                                        onBlur={e => (e.target.style.border = '1.5px solid #d1d5db')}
                                                    >
                                                        <option value="TODO">TODO</option>
                                                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                        <option value="DONE">DONE</option>
                                                    </select>
                                                    <button
                                                        style={{
                                                            marginLeft: 8,
                                                            padding: '6px 18px',
                                                            borderRadius: 8,
                                                            background: isChanged ? '#2563eb' : '#cbd5e1',
                                                            color: '#fff',
                                                            border: 'none',
                                                            cursor: isChanged ? 'pointer' : 'not-allowed',
                                                            fontWeight: 700,
                                                            fontSize: 15,
                                                            boxShadow: isChanged ? '0 1px 4px #dbeafe' : 'none',
                                                            transition: 'background 0.2s',
                                                        }}
                                                        disabled={!isChanged}
                                                        onClick={() => handleUpdateStatus(task.id)}
                                                        onMouseOver={e => { if (isChanged) e.target.style.background = '#1d4ed8'; }}
                                                        onMouseOut={e => { if (isChanged) e.target.style.background = '#2563eb'; }}
                                                    >
                                                        Update
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li style={{ color: '#64748b', fontWeight: 500, fontSize: 16, textAlign: 'center', padding: 24, background: '#fff', borderRadius: 12, border: '1.5px solid #e0e7ef', boxShadow: '0 1px 6px #e0e7ef' }}>No tasks found.</li>
                                )}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskPlanner;
