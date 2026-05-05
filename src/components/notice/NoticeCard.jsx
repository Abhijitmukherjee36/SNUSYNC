import { FiTrash2 } from 'react-icons/fi';

/**
 * NoticeCard — single notice card with expand/collapse and delete.
 */
export default function NoticeCard({ notice, isExpanded, onToggleExpand, onDelete }) {
  const preview = notice.body.length > 200 ? notice.body.slice(0, 200) : notice.body;
  return (
    <div className="n-card">
      <div className="n-card-head">
        <h3 className="n-card-title">{notice.title}</h3>
        <div className="n-card-actions">
          <span className="n-card-date">{notice.date}</span>
          <button className="n-delete-btn" onClick={() => onDelete(notice.id)} title="Delete Notice">
            <FiTrash2 />
          </button>
        </div>
      </div>
      <p className="n-card-body">
        {isExpanded ? notice.body : preview}
        {notice.body.length > 200 && (
          <span className="n-read-more" onClick={onToggleExpand}>
            {isExpanded ? '  Show Less' : '  ....Read More'}
          </span>
        )}
      </p>
    </div>
  );
}
