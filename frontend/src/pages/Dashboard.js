import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaProject,
  FaTasks,
  FaCalendarAlt,
  FaChartLine,
  FaPlus,
  FaUser,
  FaFlag,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserTie,
  FaCode,
  FaUsers
} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Get user role icon
  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case 'manager': return <FaUserTie className="role-icon" />;
      case 'developer': return <FaCode className="role-icon" />;
      case 'admin': return <FaUser className="role-icon" />;
      default: return <FaUsers className="role-icon" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa726';
      case 'low': return '#66bb6a';
      default: return '#9e9e9e';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return '#4caf50';
      case 'in progress': return '#2196f3';
      case 'pending': return '#ff9800';
      case 'overdue': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole') || 'developer';

    if (!token || !username) {
      navigate('/');
      return;
    }

    setUser({ username, role: userRole });
    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      setLoading(true);
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch projects
      const projectsResponse = await fetch('/api/projects', { headers });
      const projectsData = await projectsResponse.json();

      // Fetch tasks
      const tasksResponse = await fetch('/api/tasks', { headers });
      const tasksData = await tasksResponse.json();

      // Fetch milestones
      const milestonesResponse = await fetch('/api/milestones', { headers });
      const milestonesData = await milestonesResponse.json();

      setProjects(Array.isArray(projectsData) ? projectsData : projectsData.projects || []);
      setTasks(Array.isArray(tasksData) ? tasksData : tasksData.tasks || []);
      setMilestones(Array.isArray(milestonesData) ? milestonesData : milestonesData.milestones || []);

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const handleCreateProject = () => {
    navigate('/create-project');
  };

  const handleCreateTask = () => {
    navigate('/create-task');
  };

  // Filter data based on user role
  const getFilteredData = () => {
    const userRole = user?.role?.toLowerCase();
    const username = user?.username;

    if (userRole === 'manager' || userRole === 'admin') {
      // Managers and admins see all data
      return { projects, tasks, milestones };
    } else {
      // Other users see only their assigned tasks and related projects
      const userTasks = tasks.filter(task =>
        task.assignedTo === username ||
        task.createdBy === username
      );

      const userProjectIds = userTasks.map(task => task.projectId);
      const userProjects = projects.filter(project =>
        userProjectIds.includes(project._id) ||
        project.createdBy === username ||
        project.members?.includes(username)
      );

      const userMilestones = milestones.filter(milestone =>
        userProjectIds.includes(milestone.projectId)
      );

      return {
        projects: userProjects,
        tasks: userTasks,
        milestones: userMilestones
      };
    }
  };

  const { projects: filteredProjects, tasks: filteredTasks, milestones: filteredMilestones } = getFilteredData();

  // Calculate stats
  const stats = {
    totalProjects: filteredProjects.length,
    totalTasks: filteredTasks.length,
    completedTasks: filteredTasks.filter(task => task.status?.toLowerCase() === 'completed').length,
    pendingTasks: filteredTasks.filter(task => task.status?.toLowerCase() === 'pending').length,
    overdueTasks: filteredTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate < today && task.status?.toLowerCase() !== 'completed';
    }).length,
    totalMilestones: filteredMilestones.length
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h1>Project Dashboard</h1>
          <div className="user-info">
            {getRoleIcon(user?.role)}
            <span className="user-name">{user?.username}</span>
            <span className="user-role">({user?.role || 'User'})</span>
          </div>
        </div>
        <div className="dashboard-header-right">
          <button className="header-btn" onClick={() => navigate('/')}>
            Home
          </button>
          <button className="header-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon projects-icon">
            <FaProject />
          </div>
          <div className="stat-content">
            <h3>{stats.totalProjects}</h3>
            <p>Active Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon tasks-icon">
            <FaTasks />
          </div>
          <div className="stat-content">
            <h3>{stats.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.completedTasks}</h3>
            <p>Completed Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon overdue-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>{stats.overdueTasks}</h3>
            <p>Overdue Tasks</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartLine /> Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <FaProject /> Projects
        </button>
        <button
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <FaTasks /> Tasks
        </button>
        <button
          className={`tab-btn ${activeTab === 'milestones' ? 'active' : ''}`}
          onClick={() => setActiveTab('milestones')}
        >
          <FaFlag /> Milestones
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Recent Projects</h3>
                <div className="card-content">
                  {filteredProjects.slice(0, 3).map(project => (
                    <div key={project._id} className="overview-item">
                      <div className="item-info">
                        <span className="item-name">{project.name}</span>
                        <span className="item-date">{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(project.status) }}
                      >
                        {project.status || 'Active'}
                      </div>
                    </div>
                  ))}
                  {filteredProjects.length === 0 && (
                    <p className="no-data">No projects found</p>
                  )}
                </div>
              </div>

              <div className="overview-card">
                <h3>Upcoming Tasks</h3>
                <div className="card-content">
                  {filteredTasks
                    .filter(task => task.status?.toLowerCase() !== 'completed')
                    .slice(0, 3)
                    .map(task => (
                    <div key={task._id} className="overview-item">
                      <div className="item-info">
                        <span className="item-name">{task.name}</span>
                        <span className="item-date">
                          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                        </span>
                      </div>
                      <div
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      >
                        {task.priority || 'Normal'}
                      </div>
                    </div>
                  ))}
                  {filteredTasks.filter(task => task.status?.toLowerCase() !== 'completed').length === 0 && (
                    <p className="no-data">No pending tasks</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="projects-section">
            <div className="section-header">
              <h2>Projects</h2>
              {(user?.role?.toLowerCase() === 'manager' || user?.role?.toLowerCase() === 'admin') && (
                <button className="create-btn" onClick={handleCreateProject}>
                  <FaPlus /> Create Project
                </button>
              )}
            </div>
            <div className="projects-grid">
              {filteredProjects.map(project => (
                <div key={project._id} className="project-card">
                  <div className="project-header">
                    <h3>{project.name}</h3>
                    <div
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(project.status) }}
                    >
                      {project.status || 'Active'}
                    </div>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-meta">
                    <div className="meta-item">
                      <FaCalendarAlt />
                      <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    {project.dueDate && (
                      <div className="meta-item">
                        <FaClock />
                        <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredProjects.length === 0 && (
                <div className="no-data-card">
                  <FaProject />
                  <p>No projects found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="tasks-section">
            <div className="section-header">
              <h2>Tasks</h2>
              <button className="create-btn" onClick={handleCreateTask}>
                <FaPlus /> Create Task
              </button>
            </div>
            <div className="tasks-list">
              {filteredTasks.map(task => (
                <div key={task._id} className="task-card">
                  <div className="task-header">
                    <h3>{task.name}</h3>
                    <div className="task-badges">
                      <div
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      >
                        {task.priority || 'Normal'}
                      </div>
                      <div
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                      >
                        {task.status || 'Pending'}
                      </div>
                    </div>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <div className="meta-item">
                      <FaUser />
                      <span>Assigned to: {task.assignedTo || 'Unassigned'}</span>
                    </div>
                    {task.dueDate && (
                      <div className="meta-item">
                        <FaClock />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredTasks.length === 0 && (
                <div className="no-data-card">
                  <FaTasks />
                  <p>No tasks found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <div className="milestones-section">
            <div className="section-header">
              <h2>Milestones</h2>
            </div>
            <div className="milestones-list">
              {filteredMilestones.map(milestone => (
                <div key={milestone._id} className="milestone-card">
                  <div className="milestone-header">
                    <FaFlag className="milestone-icon" />
                    <h3>{milestone.name}</h3>
                    <div
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(milestone.status) }}
                    >
                      {milestone.status || 'Active'}
                    </div>
                  </div>
                  <p className="milestone-description">{milestone.description}</p>
                  <div className="milestone-meta">
                    {milestone.dueDate && (
                      <div className="meta-item">
                        <FaClock />
                        <span>Target: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredMilestones.length === 0 && (
                <div className="no-data-card">
                  <FaFlag />
                  <p>No milestones found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;