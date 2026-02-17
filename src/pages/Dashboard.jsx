import { useState } from 'react';
import {
  FiGrid,
  FiUsers,
  FiFileText,
  FiBook,
  FiBell,
  FiCheckSquare,
  FiEdit3,
} from 'react-icons/fi';
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

/* November 2025 calendar */
const buildCal = () => {
  const first = new Date(2025, 10, 1).getDay();   // Saturday = 6
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
  const [tab, setTab] = useState('dashboard');

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
          </div>

          {/* ── Right ── */}
          <div className="d-right">
            {/* Calendar */}
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

            {/* Events */}
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
          </div>

        </div>{/* /d-body */}
      </div>{/* /d-frame */}
    </div>
  );
}
