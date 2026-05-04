import { useState, useMemo } from 'react';
import { FiSearch, FiPlusCircle, FiX, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout';
import { DEFAULT_NOTICES, parseNoticeDate, buildCalendar, MONTH_NAMES, MONTH_SHORT } from '../../data/dashboardData';

const NOW = new Date();

export default function NoticePage() {
  /* ── Notice state ── */
  const [notices, setNotices] = useState(DEFAULT_NOTICES);
  const [noticeSearch, setNoticeSearch] = useState('');
  const [expandedNotice, setExpandedNotice] = useState(null);
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', body: '' });
  const [showAllNotices, setShowAllNotices] = useState(false);

  /* ── Calendar state ── */
  const [calMonth, setCalMonth] = useState(NOW.getMonth());
  const [calYear, setCalYear] = useState(NOW.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const calGrid = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth]);
  const prevMonth = () => { setSelectedDate(null); calMonth === 0 ? (setCalMonth(11), setCalYear(y => y - 1)) : setCalMonth(m => m - 1); };
  const nextMonth = () => { setSelectedDate(null); calMonth === 11 ? (setCalMonth(0), setCalYear(y => y + 1)) : setCalMonth(m => m + 1); };

  /* ── Filtered notices ── */
  const filteredNotices = useMemo(() => {
    let list = [...notices].sort((a, b) => parseNoticeDate(b.date) - parseNoticeDate(a.date));
    if (noticeSearch.trim()) { const q = noticeSearch.toLowerCase(); list = list.filter(n => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)); }
    if (selectedDate) list = list.filter(n => n.date === selectedDate);
    return list;
  }, [notices, noticeSearch, selectedDate]);

  const displayedNotices = showAllNotices ? filteredNotices : filteredNotices.slice(0, 2);
  const hasMoreNotices = filteredNotices.length > 2;

  const handleAddNotice = () => {
    if (!newNotice.title.trim() || !newNotice.body.trim()) return;
    const today = new Date();
    const dateStr = `${today.getDate()} ${MONTH_SHORT[today.getMonth()]} ${today.getFullYear()}`;
    setNotices(prev => [{ id: Date.now(), title: newNotice.title, date: dateStr, body: newNotice.body }, ...prev]);
    setNewNotice({ title: '', body: '' });
    setShowAddNotice(false);
  };

  /* ── Right panel: Calendar (with date filter) + Add Notice button ── */
  const rightPanel = (
    <>
      {/* Functional Calendar with notice-date highlighting and date filter */}
      <div className="d-cal">
        <div className="d-cal-hd">
          <button className="d-cal-arrow" onClick={prevMonth}><FiChevronLeft /></button>
          <span>{MONTH_NAMES[calMonth]} {calYear}</span>
          <button className="d-cal-arrow" onClick={nextMonth}><FiChevronRight /></button>
        </div>
        {selectedDate && (
          <div className="d-cal-filter-badge">
            Filtering: <strong>{selectedDate}</strong>
            <button onClick={() => setSelectedDate(null)} className="d-cal-clear"><FiX /></button>
          </div>
        )}
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
                  const hasNotice = day && notices.some(n => n.date === dateStr);
                  const cls = day == null ? 'empty' : isSelected ? 'selected' : isToday ? 'today' : '';
                  return (
                    <td key={di}
                      className={cls + (hasNotice ? ' has-notice' : '')}
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

      {/* Quick Actions */}
      <div className="n-quick-actions">
        <h3 className="n-qa-title">Quick Actions</h3>
        <button className="n-add-notice-btn" onClick={() => setShowAddNotice(true)}>
          <FiPlusCircle className="n-add-icon" /> Add Notice
        </button>
      </div>
    </>
  );

  return (
    <DashboardLayout activeTab="notice" rightPanel={rightPanel}>
      <>
        <h2 className="n-title">Notice</h2>
        <p className="n-subtitle">Keep Updated with the latest university announcements</p>

        <div className="n-search-row">
          <div className="n-search-bar">
            <FiSearch className="n-search-icon" />
            <input type="text" placeholder="Search by Keyword" className="n-search-input" value={noticeSearch} onChange={e => setNoticeSearch(e.target.value)} />
          </div>
          {hasMoreNotices && (
            <span className="d-link n-view-all" onClick={() => setShowAllNotices(p => !p)}>
              {showAllNotices ? 'Show Less' : `View All (${filteredNotices.length})`}
            </span>
          )}
        </div>

        <div className="n-list">
          {displayedNotices.length > 0 ? displayedNotices.map(n => {
            const isExpanded = expandedNotice === n.id;
            const preview = n.body.length > 200 ? n.body.slice(0, 200) : n.body;
            return (
              <div key={n.id} className="n-card">
                <div className="n-card-head">
                  <h3 className="n-card-title">{n.title}</h3>
                  <div className="n-card-actions">
                    <span className="n-card-date">{n.date}</span>
                    <button className="n-delete-btn" onClick={() => setNotices(prev => prev.filter(x => x.id !== n.id))} title="Delete Notice">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <p className="n-card-body">
                  {isExpanded ? n.body : preview}
                  {n.body.length > 200 && (
                    <span className="n-read-more" onClick={() => setExpandedNotice(isExpanded ? null : n.id)}>
                      {isExpanded ? '  Show Less' : '  ....Read More'}
                    </span>
                  )}
                </p>
              </div>
            );
          }) : <p className="n-no-data">No notices found.</p>}
        </div>

        {!showAllNotices && hasMoreNotices && (
          <p className="n-showing-count">Showing {displayedNotices.length} of {filteredNotices.length} notices</p>
        )}

        {/* ADD NOTICE MODAL */}
        {showAddNotice && (
          <div className="n-modal-overlay" onClick={() => setShowAddNotice(false)}>
            <div className="n-modal" onClick={e => e.stopPropagation()}>
              <div className="n-modal-header">
                <h3>Add New Notice</h3>
                <button className="n-modal-close" onClick={() => setShowAddNotice(false)}><FiX /></button>
              </div>
              <div className="n-modal-body">
                <div className="n-form-field"><label>Notice Title</label><input type="text" placeholder="Enter notice title" value={newNotice.title} onChange={e => setNewNotice(p => ({ ...p, title: e.target.value }))} /></div>
                <div className="n-form-field"><label>Notice Content</label><textarea placeholder="Enter notice content..." rows={5} value={newNotice.body} onChange={e => setNewNotice(p => ({ ...p, body: e.target.value }))} /></div>
              </div>
              <div className="n-modal-footer">
                <button className="n-modal-cancel" onClick={() => setShowAddNotice(false)}>Cancel</button>
                <button className="n-modal-submit" onClick={handleAddNotice}>Publish Notice</button>
              </div>
            </div>
          </div>
        )}
      </>
    </DashboardLayout>
  );
}
