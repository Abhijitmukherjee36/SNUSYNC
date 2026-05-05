import { useState, useMemo } from 'react';
import { FiSearch, FiPlusCircle } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout';
import MiniCalendar   from '../../components/shared/MiniCalendar';
import NoticeCard     from '../../components/notice/NoticeCard';
import AddNoticeModal from '../../components/notice/AddNoticeModal';
import { DEFAULT_NOTICES, parseNoticeDate, MONTH_SHORT } from '../../data/dashboardData';

export default function NoticePage() {
  const [notices,         setNotices]         = useState(DEFAULT_NOTICES);
  const [noticeSearch,    setNoticeSearch]     = useState('');
  const [expandedNotice,  setExpandedNotice]   = useState(null);
  const [showAddNotice,   setShowAddNotice]    = useState(false);
  const [newNotice,       setNewNotice]        = useState({ title: '', body: '' });
  const [showAllNotices,  setShowAllNotices]   = useState(false);
  const [selectedDate,    setSelectedDate]     = useState(null);

  const filteredNotices = useMemo(() => {
    let list = [...notices].sort((a, b) => parseNoticeDate(b.date) - parseNoticeDate(a.date));
    if (noticeSearch.trim()) {
      const q = noticeSearch.toLowerCase();
      list = list.filter(n => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q));
    }
    if (selectedDate) list = list.filter(n => n.date === selectedDate);
    return list;
  }, [notices, noticeSearch, selectedDate]);

  const displayedNotices = showAllNotices ? filteredNotices : filteredNotices.slice(0, 2);
  const hasMoreNotices   = filteredNotices.length > 2;

  const handleAddNotice = () => {
    if (!newNotice.title.trim() || !newNotice.body.trim()) return;
    const today = new Date();
    const dateStr = `${today.getDate()} ${MONTH_SHORT[today.getMonth()]} ${today.getFullYear()}`;
    setNotices(prev => [{ id: Date.now(), title: newNotice.title, date: dateStr, body: newNotice.body }, ...prev]);
    setNewNotice({ title: '', body: '' });
    setShowAddNotice(false);
  };

  const handleDelete = (id) => setNotices(prev => prev.filter(n => n.id !== id));

  /* ── Right panel ── */
  const noticeDates = notices.map(n => n.date);
  const rightPanel = (
    <>
      <MiniCalendar
        highlightDates={noticeDates}
        onSelectDate={setSelectedDate}
        showFilterBadge
      />
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
            <input type="text" placeholder="Search by Keyword" className="n-search-input"
              value={noticeSearch} onChange={e => setNoticeSearch(e.target.value)} />
          </div>
          {hasMoreNotices && (
            <span className="d-link n-view-all" onClick={() => setShowAllNotices(p => !p)}>
              {showAllNotices ? 'Show Less' : `View All (${filteredNotices.length})`}
            </span>
          )}
        </div>

        <div className="n-list">
          {displayedNotices.length > 0 ? displayedNotices.map(n => (
            <NoticeCard
              key={n.id}
              notice={n}
              isExpanded={expandedNotice === n.id}
              onToggleExpand={() => setExpandedNotice(expandedNotice === n.id ? null : n.id)}
              onDelete={handleDelete}
            />
          )) : <p className="n-no-data">No notices found.</p>}
        </div>

        {!showAllNotices && hasMoreNotices && (
          <p className="n-showing-count">Showing {displayedNotices.length} of {filteredNotices.length} notices</p>
        )}

        {showAddNotice && (
          <AddNoticeModal
            newNotice={newNotice}
            setNewNotice={setNewNotice}
            onSubmit={handleAddNotice}
            onClose={() => setShowAddNotice(false)}
          />
        )}
      </>
    </DashboardLayout>
  );
}
