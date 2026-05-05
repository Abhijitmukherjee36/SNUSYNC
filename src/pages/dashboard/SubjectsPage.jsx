import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { SUBJECTS_DATA } from '../../data/dashboardData';
import {
  SubjectFilters, SubjectTable, SubjectStatCards,
  SubjectDetailModal, MaterialPreviewModal, UploadMaterialModal,
} from '../../components/subjects/SubjectComponents';

export default function SubjectsPage() {
  const [subjectsData,  setSubjectsData]  = useState(SUBJECTS_DATA);
  const [search,        setSearch]        = useState('');
  const [filterOpen,    setFilterOpen]    = useState(false);
  const [fDept,         setFDept]         = useState('All');
  const [fYear,         setFYear]         = useState('All');
  const [fCredits,      setFCredits]      = useState('All');
  const [fAtt,          setFAtt]          = useState('All');
  const [uploadModal,   setUploadModal]   = useState(null);
  const [uploadFile,    setUploadFile]    = useState(null);
  const [materialsView, setMaterialsView] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [cardModal,     setCardModal]     = useState(null);
  const [matPreview,    setMatPreview]    = useState(null);

  const activeFilters = [fDept, fYear, fCredits, fAtt].filter(f => f !== 'All').length;
  const clearFilters  = () => { setFDept('All'); setFYear('All'); setFCredits('All'); setFAtt('All'); };

  const activeFilterTags = [];
  if (fDept    !== 'All') activeFilterTags.push({ label: `Dept: ${fDept}`,    clear: () => setFDept('All') });
  if (fYear    !== 'All') activeFilterTags.push({ label: `Year: ${fYear}`,    clear: () => setFYear('All') });
  if (fCredits !== 'All') activeFilterTags.push({ label: `Credits: ${fCredits}`, clear: () => setFCredits('All') });
  if (fAtt     !== 'All') activeFilterTags.push({ label: `Att: ${fAtt}`,     clear: () => setFAtt('All') });

  const filtered = useMemo(() => {
    let list = [...subjectsData];
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(s => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.dept.toLowerCase().includes(q)); }
    if (fDept    !== 'All') list = list.filter(s => s.dept === fDept);
    if (fYear    !== 'All') list = list.filter(s => s.year === fYear);
    if (fCredits !== 'All') list = list.filter(s => String(s.credits) === fCredits);
    if (fAtt === '90+')       list = list.filter(s => s.avgAttendance >= 90);
    else if (fAtt === '80-89') list = list.filter(s => s.avgAttendance >= 80 && s.avgAttendance < 90);
    else if (fAtt === '<80')   list = list.filter(s => s.avgAttendance < 80);
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

  return (
    <DashboardLayout activeTab="subjects" fullWidth>
      <>
        <SubjectFilters
          search={search} setSearch={setSearch}
          filterOpen={filterOpen} setFilterOpen={setFilterOpen}
          fDept={fDept} setFDept={setFDept}
          fYear={fYear} setFYear={setFYear}
          fCredits={fCredits} setFCredits={setFCredits}
          fAtt={fAtt} setFAtt={setFAtt}
          activeFilters={activeFilters} clearFilters={clearFilters}
          activeFilterTags={activeFilterTags}
        />

        <SubjectStatCards stats={stats} onCardClick={setCardModal} />

        <SubjectTable
          filtered={filtered}
          materialsView={materialsView} setMaterialsView={setMaterialsView}
          setUploadModal={setUploadModal} setMatPreview={setMatPreview}
        />

        {uploadSuccess && <div className="subj-upload-toast">✓ Material uploaded to {uploadSuccess}</div>}

        {cardModal   && <SubjectDetailModal    cardModal={cardModal}   subjectsData={subjectsData} stats={stats}                              onClose={() => setCardModal(null)}   setMatPreview={setMatPreview} />}
        {matPreview  && <MaterialPreviewModal  matPreview={matPreview}                                                                         onClose={() => setMatPreview(null)} />}
        {uploadModal && <UploadMaterialModal   uploadModal={uploadModal} uploadFile={uploadFile}     setUploadFile={setUploadFile} onUpload={handleUpload} onClose={() => { setUploadModal(null); setUploadFile(null); }} />}
      </>
    </DashboardLayout>
  );
}
