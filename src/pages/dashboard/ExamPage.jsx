import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { EXAMS_DATA } from '../../data/dashboardData';
import {
  ExamTable, ExamStatsCards,
  CreateExamModal, CompletedExamsModal, EditExamModal,
} from '../../components/exam/ExamComponents';

export default function ExamPage() {
  const [exams,         setExams]         = useState(EXAMS_DATA);
  const [createOpen,    setCreateOpen]    = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [editExam,      setEditExam]      = useState(null);
  const [newExam,       setNewExam]       = useState({ title: 'Mid Sem', subject: '', date: '', year: '3', sec: '1' });

  const active    = useMemo(() => exams.filter(e => e.status !== 'Completed'), [exams]);
  const completed = useMemo(() => exams.filter(e => e.status === 'Completed'), [exams]);
  const stats     = useMemo(() => ({
    total:     exams.length,
    ongoing:   exams.filter(e => e.status === 'Upcoming').length,
    pending:   exams.filter(e => e.status === 'Scheduled').length,
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

        <ExamStatsCards stats={stats} />
        <ExamTable exams={active} onEdit={setEditExam} />

        {createOpen    && <CreateExamModal    newExam={newExam}   setNewExam={setNewExam}     onSubmit={handleCreate} onClose={() => setCreateOpen(false)} />}
        {completedOpen && <CompletedExamsModal completed={completed}                                                  onClose={() => setCompletedOpen(false)} />}
        {editExam      && <EditExamModal      editExam={editExam} setEditExam={setEditExam}   onSave={handleSave}     onClose={() => setEditExam(null)} />}
      </>
    </DashboardLayout>
  );
}
