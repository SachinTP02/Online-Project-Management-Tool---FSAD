import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
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

export default function Calendar() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(() => {
    // Load events from localStorage if available
    const saved = localStorage.getItem('projectEvents');
    return saved ? JSON.parse(saved).map(e => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
    })) : [];
  });
  const [form, setForm] = useState({ title: '', date: '', type: 'Meeting' });
  const [adding, setAdding] = useState(false);

  // Persist events to localStorage
  useEffect(() => {
    localStorage.setItem('projectEvents', JSON.stringify(events));
  }, [events]);

  const eventPropGetter = useMemo(() => (event) => {
    if (event.type === 'Deadline') {
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
    if (event.type === 'Milestone') {
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
    if (event.type === 'Meeting') {
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
    // Default style
    return {
      style: {
        backgroundColor: '#e0e7ef',
        color: '#232946',
        borderRadius: '8px',
        border: 'none',
      },
    };
  }, []);

  function handleFormChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleAddEvent(e) {
    e.preventDefault();
    if (!form.title || !form.date) return;
    setEvents(prev => [
      ...prev,
      {
        title: form.title,
        start: new Date(form.date),
        end: new Date(form.date),
        allDay: true,
        type: form.type,
      },
    ]);
    setForm({ title: '', date: '', type: 'Meeting' });
    setAdding(false);
  }

  return (
    <div className="feature-page" style={{ background: '#f3f6fa', minHeight: '100vh', paddingBottom: 32 }}>
      <div className="revamp-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
        <h2 className="revamp-title">Work Calendar (Project Events)</h2>
        <button
          onClick={() => navigate('/')}
          className="revamp-cta-btn"
          style={{
            marginLeft: 16,
            marginRight: 32,
          }}
        >
          Back to Home
        </button>
      </div>
      {/* Modern color-coded legend for project events only */}
      <div className="revamp-feature-legend" style={{ marginLeft: 40, marginTop: 18, marginBottom: 8 }}>
        <span className="revamp-feature-legend-item"><span className="revamp-feature-legend-color" style={{ background: '#22c55e', border: '2px solid #16a34a' }}></span> Meeting</span>
        <span className="revamp-feature-legend-item"><span className="revamp-feature-legend-color" style={{ background: '#ef4444', border: '2px solid #b91c1c' }}></span> Deadline</span>
        <span className="revamp-feature-legend-item"><span className="revamp-feature-legend-color" style={{ background: '#3b82f6', border: '2px solid #1d4ed8' }}></span> Milestone</span>
      </div>
      <div className="revamp-feature-actions" style={{ marginLeft: 40 }}>
        <button
          onClick={() => setAdding(a => !a)}
          className={`revamp-cta-btn ${adding ? 'revamp-cta-btn-cancel' : ''}`}
        >
          {adding ? 'Cancel' : 'Add Project Event'}
        </button>
        {adding && (
          <form onSubmit={handleAddEvent} className="revamp-feature-form">
            <input
              name="title"
              value={form.title}
              onChange={handleFormChange}
              placeholder="Event Title"
              required
              className="revamp-feature-input"
            />
            <input
              name="date"
              value={form.date}
              onChange={handleFormChange}
              type="date"
              required
              className="revamp-feature-input"
            />
            <select
              name="type"
              value={form.type}
              onChange={handleFormChange}
              className="revamp-feature-select"
            >
              <option value="Meeting">Meeting</option>
              <option value="Deadline">Deadline</option>
              <option value="Milestone">Milestone</option>
            </select>
            <button type="submit" className="revamp-cta-btn">
              Add
            </button>
          </form>
        )}
      </div>
      <div className="revamp-feature-calendar">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 560 }}
          eventPropGetter={eventPropGetter}
          views={['month', 'agenda']}
          popup
        />
      </div>
    </div>
  );
}
