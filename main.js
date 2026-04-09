/* ═══════════════════════════════════════════════════════
   LOGSENTINEL — main.js  v2
   Tab SPA · Analyzer · Alerts · Settings · Charts
═══════════════════════════════════════════════════════ */
"use strict";

// ── Global State ────────────────────────────────────────────────
let allLogs         = [];
let allAlerts       = [];
let activeCategory  = "all";
let anomalyOnly     = false;
let alertStatusFilter = "all";
let analyzeMode     = "single";
let autoRefreshTimer = null;
let currentTab      = "dashboard";

// ── Quick-fill templates ─────────────────────────────────────────
const QUICK = {
  security:    { msg: "Unauthorized access attempt: invalid token from 192.168.10.55 — authentication failed",      level: "ERROR",    src: "auth-service" },
  network:     { msg: "Connection refused: timeout on gateway 10.0.0.1 — TLS handshake failed after 30s",           level: "WARNING",  src: "api-gateway" },
  database:    { msg: "Database error: deadlock detected on transaction rollback — query failed after 3 retries",    level: "CRITICAL", src: "postgres" },
  performance: { msg: "High latency detected: CPU usage at 94% — memory leak in worker thread, rate limit exceeded", level: "WARNING",  src: "metrics-agent" },
  normal:      { msg: "User login successful from 172.16.0.22 — session created",                                   level: "INFO",     src: "auth-service" },
};
const ANALYZE_QUICK = {
  security:    "Unauthorized access attempt detected from 192.168.1.99 — authentication failed, invalid token",
  network:     "Connection timeout on gateway 10.0.0.1 after 30s — TLS handshake failed, service unavailable",
  database:    "Database deadlock detected on transaction rollback — query failed, connection pool exhausted",
  perf:        "High latency detected: CPU at 96%, memory leak in main thread, disk quota exceeded",
  normal:      "User login successful from 10.0.0.25 — session token issued, health check passed",
};

const CAT_CONFIG = {
  security:    { icon: "🔴", color: "red" },
  network:     { icon: "🔵", color: "blue" },
  database:    { icon: "🟡", color: "amber" },
  performance: { icon: "🟣", color: "purple" },
  general:     { icon: "⬡",  color: "text-3" },
};

// ══════════════════════════════════════════════════════════════════
//  TAB NAVIGATION
// ══════════════════════════════════════════════════════════════════
document.querySelectorAll(".nav-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    switchTab(tab);
  });
});

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".nav-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".tab-section").forEach(s => s.classList.toggle("active", s.id === `tab-${tab}`));

  if (tab === "alerts")   fetchAlerts();
  if (tab === "settings") { fetchSettings(); fetchHealth(); }
  if (tab === "dashboard") fetchLogs();
}

// ══════════════════════════════════════════════════════════════════
//  DASHBOARD — FETCH & RENDER LOGS
// ══════════════════════════════════════════════════════════════════
async function fetchLogs() {
  try {
    const res  = await fetch("/logs");
    const data = await res.json();
    allLogs = data;
    renderTable();
    updateStats();
    renderBreakdown();
    updateStatus(true);
  } catch (err) {
    updateStatus(false);
    showTableEmpty("Could not reach the server.");
  }
}

function refreshLogs() { fetchLogs(); }

function renderTable() {
  const tbody  = document.getElementById("logBody");
  const search = (document.getElementById("logSearch")?.value || "").toLowerCase();

  let list = allLogs;
  if (activeCategory !== "all") list = list.filter(l => l.category === activeCategory);
  if (anomalyOnly)              list = list.filter(l => l.anomaly);
  if (search)                   list = list.filter(l => (l.message + " " + (l.source||"")).toLowerCase().includes(search));

  document.getElementById("feedCount").textContent = list.length + " log" + (list.length !== 1 ? "s" : "");

  if (!list.length) { showTableEmpty("No logs match the current filter."); return; }
  tbody.innerHTML = list.map(rowHTML).join("");
}

function rowHTML(log) {
  const ts     = fmtTime(log.timestamp);
  const score  = log.anomaly_score ?? 0;
  const pct    = Math.round(score * 100);
  const cls    = score >= 0.75 ? "score-high" : score >= 0.4 ? "score-medium" : "score-low";

  return `<tr class="${log.anomaly ? "is-anomaly" : ""}">
    <td><span class="ts-cell">${ts}</span></td>
    <td><span class="source-badge">${esc(log.source||"unknown")}</span></td>
    <td><span class="level-badge level-${log.level||"INFO"}">${log.level||"INFO"}</span></td>
    <td><span class="cat-badge cat-${log.category||"general"}">${log.category||"general"}</span></td>
    <td>${log.anomaly
      ? `<span class="anomaly-yes">Yes</span>`
      : `<span class="anomaly-no">—</span>`}</td>
    <td>
      <div class="score-wrap">
        <div class="score-bar"><div class="score-fill ${cls}" style="width:${pct}%"></div></div>
        <span class="score-num">${score.toFixed(2)}</span>
      </div>
    </td>
    <td><span class="msg-cell ${log.anomaly ? "anomaly-msg" : ""}" title="${esc(log.message)}">${esc(log.message)}</span></td>
  </tr>`;
}

function showTableEmpty(msg) {
  document.getElementById("logBody").innerHTML = `
    <tr class="empty-row"><td colspan="7">
      <div class="empty-state"><span style="opacity:.3;font-size:28px">⬡</span><span>${esc(msg)}</span></div>
    </td></tr>`;
}

// Stats
function updateStats() {
  const total     = allLogs.length;
  const anomalies = allLogs.filter(l => l.anomaly).length;
  const rate      = total ? Math.round((anomalies / total) * 100) : 0;
  const latest    = allLogs[0]?.source || "—";

  countUp("totalLogs",      total);
  countUp("totalAnomalies", anomalies);
  document.getElementById("anomalyRate").textContent  = rate + "%";
  document.getElementById("latestSource").textContent = latest;
}

function countUp(id, target) {
  const el  = document.getElementById(id);
  const cur = parseInt(el.textContent) || 0;
  if (cur === target) return;
  const diff = target - cur, steps = 20;
  let step = 0, current = cur;
  clearInterval(el._timer);
  el._timer = setInterval(() => {
    step++;
    current += diff / steps;
    el.textContent = Math.round(current);
    if (step >= steps) { el.textContent = target; clearInterval(el._timer); }
  }, 20);
}

// Breakdown
function renderBreakdown() {
  const counts = { security:0, network:0, database:0, performance:0, general:0 };
  allLogs.forEach(l => { const c = l.category||"general"; counts[c] !== undefined ? counts[c]++ : counts.general++; });
  const maxVal = Math.max(...Object.values(counts), 1);
  const total  = allLogs.length || 1;

  document.getElementById("breakdownGrid").innerHTML = Object.entries(CAT_CONFIG).map(([cat, cfg]) => {
    const n   = counts[cat];
    const pct = Math.round((n/total)*100);
    const bar = Math.round((n/maxVal)*100);
    return `<div class="bk-card bk-${cat}">
      <div class="bk-icon">${cfg.icon}</div>
      <div class="bk-name">${cat}</div>
      <div class="bk-count">${n}</div>
      <div class="bk-pct">${pct}% of total</div>
      <div class="bk-bar-wrap"><div class="bk-bar" style="width:${bar}%"></div></div>
    </div>`;
  }).join("");
}

// ── Timeline chart ───────────────────────────────────────────────
async function fetchTimeline() {
  try {
    const res  = await fetch("/stats/timeline");
    const data = await res.json();
    drawTimeline(data);
  } catch { /* silent */ }
}

function drawTimeline(data) {
  const svg = document.getElementById("timelineChart");
  if (!svg || !data.length) return;

  const W = 900, H = 80, pad = 20;
  const maxTotal = Math.max(...data.map(d => d.total), 1);
  const xStep    = (W - pad * 2) / Math.max(data.length - 1, 1);

  const pts  = (key, scale) => data.map((d, i) => {
    const x = pad + i * xStep;
    const y = H - pad - ((d[key] || 0) / scale) * (H - pad * 2);
    return `${x},${y}`;
  }).join(" ");

  const area = (key, scale, fill) => {
    const points = data.map((d, i) => {
      const x = pad + i * xStep;
      const y = H - pad - ((d[key] || 0) / scale) * (H - pad * 2);
      return [x, y];
    });
    const path = points.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
    const last = points[points.length - 1];
    const first = points[0];
    return `${path} L${last[0]},${H - pad} L${first[0]},${H - pad} Z`;
  };

  svg.innerHTML = `
    <defs>
      <linearGradient id="gradTeal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#00e5aa" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#00e5aa" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f0416a" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#f0416a" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${area("total", maxTotal, "gradTeal")}" fill="url(#gradTeal)"/>
    <polyline points="${pts("total", maxTotal)}" fill="none" stroke="#00e5aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${area("anomalies", maxTotal, "gradRed")}" fill="url(#gradRed)"/>
    <polyline points="${pts("anomalies", maxTotal)}" fill="none" stroke="#f0416a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    ${data.map((d, i) => {
      const x = pad + i * xStep;
      return `<text x="${x}" y="${H - 4}" font-size="9" fill="#3d4d5e" text-anchor="middle">${d.hour}h</text>`;
    }).join("")}
  `;
}

// ── Category filter buttons ──────────────────────────────────────
document.querySelectorAll(".filter-btn[data-cat]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn[data-cat]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.cat;
    renderTable();
  });
});

document.getElementById("anomalyOnly")?.addEventListener("change", e => {
  anomalyOnly = e.target.checked;
  renderTable();
});

// ══════════════════════════════════════════════════════════════════
//  INJECT LOG MODAL
// ══════════════════════════════════════════════════════════════════
function openModal() {
  document.getElementById("modalOverlay").classList.add("open");
  document.getElementById("logMessage").focus();
  resetModal();
}
function closeModal(e) {
  if (e && e.target !== document.getElementById("modalOverlay")) return;
  document.getElementById("modalOverlay").classList.remove("open");
  resetModal();
}
function resetModal() {
  document.getElementById("logMessage").value = "";
  document.getElementById("logSource").value  = "";
  document.getElementById("logLevel").value   = "INFO";
  const r = document.getElementById("modalResult");
  r.style.display = "none"; r.textContent = "";
}
function quickFill(type) {
  const t = QUICK[type]; if (!t) return;
  document.getElementById("logMessage").value = t.msg;
  document.getElementById("logLevel").value   = t.level;
  document.getElementById("logSource").value  = t.src;
}

async function submitLog() {
  const message = document.getElementById("logMessage").value.trim();
  const level   = document.getElementById("logLevel").value;
  const source  = document.getElementById("logSource").value.trim() || "manual-entry";
  if (!message) { shakeModal(); return; }

  const btn = document.getElementById("submitBtn");
  btn.textContent = "Analyzing…"; btn.disabled = true;

  try {
    const res  = await fetch("/log", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({message, level, source}),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unknown error");

    showModalResult(data, message);
    if (data.anomaly) showAlertTicker(message, data.score, data.category);
    fetchLogs();
    updateAlertBadge();

  } catch (err) {
    const r = document.getElementById("modalResult");
    r.style.display = "block"; r.className = "modal-result anomaly-result";
    r.textContent = "✕ Error: " + err.message;
  } finally {
    btn.textContent = "Analyze & Submit"; btn.disabled = false;
  }
}

function showModalResult(data, message) {
  const el = document.getElementById("modalResult");
  el.style.display = "block";
  if (data.anomaly) {
    el.className = "modal-result anomaly-result";
    el.innerHTML = `🚨 ANOMALY DETECTED\nCategory : ${data.category}\nSeverity : ${data.severity || "—"}\nScore    : ${data.score}\nReasons  : ${(data.reasons||[]).slice(0,2).join(" · ") || "—"}`;
  } else {
    el.className = "modal-result success";
    el.innerHTML = `✔ Log clean\nCategory : ${data.category}\nScore    : ${data.score}\nStatus   : Normal`;
  }
}

function shakeModal() {
  const m = document.getElementById("modalBox");
  m.style.animation = "none"; m.offsetHeight;
  m.style.animation = "shake 0.3s ease";
}

// ══════════════════════════════════════════════════════════════════
//  ALERT TICKER
// ══════════════════════════════════════════════════════════════════
function showAlertTicker(message, score, category) {
  const ticker = document.getElementById("alertTicker");
  const msg    = document.getElementById("tickerMsg");
  msg.textContent = `[${(category||"?").toUpperCase()}]  Score ${score}  —  ${message}`;
  ticker.style.display = "flex";
  clearTimeout(ticker._hide);
  ticker._hide = setTimeout(() => (ticker.style.display = "none"), 9000);
}

// ══════════════════════════════════════════════════════════════════
//  ANALYZER TAB
// ══════════════════════════════════════════════════════════════════
function setAnalyzeMode(mode) {
  analyzeMode = mode;
  document.getElementById("modeBtn-single").classList.toggle("active", mode === "single");
  document.getElementById("modeBtn-batch").classList.toggle("active", mode === "batch");
  document.getElementById("analyzer-single").style.display = mode === "single" ? "block" : "none";
  document.getElementById("analyzer-batch").style.display  = mode === "batch"  ? "block" : "none";
}

function updateCharCount() {
  const val = document.getElementById("analyzeMessage")?.value || "";
  document.getElementById("charCount").textContent = val.length + " chars";
}

function fillAnalyzer(type) {
  const msg = ANALYZE_QUICK[type]; if (!msg) return;
  document.getElementById("analyzeMessage").value = msg;
  updateCharCount();
}

// Update batch line count
document.getElementById("batchMessages")?.addEventListener("input", () => {
  const lines = (document.getElementById("batchMessages").value.split("\n").filter(l => l.trim())).length;
  document.getElementById("lineCount").textContent = lines + " line" + (lines !== 1 ? "s" : "");
});

async function runAnalysis() {
  const message = document.getElementById("analyzeMessage").value.trim();
  if (!message) return;

  const btn  = document.getElementById("analyzeBtn");
  const span = document.getElementById("analyzeBtnText");
  span.textContent = "Analyzing…"; btn.disabled = true;

  const out = document.getElementById("analyzerOutput");
  out.innerHTML = `<div class="output-empty"><div class="spinner"></div><div>Running AI analysis…</div></div>`;

  try {
    const res  = await fetch("/analyze", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({message}),
    });
    const data = await res.json();
    renderAnalysisResult(data, out);
  } catch (err) {
    out.innerHTML = `<div class="output-empty"><div style="color:var(--red)">✕ Analysis failed: ${esc(err.message)}</div></div>`;
  } finally {
    span.textContent = "Analyze Log"; btn.disabled = false;
  }
}

function renderAnalysisResult(data, container) {
  container.className = "analyzer-output-panel " + (data.anomaly ? "anomaly-state" : "clean-state");

  const scoreOffset = 141.37 - (data.score * 141.37);
  const arcColor    = data.anomaly ? "var(--red)" : "var(--teal)";

  const reasons = (data.reasons || []).map(r => {
    const typeKey = (r.type || "info").toLowerCase();
    const label   = { keyword:"KEYWORD", pattern:"PATTERN", ml:"ML", http:"HTTP", info:"INFO" }[typeKey] || "INFO";
    const cls     = `rt-${typeKey}`;
    return `<div class="reason-item">
      <span class="reason-type ${cls}">${label}</span>
      <span class="reason-text">${esc(r.text || r)}</span>
    </div>`;
  }).join("");

  container.innerHTML = `<div class="analysis-result">
    <div class="result-header">
      <div class="result-verdict ${data.anomaly ? "anomaly" : "clean"}">
        ${data.anomaly ? "🚨 Anomaly Detected" : "✔ Log Clean"}
      </div>
      <span class="sev-badge sev-${data.severity||"NONE"}">${data.severity||"NONE"}</span>
    </div>

    <div class="score-arc-wrap">
      <svg class="score-arc-svg" viewBox="0 0 100 60">
        <path d="M10 55 A45 45 0 0 1 90 55" fill="none" stroke="var(--bdr-hi)" stroke-width="10" stroke-linecap="round"/>
        <path d="M10 55 A45 45 0 0 1 90 55" fill="none" stroke="${arcColor}" stroke-width="10" stroke-linecap="round"
              stroke-dasharray="141.37" stroke-dashoffset="${scoreOffset}"
              style="transition:stroke-dashoffset 0.8s ease"/>
      </svg>
      <div class="score-arc-info">
        <div class="score-arc-val" style="color:${arcColor}">${(data.score*100).toFixed(0)}%</div>
        <div class="score-arc-label">Anomaly confidence</div>
        <div class="score-meta">
          <div class="score-meta-item"><span class="score-meta-key">Category: </span><span class="score-meta-val">${data.category||"general"}</span></div>
          <div class="score-meta-item"><span class="score-meta-key">ML Score: </span><span class="score-meta-val">${(data.ml_score||0).toFixed(2)}</span></div>
          <div class="score-meta-item"><span class="score-meta-key">Rule Hit: </span><span class="score-meta-val">${data.rule_hit ? "Yes" : "No"}</span></div>
        </div>
      </div>
    </div>

    ${reasons ? `<div class="reasons-label">Detection Reasons</div><div class="reason-list">${reasons}</div>` : ""}
  </div>`;
}

// Batch analysis
async function runBatchAnalysis() {
  const raw  = document.getElementById("batchMessages").value;
  const logs = raw.split("\n").map(l => l.trim()).filter(Boolean);
  if (!logs.length) return;

  const out = document.getElementById("batchOutput");
  out.innerHTML = `<div class="output-empty"><div class="spinner"></div><div>Analyzing ${logs.length} logs…</div></div>`;

  try {
    const res  = await fetch("/analyze/batch", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({logs}),
    });
    const data = await res.json();
    renderBatchResult(data, out);
  } catch (err) {
    out.innerHTML = `<div class="output-empty" style="color:var(--red)">✕ ${esc(err.message)}</div>`;
  }
}

function renderBatchResult(data, container) {
  const rows = (data.results || []).map(r => {
    const pct  = Math.round((r.score||0)*100);
    const cls  = r.anomaly ? "score-high" : "score-low";
    return `<div class="br-item ${r.anomaly ? "anomaly" : ""}">
      <span class="br-num">${r.index}</span>
      <div class="br-body">
        <div class="br-msg">${esc(r.message)}</div>
        <div class="br-meta">
          <span class="sev-badge sev-${r.severity}">${r.severity}</span>
          <span class="cat-badge cat-${r.category}">${r.category}</span>
          <div class="score-wrap">
            <div class="score-bar"><div class="score-fill ${cls}" style="width:${pct}%"></div></div>
            <span class="score-num">${r.score.toFixed(2)}</span>
          </div>
        </div>
        ${r.reasons.length ? `<div class="br-reasons">${r.reasons.slice(0,2).map(esc).join(" · ")}</div>` : ""}
      </div>
    </div>`;
  }).join("");

  container.innerHTML = `
    <div class="batch-summary">
      <div class="bs-item"><div class="bs-val">${data.total}</div><div class="bs-label">Total</div></div>
      <div class="bs-item"><div class="bs-val red">${data.anomalies}</div><div class="bs-label">Anomalies</div></div>
      <div class="bs-item"><div class="bs-val teal">${data.clean}</div><div class="bs-label">Clean</div></div>
    </div>
    <div class="batch-results-list">${rows}</div>`;
}

// ══════════════════════════════════════════════════════════════════
//  ALERTS TAB
// ══════════════════════════════════════════════════════════════════
async function fetchAlerts() {
  try {
    const res  = await fetch("/alerts");
    allAlerts  = await res.json();
    renderAlerts();
    fetchAlertStats();
  } catch { /* silent */ }
}

async function fetchAlertStats() {
  try {
    const res  = await fetch("/alerts/stats");
    const data = await res.json();
    document.getElementById("alertOpen").textContent        = data.open;
    document.getElementById("alertInvestigating").textContent = data.investigating;
    document.getElementById("alertResolved").textContent    = data.resolved;
    document.getElementById("alertCritical").textContent    = data.critical;
    updateAlertBadge(data.open);
  } catch { /* silent */ }
}

function updateAlertBadge(count) {
  const badge = document.getElementById("alertBadge");
  if (!badge) return;
  if (count === undefined) {
    fetch("/alerts/stats").then(r => r.json()).then(d => {
      badge.textContent    = d.open;
      badge.style.display  = d.open > 0 ? "inline-block" : "none";
    }).catch(() => {});
    return;
  }
  badge.textContent   = count;
  badge.style.display = count > 0 ? "inline-block" : "none";
}

function renderAlerts() {
  const feed     = document.getElementById("alertFeed");
  const sevFilter = document.getElementById("alertSeverityFilter")?.value || "";

  let list = allAlerts;
  if (alertStatusFilter !== "all") list = list.filter(a => a.status === alertStatusFilter);
  if (sevFilter)                   list = list.filter(a => a.severity === sevFilter);

  if (!list.length) {
    feed.innerHTML = `<div class="output-empty"><span style="opacity:.3;font-size:28px">⬡</span><span>No alerts match filter</span></div>`;
    return;
  }
  feed.innerHTML = list.map(alertCardHTML).join("");
}

function alertCardHTML(a) {
  const sevDot  = a.severity;
  const statusCls = a.status.replace(" ", "");
  const timeSince = timeDiff(a.last_seen);

  const actions = a.status === "RESOLVED"
    ? `<button class="ac-btn reopen" onclick="setAlertStatus(${a.id}, 'OPEN')">↩ Reopen</button>`
    : a.status === "OPEN"
      ? `<button class="ac-btn investigate" onclick="setAlertStatus(${a.id}, 'INVESTIGATING')">🔍 Investigate</button>
         <button class="ac-btn resolve" onclick="setAlertStatus(${a.id}, 'RESOLVED')">✔ Resolve</button>`
      : `<button class="ac-btn resolve" onclick="setAlertStatus(${a.id}, 'RESOLVED')">✔ Resolve</button>`;

  return `<div class="alert-card sev-${a.severity} status-${statusCls}" id="alert-${a.id}">
    <div class="ac-header">
      <span class="ac-sev ${sevDot}"></span>
      <span class="ac-title">${esc(a.message)}</span>
      ${a.count > 1 ? `<span class="ac-count">×${a.count}</span>` : ""}
      <span class="ac-status ${a.status}">${a.status}</span>
    </div>
    <div class="ac-body">
      <div class="ac-meta">
        <span class="ac-meta-item"><span class="sev-badge sev-${a.severity}">${a.severity}</span></span>
        <span class="ac-meta-item"><span class="cat-badge cat-${a.category}">${a.category}</span></span>
        <span class="ac-meta-item">📡 ${esc(a.source||"unknown")}</span>
        <span class="ac-meta-item">🕐 ${timeSince}</span>
        <span class="ac-meta-item">Score: <b>${(a.score||0).toFixed(2)}</b></span>
      </div>
      <div class="ac-actions">${actions}</div>
    </div>
  </div>`;
}

async function setAlertStatus(id, status) {
  try {
    await fetch(`/alerts/${id}`, {
      method: "PATCH", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({status}),
    });
    fetchAlerts();
  } catch { /* silent */ }
}

// Alert status filter buttons
document.querySelectorAll(".filter-btn[data-alert-status]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn[data-alert-status]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    alertStatusFilter = btn.dataset.alertStatus;
    renderAlerts();
  });
});

// ══════════════════════════════════════════════════════════════════
//  SETTINGS TAB
// ══════════════════════════════════════════════════════════════════
async function fetchSettings() {
  try {
    const res  = await fetch("/settings");
    const data = await res.json();

    document.getElementById("set-ml-enabled").checked   = data.ml_enabled !== "false";
    document.getElementById("set-rule-enabled").checked = data.rule_enabled !== "false";

    const sens = parseFloat(data.sensitivity || 0.5);
    document.getElementById("set-sensitivity").value    = sens;
    document.getElementById("sensitivityVal").textContent = sens.toFixed(2);

    const thresh = parseFloat(data.alert_threshold || 0.7);
    document.getElementById("set-alert-threshold").value   = thresh;
    document.getElementById("thresholdVal").textContent    = thresh.toFixed(2);

    document.getElementById("set-retention").value = data.retention_days || "30";

    if (data.theme) setTheme(data.theme, false);

  } catch { /* silent */ }
}

async function saveSettings() {
  const payload = {
    ml_enabled:      document.getElementById("set-ml-enabled").checked ? "true" : "false",
    rule_enabled:    document.getElementById("set-rule-enabled").checked ? "true" : "false",
    sensitivity:     document.getElementById("set-sensitivity").value,
    alert_threshold: document.getElementById("set-alert-threshold").value,
    retention_days:  document.getElementById("set-retention").value,
    theme:           document.documentElement.dataset.theme || "dark",
  };

  try {
    await fetch("/settings", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload),
    });
    const el = document.getElementById("saveStatus");
    el.textContent = "✔ Saved";
    setTimeout(() => (el.textContent = ""), 3000);
  } catch {
    document.getElementById("saveStatus").textContent = "✕ Save failed";
  }
}

function setTheme(theme, save = true) {
  document.documentElement.setAttribute("data-theme", theme);
  document.getElementById("theme-dark")?.classList.toggle("active", theme === "dark");
  document.getElementById("theme-light")?.classList.toggle("active", theme === "light");
  if (save) saveSettings();
}

// ══════════════════════════════════════════════════════════════════
//  SYSTEM HEALTH
// ══════════════════════════════════════════════════════════════════
async function fetchHealth() {
  try {
    const res  = await fetch("/health");
    const data = await res.json();
    renderHealth(data);
  } catch { /* silent */ }
}

function renderHealth(d) {
  // Gauges (arc offset: 141.37 = full circle at pi*45)
  setGauge("cpuArc", d.cpu_percent,    "#00e5aa");
  setGauge("memArc", d.memory_percent, "#4499ff");

  document.getElementById("cpuVal").textContent   = d.cpu_percent + "%";
  document.getElementById("memVal").textContent   = d.memory_percent + "%";
  document.getElementById("hm-lpm").textContent   = d.logs_per_min;
  document.getElementById("hm-total").textContent = d.total_logs;
  document.getElementById("hm-uptime").textContent = d.uptime_hours + "h";

  const modelEl = document.getElementById("hm-model");
  modelEl.textContent = d.model_ready ? "✔ Ready" : "⚠ Not trained";
  modelEl.style.color = d.model_ready ? "var(--teal)" : "var(--amber)";

  const dbEl = document.getElementById("hm-db");
  dbEl.textContent = d.db_connected ? "✔ Connected" : "✕ Disconnected";
  dbEl.style.color = d.db_connected ? "var(--teal)" : "var(--red)";
}

function setGauge(arcId, pct, color) {
  const arc  = document.getElementById(arcId);
  if (!arc) return;
  const offset = 141.37 - (pct / 100) * 141.37;
  arc.setAttribute("stroke", color);
  arc.style.strokeDashoffset = offset;

  if (pct >= 85) arc.setAttribute("stroke", "var(--red)");
  else if (pct >= 65) arc.setAttribute("stroke", "var(--amber)");
  else arc.setAttribute("stroke", color);
}

// ══════════════════════════════════════════════════════════════════
//  STATUS INDICATOR
// ══════════════════════════════════════════════════════════════════
function updateStatus(online) {
  const dot   = document.getElementById("statusDot");
  const label = document.getElementById("statusLabel");
  dot.style.background  = online ? "var(--teal)" : "var(--red)";
  label.style.color     = online ? "var(--teal)" : "var(--red)";
  label.textContent     = online ? "Live" : "Offline";
}

// ══════════════════════════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════════════════════════
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.getElementById("modalOverlay").classList.remove("open");
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault(); openModal();
  }
  // 1-4 for tab switching
  if (!e.ctrlKey && !e.metaKey && !e.altKey) {
    const tabMap = { "1": "dashboard", "2": "analyzer", "3": "alerts", "4": "settings" };
    if (tabMap[e.key] && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      switchTab(tabMap[e.key]);
    }
  }
});

// ══════════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════════
function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtTime(iso) {
  if (!iso) return "—";
  try {
    const d   = new Date(iso);
    const pad = n => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  } catch { return iso; }
}

function timeDiff(iso) {
  if (!iso) return "—";
  try {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60)   return diff + "s ago";
    if (diff < 3600) return Math.floor(diff/60) + "m ago";
    if (diff < 86400) return Math.floor(diff/3600) + "h ago";
    return Math.floor(diff/86400) + "d ago";
  } catch { return "—"; }
}

// ══════════════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════════════
(function init() {
  fetchLogs();
  fetchTimeline();
  updateAlertBadge();

  // Auto-refresh every 15s
  autoRefreshTimer = setInterval(() => {
    if (currentTab === "dashboard") fetchLogs();
    if (currentTab === "alerts")    fetchAlerts();
    if (currentTab === "settings")  fetchHealth();
    updateAlertBadge();
  }, 15000);
})();
