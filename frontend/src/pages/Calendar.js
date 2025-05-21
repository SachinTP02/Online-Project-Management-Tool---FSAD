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
        <h2 style={{ marginLeft: 32, fontWeight: 900, fontSize: 28, color: '#232946', letterSpacing: 0.5 }}>Work Calendar (Project Events)</h2>
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
            marginRight: 32,
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
      {/* Modern color-coded legend for project events only */}
      <div style={{ display: 'flex', gap: 22, marginLeft: 40, marginTop: 18, marginBottom: 8, alignItems: 'center', fontWeight: 600, fontSize: 15 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 18, height: 18, background: '#22c55e', borderRadius: 5, display: 'inline-block', border: '2px solid #16a34a', boxShadow: '0 1px 4px #22c55e33' }}></span> Meeting</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 18, height: 18, background: '#ef4444', borderRadius: 5, display: 'inline-block', border: '2px solid #b91c1c', boxShadow: '0 1px 4px #ef444433' }}></span> Deadline</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 18, height: 18, background: '#3b82f6', borderRadius: 5, display: 'inline-block', border: '2px solid #1d4ed8', boxShadow: '0 1px 4px #3b82f633' }}></span> Milestone</span>
      </div>
      <div style={{ margin: '24px 0 18px 0', display: 'flex', alignItems: 'center', gap: 16, marginLeft: 40 }}>
        <button
          onClick={() => setAdding(a => !a)}
          style={{
            background: adding ? '#e0e7ef' : '#3b82f6',
            color: adding ? '#2563eb' : '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: '0 1px 4px #dbeafe',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        >
          {adding ? 'Cancel' : 'Add Project Event'}
        </button>
        {adding && (
          <form onSubmit={handleAddEvent} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              name="title"
              value={form.title}
              onChange={handleFormChange}
              placeholder="Event Title"
              required
              style={{ borderRadius: 8, border: '1px solid #d1d5db', padding: '8px 12px', fontSize: 15, minWidth: 120 }}
            />
            <input
              name="date"
              value={form.date}
              onChange={handleFormChange}
              type="date"
              required
              style={{ borderRadius: 8, border: '1px solid #d1d5db', padding: '8px 12px', fontSize: 15 }}
            />
            <select
              name="type"
              value={form.type}
              onChange={handleFormChange}
              style={{ borderRadius: 8, border: '1px solid #d1d5db', padding: '8px 12px', fontSize: 15 }}
            >
              <option value="Meeting">Meeting</option>
              <option value="Deadline">Deadline</option>
              <option value="Milestone">Milestone</option>
            </select>
            <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
              Add
            </button>
          </form>
        )}
      </div>
      <div style={{ height: 600, background: '#fff', borderRadius: 22, boxShadow: '0 8px 32px #e0e7ef', padding: 24, marginTop: 24, border: '2.5px solid #e0e7ef', maxWidth: 1100, marginLeft: 'auto', marginRight: 'auto' }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 560, fontSize: 16, background: '#fff', borderRadius: 18 }}
          eventPropGetter={eventPropGetter}
          views={['month', 'agenda']}
          popup
        />
      </div>
    </div>
  );
}
