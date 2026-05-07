/* ══════════════════════════════════════════════════════════
   Chronicles — Static content data for the SNU story page
   Source: https://www.snuniv.ac.in
   ══════════════════════════════════════════════════════════ */

import galleryCampus from '../assets/gallery-campus.png';
import galleryLibrary from '../assets/gallery-library.png';
import galleryLab from '../assets/gallery-lab.png';
import galleryEvent from '../assets/gallery-event.png';
import galleryAuditorium from '../assets/gallery-auditorium.png';
import gallerySports from '../assets/gallery-sports.png';
import galleryClassroom from '../assets/gallery-classroom.png';
import galleryGraduation from '../assets/gallery-graduation.png';

/* ── About ── */
export const ABOUT = {
  title: 'About Sister Nivedita University',
  body: `The Sister Nivedita University was established with a vision in 2017 and it reached greater heights with every passing year. This has ensured that the dynamic image of the University is kept intact by the ever evolving students, faculty members and management.

The motive of the University is to keep an eye on all-round development of an individual and shaping of young minds in a way that is useful to the social circle. The University has its infrastructure and resources to cater to the present generation of students.

We offer conventional courses alongside the new cutting-edge components of learning modules. Sister Nivedita University defines modern learning in a personalized atmosphere.`,
  address: 'DG 1/2 New Town, Action Area 1, Kolkata - 700156',
  phone: '+91 7595044470',
  tollFree: '1800 2588 155',
  email: 'info@snuniv.ac.in',
  website: 'https://www.snuniv.ac.in',
};

/* ── Vision & Mission ── */
export const VISION = {
  statement: 'SNU aspires to provide a transformative impact on the society through its inclusiveness and continuous innovation in education that comes from encouraging creativity, entrepreneurship, and research.',
  pillars: [
    { icon: '🌐', title: 'Inclusive Academics', desc: 'Foster an academic environment that is inclusive both in its design of curriculum and in its dissemination of knowledge.' },
    { icon: '🌱', title: 'Sustainable Growth', desc: 'Create a curriculum that is business connected, but also keenly sensitive to the demands of the environment to achieve sustainable growth.' },
    { icon: '🤝', title: 'Social Equity', desc: 'Develop an educational environment that focuses on all segments of the society, not just on the privileged few.' },
    { icon: '🔬', title: 'Research & Inquiry', desc: 'Develop a community of learners based on quality faculty research, effective teaching pedagogy, and an enquiring student population.' },
  ],
};

export const MISSION = [
  'To provide industry-relevant education with a focus on practical skills and innovation.',
  'To foster research culture and encourage interdisciplinary collaboration.',
  'To create socially responsible citizens who contribute to national development.',
  'To build partnerships with industry and global academic institutions.',
  'To promote inclusiveness and equal opportunity for all learners.',
  'To develop entrepreneurial mindset through incubation and mentorship programs.',
];

/* ── Timeline ── */
export const TIMELINE = [
  { year: '2017', title: 'Foundation Year', desc: 'Sister Nivedita University was established by the Techno India Group under the West Bengal Private University Act, 2017.', icon: '🏛️', color: '#43a047' },
  { year: '2018', title: 'UGC Recognition', desc: 'Received recognition from the University Grants Commission (UGC) under Section 2(f) and 12(B).', icon: '✅', color: '#1e88e5' },
  { year: '2019', title: 'Academic Expansion', desc: 'Launched 30+ undergraduate and postgraduate programs across 5 schools of study.', icon: '📚', color: '#7b1fa2' },
  { year: '2020', title: 'Digital Transformation', desc: 'Rapidly adopted online learning infrastructure during the pandemic, ensuring uninterrupted education for 3000+ students.', icon: '💻', color: '#e65100' },
  { year: '2021', title: 'Research Milestones', desc: 'Published 200+ research papers in national and international journals. Established the Centre for Interdisciplinary Studies.', icon: '🔬', color: '#00838f' },
  { year: '2022', title: 'NAAC & IQAC', desc: 'Applied for NAAC accreditation. Established Internal Quality Assurance Cell (IQAC) for continuous improvement.', icon: '⭐', color: '#ffa000' },
  { year: '2023', title: 'Campus Expansion', desc: 'Inaugurated new laboratory blocks, advanced sports facilities, a modern auditorium, and smart classrooms.', icon: '🏗️', color: '#c62828' },
  { year: '2024', title: 'Industry Partnerships', desc: 'Signed MoUs with 50+ companies including TCS, Infosys, and Wipro for internships and placements.', icon: '🤝', color: '#1565c0' },
  { year: '2025', title: 'NIRF Ranked', desc: 'Achieved NIRF ranking recognition across Law, Pharmacy, and Overall categories. Launched NCC unit.', icon: '🏆', color: '#6a1b9a' },
  { year: '2026', title: 'Global Vision', desc: 'Expanding international collaborations, launching WILP programs, and crossing 5000+ enrolled students across 50+ programs.', icon: '🌍', color: '#2e7d32' },
];

/* ── Achievements / Stats ── */
export const ACHIEVEMENTS = [
  { value: 7, suffix: '', label: 'Schools of Study', icon: '🎓', color: '#43a047' },
  { value: 50, suffix: '+', label: 'Academic Programs', icon: '📖', color: '#1e88e5' },
  { value: 5000, suffix: '+', label: 'Students Enrolled', icon: '👨‍🎓', color: '#7b1fa2' },
  { value: 300, suffix: '+', label: 'Expert Faculty', icon: '👩‍🏫', color: '#e65100' },
  { value: 200, suffix: '+', label: 'Research Papers', icon: '📄', color: '#c62828' },
  { value: 50, suffix: '+', label: 'Industry Partners', icon: '🏢', color: '#00838f' },
];

/* ── Schools ── */
export const SCHOOLS = [
  { name: 'School of Science & Technology', abbr: 'SST', icon: '🔬', color: '#1e88e5', desc: 'Offering programs in Computer Science, IT, Electronics, Mathematics, and Physics with state-of-the-art laboratories.', programs: ['B.Tech CSE', 'B.Tech ECE', 'B.Sc IT', 'MCA', 'M.Tech'] },
  { name: 'School of Arts, Media & Design', abbr: 'SAMD', icon: '🎨', color: '#e91e63', desc: 'Nurturing creative minds through programs in Media, Journalism, Film-Making, and Visual Arts.', programs: ['BA Media', 'BFA', 'MA Mass Comm', 'B.Des'] },
  { name: 'School of Law, Business & Governance', abbr: 'SLBG', icon: '⚖️', color: '#ff8f00', desc: 'Preparing future leaders with programs in Law, Management, Commerce, and Public Administration.', programs: ['BBA LLB', 'BA LLB', 'LLM', 'BBA', 'MBA'] },
  { name: 'School of Life, Agricultural & Biotech Sciences', abbr: 'SLABS', icon: '🧬', color: '#2e7d32', desc: 'Advancing research and education in Biotechnology, Microbiology, Agriculture, and Environmental Sciences.', programs: ['B.Sc Biotech', 'B.Sc Micro', 'M.Sc Biotech'] },
  { name: 'School of Humanities, Languages & Social Sciences', abbr: 'SHLSS', icon: '📜', color: '#6a1b9a', desc: 'Fostering critical thinking through programs in English, Political Science, Psychology, and Social Work.', programs: ['BA English', 'BA Pol. Sci', 'MA Psychology', 'MSW'] },
  { name: 'School of Nursing, Health & Pharma Sciences', abbr: 'SNHPS', icon: '💊', color: '#d32f2f', desc: 'Training healthcare professionals with cutting-edge programs in Nursing, Pharmacy, and Allied Health Sciences.', programs: ['B.Pharm', 'D.Pharm', 'B.Sc Nursing', 'M.Pharm'] },
  { name: 'School of Lifelong Learning', abbr: 'SLL', icon: '📘', color: '#00695c', desc: 'Offering flexible, distance, and continuing education programs for working professionals and lifelong learners.', programs: ['Certificate Programs', 'Diploma Courses', 'WILP'] },
];

/* ── Gallery (8 images) ── */
export const GALLERY = [
  { id: 1, src: galleryCampus, title: 'Main Campus Building', category: 'campus', desc: 'The iconic main building of Sister Nivedita University at New Town, Kolkata.' },
  { id: 2, src: galleryLibrary, title: 'Central Library', category: 'facilities', desc: 'A modern library with over 50,000 books, digital resources, and quiet study zones.' },
  { id: 3, src: galleryLab, title: 'Research Laboratory', category: 'facilities', desc: 'Advanced labs equipped with cutting-edge instruments for hands-on learning and research.' },
  { id: 4, src: galleryClassroom, title: 'Smart Classroom', category: 'facilities', desc: 'Technology-enabled classrooms with interactive whiteboards and multimedia projectors.' },
  { id: 5, src: galleryAuditorium, title: 'University Auditorium', category: 'campus', desc: 'A grand auditorium hosting convocations, seminars, and cultural events with 500+ seating.' },
  { id: 6, src: gallerySports, title: 'Sports Complex', category: 'campus', desc: 'Multi-sport complex with football field, cricket pitch, basketball courts, and athletics track.' },
  { id: 7, src: galleryEvent, title: 'Cultural Festival — Utsav', category: 'events', desc: 'Annual cultural fest bringing together music, dance, drama, and art from all departments.' },
  { id: 8, src: galleryGraduation, title: 'Convocation Ceremony', category: 'events', desc: 'Annual graduation ceremony celebrating the achievements of our graduating students.' },
];

/* ── Gallery categories ── */
export const GALLERY_CATEGORIES = ['all', 'campus', 'facilities', 'events'];

/* ── Leadership ── */
export const LEADERSHIP = {
  founder: 'Techno India Group',
  founderDesc: 'Sister Nivedita University was founded by the Techno India Group, one of the leading educational conglomerates in Eastern India with over 30 years of excellence in education.',
  chancellor: 'As per West Bengal Private University Act',
  established: '2017',
  recognition: 'UGC Recognized | AICTE Approved | BCI & PCI Approved',
};
