/* ══════════════════════════════════════
   HERO GRID ANIMATION
══════════════════════════════════════ */
(function () {
  const cells = document.querySelectorAll('.hg-cell');
  if (!cells.length) return;
  function randomLit() {
    cells.forEach(c => c.classList.remove('lit'));
    const count = 3 + Math.floor(Math.random() * 3);
    [...Array(cells.length).keys()]
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .forEach(i => cells[i].classList.add('lit'));
  }
  randomLit();
  setInterval(randomLit, 1800);
})();

/* ══════════════════════════════════════
   CANVAS SETUP
   Key fix: never accumulate ctx.scale().
   Instead, always setTransform() to start fresh.
══════════════════════════════════════ */
const canvas = document.getElementById('draw-canvas');
const ctx    = canvas.getContext('2d');
const DPR    = window.devicePixelRatio || 1;

function resizeCanvas() {
  // Read the CSS-rendered size
  const rect = canvas.getBoundingClientRect();
  const w = Math.round(rect.width);
  const h = Math.round(rect.height);

  // Save current drawing as image before resizing
  let snapshot = null;
  if (canvas.width > 0 && canvas.height > 0) {
    try { snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); } catch (_) {}
  }

  // Resize the backing buffer
  canvas.width  = w * DPR;
  canvas.height = h * DPR;

  // Reset transform cleanly — no cumulative scaling
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  // Fill background
  ctx.fillStyle = '#070908';
  ctx.fillRect(0, 0, w, h);

  // Restore drawing (best-effort; ignored if sizes differ)
  if (snapshot) {
    try { ctx.putImageData(snapshot, 0, 0); } catch (_) {}
  }
}

resizeCanvas();

// Debounce resize to avoid jank during orientation change
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeCanvas, 80);
});

/* ══════════════════════════════════════
   DRAWING
══════════════════════════════════════ */
let isDrawing = false;
let lastX = 0, lastY = 0;
let hasDrawn = false;

/**
 * Get pointer position relative to canvas CSS size.
 * Works for both mouse and touch (single touch).
 */
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const src  = e.touches ? e.touches[0] : e;
  return {
    x: src.clientX - rect.left,
    y: src.clientY - rect.top,
  };
}

function startDraw(e) {
  e.preventDefault();
  isDrawing = true;
  hasDrawn  = true;
  const { x, y } = getPos(e);
  lastX = x; lastY = y;

  // Draw a dot on tap/click so single points register
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#d4f5d0';
  ctx.fill();
}

function moveDraw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const { x, y } = getPos(e);

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.strokeStyle  = '#d4f5d0';
  ctx.lineWidth    = 20;
  ctx.lineCap      = 'round';
  ctx.lineJoin     = 'round';
  ctx.stroke();

  lastX = x; lastY = y;
}

function endDraw(e) {
  isDrawing = false;
}

// Mouse
canvas.addEventListener('mousedown',  startDraw);
canvas.addEventListener('mousemove',  moveDraw);
canvas.addEventListener('mouseup',    endDraw);
canvas.addEventListener('mouseleave', endDraw);

// Touch — passive:false lets us call e.preventDefault() to stop scroll
canvas.addEventListener('touchstart', startDraw, { passive: false });
canvas.addEventListener('touchmove',  moveDraw,  { passive: false });
canvas.addEventListener('touchend',   endDraw,   { passive: false });
canvas.addEventListener('touchcancel',endDraw,   { passive: false });

/* ══════════════════════════════════════
   CLEAR
══════════════════════════════════════ */
document.getElementById('clearBtn').addEventListener('click', () => {
  const rect = canvas.getBoundingClientRect();
  ctx.fillStyle = '#070908';
  ctx.fillRect(0, 0, rect.width, rect.height);
  hasDrawn = false;
  showEmpty();
});

/* ══════════════════════════════════════
   UI STATE HELPERS
══════════════════════════════════════ */
function showEmpty() {
  document.getElementById('results-area').innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">◎</div>
      <div class="empty-title">No prediction yet</div>
      <div class="empty-sub">Draw a digit above,<br>then tap <strong>Run Inference</strong></div>
    </div>`;
}

function showLoading() {
  document.getElementById('results-area').innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <div class="loading-text">Running inference…</div>
    </div>`;
}

function showError(msg) {
  document.getElementById('results-area').innerHTML = `
    <div class="empty-state">
      <div class="empty-icon" style="color:#ff8080;border-color:rgba(255,80,80,0.2);background:rgba(255,80,80,0.07);">⚠</div>
      <div class="empty-title" style="color:#ff9999;">${msg}</div>
      <div class="empty-sub">Make sure the server is running</div>
    </div>`;
}

function showResults(data) {
  const pred    = data.prediction;
  const conf    = data.confidence;
  const probs   = data.probabilities;
  const confPct = (conf * 100).toFixed(1);

  const sorted = Object.entries(probs).sort((a, b) => b[1] - a[1]);

  const barsHTML = sorted.map(([digit, prob]) => {
    const isTop = parseInt(digit) === pred;
    const pct   = (prob * 100).toFixed(2);
    const w     = (prob * 100).toFixed(3);
    return `
      <div class="prob-row ${isTop ? 'is-top' : ''}">
        <span class="prob-num">${digit}</span>
        <div class="prob-bar-track">
          <div class="prob-bar-fill" style="width:${w}%"></div>
        </div>
        <span class="prob-pct">${pct}%</span>
      </div>`;
  }).join('');

  document.getElementById('results-area').innerHTML = `
    <div class="results-content">
      <div class="pred-hero">
        <div class="pred-digit">${pred}</div>
        <div class="pred-info">
          <div class="pred-label">Top prediction · confidence</div>
          <div class="pred-conf">${confPct}<small>%</small></div>
          <div class="conf-track">
            <div class="conf-fill" style="width:${confPct}%"></div>
          </div>
          <div class="conf-range"><span>0%</span><span>50%</span><span>100%</span></div>
        </div>
      </div>
      <div class="probs-section">
        <div class="probs-label">Full probability distribution</div>
        <div class="probs-grid">${barsHTML}</div>
      </div>
    </div>`;

  // Scroll results into view on mobile
  if (window.innerWidth <= 680) {
    document.getElementById('results-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ══════════════════════════════════════
   PREDICT
══════════════════════════════════════ */
document.getElementById('predictBtn').addEventListener('click', () => {
  if (!hasDrawn) { showError('Draw a digit first'); return; }

  const btn = document.getElementById('predictBtn');
  btn.disabled = true;
  showLoading();

  canvas.toBlob(async (blob) => {
    const fd = new FormData();
    fd.append('file', blob, 'digit.png');

    try {
      const res = await fetch('/predict', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      showResults(data);
    } catch (err) {
      showError(err.message || 'Request failed');
    } finally {
      btn.disabled = false;
    }
  }, 'image/png');
});

/* ══════════════════════════════════════
   NAV TABS (cosmetic only)
══════════════════════════════════════ */
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});
