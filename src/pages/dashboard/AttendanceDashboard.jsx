import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import MiniCalendar    from '../../components/shared/MiniCalendar';
import {
  AttendanceOverviewCard, LeaveBreakdownCard,
  BiometricLogsCard, DailyAttendanceLog, ApplyLeaveModal,
} from '../../components/attendanceDashboard/AttendanceDashboardComponents';
import {
  OVERVIEW_DATA_FILTERS, LEAVE_BREAKDOWN, DAILY_ATTENDANCE,
  BIOMETRIC_LOGS, MONTH_SHORT, D0,
} from '../../data/dashboardData';

export default function AttendanceDashboard() {
  const [overviewFilter,   setOverviewFilter]   = useState('Yearly');
  const [attOverview,      setAttOverview]      = useState(OVERVIEW_DATA_FILTERS['Yearly']);
  const [leaveBreakdown,   setLeaveBreakdown]   = useState(LEAVE_BREAKDOWN);
  const [dailyAttendance,  setDailyAttendance]  = useState(DAILY_ATTENDANCE);
  const [attFilter,        setAttFilter]        = useState('All');
  const [showLeaveModal,   setShowLeaveModal]   = useState(false);
  const [newLeave,         setNewLeave]         = useState({ type: 'Casual', from: '', to: '', reason: '' });
  const [selectedBioDate,  setSelectedBioDate]  = useState(D0);

  const handleOverviewFilterChange = (filter) => {
    setOverviewFilter(filter);
    setAttOverview(OVERVIEW_DATA_FILTERS[filter]);
  };

  const filteredAttendance = useMemo(() => {
    if (attFilter === 'All') return dailyAttendance;
    return dailyAttendance.filter(a => a.status.toLowerCase().includes(attFilter.toLowerCase()));
  }, [attFilter, dailyAttendance]);

  const handleApplyLeave = () => {
    if (!newLeave.from || !newLeave.reason) return;
    setAttOverview(prev => ({ ...prev, present: Math.max(0, prev.present - 1), onLeave: prev.onLeave + 1 }));
    const lType = newLeave.type.toLowerCase();
    setLeaveBreakdown(prev => ({ ...prev, [lType]: { ...prev[lType], used: prev[lType].used + 1 } }));
    const d = new Date(newLeave.from);
    let dateStr = newLeave.from;
    if (!isNaN(d)) {
      dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      if (dateStr.match(/^\d /)) dateStr = dateStr.replace(/^(\d) /, '$1th ');
      else if (dateStr.match(/^\d\d /)) dateStr = dateStr.replace(/^(\d\d) /, '$1th ');
    }
    setDailyAttendance(prev => [{ id: Date.now(), date: dateStr, status: `On Leave - ${newLeave.type}`, timeIn: '-', timeOut: '-', leaveReason: newLeave.reason, starred: false }, ...prev]);
    setNewLeave({ type: 'Casual', from: '', to: '', reason: '' });
    setShowLeaveModal(false);
  };

  const handleToggleStar = (id) => setDailyAttendance(prev => prev.map(a => a.id === id ? { ...a, starred: !a.starred } : a));

  /* Calendar highlight: mark days by attendance status */
  const calHighlights = dailyAttendance.map(a => a.date);

  return (
    <DashboardLayout activeTab="attendance" fullWidth>
      <div className="att-grid">
        <AttendanceOverviewCard
          attOverview={attOverview}
          overviewFilter={overviewFilter}
          onFilterChange={handleOverviewFilterChange}
        />
        <LeaveBreakdownCard
          leaveBreakdown={leaveBreakdown}
          onApplyLeave={() => setShowLeaveModal(true)}
        />
        <MiniCalendar highlightDates={calHighlights} />
        <BiometricLogsCard
          selectedBioDate={selectedBioDate}
          biometricLogs={BIOMETRIC_LOGS}
        />
        <DailyAttendanceLog
          filteredAttendance={filteredAttendance}
          selectedBioDate={selectedBioDate}
          attFilter={attFilter}
          setAttFilter={setAttFilter}
          onRowClick={setSelectedBioDate}
          onToggleStar={handleToggleStar}
        />
      </div>

      {showLeaveModal && (
        <ApplyLeaveModal
          newLeave={newLeave}
          setNewLeave={setNewLeave}
          onSubmit={handleApplyLeave}
          onClose={() => setShowLeaveModal(false)}
        />
      )}
    </DashboardLayout>
  );
}
