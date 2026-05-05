/* ── Dynamic past working-day dates ── */
const _MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const pastWorkingDay = (daysBack) => {
  const d = new Date();
  let skipped = 0;
  while (skipped < daysBack) {
    d.setDate(d.getDate() - 1);
    if (d.getDay() !== 0) skipped++; // skip Sundays only
  }
  return `${d.getDate()} ${_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export const HISTORY = [
  { date: pastWorkingDay(1), present: 13, absent: 2, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'absent' },   { name: 'Debojyoti Biswas', status: 'present' },
    { name: 'Rahul Kumar', status: 'present' },    { name: 'Sneha Das', status: 'present' },
    { name: 'Arijit Mondal', status: 'present' },  { name: 'Priyanka Saha', status: 'absent' },
    { name: 'Sourav Ghosh', status: 'present' },   { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },     { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },    { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: pastWorkingDay(2), present: 14, absent: 1, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'present' },  { name: 'Debojyoti Biswas', status: 'present' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'absent' },
    { name: 'Arijit Mondal', status: 'present' }, { name: 'Priyanka Saha', status: 'present' },
    { name: 'Sourav Ghosh', status: 'present' },  { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },    { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: pastWorkingDay(3), present: 11, absent: 4, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'absent' },
    { name: 'Saikat Kaity', status: 'absent' },   { name: 'Debojyoti Biswas', status: 'present' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'present' },
    { name: 'Arijit Mondal', status: 'absent' },  { name: 'Priyanka Saha', status: 'absent' },
    { name: 'Sourav Ghosh', status: 'present' },  { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },    { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: pastWorkingDay(4), present: 15, absent: 0, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'present' },  { name: 'Debojyoti Biswas', status: 'present' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'present' },
    { name: 'Arijit Mondal', status: 'present' }, { name: 'Priyanka Saha', status: 'present' },
    { name: 'Sourav Ghosh', status: 'present' },  { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },    { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: pastWorkingDay(5), present: 12, absent: 3, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'absent' },   { name: 'Debojyoti Biswas', status: 'absent' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'present' },
    { name: 'Arijit Mondal', status: 'present' }, { name: 'Priyanka Saha', status: 'present' },
    { name: 'Sourav Ghosh', status: 'absent' },   { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },    { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: pastWorkingDay(6), present: 10, absent: 5, total: 15, details: [
    { name: 'Anirban Patra', status: 'absent' },  { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'absent' },   { name: 'Debojyoti Biswas', status: 'absent' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'absent' },
    { name: 'Arijit Mondal', status: 'present' }, { name: 'Priyanka Saha', status: 'absent' },
    { name: 'Sourav Ghosh', status: 'present' },  { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },    { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: pastWorkingDay(7), present: 14, absent: 1, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'present' },  { name: 'Debojyoti Biswas', status: 'present' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'present' },
    { name: 'Arijit Mondal', status: 'present' }, { name: 'Priyanka Saha', status: 'present' },
    { name: 'Sourav Ghosh', status: 'present' },  { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'absent' },     { name: 'Arnab Dutta', status: 'present' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
  { date: pastWorkingDay(8), present: 13, absent: 2, total: 15, details: [
    { name: 'Anirban Patra', status: 'present' }, { name: 'Swarup Bose', status: 'present' },
    { name: 'Saikat Kaity', status: 'absent' },   { name: 'Debojyoti Biswas', status: 'present' },
    { name: 'Rahul Kumar', status: 'present' },   { name: 'Sneha Das', status: 'present' },
    { name: 'Arijit Mondal', status: 'present' }, { name: 'Priyanka Saha', status: 'present' },
    { name: 'Sourav Ghosh', status: 'present' },  { name: 'Tanmay Basu', status: 'present' },
    { name: 'Ritika Sen', status: 'present' },    { name: 'Arnab Dutta', status: 'absent' },
    { name: 'Moumita Roy', status: 'present' },   { name: 'Subhajit Paul', status: 'present' },
    { name: 'Shreya Banerjee', status: 'present' },
  ]},
];
