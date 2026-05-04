import { useState, useMemo } from 'react';
import { FiSearch, FiPlusCircle, FiX, FiPaperclip, FiUpload, FiDownload, FiSend, FiAlertCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout';
import { DEFAULT_ASSIGNMENTS, SUBJECTS_LIST, generateStudents, MONTH_NAMES, MONTH_SHORT, DEFAULT_NOTICES, buildCalendar } from '../../data/dashboardData';

const NOW = new Date();

export default function AssignmentsPage() {
  /* ── Assignment state ── */
  const [assignments, setAssignments] = useState(DEFAULT_ASSIGNMENTS);
  const [assignSearch, setAssignSearch] = useState('');
  const [showAllAssign, setShowAllAssign] = useState(false);
  const [showAddAssign, setShowAddAssign] = useState(false);
  const [showUnsubmitted, setShowUnsubmitted] = useState(null);
  const [reminderSent, setReminderSent] = useState(null);
  const [newAssign, setNewAssign] = useState({ title: '', subject: SUBJECTS_LIST[0], section: '6th Sem, Sec 1', dueDate: '', total: '' });
  const [assignFile, setAssignFile] = useState(null);
  const [viewAttachment, setViewAttachment] = useState(null);
  const [viewStatus, setViewStatus] = useState(null);
  const [statusTab, setStatusTab] = useState('submitted');
  const [expandedUnsub, setExpandedUnsub] = useState(null);

  /* ── Calendar state ── */
  const [calMonth, setCalMonth] = useState(NOW.getMonth());
  const [calYear, setCalYear] = useState(NOW.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const calGrid = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth]);
  const prevMonth = () => { setSelectedDate(null); calMonth === 0 ? (setCalMonth(11), setCalYear(y => y - 1)) : setCalMonth(m => m - 1); };
  const nextMonth = () => { setSelectedDate(null); calMonth === 11 ? (setCalMonth(0), setCalYear(y => y + 1)) : setCalMonth(m => m + 1); };

  /* ── Filtered assignments ── */
  const filteredAssignments = useMemo(() => {
    if (!assignSearch.trim()) return assignments;
    const q = assignSearch.toLowerCase();
    return assignments.filter(a => a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q) || a.section.toLowerCase().includes(q));
  }, [assignments, assignSearch]);

  const displayedAssignments = showAllAssign ? filteredAssignments : filteredAssignments.slice(0, 3);
  const hasMoreAssign = filteredAssignments.length > 3;

  const handleAddAssignment = () => {
    if (!newAssign.title.trim() || !newAssign.dueDate.trim() || !newAssign.total) return;
    setAssignments(prev => [{ id: Date.now(), ...newAssign, submitted: 0, total: parseInt(newAssign.total, 10) || 0, attachment: assignFile }, ...prev]);
    setNewAssign({ title: '', subject: SUBJECTS_LIST[0], section: '6th Sem, Sec 1', dueDate: '', total: '' });
    setAssignFile(null);
    setShowAddAssign(false);
  };
  const handleFileUpload = (e) => { const f = e.target.files[0]; if (!f) return; setAssignFile({ name: f.name, type: f.type, url: URL.createObjectURL(f) }); };
  const handleSendReminder = () => { setReminderSent(true); setTimeout(() => setReminderSent(null), 2500); };

  /* ── Right panel: Calendar + Quick Actions ── */
  const rightPanel = (
    <>
      {/* Functional Calendar */}
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
                  const hasDue = day && assignments.some(a => a.dueDate === dateStr);
                  let cls = day == null ? 'empty' : isSelected ? 'selected' : isToday ? 'today' : '';
                  return (
                    <td key={di} className={cls + (hasDue ? ' has-notice' : '')}
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
        <button className="a-qa-btn a-qa-add" onClick={() => setShowAddAssign(true)}><FiPlusCircle className="a-qa-ico" /> Add Assignment</button>
        <button className="a-qa-btn a-qa-unsub" onClick={() => { setExpandedUnsub(null); setShowUnsubmitted('open'); }}><FiAlertCircle className="a-qa-ico" /> View Unsubmitted Students</button>
        <button className="a-qa-btn a-qa-remind" onClick={handleSendReminder}><FiSend className="a-qa-ico" /> Send Reminder</button>
        {reminderSent && <div className="a-reminder-toast">✓ Reminder sent to all students with pending assignments</div>}
      </div>
    </>
  );

  return (
    <DashboardLayout activeTab="assignments" rightPanel={rightPanel}>
      <>
        <h2 className="n-title">Assignments</h2>
        <p className="n-subtitle">Manage and track all student assignments</p>

        <div className="n-search-row">
          <div className="n-search-bar">
            <FiSearch className="n-search-icon" />
            <input type="text" placeholder="Search by subject, title, or student" className="n-search-input" value={assignSearch} onChange={e => setAssignSearch(e.target.value)} />
          </div>
          {hasMoreAssign && <span className="d-link n-view-all" onClick={() => setShowAllAssign(p => !p)}>{showAllAssign ? 'Show Less' : 'View All'}</span>}
        </div>

        <div className="a-table-wrap">
          <table className="a-table">
            <thead><tr><th>Title</th><th>Subject</th><th>Section</th><th>Due Date</th><th>Status</th></tr></thead>
            <tbody>
              {displayedAssignments.length > 0 ? displayedAssignments.map(a => (
                <tr key={a.id} className={a.attachment ? 'a-row-clickable' : ''} onClick={() => a.attachment && setViewAttachment(a)}>
                  <td className="a-cell-title">{a.attachment && <FiPaperclip className="a-clip-icon" />}{a.title}</td>
                  <td>{a.subject}</td><td>{a.section}</td><td>{a.dueDate}</td>
                  <td>
                    <span className={`a-status a-status-click ${a.submitted >= a.total ? 'a-status-complete' : 'a-status-pending'}`}
                      onClick={e => { e.stopPropagation(); setViewStatus(a); setStatusTab('submitted'); }}>
                      {a.submitted}/{a.total}
                    </span>
                  </td>
                </tr>
              )) : <tr><td colSpan={5} className="a-no-data">No assignments found.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* ADD ASSIGNMENT MODAL */}
        {showAddAssign && (
          <div className="n-modal-overlay" onClick={() => setShowAddAssign(false)}>
            <div className="n-modal" onClick={e => e.stopPropagation()}>
              <div className="n-modal-header"><h3>Add New Assignment</h3><button className="n-modal-close" onClick={() => setShowAddAssign(false)}><FiX /></button></div>
              <div className="n-modal-body">
                <div className="n-form-field"><label>Assignment Title</label><input type="text" placeholder="Enter assignment title" value={newAssign.title} onChange={e => setNewAssign(p => ({ ...p, title: e.target.value }))} /></div>
                <div className="n-form-field"><label>Subject</label><select value={newAssign.subject} onChange={e => setNewAssign(p => ({ ...p, subject: e.target.value }))}>{SUBJECTS_LIST.map(s => <option key={s}>{s}</option>)}</select></div>
                <div className="n-form-field"><label>Section</label><input type="text" placeholder="e.g. 6th Sem, Sec 1" value={newAssign.section} onChange={e => setNewAssign(p => ({ ...p, section: e.target.value }))} /></div>
                <div className="n-form-field"><label>Due Date</label><input type="text" placeholder="e.g. 20 Apr 2026" value={newAssign.dueDate} onChange={e => setNewAssign(p => ({ ...p, dueDate: e.target.value }))} /></div>
                <div className="n-form-field"><label>Total Students</label><input type="number" placeholder="e.g. 60" value={newAssign.total} onChange={e => setNewAssign(p => ({ ...p, total: e.target.value }))} /></div>
                <div className="n-form-field">
                  <label>Attachment (Image or PDF)</label>
                  <div className="a-upload-area">
                    <input type="file" accept="image/*,.pdf" id="assign-file-input" className="a-file-input" onChange={handleFileUpload} />
                    <label htmlFor="assign-file-input" className="a-upload-label"><FiUpload className="a-upload-ico" /><span>{assignFile ? assignFile.name : 'Choose file or drag here'}</span></label>
                    {assignFile && (
                      <div className="a-file-preview">
                        {assignFile.type.startsWith('image/') ? <img src={assignFile.url} alt="Preview" className="a-file-thumb" /> : <div className="a-file-pdf"><FiPaperclip /><span>{assignFile.name}</span></div>}
                        <button className="a-file-remove" onClick={() => setAssignFile(null)}><FiX /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="n-modal-footer">
                <button className="n-modal-cancel" onClick={() => { setShowAddAssign(false); setAssignFile(null); }}>Cancel</button>
                <button className="n-modal-submit" onClick={handleAddAssignment}>Create Assignment</button>
              </div>
            </div>
          </div>
        )}

        {/* ATTACHMENT PREVIEW MODAL */}
        {viewAttachment && (
          <div className="n-modal-overlay" onClick={() => setViewAttachment(null)}>
            <div className="n-modal a-preview-modal" onClick={e => e.stopPropagation()}>
              <div className="n-modal-header"><h3>{viewAttachment.title}</h3><button className="n-modal-close" onClick={() => setViewAttachment(null)}><FiX /></button></div>
              <div className="a-preview-body">
                {viewAttachment.attachment.type.startsWith('image/') ? <img src={viewAttachment.attachment.url} alt={viewAttachment.attachment.name} className="a-preview-img" /> : <div className="a-preview-pdf"><div className="a-preview-pdf-icon"><FiPaperclip /></div><h4>{viewAttachment.attachment.name}</h4><p>PDF attachment</p><a href={viewAttachment.attachment.url} target="_blank" rel="noopener noreferrer" className="a-preview-open-btn"><FiDownload /> Open PDF</a></div>}
              </div>
              <div className="a-preview-footer"><span className="a-preview-meta">{viewAttachment.subject} · {viewAttachment.section} · Due: {viewAttachment.dueDate}</span><a href={viewAttachment.attachment.url} download={viewAttachment.attachment.name} className="n-modal-submit a-download-btn"><FiDownload /> Download</a></div>
            </div>
          </div>
        )}

        {/* UNSUBMITTED MODAL */}
        {showUnsubmitted && (() => {
          const pending = assignments.filter(a => a.submitted < a.total);
          return (
            <div className="n-modal-overlay" onClick={() => setShowUnsubmitted(null)}>
              <div className="n-modal a-status-modal" onClick={e => e.stopPropagation()}>
                <div className="n-modal-header"><h3>Unsubmitted Students</h3><button className="n-modal-close" onClick={() => setShowUnsubmitted(null)}><FiX /></button></div>
                {pending.length > 0 ? (
                  <div className="a-unsub-detail-list">
                    {pending.map(a => {
                      const studs = generateStudents(a.id, a.total, a.submitted);
                      const pendingStudents = studs.filter(s => !s.submitted);
                      const isOpen = expandedUnsub === a.id;
                      return (
                        <div key={a.id} className="a-unsub-group">
                          <div className="a-unsub-group-hd" onClick={() => setExpandedUnsub(p => p === a.id ? null : a.id)}>
                            <div><h4>{a.title}</h4><span className="a-unsub-meta">{a.subject} · {a.section}</span></div>
                            <span className="a-unsub-count">{pendingStudents.length} pending</span>
                          </div>
                          {isOpen && <div className="a-unsub-students">{pendingStudents.map((s, i) => (<div key={i} className="a-st-student a-st-not"><div className="a-st-avatar">{s.name.split(' ').map(w => w[0]).join('').slice(0,2)}</div><div className="a-st-info"><span className="a-st-name">{s.name}</span><span className="a-st-roll">{s.rollNo}</span></div><span className="a-st-badge a-st-badge-no">✗ Pending</span></div>))}</div>}
                        </div>
                      );
                    })}
                  </div>
                ) : <div className="n-modal-body"><p className="n-no-data">All students have submitted!</p></div>}
              </div>
            </div>
          );
        })()}

        {/* SUBMISSION STATUS MODAL */}
        {viewStatus && (() => {
          const studs = generateStudents(viewStatus.id, viewStatus.total, viewStatus.submitted);
          const submittedList = studs.filter(s => s.submitted);
          const pendingList = studs.filter(s => !s.submitted);
          const activeList = statusTab === 'submitted' ? submittedList : pendingList;
          return (
            <div className="n-modal-overlay" onClick={() => setViewStatus(null)}>
              <div className="n-modal a-status-modal" onClick={e => e.stopPropagation()}>
                <div className="n-modal-header"><h3>{viewStatus.title}</h3><button className="n-modal-close" onClick={() => setViewStatus(null)}><FiX /></button></div>
                <div className="a-st-progress-wrap"><div className="a-st-progress-bar"><div className="a-st-progress-fill" style={{ width: `${(viewStatus.submitted / viewStatus.total) * 100}%` }} /></div><span className="a-st-progress-text">{viewStatus.submitted} of {viewStatus.total} submitted ({Math.round((viewStatus.submitted / viewStatus.total) * 100)}%)</span></div>
                <div className="a-st-tabs">
                  <button className={`a-st-tab ${statusTab === 'submitted' ? 'a-st-tab-active-green' : ''}`} onClick={() => setStatusTab('submitted')}>✓ Submitted ({submittedList.length})</button>
                  <button className={`a-st-tab ${statusTab === 'pending' ? 'a-st-tab-active-red' : ''}`} onClick={() => setStatusTab('pending')}>✗ Pending ({pendingList.length})</button>
                </div>
                <div className="a-st-list">
                  {activeList.map((s, i) => (
                    <div key={i} className={`a-st-student ${s.submitted ? 'a-st-done' : 'a-st-not'}`}>
                      <div className="a-st-avatar">{s.name.split(' ').map(w => w[0]).join('').slice(0,2)}</div>
                      <div className="a-st-info"><span className="a-st-name">{s.name}</span><span className="a-st-roll">{s.rollNo}</span></div>
                      <span className={`a-st-badge ${s.submitted ? 'a-st-badge-yes' : 'a-st-badge-no'}`}>{s.submitted ? '✓ Submitted' : '✗ Pending'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </>
    </DashboardLayout>
  );
}
