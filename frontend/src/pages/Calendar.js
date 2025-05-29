import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import axios from 'axios';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const publicHolidays = [
  { title: 'Republic Day', date: '2025-01-26' },
  { title: 'Independence Day', date: '2025-08-15' },
  { title: 'Gandhi Jayanti', date: '2025-10-02' },
  { title: 'Diwali', date: '2025-11-11' },
  { title: 'Christmas', date: '2025-12-25' },
];

export default function Calendar({ small, toolbar }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');

        // Fetch projects and tasks based on user role
        const [projectsRes, tasksRes] = await Promise.all([
          axios.get('http://localhost:8080/api/projects', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8080/api/tasks', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const projects = projectsRes.data.filter(project =>
          role === 'manager' || project.ownerUsername === username
        );

        const tasks = tasksRes.data.filter(task =>
          role === 'manager' || task.assignedUsers.some(user => user.username === username)
        );

        // Map projects and tasks to calendar events
        const projectEvents = projects.map(project => ({
          title: `Project: ${project.name}`,
          start: new Date(project.startDate),
          end: new Date(project.endDate),
          type: 'Project',
        }));

        const taskEvents = tasks.map(task => ({
          title: `Task: ${task.name}`,
          start: new Date(task.milestone.startDate),
          end: new Date(task.milestone.endDate),
          type: 'Task',
        }));

        // Map public holidays to calendar events
        const holidayEvents = publicHolidays.map(holiday => ({
          title: `Holiday: ${holiday.title}`,
          start: new Date(holiday.date),
          end: new Date(holiday.date),
          type: 'Holiday',
        }));

        setEvents([...projectEvents, ...taskEvents, ...holidayEvents]);
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const eventPropGetter = useMemo(() => event => {
    if (event.type === 'Project') {
      return {
        style: {
          backgroundColor: '#3b82f6',
          color: '#fff',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 700,
        },
      };
    }
    if (event.type === 'Task') {
      return {
        style: {
          backgroundColor: '#22c55e',
          color: '#fff',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 700,
        },
      };
    }
    if (event.type === 'Holiday') {
      return {
        style: {
          backgroundColor: '#ef4444',
          color: '#fff',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 700,
        },
      };
    }
    return {
      style: {
        backgroundColor: '#e0e7ef',
        color: '#232946',
        borderRadius: '8px',
        border: 'none',
      },
    };
  }, []);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={small ? { background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e0e7ef', padding: 12, margin: 0, minWidth: 0 } : { background: '#f3f6fa', minHeight: '100vh', paddingBottom: 32 }}>
      {!small && (
        <div className="revamp-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
          <h2 className="revamp-title">Work Calendar (Project Events)</h2>
          <button
            onClick={() => navigate('/')}
            className="revamp-cta-btn"
            style={{ marginLeft: 16, marginRight: 32 }}
          >
            Back to Home
          </button>
        </div>
      )}
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={small ? { height: 340, fontSize: 13 } : { height: 560 }}
        eventPropGetter={eventPropGetter}
        views={['month']}
        popup
        toolbar={toolbar !== undefined ? toolbar : !small}
      />
    </div>
  );
}
