import { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout';
import { MONTH_NAMES, MONTH_SHORT, WEEKLY_SCHEDULE, EVENTS, DEFAULT_NOTICES, buildCalendar } from '../../data/dashboardData';

const NOW = new Date();

export default function DashboardHome() {
  const liveInst = new Date();
  const todaySchedule = WEEKLY_SCHEDULE[liveInst.getDay()] || [];
  const curMin = liveInst.getHours() * 60 + liveInst.getMinutes();

  const getSlotStatus = (timeStr) => {
    const m = timeStr.match(/(\d{2}):(\d{2})\s*[–-]\s*(\d{2}):(\d{2})/);
    if (!m) return 'upcoming';
    const start = parseInt(m[1]) * 60 + parseInt(m[2]);
    const end   = parseInt(m[3]) * 60 + parseInt(m[4]);
    if (curMin >= start && curMin <= end) return 'ongoing';
    if (curMin > end) return 'completed';
    return 'upcoming';
  };

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Upload Algorithm Grades', date: 'Due: Tomorrow, 5:00 PM', info: 'Finalize and upload mid-sem marks for 3rd Year, Sec 1.', completed: false },
    { id: 2, title: 'Review DBMS Assignments', date: `Due: 10 Nov, ${NOW.getFullYear()}`, info: 'Check remaining 15 assignments for 3rd Year, Sec 1.', completed: false },
    { id: 3, title: 'Create Java Lab Test', date: `Due: 12 Nov, ${NOW.getFullYear()}`, info: 'Prepare 3 coding questions for the upcoming lab test.', completed: false },
  ]);
  const toggle = (id) => setTasks(p => p.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const [calMonth, setCalMonth] = useState(NOW.getMonth());
  const [calYear, setCalYear]   = useState(NOW.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const calGrid = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth]);
  const prevMonth = () => { setSelectedDate(null); calMonth === 0 ? (setCalMonth(11), setCalYear(y => y - 1)) : setCalMonth(m => m - 1); };
  const nextMonth = () => { setSelectedDate(null); calMonth === 11 ? (setCalMonth(0), setCalYear(y => y + 1)) : setCalMonth(m => m + 1); };

  const statusCls = { ongoing: 'd-sched-ongoing', completed: 'd-sched-completed', upcoming: 'd-sched-upcoming' };
  const typeCls   = { lecture: 'd-type-lecture', lab: 'd-type-lab', tutorial: 'd-type-tutorial', break: 'd-type-break' };

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
          <thead><tr>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <th key={d}>{d}</th>)}</tr></thead>
          <tbody>
            {calGrid.map((wk, wi) => (
              <tr key={wi}>
                {wk.map((day, di) => {
                  const live = new Date();
                  const isToday = day === live.getDate() && calMonth === live.getMonth() && calYear === live.getFullYear();
                  const dateStr = day ? `${day} ${MONTH_SHORT[calMonth]} ${calYear}` : null;
                  const isSelected = selectedDate && dateStr === selectedDate;
                  const hasNotice = day && DEFAULT_NOTICES.some(n => n.date === dateStr);
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
      <div className="d-events">
        <div className="d-sec-head">
          <h3>Events</h3>
          <span className="d-link">View All</span>
        </div>
        {EVENTS.map((e, i) => (
          <div key={i} className="d-ev-card">
            <div className="d-ev-row">
              <h4>{e.title}</h4>
              <span>{e.date}</span>
            </div>
            <p>{e.desc}</p>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <DashboardLayout activeTab="dashboard" rightPanel={rightPanel}>
      <>
        {/* Daily Schedule */}
        <div className="d-schedule">
          <div style={{ width: '100%' }}>
            <h2>Daily Schedule</h2>
            {todaySchedule.length > 0 ? (
              <div className="d-sched-slider">
                <button className="d-sched-arrow" onClick={() => { const el = document.querySelector('.d-sched-track'); if (el) el.scrollBy({ left: -220, behavior: 'smooth' }); }}>‹</button>
                <div className="d-sched-track">
                  {todaySchedule.map((slot, i) => {
                    const status = getSlotStatus(slot.time);
                    const isBreak = slot.type === 'Break';
                    return (
                      <div key={i} className={`d-sched-card ${statusCls[status]} ${isBreak ? 'd-sched-break' : ''}`}>
                        {status === 'ongoing' && <span className="d-sched-now">NOW</span>}
                        <span className="d-sched-time">{slot.time}</span>
                        <span className="d-sched-subj">{slot.subject}</span>
                        {slot.code && <span className="d-sched-code">{slot.code}</span>}
                        <span className="d-sched-room">📍 {slot.room}</span>
                        <span className={`d-sched-type ${typeCls[slot.type.toLowerCase()] || ''}`}>{slot.type}</span>
                      </div>
                    );
                  })}
                </div>
                <button className="d-sched-arrow" onClick={() => { const el = document.querySelector('.d-sched-track'); if (el) el.scrollBy({ left: 220, behavior: 'smooth' }); }}>›</button>
              </div>
            ) : <p className="d-sched-empty">🎉 No classes today!</p>}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="d-tasks">
          <div className="d-sec-head">
            <h3>Upcoming Tasks</h3>
            <span className="d-link">View All</span>
          </div>
          <div className="d-tasks-grid">
            {tasks.map(t => (
              <div key={t.id} className={`d-task-card ${t.completed ? 'd-task-card-done' : ''}`} onClick={() => toggle(t.id)}>
                <div className="d-task-inner">
                  <div className="d-task-check">
                    {t.completed
                      ? <div className="d-check-done">✓</div>
                      : <div className="d-check-open" />}
                  </div>
                  <div>
                    <h4>{t.title}</h4>
                    <p className="d-task-date">{t.date}</p>
                    <p className="d-task-info">{t.info}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}
