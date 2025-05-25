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

    const updateTaskStatus = async (taskId, newStatus) => {
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
        } catch (err) {
            alert('Failed to update task status');
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

    return (
        <div className="feature-page revamp-main-bg" style={{ minHeight: '100vh', padding: 32 }}>
            <div className="revamp-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaTasks className="feature-icon" style={{ fontSize: 36, color: '#3b82f6', marginRight: 12 }} />
                    <h2 className="revamp-title">Task Planner</h2>
                </div>
            </div>
            {loading ? (
                <div style={{ textAlign: 'center', color: '#64748b', fontSize: 18 }}>Loading...</div>
            ) : error ? (
                <div style={{ color: 'red', textAlign: 'center', margin: 24 }}>{error}</div>
            ) : (
                <>
                    {project && (
                        <div className="revamp-project-card" style={{ background: '#f8fafc', borderRadius: 16, padding: 24, marginBottom: 32, boxShadow: '0 2px 12px #e0e7ef', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
                            <h3 style={{ color: '#2563eb', fontWeight: 700, marginBottom: 8 }}>{project.name}</h3>
                            <div style={{ color: '#334155', marginBottom: 6 }}><FaUser style={{ marginRight: 6 }} />Owner: {project.ownerUsername}</div>
                            <div style={{ color: '#64748b', marginBottom: 6 }}>Start: {project.startDate} | End: {project.endDate}</div>
                            <div style={{ color: '#64748b', marginBottom: 6 }}>Milestone: {milestone ? `${milestone.name ? milestone.name + ' ' : ''}(ID: ${milestone.id})` : 'None'}</div>
                            <div style={{ color: '#64748b' }}>{project.description}</div>
                        </div>
                    )}
                    {/* Only show the task creation form for managers/admins */}
                    {isManagerOrAdmin && (
                    <form onSubmit={handleSubmit} className="feature-form revamp-form" style={{
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
                                type="text"
                                name="name"
                                placeholder="Task Name"
                                value={formData.name}
                                onChange={handleChange}
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
                                onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
                                onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
                            />
                            <textarea
                                name="description"
                                placeholder="Task Description"
                                value={formData.description}
                                onChange={handleChange}
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
                                onFocus={e => (e.target.style.border = '1.5px solid #3b82f6')}
                                onBlur={e => (e.target.style.border = '1px solid #d1d5db')}
                            />
                            <select
                                name="assignedUserIds"
                                value={formData.assignedUserIds.length > 0 ? formData.assignedUserIds[0] : ''}
                                onChange={e => setFormData(prev => ({ ...prev, assignedUserIds: [parseInt(e.target.value)] }))}
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
                                <option value="">Select Developer</option>
                                {users.filter(u => u.role === 'DEVELOPER').map(u => (
                                    <option key={u.id} value={u.id}>{u.username}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="revamp-cta-btn" style={{ minWidth: 120, height: 44, fontSize: 16, borderRadius: 10, marginTop: 8 }}>Create Task</button>
                    </form>
                    )}
                    <div style={{ maxWidth: 700, margin: '0 auto' }}>
                        <h4 style={{ fontWeight: 600, color: '#334155', marginBottom: 12 }}>Tasks</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {visibleTasks.length > 0 ? (
                                visibleTasks.map(task => {
                                    const currentStatus = editedStatuses[task.id] ?? task.status;
                                    const isChanged = editedStatuses[task.id] && editedStatuses[task.id] !== task.status;
                                    return (
                                        <li key={task.id} style={{ background: '#f1f5f9', marginBottom: 12, padding: 16, borderRadius: 8 }}>
                                            <strong>{task.name}</strong>: {task.description}
                                            <br />
                                            <em>Status:</em> {' '}
                                            <select
                                                value={currentStatus}
                                                onChange={e => handleStatusChange(task.id, e.target.value)}
                                                style={{ marginLeft: 8, marginRight: 8 }}
                                            >
                                                <option value="TODO">TODO</option>
                                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                <option value="DONE">DONE</option>
                                            </select>
                                            <button
                                                style={{ marginLeft: 8, padding: '4px 12px', borderRadius: 6, background: isChanged ? '#2563eb' : '#cbd5e1', color: '#fff', border: 'none', cursor: isChanged ? 'pointer' : 'not-allowed' }}
                                                disabled={!isChanged}
                                                onClick={() => handleUpdateStatus(task.id)}
                                            >
                                                Update
                                            </button>
                                            <br />
                                            <em>Milestone:</em> {task.milestone?.name || task.milestone?.id || task.milestoneId || 'None'}
                                        </li>
                                    );
                                })
                            ) : (
                                <li>No tasks found.</li>
                            )}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskPlanner;
