// Shared procedural drawing helpers for the card art.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/**
 * A tapered, curling tentacle. Curls harder toward the tip.
 * Suckers sit on the inside of the curl.
 */
export function tentacle(
  ctx,
  {
    x,
    y,
    angle,
    length,
    width,
    curl = 2.5,
    steps = 70,
    fill = '#000',
    highlight = null,
    suckerFill = null,
    wobble = 0,
    phase = 0,
  },
) {
  const seg = length / steps;
  const pts = [];
  let px = x;
  let py = y;
  let a = angle;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push({ x: px, y: py, a, t });
    a += (curl * 4 * t * t) / steps + wobble * Math.sin(t * 10 + phase) * 0.03;
    px += Math.cos(a) * seg;
    py += Math.sin(a) * seg;
  }
  const half = (t) => (width * Math.pow(1 - t, 0.85)) / 2 + 0.6;
  const side = Math.sign(curl) || 1;
  const left = pts.map((p) => ({
    x: p.x - Math.sin(p.a) * half(p.t),
    y: p.y + Math.cos(p.a) * half(p.t),
  }));
  const right = pts.map((p) => ({
    x: p.x + Math.sin(p.a) * half(p.t),
    y: p.y - Math.cos(p.a) * half(p.t),
  }));

  ctx.beginPath();
  ctx.moveTo(left[0].x, left[0].y);
  for (const p of left) ctx.lineTo(p.x, p.y);
  for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();

  if (highlight) {
    const outer = side > 0 ? right : left;
    ctx.beginPath();
    ctx.moveTo(outer[0].x, outer[0].y);
    for (let i = 1; i < outer.length - 4; i++) ctx.lineTo(outer[i].x, outer[i].y);
    ctx.strokeStyle = highlight;
    ctx.lineWidth = Math.max(1, width * 0.06);
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  if (suckerFill) {
    const every = Math.max(3, Math.round(steps / 16));
    for (let i = every; i < pts.length * 0.78; i += every) {
      const p = pts[i];
      const h = half(p.t);
      const off = h * 0.45 * side;
      const sx = p.x - Math.sin(p.a) * off;
      const sy = p.y + Math.cos(p.a) * off;
      const r = h * 0.32;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = suckerFill;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx, sy, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
    }
  }
}

/** A single unreadable glyph built from strokes on a 3×3 lattice. */
export function rune(ctx, x, y, size, rng) {
  const p = (i) => [x + ((i % 3) - 1) * size * 0.5, y + (Math.floor(i / 3) - 1) * size * 0.5];
  const strokes = 2 + Math.floor(rng() * 3);
  ctx.beginPath();
  let cur = Math.floor(rng() * 9);
  ctx.moveTo(...p(cur));
  for (let s = 0; s < strokes; s++) {
    let next = Math.floor(rng() * 9);
    if (next === cur) next = (next + 4) % 9;
    if (rng() < 0.25) ctx.moveTo(...p(next));
    else ctx.lineTo(...p(next));
    cur = next;
  }
  ctx.stroke();
  if (rng() < 0.35) {
    const [cx, cy] = p(Math.floor(rng() * 9));
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.1, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function runeRing(ctx, cx, cy, r, count, size, rng) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.rotate(a + Math.PI / 2);
    rune(ctx, 0, 0, size, rng);
    ctx.restore();
  }
}

/** Star polygon {n/k}. */
export function polygram(ctx, cx, cy, r, n, k, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const a = rot + ((i * k) % n) * ((Math.PI * 2) / n);
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/** A branching "elder" mark: a stem with paired, upturned branches. */
export function elderMark(ctx, x, y, h) {
  ctx.beginPath();
  ctx.moveTo(x, y + h / 2);
  ctx.lineTo(x, y - h / 2);
  for (let i = 0; i < 3; i++) {
    const by = y + h * 0.25 - i * h * 0.25;
    const len = h * (0.3 - i * 0.06);
    ctx.moveTo(x, by);
    ctx.lineTo(x - len, by - len * 0.9);
    ctx.moveTo(x, by);
    ctx.lineTo(x + len, by - len * 0.9);
  }
  ctx.stroke();
}

/** Fine speckle grain over the whole canvas. */
export function speckle(ctx, w, h, rng, { amount = 0.06, dark = true } = {}) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rng() - 0.5) * 255 * amount;
    const v = dark ? n - Math.abs(n) * 0.3 : n;
    d[i] = Math.min(255, Math.max(0, d[i] + v));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + v));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + v));
  }
  ctx.putImageData(img, 0, 0);
}

export function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** Thin thorns pointing outward around a circle. */
export function thornRing(ctx, cx, cy, r, count, len, base) {
  ctx.beginPath();
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    ctx.moveTo(cx + ca * r - sa * base, cy + sa * r + ca * base);
    ctx.lineTo(cx + ca * (r + len), cy + sa * (r + len));
    ctx.lineTo(cx + ca * r + sa * base, cy + sa * r - ca * base);
  }
  ctx.fill();
}
