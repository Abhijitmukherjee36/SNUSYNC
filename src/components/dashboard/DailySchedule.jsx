import { useState } from 'react';
import { WEEKLY_SCHEDULE } from '../../data/dashboardData';

const statusCls      = { ongoing: 'd-sched-ongoing', completed: 'd-sched-completed', upcoming: 'd-sched-upcoming' };
const statusLabel    = { ongoing: '▶ In Progress', completed: '✓ Done', upcoming: '○ Pending' };
const statusBadgeCls = { ongoing: 'd-sched-status-ongoing', completed: 'd-sched-status-completed', upcoming: 'd-sched-status-upcoming' };
const typeCls        = { lecture: 'd-type-lecture', lab: 'd-type-lab', tutorial: 'd-type-tutorial', break: 'd-type-break' };

/**
 * DailySchedule — today's timetable slider with status auto-detection and manual cycling.
 */
export default function DailySchedule() {
  const liveInst     = new Date();
  const todaySchedule = WEEKLY_SCHEDULE[liveInst.getDay()] || [];
  const curMin       = liveInst.getHours() * 60 + liveInst.getMinutes();

  const getAutoStatus = (timeStr) => {
    const m = timeStr.match(/(\d{2}):(\d{2})\s*[–-]\s*(\d{2}):(\d{2})/);
    if (!m) return 'upcoming';
    const start = parseInt(m[1]) * 60 + parseInt(m[2]);
    const end   = parseInt(m[3]) * 60 + parseInt(m[4]);
    if (curMin >= start && curMin <= end) return 'ongoing';
    if (curMin > end)                     return 'completed';
    return 'upcoming';
  };

  const [schedOverrides, setSchedOverrides] = useState({});
  const getSlotStatus = (idx, timeStr) => schedOverrides[idx] ?? getAutoStatus(timeStr);
  const cycleStatus = (idx) => {
    const order = ['upcoming', 'ongoing', 'completed'];
    setSchedOverrides(p => {
      const cur  = p[idx] ?? getAutoStatus(todaySchedule[idx].time);
      const next = order[(order.indexOf(cur) + 1) % order.length];
      return { ...p, [idx]: next };
    });
  };

  const scrollTrack = (dir) => {
    const el = document.querySelector('.d-sched-track');
    if (el) el.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };

  return (
    <div className="d-schedule">
      <div style={{ width: '100%' }}>
        <h2>Daily Schedule</h2>
        {todaySchedule.length > 0 ? (
          <div className="d-sched-slider">
            <button className="d-sched-arrow" onClick={() => scrollTrack(-1)}>‹</button>
            <div className="d-sched-track">
              {todaySchedule
                .map((slot, i) => ({ slot, origIdx: i }))
                .sort((a, b) => {
                  const order = { ongoing: 0, upcoming: 1, completed: 2 };
                  return (order[getSlotStatus(a.origIdx, a.slot.time)] ?? 1)
                       - (order[getSlotStatus(b.origIdx, b.slot.time)] ?? 1);
                })
                .map(({ slot, origIdx }) => {
                  const status  = getSlotStatus(origIdx, slot.time);
                  const isBreak = slot.type === 'Break';
                  return (
                    <div key={origIdx} className={`d-sched-card ${statusCls[status]} ${isBreak ? 'd-sched-break' : ''}`}>
                      {status === 'ongoing' && <span className="d-sched-now">LIVE</span>}
                      <span className="d-sched-time">{slot.time}</span>
                      <span className="d-sched-subj">{slot.subject}</span>
                      {slot.code && <span className="d-sched-code">{slot.code}</span>}
                      <span className="d-sched-room">📍 {slot.room}</span>
                      <span className={`d-sched-type ${typeCls[slot.type.toLowerCase()] || ''}`}>{slot.type}</span>
                      {!isBreak && (
                        <button
                          className={`d-sched-status ${statusBadgeCls[status]}`}
                          onClick={() => cycleStatus(origIdx)}
                        >
                          {statusLabel[status]}
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
            <button className="d-sched-arrow" onClick={() => scrollTrack(1)}>›</button>
          </div>
        ) : <p className="d-sched-empty">🎉 No classes today!</p>}
      </div>
    </div>
  );
}
