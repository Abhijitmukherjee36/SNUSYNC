import { FiX, FiPaperclip, FiUpload, FiDownload, FiFileText, FiFilter, FiChevronDown } from 'react-icons/fi';

/* ─────────────────────────────────────────────────────────
   SubjectFilters — search + filter dropdown panel
───────────────────────────────────────────────────────── */
export function SubjectFilters({ search, setSearch, filterOpen, setFilterOpen, fDept, setFDept, fYear, setFYear, fCredits, setFCredits, fAtt, setFAtt, activeFilters, clearFilters, activeFilterTags }) {
  return (
    <div className="subj-header">
      <div className="subj-header-left">
        <h2 className="subj-title">Subjects</h2>
        <p className="subj-subtitle">Keep track of all the subjects you're teaching</p>
      </div>
      <div className="subj-header-right">
        <div className="subj-search-bar">
          <FiFilter className="subj-search-icon" style={{ display: 'none' }} />
          <input type="text" placeholder="Search subjects..." className="subj-search-input" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="subj-filter-wrap">
          <button className="subj-filter-btn" onClick={() => setFilterOpen(p => !p)}>
            <FiFilter /> Filter {activeFilters > 0 && <span className="subj-filter-badge">{activeFilters}</span>}
          </button>
          {filterOpen && (
            <div className="subj-filter-dropdown" onClick={e => e.stopPropagation()}>
              <div className="subj-filter-hd">
                <span>Filters</span>
                {activeFilters > 0 && <button className="subj-filter-clear" onClick={clearFilters}>Clear All</button>}
              </div>
              {[
                { label: 'Department', vals: ['All','CSE','ECE','ME'], cur: fDept, set: setFDept },
                { label: 'Year',       vals: ['All','2nd','3rd','4th'], cur: fYear, set: setFYear },
                { label: 'Credits',    vals: ['All','3','4'],            cur: fCredits, set: setFCredits },
                { label: 'Attendance', vals: ['All','90+','80-89','<80'], cur: fAtt, set: setFAtt },
              ].map(f => (
                <div key={f.label}>
                  <p className="subj-filter-label">{f.label}</p>
                  <div className="subj-filter-chips">
                    {f.vals.map(v => <button key={v} className={`subj-chip ${f.cur === v ? 'active' : ''}`} onClick={() => f.set(v)}>{v}</button>)}
                  </div>
                </div>
              ))}
              <button className="subj-filter-apply" onClick={() => setFilterOpen(false)}>Apply Filters</button>
            </div>
          )}
        </div>
      </div>
      {activeFilterTags.length > 0 && (
        <div className="subj-active-filters" style={{ width: '100%' }}>
          {activeFilterTags.map(t => <span key={t.label} className="subj-atag">{t.label} <button onClick={t.clear}>×</button></span>)}
          <button className="subj-clear-all" onClick={clearFilters}>Clear All</button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SubjectTable — the main subject list table
───────────────────────────────────────────────────────── */
export function SubjectTable({ filtered, materialsView, setMaterialsView, setUploadModal, setMatPreview }) {
  return (
    <div className="subj-table-wrap">
      <table className="subj-table">
        <thead>
          <tr><th>Subject Code</th><th>Subject Name</th><th>Dept</th><th>Year, Sec</th><th>Avg Attendance</th><th>Credits</th><th>Materials</th></tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? filtered.map(s => (
            <tr key={s.id}>
              <td className="subj-cell-code">{s.code}</td>
              <td>{s.name}</td><td>{s.dept}</td>
              <td>{s.year}, {s.sec}</td>
              <td>
                <div className="subj-att-cell">
                  <div className="subj-att-bar-bg"><div className="subj-att-bar-fill" style={{ width: `${s.avgAttendance}%` }} /></div>
                  <span>{s.avgAttendance}%</span>
                </div>
              </td>
              <td>{s.credits}</td>
              <td>
                <div className="subj-mat-cell">
                  <button className="subj-upload-btn" onClick={() => setUploadModal(s)}>Upload</button>
                  <button className="subj-mat-dropdown-btn" onClick={() => setMaterialsView(materialsView === s.id ? null : s.id)}><FiChevronDown /></button>
                </div>
                {materialsView === s.id && (
                  <div className="subj-mat-list">
                    {s.materials.length > 0 ? s.materials.map((m, i) => (
                      <div key={i} className="subj-mat-item subj-mat-item-click" onClick={() => setMatPreview({ subject: s.name, material: m })}>
                        <FiPaperclip className="subj-mat-clip" />
                        <span className="subj-mat-name">{m.name}</span>
                        <span className="subj-mat-date">{m.date}</span>
                      </div>
                    )) : <span className="subj-mat-empty">No materials yet</span>}
                  </div>
                )}
              </td>
            </tr>
          )) : <tr><td colSpan={7} className="subj-no-data">No subjects found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SubjectStatCards
───────────────────────────────────────────────────────── */
export function SubjectStatCards({ stats, onCardClick }) {
  return (
    <div className="subj-cards-section">
      <div className="subj-cards-grid">
        {[
          { icon: '📚', num: stats.total,   label: 'Total Subjects',    card: 'subj-stat-total', ico: 'subj-ico-total', modal: 'subjects' },
          { icon: '👥', num: stats.depts,   label: 'Departments',       card: 'subj-stat-dept',  ico: 'subj-ico-dept',  modal: 'departments' },
          { icon: '📋', num: stats.mats,    label: 'Materials Uploaded', card: 'subj-stat-mat',   ico: 'subj-ico-mat',   modal: 'materials' },
          { icon: '📈', num: `${stats.avgAtt}%`, label: 'Avg Attendance', card: 'subj-stat-att', ico: 'subj-ico-att',   modal: 'attendance' },
        ].map(c => (
          <div key={c.label} className={`subj-stat-card ${c.card} subj-stat-clickable`} onClick={() => onCardClick(c.modal)}>
            <div className={`subj-stat-icon ${c.ico}`}>{c.icon}</div>
            <div className="subj-stat-info">
              <span className="subj-stat-num">{c.num}</span>
              <span className="subj-stat-label">{c.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SubjectDetailModal — stat card click detail
───────────────────────────────────────────────────────── */
export function SubjectDetailModal({ cardModal, subjectsData, stats, onClose, setMatPreview }) {
  return (
    <div className="n-modal-overlay" onClick={onClose}>
      <div className="n-modal subj-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="n-modal-header">
          <h3>{cardModal === 'subjects' ? 'All Subjects' : cardModal === 'departments' ? 'Departments' : cardModal === 'materials' ? 'All Materials' : 'Attendance Overview'}</h3>
          <button className="n-modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="subj-detail-body">
          {cardModal === 'subjects' && subjectsData.map(s => (
            <div key={s.id} className="subj-detail-row">
              <span className="subj-detail-code">{s.code}</span><span className="subj-detail-name">{s.name}</span>
              <span className="subj-detail-dept-tag">{s.dept}</span><span className="subj-detail-meta">{s.year} yr · {s.credits} cr</span>
            </div>
          ))}
          {cardModal === 'departments' && stats.deptList.map(dept => {
            const ds = subjectsData.filter(s => s.dept === dept);
            return (
              <div key={dept} className="subj-dept-block">
                <div className="subj-dept-hd"><strong>{dept}</strong><span>{ds.length} subjects</span></div>
                {ds.map(s => <div key={s.id} className="subj-dept-sub">{s.code} — {s.name}</div>)}
              </div>
            );
          })}
          {cardModal === 'materials' && subjectsData.map(s => (
            <div key={s.id} className="subj-mat-block">
              <div className="subj-mat-block-hd">{s.code} — {s.name} <span className="subj-mat-count">{s.materials.length} files</span></div>
              {s.materials.map((m, i) => (
                <div key={i} className="subj-mat-item subj-mat-item-click" onClick={() => { onClose(); setMatPreview({ subject: s.name, material: m }); }}>
                  <FiPaperclip className="subj-mat-clip" /><span className="subj-mat-name">{m.name}</span><span className="subj-mat-date">{m.date}</span>
                </div>
              ))}
            </div>
          ))}
          {cardModal === 'attendance' && (
            <div className="subj-att-overview">
              {[...subjectsData].sort((a, b) => b.avgAttendance - a.avgAttendance).map(s => (
                <div key={s.id} className="subj-att-row">
                  <span className="subj-att-row-name">{s.code}</span>
                  <div className="subj-att-bar-bg subj-att-bar-wide">
                    <div className="subj-att-bar-fill" style={{ width: `${s.avgAttendance}%`, background: s.avgAttendance >= 90 ? '#43a047' : s.avgAttendance >= 80 ? '#fb8c00' : '#ef5350' }} />
                  </div>
                  <span className={`subj-att-row-pct ${s.avgAttendance >= 90 ? 'att-good' : s.avgAttendance >= 80 ? 'att-warn' : 'att-low'}`}>{s.avgAttendance}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MaterialPreviewModal
───────────────────────────────────────────────────────── */
export function MaterialPreviewModal({ matPreview, onClose }) {
  if (!matPreview) return null;
  return (
    <div className="n-modal-overlay" onClick={onClose}>
      <div className="n-modal subj-preview-modal" onClick={e => e.stopPropagation()}>
        <div className="n-modal-header"><h3>{matPreview.material.name}</h3><button className="n-modal-close" onClick={onClose}><FiX /></button></div>
        <div className="subj-preview-body">
          <div className="subj-preview-icon-wrap"><FiFileText className="subj-preview-icon" /></div>
          <h4 className="subj-preview-fname">{matPreview.material.name}</h4>
          <p className="subj-preview-meta">Subject: <strong>{matPreview.subject}</strong></p>
          <p className="subj-preview-meta">Uploaded: <strong>{matPreview.material.date}</strong></p>
          <p className="subj-preview-meta">Type: <strong>{matPreview.material.name.split('.').pop().toUpperCase()}</strong></p>
        </div>
        <div className="n-modal-footer">
          <button className="n-modal-cancel" onClick={onClose}>Close</button>
          <button className="n-modal-submit"><FiDownload style={{ marginRight: 6 }} /> Download</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   UploadMaterialModal
───────────────────────────────────────────────────────── */
export function UploadMaterialModal({ uploadModal, uploadFile, setUploadFile, onUpload, onClose }) {
  if (!uploadModal) return null;
  return (
    <div className="n-modal-overlay" onClick={onClose}>
      <div className="n-modal" onClick={e => e.stopPropagation()}>
        <div className="n-modal-header"><h3>Upload Material — {uploadModal.name}</h3><button className="n-modal-close" onClick={onClose}><FiX /></button></div>
        <div className="n-modal-body">
          <div className="n-form-field"><label>Subject</label><input type="text" value={`${uploadModal.code} — ${uploadModal.name}`} readOnly /></div>
          <div className="n-form-field">
            <label>Select File</label>
            <div className="a-upload-area">
              <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,image/*" id="subj-file-input" className="a-file-input" onChange={e => setUploadFile(e.target.files[0] || null)} />
              <label htmlFor="subj-file-input" className="a-upload-label"><FiUpload className="a-upload-ico" /><span>{uploadFile ? uploadFile.name : 'Choose file or drag here'}</span></label>
            </div>
          </div>
          <div>
            <p className="subj-existing-label">Existing Materials ({uploadModal.materials.length})</p>
            <div className="subj-existing-list">
              {uploadModal.materials.map((m, i) => (
                <div key={i} className="subj-mat-item">
                  <FiPaperclip className="subj-mat-clip" /><span className="subj-mat-name">{m.name}</span><span className="subj-mat-date">{m.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="n-modal-footer">
          <button className="n-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="n-modal-submit" onClick={onUpload} disabled={!uploadFile}>Upload Material</button>
        </div>
      </div>
    </div>
  );
}
