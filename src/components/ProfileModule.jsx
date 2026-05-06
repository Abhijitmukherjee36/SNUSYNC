import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiLogOut, FiX, FiUpload, FiCheck, FiCrop, FiZoomIn, FiZoomOut, FiMove } from 'react-icons/fi';

/* ═══════════════════════════════════════════════════════
   CropTool — high-performance canvas-based circular crop
   ✦ RAF-batched drawing (no redundant paints)
   ✦ Pre-rendered dimmed layer via OffscreenCanvas
   ✦ Smooth pinch-to-zoom + scroll-to-resize
   ✦ Grid overlay for precise alignment
═══════════════════════════════════════════════════════ */
function CropTool({ src, onApply, onCancel }) {
  const CANVAS_SIZE = 320;
  const canvasRef   = useRef(null);
  const imgRef      = useRef(null);
  const dimmedRef   = useRef(null);   // pre-rendered dimmed image
  const loadedRef   = useRef(false);
  const rafIdRef    = useRef(null);   // requestAnimationFrame ID
  const dirtyRef    = useRef(true);   // dirty flag for RAF batching
  const dragging    = useRef(false);
  const lastPinch   = useRef(null);   // for pinch-to-zoom
  const [showGrid, setShowGrid] = useState(true);

  // Crop state in refs for zero-cost reads during draw
  const posRef = useRef({ x: 0.5, y: 0.5 });
  const radRef = useRef(0.38);

  // State to force UI re-render (slider sync)
  const [radiusUI, setRadiusUI] = useState(0.38);

  /* ── Mark dirty & schedule RAF ── */
  const scheduleDraw = useCallback(() => {
    dirtyRef.current = true;
  }, []);

  /* ── Core draw (only called from RAF loop) ── */
  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    const dimmed = dimmedRef.current;
    if (!canvas || !img || !loadedRef.current) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const { x, y } = posRef.current;
    const r  = radRef.current * Math.min(W, H);
    const cx = x * W, cy = y * H;

    ctx.clearRect(0, 0, W, H);

    // 1. Pre-rendered dimmed background (single drawImage, no alpha per-frame)
    if (dimmed) {
      ctx.drawImage(dimmed, 0, 0, W, H);
    }

    // 2. Bright image inside crop circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, 0, 0, W, H);
    ctx.restore();

    // 3. Grid lines inside circle (rule-of-thirds)
    if (showGrid) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = 'rgba(255,255,255,.18)';
      ctx.lineWidth = 0.8;
      for (let i = 1; i <= 2; i++) {
        const frac = i / 3;
        // vertical
        const vx = cx - r + frac * r * 2;
        ctx.beginPath(); ctx.moveTo(vx, cy - r); ctx.lineTo(vx, cy + r); ctx.stroke();
        // horizontal
        const hy = cy - r + frac * r * 2;
        ctx.beginPath(); ctx.moveTo(cx - r, hy); ctx.lineTo(cx + r, hy); ctx.stroke();
      }
      ctx.restore();
    }

    // 4. Dashed circle border + subtle glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.shadowColor = 'rgba(108,92,231,.4)';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = 'rgba(255,255,255,.95)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 5. Cross-hair at center
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
    ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10);
    ctx.strokeStyle = 'rgba(255,255,255,.6)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 6. Crop size label
    const pct = Math.round(radRef.current * 200);
    ctx.font = '600 11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.textAlign = 'center';
    ctx.fillText(`${pct}%`, cx, cy + r + 16);
  }, [showGrid]);

  /* ── RAF loop ── */
  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      if (dirtyRef.current) {
        dirtyRef.current = false;
        paint();
      }
      rafIdRef.current = requestAnimationFrame(loop);
    };
    rafIdRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(rafIdRef.current); };
  }, [paint]);

  /* ── Build pre-rendered dimmed image ── */
  const buildDimmed = useCallback((img, W, H) => {
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const octx = off.getContext('2d');
    octx.globalAlpha = 0.25;
    octx.drawImage(img, 0, 0, W, H);
    dimmedRef.current = off;
  }, []);

  /* ── Load image ── */
  useEffect(() => {
    const img = new Image();
    let cancelled = false;
    img.onload = () => {
      if (cancelled) return;
      imgRef.current  = img;
      loadedRef.current = true;
      buildDimmed(img, CANVAS_SIZE, CANVAS_SIZE);
      scheduleDraw();
    };
    img.src = src;
    return () => { cancelled = true; };
  }, [src, buildDimmed, scheduleDraw]);

  /* ── Pointer helpers ── */
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left)  / rect.width,
      y: (clientY - rect.top)   / rect.height,
    };
  };

  const onDown = (e) => {
    dragging.current = true;
    // Pinch-to-zoom: track initial distance between two touches
    if (e.touches && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinch.current = { dist: Math.hypot(dx, dy), rad: radRef.current };
    }
  };

  const onMove = (e) => {
    if (!dragging.current) return;
    e.preventDefault();

    // Pinch-to-zoom
    if (e.touches && e.touches.length === 2 && lastPinch.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / lastPinch.current.dist;
      const newRad = Math.max(0.12, Math.min(0.49, lastPinch.current.rad * scale));
      radRef.current = newRad;
      setRadiusUI(newRad);
      scheduleDraw();
      return;
    }

    // Single-finger/mouse drag
    const p = getPos(e);
    const r = radRef.current;
    posRef.current = {
      x: Math.max(r, Math.min(1 - r, p.x)),
      y: Math.max(r, Math.min(1 - r, p.y)),
    };
    scheduleDraw();
  };

  const onUp = () => { dragging.current = false; lastPinch.current = null; };

  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.015 : -0.015;
    const newRad = Math.max(0.12, Math.min(0.49, radRef.current + delta));
    radRef.current = newRad;
    setRadiusUI(newRad);
    scheduleDraw();
  };

  /* ── Slider for radius ── */
  const handleSlider = (e) => {
    const v = parseFloat(e.target.value);
    radRef.current = v;
    setRadiusUI(v);
    scheduleDraw();
  };

  /* ── Apply: render cropped circle to output canvas ── */
  const handleApply = () => {
    const img = imgRef.current;
    if (!img) return;
    const W = CANVAS_SIZE, H = CANVAS_SIZE;
    const { x, y } = posRef.current;
    const r  = radRef.current * Math.min(W, H);
    const cx = x * W, cy = y * H;

    // Scale canvas px → source image px
    const sx = img.naturalWidth  / W;
    const sy = img.naturalHeight / H;

    const size = Math.round(r * 2);
    const out  = document.createElement('canvas');
    out.width  = size;
    out.height = size;
    const ctx2 = out.getContext('2d');

    ctx2.beginPath();
    ctx2.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx2.clip();

    ctx2.drawImage(
      img,
      (cx - r) * sx, (cy - r) * sy, r * 2 * sx, r * 2 * sy,
      0, 0, size, size,
    );

    onApply(out.toDataURL('image/png'));
  };

  return (
    <div className="crop-tool">
      <p className="crop-hint">
        <FiMove style={{ verticalAlign: 'middle', marginRight: 4 }} />
        Drag to reposition · Scroll to resize
      </p>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE} height={CANVAS_SIZE}
        className="crop-canvas"
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
        onWheel={onWheel}
      />
      {/* Zoom slider + grid toggle */}
      <div className="crop-controls">
        <FiZoomOut className="crop-zoom-icon" />
        <input
          type="range" min="0.12" max="0.49" step="0.005"
          value={radiusUI}
          onChange={handleSlider}
          className="crop-slider"
        />
        <FiZoomIn className="crop-zoom-icon" />
        <button
          className={`crop-grid-btn ${showGrid ? 'active' : ''}`}
          onClick={() => setShowGrid(g => !g)}
          title="Toggle grid"
        >
          ⊞
        </button>
      </div>
      <div className="crop-btns">
        <button className="prof-discard-btn" onClick={onCancel}><FiX /> Cancel</button>
        <button className="prof-save-btn"    onClick={handleApply}><FiCheck /> Apply Crop</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ProfileModule — main component
═══════════════════════════════════════════════════════ */
export default function ProfileModule({ name = 'Abhijit Mukherjee', role = 'Teacher' }) {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);
  const modalRef  = useRef(null);

  const [open,       setOpen]       = useState(false);
  const [avatarSrc,  setAvatarSrc]  = useState(null);   // saved photo
  const [rawSrc,     setRawSrc]     = useState(null);   // original file (for crop)
  const [croppedSrc, setCroppedSrc] = useState(null);   // after crop, before save
  // phase: 'idle' | 'crop' | 'preview'
  const [phase,      setPhase]      = useState('idle');
  const [saved,      setSaved]      = useState(false);
  const [fullview,   setFullview]   = useState(false);  // WhatsApp-style lightbox

  /* Close modal on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* Lock body scroll when fullview is open */
  useEffect(() => {
    document.body.style.overflow = fullview ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [fullview]);

  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  /* ── File picked → go to crop ── */
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawSrc(ev.target.result);
      setPhase('crop');
    };
    reader.readAsDataURL(f);
    if (fileRef.current) fileRef.current.value = '';
  };

  /* ── Crop applied → preview ── */
  const handleCropApply = (dataUrl) => {
    setCroppedSrc(dataUrl);
    setPhase('preview');
  };

  /* ── Save cropped photo ── */
  const handleSave = () => {
    setAvatarSrc(croppedSrc);
    setCroppedSrc(null);
    setRawSrc(null);
    setPhase('idle');
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  /* ── Discard / go back to crop ── */
  const handleRecrop  = () => setPhase('crop');
  const handleDiscard = () => { setRawSrc(null); setCroppedSrc(null); setPhase('idle'); };

  const handleLogout = () => { setOpen(false); navigate('/'); };

  /* Avatar source shown in the chip and modal */
  const displaySrc = phase === 'preview' ? croppedSrc : avatarSrc;

  return (
    <div className="prof-wrap">
      {/* ── Header chip ── */}
      <button className="prof-chip" onClick={() => setOpen(p => !p)} title="Profile">
        {displaySrc
          ? <img src={displaySrc} alt="avatar" className="prof-chip-img" />
          : <span className="prof-chip-initials">{initials}</span>}
      </button>

      {/* ── Profile modal ── */}
      {open && (
        <div className="prof-modal-overlay">
          <div className="prof-modal" ref={modalRef}>
            <button className="prof-close" onClick={() => setOpen(false)}><FiX /></button>

            {/* ── Crop phase ── */}
            {phase === 'crop' && rawSrc && (
              <CropTool
                src={rawSrc}
                onApply={handleCropApply}
                onCancel={handleDiscard}
              />
            )}

            {/* ── Idle / Preview phase: show avatar + controls ── */}
            {phase !== 'crop' && (
              <>
                {/* Avatar ring — clickable when photo saved */}
                <div className="prof-avatar-wrap">
                  <div
                    className={`prof-avatar-ring ${avatarSrc ? 'prof-avatar-clickable' : ''}`}
                    onClick={() => { if (avatarSrc) setFullview(true); }}
                    title={avatarSrc ? 'View full photo' : ''}
                  >
                    {displaySrc
                      ? <img src={displaySrc} alt="avatar" className="prof-avatar-img" />
                      : <span className="prof-avatar-initials">{initials}</span>}
                    {avatarSrc && <div className="prof-avatar-zoom-hint">🔍</div>}
                    <button
                      className="prof-camera-btn"
                      onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                      title="Change photo"
                    >
                      <FiCamera />
                    </button>
                  </div>
                  <input
                    ref={fileRef} type="file" accept="image/*"
                    style={{ display: 'none' }} onChange={handleFileChange}
                  />
                </div>

                {/* Name + role */}
                <div className="prof-identity">
                  <p className="prof-name">{name}</p>
                  <span className="prof-role">{role}</span>
                </div>

                {/* Pills */}
                <div className="prof-pills">
                  <span className="prof-pill prof-pill-dept">📚 Computer Science</span>
                  <span className="prof-pill prof-pill-id">🪪 EMP-2025-AM</span>
                </div>

                {/* Preview phase actions */}
                {phase === 'preview' && (
                  <div className="prof-preview-actions">
                    <p className="prof-preview-label">Cropped preview — looks good?</p>
                    <div className="prof-preview-btns">
                      <button className="prof-discard-btn" onClick={handleRecrop}><FiCrop /> Re-crop</button>
                      <button className="prof-discard-btn" onClick={handleDiscard}><FiX /> Discard</button>
                      <button className="prof-save-btn"    onClick={handleSave}>  <FiCheck /> Save</button>
                    </div>
                  </div>
                )}

                {/* Saved toast */}
                {saved && (
                  <div className="prof-saved-toast"><FiCheck /> Profile photo updated!</div>
                )}

                <div className="prof-divider" />

                {/* Action buttons */}
                <div className="prof-actions">
                  <button className="prof-action-btn prof-action-change" onClick={() => fileRef.current?.click()}>
                    <FiUpload /> Change Profile Picture
                  </button>
                  <button className="prof-action-btn prof-action-logout" onClick={handleLogout}>
                    <FiLogOut /> Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── WhatsApp-style fullview lightbox ── */}
      {fullview && avatarSrc && (
        <div className="prof-fullview" onClick={() => setFullview(false)}>
          <button className="prof-fullview-close" onClick={() => setFullview(false)}><FiX /></button>
          <div className="prof-fullview-inner" onClick={e => e.stopPropagation()}>
            <img src={avatarSrc} alt="Profile" className="prof-fullview-img" />
            <p className="prof-fullview-name">{name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
