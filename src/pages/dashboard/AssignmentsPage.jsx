import { useState, useMemo } from 'react';
import { FiSearch, FiPaperclip } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout';
import MiniCalendar    from '../../components/shared/MiniCalendar';
import {
  AddAssignmentModal, AttachmentPreviewModal,
  UnsubmittedModal, SubmissionStatusModal,
  AssignmentsQuickActions,
} from '../../components/assignments/AssignmentComponents';
import { DEFAULT_ASSIGNMENTS, SUBJECTS_LIST } from '../../data/dashboardData';

export default function AssignmentsPage() {
  const [assignments,     setAssignments]     = useState(DEFAULT_ASSIGNMENTS);
  const [assignSearch,    setAssignSearch]     = useState('');
  const [showAllAssign,   setShowAllAssign]    = useState(false);
  const [showAddAssign,   setShowAddAssign]    = useState(false);
  const [showUnsubmitted, setShowUnsubmitted]  = useState(false);
  const [reminderSent,    setReminderSent]     = useState(null);
  const [newAssign,       setNewAssign]        = useState({ title: '', subject: SUBJECTS_LIST[0], section: '6th Sem, Sec 1', dueDate: '', total: '' });
  const [assignFile,      setAssignFile]       = useState(null);
  const [viewAttachment,  setViewAttachment]   = useState(null);
  const [viewStatus,      setViewStatus]       = useState(null);

  const filteredAssignments = useMemo(() => {
    if (!assignSearch.trim()) return assignments;
    const q = assignSearch.toLowerCase();
    return assignments.filter(a => a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q) || a.section.toLowerCase().includes(q));
  }, [assignments, assignSearch]);

  const displayedAssignments = showAllAssign ? filteredAssignments : filteredAssignments.slice(0, 3);
  const hasMoreAssign        = filteredAssignments.length > 3;

  const handleAddAssignment = () => {
    if (!newAssign.title.trim() || !newAssign.dueDate.trim() || !newAssign.total) return;
    setAssignments(prev => [{ id: Date.now(), ...newAssign, submitted: 0, total: parseInt(newAssign.total, 10) || 0, attachment: assignFile }, ...prev]);
    setNewAssign({ title: '', subject: SUBJECTS_LIST[0], section: '6th Sem, Sec 1', dueDate: '', total: '' });
    setAssignFile(null);
    setShowAddAssign(false);
  };

  const handleSendReminder = () => {
    setReminderSent(true);
    setTimeout(() => setReminderSent(null), 2500);
  };

  /* Right panel */
  const dueDates  = assignments.map(a => a.dueDate);
  const rightPanel = (
    <>
      <MiniCalendar highlightDates={dueDates} showFilterBadge />
      <AssignmentsQuickActions
        onAddAssignment={() => setShowAddAssign(true)}
        onViewUnsubmitted={() => setShowUnsubmitted(true)}
        reminderSent={reminderSent}
        onSendReminder={handleSendReminder}
      />
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
            <input type="text" placeholder="Search by subject, title, or student" className="n-search-input"
              value={assignSearch} onChange={e => setAssignSearch(e.target.value)} />
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
                      onClick={e => { e.stopPropagation(); setViewStatus(a); }}>
                      {a.submitted}/{a.total}
                    </span>
                  </td>
                </tr>
              )) : <tr><td colSpan={5} className="a-no-data">No assignments found.</td></tr>}
            </tbody>
          </table>
        </div>

        {showAddAssign    && <AddAssignmentModal      newAssign={newAssign}     setNewAssign={setNewAssign} assignFile={assignFile} setAssignFile={setAssignFile} onSubmit={handleAddAssignment} onClose={() => setShowAddAssign(false)} />}
        {viewAttachment   && <AttachmentPreviewModal  assignment={viewAttachment}                                                                                                              onClose={() => setViewAttachment(null)} />}
        {showUnsubmitted  && <UnsubmittedModal        assignments={assignments}                                                                                                                onClose={() => setShowUnsubmitted(false)} />}
        {viewStatus       && <SubmissionStatusModal   assignment={viewStatus}                                                                                                                  onClose={() => setViewStatus(null)} />}
      </>
    </DashboardLayout>
  );
}
