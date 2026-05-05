import { FiX } from 'react-icons/fi';
import { MONTH_SHORT } from '../../data/dashboardData';

/* ─────────────────────────────────────────────────────────
   AttendanceOverviewCard — donut chart + stats + filter
───────────────────────────────────────────────────────── */
export function AttendanceOverviewCard({ attOverview, overviewFilter, onFilterChange }) {
  const overviewPct = ((attOverview.present / attOverview.totalWorking) * 100).toFixed(1);
  return (
    <div className="att-overview-card">
      <h3 className="att-card-title">Attendance Overview - Academic Year 2025-26</h3>
      <div className="att-overview-body">
        <div className="att-donut-wrap">
          <svg viewBox="0 0 120 120" className="att-donut">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="14" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="#43a047" strokeWidth="14" strokeDasharray={`${(attOverview.present / attOverview.totalWorking) * 326.73} 326.73`} strokeDashoffset="0" transform="rotate(-90 60 60)" strokeLinecap="round" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="#ffa726" strokeWidth="14" strokeDasharray={`${(attOverview.onLeave / attOverview.totalWorking) * 326.73} 326.73`} strokeDashoffset={`${-(attOverview.present / attOverview.totalWorking) * 326.73}`} transform="rotate(-90 60 60)" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="#ef5350" strokeWidth="14" strokeDasharray={`${(attOverview.absent / attOverview.totalWorking) * 326.73} 326.73`} strokeDashoffset={`${-((attOverview.present + attOverview.onLeave) / attOverview.totalWorking) * 326.73}`} transform="rotate(-90 60 60)" />
          </svg>
          <div className="att-donut-center"><span className="att-donut-label">Overall<br/>Presence:</span><span className="att-donut-pct">{overviewPct}%</span></div>
        </div>
        <div className="att-overview-stats">
          <div className="att-stat"><span className="att-dot att-dot-total" /> Total Working Days <strong>{attOverview.totalWorking}</strong></div>
          <div className="att-stat"><span className="att-dot att-dot-present" /> Present Days <strong>{attOverview.present}</strong></div>
          <div className="att-stat"><span className="att-dot att-dot-absent" /> Absent Days <strong>{attOverview.absent}</strong></div>
          <div className="att-stat"><span className="att-dot att-dot-leave" /> On Leave <strong>{attOverview.onLeave}</strong></div>
        </div>
      </div>
      <div className="att-overview-bot">
        <div className="att-minifilter-grp">
          {['Weekly', 'Monthly', 'Yearly'].map(f => (
            <button key={f} onClick={() => onFilterChange(f)} className={`att-minifilter-btn ${overviewFilter === f ? 'active' : ''}`}>{f}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LeaveBreakdownCard
───────────────────────────────────────────────────────── */
export function LeaveBreakdownCard({ leaveBreakdown, onApplyLeave }) {
  const remainLeaves = leaveBreakdown.casual.total + leaveBreakdown.sick.total + leaveBreakdown.earned.total
                     - leaveBreakdown.casual.used  - leaveBreakdown.sick.used  - leaveBreakdown.earned.used;
  return (
    <div className="att-leave-card">
      <h3 className="att-card-title">Leave Breakdown</h3>
      <div className="att-leave-bar-wrap">
        <span className="att-leave-total">{leaveBreakdown.casual.total + leaveBreakdown.sick.total + leaveBreakdown.earned.total} days</span>
        <div className="att-leave-bar">
          <div className="att-bar-seg att-bar-casual"  style={{ flex: leaveBreakdown.casual.total  }}>{leaveBreakdown.casual.used}/{leaveBreakdown.casual.total}</div>
          <div className="att-bar-seg att-bar-sick"    style={{ flex: leaveBreakdown.sick.total    }}>{leaveBreakdown.sick.used}/{leaveBreakdown.sick.total}</div>
          <div className="att-bar-seg att-bar-earned"  style={{ flex: leaveBreakdown.earned.total  }}>{leaveBreakdown.earned.used}/{leaveBreakdown.earned.total}</div>
          <div className="att-bar-seg att-bar-remain"  style={{ flex: remainLeaves                 }}>{remainLeaves}</div>
        </div>
        <div className="att-leave-legend">
          <span><span className="att-dot att-dot-casual" /> Casual</span>
          <span><span className="att-dot att-dot-sick" /> Sick</span>
          <span><span className="att-dot att-dot-earned" /> Earned</span>
          <span><span className="att-dot att-dot-remain" /> Remaining Leaves</span>
        </div>
      </div>
      <div className="att-leave-rows">
        {[
          { label: 'Casual Leave', cls: 'att-fill-casual', data: leaveBreakdown.casual },
          { label: 'Sick Leave',   cls: 'att-fill-sick',   data: leaveBreakdown.sick },
          { label: 'Earned Leave', cls: 'att-fill-earned',  data: leaveBreakdown.earned },
        ].map(r => (
          <div key={r.label} className="att-leave-row">
            <span>{r.label}</span>
            <div className="att-leave-mini-bar"><div className={`att-mini-fill ${r.cls}`} style={{ width: `${(r.data.used / r.data.total) * 100}%` }} /></div>
            <strong>{r.data.used}/{r.data.total}</strong>
          </div>
        ))}
      </div>
      <button className="att-apply-btn" onClick={onApplyLeave}>Apply for Leave <span>+</span></button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BiometricLogsCard
───────────────────────────────────────────────────────── */
export function BiometricLogsCard({ selectedBioDate, biometricLogs }) {
  const logs = biometricLogs[selectedBioDate] || [];
  return (
    <div className="att-biometric-card">
      <div className="att-bio-header"><h3 className="att-card-title">Detailed Biometric Logs</h3><span className="att-bio-date">{selectedBioDate}</span></div>
      <div className="att-bio-body">
        {logs.length > 0 ? (
          <div className="att-timeline">
            {logs.map(log => (
              <div key={log.id} className="att-timeline-item">
                <div className={`att-timeline-dot ${log.type === 'In' ? 't-dot-in' : 't-dot-out'}`} />
                <div className="att-timeline-card"><div className="att-t-time">{log.time}</div><div className="att-t-gate">{log.gate}</div><span className={`att-t-badge ${log.type === 'In' ? 't-badge-in' : 't-badge-out'}`}>{log.type}</span></div>
              </div>
            ))}
          </div>
        ) : <div className="att-timeline-empty"><p>No biometric logs recorded for this day.</p></div>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DailyAttendanceLog
───────────────────────────────────────────────────────── */
export function DailyAttendanceLog({ filteredAttendance, selectedBioDate, attFilter, setAttFilter, onRowClick, onToggleStar }) {
  return (
    <div className="att-log-card">
      <div className="att-log-header">
        <h3 className="att-card-title">Daily Attendance Log</h3>
        <select className="att-filter-select" value={attFilter} onChange={e => setAttFilter(e.target.value)}>
          <option value="All">Filter...</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>
      <div className="att-log-table-wrap">
        <table className="att-log-table">
          <thead><tr><th></th><th>Date</th><th>Status</th><th>Time In</th><th>Time Out</th><th>Leave Reason</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredAttendance.map(a => (
              <tr key={a.id} onClick={() => onRowClick(a.date)} className={selectedBioDate === a.date ? 'att-row-active' : ''} style={{ cursor: 'pointer' }}>
                <td className="att-star" style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); onToggleStar(a.id); }} title="Toggle Star">{a.starred ? '★' : '☆'}</td>
                <td>{a.date}</td>
                <td><span className={`att-log-status ${a.status === 'Present' ? 'att-s-present' : a.status === 'Absent' ? 'att-s-absent' : 'att-s-leave'}`}>{a.status}</span></td>
                <td>{a.timeIn}</td><td>{a.timeOut}</td><td>{a.leaveReason}</td>
                <td><span className="att-action-link" onClick={() => alert(`Action triggered for ${a.date} (${a.status})`)}>{a.status === 'Absent' ? 'Report Error' : 'View Details'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ApplyLeaveModal
───────────────────────────────────────────────────────── */
export function ApplyLeaveModal({ newLeave, setNewLeave, onSubmit, onClose }) {
  return (
    <div className="n-modal-overlay" onClick={onClose}>
      <div className="n-modal" onClick={e => e.stopPropagation()}>
        <div className="n-modal-header"><h3>Apply for Leave</h3><button className="n-modal-close" onClick={onClose}><FiX /></button></div>
        <div className="n-modal-body">
          <div className="n-form-field"><label>Leave Type</label><select value={newLeave.type} onChange={e => setNewLeave(p => ({ ...p, type: e.target.value }))}><option>Casual</option><option>Sick</option><option>Earned</option></select></div>
          <div className="n-form-field"><label>From Date</label><input type="date" value={newLeave.from} onChange={e => setNewLeave(p => ({ ...p, from: e.target.value }))} /></div>
          <div className="n-form-field"><label>To Date (optional)</label><input type="date" value={newLeave.to} onChange={e => setNewLeave(p => ({ ...p, to: e.target.value }))} /></div>
          <div className="n-form-field"><label>Reason</label><textarea placeholder="Enter reason for leave..." rows={3} value={newLeave.reason} onChange={e => setNewLeave(p => ({ ...p, reason: e.target.value }))} /></div>
        </div>
        <div className="n-modal-footer"><button className="n-modal-cancel" onClick={onClose}>Cancel</button><button className="n-modal-submit" onClick={onSubmit}>Submit Application</button></div>
      </div>
    </div>
  );
}
