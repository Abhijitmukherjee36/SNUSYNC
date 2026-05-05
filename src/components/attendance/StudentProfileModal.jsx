import { FiX } from 'react-icons/fi';
import { HISTORY } from '../../data/attendanceData';

/**
 * StudentProfileModal — opens when teacher clicks a student name or ID.
 * Shows: avatar initials, attendance badges, full history from HISTORY data.
 */
export default function StudentProfileModal({ student, onClose }) {
  if (!student) return null;

  const hist = HISTORY.map(h => {
    const found = h.details.find(d => d.name === student.name);
    return found ? { date: h.date, status: found.status } : null;
  }).filter(Boolean);

  const presentCount = hist.filter(h => h.status === 'present').length;
  const absentCount  = hist.filter(h => h.status === 'absent').length;
  const pct = hist.length > 0 ? Math.round((presentCount / hist.length) * 100) : 0;
  const initials = student.name.split(' ').map(w => w[0]).slice(0, 2).join('');

  return (
    <div className="att-modal-overlay" onClick={onClose}>
      <div className="att-modal att-profile-modal" onClick={e => e.stopPropagation()}>
        <button className="att-modal-close" onClick={onClose}><FiX /></button>

        <div className="att-profile-header">
          <div className="att-profile-avatar">{initials}</div>
          <div className="att-profile-info">
            <p className="att-profile-name">{student.name}</p>
            <p className="att-profile-id">ID: {student.id}</p>
            <div className="att-profile-badges">
              <span className="att-profile-badge att-pb-present">✓ Present: {presentCount}</span>
              <span className="att-profile-badge att-pb-absent">✗ Absent: {absentCount}</span>
              <span className="att-profile-badge att-pb-pct">📊 {pct}% Attendance</span>
            </div>
          </div>
        </div>

        <div className="att-profile-history">
          <p className="att-profile-history-title">Attendance History ({hist.length} classes)</p>
          {hist.length > 0 ? hist.map((h, i) => (
            <div key={i} className="att-profile-row">
              <span className="att-profile-row-date">{h.date}</span>
              <span className={`att-profile-row-dot ${h.status}`} />
              <span className={`att-profile-row-status ${h.status}`}>
                {h.status === 'present' ? 'Present' : 'Absent'}
              </span>
            </div>
          )) : (
            <div className="att-profile-empty">No attendance history found for this student.</div>
          )}
        </div>

        <button className="att-modal-ok" style={{ marginTop: 14 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
