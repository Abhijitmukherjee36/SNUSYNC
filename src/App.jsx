import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AttendancePage from './pages/Attendance';

import DashboardHome       from './pages/dashboard/DashboardHome';
import StudentsPage        from './pages/dashboard/StudentsPage';
import AssignmentsPage     from './pages/dashboard/AssignmentsPage';
import SubjectsPage        from './pages/dashboard/SubjectsPage';
import AttendanceDashboard from './pages/dashboard/AttendanceDashboard';
import NoticePage          from './pages/dashboard/NoticePage';
import ExamPage            from './pages/dashboard/ExamPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard pages — each section is its own page/route */}
        <Route path="/dashboard"             element={<DashboardHome />} />
        <Route path="/dashboard/students"    element={<StudentsPage />} />
        <Route path="/dashboard/assignments" element={<AssignmentsPage />} />
        <Route path="/dashboard/subjects"    element={<SubjectsPage />} />
        <Route path="/dashboard/attendance"  element={<AttendanceDashboard />} />
        <Route path="/dashboard/notice"      element={<NoticePage />} />
        <Route path="/dashboard/exam"        element={<ExamPage />} />

        {/* Full attendance details page */}
        <Route path="/attendance" element={<AttendancePage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
