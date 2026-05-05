import { FiCheckCircle, FiXCircle, FiSearch, FiSend, FiX } from 'react-icons/fi';

/**
 * AttendanceTable — left panel of the Attendance page.
 * Handles: bulk actions, student search, the main table, stats bar, submit button.
 */
export default function AttendanceTable({
  students, attendance, searched, searchQuery,
  setSearchQuery, setSelectedStudent,
  toggleAttendance, markAllPresent, markAllAbsent,
  filteredStudents, stats, handleSubmit,
}) {
  const allPresent = students.length > 0 && students.every((_, i) => attendance[i] === 'present');
  const allAbsent  = students.length > 0 && students.every((_, i) => attendance[i] === 'absent');

  return (
    <div className="att-left">
      {/* Header + Bulk Actions */}
      <div className="att-table-header">
        <h2>Mark Attendance</h2>
        {students.length > 0 && (
          <div className="att-bulk-actions">
            <button
              className="att-bulk-btn att-bulk-present"
              onClick={markAllPresent}
              title={allPresent ? 'Deselect All' : 'Mark All Present'}
            >
              <FiCheckCircle />
              {allPresent ? 'Deselect All' : 'All Present'}
            </button>
            <button
              className="att-bulk-btn att-bulk-absent"
              onClick={markAllAbsent}
              title={allAbsent ? 'Deselect All' : 'Mark All Absent'}
            >
              <FiXCircle />
              {allAbsent ? 'Deselect All' : 'All Absent'}
            </button>
          </div>
        )}
      </div>

      {/* Student ID / Name Search */}
      {students.length > 0 && (
        <div className="att-search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by Student ID or Name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <>
              <span className="att-search-count">{filteredStudents.length} found</span>
              <button className="att-search-clear" onClick={() => setSearchQuery('')}><FiX /></button>
            </>
          )}
        </div>
      )}

      {/* Main Table */}
      {searched && students.length > 0 ? (
        <div className="att-table-wrap">
          <table className="att-table">
            <colgroup>
              <col style={{ width: '40px' }} />
              <col style={{ width: '145px' }} />
              <col />
              <col style={{ width: '80px' }} />
              <col style={{ width: '80px' }} />
              <col style={{ width: '88px' }} />
            </colgroup>
            <thead>
              <tr>
                <th>#</th><th>Student ID</th><th>Name</th>
                <th>Present</th><th>Absent</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? filteredStudents.map(({ s, origIdx }) => (
                <tr key={origIdx} className={
                  attendance[origIdx] === 'present' ? 'row-present' :
                  attendance[origIdx] === 'absent'  ? 'row-absent'  : ''
                }>
                  <td className="att-sno">{origIdx + 1}</td>
                  <td>
                    <span className="att-id-link" onClick={() => setSelectedStudent(s)}>{s.id}</span>
                  </td>
                  <td className="att-name">
                    <span className="att-name-link" onClick={() => setSelectedStudent(s)}>{s.name}</span>
                  </td>
                  <td>
                    <span
                      className={`att-dot ${attendance[origIdx] === 'present' ? 'att-dot-green' : 'att-dot-gray'}`}
                      onClick={() => toggleAttendance(origIdx, 'present')}
                      title="Mark Present"
                    />
                  </td>
                  <td>
                    <span
                      className={`att-dot ${attendance[origIdx] === 'absent' ? 'att-dot-red' : 'att-dot-gray'}`}
                      onClick={() => toggleAttendance(origIdx, 'absent')}
                      title="Mark Absent"
                    />
                  </td>
                  <td>
                    <span className={`att-status-badge ${attendance[origIdx] ? `att-badge-${attendance[origIdx]}` : 'att-badge-unmarked'}`}>
                      {attendance[origIdx] === 'present' ? 'Present' : attendance[origIdx] === 'absent' ? 'Absent' : '—'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ textAlign:'center', color:'#aaa', padding:'20px', fontFamily:'Inter,sans-serif', fontSize:13 }}>
                    No student found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : searched ? (
        <p className="att-no-data">No students found for the selected filters.</p>
      ) : (
        <p className="att-no-data">Select filters and click Search to load students.</p>
      )}

      {/* Stats Bar */}
      {students.length > 0 && (
        <div className="att-stats-bar">
          <div className="att-stat-pill att-pill-total">Total: <strong>{stats.total}</strong></div>
          <div className="att-stat-pill att-pill-present">Present: <strong>{stats.present}</strong></div>
          <div className="att-stat-pill att-pill-absent">Absent: <strong>{stats.absent}</strong></div>
          <div className="att-stat-pill att-pill-unmarked">Unmarked: <strong>{stats.total - stats.present - stats.absent}</strong></div>
        </div>
      )}

      {/* Submit Button */}
      {students.length > 0 && (
        <button className="att-submit-btn" onClick={handleSubmit}>
          <FiSend /> Submit Attendance
        </button>
      )}
    </div>
  );
}
