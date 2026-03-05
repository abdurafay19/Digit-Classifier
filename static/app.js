/* ══════════════════════════════════════
   HERO GRID ANIMATION
══════════════════════════════════════ */
(function () {
  const cells = document.querySelectorAll('.hg-cell');
  function randomLit() {
    cells.forEach(c => c.classList.remove('lit'));
    const count = 3 + Math.floor(Math.random() * 3);
    const indices = [...Array(cells.length).keys()]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    indices.forEach(i => cells[i].classList.add('lit'));
  }
  randomLit();
  setInterval(randomLit, 1800);
})();

/* ══════════════════════════════════════
   CANVAS DRAWING
══════════════════════════════════════ */
const canvas = document.getElementById('draw-canvas');
const ctx = canvas.getContext('2d');

// Size canvas to its CSS display size
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width  = rect.width  * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  ctx.fillStyle = '#080a08';
  ctx.fillRect(0, 0, rect.width, rect.height);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Drawing state
let drawing = false;
let lastX = 0, lastY = 0;
let hasDrawn = false;

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function startDraw(e) {
  e.preventDefault();
  drawing = true;
  hasDrawn = true;
  const { x, y } = getPos(e);
  lastX = x; lastY = y;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#d4f5d0';
  ctx.fill();
}

function draw(e) {
  if (!drawing) return;
  e.preventDefault();
  const { x, y } = getPos(e);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = '#d4f5d0';
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  lastX = x; lastY = y;
}

function endDraw() { drawing = false; }

canvas.addEventListener('mousedown',  startDraw);
canvas.addEventListener('mousemove',  draw);
canvas.addEventListener('mouseup',    endDraw);
canvas.addEventListener('mouseleave', endDraw);
canvas.addEventListener('touchstart', startDraw, { passive: false });
canvas.addEventListener('touchmove',  draw,       { passive: false });
canvas.addEventListener('touchend',   endDraw);

/* ══════════════════════════════════════
   CLEAR
══════════════════════════════════════ */
document.getElementById('clearBtn').addEventListener('click', () => {
  const rect = canvas.getBoundingClientRect();
  ctx.fillStyle = '#080a08';
  ctx.fillRect(0, 0, rect.width, rect.height);
  hasDrawn = false;
  showEmpty();
});

/* ══════════════════════════════════════
   RESULTS RENDERING
══════════════════════════════════════ */
function showEmpty() {
  document.getElementById('results-area').innerHTML = `
    <div class="empty-state" id="emptyState">
      <div class="empty-icon">◎</div>
      <div class="empty-title">No prediction yet</div>
      <div class="empty-sub">Draw a digit on the left,<br>then click Run Inference</div>
    </div>`;
}

function showLoading() {
  document.getElementById('results-area').innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <div class="loading-text">Running inference…</div>
    </div>`;
}

function showResults(data) {
  const pred  = data.prediction;
  const conf  = data.confidence;
  const probs = data.probabilities;
  const confPct = (conf * 100).toFixed(1);

  // Sort all 10 digits by probability descending
  const sorted = Object.entries(probs)
    .sort((a, b) => b[1] - a[1]);

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
          <div class="conf-range">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div class="probs-section">
        <div class="probs-label">Full probability distribution</div>
        <div class="probs-grid">
          ${barsHTML}
        </div>
      </div>
    </div>`;
}

function showError(msg) {
  document.getElementById('results-area').innerHTML = `
    <div class="empty-state">
      <div class="empty-icon" style="color:#ff6b6b;border-color:rgba(255,107,107,0.2);background:rgba(255,107,107,0.07);">⚠</div>
      <div class="empty-title" style="color:#ff9999;">${msg}</div>
      <div class="empty-sub">Check that the server is running</div>
    </div>`;
}

/* ══════════════════════════════════════
   PREDICT
══════════════════════════════════════ */
document.getElementById('predictBtn').addEventListener('click', async () => {
  if (!hasDrawn) {
    showError('Draw a digit first');
    return;
  }

  showLoading();

  // Export canvas to blob
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
    }
  }, 'image/png');
});

/* ══════════════════════════════════════
   NAV TABS (cosmetic)
══════════════════════════════════════ */
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});
