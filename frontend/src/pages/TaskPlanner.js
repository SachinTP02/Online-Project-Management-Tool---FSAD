import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TaskPlanner = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        milestoneId: '',
        assignedUserIds: [],
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectRes, tasksRes, milestonesRes, usersRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/projects/${projectId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`http://localhost:8080/api/tasks/project/${projectId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:8080/api/milestones', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:8080/api/users', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                ]);

                setProject(projectRes.data);
                setTasks(tasksRes.data);
                setMilestones(milestonesRes.data);
                setUsers(usersRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data');
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMultiSelect = (e) => {
        const options = Array.from(e.target.selectedOptions);
        const values = options.map(opt => parseInt(opt.value));
        setFormData(prev => ({
            ...prev,
            assignedUserIds: values
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/tasks', {
                ...formData,
                projectId: parseInt(projectId)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh task list
            const tasksRes = await axios.get(`http://localhost:8080/api/tasks/project/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(tasksRes.data);

            // Reset form
            setFormData({
                name: '',
                description: '',
                milestoneId: '',
                assignedUserIds: [],
            });
        } catch (err) {
            console.error('Error creating task:', err);
            alert('Failed to create task');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {project && (
                <div>
                    <h2>{project.name}</h2>
                    <p><strong>Description:</strong> {project.description}</p>
                    <p><strong>Owner:</strong> {project.ownerUsername}</p>
                    <p><strong>Start:</strong> {project.startDate}</p>
                    <p><strong>End:</strong> {project.endDate}</p>
                    <hr/>
                </div>
            )}

            <h3>Create New Task</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Task Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <br/>
                <textarea
                    name="description"
                    placeholder="Task Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <br/>
                <label>
                    Milestone:
                    <select name="milestoneId" value={formData.milestoneId} onChange={handleChange} required>
                        <option value="">-- Select Milestone --</option>
                        {milestones.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </label>
                <br/>
                <label>
                    Assign Users:
                    <select multiple value={formData.assignedUserIds.map(String)} onChange={handleMultiSelect}>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.username}</option>
                        ))}
                    </select>
                </label>
                <br/>
                <button type="submit">Create Task</button>
            </form>

            <hr/>
            <h3>Tasks</h3>
            <ul>
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <li key={task.id}>
                            <strong>{task.name}</strong>: {task.description}
                            <br/>
                            <em>Status:</em> {task.status}
                            <br/>
                            <em>Milestone:</em> {task.milestone?.name || 'None'}
                        </li>
                    ))
                ) : (
                    <li>No tasks found.</li>
                )}
            </ul>
        </div>
    );
};

export default TaskPlanner;
