import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiX, FiPaperclip, FiUpload, FiDownload, FiFileText, FiChevronDown } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout';
import { SUBJECTS_DATA } from '../../data/dashboardData';

export default function SubjectsPage() {
  const [subjectsData, setSubjectsData] = useState(SUBJECTS_DATA);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [fDept, setFDept] = useState('All');
  const [fYear, setFYear] = useState('All');
  const [fCredits, setFCredits] = useState('All');
  const [fAtt, setFAtt] = useState('All');
  const [uploadModal, setUploadModal] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [materialsView, setMaterialsView] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [cardModal, setCardModal] = useState(null);
  const [matPreview, setMatPreview] = useState(null);

  const activeFilters = [fDept, fYear, fCredits, fAtt].filter(f => f !== 'All').length;
  const clearFilters = () => { setFDept('All'); setFYear('All'); setFCredits('All'); setFAtt('All'); };

  const filtered = useMemo(() => {
    let list = [...subjectsData];
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(s => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.dept.toLowerCase().includes(q)); }
    if (fDept !== 'All') list = list.filter(s => s.dept === fDept);
    if (fYear !== 'All') list = list.filter(s => s.year === fYear);
    if (fCredits !== 'All') list = list.filter(s => String(s.credits) === fCredits);
    if (fAtt === '90+') list = list.filter(s => s.avgAttendance >= 90);
    else if (fAtt === '80-89') list = list.filter(s => s.avgAttendance >= 80 && s.avgAttendance < 90);
    else if (fAtt === '<80') list = list.filter(s => s.avgAttendance < 80);
    return list;
  }, [subjectsData, search, fDept, fYear, fCredits, fAtt]);

  const stats = useMemo(() => {
    const deptList = [...new Set(subjectsData.map(s => s.dept))];
    return { total: subjectsData.length, depts: deptList.length, deptList, mats: subjectsData.reduce((s, x) => s + x.materials.length, 0), avgAtt: Math.round(subjectsData.reduce((s, x) => s + x.avgAttendance, 0) / subjectsData.length) };
  }, [subjectsData]);

  const handleUpload = () => {
    if (!uploadFile || !uploadModal) return;
    const newMat = { name: uploadFile.name, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) };
    setSubjectsData(p => p.map(s => s.id === uploadModal.id ? { ...s, materials: [...s.materials, newMat] } : s));
    setUploadSuccess(uploadModal.name); setUploadFile(null); setUploadModal(null);
    setTimeout(() => setUploadSuccess(null), 2500);
  };

  const activeFilterTags = [];
  if (fDept !== 'All') activeFilterTags.push({ label: `Dept: ${fDept}`, clear: () => setFDept('All') });
  if (fYear !== 'All') activeFilterTags.push({ label: `Year: ${fYear}`, clear: () => setFYear('All') });
  if (fCredits !== 'All') activeFilterTags.push({ label: `Credits: ${fCredits}`, clear: () => setFCredits('All') });
  if (fAtt !== 'All') activeFilterTags.push({ label: `Att: ${fAtt}`, clear: () => setFAtt('All') });

  return (
    <DashboardLayout activeTab="subjects" fullWidth>
      <>
        {/* Header */}
        <div className="subj-header">
          <div className="subj-header-left">
            <h2 className="subj-title">Subjects</h2>
            <p className="subj-subtitle">Keep track of all the subjects you're teaching</p>
          </div>
          <div className="subj-header-right">
            <div className="subj-search-bar">
              <FiSearch className="subj-search-icon" />
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
                    { label: 'Department', vals: ['All', 'CSE', 'ECE', 'ME'], cur: fDept, set: setFDept },
                    { label: 'Year', vals: ['All', '2nd', '3rd', '4th'], cur: fYear, set: setFYear },
                    { label: 'Credits', vals: ['All', '3', '4'], cur: fCredits, set: setFCredits },
                    { label: 'Attendance', vals: ['All', '90+', '80-89', '<80'], cur: fAtt, set: setFAtt },
                  ].map(f => (
                    <div key={f.label}>
                      <p className="subj-filter-label">{f.label}</p>
                      <div className="subj-filter-chips">
                        {f.vals.map(v => (
                          <button key={v} className={`subj-chip ${f.cur === v ? 'active' : ''}`} onClick={() => f.set(v)}>{v}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button className="subj-filter-apply" onClick={() => setFilterOpen(false)}>Apply Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active filter tags */}
        {activeFilterTags.length > 0 && (
          <div className="subj-active-filters">
            {activeFilterTags.map(t => (
              <span key={t.label} className="subj-atag">{t.label} <button onClick={t.clear}>×</button></span>
            ))}
            <button className="subj-clear-all" onClick={clearFilters}>Clear All</button>
          </div>
        )}

        {/* Stat Cards */}
        <div className="subj-cards-section">
          <div className="subj-cards-grid">
            {[
              { icon: '📚', num: stats.total, label: 'Total Subjects', card: 'subj-stat-total', ico: 'subj-ico-total', modal: 'subjects' },
              { icon: '👥', num: stats.depts, label: 'Departments', card: 'subj-stat-dept', ico: 'subj-ico-dept', modal: 'departments' },
              { icon: '📋', num: stats.mats, label: 'Materials Uploaded', card: 'subj-stat-mat', ico: 'subj-ico-mat', modal: 'materials' },
              { icon: '📈', num: `${stats.avgAtt}%`, label: 'Avg Attendance', card: 'subj-stat-att', ico: 'subj-ico-att', modal: 'attendance' },
            ].map(c => (
              <div key={c.label} className={`subj-stat-card ${c.card} subj-stat-clickable`} onClick={() => setCardModal(c.modal)}>
                <div className={`subj-stat-icon ${c.ico}`}>{c.icon}</div>
                <div className="subj-stat-info">
                  <span className="subj-stat-num">{c.num}</span>
                  <span className="subj-stat-label">{c.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="subj-table-wrap">
          <table className="subj-table">
            <thead>
              <tr>
                <th>Subject Code</th><th>Subject Name</th><th>Dept</th><th>Year, Sec</th><th>Avg Attendance</th><th>Credits</th><th>Materials</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(s => (
                <tr key={s.id}>
                  <td className="subj-cell-code">{s.code}</td>
                  <td>{s.name}</td>
                  <td>{s.dept}</td>
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
                      <button className="subj-mat-dropdown-btn" onClick={() => setMaterialsView(materialsView === s.id ? null : s.id)}>
                        <FiChevronDown />
                      </button>
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

        {uploadSuccess && <div className="subj-upload-toast">✓ Material uploaded to {uploadSuccess}</div>}

        {/* STAT CARD DETAIL MODAL */}
        {cardModal && (
          <div className="n-modal-overlay" onClick={() => setCardModal(null)}>
            <div className="n-modal subj-detail-modal" onClick={e => e.stopPropagation()}>
              <div className="n-modal-header">
                <h3>{cardModal === 'subjects' ? 'All Subjects' : cardModal === 'departments' ? 'Departments' : cardModal === 'materials' ? 'All Materials' : 'Attendance Overview'}</h3>
                <button className="n-modal-close" onClick={() => setCardModal(null)}><FiX /></button>
              </div>
              <div className="subj-detail-body">
                {cardModal === 'subjects' && subjectsData.map(s => (
                  <div key={s.id} className="subj-detail-row">
                    <span className="subj-detail-code">{s.code}</span>
                    <span className="subj-detail-name">{s.name}</span>
                    <span className="subj-detail-dept-tag">{s.dept}</span>
                    <span className="subj-detail-meta">{s.year} yr · {s.credits} cr</span>
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
                      <div key={i} className="subj-mat-item subj-mat-item-click" onClick={() => { setCardModal(null); setMatPreview({ subject: s.name, material: m }); }}>
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
        )}

        {/* MATERIAL PREVIEW MODAL */}
        {matPreview && (
          <div className="n-modal-overlay" onClick={() => setMatPreview(null)}>
            <div className="n-modal subj-preview-modal" onClick={e => e.stopPropagation()}>
              <div className="n-modal-header">
                <h3>{matPreview.material.name}</h3>
                <button className="n-modal-close" onClick={() => setMatPreview(null)}><FiX /></button>
              </div>
              <div className="subj-preview-body">
                <div className="subj-preview-icon-wrap"><FiFileText className="subj-preview-icon" /></div>
                <h4 className="subj-preview-fname">{matPreview.material.name}</h4>
                <p className="subj-preview-meta">Subject: <strong>{matPreview.subject}</strong></p>
                <p className="subj-preview-meta">Uploaded: <strong>{matPreview.material.date}</strong></p>
                <p className="subj-preview-meta">Type: <strong>{matPreview.material.name.split('.').pop().toUpperCase()}</strong></p>
              </div>
              <div className="n-modal-footer">
                <button className="n-modal-cancel" onClick={() => setMatPreview(null)}>Close</button>
                <button className="n-modal-submit"><FiDownload style={{ marginRight: 6 }} /> Download</button>
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD MODAL */}
        {uploadModal && (
          <div className="n-modal-overlay" onClick={() => { setUploadModal(null); setUploadFile(null); }}>
            <div className="n-modal" onClick={e => e.stopPropagation()}>
              <div className="n-modal-header">
                <h3>Upload Material — {uploadModal.name}</h3>
                <button className="n-modal-close" onClick={() => { setUploadModal(null); setUploadFile(null); }}><FiX /></button>
              </div>
              <div className="n-modal-body">
                <div className="n-form-field">
                  <label>Subject</label>
                  <input type="text" value={`${uploadModal.code} — ${uploadModal.name}`} readOnly />
                </div>
                <div className="n-form-field">
                  <label>Select File</label>
                  <div className="a-upload-area">
                    <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,image/*" id="subj-file-input" className="a-file-input" onChange={e => setUploadFile(e.target.files[0] || null)} />
                    <label htmlFor="subj-file-input" className="a-upload-label">
                      <FiUpload className="a-upload-ico" />
                      <span>{uploadFile ? uploadFile.name : 'Choose file or drag here'}</span>
                    </label>
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
                <button className="n-modal-cancel" onClick={() => { setUploadModal(null); setUploadFile(null); }}>Cancel</button>
                <button className="n-modal-submit" onClick={handleUpload} disabled={!uploadFile}>Upload Material</button>
              </div>
            </div>
          </div>
        )}
      </>
    </DashboardLayout>
  );
}
