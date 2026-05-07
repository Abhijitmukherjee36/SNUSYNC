import { useState, useEffect, useRef, useCallback } from 'react';
import { FiMapPin, FiPhone, FiMail, FiGlobe, FiX, FiChevronLeft, FiChevronRight, FiExternalLink, FiArrowRight } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout';
import {
  ABOUT, VISION, MISSION, TIMELINE, ACHIEVEMENTS,
  SCHOOLS, GALLERY, GALLERY_CATEGORIES, LEADERSHIP,
} from '../../data/chroniclesData';

const TABS = [
  { id: 'about',        label: '🏛️ About',          short: 'About' },
  { id: 'vision',       label: '🔭 Vision & Mission', short: 'Vision' },
  { id: 'timeline',     label: '📅 Timeline',        short: 'Timeline' },
  { id: 'achievements', label: '🏆 Achievements',    short: 'Achievements' },
  { id: 'schools',      label: '🎓 Schools',         short: 'Schools' },
  { id: 'gallery',      label: '📸 Gallery',         short: 'Gallery' },
];

/* ═══════════════════════════════════════════════
   Animated Counter Hook
   ═══════════════════════════════════════════════ */
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) { setCount(0); return; }
    let startTime = null;
    let cancelled = false;
    const step = (ts) => {
      if (cancelled) return;
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    return () => { cancelled = true; };
  }, [target, duration, start]);
  return count;
}

/* ── Stat Card ── */
function StatCard({ value, suffix, label, icon, color, animate, delay }) {
  const count = useCounter(value, 1800 + delay * 200, animate);
  return (
    <div className="ch-stat-card" style={{ animationDelay: `${delay * 80}ms` }}>
      <div className="ch-stat-icon" style={{ background: `${color}15`, color }}>{icon}</div>
      <span className="ch-stat-value" style={{ color }}>{count}{suffix}</span>
      <span className="ch-stat-label">{label}</span>
      <div className="ch-stat-bar" style={{ background: color }} />
    </div>
  );
}

/* ── School Card ── */
function SchoolCard({ school, onClick, delay }) {
  return (
    <div
      className="ch-school-card"
      onClick={onClick}
      style={{ animationDelay: `${delay * 60}ms` }}
    >
      <div className="ch-school-accent" style={{ background: school.color }} />
      <div className="ch-school-body">
        <div className="ch-school-head">
          <div className="ch-school-icon" style={{ background: `${school.color}12`, color: school.color }}>
            {school.icon}
          </div>
          <div>
            <h4 className="ch-school-name">{school.name}</h4>
            <span className="ch-school-abbr" style={{ color: school.color }}>{school.abbr}</span>
          </div>
        </div>
        <p className="ch-school-desc">{school.desc}</p>
        <div className="ch-school-programs">
          {school.programs.slice(0, 3).map(p => (
            <span key={p} className="ch-school-tag" style={{ background: `${school.color}10`, color: school.color }}>{p}</span>
          ))}
          {school.programs.length > 3 && (
            <span className="ch-school-tag ch-school-more" style={{ color: school.color }}>+{school.programs.length - 3}</span>
          )}
        </div>
        <button className="ch-school-btn" style={{ color: school.color }}>
          View Details <FiArrowRight style={{ fontSize: 12 }} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ChroniclesPage — Main Component
   ═══════════════════════════════════════════════ */
export default function ChroniclesPage() {
  const [activeTab, setActiveTab] = useState('about');
  const [lightbox, setLightbox] = useState(null);
  const [schoolModal, setSchoolModal] = useState(null);
  const [animateStats, setAnimateStats] = useState(false);
  const [visibleTL, setVisibleTL] = useState(new Set());
  const [galleryFilter, setGalleryFilter] = useState('all');
  const statsRef = useRef(null);

  /* ── Animate stats on tab switch ── */
  useEffect(() => {
    if (activeTab === 'achievements') {
      setAnimateStats(false);
      const t = setTimeout(() => setAnimateStats(true), 150);
      return () => clearTimeout(t);
    }
  }, [activeTab]);

  /* ── Animate timeline items ── */
  useEffect(() => {
    if (activeTab !== 'timeline') { setVisibleTL(new Set()); return; }
    // Stagger reveal timeline items
    const timers = TIMELINE.map((_, i) =>
      setTimeout(() => setVisibleTL(prev => new Set(prev).add(i)), 120 * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, [activeTab]);

  /* ── Lightbox nav ── */
  const filteredGallery = galleryFilter === 'all'
    ? GALLERY
    : GALLERY.filter(g => g.category === galleryFilter);

  const navLightbox = useCallback((dir) => {
    if (lightbox === null) return;
    const len = filteredGallery.length;
    setLightbox((lightbox + dir + len) % len);
  }, [lightbox, filteredGallery.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') navLightbox(1);
      if (e.key === 'ArrowLeft') navLightbox(-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, navLightbox]);

  /* ═══════ RENDER TABS ═══════ */

  const renderAbout = () => (
    <div className="ch-section ch-about-section">
      <div className="ch-about-main">
        <h3 className="ch-section-title">{ABOUT.title}</h3>
        {ABOUT.body.split('\n\n').map((p, i) => (
          <p key={i} className="ch-about-para">{p}</p>
        ))}
        <div className="ch-about-recognition">
          <span className="ch-recog-badge">🏛️ {LEADERSHIP.recognition}</span>
          <span className="ch-recog-badge">📅 Est. {LEADERSHIP.established}</span>
          <span className="ch-recog-badge">🏢 {LEADERSHIP.founder}</span>
        </div>
        {/* Quick CTA */}
        <div className="ch-about-cta">
          <button className="ch-cta-btn" onClick={() => setActiveTab('timeline')}>
            Explore Our Journey <FiArrowRight />
          </button>
          <button className="ch-cta-btn ch-cta-secondary" onClick={() => setActiveTab('gallery')}>
            View Campus Gallery <FiArrowRight />
          </button>
        </div>
      </div>
      <div className="ch-about-sidebar">
        <div className="ch-contact-card">
          <h4 className="ch-contact-title">📍 Contact Info</h4>
          <div className="ch-contact-row"><FiMapPin className="ch-contact-icon" /><span>{ABOUT.address}</span></div>
          <div className="ch-contact-row"><FiPhone className="ch-contact-icon" /><span>{ABOUT.phone}</span></div>
          <div className="ch-contact-row"><FiPhone className="ch-contact-icon" /><span>{ABOUT.tollFree} (Toll Free)</span></div>
          <div className="ch-contact-row"><FiMail className="ch-contact-icon" /><span>{ABOUT.email}</span></div>
          <a href={ABOUT.website} target="_blank" rel="noopener noreferrer" className="ch-contact-link">
            <FiGlobe className="ch-contact-icon" /> Visit Website <FiExternalLink style={{ fontSize: 12 }} />
          </a>
        </div>
        <div className="ch-quick-stats">
          {ACHIEVEMENTS.slice(0, 4).map((a, i) => (
            <div key={i} className="ch-qs-item">
              <span className="ch-qs-icon">{a.icon}</span>
              <div>
                <strong>{a.value}{a.suffix}</strong>
                <span>{a.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVision = () => (
    <div className="ch-section ch-vision-section">
      <div className="ch-vision-block">
        <div className="ch-vision-header">
          <span className="ch-vision-emoji">🔭</span>
          <h3 className="ch-section-title">Our Vision</h3>
        </div>
        <blockquote className="ch-vision-statement">{VISION.statement}</blockquote>
        <div className="ch-pillars-grid">
          {VISION.pillars.map((p, i) => (
            <div key={i} className="ch-pillar-card" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="ch-pillar-icon">{p.icon}</span>
              <h4 className="ch-pillar-title">{p.title}</h4>
              <p className="ch-pillar-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="ch-mission-block">
        <div className="ch-vision-header">
          <span className="ch-vision-emoji">🎯</span>
          <h3 className="ch-section-title">Our Mission</h3>
        </div>
        <div className="ch-mission-list">
          {MISSION.map((m, i) => (
            <div key={i} className="ch-mission-item" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="ch-mission-num">{String(i + 1).padStart(2, '0')}</span>
              <p>{m}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="ch-section ch-timeline-section">
      <h3 className="ch-section-title ch-tl-heading">Journey of Excellence</h3>
      <p className="ch-tl-subtitle">From foundation to becoming a leading university in Eastern India</p>
      <div className="ch-tl-track">
        <div className="ch-tl-line" />
        {TIMELINE.map((item, i) => (
          <div
            key={i}
            className={`ch-tl-item ${visibleTL.has(i) ? 'ch-tl-visible' : ''}`}
            data-idx={i}
          >
            <div className="ch-tl-dot" style={{ borderColor: item.color, background: `${item.color}15` }}>
              <span className="ch-tl-dot-icon">{item.icon}</span>
            </div>
            <div className="ch-tl-content">
              <div className="ch-tl-year-badge" style={{ background: `${item.color}12`, color: item.color }}>
                {item.year}
              </div>
              <h4 className="ch-tl-title">{item.title}</h4>
              <p className="ch-tl-desc">{item.desc}</p>
            </div>
          </div>
        ))}
        {/* End marker */}
        <div className={`ch-tl-end ${visibleTL.has(TIMELINE.length - 1) ? 'ch-tl-visible' : ''}`}>
          <span>🚀</span>
          <span className="ch-tl-end-text">The journey continues...</span>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="ch-section ch-achieve-section" ref={statsRef}>
      <h3 className="ch-section-title">Achievements & Impact</h3>
      <p className="ch-achieve-subtitle">Numbers that tell our story of growth and excellence</p>
      <div className="ch-stats-grid">
        {ACHIEVEMENTS.map((a, i) => (
          <StatCard key={i} {...a} animate={animateStats} delay={i} />
        ))}
      </div>
      <div className="ch-founder-card">
        <div className="ch-founder-left">
          <div className="ch-founder-icon">🏛️</div>
          <div>
            <h4 className="ch-founder-title">Founded by {LEADERSHIP.founder}</h4>
            <p className="ch-founder-desc">{LEADERSHIP.founderDesc}</p>
          </div>
        </div>
        <div className="ch-founder-badges">
          <span className="ch-founder-badge">📋 UGC Recognized</span>
          <span className="ch-founder-badge">⚙️ AICTE Approved</span>
          <span className="ch-founder-badge">⚖️ BCI Approved</span>
          <span className="ch-founder-badge">💊 PCI Approved</span>
        </div>
      </div>
    </div>
  );

  const renderSchools = () => (
    <div className="ch-section ch-schools-section">
      <h3 className="ch-section-title">Schools of Study</h3>
      <p className="ch-schools-subtitle">7 schools offering 50+ programs across diverse disciplines</p>
      <div className="ch-schools-grid">
        {SCHOOLS.map((s, i) => (
          <SchoolCard key={i} school={s} onClick={() => setSchoolModal(s)} delay={i} />
        ))}
      </div>

      {/* School detail modal */}
      {schoolModal && (
        <div className="ch-modal-overlay" onClick={() => setSchoolModal(null)}>
          <div className="ch-modal" onClick={e => e.stopPropagation()}>
            <button className="ch-modal-close" onClick={() => setSchoolModal(null)}><FiX /></button>
            <div className="ch-modal-header" style={{ background: `linear-gradient(135deg, ${schoolModal.color}20, ${schoolModal.color}08)` }}>
              <span className="ch-modal-icon" style={{ background: `${schoolModal.color}15`, color: schoolModal.color }}>
                {schoolModal.icon}
              </span>
              <div>
                <h3 className="ch-modal-title">{schoolModal.name}</h3>
                <span className="ch-modal-abbr" style={{ color: schoolModal.color }}>{schoolModal.abbr}</span>
              </div>
            </div>
            <div className="ch-modal-body">
              <p className="ch-modal-desc">{schoolModal.desc}</p>
              <h4 className="ch-modal-programs-title">Programs Offered</h4>
              <div className="ch-modal-programs">
                {schoolModal.programs.map(p => (
                  <span key={p} className="ch-modal-tag" style={{ background: `${schoolModal.color}10`, color: schoolModal.color, border: `1px solid ${schoolModal.color}25` }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderGallery = () => (
    <div className="ch-section ch-gallery-section">
      <h3 className="ch-section-title">Campus Gallery</h3>
      <p className="ch-gallery-subtitle">A glimpse into life at Sister Nivedita University</p>

      {/* Category filters */}
      <div className="ch-gallery-filters">
        {GALLERY_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`ch-gf-btn ${galleryFilter === cat ? 'ch-gf-active' : ''}`}
            onClick={() => { setGalleryFilter(cat); setLightbox(null); }}
          >
            {cat === 'all' ? '🔥 All' : cat === 'campus' ? '🏛️ Campus' : cat === 'facilities' ? '🔬 Facilities' : '🎭 Events'}
          </button>
        ))}
      </div>

      <div className="ch-gallery-grid">
        {filteredGallery.map((img, i) => (
          <div
            key={img.id}
            className="ch-gallery-item"
            onClick={() => setLightbox(i)}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <img src={img.src} alt={img.title} className="ch-gallery-img" loading="lazy" />
            <div className="ch-gallery-overlay">
              <span className="ch-gallery-cat">{img.category}</span>
              <h4 className="ch-gallery-title">{img.title}</h4>
              <p className="ch-gallery-desc">{img.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && filteredGallery[lightbox] && (
        <div className="ch-lightbox" onClick={() => setLightbox(null)}>
          <button className="ch-lb-close" onClick={() => setLightbox(null)}><FiX /></button>
          <button className="ch-lb-nav ch-lb-prev" onClick={e => { e.stopPropagation(); navLightbox(-1); }}><FiChevronLeft /></button>
          <div className="ch-lb-content" onClick={e => e.stopPropagation()}>
            <img src={filteredGallery[lightbox].src} alt={filteredGallery[lightbox].title} className="ch-lb-img" />
            <div className="ch-lb-info">
              <h3>{filteredGallery[lightbox].title}</h3>
              <p>{filteredGallery[lightbox].desc}</p>
              <span className="ch-lb-counter">{lightbox + 1} / {filteredGallery.length}</span>
            </div>
          </div>
          <button className="ch-lb-nav ch-lb-next" onClick={e => { e.stopPropagation(); navLightbox(1); }}><FiChevronRight /></button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'about':        return renderAbout();
      case 'vision':       return renderVision();
      case 'timeline':     return renderTimeline();
      case 'achievements': return renderAchievements();
      case 'schools':      return renderSchools();
      case 'gallery':      return renderGallery();
      default:             return renderAbout();
    }
  };

  return (
    <DashboardLayout activeTab="chronicles" fullWidth>
      <div className="ch-page">
        {/* ── Hero Banner ── */}
        <div className="ch-hero">
          <div className="ch-hero-glow" />
          <div className="ch-hero-glow2" />
          <div className="ch-hero-content">
            <span className="ch-hero-badge">📜 Est. 2017 — Kolkata, India</span>
            <h1 className="ch-hero-title">Chronicles of SNU</h1>
            <p className="ch-hero-subtitle">
              The story of Sister Nivedita University — from vision to reality
            </p>
          </div>
          <div className="ch-hero-stats">
            {ACHIEVEMENTS.slice(0, 3).map((a, i) => (
              <div key={i} className="ch-hero-stat">
                <span className="ch-hero-stat-val">{a.value}{a.suffix}</span>
                <span className="ch-hero-stat-lbl">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="ch-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`ch-tab ${activeTab === tab.id ? 'ch-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className="ch-content" key={activeTab}>
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}
