import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiUsers, FiFileText, FiBook, FiCheckSquare, FiBell, FiEdit3 } from 'react-icons/fi';
import snuLogo from '../assets/snu-logo.png';
import { formatHeaderDate } from '../data/dashboardData';
import '../pages/Dashboard.css';

const NAV = [
  { id: 'dashboard',   label: 'Dashboard',   path: '/dashboard',             icon: <FiGrid /> },
  { id: 'students',    label: 'Students',     path: '/dashboard/students',    icon: <FiUsers /> },
  { id: 'assignments', label: 'Assignments',  path: '/dashboard/assignments', icon: <FiFileText /> },
  { id: 'subjects',    label: 'Subjects',     path: '/dashboard/subjects',    icon: <FiBook /> },
  { id: 'attendance',  label: 'Attendance',   path: '/dashboard/attendance',  icon: <FiCheckSquare /> },
  { id: 'notice',      label: 'Notice',       path: '/dashboard/notice',      icon: <FiBell /> },
  { id: 'exam',        label: 'Exam',         path: '/dashboard/exam',        icon: <FiEdit3 /> },
];

/**
 * Shared layout shell.
 * @param {string}  activeTab   - nav item to highlight
 * @param {boolean} fullWidth   - removes right column (attendance/subjects/exam)
 * @param {React.ReactNode} rightPanel - optional right-column content
 * @param {React.ReactNode} children   - centre column content
 */
export default function DashboardLayout({ children, activeTab, fullWidth = false, rightPanel = null }) {
  const navigate = useNavigate();
  const [liveDate, setLiveDate] = useState(formatHeaderDate);

  useEffect(() => {
    const timer = setInterval(() => setLiveDate(formatHeaderDate()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="d-page">
      <div className="d-bg" />
      <div className="d-frame">
        {/* ═══ HEADER ═══ */}
        <div className="d-top">
          <div className="d-top-left">
            <img src={snuLogo} alt="SNU" className="d-logo" />
            <div className="d-brand">
              <strong>SNU</strong>
              <small>SISTER NIVEDITA<br/>UNIVERSITY</small>
            </div>
            <div className="d-greet">
              <h1>Welcome, Abhijit</h1>
              <span>{liveDate}</span>
            </div>
          </div>
          <div className="d-top-right">
            <h2>Abhijit Mukherjee</h2>
            <span>Teacher</span>
          </div>
        </div>

        {/* ═══ BODY ═══ */}
        <div className="d-body">
          {/* Sidebar */}
          <nav className="d-nav">
            {NAV.map(n => (
              <button
                key={n.id}
                className={'d-nav-btn' + (activeTab === n.id ? ' active' : '')}
                onClick={() => navigate(n.path)}
              >
                <span className="d-nav-ico">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>

          {/* Centre */}
          <div className={`d-centre ${fullWidth ? 'd-centre-full' : ''}`}>
            {children}
          </div>

          {/* Right panel (calendar, quick actions, stats, events) */}
          {!fullWidth && rightPanel && (
            <div className="d-right">
              {rightPanel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
