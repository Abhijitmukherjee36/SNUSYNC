import { useState } from 'react';
import { FiX, FiClock, FiMapPin } from 'react-icons/fi';
import { EVENTS } from '../../data/dashboardData';

/**
 * EventsPanel — single featured event card + View All modal.
 * Used in the right panel of DashboardHome.
 */
export default function EventsPanel() {
  const [eventsModalOpen, setEventsModalOpen] = useState(false);

  return (
    <>
      <div className="d-events">
        <div className="d-sec-head">
          <h3>Upcoming Event</h3>
          <span className="d-link" onClick={() => setEventsModalOpen(true)}>
            View All ({EVENTS.length})
          </span>
        </div>
        {EVENTS.slice(0, 1).map(e => (
          <div key={e.id} className="d-ev-card" style={{ padding: '16px 18px' }}>
            <div className="d-ev-row">
              <h4>{e.title}</h4>
              <span>{e.date}</span>
            </div>
            <p style={{ marginBottom: 8 }}>{e.desc}</p>
            <div style={{ display: 'flex', gap: 14, fontSize: 11.5, color: '#777', fontFamily: "'Inter',sans-serif" }}>
              {e.time  && <span>🕐 {e.time}</span>}
              {e.venue && <span>📍 {e.venue}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* View All Modal */}
      {eventsModalOpen && (
        <div className="d-viewall-overlay" onClick={() => setEventsModalOpen(false)}>
          <div className="d-viewall-modal" onClick={e => e.stopPropagation()}>
            <div className="d-viewall-header">
              <h3>All Events ({EVENTS.length})</h3>
              <button className="d-viewall-close" onClick={() => setEventsModalOpen(false)}><FiX /></button>
            </div>
            <div className="d-viewall-body">
              {EVENTS.map(e => (
                <div key={e.id} className="d-ev-modal-card">
                  <h4 className="d-ev-modal-title">{e.title}</h4>
                  <div className="d-ev-modal-meta">
                    <span>📅 {e.date}</span>
                    {e.time  && <span><FiClock style={{ verticalAlign: 'middle', marginRight: 3 }} />{e.time}</span>}
                    {e.venue && <span><FiMapPin style={{ verticalAlign: 'middle', marginRight: 3 }} />{e.venue}</span>}
                  </div>
                  <p className="d-ev-modal-desc">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
