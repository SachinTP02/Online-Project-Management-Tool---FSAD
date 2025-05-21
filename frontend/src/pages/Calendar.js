import React from 'react';

const mockEvents = [
  { id: 1, type: 'Holiday', name: 'Memorial Day', date: '2025-05-26' },
  { id: 2, type: 'Project', name: 'Sprint Review', date: '2025-05-28' },
  { id: 3, type: 'Holiday', name: 'Independence Day', date: '2025-07-04' },
];

export default function Calendar() {
  return (
    <div className="feature-page">
      <h2>Calendar</h2>
      <table className="feature-table">
        <thead>
          <tr><th>Type</th><th>Name</th><th>Date</th></tr>
        </thead>
        <tbody>
          {mockEvents.map(e => (
            <tr key={e.id}>
              <td>{e.type}</td>
              <td>{e.name}</td>
              <td>{e.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
