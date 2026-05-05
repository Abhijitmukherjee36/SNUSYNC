import { FiX } from 'react-icons/fi';

/**
 * SuccessModal — animated checkmark modal shown after attendance is submitted.
 * Props: dept, sem, sec, stats { present, absent, total }, onDone callback.
 */
export default function SuccessModal({ dept, sem, sec, stats, onClose, onDone }) {
  return (
    <div className="att-modal-overlay" onClick={onClose}>
      <div className="att-modal" onClick={e => e.stopPropagation()}>
        <button className="att-modal-close" onClick={onClose}><FiX /></button>

        <div className="att-modal-check">
          <svg viewBox="0 0 52 52" className="att-checkmark">
            <circle cx="26" cy="26" r="25" fill="none" className="att-checkmark-circle" />
            <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="att-checkmark-tick" />
          </svg>
        </div>

        <h2>Attendance Submitted!</h2>
        <p>Attendance for <strong>{dept}</strong> — {sem} Sem, Sec {sec} recorded successfully.</p>

        <div className="att-modal-stats">
          <div className="att-modal-stat green"><span>{stats.present}</span><small>Present</small></div>
          <div className="att-modal-stat red"><span>{stats.absent}</span><small>Absent</small></div>
          <div className="att-modal-stat blue"><span>{stats.total}</span><small>Total</small></div>
        </div>

        <button className="att-modal-ok" onClick={onDone}>
          View in Students Page
        </button>
      </div>
    </div>
  );
}
