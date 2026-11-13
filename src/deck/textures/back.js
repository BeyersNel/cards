// The shared card back: a gilt-framed void, tentacles creeping in from the
// corners, and an eye that watches from inside a ring of unreadable script.
// Returns a colour canvas and a matching emissive canvas (what glows).

import {
  makeCanvas,
  mulberry32,
  tentacle,
  runeRing,
  polygram,
  elderMark,
  speckle,
} from './ornament.js';

export const TEX_W = 1024;
export const TEX_H = 1434;

const GOLD_DARK = '#5a4626';
const GOLD = '#a8864a';
const GOLD_LIGHT = '#d8b878';
const VERDIGRIS = '#4fd1a5';

function goldGradient(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, '#5e4828');
  g.addColorStop(0.3, GOLD_LIGHT);
  g.addColorStop(0.55, '#7a6034');
  g.addColorStop(0.8, '#caa86a');
  g.addColorStop(1, '#5e4828');
  return g;
}

export function paintBack() {
  const W = TEX_W;
  const H = TEX_H;
  const cx = W / 2;
  const cy = H / 2;
  const rng = mulberry32(1931); // year "The Shadow over Innsmouth" was written

  const cv = makeCanvas(W, H);
  const ctx = cv.getContext('2d');
  const ev = makeCanvas(W, H);
  const e = ev.getContext('2d');
  e.fillStyle = '#000';
  e.fillRect(0, 0, W, H);

  // --- void background
  const bg = ctx.createRadialGradient(cx, cy, 60, cx, cy, H * 0.65);
  bg.addColorStop(0, '#14261f');
  bg.addColorStop(0.55, '#0a1411');
  bg.addColorStop(1, '#030605');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // --- fish-scale lattice (faint)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(60, 60, W - 120, H - 120, 28);
  ctx.clip();
  ctx.strokeStyle = 'rgba(79, 209, 165, 0.075)';
  ctx.lineWidth = 1.6;
  for (let row = 0, y = 40; y < H; row++, y += 34) {
    for (let x = row % 2 ? 0 : 26; x < W + 52; x += 52) {
      ctx.beginPath();
      ctx.arc(x, y, 26, 0.05, Math.PI - 0.05);
      ctx.stroke();
    }
  }
  ctx.restore();

  speckle(ctx, W, H, rng, { amount: 0.05 });

  // --- tentacles radiating from behind the medallion
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const s = i % 2 ? 1 : -1;
    tentacle(ctx, {
      x: cx + Math.cos(a) * 220,
      y: cy + Math.sin(a) * 220,
      angle: a,
      length: 190 + rng() * 60,
      width: 30,
      curl: s * (2.4 + rng() * 0.8),
      fill: '#0e241e',
      highlight: 'rgba(79, 209, 165, 0.35)',
      suckerFill: '#1d4a3d',
      wobble: 1,
      phase: rng() * 6,
    });
  }

  // --- corner tentacles (mirrored into all four corners)
  const corner = (sx, sy) => {
    ctx.save();
    ctx.translate(sx < 0 ? W : 0, sy < 0 ? H : 0);
    ctx.scale(sx, sy);
    const r2 = mulberry32(77);
    const specs = [
      { x: 74, y: 96, angle: 0.1, length: 300, width: 30, curl: 2.7 },
      { x: 96, y: 74, angle: Math.PI / 2 - 0.1, length: 320, width: 30, curl: -2.7 },
      { x: 80, y: 80, angle: Math.PI / 4, length: 150, width: 22, curl: 3.8 },
    ];
    for (const s of specs) {
      tentacle(ctx, {
        ...s,
        fill: GOLD_DARK,
        highlight: GOLD_LIGHT,
        suckerFill: '#8a7044',
        wobble: 1.2,
        phase: r2() * 6,
      });
    }
    ctx.restore();
  };
  corner(1, 1);
  corner(-1, 1);
  corner(1, -1);
  corner(-1, -1);

  // --- gilt borders
  ctx.lineJoin = 'round';
  ctx.strokeStyle = goldGradient(ctx, 0, 0, W, H);
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(34, 34, W - 68, H - 68, 44);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(58, 58, W - 116, H - 116, 28);
  ctx.stroke();

  // corner studs
  for (const [x, y] of [
    [58, 58],
    [W - 58, 58],
    [58, H - 58],
    [W - 58, H - 58],
  ]) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = GOLD;
    ctx.fillRect(-9, -9, 18, 18);
    ctx.fillStyle = '#0a1411';
    ctx.fillRect(-3.5, -3.5, 7, 7);
    ctx.restore();
  }

  // --- elder marks top & bottom
  for (const [y, flip] of [
    [210, 1],
    [H - 210, -1],
  ]) {
    for (const g of [ctx, e]) {
      g.save();
      g.translate(cx, y);
      g.scale(1, flip);
      g.strokeStyle = g === ctx ? GOLD : 'rgba(79, 209, 165, 0.35)';
      g.lineWidth = 4;
      g.lineCap = 'round';
      g.beginPath();
      g.arc(0, 0, 56, 0, Math.PI * 2);
      g.stroke();
      elderMark(g, 0, 4, 76);
      g.restore();
    }
  }

  // --- medallion
  ctx.beginPath();
  ctx.arc(cx, cy, 252, 0, Math.PI * 2);
  ctx.fillStyle = '#050b09';
  ctx.fill();

  ctx.strokeStyle = goldGradient(ctx, cx - 250, cy - 250, cx + 250, cy + 250);
  for (const [r, w] of [
    [252, 6],
    [234, 1.5],
    [180, 1.5],
    [168, 4],
  ]) {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // rune ring (painted twice with the same seed so emissive lines up)
  const runeSeed = 4242;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  runeRing(ctx, cx, cy, 207, 30, 24, mulberry32(runeSeed));
  e.strokeStyle = 'rgba(79, 209, 165, 0.55)';
  e.lineWidth = 3;
  e.lineCap = 'round';
  runeRing(e, cx, cy, 207, 30, 24, mulberry32(runeSeed));

  // seven-pointed star
  ctx.strokeStyle = 'rgba(168, 134, 74, 0.8)';
  ctx.lineWidth = 2;
  polygram(ctx, cx, cy, 164, 7, 3);
  ctx.stroke();

  // --- the eye
  const eye = (g, glow) => {
    g.save();
    g.translate(cx, cy);
    g.beginPath();
    g.moveTo(-128, 0);
    g.quadraticCurveTo(0, -96, 128, 0);
    g.quadraticCurveTo(0, 96, -128, 0);
    g.closePath();
    if (glow) {
      g.fillStyle = 'rgba(79, 209, 165, 0.12)';
      g.fill();
    } else {
      const sclera = g.createRadialGradient(0, 0, 10, 0, 0, 130);
      sclera.addColorStop(0, '#d7dcc0');
      sclera.addColorStop(0.7, '#8e9672');
      sclera.addColorStop(1, '#3b4232');
      g.fillStyle = sclera;
      g.fill();
    }
    g.save();
    g.clip();
    if (!glow) {
      // veins
      g.strokeStyle = 'rgba(110, 30, 30, 0.55)';
      g.lineWidth = 1.4;
      const vr = mulberry32(9);
      for (let i = 0; i < 14; i++) {
        const side = i % 2 ? 1 : -1;
        let x = side * 128;
        let y = (vr() - 0.5) * 40;
        g.beginPath();
        g.moveTo(x, y);
        for (let k = 0; k < 5; k++) {
          x -= side * (10 + vr() * 12);
          y += (vr() - 0.5) * 16;
          g.lineTo(x, y);
        }
        g.stroke();
      }
    }
    const iris = g.createRadialGradient(0, 0, 4, 0, 0, 62);
    iris.addColorStop(0, glow ? '#bfffe8' : '#b8ffe2');
    iris.addColorStop(0.45, VERDIGRIS);
    iris.addColorStop(0.85, glow ? '#1d6a52' : '#14523f');
    iris.addColorStop(1, glow ? '#08261d' : '#061c15');
    g.fillStyle = iris;
    g.beginPath();
    g.arc(0, 0, 62, 0, Math.PI * 2);
    g.fill();
    if (!glow) {
      g.strokeStyle = 'rgba(5, 20, 15, 0.5)';
      g.lineWidth = 1;
      for (let i = 0; i < 40; i++) {
        const a = (i / 40) * Math.PI * 2;
        g.beginPath();
        g.moveTo(Math.cos(a) * 16, Math.sin(a) * 16);
        g.lineTo(Math.cos(a) * 60, Math.sin(a) * 60);
        g.stroke();
      }
    }
    g.fillStyle = '#000';
    g.beginPath();
    g.ellipse(0, 0, 9, 50, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
    if (!glow) {
      g.strokeStyle = goldGradient(g, -130, 0, 130, 0);
      g.lineWidth = 5;
      g.beginPath();
      g.moveTo(-128, 0);
      g.quadraticCurveTo(0, -96, 128, 0);
      g.quadraticCurveTo(0, 96, -128, 0);
      g.stroke();
      // lashes like feelers
      g.lineWidth = 2.4;
      g.lineCap = 'round';
      for (let i = 1; i < 10; i++) {
        const t = i / 10;
        const x = -128 + 256 * t;
        const y = -96 * 2 * t * (1 - t);
        const nx = (x / 128) * 0.6;
        g.beginPath();
        g.moveTo(x, y);
        g.quadraticCurveTo(x + nx * 20, y - 18, x + nx * 30, y - 30);
        g.stroke();
      }
    }
    g.restore();
  };
  eye(ctx, false);
  eye(e, true);

  // --- vignette
  const vg = ctx.createRadialGradient(cx, cy, H * 0.3, cx, cy, H * 0.72);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  return { color: cv, emissive: ev };
}
