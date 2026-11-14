// Shared procedural drawing helpers for the card art.
//
// The cards are black stock stamped with metallic foil. Art is drawn as
// white-on-transparent masks (one for gold foil, one for crimson foil) plus
// a painted matte layer; composeCard() turns those into the colour, the
// roughness/metalness and the emissive maps for the 3D material.

export const TEX_W = 1024;
export const TEX_H = 1434;
const TAU = Math.PI * 2;

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

// ------------------------------------------------------------ layers

/** Foil masks (gold, red), a painted matte layer and a glow layer. */
export function createLayers(w = TEX_W, h = TEX_H) {
  const mask = () => {
    const c = makeCanvas(w, h).getContext('2d');
    c.fillStyle = '#fff';
    c.strokeStyle = '#fff';
    c.lineCap = 'round';
    c.lineJoin = 'round';
    return c;
  };
  const gold = mask();
  const red = mask();
  return {
    w,
    h,
    gold,
    red,
    matte: makeCanvas(w, h).getContext('2d'),
    glow: makeCanvas(w, h).getContext('2d'),
    /** Knock a shape out of both foils, so whatever is stamped next sits on bare stock. */
    erase(draw) {
      for (const c of [gold, red]) {
        c.save();
        c.globalCompositeOperation = 'destination-out';
        draw(c);
        c.restore();
      }
    },
  };
}

function tinted(source, style) {
  const cv = makeCanvas(source.width, source.height);
  const c = cv.getContext('2d');
  c.drawImage(source, 0, 0);
  c.globalCompositeOperation = 'source-in';
  c.fillStyle = style;
  c.fillRect(0, 0, cv.width, cv.height);
  return cv;
}

function foilGradient(c, w, h, stops) {
  const g = c.createLinearGradient(0, 0, w, h);
  stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
  return g;
}

const stockCache = new Map();

/** Matte black card stock with a little grain and wear. */
function stock(w, h) {
  const key = `${w}x${h}`;
  if (stockCache.has(key)) return stockCache.get(key);
  const cv = makeCanvas(w, h);
  const c = cv.getContext('2d');
  const rng = mulberry32(7);
  c.fillStyle = '#0c0b0a';
  c.fillRect(0, 0, w, h);
  // scuffs
  for (let i = 0; i < 22; i++) {
    const x = rng() * w;
    const y = rng() * h;
    const r = (0.06 + rng() * 0.22) * w;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255, 236, 205, ${0.012 + rng() * 0.022})`);
    g.addColorStop(1, 'rgba(255, 236, 205, 0)');
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // grain
  const img = c.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = rng() * rng() * 22;
    d[i] += n;
    d[i + 1] += n * 0.95;
    d[i + 2] += n * 0.88;
  }
  c.putImageData(img, 0, 0);
  stockCache.set(key, cv);
  return cv;
}

/**
 * Flatten the layers into the three maps a foil material needs.
 * orm: G = roughness, B = metalness (three.js channel convention).
 */
export function composeCard(L, { foilGlow = 1 } = {}) {
  const { w, h } = L;
  const foilCv = makeCanvas(w, h);
  const f = foilCv.getContext('2d');
  f.drawImage(
    tinted(L.gold.canvas, foilGradient(f, w, h, ['#b28a3e', '#e6c984', '#a37c36', '#edd596', '#ad8640'])),
    0,
    0,
  );
  f.drawImage(
    tinted(L.red.canvas, foilGradient(f, w, h, ['#9c1826', '#d8404e', '#8e1420', '#e04c58', '#981824'])),
    0,
    0,
  );

  const color = makeCanvas(w, h);
  let c = color.getContext('2d');
  c.drawImage(stock(w, h), 0, 0);
  c.drawImage(foilCv, 0, 0);
  c.drawImage(L.matte.canvas, 0, 0);

  const orm = makeCanvas(w, h);
  c = orm.getContext('2d');
  c.fillStyle = 'rgb(0, 212, 0)'; // stock: rough, not metal
  c.fillRect(0, 0, w, h);
  c.drawImage(tinted(foilCv, 'rgb(0, 96, 238)'), 0, 0); // foil: smooth metal
  c.drawImage(tinted(L.matte.canvas, 'rgb(0, 205, 0)'), 0, 0);

  const emissive = makeCanvas(w, h);
  c = emissive.getContext('2d');
  c.fillStyle = '#000';
  c.fillRect(0, 0, w, h);
  c.globalAlpha = foilGlow;
  c.drawImage(foilCv, 0, 0);
  c.globalAlpha = 1;
  c.drawImage(tinted(L.matte.canvas, '#000'), 0, 0);
  c.drawImage(L.glow.canvas, 0, 0);

  return { color, orm, emissive };
}

/** Flecks and hairline scratches where the foil has worn away. */
export function distress(c, w, h, rng, amount = 1) {
  c.save();
  c.globalCompositeOperation = 'destination-out';
  c.beginPath();
  for (let i = 0; i < 2600 * amount; i++) {
    const x = rng() * w;
    const y = rng() * h;
    const r = 0.4 + rng() * rng() * 2.2;
    c.moveTo(x + r, y);
    c.arc(x, y, r, 0, TAU);
  }
  c.fill();
  c.lineWidth = 0.8;
  c.beginPath();
  for (let i = 0; i < 26 * amount; i++) {
    const x = rng() * w;
    const y = rng() * h;
    const a = rng() * TAU;
    const l = 20 + rng() * 90;
    c.moveTo(x, y);
    c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
  }
  c.stroke();
  c.restore();
}

// ------------------------------------------------------------ curls

/** Points along a curl: nearly straight at the root, winding tighter toward the tip. */
export function curlPath({ x, y, angle, length, turns, steps = 64, power = 2, wobble = 0, phase = 0 }) {
  const seg = length / steps;
  const total = turns * TAU * (power + 1);
  const pts = [];
  let a = angle;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push({ x, y, a, t });
    a += (total * Math.pow(t, power)) / steps + wobble * Math.sin(t * 10 + phase) * 0.03;
    x += Math.cos(a) * seg;
    y += Math.sin(a) * seg;
  }
  return pts;
}

/**
 * Fill a ribbon along `pts` whose half-width is half(t). With `gap`, first
 * knock out a margin around it (from `gapFrom` along its length onward), so
 * it reads as passing over whatever was drawn before.
 */
export function ribbon(c, pts, half, { gap = 0, gapFrom = 0 } = {}) {
  const L = pts.map((p) => [p.x - Math.sin(p.a) * half(p.t), p.y + Math.cos(p.a) * half(p.t)]);
  const R = pts.map((p) => [p.x + Math.sin(p.a) * half(p.t), p.y - Math.cos(p.a) * half(p.t)]);
  const trace = (from) => {
    c.beginPath();
    c.moveTo(L[from][0], L[from][1]);
    for (let i = from + 1; i < L.length; i++) c.lineTo(L[i][0], L[i][1]);
    for (let i = R.length - 1; i >= from; i--) c.lineTo(R[i][0], R[i][1]);
    c.closePath();
  };
  if (gap > 0) {
    c.save();
    c.globalCompositeOperation = 'destination-out';
    c.lineWidth = gap * 2;
    c.lineJoin = 'round';
    trace(Math.floor(gapFrom * (pts.length - 1)));
    c.stroke();
    c.restore();
  }
  trace(0);
  c.fill();
}

/**
 * A tapered, curling tentacle with suckers on the inside of the curl.
 * `fill` sets the colour (omit to use the context's current fill).
 */
export function tentacle(
  c,
  {
    x,
    y,
    angle,
    length,
    width,
    curl = 2.5,
    steps = 70,
    fill = null,
    gap = 0,
    suckers = true,
    wobble = 0,
    phase = 0,
  },
) {
  const pts = curlPath({ x, y, angle, length, turns: (curl * 4) / 3 / TAU, steps, wobble, phase });
  const half = (t) => (width * Math.pow(1 - t, 0.85)) / 2 + 0.6;
  if (fill) c.fillStyle = fill;
  ribbon(c, pts, half, { gap });

  if (suckers) {
    const side = Math.sign(curl) || 1;
    const every = Math.max(3, Math.round(steps / 16));
    c.save();
    c.globalCompositeOperation = 'destination-out';
    c.beginPath();
    for (let i = every; i < pts.length * 0.8; i += every) {
      const p = pts[i];
      const h = half(p.t);
      const off = h * 0.42 * side;
      const sx = p.x - Math.sin(p.a) * off;
      const sy = p.y + Math.cos(p.a) * off;
      const r = h * 0.3;
      c.moveTo(sx + r, sy);
      c.arc(sx, sy, r, 0, TAU);
    }
    c.fill();
    c.restore();
  }
}

/**
 * A scrolling vine: a curl that throws off smaller counter-curls, each
 * ending in a bud. Later strands knock a margin out of earlier ones, which
 * gives the over-and-under look of knotwork.
 */
export function vine(c, o, rng) {
  const { x, y, angle, length, turns, width, depth = 3, gap = 3, gapFrom = 0.1, branches = 2, power = 2.1 } = o;
  const pts = curlPath({ x, y, angle, length, turns, power, steps: Math.max(28, Math.round(length / 4)) });
  const half = (t) => (width * Math.pow(1 - t, 0.5)) / 2 + 0.8;
  ribbon(c, pts, half, { gap, gapFrom });

  const tip = pts[pts.length - 1];
  const bud = Math.max(2.6, width * 0.48);
  c.save();
  c.globalCompositeOperation = 'destination-out';
  c.beginPath();
  c.arc(tip.x, tip.y, bud + gap, 0, TAU);
  c.fill();
  c.restore();
  c.beginPath();
  c.arc(tip.x, tip.y, bud, 0, TAU);
  c.fill();

  if (depth <= 0) return;
  const side = Math.sign(turns) || 1;
  for (let k = 0; k < branches; k++) {
    const t = 0.14 + ((k + rng() * 0.6) * 0.56) / branches;
    const p = pts[Math.round(t * (pts.length - 1))];
    vine(
      c,
      {
        x: p.x,
        y: p.y,
        angle: p.a - side * (0.45 + rng() * 0.4),
        length: length * (0.64 - k * 0.06) * (0.88 + rng() * 0.24),
        turns: -side * (1.05 + rng() * 0.5),
        width: width * 0.8,
        depth: depth - 1,
        gap,
        gapFrom: 0.22,
        branches,
        power,
      },
      rng,
    );
  }
}

// ------------------------------------------------------------ marks

/** A single unreadable glyph built from strokes on a 3×3 lattice. */
export function rune(c, x, y, size, rng) {
  const p = (i) => [x + ((i % 3) - 1) * size * 0.5, y + (Math.floor(i / 3) - 1) * size * 0.5];
  const strokes = 2 + Math.floor(rng() * 3);
  c.beginPath();
  let cur = Math.floor(rng() * 9);
  c.moveTo(...p(cur));
  for (let s = 0; s < strokes; s++) {
    let next = Math.floor(rng() * 9);
    if (next === cur) next = (next + 4) % 9;
    if (rng() < 0.25) c.moveTo(...p(next));
    else c.lineTo(...p(next));
    cur = next;
  }
  c.stroke();
  if (rng() < 0.35) {
    const [cx, cy] = p(Math.floor(rng() * 9));
    c.beginPath();
    c.arc(cx, cy, size * 0.1, 0, TAU);
    c.stroke();
  }
}

export function runeRing(c, cx, cy, r, count, size, rng) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU;
    c.save();
    c.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    c.rotate(a + Math.PI / 2);
    rune(c, 0, 0, size, rng);
    c.restore();
  }
}

/** Star polygon {n/k}. */
export function polygram(c, cx, cy, r, n, k, rot = -Math.PI / 2) {
  c.beginPath();
  for (let i = 0; i <= n; i++) {
    const a = rot + ((i * k) % n) * (TAU / n);
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) c.moveTo(px, py);
    else c.lineTo(px, py);
  }
  c.closePath();
}

/** A branching "elder" mark: a stem with paired, upturned branches. */
export function elderMark(c, x, y, h) {
  c.beginPath();
  c.moveTo(x, y + h / 2);
  c.lineTo(x, y - h / 2);
  for (let i = 0; i < 3; i++) {
    const by = y + h * 0.25 - i * h * 0.25;
    const len = h * (0.3 - i * 0.06);
    c.moveTo(x, by);
    c.lineTo(x - len, by - len * 0.9);
    c.moveTo(x, by);
    c.lineTo(x + len, by - len * 0.9);
  }
  c.stroke();
}

/** Thin thorns pointing outward around a circle. */
export function thornRing(c, cx, cy, r, count, len, base) {
  c.beginPath();
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    c.moveTo(cx + ca * r - sa * base, cy + sa * r + ca * base);
    c.lineTo(cx + ca * (r + len), cy + sa * (r + len));
    c.lineTo(cx + ca * r + sa * base, cy + sa * r - ca * base);
  }
  c.fill();
}

export function ring(c, cx, cy, r, lineWidth) {
  c.lineWidth = lineWidth;
  c.beginPath();
  c.arc(cx, cy, r, 0, TAU);
  c.stroke();
}

/**
 * A moon with an eaten edge: a disc with dark thorns biting inward
 * (heavier toward the top) and a scatter of craters near the rim.
 */
export function raggedMoon(c, cx, cy, R, rng, { bites = 46, depth = 0.2, craters = 9, keepClear = 0.7 } = {}) {
  const N = 480;
  const prof = new Float32Array(N);
  for (let s = 0; s < bites; s++) {
    const centre = Math.floor(rng() * N);
    const theta = (centre / N) * TAU;
    const top = 1 + 0.6 * Math.max(0, -Math.sin(theta));
    const w = 2 + Math.floor(rng() * 7);
    const d = R * (0.03 + rng() * rng() * depth) * top;
    for (let j = -w; j <= w; j++) {
      const k = (centre + j + N) % N;
      prof[k] = Math.max(prof[k], d * Math.pow(1 - Math.abs(j) / (w + 1), 0.75));
    }
  }
  c.beginPath();
  for (let i = 0; i < N; i++) {
    const a = (i / N) * TAU;
    const r = Math.max(R * keepClear, R - prof[i] - rng() * R * 0.012);
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) c.moveTo(px, py);
    else c.lineTo(px, py);
  }
  c.closePath();
  c.fill();

  c.save();
  c.globalCompositeOperation = 'destination-out';
  c.beginPath();
  for (let i = 0; i < craters; i++) {
    const a = rng() * TAU;
    const r = R * (0.74 + rng() * 0.16);
    const cr = R * (0.018 + rng() * 0.04);
    c.moveTo(cx + Math.cos(a) * r + cr, cy + Math.sin(a) * r);
    c.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, cr, 0, TAU);
  }
  c.fill();
  c.restore();
}

/** Draw a square glyph canvas centred at (x, y), optionally rotated. */
export function stamp(c, glyph, x, y, size, rotation = 0) {
  c.save();
  c.translate(x, y);
  if (rotation) c.rotate(rotation);
  c.drawImage(glyph, -size / 2, -size / 2, size, size);
  c.restore();
}
