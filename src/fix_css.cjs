const fs = require('fs');
let c = fs.readFileSync('src/pages/Dashboard.css', 'utf8');

// Remove old chronicles CSS
const startMarker = '/* ══════════════════════════════════════════════════════════\n   CHRONICLES PAGE';
const startIdx = c.indexOf(startMarker);
if (startIdx < 0) { console.log('NOT FOUND'); process.exit(1); }
c = c.slice(0, startIdx);

// New CSS
const css = `/* ══════════════════════════════════════════════════════════
   CHRONICLES PAGE — v2 Enhanced
   ══════════════════════════════════════════════════════════ */
.ch-page { display:flex; flex-direction:column; gap:0; animation:chFadeIn .4s ease both; }
@keyframes chFadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes chSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes chSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes chPop { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }

/* ── Hero ── */
.ch-hero{background:linear-gradient(145deg,rgba(67,160,71,.45)0%,rgba(46,125,50,.55)40%,rgba(27,94,32,.4)100%);border-radius:22px;padding:36px 32px 28px;position:relative;overflow:hidden;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap}
.ch-hero-glow{position:absolute;top:-60px;left:-60px;width:250px;height:250px;background:radial-gradient(circle,rgba(255,255,255,.18)0%,transparent 70%);pointer-events:none}
.ch-hero-glow2{position:absolute;bottom:-80px;right:-40px;width:200px;height:200px;background:radial-gradient(circle,rgba(255,255,255,.1)0%,transparent 70%);pointer-events:none}
.ch-hero-content{position:relative;z-index:1}
.ch-hero-badge{display:inline-block;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;background:rgba(255,255,255,.2);backdrop-filter:blur(6px);padding:4px 14px;border-radius:20px;color:rgba(255,255,255,.9);margin-bottom:10px;letter-spacing:.3px}
.ch-hero-title{font-family:'Playfair Display',serif;font-size:34px;font-weight:800;color:#fff;margin:0 0 6px;line-height:1.15;text-shadow:0 2px 12px rgba(0,0,0,.15)}
.ch-hero-subtitle{font-family:'Inter',sans-serif;font-size:14px;color:rgba(255,255,255,.8);margin:0;font-weight:400}
.ch-hero-stats{display:flex;gap:24px;position:relative;z-index:1}
.ch-hero-stat{display:flex;flex-direction:column;align-items:center;gap:2px}
.ch-hero-stat-val{font-family:'Playfair Display',serif;font-size:26px;font-weight:800;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.2)}
.ch-hero-stat-lbl{font-family:'Inter',sans-serif;font-size:10.5px;font-weight:600;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:.5px}

/* ── Tabs ── */
.ch-tabs{display:flex;gap:4px;padding:6px;margin-top:14px;background:rgba(255,255,255,.25);backdrop-filter:blur(8px);border-radius:16px;border:1px solid rgba(255,255,255,.35);overflow-x:auto;scrollbar-width:none}
.ch-tabs::-webkit-scrollbar{display:none}
.ch-tab{flex-shrink:0;font-family:'Inter',sans-serif;font-size:12.5px;font-weight:600;padding:8px 18px;border-radius:12px;border:none;background:transparent;color:#555;cursor:pointer;transition:all .2s;white-space:nowrap}
.ch-tab:hover{background:rgba(67,160,71,.08);color:#2e7d32}
.ch-tab-active{background:linear-gradient(135deg,#43a047,#2e7d32)!important;color:#fff!important;box-shadow:0 3px 12px rgba(67,160,71,.3)}

/* ── Content ── */
.ch-content{margin-top:16px;animation:chSlideIn .35s ease both}
.ch-section{width:100%}
.ch-section-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:800;color:#1a2e1a;margin:0 0 6px}

/* ═══ ABOUT ═══ */
.ch-about-section{display:grid;grid-template-columns:1fr 300px;gap:24px}
.ch-about-para{font-family:'Inter',sans-serif;font-size:14px;line-height:1.75;color:#444;margin:0 0 14px}
.ch-about-recognition{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.ch-recog-badge{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;padding:5px 14px;border-radius:20px;background:rgba(67,160,71,.08);color:#2e7d32;border:1px solid rgba(67,160,71,.15)}
.ch-about-cta{display:flex;gap:10px;margin-top:20px;flex-wrap:wrap}
.ch-cta-btn{font-family:'Inter',sans-serif;font-size:12px;font-weight:700;padding:10px 20px;border-radius:12px;border:none;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all .2s;background:linear-gradient(135deg,#43a047,#2e7d32);color:#fff;box-shadow:0 3px 12px rgba(67,160,71,.25)}
.ch-cta-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(67,160,71,.35)}
.ch-cta-secondary{background:rgba(255,255,255,.5)!important;color:#2e7d32!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;border:1px solid rgba(67,160,71,.2)!important}
.ch-cta-secondary:hover{background:rgba(255,255,255,.7)!important}

/* Sidebar */
.ch-about-sidebar{display:flex;flex-direction:column;gap:16px}
.ch-contact-card{background:rgba(255,255,255,.5);backdrop-filter:blur(8px);border-radius:18px;border:1px solid rgba(255,255,255,.55);padding:20px;display:flex;flex-direction:column;gap:12px}
.ch-contact-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#1a2e1a;margin:0}
.ch-contact-row{display:flex;align-items:flex-start;gap:8px;font-family:'Inter',sans-serif;font-size:12.5px;color:#555}
.ch-contact-icon{flex-shrink:0;margin-top:2px;color:#43a047}
.ch-contact-link{display:flex;align-items:center;gap:6px;font-family:'Inter',sans-serif;font-size:12.5px;font-weight:600;color:#2e7d32;text-decoration:none;padding:8px 14px;border-radius:12px;background:rgba(67,160,71,.08);transition:background .15s}
.ch-contact-link:hover{background:rgba(67,160,71,.15)}
.ch-quick-stats{background:rgba(255,255,255,.5);backdrop-filter:blur(8px);border-radius:18px;border:1px solid rgba(255,255,255,.55);padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ch-qs-item{display:flex;align-items:center;gap:8px}
.ch-qs-icon{font-size:22px}
.ch-qs-item div{display:flex;flex-direction:column}
.ch-qs-item strong{font-family:'Inter',sans-serif;font-size:16px;font-weight:800;color:#1a2e1a}
.ch-qs-item span{font-family:'Inter',sans-serif;font-size:10.5px;color:#888}

/* ═══ VISION ═══ */
.ch-vision-section{display:flex;flex-direction:column;gap:28px}
.ch-vision-header{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.ch-vision-emoji{font-size:28px}
.ch-vision-statement{font-family:'Inter',sans-serif;font-size:15px;line-height:1.7;color:#444;margin:0 0 18px;padding:16px 20px;border-left:4px solid #43a047;background:rgba(67,160,71,.04);border-radius:0 12px 12px 0;font-style:italic}
.ch-pillars-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.ch-pillar-card{background:rgba(255,255,255,.45);backdrop-filter:blur(8px);border-radius:16px;border:1px solid rgba(255,255,255,.5);padding:20px;transition:transform .2s,box-shadow .2s;animation:chSlideUp .4s ease both}
.ch-pillar-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.07)}
.ch-pillar-icon{font-size:28px;margin-bottom:8px;display:block}
.ch-pillar-title{font-family:'Inter',sans-serif;font-size:14px;font-weight:700;color:#1a2e1a;margin:0 0 4px}
.ch-pillar-desc{font-family:'Inter',sans-serif;font-size:12.5px;color:#666;line-height:1.6;margin:0}
.ch-mission-list{display:flex;flex-direction:column;gap:10px}
.ch-mission-item{display:flex;align-items:flex-start;gap:14px;padding:14px 18px;background:rgba(255,255,255,.4);backdrop-filter:blur(6px);border-radius:14px;border:1px solid rgba(255,255,255,.5);transition:transform .15s;animation:chSlideUp .4s ease both}
.ch-mission-item:hover{transform:translateX(4px)}
.ch-mission-num{font-family:'Playfair Display',serif;font-size:20px;font-weight:800;color:#43a047;flex-shrink:0;min-width:30px}
.ch-mission-item p{font-family:'Inter',sans-serif;font-size:13px;color:#555;line-height:1.6;margin:0}

/* ═══ TIMELINE — Linear single-side layout ═══ */
.ch-timeline-section{padding-bottom:20px}
.ch-tl-heading{text-align:center}
.ch-tl-subtitle{font-family:'Inter',sans-serif;font-size:13px;color:#888;text-align:center;margin:0 0 30px}
.ch-tl-track{position:relative;padding-left:48px;max-width:100%}
.ch-tl-line{position:absolute;left:22px;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#43a047 0%,rgba(67,160,71,.15) 100%);border-radius:2px}
.ch-tl-item{position:relative;display:flex;align-items:flex-start;gap:16px;margin-bottom:20px;opacity:0;transform:translateX(-20px);transition:opacity .4s ease,transform .4s ease}
.ch-tl-visible{opacity:1!important;transform:translateX(0)!important}
.ch-tl-dot{position:absolute;left:-48px;top:4px;width:40px;height:40px;border-radius:50%;backdrop-filter:blur(6px);border:3px solid #43a047;display:flex;align-items:center;justify-content:center;z-index:2;box-shadow:0 2px 10px rgba(67,160,71,.2);background:rgba(255,255,255,.8);transition:transform .3s,box-shadow .3s}
.ch-tl-item:hover .ch-tl-dot{transform:scale(1.15);box-shadow:0 4px 16px rgba(67,160,71,.35)}
.ch-tl-dot-icon{font-size:17px}
.ch-tl-content{flex:1;padding:16px 20px;background:rgba(255,255,255,.5);backdrop-filter:blur(8px);border-radius:16px;border:1px solid rgba(255,255,255,.5);box-shadow:0 3px 12px rgba(0,0,0,.04);transition:transform .2s,box-shadow .2s}
.ch-tl-item:hover .ch-tl-content{transform:translateX(4px);box-shadow:0 6px 20px rgba(0,0,0,.07)}
.ch-tl-year-badge{display:inline-block;font-family:'Inter',sans-serif;font-size:12px;font-weight:800;padding:3px 12px;border-radius:20px;margin-bottom:6px;letter-spacing:.3px}
.ch-tl-title{font-family:'Inter',sans-serif;font-size:14px;font-weight:700;color:#1a2e1a;margin:0 0 4px}
.ch-tl-desc{font-family:'Inter',sans-serif;font-size:12px;color:#666;line-height:1.6;margin:0}
.ch-tl-end{display:flex;align-items:center;gap:8px;padding-left:4px;opacity:0;transition:opacity .5s;margin-top:4px}
.ch-tl-end.ch-tl-visible{opacity:1}
.ch-tl-end span:first-child{font-size:22px}
.ch-tl-end-text{font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:#43a047;font-style:italic}

/* ═══ ACHIEVEMENTS ═══ */
.ch-achieve-section{text-align:center}
.ch-achieve-subtitle{font-family:'Inter',sans-serif;font-size:13px;color:#888;margin:0 0 24px}
.ch-stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}
.ch-stat-card{background:rgba(255,255,255,.5);backdrop-filter:blur(8px);border-radius:18px;border:1px solid rgba(255,255,255,.55);padding:24px 16px 18px;display:flex;flex-direction:column;align-items:center;gap:8px;transition:transform .2s,box-shadow .2s;animation:chPop .4s ease both;position:relative;overflow:hidden}
.ch-stat-card:hover{transform:translateY(-4px);box-shadow:0 10px 28px rgba(0,0,0,.07)}
.ch-stat-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px}
.ch-stat-value{font-family:'Playfair Display',serif;font-size:32px;font-weight:800}
.ch-stat-label{font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:.4px}
.ch-stat-bar{position:absolute;bottom:0;left:0;right:0;height:3px;opacity:.5}
.ch-founder-card{display:flex;flex-direction:column;gap:14px;background:rgba(255,255,255,.45);backdrop-filter:blur(8px);border-radius:18px;border:1px solid rgba(255,255,255,.5);padding:20px 24px;text-align:left}
.ch-founder-left{display:flex;align-items:flex-start;gap:16px}
.ch-founder-icon{font-size:36px;flex-shrink:0}
.ch-founder-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#1a2e1a;margin:0 0 4px}
.ch-founder-desc{font-family:'Inter',sans-serif;font-size:13px;color:#666;line-height:1.6;margin:0}
.ch-founder-badges{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.ch-founder-badge{font-family:'Inter',sans-serif;font-size:10.5px;font-weight:700;padding:4px 12px;border-radius:20px;background:rgba(67,160,71,.06);color:#2e7d32;border:1px solid rgba(67,160,71,.12)}

/* ═══ SCHOOLS ═══ */
.ch-schools-subtitle{font-family:'Inter',sans-serif;font-size:13px;color:#888;margin:0 0 20px}
.ch-schools-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
.ch-school-card{display:flex;overflow:hidden;background:rgba(255,255,255,.5);backdrop-filter:blur(8px);border-radius:18px;border:1px solid rgba(255,255,255,.55);cursor:pointer;transition:transform .2s,box-shadow .2s;animation:chSlideUp .4s ease both}
.ch-school-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.07)}
.ch-school-accent{width:5px;flex-shrink:0;border-radius:18px 0 0 18px}
.ch-school-body{padding:18px 20px;display:flex;flex-direction:column;gap:6px}
.ch-school-head{display:flex;align-items:center;gap:12px;margin-bottom:4px}
.ch-school-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.ch-school-name{font-family:'Inter',sans-serif;font-size:13.5px;font-weight:700;color:#1a2e1a;margin:0;line-height:1.3}
.ch-school-abbr{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:.5px}
.ch-school-desc{font-family:'Inter',sans-serif;font-size:12px;color:#777;line-height:1.5;margin:0}
.ch-school-programs{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.ch-school-tag{font-family:'Inter',sans-serif;font-size:10px;font-weight:600;padding:3px 8px;border-radius:20px}
.ch-school-more{background:transparent!important;font-weight:700}
.ch-school-btn{display:flex;align-items:center;gap:4px;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;background:none;border:none;cursor:pointer;padding:4px 0;margin-top:4px;transition:gap .2s}
.ch-school-btn:hover{gap:8px}

/* ═══ GALLERY ═══ */
.ch-gallery-subtitle{font-family:'Inter',sans-serif;font-size:13px;color:#888;margin:0 0 12px}
.ch-gallery-filters{display:flex;gap:6px;margin-bottom:18px;flex-wrap:wrap}
.ch-gf-btn{font-family:'Inter',sans-serif;font-size:11.5px;font-weight:600;padding:6px 16px;border-radius:20px;border:1px solid rgba(255,255,255,.4);background:rgba(255,255,255,.3);color:#666;cursor:pointer;transition:all .2s}
.ch-gf-btn:hover{background:rgba(67,160,71,.08);color:#2e7d32;border-color:rgba(67,160,71,.2)}
.ch-gf-active{background:linear-gradient(135deg,#43a047,#2e7d32)!important;color:#fff!important;border-color:transparent!important;box-shadow:0 3px 10px rgba(67,160,71,.25)}
.ch-gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
.ch-gallery-item{position:relative;border-radius:18px;overflow:hidden;cursor:pointer;aspect-ratio:4/3;transition:transform .2s;animation:chPop .4s ease both}
.ch-gallery-item:hover{transform:scale(1.02)}
.ch-gallery-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}
.ch-gallery-item:hover .ch-gallery-img{transform:scale(1.06)}
.ch-gallery-overlay{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.7)0%,rgba(0,0,0,.1)40%,transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:16px;opacity:0;transition:opacity .25s}
.ch-gallery-item:hover .ch-gallery-overlay{opacity:1}
.ch-gallery-cat{font-family:'Inter',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,.7);letter-spacing:.8px}
.ch-gallery-title{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:#fff;margin:2px 0 0}
.ch-gallery-desc{font-family:'Inter',sans-serif;font-size:11px;color:rgba(255,255,255,.7);margin:4px 0 0;line-height:1.4}

/* ── Lightbox ── */
.ch-lightbox{position:fixed;inset:0;z-index:3000;background:rgba(0,0,0,.85);backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:center;animation:chFadeIn .2s ease;cursor:pointer}
.ch-lb-close{position:absolute;top:20px;right:20px;background:rgba(255,255,255,.15);border:none;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;cursor:pointer;transition:background .15s;z-index:2}
.ch-lb-close:hover{background:rgba(255,255,255,.3)}
.ch-lb-nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.12);border:none;border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;cursor:pointer;transition:background .15s;z-index:2}
.ch-lb-nav:hover{background:rgba(255,255,255,.25)}
.ch-lb-prev{left:24px}
.ch-lb-next{right:24px}
.ch-lb-content{display:flex;flex-direction:column;align-items:center;gap:16px;cursor:default;max-width:80vw;animation:chSlideIn .3s ease both}
.ch-lb-img{max-width:80vw;max-height:65vh;border-radius:16px;object-fit:contain;box-shadow:0 12px 50px rgba(0,0,0,.5)}
.ch-lb-info{text-align:center}
.ch-lb-info h3{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#fff;margin:0 0 4px}
.ch-lb-info p{font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,.7);margin:0}
.ch-lb-counter{font-family:'Inter',sans-serif;font-size:11px;font-weight:600;color:rgba(255,255,255,.5);margin-top:4px;display:block}

/* ═══ SCHOOL MODAL ═══ */
.ch-modal-overlay{position:fixed;inset:0;z-index:2500;background:rgba(0,0,0,.35);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;animation:chFadeIn .2s ease}
.ch-modal{background:rgba(255,255,255,.95);backdrop-filter:blur(20px);border-radius:22px;border:1px solid rgba(255,255,255,.6);box-shadow:0 20px 60px rgba(0,0,0,.15);width:90%;max-width:480px;overflow:hidden;position:relative;animation:chPop .3s cubic-bezier(.34,1.56,.64,1) both;display:flex;flex-direction:column}
.ch-modal-close{position:absolute;top:14px;right:14px;background:rgba(0,0,0,.05);border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#888;font-size:16px;transition:background .15s;z-index:2}
.ch-modal-close:hover{background:rgba(0,0,0,.1)}
.ch-modal-header{display:flex;align-items:center;gap:16px;padding:24px 24px 16px;border-bottom:1px solid rgba(0,0,0,.05)}
.ch-modal-icon{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0}
.ch-modal-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:800;color:#1a2e1a;margin:0;line-height:1.25}
.ch-modal-abbr{font-family:'Inter',sans-serif;font-size:12px;font-weight:700;letter-spacing:.5px}
.ch-modal-body{padding:20px 24px 24px;display:flex;flex-direction:column;gap:6px}
.ch-modal-desc{font-family:'Inter',sans-serif;font-size:13px;color:#666;line-height:1.7;margin:0 0 8px}
.ch-modal-programs-title{font-family:'Inter',sans-serif;font-size:13px;font-weight:700;color:#1a2e1a;margin:6px 0}
.ch-modal-programs{display:flex;flex-wrap:wrap;gap:6px}
.ch-modal-tag{font-family:'Inter',sans-serif;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px}

/* ═══ RESPONSIVE ═══ */
@media(max-width:768px){
.ch-about-section{grid-template-columns:1fr}
.ch-pillars-grid{grid-template-columns:1fr}
.ch-stats-grid{grid-template-columns:1fr 1fr}
.ch-hero-stats{flex-wrap:wrap;gap:16px}
.ch-schools-grid{grid-template-columns:1fr}
}
`;

c += css;
fs.writeFileSync('src/pages/Dashboard.css', c, 'utf8');
console.log('Done! Replaced Chronicles CSS with', css.length, 'bytes');
