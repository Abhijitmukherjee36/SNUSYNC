import { useState, useMemo } from 'react';
import { FiX, FiClock, FiCalendar, FiEdit2 } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout';
import { EXAMS_DATA } from '../../data/dashboardData';

export default function ExamPage() {
  const [exams, setExams] = useState(EXAMS_DATA);
  const [createOpen, setCreateOpen] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [editExam, setEditExam] = useState(null);
  const [newExam, setNewExam] = useState({ title: 'Mid Sem', subject: '', date: '', year: '3', sec: '1' });

  const active = useMemo(() => exams.filter(e => e.status !== 'Completed'), [exams]);
  const completed = useMemo(() => exams.filter(e => e.status === 'Completed'), [exams]);
  const stats = useMemo(() => ({
    total: exams.length,
    ongoing: exams.filter(e => e.status === 'Upcoming').length,
    pending: exams.filter(e => e.status === 'Scheduled').length,
    completed: exams.filter(e => e.status === 'Completed').length,
  }), [exams]);

  const handleCreate = () => {
    if (!newExam.subject || !newExam.date) return;
    setExams(p => [...p, { id: Math.max(...p.map(e => e.id)) + 1, ...newExam, status: 'Scheduled', invigilation: null }]);
    setNewExam({ title: 'Mid Sem', subject: '', date: '', year: '3', sec: '1' });
    setCreateOpen(false);
  };

  const handleSave = () => {
    if (!editExam) return;
    setExams(p => p.map(e => e.id === editExam.id ? editExam : e));
    setEditExam(null);
  };

  return (
    <DashboardLayout activeTab="exam" fullWidth>
      <>
        {/* Header */}
        <div className="exam-header">
          <div className="exam-header-left">
            <h2 className="exam-title">Exam Overview</h2>
          </div>
          <div className="exam-header-right">
            <button className="exam-create-btn" onClick={() => setCreateOpen(true)}>+ Create Exam</button>
            <button className="exam-completed-btn" onClick={() => setCompletedOpen(true)}>View Completed Exams</button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="exam-stats-grid">
          {[
            { label: 'Total Exams', val: stats.total },
            { label: 'Ongoing Exams', val: stats.ongoing },
            { label: 'Pending Evaluation', val: stats.pending },
            { label: 'Completed Exams', val: stats.completed },
          ].map(c => (
            <div key={c.label} className="exam-stat-card">
              <span className="exam-stat-label">{c.label}</span>
              <span className="exam-stat-num">{c.val}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="exam-table-wrap">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Exam Title</th><th>Subject</th><th>Date</th><th>Year/Sec</th><th>Status</th><th>Invigilation Duties</th><th></th>
              </tr>
            </thead>
            <tbody>
              {active.length > 0 ? active.map(e => (
                <tr key={e.id}>
                  <td className="exam-cell-title">{e.title}</td>
                  <td>{e.subject}</td>
                  <td>{e.date}</td>
                  <td>{e.year}/{e.sec}</td>
                  <td>
                    <span className={`exam-status-badge ${e.status === 'Upcoming' ? 'exam-badge-upcoming' : 'exam-badge-scheduled'}`}>
                      {e.status === 'Upcoming' ? <FiClock className="exam-badge-ico" /> : <FiCalendar className="exam-badge-ico" />}
                      {e.status}
                    </span>
                  </td>
                  <td>
                    {e.invigilation ? (
                      <div className="exam-invig">
                        <div>
                          <div className="exam-invig-name">{e.invigilation.exam} · {e.invigilation.room}</div>
                          <div className="exam-invig-date">{e.invigilation.date}</div>
                        </div>
                        <span className="exam-invig-status">{e.invigilation.status}</span>
                      </div>
                    ) : <span className="exam-invig-none">—</span>}
                  </td>
                  <td>
                    <button className="exam-edit-btn" onClick={() => setEditExam({ ...e })}>
                      <FiEdit2 />
                    </button>
                  </td>
                </tr>
              )) : <tr><td colSpan={7} className="exam-no-data">No active exams.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* CREATE EXAM MODAL */}
        {createOpen && (
          <div className="n-modal-overlay" onClick={() => setCreateOpen(false)}>
            <div className="n-modal" onClick={e => e.stopPropagation()}>
              <div className="n-modal-header">
                <h3>Create New Exam</h3>
                <button className="n-modal-close" onClick={() => setCreateOpen(false)}><FiX /></button>
              </div>
              <div className="n-modal-body">
                <div className="n-form-field">
                  <label>Exam Type</label>
                  <select value={newExam.title} onChange={e => setNewExam(p => ({ ...p, title: e.target.value }))}>
                    {['Mid Sem', 'End Sem', 'Class Test', 'Quiz', 'Viva', 'Lab Exam'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="n-form-field">
                  <label>Subject</label>
                  <input type="text" placeholder="e.g. Algorithm" value={newExam.subject} onChange={e => setNewExam(p => ({ ...p, subject: e.target.value }))} />
                </div>
                <div className="n-form-field">
                  <label>Date</label>
                  <input type="date" value={newExam.date} onChange={e => setNewExam(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="n-form-field" style={{ flex: 1 }}>
                    <label>Year</label>
                    <select value={newExam.year} onChange={e => setNewExam(p => ({ ...p, year: e.target.value }))}>
                      {['1', '2', '3', '4'].map(v => <option key={v} value={v}>{v === '1' ? '1st' : v === '2' ? '2nd' : v === '3' ? '3rd' : '4th'}</option>)}
                    </select>
                  </div>
                  <div className="n-form-field" style={{ flex: 1 }}>
                    <label>Section</label>
                    <select value={newExam.sec} onChange={e => setNewExam(p => ({ ...p, sec: e.target.value }))}>
                      {['1', '2', '3'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="n-modal-footer">
                <button className="n-modal-cancel" onClick={() => setCreateOpen(false)}>Cancel</button>
                <button className="n-modal-submit" onClick={handleCreate} disabled={!newExam.subject || !newExam.date}>Create Exam</button>
              </div>
            </div>
          </div>
        )}

        {/* COMPLETED EXAMS MODAL */}
        {completedOpen && (
          <div className="n-modal-overlay" onClick={() => setCompletedOpen(false)}>
            <div className="n-modal exam-completed-modal" onClick={e => e.stopPropagation()}>
              <div className="n-modal-header">
                <h3>Completed Exams ({completed.length})</h3>
                <button className="n-modal-close" onClick={() => setCompletedOpen(false)}><FiX /></button>
              </div>
              <div className="exam-completed-body">
                {completed.length > 0 ? completed.map(e => (
                  <div key={e.id} className="exam-completed-row">
                    <span className="exam-completed-title">{e.title}</span>
                    <span className="exam-completed-subj">{e.subject}</span>
                    <span className="exam-completed-date">{e.date}</span>
                    <span className="exam-completed-ys">{e.year}/{e.sec}</span>
                    <span className="exam-badge-completed">✓ Completed</span>
                  </div>
                )) : <p className="exam-no-data">No completed exams yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* EDIT EXAM MODAL */}
        {editExam && (
          <div className="n-modal-overlay" onClick={() => setEditExam(null)}>
            <div className="n-modal" onClick={e => e.stopPropagation()}>
              <div className="n-modal-header">
                <h3>Edit Exam</h3>
                <button className="n-modal-close" onClick={() => setEditExam(null)}><FiX /></button>
              </div>
              <div className="n-modal-body">
                <div className="n-form-field">
                  <label>Exam Type</label>
                  <select value={editExam.title} onChange={e => setEditExam(p => ({ ...p, title: e.target.value }))}>
                    {['Mid Sem', 'End Sem', 'Class Test', 'Quiz', 'Viva', 'Lab Exam'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="n-form-field">
                  <label>Subject</label>
                  <input type="text" value={editExam.subject} onChange={e => setEditExam(p => ({ ...p, subject: e.target.value }))} />
                </div>
                <div className="n-form-field">
                  <label>Date</label>
                  <input type="text" value={editExam.date} onChange={e => setEditExam(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div className="n-form-field">
                  <label>Status</label>
                  <select value={editExam.status} onChange={e => setEditExam(p => ({ ...p, status: e.target.value }))}>
                    {['Upcoming', 'Scheduled', 'Completed'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="n-modal-footer">
                <button className="n-modal-cancel" onClick={() => setEditExam(null)}>Cancel</button>
                <button className="n-modal-submit" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </>
    </DashboardLayout>
  );
}
