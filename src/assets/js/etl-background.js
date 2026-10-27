// ETL background made of two fixed canvases:
//  - back  (z 0):    nodes + edges: sources (cylinders) -> transform (gears) -> dashboards (bar panels)
//  - front (z 9999): the data particles, visible above the page content
//
// Every particle lives in a loop:
//  FREE     roams the screen (wander + mouse repel, only a faint pull toward the sources)
//  CONSUME  a source swallowed it (shrinks into the node)
//  EDGE     travels source -> ETL (indigo), is transformed, then ETL -> dashboard (cyan -> emerald)
//  ...and the dashboard releases it back to FREE with a gentle outward burst.

const COLORS = { source: '102,126,234', etl: '34,211,238', dash: '52,211,153', free: '165,180,252' };
const LAYOUT = {
  desktop: { sources: 4, etl: 3, dash: 3, particles: 70 },
  mobile: { sources: 3, etl: 2, dash: 2, particles: 25 },
};

const FREE = 0, CONSUME = 1, EDGE = 2;
const CONSUME_RADIUS = 22; // particle is swallowed inside this distance
const ATTRACT_RANGE = 110; // mild pull around a source
const MOUSE_RADIUS = 120;
const WALL_MARGIN = 70; // px from the edges where the soft wall pushes particles back in
const WALL_PUSH = 90; // px/s² at the very edge (wander is 14, so it always wins)
const CAP_FACTOR = 1.5; // hard cap = base population * this
const MOVE_BURST_COOLDOWN = 10000; // ms between mouse-move bursts
const FADE_TIME = 1.5; // s a retiring particle takes to fade out

// particlesOnly: no back canvas and no nodes/edges; particles stay FREE forever.
export function initEtlBackground({ particlesOnly = false } = {}) {
  if (document.getElementById('etl-particles')) return;

  const back = particlesOnly ? null : makeCanvas('etl-background');
  const front = makeCanvas('etl-particles');
  if (back) document.body.prepend(back);
  document.body.append(front);
  const bctx = back ? back.getContext('2d') : null;
  const fctx = front.getContext('2d');
  if ((!particlesOnly && !bctx) || !fctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0, height = 0;
  const safe = { x: 0, y: 0, w: 0, h: 0 }; // viewport minus the fixed nav
  let cfg = LAYOUT.desktop;
  let nodes = [], sources = [], edges = [];
  let particles = []; // active particles (swap-remove)
  let pool = []; // spare particle objects, preallocated up to the hard cap
  let target = 0, cap = 0, dyingCount = 0, cullTimer = 0, lastMoveBurst = -Infinity;
  let scrollY = window.scrollY, lastScrollY = scrollY, scrollVel = 0;
  let mouseX = -9999, mouseY = -9999, mouseSpeed = 0, lastMoveTime = 0;
  let mouseInSafe = false;
  let lastTime = 0, clock = 0, frameId = 0;
  const pt = { x: 0, y: 0 }; // scratch point, avoids per-frame allocations

  function makeCanvas(id) {
    const c = document.createElement('canvas');
    c.id = id;
    c.setAttribute('aria-hidden', 'true');
    return c;
  }

  // ---------- layout ----------
  // The fixed top bar takes the top of the viewport.
  function measureSafeRect() {
    const nav = document.querySelector('nav');
    safe.x = 0;
    safe.y = nav ? nav.getBoundingClientRect().bottom : 0;
    safe.w = width;
    safe.h = height - safe.y;
  }

  function clipToSafe(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(safe.x, safe.y, safe.w, safe.h);
    ctx.clip();
  }

  function column(kind, count, xRatio, parallax) {
    return Array.from({ length: count }, (_, i) => ({
      kind,
      x: safe.x + safe.w * xRatio,
      baseY: safe.y + safe.h * ((i + 1) / (count + 1)),
      parallax,
      pulse: 0,
      fill: 0,
      angle: Math.random() * Math.PI,
      out: [], // outgoing edges
    }));
  }

  function link(from, to, type) {
    const edge = { from, to, type };
    from.out.push(edge);
    edges.push(edge);
  }

  function build() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    measureSafeRect();
    for (const c of [back, front]) {
      if (!c) continue;
      c.style.width = width + 'px';
      c.style.height = height + 'px';
      c.width = width * dpr;
      c.height = height * dpr;
      c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    cfg = width < 768 ? LAYOUT.mobile : LAYOUT.desktop;
    edges = [];
    if (particlesOnly) {
      sources = [];
      nodes = [];
    } else {
      sources = column('source', cfg.sources, 0.1, 0.6);
      const etl = column('etl', cfg.etl, 0.5, 1);
      const dash = column('dash', cfg.dash, 0.9, 1.4);
      nodes = [...sources, ...etl, ...dash];

      // each node connects to its own row and the next one, so edges stay readable
      sources.forEach((s, i) => {
        link(s, etl[i % etl.length], 's2e');
        link(s, etl[(i + 1) % etl.length], 's2e');
      });
      etl.forEach((e, i) => {
        link(e, dash[i % dash.length], 'e2d');
        link(e, dash[(i + 1) % dash.length], 'e2d');
      });
    }

    target = cfg.particles;
    cap = Math.round(target * CAP_FACTOR);
    pool = Array.from({ length: cap }, () => ({ state: FREE, x: 0, y: 0, vx: 0, vy: 0, ang: 0, size: 0, target: null, node: null, edge: null, t: 0, speed: 0, ct: 0, alpha: 1, dying: false, user: false, born: 0 }));
    particles = [];
    dyingCount = 0;
    for (let i = 0; i < target; i++) spawnAt(safe.x + Math.random() * safe.w, safe.y + Math.random() * safe.h, 0);
  }

  const nodeY = (n) => n.baseY + Math.sin(scrollY / 700) * 28 * n.parallax;

  // ---------- geometry ----------
  // Writes the point at parameter t of the edge into `pt` (cubic bezier, horizontal tangents).
  function pointOn(edge, t) {
    const x0 = edge.from.x, y0 = nodeY(edge.from);
    const x1 = edge.to.x, y1 = nodeY(edge.to);
    const cx = (x1 - x0) / 2;
    const u = 1 - t;
    pt.x = u * u * u * x0 + 3 * u * u * t * (x0 + cx) + 3 * u * t * t * (x1 - cx) + t * t * t * x1;
    pt.y = u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1;
  }

  // ---------- particle state machine ----------
  // Takes a particle from the pool (returns false when the hard cap is reached).
  function spawnAt(x, y, burst) {
    const p = pool.pop();
    if (!p) return false;
    resetFree(p, x, y, burst);
    particles.push(p);
    return true;
  }

  // Burst of user-spawned particles flying outward; fewer if the cap would be exceeded.
  function spawnBurst(x, y, count) {
    for (let i = 0; i < count; i++) {
      if (!spawnAt(x, y, 50 + Math.random() * 70)) break;
      particles[particles.length - 1].user = true;
    }
  }

  function resetFree(p, x, y, burst) {
    p.state = FREE;
    p.alpha = 1;
    p.dying = false;
    p.user = false;
    p.born = clock;
    p.x = x;
    p.y = y;
    p.ang = Math.random() * Math.PI * 2;
    p.vx = Math.cos(p.ang) * burst;
    p.vy = Math.sin(p.ang) * burst;
    p.size = 1.3 + Math.random() * 1.4;
    p.target = sources.length ? sources[Math.floor(Math.random() * sources.length)] : null;
  }

  function updateFree(p, dt) {
    // wander: slowly turning heading gives a smooth, noisy drift
    p.ang += (Math.random() - 0.5) * 3 * dt;
    p.vx += Math.cos(p.ang) * 14 * dt;
    p.vy += Math.sin(p.ang) * 14 * dt;

    // very weak global bias toward the assigned source so the loop eventually closes
    let dx = 0, dy = 0, d = 1;
    if (p.target) {
      dx = p.target.x - p.x;
      dy = nodeY(p.target) - p.y;
      d = Math.hypot(dx, dy) || 1;
      p.vx += (dx / d) * 2 * dt;
      p.vy += (dy / d) * 2 * dt;
    }

    // mild attraction only close to any source + consume check
    for (const s of sources) {
      dx = s.x - p.x;
      dy = nodeY(s) - p.y;
      d = Math.hypot(dx, dy) || 1;
      if (d < CONSUME_RADIUS && !p.dying) {
        p.state = CONSUME;
        p.node = s;
        p.ct = 0;
        return;
      }
      if (d < ATTRACT_RANGE) {
        const k = (1 - d / ATTRACT_RANGE) * 38 * dt;
        p.vx += (dx / d) * k;
        p.vy += (dy / d) * k;
      }
    }

    // mouse: repel with falloff + swirl + random scatter, stronger when the pointer moves fast
    dx = p.x - mouseX;
    dy = p.y - mouseY;
    d = Math.hypot(dx, dy);
    if (d < MOUSE_RADIUS && d > 0.01 && mouseInSafe) {
      const f = (1 - d / MOUSE_RADIUS) * (1 - d / MOUSE_RADIUS);
      const power = (260 + Math.min(mouseSpeed, 3000) * 0.35) * f * dt;
      p.vx += (dx / d) * power - (dy / d) * power * 0.5 + (Math.random() - 0.5) * power * 0.8;
      p.vy += (dy / d) * power + (dx / d) * power * 0.5 + (Math.random() - 0.5) * power * 0.8;
    }

    // damping + speed cap
    const damp = 1 - Math.min(0.9 * dt, 0.5);
    p.vx *= damp;
    p.vy *= damp;
    const sp = Math.hypot(p.vx, p.vy);
    if (sp > 260) {
      p.vx *= 260 / sp;
      p.vy *= 260 / sp;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // soft walls: push away from the edges so particles never pile up against them
    const right = safe.x + safe.w, bottom = safe.y + safe.h;
    const push = WALL_PUSH * dt;
    if (p.x - safe.x < WALL_MARGIN) p.vx += (1 - (p.x - safe.x) / WALL_MARGIN) * push;
    else if (right - p.x < WALL_MARGIN) p.vx -= (1 - (right - p.x) / WALL_MARGIN) * push;
    if (p.y - safe.y < WALL_MARGIN) p.vy += (1 - (p.y - safe.y) / WALL_MARGIN) * push;
    else if (bottom - p.y < WALL_MARGIN) p.vy -= (1 - (bottom - p.y) / WALL_MARGIN) * push;

    // hard bounce; also reflect the wander heading, otherwise it keeps pushing into the wall
    if (p.x < safe.x) { p.x = safe.x; p.vx = Math.abs(p.vx); if (Math.cos(p.ang) < 0) p.ang = Math.PI - p.ang; }
    else if (p.x > right) { p.x = right; p.vx = -Math.abs(p.vx); if (Math.cos(p.ang) > 0) p.ang = Math.PI - p.ang; }
    if (p.y < safe.y) { p.y = safe.y; p.vy = Math.abs(p.vy); if (Math.sin(p.ang) < 0) p.ang = -p.ang; }
    else if (p.y > bottom) { p.y = bottom; p.vy = -Math.abs(p.vy); if (Math.sin(p.ang) > 0) p.ang = -p.ang; }
  }

  function updateConsume(p, dt) {
    const n = p.node;
    const k = Math.min(1, dt * 8);
    p.x += (n.x - p.x) * k;
    p.y += (nodeY(n) - p.y) * k;
    p.ct += dt * 2.5;
    if (p.ct >= 1) {
      n.pulse = 1;
      p.state = EDGE;
      p.edge = n.out[Math.floor(Math.random() * n.out.length)];
      p.t = 0;
      p.speed = 0.2 + Math.random() * 0.08;
    }
  }

  function updateEdge(p, dt, boost) {
    p.t += p.speed * dt * boost;
    if (p.t < 1) {
      pointOn(p.edge, p.t);
      p.x = pt.x;
      p.y = pt.y;
      return;
    }
    const node = p.edge.to;
    node.pulse = 1;
    if (p.edge.type === 's2e') {
      // transform done: continue toward a dashboard
      p.edge = node.out[Math.floor(Math.random() * node.out.length)];
      p.t = 0;
    } else {
      // dashboard releases the particle with an outward burst
      node.fill = Math.min(node.fill + 0.35, 1);
      resetFree(p, node.x, nodeY(node), 60 + Math.random() * 50);
    }
  }

  // Soft culling: while above target, retire one FREE particle every 150-300ms
  // (user-spawned first, then oldest). It fades out before being removed.
  function cull(dt) {
    cullTimer -= dt;
    if (cullTimer > 0 || particles.length - dyingCount <= target) return;
    cullTimer = 0.15 + Math.random() * 0.15;
    let pick = null;
    for (const p of particles) {
      if (p.state !== FREE || p.dying) continue;
      if (!pick || (p.user && !pick.user) || (p.user === pick.user && p.born < pick.born)) pick = p;
    }
    if (pick) {
      pick.dying = true;
      dyingCount++;
    }
  }

  function update(dt, boost) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (p.state === FREE) updateFree(p, dt);
      else if (p.state === CONSUME) updateConsume(p, dt);
      else updateEdge(p, dt, boost);
      if (p.dying) {
        p.alpha -= dt / FADE_TIME;
        if (p.alpha <= 0) {
          // swap-remove and return to the pool
          particles[i] = particles[particles.length - 1];
          particles.pop();
          pool.push(p);
          dyingCount--;
        }
      }
    }
    cull(dt);
    for (const n of nodes) {
      n.pulse = Math.max(0, n.pulse - dt * 1.6);
      n.fill = Math.max(0, n.fill - dt * 0.25);
      if (n.kind === 'etl') n.angle += dt * (0.4 + (boost - 1) * 0.6);
    }
    mouseSpeed *= 0.9;
  }


  // ---------- drawing: back canvas ----------
  const rgba = (rgb, a) => `rgba(${rgb},${a})`;

  function drawEdge(edge) {
    const x0 = edge.from.x, y0 = nodeY(edge.from);
    const x1 = edge.to.x, y1 = nodeY(edge.to);
    const cx = (x1 - x0) / 2;
    bctx.beginPath();
    bctx.moveTo(x0, y0);
    bctx.bezierCurveTo(x0 + cx, y0, x1 - cx, y1, x1, y1);
    bctx.strokeStyle = rgba(edge.type === 's2e' ? COLORS.source : COLORS.etl, 0.22);
    bctx.lineWidth = 1;
    bctx.stroke();
  }

  function drawSource(n, y) {
    const w = 15, h = 28, ry = 5;
    bctx.strokeStyle = rgba(COLORS.source, 0.9);
    bctx.fillStyle = rgba(COLORS.source, 0.12 + n.pulse * 0.25);
    bctx.lineWidth = 1.5;
    bctx.beginPath();
    bctx.moveTo(n.x - w, y - h / 2);
    bctx.lineTo(n.x - w, y + h / 2);
    bctx.ellipse(n.x, y + h / 2, w, ry, 0, Math.PI, 0, true);
    bctx.lineTo(n.x + w, y - h / 2);
    bctx.fill();
    bctx.stroke();
    bctx.beginPath();
    bctx.ellipse(n.x, y - h / 2, w, ry, 0, 0, Math.PI * 2);
    bctx.fill();
    bctx.stroke();
    bctx.beginPath();
    bctx.ellipse(n.x, y, w, ry, 0, 0, Math.PI);
    bctx.stroke();
  }

  function drawEtl(n, y) {
    const r = 15, teeth = 8;
    bctx.save();
    bctx.translate(n.x, y);
    bctx.rotate(n.angle);
    bctx.strokeStyle = rgba(COLORS.etl, 0.7 + n.pulse * 0.3);
    bctx.fillStyle = rgba(COLORS.etl, 0.1 + n.pulse * 0.35);
    bctx.lineWidth = 1.5;
    bctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      const s = Math.PI / teeth / 2;
      bctx.lineTo(Math.cos(a - s) * r, Math.sin(a - s) * r);
      bctx.lineTo(Math.cos(a - s) * (r + 5), Math.sin(a - s) * (r + 5));
      bctx.lineTo(Math.cos(a + s) * (r + 5), Math.sin(a + s) * (r + 5));
      bctx.lineTo(Math.cos(a + s) * r, Math.sin(a + s) * r);
    }
    bctx.closePath();
    bctx.fill();
    bctx.stroke();
    bctx.beginPath();
    bctx.arc(0, 0, 5, 0, Math.PI * 2);
    bctx.stroke();
    bctx.restore();
  }

  function drawDash(n, y) {
    const w = 46, h = 34;
    const x = n.x - w / 2, top = y - h / 2;
    bctx.strokeStyle = rgba(COLORS.dash, 0.75);
    bctx.fillStyle = rgba(COLORS.dash, 0.08 + n.pulse * 0.2);
    bctx.lineWidth = 1.5;
    bctx.beginPath();
    bctx.roundRect(x, top, w, h, 5);
    bctx.fill();
    bctx.stroke();
    const base = [0.35, 0.6, 0.45, 0.75];
    bctx.fillStyle = rgba(COLORS.dash, 0.85);
    base.forEach((b, i) => {
      const bh = (h - 10) * Math.min(1, b * (0.7 + n.fill * 0.5) + n.pulse * 0.15);
      bctx.fillRect(x + 6 + i * 10, top + h - 5 - bh, 6, bh);
    });
  }

  function drawBack() {
    if (!bctx) return;
    bctx.clearRect(0, 0, width, height);
    clipToSafe(bctx);
    edges.forEach(drawEdge);
    for (const n of nodes) {
      const y = nodeY(n);
      if (n.kind === 'source') drawSource(n, y);
      else if (n.kind === 'etl') drawEtl(n, y);
      else drawDash(n, y);
    }
    bctx.restore();
  }

  // ---------- drawing: front canvas ----------
  function drawFront() {
    fctx.clearRect(0, 0, width, height);
    clipToSafe(fctx);

    // free particles, batched into one path
    fctx.fillStyle = rgba(COLORS.free, 0.4);
    fctx.beginPath();
    for (const p of particles) {
      if (p.state !== FREE || p.dying) continue;
      fctx.moveTo(p.x + p.size, p.y);
      fctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    }
    fctx.fill();
    for (const p of particles) {
      if (!p.dying || p.state !== FREE) continue;
      fctx.fillStyle = rgba(COLORS.free, 0.4 * p.alpha);
      fctx.beginPath();
      fctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fctx.fill();
    }

    for (const p of particles) {
      if (p.state === CONSUME) {
        const k = 1 - p.ct;
        fctx.fillStyle = rgba(COLORS.source, 0.8 * k);
        fctx.beginPath();
        fctx.arc(p.x, p.y, p.size * k + 0.2, 0, Math.PI * 2);
        fctx.fill();
      } else if (p.state === EDGE) {
        if (p.edge.type === 's2e') {
          // indigo dot with a short fading trail
          fctx.fillStyle = rgba(COLORS.source, 0.95);
          fctx.beginPath();
          fctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
          fctx.fill();
          for (let i = 1; i <= 2; i++) {
            pointOn(p.edge, Math.max(0, p.t - i * 0.02));
            fctx.fillStyle = rgba(COLORS.source, 0.5 / i);
            fctx.beginPath();
            fctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
            fctx.fill();
          }
        } else {
          // merged square: grows out of the gear, cyan -> emerald
          const s = 3.5 * Math.min(1, p.t / 0.12 + 0.2);
          fctx.fillStyle = rgba(p.t < 0.5 ? COLORS.etl : COLORS.dash, 0.95);
          fctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
        }
      }
    }
    fctx.restore();
  }

  // ---------- loop ----------
  function frame(time) {
    const dt = Math.min((time - lastTime) / 1000 || 0, 0.05);
    lastTime = time;
    clock += dt;
    scrollVel *= 0.92; // decay when scrolling stops
    const boost = 1 + Math.min(scrollVel / 1200, 2.5);
    update(dt, boost);
    drawBack();
    drawFront();
    frameId = requestAnimationFrame(frame);
  }

  function start() {
    if (frameId || reduceMotion) return;
    lastTime = performance.now();
    frameId = requestAnimationFrame(frame);
  }

  function stop() {
    cancelAnimationFrame(frameId);
    frameId = 0;
  }

  function drawStatic() {
    drawBack();
    drawFront();
  }

  // ---------- input ----------
  function onPointer(x, y) {
    const now = performance.now();
    const dt = (now - lastMoveTime) / 1000;
    if (lastMoveTime && dt > 0 && mouseX > -9000) {
      mouseSpeed = Math.max(mouseSpeed, Math.hypot(x - mouseX, y - mouseY) / dt);
    }
    mouseX = x;
    mouseY = y;
    mouseInSafe = x >= safe.x && y >= safe.y;
    lastMoveTime = now;
  }

  const inSafe = (x, y) => x >= safe.x && y >= safe.y;

  window.addEventListener('pointermove', (e) => {
    onPointer(e.clientX, e.clientY);
    // mouse only, at most once per cooldown, inside the safe rect
    if (reduceMotion || e.pointerType !== 'mouse' || !inSafe(e.clientX, e.clientY)) return;
    const now = performance.now();
    if (now - lastMoveBurst < MOVE_BURST_COOLDOWN) return;
    lastMoveBurst = now;
    spawnBurst(e.clientX, e.clientY, 3 + Math.floor(Math.random() * 2));
  }, { passive: true });

  // clicks/taps spawn a burst, except on interactive elements or over the nav
  window.addEventListener('pointerdown', (e) => {
    if (reduceMotion || !inSafe(e.clientX, e.clientY)) return;
    if (e.target.closest && e.target.closest('a, button, input, textarea, select, label, nav')) return;
    spawnBurst(e.clientX, e.clientY, 4 + Math.floor(Math.random() * 3));
  }, { passive: true });
  window.addEventListener('touchmove', (e) => onPointer(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  document.addEventListener('pointerleave', () => (mouseX = mouseY = -9999));
  window.addEventListener('touchend', () => (mouseX = mouseY = -9999), { passive: true });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    scrollVel = Math.max(scrollVel, Math.min(Math.abs(scrollY - lastScrollY) * 60, 4000));
    lastScrollY = scrollY;
    if (reduceMotion) drawStatic();
  }, { passive: true });

  window.addEventListener('resize', () => {
    build();
    if (reduceMotion) drawStatic();
  });

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  build();
  if (reduceMotion) {
    // static frame: nodes, edges and a few still dots
    particles = particles.slice(0, 12);
    drawStatic();
  } else {
    start();
  }
}
