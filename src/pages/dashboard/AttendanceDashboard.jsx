import { useState, useMemo } from 'react';
import { FiPlusCircle, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout';
import {
  OVERVIEW_DATA_FILTERS, LEAVE_BREAKDOWN, DAILY_ATTENDANCE, BIOMETRIC_LOGS,
  MONTH_NAMES, MONTH_SHORT, buildCalendar, D0
} from '../../data/dashboardData';

const NOW = new Date();

export default function AttendanceDashboard() {
  const [overviewFilter, setOverviewFilter] = useState('Yearly');
  const [attOverview, setAttOverview] = useState(OVERVIEW_DATA_FILTERS['Yearly']);
  const [leaveBreakdown, setLeaveBreakdown] = useState(LEAVE_BREAKDOWN);
  const [dailyAttendance, setDailyAttendance] = useState(DAILY_ATTENDANCE);
  const [attFilter, setAttFilter] = useState('All');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [newLeave, setNewLeave] = useState({ type: 'Casual', from: '', to: '', reason: '' });
  const [selectedBioDate, setSelectedBioDate] = useState(D0);
  const [calMonth, setCalMonth] = useState(NOW.getMonth());
  const [calYear, setCalYear] = useState(NOW.getFullYear());
  const calGrid = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth]);

  const handleOverviewFilterChange = (filter) => { setOverviewFilter(filter); setAttOverview(OVERVIEW_DATA_FILTERS[filter]); };
  const overviewPct = ((attOverview.present / attOverview.totalWorking) * 100).toFixed(1);
  const remainLeaves = leaveBreakdown.casual.total + leaveBreakdown.sick.total + leaveBreakdown.earned.total - leaveBreakdown.casual.used - leaveBreakdown.sick.used - leaveBreakdown.earned.used;

  const filteredAttendance = useMemo(() => {
    if (attFilter === 'All') return dailyAttendance;
    return dailyAttendance.filter(a => a.status.toLowerCase().includes(attFilter.toLowerCase()));
  }, [attFilter, dailyAttendance]);

  const handleApplyLeave = () => {
    if (!newLeave.from || !newLeave.reason) return;
    setAttOverview(prev => ({ ...prev, present: Math.max(0, prev.present - 1), onLeave: prev.onLeave + 1 }));
    const lType = newLeave.type.toLowerCase();
    setLeaveBreakdown(prev => ({ ...prev, [lType]: { ...prev[lType], used: prev[lType].used + 1 } }));
    const d = new Date(newLeave.from);
    let dateStr = newLeave.from;
    if (!isNaN(d)) {
      dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      if (dateStr.match(/^\d /)) dateStr = dateStr.replace(/^(\d) /, '$1th ');
      else if (dateStr.match(/^\d\d /)) dateStr = dateStr.replace(/^(\d\d) /, '$1th ');
    }
    setDailyAttendance(prev => [{ id: Date.now(), date: dateStr, status: `On Leave - ${newLeave.type}`, timeIn: '-', timeOut: '-', leaveReason: newLeave.reason, starred: false }, ...prev]);
    setNewLeave({ type: 'Casual', from: '', to: '', reason: '' });
    setShowLeaveModal(false);
  };

  const handleToggleStar = (id) => setDailyAttendance(prev => prev.map(a => a.id === id ? { ...a, starred: !a.starred } : a));

  const renderCalendar = () => (
    <div className="d-cal">
      <div className="d-cal-hd">
        <button className="d-cal-arrow" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}><FiChevronLeft /></button>
        <span>{MONTH_NAMES[calMonth]} {calYear}</span>
        <button className="d-cal-arrow" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}><FiChevronRight /></button>
      </div>
      <table className="d-cal-tbl">
        <thead><tr>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <th key={d}>{d}</th>)}</tr></thead>
        <tbody>
          {calGrid.map((wk, wi) => (
            <tr key={wi}>
              {wk.map((day, di) => {
                const live = new Date();
                const isToday = day === live.getDate() && calMonth === live.getMonth() && calYear === live.getFullYear();
                let cls = day == null ? 'empty' : isToday ? 'today' : '';
                if (day != null) {
                  const attMatch = dailyAttendance.find(a => { const dayNum = parseInt(a.date); const monthStr = a.date.split(' ')[1]; return dayNum === day && MONTH_SHORT[calMonth] === monthStr && calYear === NOW.getFullYear(); });
                  if (attMatch) {
                    if (attMatch.status === 'Present') cls += ' cal-att-present';
                    else if (attMatch.status === 'Absent') cls += ' cal-att-absent';
                    else if (attMatch.status.includes('Leave')) cls += ' cal-att-leave';
                  }
                }
                return <td key={di} className={cls}>{day}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <DashboardLayout activeTab="attendance" fullWidth>
      <div className="att-grid">
        {/* Overview Card */}
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
              <div className="att-stat"><span className="att-dot att-dot-total"></span> Total Working Days <strong>{attOverview.totalWorking}</strong></div>
              <div className="att-stat"><span className="att-dot att-dot-present"></span> Present Days <strong>{attOverview.present}</strong></div>
              <div className="att-stat"><span className="att-dot att-dot-absent"></span> Absent Days <strong>{attOverview.absent}</strong></div>
              <div className="att-stat"><span className="att-dot att-dot-leave"></span> On Leave <strong>{attOverview.onLeave}</strong></div>
            </div>
          </div>
          <div className="att-overview-bot">
            <div className="att-minifilter-grp">
              {['Weekly', 'Monthly', 'Yearly'].map(f => <button key={f} onClick={() => handleOverviewFilterChange(f)} className={`att-minifilter-btn ${overviewFilter === f ? 'active' : ''}`}>{f}</button>)}
            </div>
          </div>
        </div>

        {/* Leave Breakdown */}
        <div className="att-leave-card">
          <h3 className="att-card-title">Leave Breakdown</h3>
          <div className="att-leave-bar-wrap">
            <span className="att-leave-total">{leaveBreakdown.casual.total + leaveBreakdown.sick.total + leaveBreakdown.earned.total} days</span>
            <div className="att-leave-bar">
              <div className="att-bar-seg att-bar-casual" style={{ flex: leaveBreakdown.casual.total }}>{leaveBreakdown.casual.used}/{leaveBreakdown.casual.total}</div>
              <div className="att-bar-seg att-bar-sick" style={{ flex: leaveBreakdown.sick.total }}>{leaveBreakdown.sick.used}/{leaveBreakdown.sick.total}</div>
              <div className="att-bar-seg att-bar-earned" style={{ flex: leaveBreakdown.earned.total }}>{leaveBreakdown.earned.used}/{leaveBreakdown.earned.total}</div>
              <div className="att-bar-seg att-bar-remain" style={{ flex: remainLeaves }}>{remainLeaves}</div>
            </div>
            <div className="att-leave-legend">
              <span><span className="att-dot att-dot-casual"></span> Casual</span>
              <span><span className="att-dot att-dot-sick"></span> Sick</span>
              <span><span className="att-dot att-dot-earned"></span> Earned</span>
              <span><span className="att-dot att-dot-remain"></span> Remaining Leaves</span>
            </div>
          </div>
          <div className="att-leave-rows">
            <div className="att-leave-row"><span>Casual Leave</span><div className="att-leave-mini-bar"><div className="att-mini-fill att-fill-casual" style={{ width: `${(leaveBreakdown.casual.used / leaveBreakdown.casual.total) * 100}%` }}></div></div><strong>{leaveBreakdown.casual.used}/{leaveBreakdown.casual.total}</strong></div>
            <div className="att-leave-row"><span>Sick Leave</span><div className="att-leave-mini-bar"><div className="att-mini-fill att-fill-sick" style={{ width: `${(leaveBreakdown.sick.used / leaveBreakdown.sick.total) * 100}%` }}></div></div><strong>{leaveBreakdown.sick.used}/{leaveBreakdown.sick.total}</strong></div>
            <div className="att-leave-row"><span>Earned Leave</span><div className="att-leave-mini-bar"><div className="att-mini-fill att-fill-earned" style={{ width: `${(leaveBreakdown.earned.used / leaveBreakdown.earned.total) * 100}%` }}></div></div><strong>{leaveBreakdown.earned.used}/{leaveBreakdown.earned.total}</strong></div>
          </div>
          <button className="att-apply-btn" onClick={() => setShowLeaveModal(true)}>Apply for Leave <FiPlusCircle /></button>
        </div>

        {renderCalendar()}

        {/* Biometric Logs */}
        <div className="att-biometric-card">
          <div className="att-bio-header"><h3 className="att-card-title">Detailed Biometric Logs</h3><span className="att-bio-date">{selectedBioDate}</span></div>
          <div className="att-bio-body">
            {BIOMETRIC_LOGS[selectedBioDate] && BIOMETRIC_LOGS[selectedBioDate].length > 0 ? (
              <div className="att-timeline">
                {BIOMETRIC_LOGS[selectedBioDate].map(log => (
                  <div key={log.id} className="att-timeline-item">
                    <div className={`att-timeline-dot ${log.type === 'In' ? 't-dot-in' : 't-dot-out'}`}></div>
                    <div className="att-timeline-card"><div className="att-t-time">{log.time}</div><div className="att-t-gate">{log.gate}</div><span className={`att-t-badge ${log.type === 'In' ? 't-badge-in' : 't-badge-out'}`}>{log.type}</span></div>
                  </div>
                ))}
              </div>
            ) : <div className="att-timeline-empty"><p>No biometric logs recorded for this day.</p></div>}
          </div>
        </div>

        {/* Daily Attendance Log */}
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
                  <tr key={a.id} onClick={() => setSelectedBioDate(a.date)} className={selectedBioDate === a.date ? 'att-row-active' : ''} style={{ cursor: 'pointer' }}>
                    <td className="att-star" style={{ cursor: 'pointer' }} onClick={() => handleToggleStar(a.id)} title="Toggle Star">{a.starred ? '★' : '☆'}</td>
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
      </div>

      {/* APPLY LEAVE MODAL */}
      {showLeaveModal && (
        <div className="n-modal-overlay" onClick={() => setShowLeaveModal(false)}>
          <div className="n-modal" onClick={e => e.stopPropagation()}>
            <div className="n-modal-header"><h3>Apply for Leave</h3><button className="n-modal-close" onClick={() => setShowLeaveModal(false)}><FiX /></button></div>
            <div className="n-modal-body">
              <div className="n-form-field"><label>Leave Type</label><select value={newLeave.type} onChange={e => setNewLeave(p => ({ ...p, type: e.target.value }))}><option>Casual</option><option>Sick</option><option>Earned</option></select></div>
              <div className="n-form-field"><label>From Date</label><input type="date" value={newLeave.from} onChange={e => setNewLeave(p => ({ ...p, from: e.target.value }))} /></div>
              <div className="n-form-field"><label>To Date (optional)</label><input type="date" value={newLeave.to} onChange={e => setNewLeave(p => ({ ...p, to: e.target.value }))} /></div>
              <div className="n-form-field"><label>Reason</label><textarea placeholder="Enter reason for leave..." rows={3} value={newLeave.reason} onChange={e => setNewLeave(p => ({ ...p, reason: e.target.value }))} /></div>
            </div>
            <div className="n-modal-footer"><button className="n-modal-cancel" onClick={() => setShowLeaveModal(false)}>Cancel</button><button className="n-modal-submit" onClick={handleApplyLeave}>Submit Application</button></div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
