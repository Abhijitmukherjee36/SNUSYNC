import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';

import { ALL_STUDENTS, DEPARTMENTS, SEMESTERS, SECTIONS } from '../data/dashboardData';
import { HISTORY } from '../data/attendanceData';

import AttendanceTable    from '../components/attendance/AttendanceTable';
import AttendanceHistory  from '../components/attendance/AttendanceHistory';
import StudentProfileModal from '../components/attendance/StudentProfileModal';
import HistoryDetailModal  from '../components/attendance/HistoryDetailModal';
import SuccessModal        from '../components/attendance/SuccessModal';

import './Attendance.css';

export default function AttendancePage() {
  const location = useLocation();
  const navigate  = useNavigate();
  const incoming  = location.state || {};

  /* ── Filter dropdowns ── */
  const [dept, setDept] = useState(incoming.dept || 'Computer Science');
  const [sem,  setSem]  = useState(incoming.sem  || '7th');
  const [sec,  setSec]  = useState(incoming.sec  || '1');

  /* ── Student list & attendance map ── */
  const [students,   setStudents]   = useState(incoming.students   || []);
  const [attendance, setAttendance] = useState(incoming.attendance || {});
  const [searched,   setSearched]   = useState(!!incoming.students?.length);

  /* ── Student search query ── */
  const [searchQuery, setSearchQuery] = useState('');

  /* ── Modal visibility ── */
  const [showSuccess,      setShowSuccess]      = useState(false);
  const [selectedHistory,  setSelectedHistory]  = useState(null);
  const [selectedStudent,  setSelectedStudent]  = useState(null);

  /* ── Derived stats ── */
  const stats = useMemo(() => {
    const total = students.length;
    let present = 0, absent = 0;
    Object.values(attendance).forEach(v => {
      if (v === 'present') present++;
      if (v === 'absent')  absent++;
    });
    return { total, present, absent };
  }, [students, attendance]);

  /* ── Filtered student list for search ── */
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students.map((s, i) => ({ s, origIdx: i }));
    const q = searchQuery.trim().toLowerCase();
    return students
      .map((s, i) => ({ s, origIdx: i }))
      .filter(({ s }) => s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }, [students, searchQuery]);

  /* ── Handlers ── */
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

  const markAllPresent = () => {
    const allPresent = students.every((_, i) => attendance[i] === 'present');
    const att = {};
    students.forEach((_, i) => { att[i] = allPresent ? null : 'present'; });
    setAttendance(att);
  };

  const markAllAbsent = () => {
    const allAbsent = students.every((_, i) => attendance[i] === 'absent');
    const att = {};
    students.forEach((_, i) => { att[i] = allAbsent ? null : 'absent'; });
    setAttendance(att);
  };

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
    navigate('/dashboard/students', { state: { dept, sem, sec, students, attendance } });
  };

  const handleBack = () =>
    navigate('/dashboard/students', { state: { dept, sem, sec, students, attendance } });

  return (
    <div className="att-page">
      <div className="att-bg" />
      <div className="att-frame">

        {/* ── Page Header ── */}
        <div className="att-header">
          <button className="att-back" onClick={handleBack}>
            <FiArrowLeft /> Back to Dashboard
          </button>
          <h1>Full Attendance System</h1>
          <p className="att-subtitle">{dept} · {sem} Semester · Section {sec}</p>
        </div>

        {/* ── Filter Dropdowns + Search Button ── */}
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

        {/* ── Two-column content area ── */}
        <div className="att-content">
          <AttendanceTable
            students={students}
            attendance={attendance}
            searched={searched}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setSelectedStudent={setSelectedStudent}
            toggleAttendance={toggleAttendance}
            markAllPresent={markAllPresent}
            markAllAbsent={markAllAbsent}
            filteredStudents={filteredStudents}
            stats={stats}
            handleSubmit={handleSubmit}
          />
          <AttendanceHistory onRowClick={setSelectedHistory} />
        </div>

        {/* ── Modals ── */}
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
        <HistoryDetailModal
          record={selectedHistory}
          onClose={() => setSelectedHistory(null)}
        />
        {showSuccess && (
          <SuccessModal
            dept={dept} sem={sem} sec={sec} stats={stats}
            onClose={() => setShowSuccess(false)}
            onDone={handleDone}
          />
        )}

      </div>
    </div>
  );
}
