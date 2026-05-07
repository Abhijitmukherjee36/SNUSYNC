import { useState, useRef, useEffect, useCallback } from 'react';
import { FiClock, FiMapPin } from 'react-icons/fi';
import { WEEKLY_SCHEDULE } from '../../data/dashboardData';

const statusCls      = { ongoing: 'ds-ongoing', completed: 'ds-completed', upcoming: 'ds-upcoming' };
const statusLabel    = { ongoing: '▶ In Progress', completed: '✓ Completed', upcoming: '○ Pending' };
const statusBadgeCls = { ongoing: 'ds-badge-ongoing', completed: 'ds-badge-completed', upcoming: 'ds-badge-upcoming' };
const typeCls        = { lecture: 'ds-type-lecture', lab: 'ds-type-lab', tutorial: 'ds-type-tutorial' };

/* Colour accents per type — for the left accent bar */
const typeAccent = {
  lecture:  'linear-gradient(180deg, #42a5f5, #1e88e5)',
  lab:     'linear-gradient(180deg, #ab47bc, #7b1fa2)',
  tutorial: 'linear-gradient(180deg, #ffa726, #f57c00)',
};

/**
 * DailySchedule — premium swipeable carousel with dot navigation
 * ✦ Mouse drag + touch swipe (no arrows)
 * ✦ Dot indicators synced via IntersectionObserver
 * ✦ Functional status pills (click to jump to first card of that type)
 * ✦ Auto-scrolls to ongoing class on mount
 */
export default function DailySchedule() {
  const liveInst      = new Date();
  const todaySchedule = WEEKLY_SCHEDULE[liveInst.getDay()] || [];
  const curMin        = liveInst.getHours() * 60 + liveInst.getMinutes();

  /* ── Status detection ── */
  const getAutoStatus = (timeStr) => {
    const m = timeStr.match(/(\d{2}):(\d{2})\s*[–-]\s*(\d{2}):(\d{2})/);
    if (!m) return 'upcoming';
    const start = parseInt(m[1]) * 60 + parseInt(m[2]);
    const end   = parseInt(m[3]) * 60 + parseInt(m[4]);
    if (curMin >= start && curMin <= end) return 'ongoing';
    if (curMin > end) return 'completed';
    return 'upcoming';
  };

  const [schedOverrides, setSchedOverrides] = useState({});
  const getSlotStatus = useCallback(
    (idx, timeStr) => schedOverrides[idx] ?? getAutoStatus(timeStr),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schedOverrides, curMin]
  );

  const cycleStatus = (idx) => {
    const order = ['upcoming', 'ongoing', 'completed'];
    setSchedOverrides(p => {
      const cur  = p[idx] ?? getAutoStatus(todaySchedule[idx].time);
      const next = order[(order.indexOf(cur) + 1) % order.length];
      return { ...p, [idx]: next };
    });
  };

  /* ── Sorted slots (ongoing first, then upcoming, then completed) ── */
  const sortedSlots = todaySchedule
    .map((slot, i) => ({ slot, origIdx: i }))
    .sort((a, b) => {
      const order = { ongoing: 0, upcoming: 1, completed: 2 };
      return (order[getSlotStatus(a.origIdx, a.slot.time)] ?? 1)
           - (order[getSlotStatus(b.origIdx, b.slot.time)] ?? 1);
    });

  /* ── Carousel state ── */
  const trackRef   = useRef(null);
  const cardRefs   = useRef([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const scrollLeftRef = useRef(0);
  const velocity   = useRef(0);
  const lastX      = useRef(0);
  const lastTime   = useRef(0);
  const rafId      = useRef(null);
  const userScrolling = useRef(false);

  /* ── Scroll to card by visual index ── */
  const scrollToCard = useCallback((idx) => {
    const track = trackRef.current;
    if (!track) return;
    const card = cardRefs.current[idx];
    if (!card) return;
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const offset = cardRect.left - trackRect.left + track.scrollLeft
                   - (trackRect.width / 2) + (cardRect.width / 2);
    track.scrollTo({ left: offset, behavior: 'smooth' });
    setActiveIdx(idx);
  }, []);

  /* ── IntersectionObserver for accurate dot sync ── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || sortedSlots.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (userScrolling.current) return;
        // Find the most visible card
        let bestIdx = 0;
        let bestRatio = 0;
        entries.forEach((entry) => {
          const idx = parseInt(entry.target.dataset.cardIdx, 10);
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIdx = idx;
          }
        });
        if (bestRatio > 0.3) {
          setActiveIdx(bestIdx);
        }
      },
      {
        root: track,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [sortedSlots.length, schedOverrides]);

  /* ── Fallback: scroll-based dot tracking ── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let scrollTimer;
    const handler = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (isDragging.current) return;
        // Find which card is most centred
        const trackCenter = track.scrollLeft + track.offsetWidth / 2;
        let closestIdx = 0;
        let closestDist = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const dist = Math.abs(cardCenter - trackCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = i;
          }
        });
        setActiveIdx(closestIdx);
      }, 60);
    };
    track.addEventListener('scroll', handler, { passive: true });
    return () => { track.removeEventListener('scroll', handler); clearTimeout(scrollTimer); };
  }, [sortedSlots.length, schedOverrides]);

  /* ── Auto-scroll to ongoing card on mount ── */
  useEffect(() => {
    const ongoingIdx = sortedSlots.findIndex(
      ({ slot, origIdx }) => getSlotStatus(origIdx, slot.time) === 'ongoing'
    );
    if (ongoingIdx >= 0) {
      // Small delay so cards have rendered
      requestAnimationFrame(() => scrollToCard(ongoingIdx));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Mouse drag ── */
  const onMouseDown = (e) => {
    isDragging.current = true;
    userScrolling.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftRef.current = trackRef.current.scrollLeft;
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    velocity.current = 0;
    trackRef.current.style.cursor = 'grabbing';
    trackRef.current.style.scrollSnapType = 'none';
    if (rafId.current) cancelAnimationFrame(rafId.current);
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    trackRef.current.scrollLeft = scrollLeftRef.current - walk;

    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = (e.pageX - lastX.current) / dt;
    }
    lastX.current = e.pageX;
    lastTime.current = now;
  };

  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    trackRef.current.style.cursor = 'grab';

    const track = trackRef.current;
    let vel = velocity.current * 15;
    const decelerate = () => {
      if (Math.abs(vel) < 0.5) {
        track.style.scrollSnapType = 'x mandatory';
        userScrolling.current = false;
        // Snap to nearest card
        snapToNearest();
        return;
      }
      track.scrollLeft -= vel;
      vel *= 0.92;
      rafId.current = requestAnimationFrame(decelerate);
    };
    rafId.current = requestAnimationFrame(decelerate);
  };

  /* ── Touch drag ── */
  const onTouchStart = (e) => {
    isDragging.current = true;
    userScrolling.current = true;
    startX.current = e.touches[0].pageX - trackRef.current.offsetLeft;
    scrollLeftRef.current = trackRef.current.scrollLeft;
    lastX.current = e.touches[0].pageX;
    lastTime.current = Date.now();
    velocity.current = 0;
    trackRef.current.style.scrollSnapType = 'none';
  };

  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    trackRef.current.scrollLeft = scrollLeftRef.current - walk;

    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = (e.touches[0].pageX - lastX.current) / dt;
    }
    lastX.current = e.touches[0].pageX;
    lastTime.current = now;
  };

  const onTouchEnd = () => {
    isDragging.current = false;
    const track = trackRef.current;
    let vel = velocity.current * 12;
    const decelerate = () => {
      if (Math.abs(vel) < 0.5) {
        track.style.scrollSnapType = 'x mandatory';
        userScrolling.current = false;
        snapToNearest();
        return;
      }
      track.scrollLeft -= vel;
      vel *= 0.92;
      rafId.current = requestAnimationFrame(decelerate);
    };
    rafId.current = requestAnimationFrame(decelerate);
  };

  /* ── Snap to nearest card after drag ── */
  const snapToNearest = () => {
    const track = trackRef.current;
    if (!track) return;
    const trackCenter = track.scrollLeft + track.offsetWidth / 2;
    let closestIdx = 0;
    let closestDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - trackCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });
    scrollToCard(closestIdx);
  };

  /* ── Count by status ── */
  const counts = { ongoing: 0, completed: 0, upcoming: 0 };
  sortedSlots.forEach(({ slot, origIdx }) => {
    const s = getSlotStatus(origIdx, slot.time);
    if (counts[s] !== undefined) counts[s]++;
  });

  /* ── Pill click → scroll to first card of that status ── */
  const scrollToStatus = (targetStatus) => {
    const idx = sortedSlots.findIndex(
      ({ slot, origIdx }) => getSlotStatus(origIdx, slot.time) === targetStatus
    );
    if (idx >= 0) scrollToCard(idx);
  };

  /* ── Filter label for non-class count ── */
  const classCount = todaySchedule.length;

  return (
    <div className="ds-wrap">
      <div className="ds-header">
        <div className="ds-header-left">
          <h2 className="ds-title">Daily Schedule</h2>
          <p className="ds-subtitle">
            {classCount} classes today
          </p>
        </div>
        {classCount > 0 && (
          <div className="ds-header-pills">
            {counts.ongoing > 0 && (
              <button
                className="ds-pill ds-pill-live"
                onClick={() => scrollToStatus('ongoing')}
              >
                <span className="ds-pill-dot ds-dot-live" />
                {counts.ongoing} Live
              </button>
            )}
            {counts.upcoming > 0 && (
              <button
                className="ds-pill ds-pill-upcoming"
                onClick={() => scrollToStatus('upcoming')}
              >
                {counts.upcoming} Upcoming
              </button>
            )}
            {counts.completed > 0 && (
              <button
                className="ds-pill ds-pill-done"
                onClick={() => scrollToStatus('completed')}
              >
                {counts.completed} Done
              </button>
            )}
          </div>
        )}
      </div>

      {classCount > 0 ? (
        <>
          {/* ── Carousel track ── */}
          <div
            className="ds-track"
            ref={trackRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {sortedSlots.map(({ slot, origIdx }, visualIdx) => {
              const status = getSlotStatus(origIdx, slot.time);
              const accent = typeAccent[slot.type.toLowerCase()] || typeAccent.lecture;

              return (
                <div
                  key={origIdx}
                  data-card-idx={visualIdx}
                  ref={(el) => { cardRefs.current[visualIdx] = el; }}
                  className={`ds-card ${statusCls[status]}`}
                >
                  {/* Accent bar */}
                  <div className="ds-accent" style={{ background: accent }} />

                  {/* Content */}
                  <div className="ds-card-body">
                    {/* Top row: time + LIVE badge */}
                    <div className="ds-card-top">
                      <span className="ds-time">
                        <FiClock className="ds-time-icon" />
                        {slot.time}
                      </span>
                      {status === 'ongoing' && (
                        <span className="ds-live-badge">
                          <span className="ds-live-pulse" />
                          LIVE
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    <h3 className="ds-subject">{slot.subject}</h3>
                    {slot.code && <span className="ds-code">{slot.code}</span>}

                    {/* Room */}
                    <span className="ds-room">
                      <FiMapPin className="ds-room-icon" />
                      {slot.room}
                    </span>

                    {/* Footer: type badge + status */}
                    <div className="ds-card-footer">
                      <span className={`ds-type ${typeCls[slot.type.toLowerCase()] || ''}`}>
                        {slot.type}
                      </span>
                      <button
                        className={`ds-status ${statusBadgeCls[status]}`}
                        onClick={(e) => { e.stopPropagation(); cycleStatus(origIdx); }}
                      >
                        {statusLabel[status]}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Dot indicators ── */}
          <div className="ds-dots">
            {sortedSlots.map((_, i) => (
              <button
                key={i}
                className={`ds-dot ${i === activeIdx ? 'ds-dot-active' : ''}`}
                onClick={() => scrollToCard(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="ds-empty">
          <span className="ds-empty-emoji">🎉</span>
          <p>No classes today — enjoy your day off!</p>
        </div>
      )}
    </div>
  );
}
