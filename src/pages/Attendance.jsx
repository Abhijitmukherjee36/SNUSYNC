import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiCheckCircle, FiXCircle, FiSend, FiX } from 'react-icons/fi';
import { ALL_STUDENTS, DEPARTMENTS, SEMESTERS, SECTIONS } from '../data/dashboardData';
import './Attendance.css';

/* ── Dynamic past working-day dates ── */
const _MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const _pastWorkingDay = (daysBack) => {
  const d = new Date();
  let skipped = 0;
  while (skipped < daysBack) {
    d.setDate(d.getDate() - 1);
    // Skip Sundays (0) only — Saturday is a working day in many Indian colleges
    if (d.getDay() !== 0) skipped++;
  }
  return `${d.getDate()} ${_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

/* ── Previous attendance history (dates auto-computed from today) ── */
const HISTORY = [
  { date: _pastWorkingDay(1), present: 13, absent: 2, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'absent' },   { name: 'Debojyoti Biswas', status: 'present' },
    { name: 'Rahul Kumar', status: 'present' },    { name: 'Sneha Das', status: 'present' },
    { name: 'Arijit Mondal', status: 'present' },  { name: 'Priyanka Saha', status: 'absent' },
    { name: 'Sourav Ghosh', status: 'present' },   { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },     { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },    { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: _pastWorkingDay(2), present: 14, absent: 1, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'present' },  { name: 'Debojyoti Biswas', status: 'present' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'absent' },
    { name: 'Arijit Mondal', status: 'present' }, { name: 'Priyanka Saha', status: 'present' },
    { name: 'Sourav Ghosh', status: 'present' },  { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },    { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: _pastWorkingDay(3), present: 11, absent: 4, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'absent' },
    { name: 'Saikat Kaity', status: 'absent' },   { name: 'Debojyoti Biswas', status: 'present' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'present' },
    { name: 'Arijit Mondal', status: 'absent' },  { name: 'Priyanka Saha', status: 'absent' },
    { name: 'Sourav Ghosh', status: 'present' },  { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },    { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: _pastWorkingDay(4), present: 15, absent: 0, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'present' },  { name: 'Debojyoti Biswas', status: 'present' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'present' },
    { name: 'Arijit Mondal', status: 'present' }, { name: 'Priyanka Saha', status: 'present' },
    { name: 'Sourav Ghosh', status: 'present' },  { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },    { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: _pastWorkingDay(5), present: 12, absent: 3, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'absent' },   { name: 'Debojyoti Biswas', status: 'absent' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'present' },
    { name: 'Arijit Mondal', status: 'present' }, { name: 'Priyanka Saha', status: 'present' },
    { name: 'Sourav Ghosh', status: 'absent' },   { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },    { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: _pastWorkingDay(6), present: 10, absent: 5, total: 15, details: [
    { name: 'Anirban Patra', status: 'absent' },  { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'absent' },   { name: 'Debojyoti Biswas', status: 'absent' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'absent' },
    { name: 'Arijit Mondal', status: 'present' }, { name: 'Priyanka Saha', status: 'absent' },
    { name: 'Sourav Ghosh', status: 'present' },  { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },    { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: _pastWorkingDay(7), present: 14, absent: 1, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'present' },  { name: 'Debojyoti Biswas', status: 'present' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'present' },
    { name: 'Arijit Mondal', status: 'present' }, { name: 'Priyanka Saha', status: 'present' },
    { name: 'Sourav Ghosh', status: 'present' },  { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'absent' },     { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: _pastWorkingDay(8), present: 13, absent: 2, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'absent' },   { name: 'Debojyoti Biswas', status: 'present' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'present' },
    { name: 'Arijit Mondal', status: 'present' }, { name: 'Priyanka Saha', status: 'present' },
    { name: 'Sourav Ghosh', status: 'present' },  { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },    { name: 'Arnab Dutta', status: 'absent' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
];


export default function AttendancePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const incoming = location.state || {};

  /* ── Filter state ── */
  const [dept, setDept] = useState(incoming.dept || 'Computer Science');
  const [sem,  setSem]  = useState(incoming.sem  || '7th');
  const [sec,  setSec]  = useState(incoming.sec  || '1');

  /* ── Students + attendance ── */
  const [students, setStudents]     = useState(incoming.students || []);
  const [attendance, setAttendance] = useState(incoming.attendance || {});
  const [searched, setSearched]     = useState(!!incoming.students?.length);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null); // for profile modal

  /* ── Get all HISTORY records for a given student name ── */
  const getStudentHistory = (name) => {
    return HISTORY.map(h => {
      const found = h.details.find(d => d.name === name);
      return found ? { date: h.date, status: found.status } : null;
    }).filter(Boolean);
  };

  /* ── Student ID search ── */
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const list = ALL_STUDENTS[dept]?.[sem]?.[sec] || [];
    setStudents(list);
    const att = {};
    list.forEach((_, i) => { att[i] = null; });
    setAttendance(att);
    setSearched(true);
    setSearchQuery('');
  };

  const toggleAttendance = (index, status) =>
    setAttendance(prev => ({ ...prev, [index]: prev[index] === status ? null : status }));

  /* ── All Present: toggle — if all already present → deselect all, else mark all present ── */
  const markAllPresent = () => {
    const allPresent = students.every((_, i) => attendance[i] === 'present');
    const att = {};
    students.forEach((_, i) => { att[i] = allPresent ? null : 'present'; });
    setAttendance(att);
  };

  /* ── All Absent: toggle — if all already absent → deselect all, else mark all absent ── */
  const markAllAbsent = () => {
    const allAbsent = students.every((_, i) => attendance[i] === 'absent');
    const att = {};
    students.forEach((_, i) => { att[i] = allAbsent ? null : 'absent'; });
    setAttendance(att);
  };

  const stats = useMemo(() => {
    const total = students.length;
    let present = 0, absent = 0;
    Object.values(attendance).forEach(v => { if (v === 'present') present++; if (v === 'absent') absent++; });
    return { total, present, absent };
  }, [students, attendance]);

  /* ── Filtered students by search query ── */
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students.map((s, i) => ({ s, origIdx: i }));
    const q = searchQuery.trim().toLowerCase();
    return students
      .map((s, i) => ({ s, origIdx: i }))
      .filter(({ s }) => s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }, [students, searchQuery]);

  /* ── Submit: close modal + navigate to Students page with result ── */
  const handleSubmit = () => {
    const unmarked = stats.total - stats.present - stats.absent;
    if (stats.total === 0) return;
    if (unmarked > 0) {
      alert(`Please mark attendance for all ${stats.total} students. ${unmarked} still unmarked.`);
      return;
    }
    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    navigate('/dashboard/students', {
      state: { dept, sem, sec, students, attendance }
    });
  };

  return (
    <div className="att-page">
      <div className="att-bg" />
      <div className="att-frame">

        {/* ── Header ── */}
        <div className="att-header">
          <button className="att-back" onClick={() => navigate('/dashboard/students', { state: { dept, sem, sec, students, attendance } })}>
            <FiArrowLeft /> Back to Dashboard
          </button>
          <h1>Full Attendance System</h1>
          <p className="att-subtitle">{dept} · {sem} Semester · Section {sec}</p>
        </div>

        {/* ── Filters ── */}
        <div className="att-filters">
          <div className="att-field">
            <label>Department</label>
            <select value={dept} onChange={e => setDept(e.target.value)}>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="att-field">
            <label>Semester</label>
            <select value={sem} onChange={e => setSem(e.target.value)}>
              {SEMESTERS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="att-field">
            <label>Section</label>
            <select value={sec} onChange={e => setSec(e.target.value)}>
              {SECTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button className="att-search-btn" onClick={handleSearch}>
            <FiSearch /> Search
          </button>
        </div>

        {/* ── Main: two columns ── */}
        <div className="att-content">

          {/* LEFT */}
          <div className="att-left">
            <div className="att-table-header">
              <h2>Mark Attendance</h2>
              {students.length > 0 && (
                <div className="att-bulk-actions">
                  <button
                    className="att-bulk-btn att-bulk-present"
                    onClick={markAllPresent}
                    title={students.every((_, i) => attendance[i] === 'present') ? 'Deselect All' : 'Mark All Present'}
                  >
                    <FiCheckCircle />
                    {students.every((_, i) => attendance[i] === 'present') ? 'Deselect All' : 'All Present'}
                  </button>
                  <button
                    className="att-bulk-btn att-bulk-absent"
                    onClick={markAllAbsent}
                    title={students.every((_, i) => attendance[i] === 'absent') ? 'Deselect All' : 'Mark All Absent'}
                  >
                    <FiXCircle />
                    {students.every((_, i) => attendance[i] === 'absent') ? 'Deselect All' : 'All Absent'}
                  </button>
                </div>
              )}
            </div>

            {/* Student ID Search Bar */}
            {students.length > 0 && (
              <div className="att-search-bar">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search by Student ID or Name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <>
                    <span className="att-search-count">{filteredStudents.length} found</span>
                    <button className="att-search-clear" onClick={() => setSearchQuery('')}><FiX /></button>
                  </>
                )}
              </div>
            )}

            {searched && students.length > 0 ? (
              <div className="att-table-wrap">
                <table className="att-table">
                  <colgroup>
                    <col style={{ width: '40px' }} />
                    <col style={{ width: '145px' }} />
                    <col />
                    <col style={{ width: '80px' }} />
                    <col style={{ width: '80px' }} />
                    <col style={{ width: '88px' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? filteredStudents.map(({ s, origIdx }) => (
                      <tr key={origIdx} className={attendance[origIdx] === 'present' ? 'row-present' : attendance[origIdx] === 'absent' ? 'row-absent' : ''}>
                        <td className="att-sno">{origIdx + 1}</td>
                        <td>
                          <span className="att-id-link" onClick={() => setSelectedStudent(s)}>{s.id}</span>
                        </td>
                        <td className="att-name">
                          <span className="att-name-link" onClick={() => setSelectedStudent(s)}>{s.name}</span>
                        </td>
                        <td>
                          <span
                            className={`att-dot ${attendance[origIdx] === 'present' ? 'att-dot-green' : 'att-dot-gray'}`}
                            onClick={() => toggleAttendance(origIdx, 'present')}
                            title="Mark Present"
                          />
                        </td>
                        <td>
                          <span
                            className={`att-dot ${attendance[origIdx] === 'absent' ? 'att-dot-red' : 'att-dot-gray'}`}
                            onClick={() => toggleAttendance(origIdx, 'absent')}
                            title="Mark Absent"
                          />
                        </td>
                        <td>
                          <span className={`att-status-badge ${attendance[origIdx] ? `att-badge-${attendance[origIdx]}` : 'att-badge-unmarked'}`}>
                            {attendance[origIdx] === 'present' ? 'Present' : attendance[origIdx] === 'absent' ? 'Absent' : '—'}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '20px', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>No student found matching "{searchQuery}"</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : searched ? (
              <p className="att-no-data">No students found for the selected filters.</p>
            ) : (
              <p className="att-no-data">Select filters and click Search to load students.</p>
            )}

            {/* Stats bar */}
            {students.length > 0 && (
              <div className="att-stats-bar">
                <div className="att-stat-pill att-pill-total">Total: <strong>{stats.total}</strong></div>
                <div className="att-stat-pill att-pill-present">Present: <strong>{stats.present}</strong></div>
                <div className="att-stat-pill att-pill-absent">Absent: <strong>{stats.absent}</strong></div>
                <div className="att-stat-pill att-pill-unmarked">Unmarked: <strong>{stats.total - stats.present - stats.absent}</strong></div>
              </div>
            )}

            {/* Submit button */}
            {students.length > 0 && (
              <button className="att-submit-btn" onClick={handleSubmit}>
                <FiSend /> Submit Attendance
              </button>
            )}
          </div>

          {/* RIGHT */}
          <div className="att-right">
            <h2>Previous Attendance Report</h2>
            <div className="att-history-wrap">
              <table className="att-history-table">
                <thead>
                  <tr>
                    <th>Date</th><th>Present</th><th>Absent</th><th>Total</th><th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {HISTORY.map((h, i) => (
                    <tr key={i} className="att-history-row" onClick={() => setSelectedHistory(h)}>
                      <td className="att-date-link">{h.date}</td>
                      <td className="att-h-present">{h.present}</td>
                      <td className="att-h-absent">{h.absent}</td>
                      <td>{h.total}</td>
                      <td>
                        <div className="att-pct-cell">
                          <div className="att-pct-bar">
                            <div className="att-pct-fill" style={{ width: `${Math.round((h.present / h.total) * 100)}%` }} />
                          </div>
                          <span className="att-pct-text">{Math.round((h.present / h.total) * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary card */}
            <div className="att-summary-card">
              <h3>Overall Summary</h3>
              <div className="att-summary-grid">
                <div className="att-sum-item">
                  <span className="att-sum-num">{HISTORY.length}</span>
                  <span className="att-sum-label">Total Classes</span>
                </div>
                <div className="att-sum-item">
                  <span className="att-sum-num">{Math.round(HISTORY.reduce((a, h) => a + (h.present / h.total) * 100, 0) / HISTORY.length)}%</span>
                  <span className="att-sum-label">Avg Attendance</span>
                </div>
                <div className="att-sum-item">
                  <span className="att-sum-num">{Math.max(...HISTORY.map(h => h.present))}</span>
                  <span className="att-sum-label">Best Day</span>
                </div>
                <div className="att-sum-item">
                  <span className="att-sum-num">{Math.max(...HISTORY.map(h => h.absent))}</span>
                  <span className="att-sum-label">Max Absent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── STUDENT PROFILE MODAL ── */}
        {selectedStudent && (() => {
          const hist = getStudentHistory(selectedStudent.name);
          const presentCount = hist.filter(h => h.status === 'present').length;
          const absentCount  = hist.filter(h => h.status === 'absent').length;
          const pct = hist.length > 0 ? Math.round((presentCount / hist.length) * 100) : 0;
          const initials = selectedStudent.name.split(' ').map(w => w[0]).slice(0,2).join('');
          return (
            <div className="att-modal-overlay" onClick={() => setSelectedStudent(null)}>
              <div className="att-modal att-profile-modal" onClick={e => e.stopPropagation()}>
                <button className="att-modal-close" onClick={() => setSelectedStudent(null)}><FiX /></button>
                <div className="att-profile-header">
                  <div className="att-profile-avatar">{initials}</div>
                  <div className="att-profile-info">
                    <p className="att-profile-name">{selectedStudent.name}</p>
                    <p className="att-profile-id">ID: {selectedStudent.id}</p>
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
                <button className="att-modal-ok" style={{ marginTop: 14 }} onClick={() => setSelectedStudent(null)}>Close</button>
              </div>
            </div>
          );
        })()}

        {/* ── SUCCESS MODAL ── */}
        {showSuccess && (
          <div className="att-modal-overlay" onClick={() => setShowSuccess(false)}>
            <div className="att-modal" onClick={e => e.stopPropagation()}>
              <button className="att-modal-close" onClick={() => setShowSuccess(false)}><FiX /></button>
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
              <button className="att-modal-ok" onClick={handleDone}>
                View in Students Page
              </button>
            </div>
          </div>
        )}

        {/* ── HISTORY DETAIL MODAL ── */}
        {selectedHistory && (
          <div className="att-modal-overlay" onClick={() => setSelectedHistory(null)}>
            <div className="att-modal att-history-modal" onClick={e => e.stopPropagation()}>
              <button className="att-modal-close" onClick={() => setSelectedHistory(null)}><FiX /></button>
              <h2>Attendance — {selectedHistory.date}</h2>
              <div className="att-modal-stats" style={{ marginBottom: 14 }}>
                <div className="att-modal-stat green"><span>{selectedHistory.present}</span><small>Present</small></div>
                <div className="att-modal-stat red"><span>{selectedHistory.absent}</span><small>Absent</small></div>
                <div className="att-modal-stat blue"><span>{selectedHistory.total}</span><small>Total</small></div>
              </div>
              <div className="att-detail-list">
                {selectedHistory.details.map((d, i) => (
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
              <button className="att-modal-ok" style={{ marginTop: 16 }} onClick={() => setSelectedHistory(null)}>Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
