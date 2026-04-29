import { useState, useMemo, useRef, useCallback } from 'react';
import { FiSearch, FiPlusCircle, FiX, FiTrash2, FiChevronLeft, FiChevronRight, FiSend, FiAlertCircle, FiPaperclip, FiUpload, FiDownload, FiFilter, FiChevronDown, FiEdit2, FiClock, FiCalendar } from 'react-icons/fi';
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
  { id: 'attendance',  label: 'Attendance',   icon: <FiCheckSquare /> },
  { id: 'notice',      label: 'Notice',       icon: <FiBell /> },
  { id: 'exam',        label: 'Exam',         icon: <FiEdit3 /> },
];

/* ── Subjects data ── */
const SUBJECTS_DATA = [
  { id: 1, code: 'ALG301', name: 'Algorithm', dept: 'CSE', year: '3rd', sec: '1', avgAttendance: 88, credits: 3, materials: [{name:'Lecture 1.pdf',date:'10 Apr 2026'},{name:'Lecture 2.pdf',date:'15 Apr 2026'},{name:'Assignment 1.pdf',date:'20 Apr 2026'}] },
  { id: 2, code: 'CN301', name: 'Computer Networks', dept: 'CSE', year: '3rd', sec: '1', avgAttendance: 92, credits: 3, materials: [{name:'Module 1.pdf',date:'8 Apr 2026'},{name:'Lab Manual.pdf',date:'12 Apr 2026'}] },
  { id: 3, code: 'DBMS301', name: 'Database Management', dept: 'CSE', year: '3rd', sec: '1', avgAttendance: 85, credits: 3, materials: [{name:'ER Diagrams.pdf',date:'5 Apr 2026'},{name:'SQL Notes.pdf',date:'9 Apr 2026'},{name:'Normalization.pdf',date:'14 Apr 2026'}] },
  { id: 4, code: 'JAVA301', name: 'Java', dept: 'CSE', year: '3rd', sec: '1', avgAttendance: 90, credits: 3, materials: [{name:'OOP Concepts.pdf',date:'3 Apr 2026'},{name:'Collections.pdf',date:'7 Apr 2026'},{name:'Multithreading.pdf',date:'11 Apr 2026'},{name:'Swing.pdf',date:'18 Apr 2026'}] },
  { id: 5, code: 'CS301', name: 'Operating Systems', dept: 'CSE', year: '3rd', sec: '1', avgAttendance: 87, credits: 3, materials: [{name:'Process Mgmt.pdf',date:'2 Apr 2026'},{name:'Memory Mgmt.pdf',date:'6 Apr 2026'},{name:'File Systems.pdf',date:'13 Apr 2026'}] },
  { id: 6, code: 'EC201', name: 'Digital Electronics', dept: 'ECE', year: '2nd', sec: '1', avgAttendance: 91, credits: 4, materials: [{name:'Logic Gates.pdf',date:'4 Apr 2026'},{name:'Flip Flops.pdf',date:'10 Apr 2026'}] },
  { id: 7, code: 'EC301', name: 'Signal Processing', dept: 'ECE', year: '3rd', sec: '1', avgAttendance: 78, credits: 3, materials: [{name:'Fourier Transform.pdf',date:'1 Apr 2026'}] },
  { id: 8, code: 'ME201', name: 'Thermodynamics', dept: 'ME', year: '2nd', sec: '1', avgAttendance: 82, credits: 4, materials: [{name:'Laws of Thermo.pdf',date:'5 Apr 2026'},{name:'Heat Engines.pdf',date:'12 Apr 2026'}] },
];

/* ── Exam data ── */
const EXAMS_DATA = [
  { id: 1, title: 'Mid Sem', subject: 'Algorithm', date: '12 Nov 2025', year: '3', sec: '1', status: 'Upcoming', invigilation: { exam: 'Mid Sem', room: 'B-201', date: '12 Nov', status: 'Assigned' } },
  { id: 2, title: 'Class Test', subject: 'DBMS', date: '15 Nov 2025', year: '2', sec: '1', status: 'Scheduled', invigilation: null },
  { id: 3, title: 'Viva', subject: 'Networks', date: '20 Nov 2025', year: '3', sec: '1', status: 'Scheduled', invigilation: null },
  { id: 4, title: 'End Sem', subject: 'Java', date: '25 Nov 2025', year: '3', sec: '1', status: 'Upcoming', invigilation: { exam: 'End Sem', room: 'A-101', date: '25 Nov', status: 'Assigned' } },
  { id: 5, title: 'Lab Exam', subject: 'OS', date: '28 Nov 2025', year: '3', sec: '1', status: 'Scheduled', invigilation: null },
  { id: 6, title: 'Mid Sem', subject: 'Digital Elec', date: '5 Oct 2025', year: '2', sec: '1', status: 'Completed', invigilation: null },
  { id: 7, title: 'Class Test', subject: 'Algorithm', date: '10 Oct 2025', year: '3', sec: '1', status: 'Completed', invigilation: null },
  { id: 8, title: 'Quiz', subject: 'Networks', date: '18 Oct 2025', year: '3', sec: '1', status: 'Completed', invigilation: null },
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

/* ── Demo student names pool ── */
const STUDENT_NAMES = [
  'Aarav Sharma','Aditi Das','Aditya Patel','Ananya Gupta','Arjun Reddy',
  'Bhavya Singh','Deepak Kumar','Diya Nair','Gaurav Joshi','Isha Mehta',
  'Kabir Malhotra','Kavya Iyer','Manish Verma','Meera Choudhury','Neha Banerjee',
  'Nikhil Saxena','Pooja Rao','Priya Agarwal','Rahul Mishra','Riya Sen',
  'Rohan Kapoor','Sakshi Tiwari','Sameer Khan','Shreya Bose','Siddharth Nair',
  'Sneha Patil','Tanvi Deshmukh','Varun Pillai','Vikram Chauhan','Zara Sheikh',
  'Amit Dubey','Ankita Roy','Chirag Thakur','Devika Menon','Harsh Agarwal',
  'Ishaan Bhat','Jaya Prasad','Karan Gill','Lakshmi Suresh','Mohit Pandey',
  'Nandini Kulkarni','Om Prakash','Pallavi Sinha','Rajesh Nambiar','Sanya Khanna',
  'Tarun Bisht','Uma Shankar','Vivek Rathore','Yashika Luthra','Aryan Chopra',
  'Barkha Soni','Chetan Hegde','Divya Chandra','Esha Grover','Farhan Mirza',
  'Gitanjali Dutta','Hemant Yadav','Indu Rajput','Jayant Sood','Komal Bhatt',
  'Lalit Mohan','Mitali Shah','Naveen Jha','Ojas Kale','Pankaj Rawat',
  'Renu Goswami','Suresh Babu','Tanya Oberoi','Uday Kiran','Vinita Mathur',
  'Waseem Akram','Yogesh Shirke','Zubin Patel','Akshay Rangnekar','Bhakti Jain',
  'Chandni Ahluwalia','Dhruv Rastogi','Ekta Bhandari','Firoz Alam','Gauri Shinde',
];

/* ── Generate consistent demo student list for an assignment ── */
const generateStudents = (assignId, total, submitted) => {
  const offset = (assignId * 7) % STUDENT_NAMES.length;
  const students = [];
  for (let i = 0; i < total; i++) {
    const idx = (offset + i) % STUDENT_NAMES.length;
    students.push({
      name: STUDENT_NAMES[idx],
      rollNo: `SNU${String(2024000 + assignId * 100 + i + 1).slice(-6)}`,
      submitted: i < submitted,
    });
  }
  return students;
};

/* ── Attendance data ── */
const OVERVIEW_DATA_FILTERS = {
  Weekly: { totalWorking: 5, present: 4, absent: 1, onLeave: 0, lastUpdated: '4th Nov 2025' },
  Monthly: { totalWorking: 22, present: 19, absent: 2, onLeave: 1, lastUpdated: '4th Nov 2025' },
  Yearly: { totalWorking: 220, present: 205, absent: 5, onLeave: 10, lastUpdated: '4th Nov 2025' }
};

const LEAVE_BREAKDOWN = {
  casual: { used: 5, total: 7 },
  sick:   { used: 3, total: 5 },
  earned: { used: 2, total: 6 },
};

const MONTHLY_PRESENCE = [
  { month: "Jul '25", present: 18, leaves: 2, pct: 90 },
  { month: "Aug '25", present: 20, leaves: 1, pct: 95 },
  { month: "Sep '25", present: 19, leaves: 3, pct: 86 },
  { month: "Oct '25", present: 21, leaves: 1, pct: 95 },
  { month: "Nov '25", present: 17, leaves: 2, pct: 89 },
  { month: "Dec '25", present: 15, leaves: 3, pct: 83 },
  { month: "Jan '25", present: 20, leaves: 1, pct: 95 },
  { month: "Feb '25", present: 18, leaves: 2, pct: 90 },
  { month: "Mar '25", present: 22, leaves: 0, pct: 100 },
  { month: "Apr '25", present: 19, leaves: 1, pct: 95 },
  { month: 'to date',  present: 16, leaves: 1, pct: 94 },
];

/* ── Dynamic Date Helpers ── */
const getPastDateStr = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  let dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (dateStr.match(/^\d /)) dateStr = dateStr.replace(/^(\d) /, '$1th ');
  else if (dateStr.match(/^\d\d /)) dateStr = dateStr.replace(/^(\d\d) /, '$1th ');
  dateStr = dateStr.replace(/1th/, '1st').replace(/2th/, '2nd').replace(/3th/, '3rd').replace(/11st/, '11th').replace(/12nd/, '12th').replace(/13rd/, '13th');
  return dateStr;
};

const D0 = getPastDateStr(0);
const D1 = getPastDateStr(1);
const D5 = getPastDateStr(5);
const D6 = getPastDateStr(6);
const D7 = getPastDateStr(7);
const D8 = getPastDateStr(8);
const D11 = getPastDateStr(11);
const D12 = getPastDateStr(12);

const DAILY_ATTENDANCE = [
  { id: 1, date: D0,  status: 'Present', timeIn: '9:02 AM', timeOut: '5:15 PM', leaveReason: '-', starred: true },
  { id: 2, date: D1,  status: 'Present', timeIn: '8:58 AM', timeOut: '5:20 PM', leaveReason: '-', starred: true },
  { id: 3, date: D5, status: 'On Leave - Sick', timeIn: '-', timeOut: '-', leaveReason: 'High Fever', starred: true },
  { id: 4, date: D6, status: 'Present', timeIn: '9:10 AM', timeOut: '5:05 PM', leaveReason: '-', starred: false },
  { id: 5, date: D7, status: 'Present', timeIn: '8:55 AM', timeOut: '5:30 PM', leaveReason: '-', starred: false },
  { id: 6, date: D8, status: 'Absent', timeIn: '-', timeOut: '-', leaveReason: '-', starred: false },
  { id: 7, date: D11, status: 'Present', timeIn: '9:00 AM', timeOut: '5:10 PM', leaveReason: '-', starred: false },
  { id: 8, date: D12, status: 'On Leave - Casual', timeIn: '-', timeOut: '-', leaveReason: 'Personal Work', starred: false },
];

const BIOMETRIC_LOGS = {
  [D0]: [
    { id: 101, gate: 'Main Entrance', time: '9:02 AM', type: 'In' },
    { id: 102, gate: 'Cafeteria', time: '1:15 PM', type: 'Out' },
    { id: 103, gate: 'Cafeteria', time: '2:10 PM', type: 'In' },
    { id: 104, gate: 'Main Entrance', time: '5:15 PM', type: 'Out' }
  ],
  [D1]: [
    { id: 105, gate: 'Main Entrance', time: '8:58 AM', type: 'In' },
    { id: 106, gate: 'Lab Building', time: '11:00 AM', type: 'In' },
    { id: 107, gate: 'Main Entrance', time: '5:20 PM', type: 'Out' }
  ],
  [D6]: [
    { id: 108, gate: 'Main Entrance', time: '9:10 AM', type: 'In' },
    { id: 109, gate: 'Main Entrance', time: '5:05 PM', type: 'Out' }
  ],
  [D7]: [
    { id: 110, gate: 'Main Entrance', time: '8:55 AM', type: 'In' },
    { id: 111, gate: 'Main Entrance', time: '5:30 PM', type: 'Out' }
  ],
  [D11]: [
    { id: 112, gate: 'Main Entrance', time: '9:00 AM', type: 'In' },
    { id: 113, gate: 'Main Entrance', time: '5:10 PM', type: 'Out' }
  ]
};

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
  const [assignFile, setAssignFile] = useState(null);
  const [viewAttachment, setViewAttachment] = useState(null);
  const [viewStatus, setViewStatus] = useState(null);
  const [statusTab, setStatusTab] = useState('submitted');
  const [expandedUnsub, setExpandedUnsub] = useState(null);

  /* ── Subjects state ── */
  const [subjectsData, setSubjectsData] = useState(SUBJECTS_DATA);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [subjectFilterOpen, setSubjectFilterOpen] = useState(false);
  const [subjFilterDept, setSubjFilterDept] = useState('All');
  const [subjFilterYear, setSubjFilterYear] = useState('All');
  const [subjFilterCredits, setSubjFilterCredits] = useState('All');
  const [subjFilterAtt, setSubjFilterAtt] = useState('All');
  const [subjectUploadModal, setSubjectUploadModal] = useState(null);
  const [subjectUploadFile, setSubjectUploadFile] = useState(null);
  const [subjectMaterialsView, setSubjectMaterialsView] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [subjCardModal, setSubjCardModal] = useState(null);
  const [subjMaterialPreview, setSubjMaterialPreview] = useState(null);

  const subjActiveFilterCount = [subjFilterDept, subjFilterYear, subjFilterCredits, subjFilterAtt].filter(f => f !== 'All').length;

  const filteredSubjects = useMemo(() => {
    let list = [...subjectsData];
    if (subjectSearch.trim()) {
      const q = subjectSearch.toLowerCase();
      list = list.filter(s => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.dept.toLowerCase().includes(q));
    }
    if (subjFilterDept !== 'All') list = list.filter(s => s.dept === subjFilterDept);
    if (subjFilterYear !== 'All') list = list.filter(s => s.year === subjFilterYear);
    if (subjFilterCredits !== 'All') list = list.filter(s => String(s.credits) === subjFilterCredits);
    if (subjFilterAtt === '90+') list = list.filter(s => s.avgAttendance >= 90);
    else if (subjFilterAtt === '80-89') list = list.filter(s => s.avgAttendance >= 80 && s.avgAttendance < 90);
    else if (subjFilterAtt === '<80') list = list.filter(s => s.avgAttendance < 80);
    return list;
  }, [subjectsData, subjectSearch, subjFilterDept, subjFilterYear, subjFilterCredits, subjFilterAtt]);

  const subjectStats = useMemo(() => {
    const totalSubjects = subjectsData.length;
    const deptList = [...new Set(subjectsData.map(s => s.dept))];
    const departments = deptList.length;
    const totalMaterials = subjectsData.reduce((sum, s) => sum + s.materials.length, 0);
    const avgAttendance = Math.round(subjectsData.reduce((sum, s) => sum + s.avgAttendance, 0) / totalSubjects);
    return { totalSubjects, departments, deptList, totalMaterials, avgAttendance };
  }, [subjectsData]);

  const clearSubjFilters = () => { setSubjFilterDept('All'); setSubjFilterYear('All'); setSubjFilterCredits('All'); setSubjFilterAtt('All'); };

  const handleSubjectUpload = () => {
    if (!subjectUploadFile || !subjectUploadModal) return;
    const newMat = { name: subjectUploadFile.name, date: new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) };
    setSubjectsData(prev => prev.map(s => s.id === subjectUploadModal.id ? { ...s, materials: [...s.materials, newMat] } : s));
    setUploadSuccess(subjectUploadModal.name);
    setSubjectUploadFile(null);
    setSubjectUploadModal(null);
    setTimeout(() => setUploadSuccess(null), 2500);
  };

  const handleSubjectFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubjectUploadFile(file);
  };

  /* ── Exam state ── */
  const [examsData, setExamsData] = useState(EXAMS_DATA);
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [showCompletedExams, setShowCompletedExams] = useState(false);
  const [editExam, setEditExam] = useState(null);
  const [newExam, setNewExam] = useState({ title: 'Mid Sem', subject: '', date: '', year: '3', sec: '1' });

  const activeExams = useMemo(() => examsData.filter(e => e.status !== 'Completed'), [examsData]);
  const completedExams = useMemo(() => examsData.filter(e => e.status === 'Completed'), [examsData]);
  const examStats = useMemo(() => ({
    total: examsData.length,
    ongoing: examsData.filter(e => e.status === 'Upcoming').length,
    pending: examsData.filter(e => e.status === 'Scheduled').length,
    completed: completedExams.length,
  }), [examsData, completedExams]);

  const handleCreateExam = () => {
    if (!newExam.subject || !newExam.date) return;
    const id = Math.max(...examsData.map(e => e.id)) + 1;
    setExamsData(prev => [...prev, { id, ...newExam, status: 'Scheduled', invigilation: null }]);
    setNewExam({ title: 'Mid Sem', subject: '', date: '', year: '3', sec: '1' });
    setShowCreateExam(false);
  };

  const handleSaveExam = () => {
    if (!editExam) return;
    setExamsData(prev => prev.map(e => e.id === editExam.id ? editExam : e));
    setEditExam(null);
  };

  /* ── Attendance state ── */
  const [overviewFilter, setOverviewFilter] = useState('Yearly');
  const [attOverview, setAttOverview] = useState(OVERVIEW_DATA_FILTERS['Yearly']);

  const handleOverviewFilterChange = (filter) => {
    setOverviewFilter(filter);
    setAttOverview(OVERVIEW_DATA_FILTERS[filter]);
  };
  const [leaveBreakdown, setLeaveBreakdown] = useState(LEAVE_BREAKDOWN);
  const [dailyAttendance, setDailyAttendance] = useState(DAILY_ATTENDANCE);
  const [attFilter, setAttFilter] = useState('All');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [newLeave, setNewLeave] = useState({ type: 'Casual', from: '', to: '', reason: '' });
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedBioDate, setSelectedBioDate] = useState(D0);

  const filteredAttendance = useMemo(() => {
    if (attFilter === 'All') return dailyAttendance;
    return dailyAttendance.filter(a => a.status.toLowerCase().includes(attFilter.toLowerCase()));
  }, [attFilter, dailyAttendance]);

  const overviewPct = ((attOverview.present / attOverview.totalWorking) * 100).toFixed(1);
  const remainLeaves = leaveBreakdown.casual.total + leaveBreakdown.sick.total + leaveBreakdown.earned.total
    - leaveBreakdown.casual.used - leaveBreakdown.sick.used - leaveBreakdown.earned.used;

  const handleApplyLeave = () => {
    if (!newLeave.from || !newLeave.reason) return;
    
    // Update Overview Stats
    setAttOverview(prev => ({
      ...prev,
      present: Math.max(0, prev.present - 1),
      onLeave: prev.onLeave + 1,
    }));

    // Update Leave Breakdown
    const lType = newLeave.type.toLowerCase();
    setLeaveBreakdown(prev => ({
      ...prev,
      [lType]: { ...prev[lType], used: prev[lType].used + 1 }
    }));

    // Add to daily log
    const d = new Date(newLeave.from);
    let dateStr = newLeave.from;
    if (!isNaN(d)) {
      dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      if (dateStr.match(/^\d /)) dateStr = dateStr.replace(/^(\d) /, '$1th ');
      else if (dateStr.match(/^\d\d /)) dateStr = dateStr.replace(/^(\d\d) /, '$1th ');
    }

    setDailyAttendance(prev => [
      {
        id: Date.now(),
        date: dateStr,
        status: `On Leave - ${newLeave.type}`,
        timeIn: '-',
        timeOut: '-',
        leaveReason: newLeave.reason,
        starred: false,
      },
      ...prev
    ]);

    setNewLeave({ type: 'Casual', from: '', to: '', reason: '' });
    setShowLeaveModal(false);
  };

  const handleToggleStar = (id) => {
    setDailyAttendance(prev => prev.map(a => a.id === id ? { ...a, starred: !a.starred } : a));
  };

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
  const renderCalendar = () => (
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

                  if (tab === 'attendance' && day != null) {
                    const attMatch = dailyAttendance.find(a => {
                      const dayNum = parseInt(a.date);
                      const monthStr = a.date.split(' ')[1];
                      return dayNum === day && MONTH_SHORT[calMonth] === monthStr && calYear === NOW.getFullYear();
                    });
                    if (attMatch) {
                      if (attMatch.status === 'Present') cls += ' cal-att-present';
                      else if (attMatch.status === 'Absent') cls += ' cal-att-absent';
                      else if (attMatch.status.includes('Leave')) cls += ' cal-att-leave';
                    }
                  }

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
  );

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
          <div className={`d-centre ${(tab === 'attendance' || tab === 'subjects' || tab === 'exam') ? 'd-centre-full' : ''}`}>
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
                              <span
                                className={`a-status a-status-click ${a.submitted >= a.total ? 'a-status-complete' : 'a-status-pending'}`}
                                onClick={(e) => { e.stopPropagation(); setViewStatus(a); setStatusTab('submitted'); }}
                                title="Click to view submission details"
                              >
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
            ) : tab === 'attendance' ? (
              <>
                {/* ── ATTENDANCE GRID ── */}
                <div className="att-grid">
                  {/* Attendance Overview */}
                  <div className="att-overview-card">
                    <h3 className="att-card-title">Attendance Overview - Academic Year 2025-26</h3>
                    <div className="att-overview-body">
                      {/* Donut chart */}
                      <div className="att-donut-wrap">
                        <svg viewBox="0 0 120 120" className="att-donut">
                          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="14" />
                          <circle
                            cx="60" cy="60" r="52" fill="none"
                            stroke="#43a047" strokeWidth="14"
                            strokeDasharray={`${(attOverview.present / attOverview.totalWorking) * 326.73} 326.73`}
                            strokeDashoffset="0"
                            transform="rotate(-90 60 60)"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="60" cy="60" r="52" fill="none"
                            stroke="#ffa726" strokeWidth="14"
                            strokeDasharray={`${(attOverview.onLeave / attOverview.totalWorking) * 326.73} 326.73`}
                            strokeDashoffset={`${-(attOverview.present / attOverview.totalWorking) * 326.73}`}
                            transform="rotate(-90 60 60)"
                          />
                          <circle
                            cx="60" cy="60" r="52" fill="none"
                            stroke="#ef5350" strokeWidth="14"
                            strokeDasharray={`${(attOverview.absent / attOverview.totalWorking) * 326.73} 326.73`}
                            strokeDashoffset={`${-((attOverview.present + attOverview.onLeave) / attOverview.totalWorking) * 326.73}`}
                            transform="rotate(-90 60 60)"
                          />
                        </svg>
                        <div className="att-donut-center">
                          <span className="att-donut-label">Overall<br/>Presence:</span>
                          <span className="att-donut-pct">{overviewPct}%</span>
                        </div>
                      </div>
                      {/* Stats */}
                      <div className="att-overview-stats">
                        <div className="att-stat"><span className="att-dot att-dot-total"></span> Total Working Days <strong>{attOverview.totalWorking}</strong></div>
                        <div className="att-stat"><span className="att-dot att-dot-present"></span> Present Days <strong>{attOverview.present}</strong></div>
                        <div className="att-stat"><span className="att-dot att-dot-absent"></span> Absent Days <strong>{attOverview.absent}</strong></div>
                        <div className="att-stat"><span className="att-dot att-dot-leave"></span> On Leave <strong>{attOverview.onLeave}</strong></div>
                      </div>
                    </div>
                    <div className="att-overview-bot">
                      <div className="att-minifilter-grp">
                        {['Weekly', 'Monthly', 'Yearly'].map(f => (
                          <button 
                            key={f} 
                            onClick={() => handleOverviewFilterChange(f)}
                            className={`att-minifilter-btn ${overviewFilter === f ? 'active' : ''}`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Leave Breakdown */}
                  <div className="att-leave-card">
                    <h3 className="att-card-title">Leave Breakdown</h3>
                    {/* Stacked bar */}
                    <div className="att-leave-bar-wrap">
                      <span className="att-leave-total">{leaveBreakdown.casual.total + leaveBreakdown.sick.total + leaveBreakdown.earned.total} days</span>
                      <div className="att-leave-bar">
                        <div className="att-bar-seg att-bar-casual" style={{flex: leaveBreakdown.casual.total}}>{leaveBreakdown.casual.used}/{leaveBreakdown.casual.total}</div>
                        <div className="att-bar-seg att-bar-sick" style={{flex: leaveBreakdown.sick.total}}>{leaveBreakdown.sick.used}/{leaveBreakdown.sick.total}</div>
                        <div className="att-bar-seg att-bar-earned" style={{flex: leaveBreakdown.earned.total}}>{leaveBreakdown.earned.used}/{leaveBreakdown.earned.total}</div>
                        <div className="att-bar-seg att-bar-remain" style={{flex: remainLeaves}}>{remainLeaves}</div>
                      </div>
                      <div className="att-leave-legend">
                        <span><span className="att-dot att-dot-casual"></span> Casual</span>
                        <span><span className="att-dot att-dot-sick"></span> Sick</span>
                        <span><span className="att-dot att-dot-earned"></span> Earned</span>
                        <span><span className="att-dot att-dot-remain"></span> Remaining Leaves</span>
                      </div>
                    </div>
                    {/* Leave detail rows */}
                    <div className="att-leave-rows">
                      <div className="att-leave-row">
                        <span>Casual Leave</span>
                        <div className="att-leave-mini-bar"><div className="att-mini-fill att-fill-casual" style={{width:`${(leaveBreakdown.casual.used/leaveBreakdown.casual.total)*100}%`}}></div></div>
                        <strong>{leaveBreakdown.casual.used}/{leaveBreakdown.casual.total}</strong>
                      </div>
                      <div className="att-leave-row">
                        <span>Sick Leave</span>
                        <div className="att-leave-mini-bar"><div className="att-mini-fill att-fill-sick" style={{width:`${(leaveBreakdown.sick.used/leaveBreakdown.sick.total)*100}%`}}></div></div>
                        <strong>{leaveBreakdown.sick.used}/{leaveBreakdown.sick.total}</strong>
                      </div>
                      <div className="att-leave-row">
                        <span>Earned Leave</span>
                        <div className="att-leave-mini-bar"><div className="att-mini-fill att-fill-earned" style={{width:`${(leaveBreakdown.earned.used/leaveBreakdown.earned.total)*100}%`}}></div></div>
                        <strong>{leaveBreakdown.earned.used}/{leaveBreakdown.earned.total}</strong>
                      </div>
                    </div>
                    <button className="att-apply-btn" onClick={() => setShowLeaveModal(true)}>
                      Apply for Leave <FiPlusCircle />
                    </button>
                  </div>

                  {/* Calendar Render */}
                  {renderCalendar()}

                  {/* Detailed Biometric Logs */}
                  <div className="att-biometric-card">
                    <div className="att-bio-header">
                      <h3 className="att-card-title">Detailed Biometric Logs</h3>
                      <span className="att-bio-date">{selectedBioDate}</span>
                    </div>
                    <div className="att-bio-body">
                      {BIOMETRIC_LOGS[selectedBioDate] && BIOMETRIC_LOGS[selectedBioDate].length > 0 ? (
                        <div className="att-timeline">
                          {BIOMETRIC_LOGS[selectedBioDate].map(log => (
                            <div key={log.id} className="att-timeline-item">
                              <div className={`att-timeline-dot ${log.type === 'In' ? 't-dot-in' : 't-dot-out'}`}></div>
                              <div className="att-timeline-card">
                                <div className="att-t-time">{log.time}</div>
                                <div className="att-t-gate">{log.gate}</div>
                                <span className={`att-t-badge ${log.type === 'In' ? 't-badge-in' : 't-badge-out'}`}>{log.type}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="att-timeline-empty">
                           <p>No biometric logs recorded for this day.</p>
                        </div>
                      )}
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
                        <thead>
                          <tr>
                            <th></th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>Leave Reason</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAttendance.map(a => (
                            <tr 
                              key={a.id} 
                              onClick={() => setSelectedBioDate(a.date)} 
                              className={selectedBioDate === a.date ? 'att-row-active' : ''}
                              style={{ cursor: 'pointer' }}
                            >
                              <td 
                                className="att-star" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleToggleStar(a.id)}
                                title="Toggle Star"
                              >
                                {a.starred ? '★' : '☆'}
                              </td>
                              <td>{a.date}</td>
                              <td>
                                <span className={`att-log-status ${
                                  a.status === 'Present' ? 'att-s-present' :
                                  a.status === 'Absent' ? 'att-s-absent' : 'att-s-leave'
                                }`}>{a.status}</span>
                              </td>
                              <td>{a.timeIn}</td>
                              <td>{a.timeOut}</td>
                              <td>{a.leaveReason}</td>
                              <td>
                                <span 
                                  className="att-action-link"
                                  onClick={() => alert(`Action triggered for ${a.date} (${a.status})`)}
                                  title="View Details"
                                >
                                  {a.status === 'Absent' ? 'Report Error' : 'View Details'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            ) : tab === 'subjects' ? (
              <>
                {/* ── SUBJECTS HEADER ── */}
                <div className="subj-header">
                  <div className="subj-header-left">
                    <h2 className="subj-title">Subjects</h2>
                    <p className="subj-subtitle">Keep track of all the subjects you're teaching</p>
                  </div>
                  <div className="subj-header-right">
                    <div className="subj-search-bar">
                      <FiSearch className="subj-search-icon" />
                      <input type="text" placeholder="Search..." className="subj-search-input" value={subjectSearch} onChange={e => setSubjectSearch(e.target.value)} />
                    </div>
                    <div className="subj-filter-wrap">
                      <button className="subj-filter-btn" onClick={() => setSubjectFilterOpen(p => !p)}>
                        <FiFilter /> Filter {subjActiveFilterCount > 0 && <span className="subj-filter-badge">{subjActiveFilterCount}</span>}
                      </button>
                      {subjectFilterOpen && (
                        <div className="subj-filter-dropdown" onClick={e => e.stopPropagation()}>
                          <div className="subj-filter-hd"><span>Filters</span>{subjActiveFilterCount > 0 && <button className="subj-filter-clear" onClick={clearSubjFilters}>Clear All</button>}</div>
                          <div className="subj-filter-label">Department</div>
                          <div className="subj-filter-chips">
                            {['All','CSE','ECE','ME'].map(d => (
                              <button key={d} className={`subj-chip ${subjFilterDept === d ? 'active' : ''}`} onClick={() => setSubjFilterDept(d)}>{d === 'All' ? 'All' : d}</button>
                            ))}
                          </div>
                          <div className="subj-filter-label">Year</div>
                          <div className="subj-filter-chips">
                            {['All','2nd','3rd','4th'].map(y => (
                              <button key={y} className={`subj-chip ${subjFilterYear === y ? 'active' : ''}`} onClick={() => setSubjFilterYear(y)}>{y === 'All' ? 'All' : y}</button>
                            ))}
                          </div>
                          <div className="subj-filter-label">Credits</div>
                          <div className="subj-filter-chips">
                            {['All','3','4'].map(c => (
                              <button key={c} className={`subj-chip ${subjFilterCredits === c ? 'active' : ''}`} onClick={() => setSubjFilterCredits(c)}>{c === 'All' ? 'All' : c}</button>
                            ))}
                          </div>
                          <div className="subj-filter-label">Attendance</div>
                          <div className="subj-filter-chips">
                            {['All','90+','80-89','<80'].map(a => (
                              <button key={a} className={`subj-chip ${subjFilterAtt === a ? 'active' : ''}`} onClick={() => setSubjFilterAtt(a)}>{a === 'All' ? 'All' : a + (a !== '<80' ? '' : '')}</button>
                            ))}
                          </div>
                          <button className="subj-filter-apply" onClick={() => setSubjectFilterOpen(false)}>Apply Filters</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active filter tags */}
                {subjActiveFilterCount > 0 && (
                  <div className="subj-active-filters">
                    {subjFilterDept !== 'All' && <span className="subj-atag">Dept: {subjFilterDept} <button onClick={() => setSubjFilterDept('All')}>×</button></span>}
                    {subjFilterYear !== 'All' && <span className="subj-atag">Year: {subjFilterYear} <button onClick={() => setSubjFilterYear('All')}>×</button></span>}
                    {subjFilterCredits !== 'All' && <span className="subj-atag">Credits: {subjFilterCredits} <button onClick={() => setSubjFilterCredits('All')}>×</button></span>}
                    {subjFilterAtt !== 'All' && <span className="subj-atag">Attendance: {subjFilterAtt} <button onClick={() => setSubjFilterAtt('All')}>×</button></span>}
                    <button className="subj-clear-all" onClick={clearSubjFilters}>Clear All</button>
                  </div>
                )}

                {/* ── SUBJECT STAT CARDS ── */}
                <div className="subj-cards-section">
                  <h3 className="subj-cards-label">📊 Subject Cards</h3>
                  <div className="subj-cards-grid">
                    <div className="subj-stat-card subj-stat-total subj-stat-clickable" onClick={() => setSubjCardModal('subjects')}>
                      <div className="subj-stat-icon subj-ico-total">📚</div>
                      <div className="subj-stat-info">
                        <span className="subj-stat-num">{subjectStats.totalSubjects}</span>
                        <span className="subj-stat-label">Total Subjects</span>
                      </div>
                    </div>
                    <div className="subj-stat-card subj-stat-dept subj-stat-clickable" onClick={() => setSubjCardModal('departments')}>
                      <div className="subj-stat-icon subj-ico-dept">👥</div>
                      <div className="subj-stat-info">
                        <span className="subj-stat-num">{subjectStats.departments}</span>
                        <span className="subj-stat-label">Departments</span>
                      </div>
                    </div>
                    <div className="subj-stat-card subj-stat-mat subj-stat-clickable" onClick={() => setSubjCardModal('materials')}>
                      <div className="subj-stat-icon subj-ico-mat">📋</div>
                      <div className="subj-stat-info">
                        <span className="subj-stat-num">{subjectStats.totalMaterials}</span>
                        <span className="subj-stat-label">Materials Uploaded</span>
                      </div>
                    </div>
                    <div className="subj-stat-card subj-stat-att subj-stat-clickable" onClick={() => setSubjCardModal('attendance')}>
                      <div className="subj-stat-icon subj-ico-att">📈</div>
                      <div className="subj-stat-info">
                        <span className="subj-stat-num">{subjectStats.avgAttendance}%</span>
                        <span className="subj-stat-label">Overall Avg Attendance</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── SUBJECT TABLE ── */}
                <div className="subj-table-wrap">
                  <table className="subj-table">
                    <thead>
                      <tr>
                        <th>Subject Code</th><th>Subject Name</th><th>Dept</th><th>Year, Sec</th><th>Avg Attendance (%)</th><th>Credits</th><th>Materials</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubjects.length > 0 ? filteredSubjects.map(s => (
                        <tr key={s.id}>
                          <td className="subj-cell-code">{s.code}</td>
                          <td>{s.name}</td>
                          <td>{s.dept}</td>
                          <td>{s.year}, {s.sec}</td>
                          <td>
                            <div className="subj-att-cell">
                              <div className="subj-att-bar-bg"><div className="subj-att-bar-fill" style={{width:`${s.avgAttendance}%`}} /></div>
                              <span>{s.avgAttendance}%</span>
                            </div>
                          </td>
                          <td>{s.credits}</td>
                          <td>
                            <div className="subj-mat-cell">
                              <button className="subj-upload-btn" onClick={() => setSubjectUploadModal(s)}>Upload</button>
                              <button className="subj-mat-dropdown-btn" onClick={() => setSubjectMaterialsView(subjectMaterialsView === s.id ? null : s.id)}><FiChevronDown /></button>
                            </div>
                            {subjectMaterialsView === s.id && (
                              <div className="subj-mat-list">
                                {s.materials.length > 0 ? s.materials.map((m, i) => (
                                  <div key={i} className="subj-mat-item subj-mat-item-click" onClick={() => setSubjMaterialPreview({subject: s.name, material: m})}>
                                    <FiPaperclip className="subj-mat-clip" />
                                    <span className="subj-mat-name">{m.name}</span>
                                    <span className="subj-mat-date">{m.date}</span>
                                  </div>
                                )) : <span className="subj-mat-empty">No materials yet</span>}
                              </div>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={7} className="subj-no-data">No subjects found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {uploadSuccess && <div className="subj-upload-toast">✓ Material uploaded to {uploadSuccess}</div>}

                {/* ── STAT CARD DETAIL MODAL ── */}
                {subjCardModal && (
                  <div className="n-modal-overlay" onClick={() => setSubjCardModal(null)}>
                    <div className="n-modal subj-detail-modal" onClick={e => e.stopPropagation()}>
                      <div className="n-modal-header">
                        <h3>{subjCardModal === 'subjects' ? 'All Subjects' : subjCardModal === 'departments' ? 'Departments' : subjCardModal === 'materials' ? 'All Materials' : 'Attendance Overview'}</h3>
                        <button className="n-modal-close" onClick={() => setSubjCardModal(null)}><FiX /></button>
                      </div>
                      <div className="subj-detail-body">
                        {subjCardModal === 'subjects' && subjectsData.map(s => (
                          <div key={s.id} className="subj-detail-row">
                            <span className="subj-detail-code">{s.code}</span>
                            <span className="subj-detail-name">{s.name}</span>
                            <span className="subj-detail-dept-tag">{s.dept}</span>
                            <span className="subj-detail-meta">{s.year} Year · {s.credits} Credits</span>
                          </div>
                        ))}
                        {subjCardModal === 'departments' && subjectStats.deptList.map(dept => {
                          const deptSubjects = subjectsData.filter(s => s.dept === dept);
                          return (
                            <div key={dept} className="subj-dept-block">
                              <div className="subj-dept-hd"><span className="subj-detail-dept-tag">{dept}</span><span>{deptSubjects.length} subject{deptSubjects.length > 1 ? 's' : ''}</span></div>
                              {deptSubjects.map(s => <div key={s.id} className="subj-dept-sub">{s.code} — {s.name}</div>)}
                            </div>
                          );
                        })}
                        {subjCardModal === 'materials' && subjectsData.map(s => (
                          <div key={s.id} className="subj-mat-block">
                            <div className="subj-mat-block-hd">{s.code} — {s.name} <span className="subj-mat-count">{s.materials.length} files</span></div>
                            {s.materials.map((m, i) => (
                              <div key={i} className="subj-mat-item subj-mat-item-click" onClick={() => { setSubjCardModal(null); setSubjMaterialPreview({subject: s.name, material: m}); }}>
                                <FiPaperclip className="subj-mat-clip" /><span className="subj-mat-name">{m.name}</span><span className="subj-mat-date">{m.date}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                        {subjCardModal === 'attendance' && (
                          <div className="subj-att-overview">
                            {[...subjectsData].sort((a,b) => b.avgAttendance - a.avgAttendance).map(s => (
                              <div key={s.id} className="subj-att-row">
                                <span className="subj-att-row-name">{s.code}</span>
                                <div className="subj-att-bar-bg subj-att-bar-wide"><div className="subj-att-bar-fill" style={{width:`${s.avgAttendance}%`, background: s.avgAttendance >= 90 ? '#43a047' : s.avgAttendance >= 80 ? '#fb8c00' : '#ef5350'}} /></div>
                                <span className={`subj-att-row-pct ${s.avgAttendance >= 90 ? 'att-good' : s.avgAttendance >= 80 ? 'att-warn' : 'att-low'}`}>{s.avgAttendance}%</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── MATERIAL PREVIEW MODAL ── */}
                {subjMaterialPreview && (
                  <div className="n-modal-overlay" onClick={() => setSubjMaterialPreview(null)}>
                    <div className="n-modal subj-preview-modal" onClick={e => e.stopPropagation()}>
                      <div className="n-modal-header">
                        <h3>{subjMaterialPreview.material.name}</h3>
                        <button className="n-modal-close" onClick={() => setSubjMaterialPreview(null)}><FiX /></button>
                      </div>
                      <div className="subj-preview-body">
                        <div className="subj-preview-icon-wrap"><FiFileText className="subj-preview-icon" /></div>
                        <h4 className="subj-preview-fname">{subjMaterialPreview.material.name}</h4>
                        <p className="subj-preview-meta">Subject: <strong>{subjMaterialPreview.subject}</strong></p>
                        <p className="subj-preview-meta">Uploaded: <strong>{subjMaterialPreview.material.date}</strong></p>
                        <p className="subj-preview-meta">Type: <strong>{subjMaterialPreview.material.name.split('.').pop().toUpperCase()}</strong></p>
                      </div>
                      <div className="n-modal-footer">
                        <button className="n-modal-cancel" onClick={() => setSubjMaterialPreview(null)}>Close</button>
                        <button className="n-modal-submit">
                          <FiDownload style={{marginRight:6}} /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : tab === 'exam' ? (
              <>
                {/* ── EXAM HEADER ── */}
                <div className="exam-header">
                  <div className="exam-header-left">
                    <h2 className="exam-title">Exam Overview</h2>
                  </div>
                  <div className="exam-header-right">
                    <button className="exam-create-btn" onClick={() => setShowCreateExam(true)}>+ Create Exam</button>
                    <button className="exam-completed-btn" onClick={() => setShowCompletedExams(true)}>View Completed Exams</button>
                  </div>
                </div>

                {/* ── EXAM STAT CARDS ── */}
                <div className="exam-stats-grid">
                  <div className="exam-stat-card">
                    <span className="exam-stat-label">Total Exams</span>
                    <span className="exam-stat-num">{examStats.total}</span>
                  </div>
                  <div className="exam-stat-card">
                    <span className="exam-stat-label">Ongoing Exams</span>
                    <span className="exam-stat-num">{examStats.ongoing}</span>
                  </div>
                  <div className="exam-stat-card">
                    <span className="exam-stat-label">Pending Evaluation</span>
                    <span className="exam-stat-num">{examStats.pending}</span>
                  </div>
                  <div className="exam-stat-card">
                    <span className="exam-stat-label">Completed Exams</span>
                    <span className="exam-stat-num">{examStats.completed}</span>
                  </div>
                </div>

                {/* ── EXAM TABLE ── */}
                <div className="exam-table-wrap">
                  <table className="exam-table">
                    <thead>
                      <tr>
                        <th>Exam Title</th><th>Subject</th><th>Date</th><th>Year/Sec</th><th>Status</th><th>Invigilation Duties</th><th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeExams.map(e => (
                        <tr key={e.id}>
                          <td className="exam-cell-title">{e.title}</td>
                          <td>{e.subject}</td>
                          <td>{e.date}</td>
                          <td>{e.year}/{e.sec}</td>
                          <td>
                            <span className={`exam-status-badge ${e.status === 'Upcoming' ? 'exam-badge-upcoming' : 'exam-badge-scheduled'}`}>
                              {e.status === 'Upcoming' ? <FiClock className="exam-badge-ico" /> : <FiCalendar className="exam-badge-ico" />}
                              {e.status}
                            </span>
                          </td>
                          <td>
                            {e.invigilation ? (
                              <div className="exam-invig">
                                <span className="exam-invig-name">{e.invigilation.exam}<br/>{e.invigilation.room}</span>
                                <span className="exam-invig-date">{e.invigilation.date}</span>
                                <span className="exam-invig-status">{e.invigilation.status}</span>
                              </div>
                            ) : <span className="exam-invig-none">-</span>}
                          </td>
                          <td>
                            <button className="exam-edit-btn" onClick={() => setEditExam({...e})}><FiEdit2 /></button>
                          </td>
                        </tr>
                      ))}
                      {activeExams.length === 0 && <tr><td colSpan={7} className="exam-no-data">No active exams.</td></tr>}
                    </tbody>
                  </table>
                </div>

                {/* ── CREATE EXAM MODAL ── */}
                {showCreateExam && (
                  <div className="n-modal-overlay" onClick={() => setShowCreateExam(false)}>
                    <div className="n-modal" onClick={ev => ev.stopPropagation()}>
                      <div className="n-modal-header">
                        <h3>Create New Exam</h3>
                        <button className="n-modal-close" onClick={() => setShowCreateExam(false)}><FiX /></button>
                      </div>
                      <div className="n-modal-body">
                        <div className="n-form-field">
                          <label>Exam Type</label>
                          <select value={newExam.title} onChange={ev => setNewExam(p => ({...p, title: ev.target.value}))}>
                            <option>Mid Sem</option><option>End Sem</option><option>Class Test</option><option>Quiz</option><option>Viva</option><option>Lab Exam</option>
                          </select>
                        </div>
                        <div className="n-form-field">
                          <label>Subject</label>
                          <input type="text" placeholder="e.g. Algorithm" value={newExam.subject} onChange={ev => setNewExam(p => ({...p, subject: ev.target.value}))} />
                        </div>
                        <div className="n-form-field">
                          <label>Date</label>
                          <input type="date" value={newExam.date} onChange={ev => setNewExam(p => ({...p, date: ev.target.value}))} />
                        </div>
                        <div className="n-form-field" style={{display:'flex',gap:12}}>
                          <div style={{flex:1}}>
                            <label>Year</label>
                            <select value={newExam.year} onChange={ev => setNewExam(p => ({...p, year: ev.target.value}))}>
                              <option value="1">1st</option><option value="2">2nd</option><option value="3">3rd</option><option value="4">4th</option>
                            </select>
                          </div>
                          <div style={{flex:1}}>
                            <label>Section</label>
                            <select value={newExam.sec} onChange={ev => setNewExam(p => ({...p, sec: ev.target.value}))}>
                              <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="n-modal-footer">
                        <button className="n-modal-cancel" onClick={() => setShowCreateExam(false)}>Cancel</button>
                        <button className="n-modal-submit" onClick={handleCreateExam} disabled={!newExam.subject || !newExam.date}>Create Exam</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── COMPLETED EXAMS MODAL ── */}
                {showCompletedExams && (
                  <div className="n-modal-overlay" onClick={() => setShowCompletedExams(false)}>
                    <div className="n-modal exam-completed-modal" onClick={ev => ev.stopPropagation()}>
                      <div className="n-modal-header">
                        <h3>Completed Exams ({completedExams.length})</h3>
                        <button className="n-modal-close" onClick={() => setShowCompletedExams(false)}><FiX /></button>
                      </div>
                      <div className="exam-completed-body">
                        {completedExams.length > 0 ? completedExams.map(e => (
                          <div key={e.id} className="exam-completed-row">
                            <span className="exam-completed-title">{e.title}</span>
                            <span className="exam-completed-subj">{e.subject}</span>
                            <span className="exam-completed-date">{e.date}</span>
                            <span className="exam-completed-ys">{e.year}/{e.sec}</span>
                            <span className="exam-badge-completed">✓ Completed</span>
                          </div>
                        )) : <p className="exam-no-data" style={{padding:20}}>No completed exams yet.</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── EDIT EXAM MODAL ── */}
                {editExam && (
                  <div className="n-modal-overlay" onClick={() => setEditExam(null)}>
                    <div className="n-modal" onClick={ev => ev.stopPropagation()}>
                      <div className="n-modal-header">
                        <h3>Edit Exam</h3>
                        <button className="n-modal-close" onClick={() => setEditExam(null)}><FiX /></button>
                      </div>
                      <div className="n-modal-body">
                        <div className="n-form-field">
                          <label>Exam Title</label>
                          <select value={editExam.title} onChange={ev => setEditExam(p => ({...p, title: ev.target.value}))}>
                            <option>Mid Sem</option><option>End Sem</option><option>Class Test</option><option>Quiz</option><option>Viva</option><option>Lab Exam</option>
                          </select>
                        </div>
                        <div className="n-form-field">
                          <label>Subject</label>
                          <input type="text" value={editExam.subject} onChange={ev => setEditExam(p => ({...p, subject: ev.target.value}))} />
                        </div>
                        <div className="n-form-field">
                          <label>Date</label>
                          <input type="text" value={editExam.date} onChange={ev => setEditExam(p => ({...p, date: ev.target.value}))} />
                        </div>
                        <div className="n-form-field">
                          <label>Status</label>
                          <select value={editExam.status} onChange={ev => setEditExam(p => ({...p, status: ev.target.value}))}>
                            <option>Upcoming</option><option>Scheduled</option><option>Completed</option>
                          </select>
                        </div>
                      </div>
                      <div className="n-modal-footer">
                        <button className="n-modal-cancel" onClick={() => setEditExam(null)}>Cancel</button>
                        <button className="n-modal-submit" onClick={handleSaveExam}>Save Changes</button>
                      </div>
                    </div>
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
          {tab !== 'attendance' && tab !== 'subjects' && tab !== 'exam' && (
            <div className="d-right">
              {renderCalendar()}

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
                  onClick={() => { setExpandedUnsub(null); setShowUnsubmitted('open'); }}
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
            ) : tab === 'attendance' ? null : (
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
        )}

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
      {showUnsubmitted && (() => {
        const pendingAssignments = assignments.filter(a => a.submitted < a.total);
        return (
          <div className="n-modal-overlay" onClick={() => setShowUnsubmitted(null)}>
            <div className="n-modal a-status-modal" onClick={e => e.stopPropagation()}>
              <div className="n-modal-header">
                <h3>Unsubmitted Students</h3>
                <button className="n-modal-close" onClick={() => setShowUnsubmitted(null)}>
                  <FiX />
                </button>
              </div>

              {pendingAssignments.length > 0 ? (
                <div className="a-unsub-detail-list">
                  {pendingAssignments.map(a => {
                    const studs = generateStudents(a.id, a.total, a.submitted);
                    const pending = studs.filter(s => !s.submitted);
                    const isOpen = expandedUnsub === a.id;
                    return (
                      <div key={a.id} className="a-unsub-group">
                        <div
                          className="a-unsub-group-hd"
                          onClick={() => setExpandedUnsub(prev => prev === a.id ? null : a.id)}
                        >
                          <div>
                            <h4>{a.title}</h4>
                            <span className="a-unsub-meta">{a.subject} · {a.section}</span>
                          </div>
                          <span className="a-unsub-count">{pending.length} pending</span>
                        </div>
                        {isOpen && (
                          <div className="a-unsub-students">
                            {pending.map((s, i) => (
                              <div key={i} className="a-st-student a-st-not">
                                <div className="a-st-avatar">
                                  {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                </div>
                                <div className="a-st-info">
                                  <span className="a-st-name">{s.name}</span>
                                  <span className="a-st-roll">{s.rollNo}</span>
                                </div>
                                <span className="a-st-badge a-st-badge-no">✗ Pending</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="n-modal-body">
                  <p className="n-no-data">All students have submitted their assignments!</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ═══ SUBMISSION STATUS MODAL ═══ */}
      {viewStatus && (() => {
        const studs = generateStudents(viewStatus.id, viewStatus.total, viewStatus.submitted);
        const submittedList = studs.filter(s => s.submitted);
        const pendingList = studs.filter(s => !s.submitted);
        const activeList = statusTab === 'submitted' ? submittedList : pendingList;
        return (
          <div className="n-modal-overlay" onClick={() => setViewStatus(null)}>
            <div className="n-modal a-status-modal" onClick={e => e.stopPropagation()}>
              <div className="n-modal-header">
                <h3>{viewStatus.title}</h3>
                <button className="n-modal-close" onClick={() => setViewStatus(null)}>
                  <FiX />
                </button>
              </div>

              {/* Progress bar */}
              <div className="a-st-progress-wrap">
                <div className="a-st-progress-bar">
                  <div
                    className="a-st-progress-fill"
                    style={{ width: `${(viewStatus.submitted / viewStatus.total) * 100}%` }}
                  />
                </div>
                <span className="a-st-progress-text">
                  {viewStatus.submitted} of {viewStatus.total} submitted ({Math.round((viewStatus.submitted / viewStatus.total) * 100)}%)
                </span>
              </div>

              {/* Tabs */}
              <div className="a-st-tabs">
                <button
                  className={`a-st-tab ${statusTab === 'submitted' ? 'a-st-tab-active-green' : ''}`}
                  onClick={() => setStatusTab('submitted')}
                >
                  ✓ Submitted ({submittedList.length})
                </button>
                <button
                  className={`a-st-tab ${statusTab === 'pending' ? 'a-st-tab-active-red' : ''}`}
                  onClick={() => setStatusTab('pending')}
                >
                  ✗ Pending ({pendingList.length})
                </button>
              </div>

              {/* Student list */}
              <div className="a-st-list">
                {activeList.map((s, i) => (
                  <div key={i} className={`a-st-student ${s.submitted ? 'a-st-done' : 'a-st-not'}`}>
                    <div className="a-st-avatar">
                      {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div className="a-st-info">
                      <span className="a-st-name">{s.name}</span>
                      <span className="a-st-roll">{s.rollNo}</span>
                    </div>
                    <span className={`a-st-badge ${s.submitted ? 'a-st-badge-yes' : 'a-st-badge-no'}`}>
                      {s.submitted ? '✓ Submitted' : '✗ Pending'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="a-st-footer">
                <span className="a-preview-meta">{viewStatus.subject} · {viewStatus.section} · Due: {viewStatus.dueDate}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ UPLOAD MATERIAL MODAL ═══ */}
      {subjectUploadModal && (
        <div className="n-modal-overlay" onClick={() => { setSubjectUploadModal(null); setSubjectUploadFile(null); }}>
          <div className="n-modal" onClick={e => e.stopPropagation()}>
            <div className="n-modal-header">
              <h3>Upload Material — {subjectUploadModal.name}</h3>
              <button className="n-modal-close" onClick={() => { setSubjectUploadModal(null); setSubjectUploadFile(null); }}><FiX /></button>
            </div>
            <div className="n-modal-body">
              <div className="n-form-field">
                <label>Subject</label>
                <input type="text" value={`${subjectUploadModal.code} — ${subjectUploadModal.name}`} readOnly />
              </div>
              <div className="n-form-field">
                <label>Select File</label>
                <div className="a-upload-area">
                  <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,image/*" id="subj-file-input" className="a-file-input" onChange={handleSubjectFileChange} />
                  <label htmlFor="subj-file-input" className="a-upload-label">
                    <FiUpload className="a-upload-ico" />
                    <span>{subjectUploadFile ? subjectUploadFile.name : 'Choose file or drag here'}</span>
                  </label>
                </div>
              </div>
              <p className="subj-existing-label">Existing Materials ({subjectUploadModal.materials.length})</p>
              <div className="subj-existing-list">
                {subjectUploadModal.materials.map((m, i) => (
                  <div key={i} className="subj-mat-item"><FiPaperclip className="subj-mat-clip" /><span>{m.name}</span><span className="subj-mat-date">{m.date}</span></div>
                ))}
              </div>
            </div>
            <div className="n-modal-footer">
              <button className="n-modal-cancel" onClick={() => { setSubjectUploadModal(null); setSubjectUploadFile(null); }}>Cancel</button>
              <button className="n-modal-submit" onClick={handleSubjectUpload} disabled={!subjectUploadFile}>Upload Material</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ APPLY FOR LEAVE MODAL ═══ */}
      {showLeaveModal && (
        <div className="n-modal-overlay" onClick={() => setShowLeaveModal(false)}>
          <div className="n-modal" onClick={e => e.stopPropagation()}>
            <div className="n-modal-header">
              <h3>Apply for Leave</h3>
              <button className="n-modal-close" onClick={() => setShowLeaveModal(false)}><FiX /></button>
            </div>
            <div className="n-modal-body">
              <div className="n-form-field">
                <label>Leave Type</label>
                <select value={newLeave.type} onChange={e => setNewLeave(p => ({...p, type: e.target.value}))}>
                  <option>Casual</option>
                  <option>Sick</option>
                  <option>Earned</option>
                </select>
              </div>
              <div className="n-form-field">
                <label>From Date</label>
                <input type="date" value={newLeave.from} onChange={e => setNewLeave(p => ({...p, from: e.target.value}))} />
              </div>
              <div className="n-form-field">
                <label>To Date (optional)</label>
                <input type="date" value={newLeave.to} onChange={e => setNewLeave(p => ({...p, to: e.target.value}))} />
              </div>
              <div className="n-form-field">
                <label>Reason</label>
                <textarea placeholder="Enter reason for leave..." rows={3} value={newLeave.reason} onChange={e => setNewLeave(p => ({...p, reason: e.target.value}))} />
              </div>
            </div>
            <div className="n-modal-footer">
              <button className="n-modal-cancel" onClick={() => setShowLeaveModal(false)}>Cancel</button>
              <button className="n-modal-submit" onClick={handleApplyLeave}>Submit Application</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
