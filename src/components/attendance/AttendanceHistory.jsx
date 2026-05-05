import { useState, useMemo } from 'react';
import { HISTORY } from '../../data/attendanceData';

/**
 * AttendanceHistory — right panel of the Attendance page.
 * Handles: chip filter, date range filter, scrollable history table, summary card.
 */
export default function AttendanceHistory({ onRowClick }) {
  const [histChip, setHistChip] = useState('All');
  const [histFrom, setHistFrom] = useState('');
  const [histTo,   setHistTo]   = useState('');

  const filteredHistory = useMemo(() => {
    return HISTORY.filter(h => {
      const pct = Math.round((h.present / h.total) * 100);
      if (histChip === 'Perfect' && pct < 100) return false;
      if (histChip === 'High'    && pct < 80)  return false;
      if (histChip === 'Low'     && pct >= 80) return false;
      if (histFrom || histTo) {
        const parts = h.date.split(' ');
        const MMAP = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
        const hDate = new Date(Number(parts[2]), MMAP[parts[1]], Number(parts[0]));
        if (histFrom) { const f = new Date(histFrom); if (hDate < f) return false; }
        if (histTo)   { const t = new Date(histTo);   if (hDate > t) return false; }
      }
      return true;
    });
  }, [histChip, histFrom, histTo]);

  return (
    <div className="att-right">
      <h2>Previous Attendance Report</h2>

      {/* Stylish Filter Bar */}
      <div className="att-hist-filter">
        <span className="att-hist-filter-label">Filter</span>
        <div className="att-hist-chip-group">
          {['All', 'Perfect', 'High', 'Low'].map(chip => (
            <button
              key={chip}
              className={`att-hist-chip${histChip === chip ? ' active' : ''}`}
              onClick={() => setHistChip(chip)}
            >{chip}</button>
          ))}
        </div>
        <div className="att-hist-divider" />
        <input type="date" className="att-hist-date-input" title="From date"
          value={histFrom} onChange={e => setHistFrom(e.target.value)} />
        <input type="date" className="att-hist-date-input" title="To date"
          value={histTo} onChange={e => setHistTo(e.target.value)} />
        {(histChip !== 'All' || histFrom || histTo) && (
          <button className="att-hist-clear"
            onClick={() => { setHistChip('All'); setHistFrom(''); setHistTo(''); }}>
            Clear
          </button>
        )}
        <span className="att-hist-count">{filteredHistory.length}/{HISTORY.length}</span>
      </div>

      {/* Scrollable History Table */}
      <div className="att-history-wrap">
        <div className="att-history-scroll">
          <table className="att-history-table">
            <thead>
              <tr>
                <th>Date</th><th>Present</th><th>Absent</th><th>Total</th><th>%</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? filteredHistory.map((h, i) => (
                <tr key={i} className="att-history-row" onClick={() => onRowClick(h)}>
                  <td className="att-date-link">{h.date}</td>
                  <td className="att-h-present">{h.present}</td>
                  <td className="att-h-absent">{h.absent}</td>
                  <td>{h.total}</td>
                  <td>
                    <div className="att-pct-cell">
                      <div className="att-pct-bar">
                        <div className="att-pct-fill" style={{ width: `${Math.round((h.present / h.total) * 100)}%` }} />
                      </div>
                      <span className="att-pct-text">{Math.round((h.present / h.total) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} style={{ textAlign:'center', padding:'20px', color:'#bbb', fontFamily:'Inter,sans-serif', fontSize:12 }}>
                    No records match the filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overall Summary Card */}
      <div className="att-summary-card">
        <h3>Overall Summary</h3>
        <div className="att-summary-grid">
          <div className="att-sum-item">
            <span className="att-sum-num">{HISTORY.length}</span>
            <span className="att-sum-label">Total Classes</span>
          </div>
          <div className="att-sum-item">
            <span className="att-sum-num">
              {Math.round(HISTORY.reduce((a, h) => a + (h.present / h.total) * 100, 0) / HISTORY.length)}%
            </span>
            <span className="att-sum-label">Avg Attendance</span>
          </div>
          <div className="att-sum-item">
            <span className="att-sum-num">{Math.max(...HISTORY.map(h => h.present))}</span>
            <span className="att-sum-label">Best Day</span>
          </div>
          <div className="att-sum-item">
            <span className="att-sum-num">{Math.max(...HISTORY.map(h => h.absent))}</span>
            <span className="att-sum-label">Max Absent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
