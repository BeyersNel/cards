// Shared tools for the illustrated card fronts. Each front is a "plate":
// an inked, hand-hatched picture in a limited palette, framed on bone
// stock with a title band beneath, in the manner of an engraved tarot.

import {
  TEX_W as W,
  TEX_H as H,
  makeCanvas,
  mulberry32,
  curlPath,
  embossNormal,
  tintCanvas,
  thicknessMask,
} from '../ornament.js';
import { suitGlyph } from '../glyphs.js';

export const INK = '#0d1015';
export const BONE = '#d9ceb2';
export const PLATE = { x: 62, y: 62, w: 900, h: 1130 };
export const BAND = { x: 62, y: 1212, w: 900, h: 160 };

const TAU = Math.PI * 2;
const TITLE_FONT = '"Pirata One", "IM Fell English SC", Georgia, serif';
const TEXT_FONT = '"IM Fell English SC", "Cormorant Garamond", Georgia, serif';

/** Fill and/or ink a path. `path(c)` must begin its own path. */
export function shape(c, path, { fill = null, stroke = INK, lw = 3 } = {}) {
  path(c);
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke && lw) {
    c.strokeStyle = stroke;
    c.lineWidth = lw;
    c.lineJoin = 'round';
    c.lineCap = 'round';
    c.stroke();
  }
}

/** Smooth closed-or-open curve through points (Catmull-Rom). Appends to the current path. */
export function smooth(c, pts, { move = true } = {}) {
  if (move) c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    c.bezierCurveTo(
      p1[0] + (p2[0] - p0[0]) / 6,
      p1[1] + (p2[1] - p0[1]) / 6,
      p2[0] - (p3[0] - p1[0]) / 6,
      p2[1] - (p3[1] - p1[1]) / 6,
      p2[0],
      p2[1],
    );
  }
}

/**
 * Engraver's hatching: slightly wavering parallel lines, clipped to every
 * path in `clips` (their intersection). `box` is [x0, y0, x1, y1].
 */
export function hatch(c, clips, box, { angle = -0.7, spacing = 7, width = 1.4, color = INK, alpha = 0.55 } = {}) {
  c.save();
  for (const clip of [].concat(clips)) {
    clip(c);
    c.clip();
  }
  const [x0, y0, x1, y1] = box;
  const r = Math.hypot(x1 - x0, y1 - y0) / 2 + 4;
  c.translate((x0 + x1) / 2, (y0 + y1) / 2);
  c.rotate(angle);
  c.strokeStyle = color;
  c.globalAlpha = alpha;
  c.lineWidth = width;
  c.lineCap = 'round';
  c.beginPath();
  for (let y = -r; y <= r; y += spacing) {
    c.moveTo(-r, y);
    for (let x = -r + 18; x <= r; x += 18) c.lineTo(x, y + Math.sin(x * 0.045 + y * 1.7) * 0.9);
  }
  c.stroke();
  c.restore();
}

/**
 * An inked tentacle: dark back with ring shading, pale belly with suckers
 * on the inside of the curl.
 */
export function inkTentacle(c, o) {
  const { width, turns, back = '#28423f', belly = '#8fa593', sucker = '#c6cdb0' } = o;
  const pts = curlPath({ steps: 96, power: 2.4, ...o });
  const half = (t) => (width * Math.pow(1 - t, 0.8)) / 2 + 2;
  const at = (p, k) => [p.x - Math.sin(p.a) * half(p.t) * k, p.y + Math.cos(p.a) * half(p.t) * k];
  const inner = turns > 0 ? 1 : -1; // which side the curl closes toward

  const outline = (c) => {
    c.beginPath();
    pts.forEach((p, i) => (i ? c.lineTo(...at(p, 1)) : c.moveTo(...at(p, 1))));
    for (let i = pts.length - 1; i >= 0; i--) c.lineTo(...at(pts[i], -1));
    c.closePath();
  };
  shape(c, outline, { fill: back, lw: 0 });

  // belly
  c.beginPath();
  pts.forEach((p, i) => (i ? c.lineTo(...at(p, inner)) : c.moveTo(...at(p, inner))));
  for (let i = pts.length - 1; i >= 0; i--) c.lineTo(...at(pts[i], inner * 0.22));
  c.closePath();
  c.fillStyle = belly;
  c.fill();

  // ring shading across the back
  c.strokeStyle = INK;
  c.globalAlpha = 0.5;
  c.lineWidth = 1.5;
  c.beginPath();
  for (let i = 1; i < pts.length - 2; i += 2) {
    const p = pts[i];
    const a = at(p, -inner);
    const b = at(p, -inner * 0.05);
    const bow = half(p.t) * 0.22;
    c.moveTo(a[0], a[1]);
    c.quadraticCurveTo(
      (a[0] + b[0]) / 2 + Math.cos(p.a) * bow,
      (a[1] + b[1]) / 2 + Math.sin(p.a) * bow,
      b[0],
      b[1],
    );
  }
  c.stroke();
  c.globalAlpha = 1;

  // suckers
  const every = 4;
  for (let i = every; i < pts.length * 0.86; i += every) {
    const p = pts[i];
    const [sx, sy] = at(p, inner * 0.6);
    const r = half(p.t) * 0.24;
    if (r < 1.6) continue;
    c.beginPath();
    c.arc(sx, sy, r, 0, TAU);
    c.fillStyle = sucker;
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.3;
    c.stroke();
    c.beginPath();
    c.arc(sx, sy, r * 0.35, 0, TAU);
    c.fillStyle = INK;
    c.fill();
  }

  shape(c, outline, { lw: o.lw ?? 3.5 });
}

export function tintGlyph(glyph, color) {
  const cv = makeCanvas(glyph.width, glyph.height);
  const c = cv.getContext('2d');
  c.drawImage(glyph, 0, 0);
  c.globalCompositeOperation = 'source-in';
  c.fillStyle = color;
  c.fillRect(0, 0, cv.width, cv.height);
  return cv;
}

function paper(c) {
  c.fillStyle = BONE;
  c.fillRect(0, 0, W, H);
  const rng = mulberry32(3);
  for (let i = 0; i < 16; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const r = 80 + rng() * 240;
    const g = c.createRadialGradient(x, y, r * 0.2, x, y, r);
    g.addColorStop(0, `rgba(120, 86, 44, ${0.03 + rng() * 0.05})`);
    g.addColorStop(1, 'rgba(120, 86, 44, 0)');
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
  }
}

// Silver foil: everything stamped on the `s` context (white on transparent)
// becomes raised, reflective silver on the finished card.

function indexTab(c, s, card, flip) {
  const ink = card.suit.red ? '#7a1420' : INK;
  for (const g of [c, s]) {
    g.save();
    if (flip) {
      g.translate(W, PLATE.y * 2 + PLATE.h);
      g.rotate(Math.PI);
    }
  }
  const x = PLATE.x;
  const y = PLATE.y;
  const tab = (g) => {
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + 104, y);
    g.lineTo(x + 104, y + 150);
    g.lineTo(x + 52, y + 178);
    g.lineTo(x, y + 150);
    g.closePath();
  };
  shape(c, tab, { fill: BONE, lw: 0 });
  s.lineJoin = 'miter';
  s.lineWidth = 6;
  tab(s);
  s.stroke();
  c.fillStyle = ink;
  c.textAlign = 'center';
  c.textBaseline = 'alphabetic';
  const label = card.rank.key;
  c.font = `400 ${label.length > 1 ? 66 : 84}px ${TEXT_FONT}`;
  c.fillText(label, x + 52, y + 78);
  c.drawImage(tintGlyph(suitGlyph(card.suit.key), ink), x + 52 - 26, y + 90, 52, 52);
  for (const g of [c, s]) g.restore();
}

/** A small foliate ornament: a lozenge flanked by two curling leaves. */
function fleuron(s, x, y, size, rot = 0) {
  s.save();
  s.translate(x, y);
  s.rotate(rot);
  s.scale(size / 40, size / 40);
  s.beginPath();
  s.moveTo(0, -12);
  s.lineTo(8, 0);
  s.lineTo(0, 12);
  s.lineTo(-8, 0);
  s.closePath();
  s.fill();
  s.lineWidth = 3.2;
  s.lineCap = 'round';
  for (const side of [-1, 1]) {
    s.beginPath();
    s.moveTo(side * 10, 0);
    s.bezierCurveTo(side * 22, -2, side * 30, -12, side * 26, -18);
    s.bezierCurveTo(side * 22, -22, side * 16, -16, side * 20, -12);
    s.moveTo(side * 10, 0);
    s.bezierCurveTo(side * 22, 2, side * 30, 12, side * 26, 18);
    s.bezierCurveTo(side * 22, 22, side * 16, 16, side * 20, 12);
    s.stroke();
  }
  s.restore();
}

function frame(c, s, card) {
  s.strokeStyle = '#fff';
  s.fillStyle = '#fff';
  s.lineJoin = 'miter';

  // card edge and a fine inner rule
  s.lineWidth = 5;
  s.beginPath();
  s.roundRect(28, 28, W - 56, H - 56, 42);
  s.stroke();
  s.lineWidth = 1.6;
  s.beginPath();
  s.roundRect(42, 42, W - 84, H - 84, 30);
  s.stroke();

  // plate border
  s.lineWidth = 7;
  s.strokeRect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
  indexTab(c, s, card, false);
  indexTab(c, s, card, true);

  // title band
  s.lineWidth = 7;
  s.strokeRect(BAND.x, BAND.y, BAND.w, BAND.h);
  s.lineWidth = 2;
  s.strokeRect(BAND.x + 11, BAND.y + 11, BAND.w - 22, BAND.h - 22);
  const midY = BAND.y + BAND.h / 2;
  fleuron(s, BAND.x + 70, midY, 52);
  fleuron(s, BAND.x + BAND.w - 70, midY, 52);
  // studs where the band meets the plate, and at the card's four corners
  for (const [x, y, r] of [
    [PLATE.x, BAND.y - 10, 7],
    [PLATE.x + PLATE.w, BAND.y - 10, 7],
    [50, 50, 6],
    [W - 50, 50, 6],
    [50, H - 50, 6],
    [W - 50, H - 50, 6],
  ]) {
    s.beginPath();
    s.moveTo(x, y - r * 1.5);
    s.lineTo(x + r, y);
    s.lineTo(x, y + r * 1.5);
    s.lineTo(x - r, y);
    s.closePath();
    s.fill();
  }

  c.fillStyle = INK;
  c.textAlign = 'center';
  c.textBaseline = 'alphabetic';
  let size = 104;
  c.font = `400 ${size}px ${TITLE_FONT}`;
  while (c.measureText(card.title).width > BAND.w - 230 && size > 40) {
    size -= 4;
    c.font = `400 ${size}px ${TITLE_FONT}`;
  }
  c.fillText(card.title, W / 2, BAND.y + 96);

  c.fillStyle = card.suit.red ? '#7a1420' : '#3b3020';
  if ('letterSpacing' in c) c.letterSpacing = '5px';
  c.font = `400 30px ${TEXT_FONT}`;
  c.fillText(card.reading, W / 2 + 2, BAND.y + 136);
  if ('letterSpacing' in c) c.letterSpacing = '0px';
}

/** Paper tooth and a slight unevenness of ink over the whole card. */
function grain(c) {
  const img = c.getImageData(0, 0, W, H);
  const d = img.data;
  const rng = mulberry32(21);
  for (let i = 0; i < d.length; i += 4) {
    const n = (rng() - 0.5) * 22;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n * 0.9));
  }
  c.putImageData(img, 0, 0);
}

/**
 * Paint one illustrated front. `scene(c, PLATE)` draws the picture, already
 * clipped to the plate. Returns the same maps as the foil cards, as matte.
 */
export function paintPlate(card, scene) {
  const color = makeCanvas(W, H);
  const c = color.getContext('2d');
  const silver = makeCanvas(W, H);
  const s = silver.getContext('2d');
  paper(c);
  c.save();
  c.beginPath();
  c.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
  c.clip();
  scene(c, PLATE);
  c.restore();
  frame(c, s, card);
  grain(c);

  // stamp the silver: a soft shadow below, then the foil itself
  c.save();
  c.filter = 'blur(1.5px)';
  c.globalAlpha = 0.55;
  c.drawImage(tintCanvas(silver, '#2a2318'), 2, 3);
  c.restore();
  const foil = c.createLinearGradient(0, 0, W, H);
  ['#8d939a', '#e9edf0', '#a7adb3', '#f4f6f7', '#8f959b', '#d7dbdf'].forEach((col, i, a) =>
    foil.addColorStop(i / (a.length - 1), col),
  );
  c.drawImage(tintCanvas(silver, foil), 0, 0);

  // Thin silver (the rules and borders) is satin: rough and only half
  // metallic, so a point of light spreads into a soft sheen instead of
  // beading along the line. Broad silver (the fleurons, studs) is polished.
  const thick = thicknessMask(silver);
  const orm = makeCanvas(W, H);
  let o = orm.getContext('2d');
  o.fillStyle = 'rgb(0, 245, 0)'; // paper: very rough, not metal
  o.fillRect(0, 0, W, H);
  o.drawImage(tintCanvas(silver, 'rgb(0, 150, 150)'), 0, 0); // satin silver
  o.drawImage(tintCanvas(thick, 'rgb(0, 92, 240)'), 0, 0); // polished silver

  const emissive = makeCanvas(W, H);
  o = emissive.getContext('2d');
  o.drawImage(color, 0, 0);

  return { color, orm, emissive, normal: embossNormal(silver, { blur: 3.2, strength: 1.5 }) };
}

/**
 * Draw an image into the plate, scaled to cover it. `anchorY` picks which
 * part survives a vertical crop: 0 keeps the top, 0.5 the middle.
 */
export function coverImage(c, img, P = PLATE, anchorY = 0.25) {
  const s = Math.max(P.w / img.width, P.h / img.height);
  const w = img.width * s;
  const h = img.height * s;
  c.drawImage(img, P.x + (P.w - w) / 2, P.y + (P.h - h) * anchorY, w, h);
}
