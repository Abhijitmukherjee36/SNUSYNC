/* ── Month helpers ── */
export const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

/* ── Nav items ── */
export const NAV = [
  { id: 'dashboard',   label: 'Dashboard',   path: '/dashboard' },
  { id: 'students',    label: 'Students',     path: '/dashboard/students' },
  { id: 'assignments', label: 'Assignments',  path: '/dashboard/assignments' },
  { id: 'subjects',    label: 'Subjects',     path: '/dashboard/subjects' },
  { id: 'attendance',  label: 'Attendance',   path: '/dashboard/attendance' },
  { id: 'notice',      label: 'Notice',       path: '/dashboard/notice' },
  { id: 'exam',        label: 'Exam',         path: '/dashboard/exam' },
];

/* ── Daily Schedule ── */
export const WEEKLY_SCHEDULE = {
  0: [],
  1: [
    { time: '09:00 – 09:50', subject: 'DBMS', code: 'DBMS301', room: 'C-102', type: 'Lecture' },
    { time: '10:00 – 10:50', subject: 'Algorithm', code: 'ALG301', room: 'B-201', type: 'Lecture' },
    { time: '11:00 – 11:50', subject: 'Java', code: 'JAVA301', room: 'A-201', type: 'Lecture' },
    { time: '12:00 – 12:45', subject: 'Lunch Break', room: 'Cafeteria', type: 'Break' },
    { time: '12:45 – 02:15', subject: 'Algorithm Lab', code: 'ALG301', room: 'Lab-1', type: 'Lab' },
  ],
  2: [
    { time: '09:00 – 10:50', subject: 'Java Lab', code: 'JAVA301', room: 'Lab-3', type: 'Lab' },
    { time: '11:00 – 11:50', subject: 'Operating Sys', code: 'CS301', room: 'A-105', type: 'Lecture' },
    { time: '12:00 – 12:45', subject: 'Lunch Break', room: 'Cafeteria', type: 'Break' },
    { time: '12:45 – 01:35', subject: 'DBMS', code: 'DBMS301', room: 'C-102', type: 'Tutorial' },
  ],
  3: [
    { time: '09:00 – 09:50', subject: 'Algorithm', code: 'ALG301', room: 'B-201', type: 'Lecture' },
    { time: '10:00 – 10:50', subject: 'Computer Networks', code: 'CN301', room: 'B-103', type: 'Lecture' },
    { time: '11:00 – 11:50', subject: 'Java', code: 'JAVA301', room: 'A-201', type: 'Lecture' },
    { time: '12:00 – 12:45', subject: 'Lunch Break', room: 'Cafeteria', type: 'Break' },
    { time: '01:00 – 02:30', subject: 'CN Lab', code: 'CN301', room: 'Lab-2', type: 'Lab' },
    { time: '02:45 – 03:35', subject: 'Operating Sys', code: 'CS301', room: 'B-103', type: 'Tutorial' },
  ],
  4: [
    { time: '09:00 – 10:50', subject: 'DBMS Lab', code: 'DBMS301', room: 'Lab-1', type: 'Lab' },
    { time: '11:00 – 11:50', subject: 'Algorithm', code: 'ALG301', room: 'B-201', type: 'Tutorial' },
    { time: '12:00 – 12:45', subject: 'Lunch Break', room: 'Cafeteria', type: 'Break' },
  ],
  5: [
    { time: '09:00 – 09:50', subject: 'Computer Networks', code: 'CN301', room: 'B-103', type: 'Lecture' },
    { time: '10:00 – 10:50', subject: 'Operating Sys', code: 'CS301', room: 'A-105', type: 'Lecture' },
    { time: '11:00 – 12:30', subject: 'OS Lab', code: 'CS301', room: 'Lab-4', type: 'Lab' },
  ],
  6: [],
};

/* ── Events ── */
export const EVENTS = [
  { title: 'Basketball', date: '12 Nov 2025', desc: 'Come cheer on your favorite teams in a series of intense matchups. Food and drinks available!' },
];

/* ── Subjects ── */
export const SUBJECTS_DATA = [
  { id: 1, code: 'ALG301', name: 'Algorithm', dept: 'CSE', year: '3rd', sec: '1', avgAttendance: 88, credits: 3, materials: [{name:'Lecture 1.pdf',date:'10 Apr 2026'},{name:'Lecture 2.pdf',date:'15 Apr 2026'},{name:'Assignment 1.pdf',date:'20 Apr 2026'}] },
  { id: 2, code: 'CN301', name: 'Computer Networks', dept: 'CSE', year: '3rd', sec: '1', avgAttendance: 92, credits: 3, materials: [{name:'Module 1.pdf',date:'8 Apr 2026'},{name:'Lab Manual.pdf',date:'12 Apr 2026'}] },
  { id: 3, code: 'DBMS301', name: 'Database Management', dept: 'CSE', year: '3rd', sec: '1', avgAttendance: 85, credits: 3, materials: [{name:'ER Diagrams.pdf',date:'5 Apr 2026'},{name:'SQL Notes.pdf',date:'9 Apr 2026'},{name:'Normalization.pdf',date:'14 Apr 2026'}] },
  { id: 4, code: 'JAVA301', name: 'Java', dept: 'CSE', year: '3rd', sec: '1', avgAttendance: 90, credits: 3, materials: [{name:'OOP Concepts.pdf',date:'3 Apr 2026'},{name:'Collections.pdf',date:'7 Apr 2026'},{name:'Multithreading.pdf',date:'11 Apr 2026'},{name:'Swing.pdf',date:'18 Apr 2026'}] },
  { id: 5, code: 'CS301', name: 'Operating Systems', dept: 'CSE', year: '3rd', sec: '1', avgAttendance: 87, credits: 3, materials: [{name:'Process Mgmt.pdf',date:'2 Apr 2026'},{name:'Memory Mgmt.pdf',date:'6 Apr 2026'},{name:'File Systems.pdf',date:'13 Apr 2026'}] },
  { id: 6, code: 'EC201', name: 'Digital Electronics', dept: 'ECE', year: '2nd', sec: '1', avgAttendance: 91, credits: 4, materials: [{name:'Logic Gates.pdf',date:'4 Apr 2026'},{name:'Flip Flops.pdf',date:'10 Apr 2026'}] },
  { id: 7, code: 'EC301', name: 'Signal Processing', dept: 'ECE', year: '3rd', sec: '1', avgAttendance: 78, credits: 3, materials: [{name:'Fourier Transform.pdf',date:'1 Apr 2026'}] },
  { id: 8, code: 'ME201', name: 'Thermodynamics', dept: 'ME', year: '2nd', sec: '1', avgAttendance: 82, credits: 4, materials: [{name:'Laws of Thermo.pdf',date:'5 Apr 2026'},{name:'Heat Engines.pdf',date:'12 Apr 2026'}] },
];

/* ── Exams ── */
export const EXAMS_DATA = [
  { id: 1, title: 'Mid Sem', subject: 'Algorithm', date: '12 Nov 2025', year: '3', sec: '1', status: 'Upcoming', invigilation: { exam: 'Mid Sem', room: 'B-201', date: '12 Nov', status: 'Assigned' } },
  { id: 2, title: 'Class Test', subject: 'DBMS', date: '15 Nov 2025', year: '2', sec: '1', status: 'Scheduled', invigilation: null },
  { id: 3, title: 'Viva', subject: 'Networks', date: '20 Nov 2025', year: '3', sec: '1', status: 'Scheduled', invigilation: null },
  { id: 4, title: 'End Sem', subject: 'Java', date: '25 Nov 2025', year: '3', sec: '1', status: 'Upcoming', invigilation: { exam: 'End Sem', room: 'A-101', date: '25 Nov', status: 'Assigned' } },
  { id: 5, title: 'Lab Exam', subject: 'OS', date: '28 Nov 2025', year: '3', sec: '1', status: 'Scheduled', invigilation: null },
  { id: 6, title: 'Mid Sem', subject: 'Digital Elec', date: '5 Oct 2025', year: '2', sec: '1', status: 'Completed', invigilation: null },
  { id: 7, title: 'Class Test', subject: 'Algorithm', date: '10 Oct 2025', year: '3', sec: '1', status: 'Completed', invigilation: null },
  { id: 8, title: 'Quiz', subject: 'Networks', date: '18 Oct 2025', year: '3', sec: '1', status: 'Completed', invigilation: null },
];

/* ── Assignments ── */
export const SUBJECTS_LIST = ['Algorithms', 'DBMS', 'Data Structures', 'Operating Systems', 'Computer Networks', 'Software Engineering'];
export const DEFAULT_ASSIGNMENTS = [
  { id: 1, title: 'Algorithm - Assignment 1', subject: 'Algorithms', section: '6th Sem, Sec 1', dueDate: '10 Apr 2026', submitted: 45, total: 60, attachment: null },
  { id: 2, title: 'DBMS Report', subject: 'DBMS', section: '4th Sem, Sec 2', dueDate: '8 Apr 2026', submitted: 59, total: 70, attachment: null },
  { id: 3, title: 'Database Project', subject: 'DBMS', section: '2nd Sem, Sec 3', dueDate: '5 Apr 2026', submitted: 62, total: 80, attachment: null },
  { id: 4, title: 'OS Lab Report', subject: 'Operating Systems', section: '6th Sem, Sec 1', dueDate: '3 Apr 2026', submitted: 50, total: 55, attachment: null },
  { id: 5, title: 'Network Protocols Essay', subject: 'Computer Networks', section: '4th Sem, Sec 1', dueDate: '1 Apr 2026', submitted: 38, total: 65, attachment: null },
];

/* ── Students ── */
export const STUDENT_NAMES = [
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

export const generateStudents = (assignId, total, submitted) => {
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

export const ALL_STUDENTS = {
  'Computer Science': {
    '7th': {
      '1': [
        { id: '2211200001052', name: 'Anirban Patra' },{ id: '2211200001053', name: 'Swarup Bose' },
        { id: '2211200001054', name: 'Saikat Kaity' },{ id: '2211200001055', name: 'Debojyoti Biswas' },
        { id: '2211200001056', name: 'Rahul Kumar' },{ id: '2211200001057', name: 'Sneha Das' },
        { id: '2211200001058', name: 'Arijit Mondal' },{ id: '2211200001059', name: 'Priyanka Saha' },
        { id: '2211200001060', name: 'Sourav Ghosh' },{ id: '2211200001061', name: 'Tanmay Basu' },
        { id: '2211200001062', name: 'Ritika Sen' },{ id: '2211200001063', name: 'Arnab Dutta' },
        { id: '2211200001064', name: 'Moumita Roy' },{ id: '2211200001065', name: 'Subhajit Paul' },
        { id: '2211200001066', name: 'Shreya Banerjee' },
      ],
      '2': [
        { id: '2211200002001', name: 'Priya Sharma' },{ id: '2211200002002', name: 'Amit Singh' },
        { id: '2211200002003', name: 'Ritu Ghosh' },{ id: '2211200002004', name: 'Vikash Yadav' },
        { id: '2211200002005', name: 'Neha Kumari' },{ id: '2211200002006', name: 'Rajesh Mondal' },
        { id: '2211200002007', name: 'Swati Chakraborty' },{ id: '2211200002008', name: 'Manish Tiwari' },
        { id: '2211200002009', name: 'Pooja Gupta' },{ id: '2211200002010', name: 'Rohan Das' },
      ],
    },
    '5th': {
      '1': [
        { id: '2311200001001', name: 'Sourav Sen' },{ id: '2311200001002', name: 'Tanisha Roy' },
        { id: '2311200001003', name: 'Vikram Jain' },{ id: '2311200001004', name: 'Moumita Dey' },
        { id: '2311200001005', name: 'Kunal Sarkar' },{ id: '2311200001006', name: 'Dipika Mitra' },
        { id: '2311200001007', name: 'Aritra Bhatt' },{ id: '2311200001008', name: 'Puja Haldar' },
        { id: '2311200001009', name: 'Sayan Mukherjee' },{ id: '2311200001010', name: 'Ankita Biswas' },
        { id: '2311200001011', name: 'Partha Manna' },{ id: '2311200001012', name: 'Riya Chatterjee' },
      ],
    },
  },
  'Electronics': {
    '7th': {
      '1': [
        { id: '2211300001001', name: 'Arjun Mehta' },{ id: '2211300001002', name: 'Kavita Nair' },
        { id: '2211300001003', name: 'Rohan Gupta' },{ id: '2211300001004', name: 'Pooja Rani' },
        { id: '2211300001005', name: 'Suraj Verma' },{ id: '2211300001006', name: 'Ananya Bose' },
        { id: '2211300001007', name: 'Debjit Saha' },{ id: '2211300001008', name: 'Ishita Ghosh' },
        { id: '2211300001009', name: 'Nikhil Pandey' },{ id: '2211300001010', name: 'Trishna Das' },
      ],
    },
  },
  'Mechanical': {
    '7th': {
      '1': [
        { id: '2211400001001', name: 'Deepak Yadav' },{ id: '2211400001002', name: 'Anjali Mishra' },
        { id: '2211400001003', name: 'Karan Thakur' },{ id: '2211400001004', name: 'Sunita Sharma' },
        { id: '2211400001005', name: 'Rahul Prasad' },{ id: '2211400001006', name: 'Nandini Roy' },
        { id: '2211400001007', name: 'Abhishek Kumar' },{ id: '2211400001008', name: 'Meera Joshi' },
        { id: '2211400001009', name: 'Tarun Kapoor' },{ id: '2211400001010', name: 'Pallavi Dubey' },
        { id: '2211400001011', name: 'Siddharth Raut' },
      ],
    },
  },
};

export const DEPARTMENTS = Object.keys(ALL_STUDENTS);
export const SEMESTERS = ['1st','2nd','3rd','4th','5th','6th','7th','8th'];
export const SECTIONS = ['1','2','3'];

/* ── Attendance data ── */
const getPastDateStr = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  let dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (dateStr.match(/^\d /)) dateStr = dateStr.replace(/^(\d) /, '$1th ');
  else if (dateStr.match(/^\d\d /)) dateStr = dateStr.replace(/^(\d\d) /, '$1th ');
  dateStr = dateStr.replace(/1th/, '1st').replace(/2th/, '2nd').replace(/3th/, '3rd').replace(/11st/, '11th').replace(/12nd/, '12th').replace(/13rd/, '13th');
  return dateStr;
};

export const D0 = getPastDateStr(0);
export const D1 = getPastDateStr(1);
export const D5 = getPastDateStr(5);
export const D6 = getPastDateStr(6);
export const D7 = getPastDateStr(7);
export const D8 = getPastDateStr(8);
export const D11 = getPastDateStr(11);
export const D12 = getPastDateStr(12);

export const DAILY_ATTENDANCE = [
  { id: 1, date: D0,  status: 'Present', timeIn: '9:02 AM', timeOut: '5:15 PM', leaveReason: '-', starred: true },
  { id: 2, date: D1,  status: 'Present', timeIn: '8:58 AM', timeOut: '5:20 PM', leaveReason: '-', starred: true },
  { id: 3, date: D5, status: 'On Leave - Sick', timeIn: '-', timeOut: '-', leaveReason: 'High Fever', starred: true },
  { id: 4, date: D6, status: 'Present', timeIn: '9:10 AM', timeOut: '5:05 PM', leaveReason: '-', starred: false },
  { id: 5, date: D7, status: 'Present', timeIn: '8:55 AM', timeOut: '5:30 PM', leaveReason: '-', starred: false },
  { id: 6, date: D8, status: 'Absent', timeIn: '-', timeOut: '-', leaveReason: '-', starred: false },
  { id: 7, date: D11, status: 'Present', timeIn: '9:00 AM', timeOut: '5:10 PM', leaveReason: '-', starred: false },
  { id: 8, date: D12, status: 'On Leave - Casual', timeIn: '-', timeOut: '-', leaveReason: 'Personal Work', starred: false },
];

export const BIOMETRIC_LOGS = {
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

const _current = new Date();
const _dStr = `${_current.getDate()}${['st','nd','rd'][((_current.getDate()%10)-1)]||'th'} ${MONTH_SHORT[_current.getMonth()]} ${_current.getFullYear()}`;
export const OVERVIEW_DATA_FILTERS = {
  Weekly: { totalWorking: 5, present: 4, absent: 1, onLeave: 0, lastUpdated: _dStr },
  Monthly: { totalWorking: 22, present: 19, absent: 2, onLeave: 1, lastUpdated: _dStr },
  Yearly: { totalWorking: 220, present: 205, absent: 5, onLeave: 10, lastUpdated: _dStr },
};

export const LEAVE_BREAKDOWN = {
  casual: { used: 5, total: 7 },
  sick:   { used: 3, total: 5 },
  earned: { used: 2, total: 6 },
};

/* ── Notices ── */
export const DEFAULT_NOTICES = [
  { id: 1, title: 'Semester Exams', date: '12 Apr 2026', body: 'Semester examinations for all courses will commence from the 12th December 2026. Detailed schedules will be available soon. Early bird course registration for the Spring 2027 semester is now open for all continuing students.' },
  { id: 2, title: 'Faculty Workshop', date: '10 Apr 2026', body: 'A hands-on faculty workshop on integrating technology in classrooms was held on 10th April. All department heads ensured participation from their teams.' },
  { id: 3, title: 'Library Maintenance', date: '5 Apr 2026', body: 'The central library remained closed on 5th April for scheduled maintenance and system upgrades. Digital library services continued to be accessible online.' },
  { id: 4, title: 'Scholarship Applications Open', date: '8 Apr 2026', body: 'Applications for the Merit-Based Scholarship Program for the academic year 2026-27 are now open. Eligible students with a CGPA of 8.5 and above may apply through the student portal.' },
  { id: 5, title: 'Campus Placement Drive', date: '1 Apr 2026', body: 'A campus placement drive by leading tech companies including TCS, Infosys, and Wipro was held on 1st April. Over 120 students received offers across various roles.' },
  { id: 6, title: 'Annual Cultural Fest', date: '28 Mar 2026', body: 'The annual cultural fest "Utsav 2026" was a grand success. Over 500 students participated across 30 events including dance, drama, music, and art.' },
];

/* ── Helpers ── */
export const parseNoticeDate = (str) => {
  const parts = str.split(' ');
  if (parts.length !== 3) return new Date(str);
  const day = parseInt(parts[0], 10);
  const monthIdx = MONTH_SHORT.indexOf(parts[1]);
  const year = parseInt(parts[2], 10);
  if (monthIdx === -1 || isNaN(day) || isNaN(year)) return new Date(str);
  return new Date(year, monthIdx, day);
};

export const buildCalendar = (year, month) => {
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

export const formatHeaderDate = () => {
  const n = new Date();
  let hours = n.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const mins = n.getMinutes().toString().padStart(2, '0');
  return `${WEEKDAYS[n.getDay()]}, ${n.getDate()} ${MONTH_NAMES[n.getMonth()]} • ${hours}:${mins} ${ampm}`;
};
