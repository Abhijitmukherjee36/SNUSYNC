import { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout';
import { MONTH_NAMES, MONTH_SHORT, DEFAULT_NOTICES, buildCalendar } from '../../data/dashboardData';

import DailySchedule  from '../../components/dashboard/DailySchedule';
import UpcomingTasks  from '../../components/dashboard/UpcomingTasks';
import EventsPanel    from '../../components/dashboard/EventsPanel';

const NOW = new Date();

export default function DashboardHome() {
  /* ── Calendar state ── */
  const [calMonth,    setCalMonth]    = useState(NOW.getMonth());
  const [calYear,     setCalYear]     = useState(NOW.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const calGrid = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth]);

  const prevMonth = () => {
    setSelectedDate(null);
    calMonth === 0 ? (setCalMonth(11), setCalYear(y => y - 1)) : setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    setSelectedDate(null);
    calMonth === 11 ? (setCalMonth(0), setCalYear(y => y + 1)) : setCalMonth(m => m + 1);
  };

  /* ── Right panel: Calendar + Events ── */
  const rightPanel = (
    <>
      {/* Calendar */}
      <div className="d-cal">
        <div className="d-cal-hd">
          <button className="d-cal-arrow" onClick={prevMonth}><FiChevronLeft /></button>
          <span>{MONTH_NAMES[calMonth]} {calYear}</span>
          <button className="d-cal-arrow" onClick={nextMonth}><FiChevronRight /></button>
        </div>
        <table className="d-cal-tbl">
          <thead>
            <tr>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <th key={d}>{d}</th>)}</tr>
          </thead>
          <tbody>
            {calGrid.map((wk, wi) => (
              <tr key={wi}>
                {wk.map((day, di) => {
                  const live = new Date();
                  const isToday    = day === live.getDate() && calMonth === live.getMonth() && calYear === live.getFullYear();
                  const dateStr    = day ? `${day} ${MONTH_SHORT[calMonth]} ${calYear}` : null;
                  const isSelected = selectedDate && dateStr === selectedDate;
                  const hasNotice  = day && DEFAULT_NOTICES.some(n => n.date === dateStr);
                  let cls = day == null ? 'empty' : isSelected ? 'selected' : isToday ? 'today' : '';
                  if (hasNotice) cls += ' has-notice';
                  return (
                    <td key={di} className={cls}
                      onClick={() => { if (!day) return; const s = `${day} ${MONTH_SHORT[calMonth]} ${calYear}`; setSelectedDate(p => p === s ? null : s); }}
                      style={day ? { cursor: 'pointer' } : {}}>
                      {day}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Events */}
      <EventsPanel />
    </>
  );

  return (
    <DashboardLayout activeTab="dashboard" rightPanel={rightPanel}>
      <>
        <DailySchedule />
        <UpcomingTasks />
      </>
    </DashboardLayout>
  );
}
