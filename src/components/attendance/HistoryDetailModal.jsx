import { FiX } from 'react-icons/fi';

/**
 * HistoryDetailModal — opens when teacher clicks a row in the history table.
 * Shows: date, present/absent/total stats, and per-student detail list.
 */
export default function HistoryDetailModal({ record, onClose }) {
  if (!record) return null;

  return (
    <div className="att-modal-overlay" onClick={onClose}>
      <div className="att-modal att-history-modal" onClick={e => e.stopPropagation()}>
        <button className="att-modal-close" onClick={onClose}><FiX /></button>
        <h2>Attendance — {record.date}</h2>

        <div className="att-modal-stats" style={{ marginBottom: 14 }}>
          <div className="att-modal-stat green"><span>{record.present}</span><small>Present</small></div>
          <div className="att-modal-stat red"><span>{record.absent}</span><small>Absent</small></div>
          <div className="att-modal-stat blue"><span>{record.total}</span><small>Total</small></div>
        </div>

        <div className="att-detail-list">
          {record.details.map((d, i) => (
            <div key={i} className={`att-detail-row ${d.status}`}>
              <span className="att-detail-sno">{i + 1}</span>
              <span className="att-detail-name">{d.name}</span>
              <span className={`att-detail-dot ${d.status === 'present' ? 'att-dot-green' : 'att-dot-red'}`} />
              <span className={`att-status-badge ${d.status === 'present' ? 'att-badge-present' : 'att-badge-absent'}`}>
                {d.status === 'present' ? 'Present' : 'Absent'}
              </span>
            </div>
          ))}
        </div>

        <button className="att-modal-ok" style={{ marginTop: 16 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
