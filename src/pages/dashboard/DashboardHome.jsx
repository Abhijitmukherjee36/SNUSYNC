import { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight, FiX, FiMapPin, FiClock } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout';
import { MONTH_NAMES, MONTH_SHORT, WEEKLY_SCHEDULE, EVENTS, DEFAULT_TASKS, DEFAULT_NOTICES, buildCalendar } from '../../data/dashboardData';

const NOW = new Date();

export default function DashboardHome() {
  const liveInst = new Date();
  const todaySchedule = WEEKLY_SCHEDULE[liveInst.getDay()] || [];
  const curMin = liveInst.getHours() * 60 + liveInst.getMinutes();

  /* ── Auto-detect schedule slot status ── */
  const getAutoStatus = (timeStr) => {
    const m = timeStr.match(/(\d{2}):(\d{2})\s*[–-]\s*(\d{2}):(\d{2})/);
    if (!m) return 'upcoming';
    const start = parseInt(m[1]) * 60 + parseInt(m[2]);
    const end   = parseInt(m[3]) * 60 + parseInt(m[4]);
    if (curMin >= start && curMin <= end) return 'ongoing';
    if (curMin > end) return 'completed';
    return 'upcoming';
  };

  /* ── Schedule state (user can override status) ── */
  const [schedOverrides, setSchedOverrides] = useState({});
  const getSlotStatus = (idx, timeStr) => schedOverrides[idx] ?? getAutoStatus(timeStr);
  const cycleStatus = (idx) => {
    const order = ['upcoming', 'ongoing', 'completed'];
    setSchedOverrides(p => {
      const cur = p[idx] ?? getAutoStatus(todaySchedule[idx].time);
      const next = order[(order.indexOf(cur) + 1) % order.length];
      return { ...p, [idx]: next };
    });
  };

  /* ── Tasks state ── */
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [tasksModalOpen, setTasksModalOpen] = useState(false);
  const toggleTask = (id) => setTasks(p => p.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  /* ── Events state ── */
  const [eventsModalOpen, setEventsModalOpen] = useState(false);

  /* ── Calendar ── */
  const [calMonth, setCalMonth] = useState(NOW.getMonth());
  const [calYear, setCalYear]   = useState(NOW.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const calGrid = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth]);
  const prevMonth = () => { setSelectedDate(null); calMonth === 0 ? (setCalMonth(11), setCalYear(y => y - 1)) : setCalMonth(m => m - 1); };
  const nextMonth = () => { setSelectedDate(null); calMonth === 11 ? (setCalMonth(0), setCalYear(y => y + 1)) : setCalMonth(m => m + 1); };

  /* ── Derived ── */
  const statusCls = { ongoing: 'd-sched-ongoing', completed: 'd-sched-completed', upcoming: 'd-sched-upcoming' };
  const statusLabel = { ongoing: '▶ In Progress', completed: '✓ Done', upcoming: '○ Pending' };
  const statusBadgeCls = { ongoing: 'd-sched-status-ongoing', completed: 'd-sched-status-completed', upcoming: 'd-sched-status-upcoming' };
  const typeCls = { lecture: 'd-type-lecture', lab: 'd-type-lab', tutorial: 'd-type-tutorial', break: 'd-type-break' };
  const priorityCls = { high: 'd-priority-high', medium: 'd-priority-medium', low: 'd-priority-low' };

  /* ── Right Panel ── */
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

      {/* Events (1 visible, enlarged) */}
      <div className="d-events">
        <div className="d-sec-head">
          <h3>Upcoming Event</h3>
          <span className="d-link" onClick={() => setEventsModalOpen(true)}>View All ({EVENTS.length})</span>
        </div>
        {EVENTS.slice(0, 1).map(e => (
          <div key={e.id} className="d-ev-card" style={{ padding: '16px 18px' }}>
            <div className="d-ev-row">
              <h4>{e.title}</h4>
              <span>{e.date}</span>
            </div>
            <p style={{ marginBottom: 8 }}>{e.desc}</p>
            <div style={{ display: 'flex', gap: 14, fontSize: 11.5, color: '#777', fontFamily: "'Inter',sans-serif" }}>
              {e.time && <span>🕐 {e.time}</span>}
              {e.venue && <span>📍 {e.venue}</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <DashboardLayout activeTab="dashboard" rightPanel={rightPanel}>
      <>
        {/* ═══ DAILY SCHEDULE ═══ */}
        <div className="d-schedule">
          <div style={{ width: '100%' }}>
            <h2>Daily Schedule</h2>
            {todaySchedule.length > 0 ? (
              <div className="d-sched-slider">
                <button className="d-sched-arrow" onClick={() => { const el = document.querySelector('.d-sched-track'); if (el) el.scrollBy({ left: -240, behavior: 'smooth' }); }}>‹</button>
                <div className="d-sched-track">
                  {todaySchedule
                    .map((slot, i) => ({ slot, origIdx: i }))
                    .sort((a, b) => {
                      const sa = getSlotStatus(a.origIdx, a.slot.time);
                      const sb = getSlotStatus(b.origIdx, b.slot.time);
                      const order = { ongoing: 0, upcoming: 1, completed: 2 };
                      return (order[sa] ?? 1) - (order[sb] ?? 1);
                    })
                    .map(({ slot, origIdx }) => {
                    const status = getSlotStatus(origIdx, slot.time);
                    const isBreak = slot.type === 'Break';
                    return (
                      <div key={origIdx} className={`d-sched-card ${statusCls[status]} ${isBreak ? 'd-sched-break' : ''}`}>
                        {status === 'ongoing' && <span className="d-sched-now">LIVE</span>}
                        <span className="d-sched-time">{slot.time}</span>
                        <span className="d-sched-subj">{slot.subject}</span>
                        {slot.code && <span className="d-sched-code">{slot.code}</span>}
                        <span className="d-sched-room">📍 {slot.room}</span>
                        <span className={`d-sched-type ${typeCls[slot.type.toLowerCase()] || ''}`}>{slot.type}</span>
                        {/* Clickable status toggle */}
                        {!isBreak && (
                          <button className={`d-sched-status ${statusBadgeCls[status]}`} onClick={() => cycleStatus(origIdx)}>
                            {statusLabel[status]}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button className="d-sched-arrow" onClick={() => { const el = document.querySelector('.d-sched-track'); if (el) el.scrollBy({ left: 240, behavior: 'smooth' }); }}>›</button>
              </div>
            ) : <p className="d-sched-empty">🎉 No classes today!</p>}
          </div>
        </div>

        {/* ═══ UPCOMING TASKS (2 visible) ═══ */}
        <div className="d-tasks">
          <div className="d-sec-head">
            <h3>Upcoming Tasks <span style={{ fontSize: 14, color: '#999', fontWeight: 400, fontFamily: 'Inter,sans-serif' }}>({pendingCount} pending, {completedCount} done)</span></h3>
            <span className="d-link" onClick={() => setTasksModalOpen(true)}>View All ({tasks.length})</span>
          </div>
          <div className="d-tasks-grid">
            {tasks.filter(t => !t.completed).slice(0, 2).map(t => (
              <div key={t.id} className="d-task-card" onClick={() => toggleTask(t.id)}>
                <div className="d-task-inner">
                  <div className="d-task-check">
                    <div className="d-check-open" />
                  </div>
                  <div>
                    <h4>{t.title} <span className={`d-priority ${priorityCls[t.priority]}`}>{t.priority}</span></h4>
                    <p className="d-task-date">{t.date}</p>
                    <p className="d-task-info">{t.info}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ TASKS VIEW ALL MODAL ═══ */}
        {tasksModalOpen && (
          <div className="d-viewall-overlay" onClick={() => setTasksModalOpen(false)}>
            <div className="d-viewall-modal" onClick={e => e.stopPropagation()}>
              <div className="d-viewall-header">
                <h3>All Tasks ({tasks.length})</h3>
                <button className="d-viewall-close" onClick={() => setTasksModalOpen(false)}><FiX /></button>
              </div>
              <div className="d-viewall-body">
                {tasks.map(t => (
                  <div key={t.id} className={`d-task-modal-card ${t.completed ? 'done' : ''}`} onClick={() => toggleTask(t.id)}>
                    <div className="d-task-check">
                      {t.completed
                        ? <div className="d-check-done">✓</div>
                        : <div className="d-check-open" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: '#1a1a2e', margin: '0 0 3px' }}>
                        {t.title} <span className={`d-priority ${priorityCls[t.priority]}`}>{t.priority}</span>
                      </h4>
                      <p style={{ fontSize: 12, color: '#888', margin: '0 0 4px' }}>{t.date}</p>
                      <p style={{ fontSize: 12.5, color: '#666', lineHeight: 1.5, margin: 0 }}>{t.info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ EVENTS VIEW ALL MODAL ═══ */}
        {eventsModalOpen && (
          <div className="d-viewall-overlay" onClick={() => setEventsModalOpen(false)}>
            <div className="d-viewall-modal" onClick={e => e.stopPropagation()}>
              <div className="d-viewall-header">
                <h3>All Events ({EVENTS.length})</h3>
                <button className="d-viewall-close" onClick={() => setEventsModalOpen(false)}><FiX /></button>
              </div>
              <div className="d-viewall-body">
                {EVENTS.map(e => (
                  <div key={e.id} className="d-ev-modal-card">
                    <h4 className="d-ev-modal-title">{e.title}</h4>
                    <div className="d-ev-modal-meta">
                      <span>📅 {e.date}</span>
                      {e.time && <span><FiClock style={{ verticalAlign: 'middle', marginRight: 3 }} />{e.time}</span>}
                      {e.venue && <span><FiMapPin style={{ verticalAlign: 'middle', marginRight: 3 }} />{e.venue}</span>}
                    </div>
                    <p className="d-ev-modal-desc">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    </DashboardLayout>
  );
}
