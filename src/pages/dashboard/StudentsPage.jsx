import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout';
import { ALL_STUDENTS, DEPARTMENTS, SEMESTERS, SECTIONS, MONTH_NAMES, MONTH_SHORT, buildCalendar } from '../../data/dashboardData';

const NOW = new Date();

export default function StudentsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const incoming = location.state || {};

  /* ── Student state ── */
  const [dept, setDept]           = useState(incoming.dept || 'Computer Science');
  const [sem, setSem]             = useState(incoming.sem  || '7th');
  const [sec, setSec]             = useState(incoming.sec  || '1');
  const [students, setStudents]   = useState(incoming.students || []);
  const [attendance, setAttendance] = useState(incoming.attendance || {});
  const [searched, setSearched]   = useState(!!incoming.students?.length);

  const handleSearch = () => {
    const list = ALL_STUDENTS[dept]?.[sem]?.[sec] || [];
    setStudents(list);
    const att = {};
    list.forEach((_, i) => { att[i] = null; });
    setAttendance(att);
    setSearched(true);
  };

  const toggleAttendance = (index, status) =>
    setAttendance(prev => ({ ...prev, [index]: prev[index] === status ? null : status }));

  const stats = useMemo(() => {
    let present = 0, absent = 0;
    Object.values(attendance).forEach(v => { if (v === 'present') present++; if (v === 'absent') absent++; });
    return { total: students.length, present, absent };
  }, [students, attendance]);

  const visibleStudents = students.slice(0, 7);
  const handleViewMore = () => navigate('/attendance', { state: { dept, sem, sec, students, attendance } });

  /* ── Calendar state ── */
  const [calMonth, setCalMonth] = useState(NOW.getMonth());
  const [calYear, setCalYear]   = useState(NOW.getFullYear());
  const calGrid = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth]);
  const prevMonth = () => { calMonth === 0 ? (setCalMonth(11), setCalYear(y => y - 1)) : setCalMonth(m => m - 1); };
  const nextMonth = () => { calMonth === 11 ? (setCalMonth(0), setCalYear(y => y + 1)) : setCalMonth(m => m + 1); };

  /* ── Right panel: Calendar + Attendance Stats ── */
  const rightPanel = (
    <>
      {/* Functional Calendar */}
      <div className="d-cal">
        <div className="d-cal-hd">
          <button className="d-cal-arrow" onClick={prevMonth}><FiChevronLeft /></button>
          <span>{MONTH_NAMES[calMonth]} {calYear}</span>
          <button className="d-cal-arrow" onClick={nextMonth}><FiChevronRight /></button>
        </div>
        <table className="d-cal-tbl">
          <thead><tr>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <th key={d}>{d}</th>)}</tr></thead>
          <tbody>
            {calGrid.map((wk, wi) => (
              <tr key={wi}>
                {wk.map((day, di) => {
                  const live = new Date();
                  const isToday = day === live.getDate() && calMonth === live.getMonth() && calYear === live.getFullYear();
                  const cls = day == null ? 'empty' : isToday ? 'today' : '';
                  return <td key={di} className={cls}>{day}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attendance Stats */}
      <div className="s-stats">
        <div className="s-stat-card s-stat-total">
          <div className="s-stat-icon">👥</div>
          <div className="s-stat-info">
            <span className="s-stat-num">{String(stats.total).padStart(3, '0')}</span>
            <span className="s-stat-label">Total Students</span>
          </div>
        </div>
        <div className="s-stat-card s-stat-present">
          <div className="s-stat-icon">👍</div>
          <div className="s-stat-info">
            <span className="s-stat-num">{String(stats.present).padStart(3, '0')}</span>
            <span className="s-stat-label">Present Students</span>
          </div>
        </div>
        <div className="s-stat-card s-stat-absent">
          <div className="s-stat-icon">🚫</div>
          <div className="s-stat-info">
            <span className="s-stat-num">{String(stats.absent).padStart(3, '0')}</span>
            <span className="s-stat-label">Absent Students</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <DashboardLayout activeTab="students" rightPanel={rightPanel}>
      <>
        <h2 className="s-title">Subject Wise Attendance</h2>

        <div className="s-filters">
          <div className="s-field">
            <label>Department <span className="s-req">*</span></label>
            <select value={dept} onChange={e => setDept(e.target.value)}>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="s-field">
            <label>Semester <span className="s-req">*</span></label>
            <select value={sem} onChange={e => setSem(e.target.value)}>
              {SEMESTERS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="s-field">
            <label>Section <span className="s-req">*</span></label>
            <select value={sec} onChange={e => setSec(e.target.value)}>
              {SECTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="s-search-row">
          <button className="s-search-btn" onClick={handleSearch}><FiSearch /> Search</button>
        </div>

        {searched && (
          <div className="s-table-wrap">
            {students.length > 0 ? (
              <>
                <table className="s-table">
                  <thead>
                    <tr><th>Student ID</th><th>Name</th><th>Present</th><th>Absent</th></tr>
                  </thead>
                  <tbody>
                    {visibleStudents.map((s, i) => (
                      <tr key={i}>
                        <td>{s.id}</td>
                        <td>{s.name}</td>
                        <td>
                          <span className={`s-att-dot ${attendance[i] === 'present' ? 's-dot-active-green' : 's-dot-inactive'}`}
                            onClick={() => toggleAttendance(i, 'present')} title="Mark Present" />
                        </td>
                        <td>
                          <span className={`s-att-dot ${attendance[i] === 'absent' ? 's-dot-active-red' : 's-dot-inactive'}`}
                            onClick={() => toggleAttendance(i, 'absent')} title="Mark Absent" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {students.length > 7 && (
                  <span className="d-link s-view-more" onClick={handleViewMore}>View More</span>
                )}
              </>
            ) : <p className="s-no-data">No students found for the selected filters.</p>}
          </div>
        )}
      </>
    </DashboardLayout>
  );
}
