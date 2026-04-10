/* ═══════════════════════════════════════════════════════
   LOGSENTINEL — style.css  v2
   Industrial terminal · Syne display · teal/navy command
═══════════════════════════════════════════════════════ */

/* ── Variables ────────────────────────────────────────── */
:root {
  /* Base */
  --bg:        #05070a;
  --bg-1:      #090c10;
  --bg-2:      #0d1117;
  --bg-3:      #111722;
  --bg-hover:  #141a24;

  /* Borders */
  --bdr:       #1a2030;
  --bdr-hi:    #263044;
  --bdr-glow:  #2a4060;

  /* Brand */
  --teal:      #00e5aa;
  --teal-dim:  rgba(0, 229, 170, 0.10);
  --teal-glow: rgba(0, 229, 170, 0.04);

  /* Accent */
  --cyan:      #00c8f0;
  --cyan-dim:  rgba(0, 200, 240, 0.10);

  /* Status */
  --red:       #f0416a;
  --red-dim:   rgba(240, 65, 106, 0.12);
  --red-glow:  rgba(240, 65, 106, 0.06);
  --amber:     #f5aa2a;
  --amber-dim: rgba(245, 170, 42, 0.12);
  --blue:      #4499ff;
  --blue-dim:  rgba(68, 153, 255, 0.12);
  --purple:    #a87dff;
  --purple-dim:rgba(168, 125, 255, 0.12);
  --green:     #34d87a;
  --green-dim: rgba(52, 216, 122, 0.12);

  /* Text */
  --text:      #dde4ef;
  --text-2:    #7f8fa0;
  --text-3:    #3d4d5e;

  /* Font */
  --f-display: 'Syne', sans-serif;
  --f-body:    'DM Sans', sans-serif;
  --f-mono:    'JetBrains Mono', monospace;

  /* Radii */
  --r:         8px;
  --r-lg:      14px;
  --r-xl:      20px;

  --transition: 0.18s ease;
}

/* Light theme */
[data-theme="light"] {
  --bg:        #f0f4f8;
  --bg-1:      #e8edf4;
  --bg-2:      #ffffff;
  --bg-3:      #f5f8fc;
  --bg-hover:  #edf2f7;
  --bdr:       #d0dae6;
  --bdr-hi:    #b0c0d4;
  --text:      #1a2030;
  --text-2:    #4a5a70;
  --text-3:    #8090a8;
}

/* ── Reset ────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--f-body);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--bdr-hi); border-radius: 3px; }

/* ── Utility ──────────────────────────────────────────── */
.mono { font-family: var(--f-mono); }
.page-wrap { max-width: 1300px; margin: 0 auto; padding: 0 2rem 80px; }

/* ══════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════ */
.navbar {
  position: sticky; top: 0; z-index: 200;
  background: rgba(5, 7, 10, 0.94);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--bdr);
}

.nav-inner {
  max-width: 1300px; margin: 0 auto;
  padding: 0 2rem; height: 58px;
  display: flex; align-items: center; gap: 2rem;
}

/* Logo */
.nav-logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-mark { display: flex; align-items: center; }
.logo-text {
  font-family: var(--f-display);
  font-size: 18px; font-weight: 700;
  letter-spacing: -0.5px; color: var(--text);
}
.logo-text em { font-style: normal; color: var(--teal); }

/* Tabs */
.nav-tabs {
  display: flex; gap: 2px;
  background: var(--bg-2);
  border: 1px solid var(--bdr);
  border-radius: 10px;
  padding: 4px;
}

.nav-tab {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 18px;
  border-radius: 7px; border: none;
  background: transparent;
  color: var(--text-2);
  font-family: var(--f-body);
  font-size: 13px; font-weight: 500;
  cursor: pointer;
  transition: color var(--transition), background var(--transition);
  position: relative;
}
.nav-tab .tab-icon { font-size: 10px; opacity: 0.5; }
.nav-tab:hover { color: var(--text); background: var(--bg-hover); }
.nav-tab.active { color: var(--teal); background: var(--teal-dim); }
.nav-tab.active .tab-icon { opacity: 1; }

.tab-badge {
  background: var(--red);
  color: #fff;
  font-size: 10px; font-weight: 700;
  padding: 1px 5px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* Nav end */
.nav-end { display: flex; align-items: center; gap: 12px; margin-left: auto; }

.live-indicator { display: flex; align-items: center; gap: 7px; }
.live-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--teal);
  box-shadow: 0 0 0 3px var(--teal-dim);
  animation: livePulse 2.5s ease infinite;
}
@keyframes livePulse {
  0%,100% { box-shadow: 0 0 0 3px var(--teal-dim); }
  50%      { box-shadow: 0 0 0 7px rgba(0,229,170,0.04); }
}
.live-label { font-size: 12px; color: var(--teal); font-weight: 500; }

.btn-inject {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 16px;
  border-radius: var(--r);
  border: 1px solid var(--teal);
  background: var(--teal-dim);
  color: var(--teal);
  font-family: var(--f-body);
  font-size: 13px; font-weight: 600;
  cursor: pointer;
  transition: background var(--transition), box-shadow var(--transition);
}
.btn-inject:hover {
  background: rgba(0,229,170,0.18);
  box-shadow: 0 0 20px rgba(0,229,170,0.15);
}

/* ══════════════════════════════════════════════════════
   TAB SECTIONS
══════════════════════════════════════════════════════ */
.tab-section { display: none; animation: tabFadeIn 0.25s ease; }
.tab-section.active { display: block; }

@keyframes tabFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ══════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════ */
.hero {
  position: relative;
  overflow: hidden;
  padding: 80px 2rem 60px;
}

.hero-grid-bg {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(0,229,170,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,170,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 80% 100% at 50% 0%, black 40%, transparent 100%);
}

.hero-inner {
  max-width: 1300px; margin: 0 auto;
  position: relative;
}

.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 11px; font-weight: 600; letter-spacing: 2.5px;
  color: var(--teal); text-transform: uppercase;
  margin-bottom: 24px;
}
.eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--teal);
  animation: livePulse 2s ease infinite;
}

.hero-title {
  font-family: var(--f-display);
  font-size: clamp(38px, 5.5vw, 68px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -2px;
  color: var(--text);
  margin-bottom: 22px;
}
.title-accent { color: var(--teal); font-style: italic; font-weight: 400; }

.hero-sub {
  font-size: 17px; color: var(--text-2);
  max-width: 520px; line-height: 1.75;
}

/* ══════════════════════════════════════════════════════
   STATS ROW
══════════════════════════════════════════════════════ */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-2);
  border: 1px solid var(--bdr);
  border-radius: var(--r-lg);
  padding: 22px;
  display: flex; flex-direction: column;
  gap: 4px;
  transition: border-color var(--transition);
}
.stat-card:hover { border-color: var(--bdr-hi); }
.stat-card.danger { border-color: rgba(240,65,106,0.25); background: linear-gradient(135deg, var(--bg-2), rgba(240,65,106,0.04)); }

.stat-icon { font-size: 18px; margin-bottom: 8px; }

.stat-val {
  font-family: var(--f-display);
  font-size: 36px; font-weight: 700;
  letter-spacing: -1.5px; line-height: 1;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}
.stat-val.small { font-size: 20px; letter-spacing: -0.5px; }
.stat-card.danger .stat-val { color: var(--red); }

.stat-label {
  font-size: 11px; font-weight: 600;
  letter-spacing: 1px; text-transform: uppercase;
  color: var(--text-3);
  margin-top: 8px;
}
.stat-sub { font-size: 11px; color: var(--text-3); }

/* ══════════════════════════════════════════════════════
   SECTION CARD
══════════════════════════════════════════════════════ */
.section-card {
  background: var(--bg-2);
  border: 1px solid var(--bdr);
  border-radius: var(--r-lg);
  overflow: hidden;
}
.overflow-card { margin-bottom: 24px; }

.card-header {
  display: flex; align-items: center;
  padding: 18px 20px 0;
  gap: 10px;
}
.card-title {
  font-family: var(--f-display);
  font-size: 16px; font-weight: 600;
  letter-spacing: -0.3px;
}
.badge-dim {
  background: var(--bg-3); color: var(--text-3);
  font-size: 11px; padding: 2px 8px;
  border-radius: 6px; font-weight: 500;
}

/* ══════════════════════════════════════════════════════
   TIMELINE CHART
══════════════════════════════════════════════════════ */
.timeline-chart-wrap {
  padding: 16px 20px 8px;
  height: 100px;
}
.timeline-svg { width: 100%; height: 100%; display: block; }
.timeline-legend {
  display: flex; gap: 20px;
  padding: 4px 20px 16px;
  font-size: 12px;
}
.legend-item { display: flex; align-items: center; gap: 6px; color: var(--text-3); }
.legend-item.teal { color: var(--teal); }
.legend-item.red  { color: var(--red); }

/* ══════════════════════════════════════════════════════
   FILTER BAR
══════════════════════════════════════════════════════ */
.filter-bar {
  display: flex; align-items: center;
  gap: 4px; flex-wrap: wrap;
  padding: 6px;
  background: var(--bg-2);
  border: 1px solid var(--bdr);
  border-radius: 12px;
  margin-bottom: 16px;
}

.filter-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 14px;
  border-radius: 8px; border: none;
  background: transparent;
  color: var(--text-2);
  font-family: var(--f-body); font-size: 13px; font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
}
.filter-btn:hover { color: var(--text); background: var(--bg-hover); }
.filter-btn.active { color: var(--teal); background: var(--teal-dim); }

.cat-pip {
  width: 7px; height: 7px; border-radius: 50%;
  flex-shrink: 0;
}
.cat-pip.security    { background: var(--red); }
.cat-pip.network     { background: var(--blue); }
.cat-pip.database    { background: var(--amber); }
.cat-pip.performance { background: var(--purple); }
.cat-pip.general     { background: var(--text-3); }

.filter-right {
  display: flex; align-items: center; gap: 10px; margin-left: auto; flex-wrap: wrap;
}

.search-wrap { position: relative; }
.search-input {
  background: var(--bg-3);
  border: 1px solid var(--bdr);
  border-radius: 7px;
  padding: 6px 12px;
  color: var(--text);
  font-family: var(--f-body); font-size: 13px;
  outline: none; width: 200px;
  transition: border-color var(--transition);
}
.search-input:focus { border-color: var(--teal); }
.search-input::placeholder { color: var(--text-3); }

/* Toggle */
.toggle-label-wrap {
  display: flex; align-items: center; gap: 8px;
  cursor: pointer; user-select: none;
  font-size: 13px; color: var(--text-2);
}
.toggle-label-wrap input { display: none; }
.toggle-switch {
  width: 36px; height: 20px; border-radius: 10px;
  background: var(--bdr-hi); position: relative;
  transition: background var(--transition);
  flex-shrink: 0;
}
.toggle-switch::after {
  content: ''; position: absolute;
  top: 3px; left: 3px;
  width: 14px; height: 14px;
  border-radius: 50%; background: var(--text-2);
  transition: transform var(--transition), background var(--transition);
}
.toggle-label-wrap input:checked + .toggle-switch { background: var(--teal); }
.toggle-label-wrap input:checked + .toggle-switch::after {
  transform: translateX(16px); background: #020c09;
}

/* Ghost small button */
.btn-ghost-sm {
  padding: 6px 12px;
  border-radius: 7px; border: 1px solid var(--bdr);
  background: transparent; color: var(--text-2);
  font-family: var(--f-body); font-size: 12px;
  cursor: pointer;
  transition: color var(--transition), border-color var(--transition);
}
.btn-ghost-sm:hover { color: var(--text); border-color: var(--bdr-hi); }

/* ══════════════════════════════════════════════════════
   LOG TABLE
══════════════════════════════════════════════════════ */
.feed-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--bdr);
}
.feed-count {
  font-family: var(--f-mono);
  font-size: 12px; color: var(--text-3);
}

.table-scroll { overflow-x: auto; }

.log-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.log-table thead { background: var(--bg-3); }
.log-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 10px; font-weight: 700; letter-spacing: 1.2px;
  text-transform: uppercase; color: var(--text-3);
  border-bottom: 1px solid var(--bdr);
  white-space: nowrap;
}
.log-table td {
  padding: 13px 16px;
  border-bottom: 1px solid var(--bdr);
  vertical-align: middle; color: var(--text-2);
}
.log-table tbody tr { transition: background var(--transition); }
.log-table tbody tr:hover { background: var(--bg-hover); }
.log-table tbody tr:last-child td { border-bottom: none; }
.log-table tbody tr.is-anomaly { border-left: 3px solid var(--red); }
.log-table tbody tr.is-anomaly td { background: rgba(240,65,106,0.03); }
.log-table tbody tr.is-anomaly:hover td { background: rgba(240,65,106,0.06); }

/* Cells */
.ts-cell { font-family: var(--f-mono); font-size: 11px; color: var(--text-3); white-space: nowrap; }

.source-badge {
  font-family: var(--f-mono); font-size: 11px;
  padding: 3px 8px; border-radius: 5px;
  background: var(--bg-3); color: var(--text-2);
  white-space: nowrap;
}

.level-badge {
  font-size: 10px; font-weight: 700; letter-spacing: 0.8px;
  padding: 3px 8px; border-radius: 5px;
  text-transform: uppercase; white-space: nowrap;
}
.level-INFO     { background: var(--blue-dim);   color: var(--blue); }
.level-WARNING  { background: var(--amber-dim);  color: var(--amber); }
.level-ERROR    { background: var(--red-dim);    color: var(--red); }
.level-CRITICAL { background: var(--red-dim); color: var(--red); border: 1px solid rgba(240,65,106,0.3); }

.cat-badge {
  font-size: 10px; font-weight: 600; letter-spacing: 0.8px;
  padding: 3px 8px; border-radius: 5px;
  text-transform: uppercase; white-space: nowrap;
}
.cat-security    { background: var(--red-dim);    color: var(--red); }
.cat-network     { background: var(--blue-dim);   color: var(--blue); }
.cat-database    { background: var(--amber-dim);  color: var(--amber); }
.cat-performance { background: var(--purple-dim); color: var(--purple); }
.cat-general     { background: var(--bg-3);       color: var(--text-3); }

.anomaly-yes {
  display: flex; align-items: center; gap: 6px;
  color: var(--red); font-size: 12px; font-weight: 600;
}
.anomaly-yes::before {
  content: ''; width: 7px; height: 7px; border-radius: 50%;
  background: var(--red); box-shadow: 0 0 0 3px var(--red-dim);
  animation: livePulse 2s ease infinite;
}
.anomaly-no { color: var(--text-3); font-size: 12px; }

.score-wrap { display: flex; align-items: center; gap: 8px; }
.score-bar { width: 56px; height: 4px; border-radius: 2px; background: var(--bdr); overflow: hidden; }
.score-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease; }
.score-high   { background: var(--red); }
.score-medium { background: var(--amber); }
.score-low    { background: var(--teal); }
.score-num { font-family: var(--f-mono); font-size: 11px; color: var(--text-2); }

.msg-cell {
  max-width: 340px; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
  font-family: var(--f-mono); font-size: 12px; color: var(--text-2);
}
.msg-cell.anomaly-msg { color: var(--red); }

/* Empty / Loading */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; padding: 60px 0;
  color: var(--text-3); font-size: 14px;
}
.empty-row td { padding: 0; }
.spinner {
  width: 22px; height: 22px; border-radius: 50%;
  border: 2px solid var(--bdr-hi);
  border-top-color: var(--teal);
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ══════════════════════════════════════════════════════
   BREAKDOWN CARDS
══════════════════════════════════════════════════════ */
.breakdown-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-top: 24px;
}

.bk-card {
  background: var(--bg-2);
  border: 1px solid var(--bdr);
  border-radius: var(--r-lg);
  padding: 18px;
  transition: all var(--transition);
  cursor: default;
}
.bk-card:hover { border-color: var(--bdr-hi); transform: translateY(-2px); }

.bk-icon { font-size: 20px; margin-bottom: 12px; }
.bk-name { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
.bk-count { font-family: var(--f-display); font-size: 30px; font-weight: 700; letter-spacing: -1px; line-height: 1; }
.bk-pct { font-size: 11px; color: var(--text-3); margin-top: 4px; }
.bk-bar-wrap { height: 3px; background: var(--bdr); border-radius: 2px; margin-top: 14px; overflow: hidden; }
.bk-bar { height: 100%; border-radius: 2px; transition: width 0.6s ease; }

.bk-security    { border-left: 3px solid var(--red); }
.bk-security .bk-name, .bk-security .bk-count { color: var(--red); }
.bk-security .bk-bar { background: var(--red); }

.bk-network     { border-left: 3px solid var(--blue); }
.bk-network .bk-name, .bk-network .bk-count { color: var(--blue); }
.bk-network .bk-bar { background: var(--blue); }

.bk-database    { border-left: 3px solid var(--amber); }
.bk-database .bk-name, .bk-database .bk-count { color: var(--amber); }
.bk-database .bk-bar { background: var(--amber); }

.bk-performance { border-left: 3px solid var(--purple); }
.bk-performance .bk-name, .bk-performance .bk-count { color: var(--purple); }
.bk-performance .bk-bar { background: var(--purple); }

.bk-general     { border-left: 3px solid var(--text-3); }
.bk-general .bk-name, .bk-general .bk-count { color: var(--text-2); }
.bk-general .bk-bar { background: var(--text-3); }

/* ══════════════════════════════════════════════════════
   PAGE HEADER (Analyzer, Alerts, Settings)
══════════════════════════════════════════════════════ */
.page-header {
  padding: 56px 0 36px;
}
.page-title {
  font-family: var(--f-display);
  font-size: 40px; font-weight: 800; letter-spacing: -1.5px;
  color: var(--text); margin-bottom: 10px;
}
.page-sub {
  font-size: 16px; color: var(--text-2); max-width: 520px; line-height: 1.7;
}
.page-sub em { color: var(--teal); font-style: normal; }

.mode-toggle-group {
  display: inline-flex;
  background: var(--bg-2);
  border: 1px solid var(--bdr);
  border-radius: 10px; padding: 4px;
  margin-top: 24px;
}
.mode-btn {
  padding: 7px 20px;
  border-radius: 7px; border: none;
  background: transparent;
  color: var(--text-2);
  font-family: var(--f-body); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all var(--transition);
}
.mode-btn.active { background: var(--teal-dim); color: var(--teal); }

/* ══════════════════════════════════════════════════════
   ANALYZER
══════════════════════════════════════════════════════ */
.analyzer-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.analyzer-input-panel {
  background: var(--bg-2);
  border: 1px solid var(--bdr);
  border-radius: var(--r-lg);
  padding: 20px;
}

.panel-label {
  font-size: 11px; font-weight: 700; letter-spacing: 1.2px;
  text-transform: uppercase; color: var(--text-3);
  margin-bottom: 12px;
}
.panel-hint { font-weight: 400; color: var(--text-3); text-transform: none; letter-spacing: 0; font-size: 11px; }

.analyzer-textarea {
  width: 100%; min-height: 160px;
  background: var(--bg-3);
  border: 1px solid var(--bdr);
  border-radius: var(--r);
  padding: 14px;
  color: var(--text);
  font-family: var(--f-mono); font-size: 13px;
  resize: vertical; outline: none;
  transition: border-color var(--transition);
  line-height: 1.7;
}
.analyzer-textarea:focus { border-color: var(--teal); }
.analyzer-textarea::placeholder { color: var(--text-3); }

.analyzer-input-footer {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 10px; flex-wrap: wrap; gap: 8px;
}
.char-count { font-family: var(--f-mono); font-size: 11px; color: var(--text-3); }

.quick-chips { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.chip-label  { font-size: 11px; color: var(--text-3); }

.chip {
  padding: 4px 11px;
  border-radius: 6px; border: 1px solid var(--bdr);
  background: var(--bg-3); color: var(--text-2);
  font-family: var(--f-body); font-size: 12px;
  cursor: pointer; transition: all var(--transition);
}
.chip:hover { border-color: var(--teal); color: var(--teal); background: var(--teal-dim); }

.btn-analyze {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  width: 100%; margin-top: 16px;
  padding: 13px 20px;
  border-radius: var(--r); border: none;
  background: var(--teal);
  color: #020c08;
  font-family: var(--f-display); font-size: 14px; font-weight: 700;
  cursor: pointer; letter-spacing: -0.2px;
  transition: opacity var(--transition), box-shadow var(--transition);
}
.btn-analyze:hover { opacity: 0.9; box-shadow: 0 8px 30px rgba(0,229,170,0.3); }
.btn-analyze:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-arrow { font-size: 18px; font-weight: 300; }

/* Output panel */
.analyzer-output-panel {
  background: var(--bg-2);
  border: 1px solid var(--bdr);
  border-radius: var(--r-lg);
  min-height: 320px;
  overflow: hidden;
  transition: border-color 0.3s ease;
}
.analyzer-output-panel.anomaly-state { border-color: rgba(240,65,106,0.4); }
.analyzer-output-panel.clean-state   { border-color: rgba(0,229,170,0.35); }

.output-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%; min-height: 280px;
  gap: 14px; color: var(--text-3);
}
.output-empty-icon { font-size: 32px; opacity: 0.25; }
.output-empty-text { font-size: 14px; }

/* Analysis result card */
.analysis-result { padding: 22px; }

.result-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.result-verdict {
  font-family: var(--f-display);
  font-size: 22px; font-weight: 700;
}
.result-verdict.anomaly { color: var(--red); }
.result-verdict.clean   { color: var(--teal); }

.sev-badge {
  padding: 5px 14px;
  border-radius: 8px;
  font-size: 11px; font-weight: 700; letter-spacing: 1px;
  text-transform: uppercase;
}
.sev-CRITICAL { background: var(--red-dim);    color: var(--red);    border: 1px solid rgba(240,65,106,0.3); }
.sev-HIGH     { background: var(--amber-dim);  color: var(--amber);  border: 1px solid rgba(245,170,42,0.3); }
.sev-MEDIUM   { background: var(--purple-dim); color: var(--purple); border: 1px solid rgba(168,125,255,0.3); }
.sev-LOW      { background: var(--blue-dim);   color: var(--blue);   border: 1px solid rgba(68,153,255,0.3); }
.sev-NONE     { background: var(--green-dim);  color: var(--green);  border: 1px solid rgba(52,216,122,0.3); }

/* Score arc */
.score-arc-wrap {
  display: flex; align-items: center; gap: 18px;
  margin-bottom: 20px; padding: 16px;
  background: var(--bg-3); border-radius: var(--r);
}
.score-arc-svg { width: 70px; flex-shrink: 0; }
.score-arc-info { flex: 1; }
.score-arc-val {
  font-family: var(--f-display);
  font-size: 28px; font-weight: 700; letter-spacing: -1px;
  margin-bottom: 4px;
}
.score-arc-label { font-size: 12px; color: var(--text-3); }
.score-meta { display: flex; gap: 14px; margin-top: 8px; }
.score-meta-item { font-size: 12px; }
.score-meta-key { color: var(--text-3); }
.score-meta-val { color: var(--text); font-weight: 500; }

/* Reasons */
.reasons-label {
  font-size: 11px; font-weight: 700; letter-spacing: 1px;
  text-transform: uppercase; color: var(--text-3);
  margin-bottom: 10px;
}
.reason-list { display: flex; flex-direction: column; gap: 8px; }
.reason-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 14px;
  background: var(--bg-3); border-radius: var(--r);
  font-size: 13px;
}
.reason-type {
  font-size: 10px; font-weight: 700; letter-spacing: 0.8px;
  padding: 2px 7px; border-radius: 5px;
  white-space: nowrap; flex-shrink: 0; margin-top: 1px;
}
.rt-keyword  { background: var(--red-dim);    color: var(--red); }
.rt-pattern  { background: var(--amber-dim);  color: var(--amber); }
.rt-ml       { background: var(--purple-dim); color: var(--purple); }
.rt-http     { background: var(--blue-dim);   color: var(--blue); }
.rt-info     { background: var(--bg-2);       color: var(--text-3); }
.reason-text { color: var(--text-2); line-height: 1.5; }

/* ── Batch mode ───────────────────────────────────────── */
.batch-layout {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 20px; align-items: start;
}
.batch-input-panel {
  background: var(--bg-2);
  border: 1px solid var(--bdr);
  border-radius: var(--r-lg);
  padding: 20px;
}
.batch-textarea {
  width: 100%; min-height: 280px;
  background: var(--bg-3); border: 1px solid var(--bdr);
  border-radius: var(--r); padding: 14px;
  color: var(--text); font-family: var(--f-mono); font-size: 12px;
  resize: vertical; outline: none; line-height: 1.7;
  transition: border-color var(--transition);
}
.batch-textarea:focus { border-color: var(--teal); }
.batch-input-footer {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 10px;
}
.line-count { font-family: var(--f-mono); font-size: 11px; color: var(--text-3); }

.batch-output-panel {
  background: var(--bg-2); border: 1px solid var(--bdr);
  border-radius: var(--r-lg); min-height: 340px;
}

/* Batch results */
.batch-summary {
  display: flex; gap: 14px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--bdr);
}
.bs-item { text-align: center; }
.bs-val { font-family: var(--f-display); font-size: 22px; font-weight: 700; }
.bs-label { font-size: 11px; color: var(--text-3); }
.bs-val.red  { color: var(--red); }
.bs-val.teal { color: var(--teal); }

.batch-results-list { max-height: 460px; overflow-y: auto; }
.br-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--bdr);
  transition: background var(--transition);
}
.br-item:hover { background: var(--bg-hover); }
.br-item:last-child { border-bottom: none; }
.br-item.anomaly { border-left: 3px solid var(--red); }

.br-num { font-family: var(--f-mono); font-size: 11px; color: var(--text-3); padding-top: 2px; width: 24px; flex-shrink: 0; }
.br-body { flex: 1; min-width: 0; }
.br-msg { font-family: var(--f-mono); font-size: 12px; color: var(--text-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.br-meta { display: flex; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.br-reasons { font-size: 11px; color: var(--text-3); margin-top: 3px; }

/* ══════════════════════════════════════════════════════
   ALERTS
══════════════════════════════════════════════════════ */
.alert-summary-row {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 14px; margin-bottom: 24px;
}
.alert-stat {
  background: var(--bg-2); border: 1px solid var(--bdr);
  border-radius: var(--r-lg); padding: 20px;
  text-align: center;
}
.as-val {
  font-family: var(--f-display);
  font-size: 32px; font-weight: 700; letter-spacing: -1px;
}
.as-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--text-3); margin-top: 6px; }
.alert-stat.open         { border-left: 4px solid var(--red);    }
.alert-stat.open .as-val { color: var(--red); }
.alert-stat.investigating         { border-left: 4px solid var(--amber); }
.alert-stat.investigating .as-val { color: var(--amber); }
.alert-stat.resolved              { border-left: 4px solid var(--teal); }
.alert-stat.resolved .as-val      { color: var(--teal); }
.alert-stat.critical              { border-left: 4px solid var(--red); background: linear-gradient(135deg,var(--bg-2),var(--red-glow)); }
.alert-stat.critical .as-val      { color: var(--red); }

.select-sm {
  background: var(--bg-3); border: 1px solid var(--bdr);
  border-radius: 7px; padding: 6px 12px;
  color: var(--text); font-family: var(--f-body); font-size: 12px;
  outline: none; cursor: pointer;
  transition: border-color var(--transition);
}
.select-sm:focus { border-color: var(--teal); }

/* Alert card */
.alert-card {
  background: var(--bg-2); border: 1px solid var(--bdr);
  border-radius: var(--r-lg); margin-bottom: 12px;
  overflow: hidden; transition: border-color var(--transition);
}
.alert-card:hover { border-color: var(--bdr-hi); }
.alert-card.sev-CRITICAL { border-left: 4px solid var(--red); }
.alert-card.sev-HIGH     { border-left: 4px solid var(--amber); }
.alert-card.sev-MEDIUM   { border-left: 4px solid var(--purple); }
.alert-card.sev-LOW      { border-left: 4px solid var(--blue); }
.alert-card.status-RESOLVED { opacity: 0.55; }

.ac-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 20px;
}
.ac-sev { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.ac-sev.CRITICAL { background: var(--red);    box-shadow: 0 0 0 4px var(--red-dim); animation: livePulse 2s ease infinite; }
.ac-sev.HIGH     { background: var(--amber);  }
.ac-sev.MEDIUM   { background: var(--purple); }
.ac-sev.LOW      { background: var(--blue);   }

.ac-title { flex: 1; font-size: 14px; font-weight: 500; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ac-count {
  background: var(--bg-3); border: 1px solid var(--bdr);
  border-radius: 8px; padding: 3px 10px;
  font-family: var(--f-mono); font-size: 12px; color: var(--teal);
  flex-shrink: 0;
}
.ac-status {
  font-size: 10px; font-weight: 700; letter-spacing: 0.8px;
  padding: 3px 9px; border-radius: 5px; flex-shrink: 0;
}
.ac-status.OPEN         { background: var(--red-dim);    color: var(--red); }
.ac-status.INVESTIGATING { background: var(--amber-dim);  color: var(--amber); }
.ac-status.RESOLVED      { background: var(--green-dim);  color: var(--green); }

.ac-body {
  padding: 0 20px 16px;
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
}
.ac-meta { display: flex; gap: 10px; flex-wrap: wrap; font-size: 12px; color: var(--text-3); }
.ac-meta-item { display: flex; align-items: center; gap: 4px; }

.ac-actions { display: flex; gap: 8px; margin-left: auto; }

.ac-btn {
  padding: 5px 13px;
  border-radius: 6px; border: 1px solid var(--bdr);
  background: transparent; color: var(--text-2);
  font-family: var(--f-body); font-size: 12px;
  cursor: pointer; transition: all var(--transition);
}
.ac-btn:hover { border-color: var(--bdr-hi); color: var(--text); }
.ac-btn.investigate { border-color: rgba(245,170,42,0.3); color: var(--amber); }
.ac-btn.investigate:hover { background: var(--amber-dim); }
.ac-btn.resolve { border-color: rgba(0,229,170,0.3); color: var(--teal); }
.ac-btn.resolve:hover { background: var(--teal-dim); }
.ac-btn.reopen { border-color: var(--bdr); color: var(--text-3); }

/* ══════════════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════════════ */
.settings-layout {
  display: grid; grid-template-columns: 1fr 380px;
  gap: 24px; align-items: start;
}
.settings-card {
  background: var(--bg-2); border: 1px solid var(--bdr);
  border-radius: var(--r-lg); padding: 24px;
  margin-bottom: 16px;
}
.settings-card-title {
  font-family: var(--f-display);
  font-size: 15px; font-weight: 600; letter-spacing: -0.2px;
  margin-bottom: 20px; color: var(--text);
  display: flex; align-items: center;
}

.setting-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 0; border-bottom: 1px solid var(--bdr);
}
.setting-row:last-child { border-bottom: none; padding-bottom: 0; }
.setting-info { flex: 1; }
.setting-name { font-size: 14px; font-weight: 500; margin-bottom: 2px; }
.setting-desc { font-size: 12px; color: var(--text-3); }

/* Sliders */
.slider-row { padding: 14px 0; border-bottom: 1px solid var(--bdr); }
.slider-row:last-child { border-bottom: none; padding-bottom: 0; }
.slider-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.slider-name { font-size: 14px; font-weight: 500; }
.slider-val { font-family: var(--f-mono); font-size: 14px; color: var(--teal); font-weight: 600; }
.slider-desc { font-size: 12px; color: var(--text-3); margin-bottom: 12px; }

.range-slider {
  -webkit-appearance: none;
  appearance: none; 
  width: 100%; height: 4px;
  border-radius: 2px; outline: none;
  background: var(--bdr-hi);
  cursor: pointer;
}
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none; 
  width: 18px; height: 18px;
  border-radius: 50%;
  background: var(--teal);
  border: 3px solid var(--bg-2);
  box-shadow: 0 0 0 2px var(--teal);
  cursor: pointer;
  transition: box-shadow var(--transition);
}
.range-slider::-webkit-slider-thumb:hover { box-shadow: 0 0 0 5px var(--teal-dim); }

.slider-labels {
  display: flex; justify-content: space-between;
  margin-top: 6px; font-size: 11px; color: var(--text-3);
}

/* Theme toggle */
.theme-toggle-group {
  display: flex; gap: 4px;
  background: var(--bg-3); border: 1px solid var(--bdr);
  border-radius: 8px; padding: 3px;
}
.theme-btn {
  padding: 5px 14px; border-radius: 6px; border: none;
  background: transparent; color: var(--text-2);
  font-family: var(--f-body); font-size: 12px;
  cursor: pointer; transition: all var(--transition);
}
.theme-btn.active { background: var(--bg-2); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.3); }

/* Save actions */
.settings-actions {
  display: flex; align-items: center; gap: 14px; margin-top: 4px;
}
.btn-primary-lg {
  padding: 12px 28px;
  border-radius: var(--r); border: none;
  background: var(--teal); color: #020c08;
  font-family: var(--f-display); font-size: 14px; font-weight: 700;
  cursor: pointer; letter-spacing: -0.2px;
  transition: opacity var(--transition), box-shadow var(--transition);
}
.btn-primary-lg:hover { opacity: 0.9; box-shadow: 0 8px 30px rgba(0,229,170,0.25); }
.save-status { font-size: 13px; color: var(--teal); font-weight: 500; }

/* Health card */
.health-card { position: sticky; top: 76px; }
.health-gauges {
  display: flex; gap: 20px; justify-content: center;
  margin-bottom: 20px;
}
.gauge-wrap { text-align: center; }
.gauge-svg { width: 100px; }
.gauge-val { font-family: var(--f-display); font-size: 18px; font-weight: 700; margin-top: -8px; }
.gauge-label { font-size: 11px; color: var(--text-3); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

.health-metrics { border-top: 1px solid var(--bdr); padding-top: 16px; margin-top: 4px; }
.hm-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 0; border-bottom: 1px solid var(--bdr);
}
.hm-row:last-child { border-bottom: none; }
.hm-key { font-size: 13px; color: var(--text-3); }
.hm-val { font-size: 13px; color: var(--text); }
.hm-val.mono { font-family: var(--f-mono); }

/* Notification preview */
.notif-preview { border-top: 1px solid var(--bdr); margin-top: 16px; padding-top: 16px; }
.notif-header { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text-3); margin-bottom: 12px; }
.notif-channel {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 0; border-bottom: 1px solid var(--bdr);
}
.notif-channel:last-child { border-bottom: none; }
.notif-icon { font-size: 14px; }
.notif-name { font-size: 13px; flex: 1; }
.notif-tag {
  font-size: 10px; font-weight: 600;
  padding: 2px 8px; border-radius: 5px;
}
.notif-tag.active { background: var(--green-dim); color: var(--green); }

/* ══════════════════════════════════════════════════════
   ALERT TICKER (global bottom)
══════════════════════════════════════════════════════ */
.alert-ticker {
  position: fixed; bottom: 24px; left: 50%;
  transform: translateX(-50%);
  background: #160508;
  border: 1px solid var(--red);
  border-radius: 12px; padding: 14px 20px;
  display: flex; align-items: center; gap: 16px;
  z-index: 500;
  max-width: 680px; width: calc(100% - 48px);
  box-shadow: 0 0 40px rgba(240,65,106,0.20);
  animation: tickerSlide 0.3s ease;
  overflow: hidden;
}
.ticker-glow {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(90deg, rgba(240,65,106,0.08), transparent);
}
@keyframes tickerSlide {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
.ticker-inner { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; position: relative; }
.ticker-badge { font-size: 12px; font-weight: 700; color: var(--red); white-space: nowrap; }
.ticker-msg { font-size: 13px; color: var(--text-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--f-mono); }
.ticker-close { position: relative; background: none; border: none; color: var(--text-3); cursor: pointer; font-size: 16px; padding: 0 0 0 6px; transition: color var(--transition); }
.ticker-close:hover { color: var(--text); }

/* ══════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(8px);
  z-index: 400;
  display: none; align-items: center; justify-content: center;
  padding: 24px;
}
.modal-overlay.open { display: flex; }

.modal {
  background: var(--bg-2);
  border: 1px solid var(--bdr-hi);
  border-radius: var(--r-xl);
  width: 100%; max-width: 520px;
  animation: modalPop 0.22s ease;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5);
}
@keyframes modalPop {
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 24px 0;
}
.modal-title { font-family: var(--f-display); font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
.modal-close {
  background: var(--bg-3); border: none; color: var(--text-2);
  width: 30px; height: 30px; border-radius: 8px;
  cursor: pointer; font-size: 14px;
  transition: background var(--transition);
}
.modal-close:hover { background: var(--bdr-hi); color: var(--text); }

.modal-body { padding: 20px 24px; }
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
.field-row .field { margin-bottom: 0; }
.field-label { font-size: 10px; font-weight: 700; letter-spacing: 1.2px; color: var(--text-3); text-transform: uppercase; }

.field-input {
  background: var(--bg-3); border: 1px solid var(--bdr);
  border-radius: var(--r); padding: 10px 14px;
  color: var(--text); font-family: var(--f-body); font-size: 14px;
  outline: none; width: 100%;
  transition: border-color var(--transition);
}
.field-input:focus { border-color: var(--teal); }
.field-input::placeholder { color: var(--text-3); }
.field-input.textarea { resize: vertical; min-height: 84px; font-family: var(--f-mono); font-size: 13px; }
.field-input.select { appearance: none; cursor: pointer; }

.quick-fill-row {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 4px;
}
.qf-label { font-size: 11px; color: var(--text-3); }

.modal-footer {
  display: flex; align-items: center; justify-content: flex-end;
  gap: 10px; padding: 0 24px 22px;
}

.btn-ghost {
  padding: 9px 18px; border-radius: var(--r); border: 1px solid var(--bdr);
  background: transparent; color: var(--text-2);
  font-family: var(--f-body); font-size: 13px;
  cursor: pointer; transition: all var(--transition);
}
.btn-ghost:hover { border-color: var(--bdr-hi); color: var(--text); }

.btn-primary {
  padding: 10px 22px; border-radius: var(--r); border: none;
  background: var(--teal); color: #020c08;
  font-family: var(--f-body); font-size: 14px; font-weight: 600;
  cursor: pointer; transition: opacity var(--transition), box-shadow var(--transition);
}
.btn-primary:hover { opacity: 0.9; box-shadow: 0 6px 24px rgba(0,229,170,0.25); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.modal-result {
  margin: 0 24px 22px; padding: 14px;
  border-radius: 10px;
  font-family: var(--f-mono); font-size: 12.5px; line-height: 1.65;
  white-space: pre;
}
.modal-result.success    { background: rgba(0,229,170,0.08); border: 1px solid rgba(0,229,170,0.2); color: var(--teal); }
.modal-result.anomaly-result { background: var(--red-dim); border: 1px solid rgba(240,65,106,0.3); color: var(--red); }

@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60% { transform: translateX(-6px); }
  40%,80% { transform: translateX(6px); }
}

/* ══════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════ */
.footer { border-top: 1px solid var(--bdr); background: var(--bg-1); }
.footer-inner {
  max-width: 1300px; margin: 0 auto;
  padding: 28px 2rem;
  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
}
.footer-logo {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--f-display); font-size: 14px; font-weight: 600; color: var(--text-2);
}
.footer-copy { font-size: 12px; color: var(--text-3); margin-left: auto; }
.footer-links { display: flex; gap: 20px; }
.footer-links a { font-size: 13px; color: var(--text-3); text-decoration: none; transition: color var(--transition); }
.footer-links a:hover { color: var(--text-2); }

/* ══════════════════════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .analyzer-layout, .batch-layout { grid-template-columns: 1fr; }
  .settings-layout { grid-template-columns: 1fr; }
  .health-card { position: static; }
  .breakdown-row { grid-template-columns: repeat(3, 1fr); }
  .stats-row { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .nav-tabs { display: none; }
  .hero { padding: 50px 1.5rem 40px; }
  .page-wrap { padding-left: 1.5rem; padding-right: 1.5rem; }
  .stats-row { grid-template-columns: 1fr 1fr; }
  .breakdown-row { grid-template-columns: 1fr 1fr; }
  .alert-summary-row { grid-template-columns: 1fr 1fr; }
  .field-row { grid-template-columns: 1fr; }
  .footer-copy { display: none; }
}
