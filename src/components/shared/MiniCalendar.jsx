import { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { MONTH_NAMES, MONTH_SHORT, buildCalendar } from '../../data/dashboardData';

/**
 * MiniCalendar — reusable calendar widget used across multiple dashboard pages.
 * Props:
 *   highlightDates  — array of date strings ("D Mon YYYY") to dot-mark
 *   onSelectDate    — called with the selected dateStr (or null to deselect)
 *   showFilterBadge — if true, shows a "Filtering: X" badge when a date is selected
 *   initialMonth    — optional: start month (0-indexed, defaults to now)
 *   initialYear     — optional: start year (defaults to now)
 */
export default function MiniCalendar({ highlightDates = [], onSelectDate, showFilterBadge = false }) {
  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear,  setCalYear]  = useState(now.getFullYear());
  const [selected, setSelected] = useState(null);

  const calGrid = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth]);

  const prevMonth = () => {
    setSelected(null); onSelectDate?.(null);
    calMonth === 0 ? (setCalMonth(11), setCalYear(y => y - 1)) : setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    setSelected(null); onSelectDate?.(null);
    calMonth === 11 ? (setCalMonth(0), setCalYear(y => y + 1)) : setCalMonth(m => m + 1);
  };
  const handleDayClick = (day) => {
    if (!day) return;
    const s = `${day} ${MONTH_SHORT[calMonth]} ${calYear}`;
    const next = selected === s ? null : s;
    setSelected(next);
    onSelectDate?.(next);
  };

  return (
    <div className="d-cal">
      <div className="d-cal-hd">
        <button className="d-cal-arrow" onClick={prevMonth}><FiChevronLeft /></button>
        <span>{MONTH_NAMES[calMonth]} {calYear}</span>
        <button className="d-cal-arrow" onClick={nextMonth}><FiChevronRight /></button>
      </div>

      {showFilterBadge && selected && (
        <div className="d-cal-filter-badge">
          Filtering: <strong>{selected}</strong>
          <button onClick={() => handleDayClick(null)} className="d-cal-clear"><FiX /></button>
        </div>
      )}

      <table className="d-cal-tbl">
        <thead>
          <tr>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <th key={d}>{d}</th>)}</tr>
        </thead>
        <tbody>
          {calGrid.map((wk, wi) => (
            <tr key={wi}>
              {wk.map((day, di) => {
                const live = new Date();
                const isToday = day === live.getDate() && calMonth === live.getMonth() && calYear === live.getFullYear();
                const dateStr = day ? `${day} ${MONTH_SHORT[calMonth]} ${calYear}` : null;
                const isSelected = selected && dateStr === selected;
                const hasHighlight = day && highlightDates.includes(dateStr);
                let cls = day == null ? 'empty' : isSelected ? 'selected' : isToday ? 'today' : '';
                if (hasHighlight) cls += ' has-notice';
                return (
                  <td key={di} className={cls}
                    onClick={() => handleDayClick(day)}
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
  );
}
