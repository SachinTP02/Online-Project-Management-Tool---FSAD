import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PiNotepadBold,
  PiChartLineUpBold,
  PiCloudArrowUpBold,
  PiCalendarBlankBold,
  PiBellRingingBold,
  PiShieldCheckBold,
  PiFlagBannerBold
} from 'react-icons/pi';
import Calendar from './Calendar';
import './Dashboard.css';

const dashboardFeatures = [
  {
    icon: <PiNotepadBold className="feature-icon" />, title: 'Project Planner', desc: 'Plan, assign, and track projects.', route: '/planner', bg: 'linear-gradient(135deg, #4f8cff 0%, #3b82f6 100%)'
  },
  {
    icon: <PiChartLineUpBold className="feature-icon" />, title: 'Reporting', desc: 'View and generate project reports.', route: '/reporting', bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  {
    icon: <PiCloudArrowUpBold className="feature-icon" />, title: 'Storage', desc: 'Manage and share project files.', route: '/storage', bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
  },
  {
    icon: <PiCalendarBlankBold className="feature-icon" />, title: 'Calendar', desc: 'View project events and deadlines.', route: '/calendar', bg: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)'
  },
  {
    icon: <PiBellRingingBold className="feature-icon" />, title: 'Email Alerts', desc: 'Automated alerts for deadlines.', route: null, bg: 'linear-gradient(135deg, #f43f5e 0%, #f87171 100%)'
  },
  {
    icon: <PiShieldCheckBold className="feature-icon" />, title: 'Admin', desc: 'User management and complaints.', route: '/admin', bg: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)'
  },
  {
    icon: <PiFlagBannerBold className="feature-icon" />, title: 'Milestones', desc: 'Add and track milestones.', route: '/milestones', bg: 'linear-gradient(135deg, #a21caf 0%, #e879f9 100%)'
  },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState('');
  const [showName, setShowName] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token || !username) {
      navigate('/');
      return;
    }

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
      await fetch('/projects', { headers });

      // Fetch tasks
      await fetch('/tasks', { headers });

      // Fetch milestones
      await fetch('/milestones', { headers });

    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      setAssignmentsLoading(true);
      setAssignmentsError('');
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (!token || !username) throw new Error('No token or username');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        // Fetch all projects
        const projRes = await fetch('/api/projects', { headers });
        let projects = projRes.ok ? await projRes.json() : [];
        // Filter projects where user is owner or (optionally) assigned (if you have such a field)
        projects = Array.isArray(projects) ? projects.filter(p => p.ownerUsername === username || p.ownername === username) : [];
        setAssignedProjects(projects);
        // Fetch all tasks
        const taskRes = await fetch('/api/tasks', { headers });
        let tasks = taskRes.ok ? await taskRes.json() : [];
        // Filter tasks where user is assigned
        tasks = Array.isArray(tasks) ? tasks.filter(task => {
          if (Array.isArray(task.assignedUsers)) {
            return task.assignedUsers.some(u => u.username === username);
          } else if (task.assignedUser && task.assignedUser.username) {
            return task.assignedUser.username === username;
          }
          return false;
        }) : [];
        setAssignedTasks(tasks);
      } catch (err) {
        setAssignedProjects([]);
        setAssignedTasks([]);
        setAssignmentsError('Failed to load assigned projects or tasks.');
      } finally {
        setAssignmentsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  // Helper for empty state
  const EmptyWatermark = ({ label }) => (
    <div style={{
      width: '100%',
      minHeight: 180,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#b6c2d9',
      fontSize: '1.25rem',
      fontWeight: 600,
      opacity: 0.32,
      letterSpacing: '0.01em',
      background: 'none',
      borderRadius: 18,
      border: '2px dashed #e0e7ef',
      margin: '2.5rem 0',
      textAlign: 'center',
      pointerEvents: 'none',
      userSelect: 'none',
    }}>{label}</div>
  );

  // Uniform card for project/task
  const InfoCard = ({ title, subtitle, desc, icon }) => (
    <div style={{
      background: '#f8fafc',
      border: '1.5px solid #e0e7ef',
      borderRadius: 18,
      boxShadow: '0 2px 8px 0 rgba(44,62,80,0.04)',
      padding: '1.5rem 1.2rem',
      margin: '0.7rem 0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1.2rem',
      minWidth: 0,
      maxWidth: 520,
      width: '100%',
      transition: 'box-shadow 0.18s',
    }}>
      <div style={{ fontSize: 32, color: '#3b82f6', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#232946', marginBottom: 2 }}>{title}</div>
        {subtitle && <div style={{ color: '#6c6f7b', fontSize: '1.01rem', fontWeight: 500, marginBottom: 2 }}>{subtitle}</div>}
        {desc && <div style={{ color: '#a0a1b5', fontSize: '0.98rem', marginTop: 2 }}>{desc}</div>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Get user info for header
  const username = localStorage.getItem('username');
  const userRole = localStorage.getItem('role');

  // Filter features: only show Admin card if user is admin, always hide Calendar and Email Alerts
  const filteredFeatures = dashboardFeatures.filter(f => {
    if (f.title === 'Calendar') return false;
    if (f.title === 'Email Alerts') return false;
    if (f.title === 'Admin' && userRole?.toLowerCase() !== 'admin') return false;
    return true;
  });

  return (
    <div className="dashboard-root landing-revamp">
      {/* Doodle SVG watermark background for project management/corporate theme - always visible, behind all content */}
      <div className="landing-doodle-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', opacity: 0.09 }}>
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
            <ellipse cx="820" y="100" rx="20" ry="10" />
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
            <rect x="1410" y="660" width="12" height="12" rx="3" />
            <rect x="1430" y="660" width="12" height="12" rx="3" />
          </g>
        </svg>
      </div>
      <div className="dashboard-container dashboard-flex-layout" style={{ background: '#fff' }}>
        <div className="dashboard-main-content">
          {/* Premium Header (with user info and logout) */}
          <header className="landing-header landing-revamp-header">
            <div className="logo-title landing-revamp-logo">
              <span className="logo-circle">OPM</span>
            </div>
            <nav className="landing-nav landing-revamp-nav">
              <div className="landing-user-info">
                <span
                  className="landing-user-avatar revamp-user-avatar"
                  onClick={() => setShowName(v => !v)}
                  style={{ cursor: 'pointer' }}
                  title="Show name"
                >
                  {username ? username[0].toUpperCase() : ''}
                </span>
                {showName && (
                  <span className="landing-user-name">{username}</span>
                )}
                <button
                  className="nav-btn"
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    navigate('/');
                  }}
                >
                  Logout
                </button>
              </div>
            </nav>
          </header>

          {/* Assigned Projects & Tasks below header, above nav/calendar */}
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '2.5rem',
            margin: '1.5rem 0 0.5rem 0',
          }}>
            {/* Projects */}
            <div style={{ flex: 1, maxWidth: 420 }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#232946', marginBottom: 10, letterSpacing: '0.01em' }}>Assigned Projects</h2>
              {(Array.isArray(assignedProjects) && assignedProjects.length > 0) ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', margin: 0 }}>
                  {assignedProjects.map((p, idx) => (
                    <InfoCard
                      key={p.id || idx}
                      title={p.name}
                      subtitle={`Owner: ${p.ownerUsername || p.ownername || ''} | Status: ${p.status || 'N/A'}`}
                      desc={`Start: ${p.startDate || '-'} | End: ${p.endDate || '-'}${p.description ? `\n${p.description}` : ''}`}
                      icon={<PiNotepadBold className="feature-icon" />}
                    />
                  ))}
                </div>
              ) : (
                <EmptyWatermark label="No assigned projects yet. Projects you are assigned to will appear here." />
              )}
            </div>
            {/* Tasks */}
            <div style={{ flex: 1, maxWidth: 420 }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#232946', marginBottom: 10, letterSpacing: '0.01em' }}>Assigned Tasks</h2>
              {(Array.isArray(assignedTasks) && assignedTasks.length > 0) ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', margin: 0 }}>
                  {assignedTasks.map((task, idx) => (
                    <InfoCard
                      key={task.id || idx}
                      title={task.name || task.title}
                      subtitle={`Status: ${task.status || 'N/A'}${task.project ? ` | Project: ${typeof task.project === 'string' ? task.project : (task.project?.name || task.project?.title || '')}` : ''}${task.milestone ? ` | Milestone: ${task.milestone?.name || task.milestone?.id || task.milestoneId || ''}` : ''}`}
                      desc={task.description}
                      icon={<PiNotepadBold className="feature-icon" />}
                    />
                  ))}
                </div>
              ) : (
                <EmptyWatermark label="No assigned tasks yet. Tasks you are assigned to will appear here." />
              )}
            </div>
          </div>

          {/* Lowered Sidebar Navigation Plane - Minimal UI */}
          <nav className="dashboard-quicknav-sidebar dashboard-quicknav-lowered dashboard-quicknav-minimal">
            {filteredFeatures.map((feature, idx) => (
              <button
                key={feature.title}
                className="dashboard-quicknav-btn dashboard-quicknav-btn-minimal dashboard-quicknav-btn-uniform"
                style={{ background: '#f8fafc', color: '#232946', cursor: feature.route ? 'pointer' : 'not-allowed', opacity: feature.route ? 1 : 0.7, border: '1.5px solid #e0e7ef' }}
                onClick={() => feature.route && navigate(feature.route)}
                title={feature.title}
                tabIndex={0}
                disabled={!feature.route}
              >
                <span className="dashboard-quicknav-icon dashboard-quicknav-icon-minimal">{feature.icon}</span>
                <span className="dashboard-quicknav-label dashboard-quicknav-label-minimal">{feature.title}</span>
              </button>
            ))}
          </nav>

          <div className="dashboard-side-calendar">
            <Calendar small toolbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;