import { useState, useMemo } from 'react';
import { FiSearch, FiPlusCircle, FiX, FiTrash2, FiChevronLeft, FiChevronRight, FiSend, FiAlertCircle, FiPaperclip, FiUpload, FiDownload } from 'react-icons/fi';
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

/* ── Assignment data ── */
const SUBJECTS_LIST = ['Algorithms', 'DBMS', 'Data Structures', 'Operating Systems', 'Computer Networks', 'Software Engineering'];

const DEFAULT_ASSIGNMENTS = [
  { id: 1, title: 'Algorithm - Assignment 1', subject: 'Algorithms', section: '6th Sem, Sec 1', dueDate: '10 Apr 2026', submitted: 45, total: 60, attachment: null },
  { id: 2, title: 'DBMS Report', subject: 'DBMS', section: '4th Sem, Sec 2', dueDate: '8 Apr 2026', submitted: 59, total: 70, attachment: null },
  { id: 3, title: 'Database Project', subject: 'DBMS', section: '2nd Sem, Sec 3', dueDate: '5 Apr 2026', submitted: 62, total: 80, attachment: null },
  { id: 4, title: 'OS Lab Report', subject: 'Operating Systems', section: '6th Sem, Sec 1', dueDate: '3 Apr 2026', submitted: 50, total: 55, attachment: null },
  { id: 5, title: 'Network Protocols Essay', subject: 'Computer Networks', section: '4th Sem, Sec 1', dueDate: '1 Apr 2026', submitted: 38, total: 65, attachment: null },
];

/* ── Month names helper ── */
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ── Parse a date string like "12 Apr 2026" into a Date ── */
const parseNoticeDate = (str) => {
  const parts = str.split(' ');
  if (parts.length !== 3) return new Date(str);
  const day = parseInt(parts[0], 10);
  const monthIdx = MONTH_SHORT.indexOf(parts[1]);
  const year = parseInt(parts[2], 10);
  if (monthIdx === -1 || isNaN(day) || isNaN(year)) return new Date(str);
  return new Date(year, monthIdx, day);
};

/* ── Build calendar grid for any month/year ── */
const buildCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rows = [];
  let d = 1;
  for (let w = 0; w < 6; w++) {
    const r = [];
    for (let c = 0; c < 7; c++) {
      if ((w === 0 && c < firstDay) || d > daysInMonth) r.push(null);
      else r.push(d++);
    }
    if (r.some(Boolean)) rows.push(r);
  }
  return rows;
};

/* ── Default notices ── */
const DEFAULT_NOTICES = [
  {
    id: 1,
    title: 'Semester Exams',
    date: '12 Apr 2026',
    body: 'Semester examinations for all courses will commence from the 12th December 2026. Detailed schedules will be available soon. Early bird course registration for the Spring 2027 semester is now open for all continuing students. Prof. Anya Sharma from Tech University will deliver a guest lecture on "AI in Modern Education" on November 15th in Hall 3. All faculty members are requested to submit their mid-semester grade reports by November 20th through the faculty portal.',
  },
  {
    id: 2,
    title: 'Faculty Workshop',
    date: '10 Apr 2026',
    body: 'A hands-on faculty workshop on integrating technology in classrooms was held on 10th April. All department heads ensured participation from their teams. The workshop covered modern teaching methodologies, digital tools for assessment, and interactive learning platforms.',
  },
  {
    id: 3,
    title: 'Library Maintenance',
    date: '5 Apr 2026',
    body: 'The central library remained closed on 5th April for scheduled maintenance and system upgrades. Digital library services continued to be accessible online. Students were advised to plan their borrowings accordingly.',
  },
  {
    id: 4,
    title: 'Scholarship Applications Open',
    date: '8 Apr 2026',
    body: 'Applications for the Merit-Based Scholarship Program for the academic year 2026-27 are now open. Eligible students with a CGPA of 8.5 and above may apply through the student portal. The last date for submission is April 20th, 2026. Contact the scholarship office for more details.',
  },
  {
    id: 5,
    title: 'Campus Placement Drive',
    date: '1 Apr 2026',
    body: 'A campus placement drive by leading tech companies including TCS, Infosys, and Wipro was held on 1st April. Final year students from all departments participated. Over 120 students received offers across various roles in software engineering and data analytics.',
  },
  {
    id: 6,
    title: 'Annual Cultural Fest',
    date: '28 Mar 2026',
    body: 'The annual cultural fest "Utsav 2026" was a grand success. Over 500 students participated across 30 events including dance, drama, music, and art. The fest was inaugurated by renowned artist Subodh Gupta. Winners were felicitated by the Vice Chancellor during the closing ceremony.',
  },
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

/* Current date reference */
const NOW = new Date();

export default function Dashboard() {
  const location = useLocation();
  const incoming = location.state || {};
  const [tab, setTab] = useState(incoming.tab || 'dashboard');
  const navigate = useNavigate();

  /* ── Calendar state ── */
  const [calMonth, setCalMonth] = useState(NOW.getMonth());
  const [calYear, setCalYear] = useState(NOW.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null); // null = no date filter

  const calGrid = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth]);

  const handlePrevMonth = () => {
    setSelectedDate(null);
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const handleNextMonth = () => {
    setSelectedDate(null);
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const handleCalDateClick = (day) => {
    if (day == null) return;
    const clicked = `${day} ${MONTH_SHORT[calMonth]} ${calYear}`;
    // toggle: click same date again to clear filter
    setSelectedDate(prev => prev === clicked ? null : clicked);
  };

  /* ── Notice state ── */
  const [notices, setNotices] = useState(DEFAULT_NOTICES);
  const [noticeSearch, setNoticeSearch] = useState('');
  const [expandedNotice, setExpandedNotice] = useState(null);
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', body: '' });
  const [showAllNotices, setShowAllNotices] = useState(false);

  /* ── Filtered & sorted notices ── */
  const filteredNotices = useMemo(() => {
    // 1) Sort by date descending (newest first)
    let list = [...notices].sort((a, b) => parseNoticeDate(b.date) - parseNoticeDate(a.date));

    // 2) Filter by search keyword
    if (noticeSearch.trim()) {
      const q = noticeSearch.toLowerCase();
      list = list.filter(
        n => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
      );
    }

    // 3) Filter by selected calendar date
    if (selectedDate && tab === 'notice') {
      list = list.filter(n => n.date === selectedDate);
    }

    return list;
  }, [notices, noticeSearch, selectedDate, tab]);

  const displayedNotices = showAllNotices ? filteredNotices : filteredNotices.slice(0, 2);
  const hasMoreNotices = filteredNotices.length > 2;

  /* ── Add notice handler ── */
  const handleAddNotice = () => {
    if (!newNotice.title.trim() || !newNotice.body.trim()) return;
    const today = new Date();
    const dateStr = `${today.getDate()} ${MONTH_SHORT[today.getMonth()]} ${today.getFullYear()}`;
    setNotices(prev => [
      { id: Date.now(), title: newNotice.title, date: dateStr, body: newNotice.body },
      ...prev,
    ]);
    setNewNotice({ title: '', body: '' });
    setShowAddNotice(false);
  };

  /* ── Delete notice handler ── */
  const handleDeleteNotice = (id) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  /* ── Assignment state ── */
  const [assignments, setAssignments] = useState(DEFAULT_ASSIGNMENTS);
  const [assignSearch, setAssignSearch] = useState('');
  const [showAllAssign, setShowAllAssign] = useState(false);
  const [showAddAssign, setShowAddAssign] = useState(false);
  const [showUnsubmitted, setShowUnsubmitted] = useState(null);
  const [reminderSent, setReminderSent] = useState(null);
  const [newAssign, setNewAssign] = useState({ title: '', subject: SUBJECTS_LIST[0], section: '6th Sem, Sec 1', dueDate: '', total: '' });
  const [assignFile, setAssignFile] = useState(null); // { name, type, url }
  const [viewAttachment, setViewAttachment] = useState(null); // assignment object to preview

  /* ── Filtered assignments ── */
  const filteredAssignments = useMemo(() => {
    if (!assignSearch.trim()) return assignments;
    const q = assignSearch.toLowerCase();
    return assignments.filter(
      a => a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q) || a.section.toLowerCase().includes(q)
    );
  }, [assignments, assignSearch]);

  const displayedAssignments = showAllAssign ? filteredAssignments : filteredAssignments.slice(0, 3);
  const hasMoreAssign = filteredAssignments.length > 3;

  /* ── Add assignment handler ── */
  const handleAddAssignment = () => {
    if (!newAssign.title.trim() || !newAssign.dueDate.trim() || !newAssign.total) return;
    setAssignments(prev => [
      {
        id: Date.now(),
        title: newAssign.title,
        subject: newAssign.subject,
        section: newAssign.section,
        dueDate: newAssign.dueDate,
        submitted: 0,
        total: parseInt(newAssign.total, 10) || 0,
        attachment: assignFile,
      },
      ...prev,
    ]);
    setNewAssign({ title: '', subject: SUBJECTS_LIST[0], section: '6th Sem, Sec 1', dueDate: '', total: '' });
    setAssignFile(null);
    setShowAddAssign(false);
  };

  /* ── File upload handler ── */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAssignFile({ name: file.name, type: file.type, url });
  };

  /* ── Handle row click to view attachment ── */
  const handleAssignmentClick = (a) => {
    if (a.attachment) {
      setViewAttachment(a);
    }
  };

  /* ── Send reminder handler ── */
  const handleSendReminder = () => {
    const pending = assignments.filter(a => a.submitted < a.total);
    if (pending.length === 0) return;
    setReminderSent(true);
    setTimeout(() => setReminderSent(null), 2500);
  };

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
            ) : tab === 'notice' ? (
              <>
                <h2 className="n-title">Notice</h2>
                <p className="n-subtitle">Keep Updated with the latest university announcements</p>

                <div className="n-search-row">
                  <div className="n-search-bar">
                    <FiSearch className="n-search-icon" />
                    <input
                      type="text"
                      placeholder="Search by Keyword"
                      className="n-search-input"
                      value={noticeSearch}
                      onChange={e => setNoticeSearch(e.target.value)}
                    />
                  </div>
                  {hasMoreNotices && (
                    <span
                      className="d-link n-view-all"
                      onClick={() => setShowAllNotices(prev => !prev)}
                    >
                      {showAllNotices ? 'Show Less' : `View All (${filteredNotices.length})`}
                    </span>
                  )}
                </div>

                <div className="n-list">
                  {displayedNotices.length > 0 ? (
                    displayedNotices.map(n => {
                      const isExpanded = expandedNotice === n.id;
                      const preview = n.body.length > 200 ? n.body.slice(0, 200) : n.body;
                      return (
                        <div key={n.id} className="n-card">
                          <div className="n-card-head">
                            <h3 className="n-card-title">{n.title}</h3>
                            <div className="n-card-actions">
                              <span className="n-card-date">{n.date}</span>
                              <button
                                className="n-delete-btn"
                                onClick={() => handleDeleteNotice(n.id)}
                                title="Delete Notice"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                          <p className="n-card-body">
                            {isExpanded ? n.body : preview}
                            {n.body.length > 200 && (
                              <span
                                className="n-read-more"
                                onClick={() => setExpandedNotice(isExpanded ? null : n.id)}
                              >
                                {isExpanded ? '  Show Less' : '  ....Read More'}
                              </span>
                            )}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="n-no-data">No notices found.</p>
                  )}
                </div>

                {!showAllNotices && hasMoreNotices && (
                  <p className="n-showing-count">
                    Showing {displayedNotices.length} of {filteredNotices.length} notices
                  </p>
                )}
              </>
            ) : tab === 'assignments' ? (
              <>
                <h2 className="n-title">Assignments</h2>
                <p className="n-subtitle">Manage and track all student assignments</p>

                <div className="n-search-row">
                  <div className="n-search-bar">
                    <FiSearch className="n-search-icon" />
                    <input
                      type="text"
                      placeholder="Search by subject, title, or student"
                      className="n-search-input"
                      value={assignSearch}
                      onChange={e => setAssignSearch(e.target.value)}
                    />
                  </div>
                  {hasMoreAssign && (
                    <span
                      className="d-link n-view-all"
                      onClick={() => setShowAllAssign(prev => !prev)}
                    >
                      {showAllAssign ? 'Show Less' : `View All`}
                    </span>
                  )}
                </div>

                <div className="a-table-wrap">
                  <table className="a-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Subject</th>
                        <th>Section</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedAssignments.length > 0 ? (
                        displayedAssignments.map(a => (
                          <tr
                            key={a.id}
                            className={a.attachment ? 'a-row-clickable' : ''}
                            onClick={() => handleAssignmentClick(a)}
                            title={a.attachment ? 'Click to view attachment' : ''}
                          >
                            <td className="a-cell-title">
                              {a.attachment && <FiPaperclip className="a-clip-icon" />}
                              {a.title}
                            </td>
                            <td>{a.subject}</td>
                            <td>{a.section}</td>
                            <td>{a.dueDate}</td>
                            <td>
                              <span className={`a-status ${a.submitted >= a.total ? 'a-status-complete' : 'a-status-pending'}`}>
                                {a.submitted}/{a.total}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={5} className="a-no-data">No assignments found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
                <button className="d-cal-arrow" onClick={handlePrevMonth}><FiChevronLeft /></button>
                <span>{MONTH_NAMES[calMonth]} {calYear}</span>
                <button className="d-cal-arrow" onClick={handleNextMonth}><FiChevronRight /></button>
              </div>
              {selectedDate && tab === 'notice' && (
                <div className="d-cal-filter-badge">
                  Filtering: <strong>{selectedDate}</strong>
                  <button onClick={() => setSelectedDate(null)} className="d-cal-clear"><FiX /></button>
                </div>
              )}
              <table className="d-cal-tbl">
                <thead>
                  <tr>
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
                      <th key={d}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calGrid.map((wk,wi) => {
                    return (
                      <tr key={wi}>
                        {wk.map((day,di) => {
                          const isToday = day === NOW.getDate() && calMonth === NOW.getMonth() && calYear === NOW.getFullYear();
                          const dateStr = day ? `${day} ${MONTH_SHORT[calMonth]} ${calYear}` : null;
                          const isSelected = selectedDate && dateStr === selectedDate;
                          const hasNotice = tab === 'notice' && day && notices.some(n => n.date === dateStr);
                          let cls = '';
                          if (day == null) cls = 'empty';
                          else if (isSelected) cls = 'selected';
                          else if (isToday) cls = 'today';
                          return (
                            <td
                              key={di}
                              className={cls + (hasNotice ? ' has-notice' : '')}
                              onClick={() => tab === 'notice' && handleCalDateClick(day)}
                              style={tab === 'notice' && day ? { cursor: 'pointer' } : {}}
                            >
                              {day}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
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
            ) : tab === 'notice' ? (
              <div className="n-quick-actions">
                <h3 className="n-qa-title">Quick Actions</h3>
                <button
                  className="n-add-notice-btn"
                  onClick={() => setShowAddNotice(true)}
                >
                  <FiPlusCircle className="n-add-icon" />
                  Add Notice
                </button>
              </div>
            ) : tab === 'assignments' ? (
              <div className="n-quick-actions">
                <h3 className="n-qa-title">Quick Actions</h3>
                <button
                  className="a-qa-btn a-qa-add"
                  onClick={() => setShowAddAssign(true)}
                >
                  <FiPlusCircle className="a-qa-ico" />
                  Add Assignment
                </button>
                <button
                  className="a-qa-btn a-qa-unsub"
                  onClick={() => setShowUnsubmitted('all')}
                >
                  <FiAlertCircle className="a-qa-ico" />
                  View Unsubmitted Students
                </button>
                <button
                  className="a-qa-btn a-qa-remind"
                  onClick={handleSendReminder}
                >
                  <FiSend className="a-qa-ico" />
                  Send Reminder
                </button>
                {reminderSent && (
                  <div className="a-reminder-toast">
                    ✓ Reminder sent to all students with pending assignments
                  </div>
                )}
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

      {/* ═══ ADD NOTICE MODAL ═══ */}
      {showAddNotice && (
        <div className="n-modal-overlay" onClick={() => setShowAddNotice(false)}>
          <div className="n-modal" onClick={e => e.stopPropagation()}>
            <div className="n-modal-header">
              <h3>Add New Notice</h3>
              <button className="n-modal-close" onClick={() => setShowAddNotice(false)}>
                <FiX />
              </button>
            </div>
            <div className="n-modal-body">
              <div className="n-form-field">
                <label>Notice Title</label>
                <input
                  type="text"
                  placeholder="Enter notice title"
                  value={newNotice.title}
                  onChange={e => setNewNotice(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="n-form-field">
                <label>Notice Content</label>
                <textarea
                  placeholder="Enter notice content..."
                  rows={5}
                  value={newNotice.body}
                  onChange={e => setNewNotice(prev => ({ ...prev, body: e.target.value }))}
                />
              </div>
            </div>
            <div className="n-modal-footer">
              <button className="n-modal-cancel" onClick={() => setShowAddNotice(false)}>Cancel</button>
              <button className="n-modal-submit" onClick={handleAddNotice}>Publish Notice</button>
            </div>
          </div>
        </div>
      )}
      {/* ═══ ADD ASSIGNMENT MODAL ═══ */}
      {showAddAssign && (
        <div className="n-modal-overlay" onClick={() => setShowAddAssign(false)}>
          <div className="n-modal" onClick={e => e.stopPropagation()}>
            <div className="n-modal-header">
              <h3>Add New Assignment</h3>
              <button className="n-modal-close" onClick={() => setShowAddAssign(false)}>
                <FiX />
              </button>
            </div>
            <div className="n-modal-body">
              <div className="n-form-field">
                <label>Assignment Title</label>
                <input
                  type="text"
                  placeholder="Enter assignment title"
                  value={newAssign.title}
                  onChange={e => setNewAssign(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="n-form-field">
                <label>Subject</label>
                <select
                  value={newAssign.subject}
                  onChange={e => setNewAssign(prev => ({ ...prev, subject: e.target.value }))}
                >
                  {SUBJECTS_LIST.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="n-form-field">
                <label>Section</label>
                <input
                  type="text"
                  placeholder="e.g. 6th Sem, Sec 1"
                  value={newAssign.section}
                  onChange={e => setNewAssign(prev => ({ ...prev, section: e.target.value }))}
                />
              </div>
              <div className="n-form-field">
                <label>Due Date</label>
                <input
                  type="text"
                  placeholder="e.g. 20 Apr 2026"
                  value={newAssign.dueDate}
                  onChange={e => setNewAssign(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div className="n-form-field">
                <label>Total Students</label>
                <input
                  type="number"
                  placeholder="e.g. 60"
                  value={newAssign.total}
                  onChange={e => setNewAssign(prev => ({ ...prev, total: e.target.value }))}
                />
              </div>
              <div className="n-form-field">
                <label>Attachment (Image or PDF)</label>
                <div className="a-upload-area">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    id="assign-file-input"
                    className="a-file-input"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="assign-file-input" className="a-upload-label">
                    <FiUpload className="a-upload-ico" />
                    <span>{assignFile ? assignFile.name : 'Choose file or drag here'}</span>
                  </label>
                  {assignFile && (
                    <div className="a-file-preview">
                      {assignFile.type.startsWith('image/') ? (
                        <img src={assignFile.url} alt="Preview" className="a-file-thumb" />
                      ) : (
                        <div className="a-file-pdf">
                          <FiPaperclip />
                          <span>{assignFile.name}</span>
                        </div>
                      )}
                      <button className="a-file-remove" onClick={() => setAssignFile(null)}>
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="n-modal-footer">
              <button className="n-modal-cancel" onClick={() => { setShowAddAssign(false); setAssignFile(null); }}>Cancel</button>
              <button className="n-modal-submit" onClick={handleAddAssignment}>Create Assignment</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ATTACHMENT PREVIEW MODAL ═══ */}
      {viewAttachment && (
        <div className="n-modal-overlay" onClick={() => setViewAttachment(null)}>
          <div className="n-modal a-preview-modal" onClick={e => e.stopPropagation()}>
            <div className="n-modal-header">
              <h3>{viewAttachment.title}</h3>
              <button className="n-modal-close" onClick={() => setViewAttachment(null)}>
                <FiX />
              </button>
            </div>
            <div className="a-preview-body">
              {viewAttachment.attachment.type.startsWith('image/') ? (
                <img
                  src={viewAttachment.attachment.url}
                  alt={viewAttachment.attachment.name}
                  className="a-preview-img"
                />
              ) : (
                <div className="a-preview-pdf">
                  <div className="a-preview-pdf-icon">
                    <FiPaperclip />
                  </div>
                  <h4>{viewAttachment.attachment.name}</h4>
                  <p>PDF attachment</p>
                  <a
                    href={viewAttachment.attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="a-preview-open-btn"
                  >
                    <FiDownload /> Open PDF
                  </a>
                </div>
              )}
            </div>
            <div className="a-preview-footer">
              <span className="a-preview-meta">
                {viewAttachment.subject} · {viewAttachment.section} · Due: {viewAttachment.dueDate}
              </span>
              <a
                href={viewAttachment.attachment.url}
                download={viewAttachment.attachment.name}
                className="n-modal-submit a-download-btn"
              >
                <FiDownload /> Download
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ═══ VIEW UNSUBMITTED MODAL ═══ */}
      {showUnsubmitted && (
        <div className="n-modal-overlay" onClick={() => setShowUnsubmitted(null)}>
          <div className="n-modal a-unsub-modal" onClick={e => e.stopPropagation()}>
            <div className="n-modal-header">
              <h3>Unsubmitted Students</h3>
              <button className="n-modal-close" onClick={() => setShowUnsubmitted(null)}>
                <FiX />
              </button>
            </div>
            <div className="n-modal-body">
              {assignments.filter(a => a.submitted < a.total).length > 0 ? (
                <div className="a-unsub-list">
                  {assignments.filter(a => a.submitted < a.total).map(a => (
                    <div key={a.id} className="a-unsub-card">
                      <div className="a-unsub-head">
                        <h4>{a.title}</h4>
                        <span className="a-unsub-count">{a.total - a.submitted} pending</span>
                      </div>
                      <p className="a-unsub-meta">{a.subject} · {a.section} · Due: {a.dueDate}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="n-no-data">All students have submitted their assignments!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
