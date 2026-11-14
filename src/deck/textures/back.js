// The shared card back, in gold foil on black: a wheel of thirteen moons
// (one for each rank) turning around a ragged moon, an eye watching from
// inside it, and the four suits in the corners.

import { suitGlyph } from './glyphs.js';
import {
  TEX_W as W,
  TEX_H as H,
  mulberry32,
  createLayers,
  composeCard,
  distress,
  vine,
  runeRing,
  thornRing,
  ring,
  raggedMoon,
  elderMark,
  stamp,
} from './ornament.js';

const TAU = Math.PI * 2;
const CX = W / 2;
const CY = H / 2;

// Vine roots for the top-left quarter (mirrored into all four). Degrees.
const SEEDS = [
  { x: 512, y: 66, angle: 180, length: 420, turns: -1.5, width: 10 },
  { x: 512, y: 250, angle: 195, length: 330, turns: 1.4, width: 9 },
  { x: 110, y: 717, angle: -90, length: 420, turns: 1.5, width: 10 },
  { x: 250, y: 420, angle: 235, length: 280, turns: -1.4, width: 9 },
];

function filigree(L) {
  const c = L.gold;
  c.save();
  c.beginPath();
  c.roundRect(62, 62, W - 124, H - 124, 30);
  c.clip();
  for (const [sx, sy] of [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ]) {
    c.save();
    c.translate(sx < 0 ? W : 0, sy < 0 ? H : 0);
    c.scale(sx, sy);
    const rng = mulberry32(1928); // the year "The Call of Cthulhu" was published
    for (const s of SEEDS) vine(c, { ...s, angle: (s.angle * Math.PI) / 180 }, rng);
    c.restore();
  }
  c.restore();
}

function frame(L) {
  const c = L.gold;
  c.lineWidth = 2;
  c.beginPath();
  c.roundRect(22, 22, W - 44, H - 44, 46);
  c.stroke();
  c.lineWidth = 6;
  c.beginPath();
  c.roundRect(42, 42, W - 84, H - 84, 34);
  c.stroke();
  c.lineWidth = 1.5;
  c.beginPath();
  c.roundRect(54, 54, W - 108, H - 108, 26);
  c.stroke();

  // hatched columns down each side
  for (const x of [66, W - 66 - 30]) {
    const y = 360;
    const h = H - 720;
    L.erase((e) => {
      e.beginPath();
      e.rect(x - 6, y - 6, 42, h + 12);
      e.fill();
    });
    c.lineWidth = 2;
    c.strokeRect(x, y, 30, h);
    c.save();
    c.beginPath();
    c.rect(x, y, 30, h);
    c.clip();
    c.lineWidth = 2.5;
    c.beginPath();
    for (let d = -40; d < h + 40; d += 13) {
      c.moveTo(x - 4, y + d + 34);
      c.lineTo(x + 34, y + d);
    }
    c.stroke();
    c.restore();
  }
}

function wheel(L, rng) {
  const g = L.gold;
  L.erase((c) => {
    c.beginPath();
    c.arc(CX, CY, 378, 0, TAU);
    c.fill();
  });

  thornRing(g, CX, CY, 352, 52, 20, 4.5); // one thorn for every card
  ring(g, CX, CY, 352, 6);
  ring(g, CX, CY, 248, 2);
  ring(g, CX, CY, 200, 3.5);

  // thirteen spokes
  const n = 13;
  g.lineWidth = 1.6;
  g.beginPath();
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + ((i + 0.5) * TAU) / n;
    g.moveTo(CX + Math.cos(a) * 250, CY + Math.sin(a) * 250);
    g.lineTo(CX + Math.cos(a) * 350, CY + Math.sin(a) * 350);
  }
  g.stroke();
  // thirteen moons, new to full and back again: one for each rank
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i * TAU) / n;
    const phase = i / n;
    const k = Math.cos(phase * TAU); // 1 = new, -1 = full
    const r = 30;
    g.save();
    g.translate(CX + Math.cos(a) * 300, CY + Math.sin(a) * 300);
    g.rotate(a + Math.PI / 2);
    ring(g, 0, 0, r + 6, 1.4);
    if (phase > 0.5) g.scale(-1, 1);
    g.beginPath();
    g.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
    g.ellipse(0, 0, Math.max(0.01, r * Math.abs(k)), r, 0, Math.PI / 2, -Math.PI / 2, k > 0);
    g.closePath();
    g.fill();
    g.restore();
  }

  g.lineWidth = 2.4;
  runeRing(g, CX, CY, 224, 34, 17, mulberry32(4242));

  raggedMoon(g, CX, CY, 180, rng, { craters: 12, keepClear: 0.72 });
}

function eyePath(c) {
  c.beginPath();
  c.moveTo(CX - 124, CY);
  c.quadraticCurveTo(CX, CY - 92, CX + 124, CY);
  c.quadraticCurveTo(CX, CY + 92, CX - 124, CY);
  c.closePath();
}

function eye(L) {
  L.erase((c) => {
    eyePath(c);
    c.lineWidth = 16;
    c.stroke();
    c.fill();
  });

  const m = L.matte;
  m.save();
  eyePath(m);
  m.clip();
  const sclera = m.createRadialGradient(CX, CY, 10, CX, CY, 126);
  sclera.addColorStop(0, '#d7dcc0');
  sclera.addColorStop(0.7, '#8e9672');
  sclera.addColorStop(1, '#2e3426');
  m.fillStyle = sclera;
  m.fillRect(CX - 130, CY - 60, 260, 120);
  m.strokeStyle = 'rgba(110, 30, 30, 0.55)';
  m.lineWidth = 1.4;
  const vr = mulberry32(9);
  for (let i = 0; i < 14; i++) {
    const side = i % 2 ? 1 : -1;
    let x = CX + side * 124;
    let y = CY + (vr() - 0.5) * 40;
    m.beginPath();
    m.moveTo(x, y);
    for (let k = 0; k < 5; k++) {
      x -= side * (10 + vr() * 12);
      y += (vr() - 0.5) * 16;
      m.lineTo(x, y);
    }
    m.stroke();
  }
  const iris = m.createRadialGradient(CX, CY, 4, CX, CY, 60);
  iris.addColorStop(0, '#b8ffe2');
  iris.addColorStop(0.45, '#4fd1a5');
  iris.addColorStop(0.85, '#14523f');
  iris.addColorStop(1, '#061c15');
  m.fillStyle = iris;
  m.beginPath();
  m.arc(CX, CY, 60, 0, TAU);
  m.fill();
  m.strokeStyle = 'rgba(5, 20, 15, 0.5)';
  m.lineWidth = 1;
  m.beginPath();
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * TAU;
    m.moveTo(CX + Math.cos(a) * 16, CY + Math.sin(a) * 16);
    m.lineTo(CX + Math.cos(a) * 58, CY + Math.sin(a) * 58);
  }
  m.stroke();
  m.fillStyle = '#000';
  m.beginPath();
  m.ellipse(CX, CY, 9, 48, 0, 0, TAU);
  m.fill();
  m.restore();

  // the eye is what glows
  const e = L.glow;
  e.save();
  eyePath(e);
  e.clip();
  const glow = e.createRadialGradient(CX, CY, 4, CX, CY, 110);
  glow.addColorStop(0, '#bfffe8');
  glow.addColorStop(0.3, '#4fd1a5');
  glow.addColorStop(0.55, '#1d6a52');
  glow.addColorStop(1, 'rgba(8, 38, 29, 0.6)');
  e.fillStyle = glow;
  e.fillRect(CX - 130, CY - 60, 260, 120);
  e.fillStyle = '#000';
  e.beginPath();
  e.ellipse(CX, CY, 9, 48, 0, 0, TAU);
  e.fill();
  e.restore();

  // gold lids
  const g = L.gold;
  g.lineWidth = 5;
  eyePath(g);
  g.stroke();
}

function corners(L) {
  const suits = [
    ['clubs', 192, 208, L.gold],
    ['hearts', W - 192, 208, L.red],
    ['spades', W - 192, H - 208, L.gold],
    ['diamonds', 192, H - 208, L.red],
  ];
  for (const [key, x, y, layer] of suits) {
    L.erase((c) => {
      c.beginPath();
      c.arc(x, y, 72, 0, TAU);
      c.fill();
    });
    thornRing(L.gold, x, y, 60, 16, 9, 3);
    ring(L.gold, x, y, 60, 3);
    ring(L.gold, x, y, 51, 1.2);
    stamp(layer, suitGlyph(key), x, y, 64);
  }

  for (const [y, flip] of [
    [150, 1],
    [H - 150, -1],
  ]) {
    L.erase((c) => {
      c.beginPath();
      c.arc(CX, y, 60, 0, TAU);
      c.fill();
    });
    const g = L.gold;
    ring(g, CX, y, 50, 3);
    g.save();
    g.translate(CX, y);
    g.scale(1, flip);
    g.lineWidth = 4;
    elderMark(g, 0, 4, 66);
    g.restore();
  }
}

export function paintBack() {
  const L = createLayers(W, H);
  const rng = mulberry32(1931); // the year "The Shadow over Innsmouth" was written

  filigree(L);
  frame(L);
  wheel(L, rng);
  eye(L);
  corners(L);
  distress(L.gold, W, H, rng, 0.8);
  distress(L.red, W, H, rng, 0.4);

  return composeCard(L, { foilGlow: 0.22 });
}
