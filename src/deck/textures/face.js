// Card faces: black stock stamped in gold foil (crimson for hearts and
// diamonds). Knotwork vines fill a notched frame; at the centre a ragged
// gold moon carries the domain icon as a cut-out; the suit pips sit in the
// vines, one per rank; a cream plaque names the card.

import { suitGlyph, iconGlyph } from './glyphs.js';
import { paintSleep } from './plates/sleep.js';
import { paintPlate, coverImage } from './plates/engraving.js';
import {
  TEX_W as W,
  TEX_H as H,
  mulberry32,
  hashString,
  createLayers,
  composeCard,
  distress,
  vine,
  tentacle,
  runeRing,
  thornRing,
  ring,
  raggedMoon,
  polygram,
  stamp,
} from './ornament.js';

const TAU = Math.PI * 2;
const CX = W / 2;
const MY = 590; // medallion centre
const INSET = 44; // frame inset
const NW = 132; // corner pocket width
const NH = 236; // corner pocket height
const PLAQUE = { x: 222, y: 1082, w: 580, h: 150 };
const FONT = '"IM Fell English SC", "Cormorant Garamond", Georgia, serif';

// Illustrated fronts, keyed by card id. Cards without one fall back to the foil design.
const PLATES = { 'A♣': paintSleep };

// Painted artwork lives in public/cards/<suit>-<rank>.webp (see art/prompts.json).
// It takes precedence over the hand-drawn plates; a missing file falls back.
const artFile = (card) => `${card.suit.key}-${card.rank.key}.webp`;

/** Load a card's painting, or resolve null if it has none or it fails. */
export function loadArt(card) {
  const file = artFile(card);
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = `${import.meta.env.BASE_URL}cards/${file}`;
  });
}

/** Frame with a pocket notched out of each corner for the index. */
function framePath(c, d = 0) {
  const i = INSET + d;
  const a = INSET + NW + d;
  const b = INSET + NH + d;
  c.beginPath();
  c.moveTo(a, i);
  c.lineTo(W - a, i);
  c.lineTo(W - a, b);
  c.lineTo(W - i, b);
  c.lineTo(W - i, H - b);
  c.lineTo(W - a, H - b);
  c.lineTo(W - a, H - i);
  c.lineTo(a, H - i);
  c.lineTo(a, H - b);
  c.lineTo(i, H - b);
  c.lineTo(i, b);
  c.lineTo(a, b);
  c.closePath();
}

// Vine roots for the left half of the card (mirrored to the right). Degrees.
const SEEDS = [
  { x: 512, y: 62, angle: 180, length: 470, turns: -1.5, width: 10 },
  { x: 512, y: 200, angle: 200, length: 300, turns: 1.4, width: 9 },
  { x: 60, y: 600, angle: -90, length: 430, turns: 1.5, width: 10 },
  { x: 60, y: 600, angle: 90, length: 520, turns: -1.5, width: 10 },
  { x: 232, y: 590, angle: 180, length: 260, turns: 1.4, width: 9 },
  { x: 232, y: 590, angle: 180, length: 260, turns: -1.4, width: 9 },
  { x: 512, y: 1372, angle: 180, length: 470, turns: 1.5, width: 10 },
  { x: 300, y: 380, angle: 225, length: 330, turns: -1.4, width: 9 },
  { x: 300, y: 800, angle: 135, length: 380, turns: 1.4, width: 9 },
  { x: 512, y: 990, angle: 165, length: 360, turns: -1.4, width: 9 },
  { x: 222, y: 1157, angle: 180, length: 250, turns: 1.3, width: 9 },
  { x: 512, y: 1246, angle: 180, length: 330, turns: -1.3, width: 9 },
];

function filigree(L, seed) {
  const c = L.gold;
  c.save();
  framePath(c, 12);
  c.clip();
  for (const mirror of [false, true]) {
    c.save();
    if (mirror) {
      c.translate(W, 0);
      c.scale(-1, 1);
    }
    const rng = mulberry32(seed);
    for (const s of SEEDS) vine(c, { ...s, angle: (s.angle * Math.PI) / 180 }, rng);
    c.restore();
  }
  c.restore();
}

function frame(L) {
  const c = L.gold;
  c.lineJoin = 'miter';
  c.lineWidth = 4;
  framePath(c, 0);
  c.stroke();
  c.lineWidth = 1.5;
  framePath(c, 9);
  c.stroke();
  c.lineWidth = 2;
  c.beginPath();
  c.roundRect(22, 22, W - 44, H - 44, 46);
  c.stroke();
  c.lineJoin = 'round';
}

function courtTentacles(L, rng) {
  for (let k = 0; k < 8; k++) {
    const a = Math.PI / 8 + (k * TAU) / 8;
    tentacle(L.gold, {
      x: CX + Math.cos(a) * 250,
      y: MY + Math.sin(a) * 250,
      angle: a,
      length: 250,
      width: 40,
      curl: (k % 2 ? 1 : -1) * 2.3,
      gap: 5,
      wobble: 1,
      phase: rng() * 6,
    });
  }
}

function medallion(L, card, rng) {
  const g = L.gold;
  L.erase((c) => {
    c.beginPath();
    c.arc(CX, MY, 292, 0, TAU);
    c.fill();
  });
  thornRing(g, CX, MY, 266, 40, 20, 5);
  ring(g, CX, MY, 266, 5);
  ring(g, CX, MY, 224, 2);
  g.lineWidth = 2.2;
  runeRing(g, CX, MY, 245, 36, 15, mulberry32(hashString(card.rank.key)));

  raggedMoon(g, CX, MY, 208, rng);

  // the domain, cut out of the moon
  g.save();
  g.globalCompositeOperation = 'destination-out';
  stamp(g, iconGlyph(card.rank.icon), CX, MY - 2, 232);
  g.restore();
}

function pips(L, card) {
  const { rank, suit } = card;
  const n = rank.court ? 2 : rank.key === 'A' ? 1 : Number(rank.key);
  const big = n <= 2;
  const size = big ? 62 : 46;
  const r = big ? 48 : 37;
  const layer = suit.red ? L.red : L.gold;
  const glyph = suitGlyph(suit.key);
  for (let k = 0; k < n; k++) {
    const a = -Math.PI / 2 + (k * TAU) / n;
    const x = CX + Math.cos(a) * 354;
    const y = MY + Math.sin(a) * 398;
    L.erase((c) => {
      c.beginPath();
      c.arc(x, y, r + 7, 0, TAU);
      c.fill();
    });
    ring(L.gold, x, y, r, 2.5);
    stamp(layer, glyph, x, y, size);
  }
}

function indices(L, card) {
  const label = card.rank.key;
  const size = label.length > 1 ? 86 : 112;
  const layer = card.suit.red ? L.red : L.gold;
  const glyph = suitGlyph(card.suit.key);
  const px = INSET + NW / 2;
  const py = INSET + NH / 2;
  for (const [x, y, flip] of [
    [px, py, false],
    [W - px, py, false],
    [px, H - py, true],
    [W - px, H - py, true],
  ]) {
    for (const [c, draw] of [
      [
        L.gold,
        (c) => {
          c.font = `400 ${size}px ${FONT}`;
          c.textAlign = 'center';
          c.textBaseline = 'alphabetic';
          c.fillText(label, 0, 12);
        },
      ],
      [layer, (c) => c.drawImage(glyph, -34, 34, 68, 68)],
    ]) {
      c.save();
      c.translate(x, y);
      if (flip) c.rotate(Math.PI);
      draw(c);
      c.restore();
    }
  }
}

function fitFont(c, text, maxWidth, size, weight = '400') {
  let s = size;
  c.font = `${weight} ${s}px ${FONT}`;
  while (c.measureText(text).width > maxWidth && s > 20) {
    s -= 2;
    c.font = `${weight} ${s}px ${FONT}`;
  }
}

function plaque(L, card, rng) {
  const { x, y, w, h } = PLAQUE;
  L.erase((c) => {
    c.beginPath();
    c.roundRect(x - 14, y - 14, w + 28, h + 28, 22);
    c.fill();
  });
  const g = L.gold;
  g.lineWidth = 3;
  g.beginPath();
  g.roundRect(x - 7, y - 7, w + 14, h + 14, 16);
  g.stroke();
  // studs at either end
  for (const sx of [x - 7, x + w + 7]) {
    L.erase((c) => {
      c.beginPath();
      c.arc(sx, y + h / 2, 17, 0, TAU);
      c.fill();
    });
    polygram(g, sx, y + h / 2, 12, 4, 1);
    g.fill();
  }

  const m = L.matte;
  const grad = m.createLinearGradient(0, y, 0, y + h);
  grad.addColorStop(0, '#e2d6b4');
  grad.addColorStop(0.5, '#d6c8a2');
  grad.addColorStop(1, '#bfae84');
  m.fillStyle = grad;
  m.beginPath();
  m.roundRect(x, y, w, h, 10);
  m.fill();
  // foxing
  m.save();
  m.globalCompositeOperation = 'source-atop';
  for (let i = 0; i < 260; i++) {
    m.fillStyle = `rgba(90, 60, 25, ${0.03 + rng() * 0.08})`;
    m.beginPath();
    m.arc(x + rng() * w, y + rng() * h, 0.6 + rng() * rng() * 7, 0, TAU);
    m.fill();
  }
  m.restore();
  m.strokeStyle = 'rgba(40, 26, 12, 0.55)';
  m.lineWidth = 1.5;
  m.beginPath();
  m.roundRect(x + 8, y + 8, w - 16, h - 16, 5);
  m.stroke();

  m.textAlign = 'center';
  m.textBaseline = 'alphabetic';
  m.fillStyle = '#17110b';
  fitFont(m, card.title, w - 70, 72);
  m.fillText(card.title, CX, y + 72);

  m.fillStyle = card.suit.red ? '#7a1420' : '#3b2e1e';
  if ('letterSpacing' in m) m.letterSpacing = '3px';
  fitFont(m, card.reading, w - 80, 38);
  m.fillText(card.reading, CX + 1, y + 122);
  if ('letterSpacing' in m) m.letterSpacing = '0px';
}

/** Colour, roughness/metalness and emissive maps for one card's face. */
export function paintFace(card, art = null) {
  if (art) return paintPlate(card, (c) => coverImage(c, art));
  if (PLATES[card.id]) return PLATES[card.id](card);
  const L = createLayers(W, H);
  const rng = mulberry32(hashString(card.id));

  filigree(L, hashString(card.rank.key) + 11);
  frame(L);
  if (card.rank.court) courtTentacles(L, rng);
  medallion(L, card, rng);
  pips(L, card);
  plaque(L, card, rng);
  indices(L, card);
  distress(L.gold, W, H, rng, 0.8);
  distress(L.red, W, H, rng, 0.5);

  return composeCard(L);
}

/**
 * A plain face shared by every card that is never turned over, so the 51
 * other full-resolution faces never have to exist on the GPU.
 */
export function paintVeiledFace() {
  const w = 512;
  const h = Math.round((w * H) / W);
  const L = createLayers(w, h);
  const g = L.gold;
  g.lineWidth = 2;
  g.beginPath();
  g.roundRect(22, 22, w - 44, h - 44, 20);
  g.stroke();
  g.lineWidth = 1.2;
  polygram(g, w / 2, h / 2, 104, 7, 3);
  g.stroke();
  ring(g, w / 2, h / 2, 116, 1.5);
  return composeCard(L);
}
