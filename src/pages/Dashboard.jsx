import { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import {
  FiGrid,
  FiUsers,
  FiFileText,
  FiBook,
  FiBell,
  FiCheckSquare,
  FiEdit3,
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import snuLogo from '../assets/snu-logo.png';
import './Dashboard.css';

const NAV = [
  { id: 'dashboard',   label: 'Dashboard',   icon: <FiGrid /> },
  { id: 'students',    label: 'Students',     icon: <FiUsers /> },
  { id: 'assignments', label: 'Assignments',  icon: <FiFileText /> },
  { id: 'subjects',    label: 'Subjects',     icon: <FiBook /> },
  { id: 'notice',      label: 'Notice',       icon: <FiBell /> },
  { id: 'attendance',  label: 'Attendance',   icon: <FiCheckSquare /> },
  { id: 'exam',        label: 'Exam',         icon: <FiEdit3 /> },
];

const TASKS = [
  { title: 'Mid Sem Exam', date: '12th Nov, 2025', info: '3rd Year, Sec 1 on subject of Algorithm, Full marks : 20' },
  { title: 'Mid Sem Exam', date: '12th Nov, 2025', info: '3rd Year, Sec 1 on subject of Algorithm, Full marks : 20' },
];

const EVENTS = [
  { title: 'Basketball', date: '12 Nov 2025', desc: 'Come cheer on your favorite teams in a series of intense matchups. Food and drinks available!' },
];

/* ── Student data organized by department → semester → section ── */
export const ALL_STUDENTS = {
  'Computer Science': {
    '7th': {
      '1': [
        { id: '2211200001052', name: 'Anirban Patra' },
        { id: '2211200001053', name: 'Swarup Bose' },
        { id: '2211200001054', name: 'Saikat Kaity' },
        { id: '2211200001055', name: 'Debojyoti Biswas' },
        { id: '2211200001056', name: 'Rahul Kumar' },
        { id: '2211200001057', name: 'Sneha Das' },
        { id: '2211200001058', name: 'Arijit Mondal' },
        { id: '2211200001059', name: 'Priyanka Saha' },
        { id: '2211200001060', name: 'Sourav Ghosh' },
        { id: '2211200001061', name: 'Tanmay Basu' },
        { id: '2211200001062', name: 'Ritika Sen' },
        { id: '2211200001063', name: 'Arnab Dutta' },
        { id: '2211200001064', name: 'Moumita Roy' },
        { id: '2211200001065', name: 'Subhajit Paul' },
        { id: '2211200001066', name: 'Shreya Banerjee' },
      ],
      '2': [
        { id: '2211200002001', name: 'Priya Sharma' },
        { id: '2211200002002', name: 'Amit Singh' },
        { id: '2211200002003', name: 'Ritu Ghosh' },
        { id: '2211200002004', name: 'Vikash Yadav' },
        { id: '2211200002005', name: 'Neha Kumari' },
        { id: '2211200002006', name: 'Rajesh Mondal' },
        { id: '2211200002007', name: 'Swati Chakraborty' },
        { id: '2211200002008', name: 'Manish Tiwari' },
        { id: '2211200002009', name: 'Pooja Gupta' },
        { id: '2211200002010', name: 'Rohan Das' },
      ],
    },
    '5th': {
      '1': [
        { id: '2311200001001', name: 'Sourav Sen' },
        { id: '2311200001002', name: 'Tanisha Roy' },
        { id: '2311200001003', name: 'Vikram Jain' },
        { id: '2311200001004', name: 'Moumita Dey' },
        { id: '2311200001005', name: 'Kunal Sarkar' },
        { id: '2311200001006', name: 'Dipika Mitra' },
        { id: '2311200001007', name: 'Aritra Bhatt' },
        { id: '2311200001008', name: 'Puja Haldar' },
        { id: '2311200001009', name: 'Sayan Mukherjee' },
        { id: '2311200001010', name: 'Ankita Biswas' },
        { id: '2311200001011', name: 'Partha Manna' },
        { id: '2311200001012', name: 'Riya Chatterjee' },
      ],
    },
  },
  'Electronics': {
    '7th': {
      '1': [
        { id: '2211300001001', name: 'Arjun Mehta' },
        { id: '2211300001002', name: 'Kavita Nair' },
        { id: '2211300001003', name: 'Rohan Gupta' },
        { id: '2211300001004', name: 'Pooja Rani' },
        { id: '2211300001005', name: 'Suraj Verma' },
        { id: '2211300001006', name: 'Ananya Bose' },
        { id: '2211300001007', name: 'Debjit Saha' },
        { id: '2211300001008', name: 'Ishita Ghosh' },
        { id: '2211300001009', name: 'Nikhil Pandey' },
        { id: '2211300001010', name: 'Trishna Das' },
      ],
    },
  },
  'Mechanical': {
    '7th': {
      '1': [
        { id: '2211400001001', name: 'Deepak Yadav' },
        { id: '2211400001002', name: 'Anjali Mishra' },
        { id: '2211400001003', name: 'Karan Thakur' },
        { id: '2211400001004', name: 'Sunita Sharma' },
        { id: '2211400001005', name: 'Rahul Prasad' },
        { id: '2211400001006', name: 'Nandini Roy' },
        { id: '2211400001007', name: 'Abhishek Kumar' },
        { id: '2211400001008', name: 'Meera Joshi' },
        { id: '2211400001009', name: 'Tarun Kapoor' },
        { id: '2211400001010', name: 'Pallavi Dubey' },
        { id: '2211400001011', name: 'Siddharth Raut' },
      ],
    },
  },
};

export const DEPARTMENTS = Object.keys(ALL_STUDENTS);
export const SEMESTERS = ['1st','2nd','3rd','4th','5th','6th','7th','8th'];
export const SECTIONS = ['1','2','3'];

/* November 2025 calendar */
const buildCal = () => {
  const first = new Date(2025, 10, 1).getDay();
  const rows = [];
  let d = 1;
  for (let w = 0; w < 6; w++) {
    const r = [];
    for (let c = 0; c < 7; c++) {
      if ((w === 0 && c < first) || d > 30) r.push(null);
      else r.push(d++);
    }
    if (r.some(Boolean)) rows.push(r);
  }
  return rows;
};
const CAL = buildCal();

export default function Dashboard() {
  const location = useLocation();
  const incoming = location.state || {};
  const [tab, setTab] = useState(incoming.tab || 'dashboard');
  const navigate = useNavigate();

  /* ── Filter state ── */
  const [dept, setDept] = useState(incoming.dept || 'Computer Science');
  const [sem, setSem] = useState(incoming.sem || '7th');
  const [sec, setSec] = useState(incoming.sec || '1');

  /* ── Searched students + attendance state ── */
  const [students, setStudents] = useState(incoming.students || []);
  const [attendance, setAttendance] = useState(incoming.attendance || {});
  const [searched, setSearched] = useState(!!incoming.students?.length);

  /* ── Search handler ── */
  const handleSearch = () => {
    const list = ALL_STUDENTS[dept]?.[sem]?.[sec] || [];
    setStudents(list);
    const att = {};
    list.forEach((_, i) => { att[i] = null; });
    setAttendance(att);
    setSearched(true);
  };

  /* ── Toggle attendance ── */
  const toggleAttendance = (index, status) => {
    setAttendance(prev => ({
      ...prev,
      [index]: prev[index] === status ? null : status,
    }));
  };

  /* ── Compute stats ── */
  const stats = useMemo(() => {
    const total = students.length;
    let present = 0, absent = 0;
    Object.values(attendance).forEach(v => {
      if (v === 'present') present++;
      if (v === 'absent') absent++;
    });
    return { total, present, absent };
  }, [students, attendance]);

  /* ── Show first 7 students ── */
  const visibleStudents = students.slice(0, 7);

  /* ── Navigate to full attendance page ── */
  const handleViewMore = () => {
    navigate('/attendance', {
      state: { dept, sem, sec, students, attendance },
    });
  };

  return (
    <div className="d-page">
      <div className="d-bg" />

      <div className="d-frame">
        {/* ═══ TOP HEADER ═══ */}
        <div className="d-top">
          <div className="d-top-left">
            <img src={snuLogo} alt="SNU" className="d-logo" />
            <div className="d-brand">
              <strong>SNU</strong>
              <small>SISTER NIVEDITA<br/>UNIVERSITY</small>
            </div>
            <div className="d-greet">
              <h1>Welcome, Abhijit</h1>
              <span>Wednesday, 5 November</span>
            </div>
          </div>
          <div className="d-top-right">
            <h2>Abhijit Mukherjee</h2>
            <span>Teacher</span>
          </div>
        </div>

        {/* ═══ BODY: sidebar · centre · right ═══ */}
        <div className="d-body">

          {/* ── Sidebar ── */}
          <nav className="d-nav">
            {NAV.map(n => (
              <button
                key={n.id}
                className={'d-nav-btn' + (tab === n.id ? ' active' : '')}
                onClick={() => setTab(n.id)}
              >
                <span className="d-nav-ico">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>

          {/* ── Centre ── */}
          <div className="d-centre">
            {tab === 'students' ? (
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
                  <button className="s-search-btn" onClick={handleSearch}>
                    <FiSearch /> Search
                  </button>
                </div>

                {searched && (
                  <div className="s-table-wrap">
                    {students.length > 0 ? (
                      <>
                        <table className="s-table">
                          <thead>
                            <tr>
                              <th>Student ID</th>
                              <th>Name</th>
                              <th>Present</th>
                              <th>Absent</th>
                            </tr>
                          </thead>
                          <tbody>
                            {visibleStudents.map((s, i) => (
                              <tr key={i}>
                                <td>{s.id}</td>
                                <td>{s.name}</td>
                                <td>
                                  <span
                                    className={`s-att-dot ${attendance[i] === 'present' ? 's-dot-active-green' : 's-dot-inactive'}`}
                                    onClick={() => toggleAttendance(i, 'present')}
                                    title="Mark Present"
                                  />
                                </td>
                                <td>
                                  <span
                                    className={`s-att-dot ${attendance[i] === 'absent' ? 's-dot-active-red' : 's-dot-inactive'}`}
                                    onClick={() => toggleAttendance(i, 'absent')}
                                    title="Mark Absent"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {students.length > 7 && (
                          <span
                            className="d-link s-view-more"
                            onClick={handleViewMore}
                          >
                            View More
                          </span>
                        )}
                      </>
                    ) : (
                      <p className="s-no-data">No students found for the selected filters.</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="d-schedule">
                  <h2>Daily Schedule</h2>
                </div>
                <div className="d-tasks">
                  <div className="d-sec-head">
                    <h3>Upcoming Tasks</h3>
                    <span className="d-link">View All</span>
                  </div>
                  <div className="d-tasks-grid">
                    {TASKS.map((t, i) => (
                      <div key={i} className="d-task-card">
                        <h4>{t.title}</h4>
                        <p className="d-task-date">{t.date}</p>
                        <p className="d-task-info">{t.info}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Right ── */}
          <div className="d-right">
            <div className="d-cal">
              <div className="d-cal-hd">
                <span>November <small>▾</small></span>
                <span>2025 <small>▾</small></span>
              </div>
              <table className="d-cal-tbl">
                <thead>
                  <tr>
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
                      <th key={d}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CAL.map((wk,wi) => (
                    <tr key={wi}>
                      {wk.map((day,di) => (
                        <td key={di} className={day===5?'today':day==null?'empty':''}>
                          {day}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {tab === 'students' ? (
              <div className="s-stats">
                <div className="s-stat-card s-stat-total">
                  <div className="s-stat-icon">👥</div>
                  <div className="s-stat-info">
                    <span className="s-stat-num">{String(stats.total).padStart(3,'0')}</span>
                    <span className="s-stat-label">Total Students</span>
                  </div>
                </div>
                <div className="s-stat-card s-stat-present">
                  <div className="s-stat-icon">👍</div>
                  <div className="s-stat-info">
                    <span className="s-stat-num">{String(stats.present).padStart(3,'0')}</span>
                    <span className="s-stat-label">Present Students</span>
                  </div>
                </div>
                <div className="s-stat-card s-stat-absent">
                  <div className="s-stat-icon">🚫</div>
                  <div className="s-stat-info">
                    <span className="s-stat-num">{String(stats.absent).padStart(3,'0')}</span>
                    <span className="s-stat-label">Absent Students</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-events">
                <div className="d-sec-head">
                  <h3>Events</h3>
                  <span className="d-link">View All</span>
                </div>
                {EVENTS.map((e,i)=>(
                  <div key={i} className="d-ev-card">
                    <div className="d-ev-row">
                      <h4>{e.title}</h4>
                      <span>{e.date}</span>
                    </div>
                    <p>{e.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
