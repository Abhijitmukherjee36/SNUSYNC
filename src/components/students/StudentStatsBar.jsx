/**
 * StudentStatsBar — Total / Present / Absent stat cards shown in the right panel.
 */
export default function StudentStatsBar({ stats }) {
  return (
    <div className="s-stats">
      <div className="s-stat-card s-stat-total">
        <div className="s-stat-icon">👥</div>
        <div className="s-stat-info">
          <span className="s-stat-num">{String(stats.total).padStart(3, '0')}</span>
          <span className="s-stat-label">Total Students</span>
        </div>
      </div>
      <div className="s-stat-card s-stat-present">
        <div className="s-stat-icon">👍</div>
        <div className="s-stat-info">
          <span className="s-stat-num">{String(stats.present).padStart(3, '0')}</span>
          <span className="s-stat-label">Present Students</span>
        </div>
      </div>
      <div className="s-stat-card s-stat-absent">
        <div className="s-stat-icon">🚫</div>
        <div className="s-stat-info">
          <span className="s-stat-num">{String(stats.absent).padStart(3, '0')}</span>
          <span className="s-stat-label">Absent Students</span>
        </div>
      </div>
    </div>
  );
}
