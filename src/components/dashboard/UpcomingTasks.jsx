import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { DEFAULT_TASKS } from '../../data/dashboardData';

const priorityCls = { high: 'd-priority-high', medium: 'd-priority-medium', low: 'd-priority-low' };

/**
 * UpcomingTasks — task cards preview (2 pending) + View All modal with full list and toggle.
 */
export default function UpcomingTasks() {
  const [tasks,          setTasks]          = useState(DEFAULT_TASKS);
  const [tasksModalOpen, setTasksModalOpen] = useState(false);

  const toggleTask    = (id) => setTasks(p => p.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const pendingCount  = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <>
      <div className="d-tasks">
        <div className="d-sec-head">
          <h3>
            Upcoming Tasks{' '}
            <span style={{ fontSize: 14, color: '#999', fontWeight: 400, fontFamily: 'Inter,sans-serif' }}>
              ({pendingCount} pending, {completedCount} done)
            </span>
          </h3>
          <span className="d-link" onClick={() => setTasksModalOpen(true)}>
            View All ({tasks.length})
          </span>
        </div>
        <div className="d-tasks-grid">
          {tasks.filter(t => !t.completed).slice(0, 2).map(t => (
            <div key={t.id} className="d-task-card" onClick={() => toggleTask(t.id)}>
              <div className="d-task-inner">
                <div className="d-task-check"><div className="d-check-open" /></div>
                <div>
                  <h4>{t.title} <span className={`d-priority ${priorityCls[t.priority]}`}>{t.priority}</span></h4>
                  <p className="d-task-date">{t.date}</p>
                  <p className="d-task-info">{t.info}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Modal */}
      {tasksModalOpen && (
        <div className="d-viewall-overlay" onClick={() => setTasksModalOpen(false)}>
          <div className="d-viewall-modal" onClick={e => e.stopPropagation()}>
            <div className="d-viewall-header">
              <h3>All Tasks ({tasks.length})</h3>
              <button className="d-viewall-close" onClick={() => setTasksModalOpen(false)}><FiX /></button>
            </div>
            <div className="d-viewall-body">
              {tasks.map(t => (
                <div key={t.id} className={`d-task-modal-card ${t.completed ? 'done' : ''}`} onClick={() => toggleTask(t.id)}>
                  <div className="d-task-check">
                    {t.completed
                      ? <div className="d-check-done">✓</div>
                      : <div className="d-check-open" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: '#1a1a2e', margin: '0 0 3px' }}>
                      {t.title} <span className={`d-priority ${priorityCls[t.priority]}`}>{t.priority}</span>
                    </h4>
                    <p style={{ fontSize: 12, color: '#888', margin: '0 0 4px' }}>{t.date}</p>
                    <p style={{ fontSize: 12.5, color: '#666', lineHeight: 1.5, margin: 0 }}>{t.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
