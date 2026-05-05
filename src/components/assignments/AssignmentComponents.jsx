import { FiX, FiPlusCircle, FiAlertCircle, FiSend, FiPaperclip, FiUpload, FiDownload } from 'react-icons/fi';
import { generateStudents, SUBJECTS_LIST } from '../../data/dashboardData';
import { useState } from 'react';

/* ─────────────────────────────────────────────────────────
   AddAssignmentModal
───────────────────────────────────────────────────────── */
export function AddAssignmentModal({ newAssign, setNewAssign, assignFile, setAssignFile, onSubmit, onClose }) {
  const handleFileUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setAssignFile({ name: f.name, type: f.type, url: URL.createObjectURL(f) });
  };
  return (
    <div className="n-modal-overlay" onClick={onClose}>
      <div className="n-modal" onClick={e => e.stopPropagation()}>
        <div className="n-modal-header">
          <h3>Add New Assignment</h3>
          <button className="n-modal-close" onClick={onClose}><FiX /></button>
        </div>
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
          <button className="n-modal-cancel" onClick={() => { onClose(); setAssignFile(null); }}>Cancel</button>
          <button className="n-modal-submit" onClick={onSubmit}>Create Assignment</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   AttachmentPreviewModal
───────────────────────────────────────────────────────── */
export function AttachmentPreviewModal({ assignment, onClose }) {
  if (!assignment) return null;
  return (
    <div className="n-modal-overlay" onClick={onClose}>
      <div className="n-modal a-preview-modal" onClick={e => e.stopPropagation()}>
        <div className="n-modal-header"><h3>{assignment.title}</h3><button className="n-modal-close" onClick={onClose}><FiX /></button></div>
        <div className="a-preview-body">
          {assignment.attachment.type.startsWith('image/')
            ? <img src={assignment.attachment.url} alt={assignment.attachment.name} className="a-preview-img" />
            : <div className="a-preview-pdf"><div className="a-preview-pdf-icon"><FiPaperclip /></div><h4>{assignment.attachment.name}</h4><p>PDF attachment</p><a href={assignment.attachment.url} target="_blank" rel="noopener noreferrer" className="a-preview-open-btn"><FiDownload /> Open PDF</a></div>}
        </div>
        <div className="a-preview-footer">
          <span className="a-preview-meta">{assignment.subject} · {assignment.section} · Due: {assignment.dueDate}</span>
          <a href={assignment.attachment.url} download={assignment.attachment.name} className="n-modal-submit a-download-btn"><FiDownload /> Download</a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   UnsubmittedModal
───────────────────────────────────────────────────────── */
export function UnsubmittedModal({ assignments, onClose }) {
  const [expandedUnsub, setExpandedUnsub] = useState(null);
  const pending = assignments.filter(a => a.submitted < a.total);
  return (
    <div className="n-modal-overlay" onClick={onClose}>
      <div className="n-modal a-status-modal" onClick={e => e.stopPropagation()}>
        <div className="n-modal-header"><h3>Unsubmitted Students</h3><button className="n-modal-close" onClick={onClose}><FiX /></button></div>
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
}

/* ─────────────────────────────────────────────────────────
   SubmissionStatusModal
───────────────────────────────────────────────────────── */
export function SubmissionStatusModal({ assignment, onClose }) {
  const [statusTab, setStatusTab] = useState('submitted');
  if (!assignment) return null;
  const studs = generateStudents(assignment.id, assignment.total, assignment.submitted);
  const submittedList = studs.filter(s => s.submitted);
  const pendingList   = studs.filter(s => !s.submitted);
  const activeList    = statusTab === 'submitted' ? submittedList : pendingList;
  return (
    <div className="n-modal-overlay" onClick={onClose}>
      <div className="n-modal a-status-modal" onClick={e => e.stopPropagation()}>
        <div className="n-modal-header"><h3>{assignment.title}</h3><button className="n-modal-close" onClick={onClose}><FiX /></button></div>
        <div className="a-st-progress-wrap"><div className="a-st-progress-bar"><div className="a-st-progress-fill" style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }} /></div><span className="a-st-progress-text">{assignment.submitted} of {assignment.total} submitted ({Math.round((assignment.submitted / assignment.total) * 100)}%)</span></div>
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
}

/* ─────────────────────────────────────────────────────────
   AssignmentsQuickActions (right panel)
───────────────────────────────────────────────────────── */
export function AssignmentsQuickActions({ onAddAssignment, onViewUnsubmitted, reminderSent, onSendReminder }) {
  return (
    <div className="n-quick-actions">
      <h3 className="n-qa-title">Quick Actions</h3>
      <button className="a-qa-btn a-qa-add" onClick={onAddAssignment}><FiPlusCircle className="a-qa-ico" /> Add Assignment</button>
      <button className="a-qa-btn a-qa-unsub" onClick={onViewUnsubmitted}><FiAlertCircle className="a-qa-ico" /> View Unsubmitted Students</button>
      <button className="a-qa-btn a-qa-remind" onClick={onSendReminder}><FiSend className="a-qa-ico" /> Send Reminder</button>
      {reminderSent && <div className="a-reminder-toast">✓ Reminder sent to all students with pending assignments</div>}
    </div>
  );
}
