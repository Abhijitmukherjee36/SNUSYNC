import { FiX } from 'react-icons/fi';

/**
 * AddNoticeModal — form modal for creating a new notice.
 */
export default function AddNoticeModal({ newNotice, setNewNotice, onSubmit, onClose }) {
  return (
    <div className="n-modal-overlay" onClick={onClose}>
      <div className="n-modal" onClick={e => e.stopPropagation()}>
        <div className="n-modal-header">
          <h3>Add New Notice</h3>
          <button className="n-modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="n-modal-body">
          <div className="n-form-field">
            <label>Notice Title</label>
            <input type="text" placeholder="Enter notice title"
              value={newNotice.title}
              onChange={e => setNewNotice(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="n-form-field">
            <label>Notice Content</label>
            <textarea placeholder="Enter notice content..." rows={5}
              value={newNotice.body}
              onChange={e => setNewNotice(p => ({ ...p, body: e.target.value }))} />
          </div>
        </div>
        <div className="n-modal-footer">
          <button className="n-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="n-modal-submit" onClick={onSubmit}>Publish Notice</button>
        </div>
      </div>
    </div>
  );
}
