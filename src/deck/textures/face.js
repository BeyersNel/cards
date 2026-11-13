// Card faces: aged parchment, ink frame, rank/suit indices, a central
// medallion where the domain icon is fused with the suit, wreathed in
// tentacles and thorns, and a banner that reads "angle × domain".

import { TEX_W, TEX_H } from './back.js';
import { suitCanvas, iconCanvas, drawCentered } from './glyphs.js';
import {
  makeCanvas,
  mulberry32,
  hashString,
  tentacle,
  runeRing,
  speckle,
  thornRing,
  polygram,
} from './ornament.js';

const INK = '#1a1410';
const OXBLOOD = '#7a1420';
const GOLD = '#8a6a36';
const FONT_INDEX = '"IM Fell English SC", "Cormorant Garamond", Georgia, serif';
const FONT_BODY = '"Cormorant Garamond", Georgia, serif';

const suitInk = (suit) => (suit.red ? OXBLOOD : INK);
const tentacleInk = (suit) => (suit.red ? '#4e0c15' : '#211913');

function parchment(ctx, W, H, rng) {
  ctx.fillStyle = '#c8b791';
  ctx.fillRect(0, 0, W, H);

  // faint scale lattice, like the skin of something old
  ctx.strokeStyle = 'rgba(60, 40, 20, 0.07)';
  ctx.lineWidth = W / 600;
  const sr = W / 40;
  for (let row = 0, y = 0; y < H + sr; row++, y += sr * 1.3) {
    for (let x = row % 2 ? 0 : sr; x < W + sr * 2; x += sr * 2) {
      ctx.beginPath();
      ctx.arc(x, y, sr, 0.1, Math.PI - 0.1);
      ctx.stroke();
    }
  }

  // stains
  for (let i = 0; i < 14; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const r = 60 + rng() * 220;
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    const a = 0.04 + rng() * 0.07;
    g.addColorStop(0, `rgba(120, 82, 40, ${a})`);
    g.addColorStop(0.8, `rgba(110, 74, 34, ${a * 0.6})`);
    g.addColorStop(1, 'rgba(110, 74, 34, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // fibres
  ctx.strokeStyle = 'rgba(90, 64, 36, 0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 380; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const a = rng() * Math.PI;
    const l = 8 + rng() * 26;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    ctx.stroke();
  }

  speckle(ctx, W, H, rng, { amount: 0.07 });

  // burnt vignette
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.7);
  v.addColorStop(0, 'rgba(40, 24, 10, 0)');
  v.addColorStop(0.6, 'rgba(60, 36, 16, 0.28)');
  v.addColorStop(0.85, 'rgba(40, 22, 10, 0.62)');
  v.addColorStop(1, 'rgba(18, 10, 4, 0.95)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

function frame(ctx, W, H, suit, court, rng) {
  ctx.strokeStyle = INK;
  ctx.lineJoin = 'round';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(42, 42, W - 84, H - 84, 34);
  ctx.stroke();
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.roundRect(56, 56, W - 112, H - 112, 24);
  ctx.stroke();

  if (court) {
    // gilt arched inner frame
    const x0 = 196;
    const x1 = W - 196;
    const y0 = 330;
    const y1 = H - 330;
    const arch = () => {
      ctx.beginPath();
      ctx.moveTo(x0, y1);
      ctx.lineTo(x0, y0 + 110);
      ctx.quadraticCurveTo(x0, y0, W / 2, y0 - 40);
      ctx.quadraticCurveTo(x1, y0, x1, y0 + 110);
      ctx.lineTo(x1, y1);
      ctx.closePath();
    };
    arch();
    ctx.fillStyle = 'rgba(168, 134, 74, 0.13)';
    ctx.fill();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(0.94, 0.95);
    ctx.translate(-W / 2, -H / 2);
    arch();
    ctx.stroke();
    ctx.restore();

    // gilt rays fanning behind the medallion
    ctx.save();
    arch();
    ctx.clip();
    ctx.strokeStyle = 'rgba(138, 106, 54, 0.35)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(W / 2 + Math.cos(a) * 290, 640 + Math.sin(a) * 290);
      ctx.lineTo(W / 2 + Math.cos(a) * 700, 640 + Math.sin(a) * 700);
      ctx.stroke();
    }
    ctx.restore();

    // thorns along the arch crown
    ctx.fillStyle = GOLD;
    for (let i = 1; i < 12; i++) {
      const t = i / 12;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + 110 - Math.sin(t * Math.PI) * 150 - 2;
      ctx.beginPath();
      ctx.moveTo(x - 5, y + 4);
      ctx.lineTo(x, y - 16);
      ctx.lineTo(x + 5, y + 4);
      ctx.fill();
    }

    // thorned crest at the top of the arch
    ctx.fillStyle = suitInk(suit);
    ctx.save();
    ctx.translate(W / 2, y0 - 40);
    polygram(ctx, 0, 0, 34, 7, 3);
    ctx.fill();
    ctx.restore();
  }

  // filigree in the two corners the indices leave empty (rotationally symmetric)
  for (const flip of [false, true]) {
    ctx.save();
    if (flip) {
      ctx.translate(W, H);
      ctx.rotate(Math.PI);
    }
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    const col = court ? GOLD : 'rgba(26, 20, 16, 0.85)';
    tentacle(ctx, { x: 64, y: 84, angle: 0.06, length: 200, width: 13, curl: 1.9, fill: col, steps: 60 });
    tentacle(ctx, { x: 84, y: 64, angle: Math.PI / 2 - 0.06, length: 220, width: 13, curl: -1.9, fill: col, steps: 60 });
    tentacle(ctx, { x: 70, y: 70, angle: Math.PI / 4, length: 110, width: 10, curl: 4.2, fill: col, steps: 40 });
    ctx.restore();
  }
}

function indices(ctx, W, H, card) {
  const color = suitInk(card.suit);
  const label = card.rank.key;
  const size = label.length > 1 ? 104 : 128;
  const draw = () => {
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `400 ${size}px ${FONT_INDEX}`;
    ctx.fillText(label, 122, 200);
    drawCentered(ctx, suitCanvas(card.suit.key, 192, color, { tendrils: true }), 122, 268, 96);
  };
  draw();
  ctx.save();
  ctx.translate(W, H);
  ctx.rotate(Math.PI);
  draw();
  ctx.restore();
}

function medallion(ctx, W, card, rng) {
  const cx = W / 2;
  const cy = 640;
  const color = suitInk(card.suit);

  // ghost of the suit behind everything
  ctx.save();
  ctx.globalAlpha = 0.14;
  drawCentered(ctx, suitCanvas(card.suit.key, 512, color), cx, cy + 10, 470);
  ctx.restore();

  // tentacles rise from beneath the banner and curl over the ring
  const tc = tentacleInk(card.suit);
  for (const s of [-1, 1]) {
    tentacle(ctx, {
      x: cx + s * 210,
      y: cy + 420,
      angle: -Math.PI / 2 + s * 0.32,
      length: 300,
      width: 26,
      curl: -s * 3.2,
      fill: tc,
      suckerFill: 'rgba(212, 198, 163, 0.5)',
      wobble: 1,
      phase: rng() * 6,
    });
    tentacle(ctx, {
      x: cx + s * 110,
      y: cy + 410,
      angle: -Math.PI / 2 + s * 0.5,
      length: 560,
      width: 46,
      curl: -s * 1.55,
      fill: tc,
      highlight: 'rgba(212, 198, 163, 0.3)',
      suckerFill: 'rgba(212, 198, 163, 0.6)',
      wobble: 1.2,
      phase: rng() * 6,
    });
  }

  // a faint star behind the ring
  ctx.strokeStyle = 'rgba(26, 20, 16, 0.12)';
  ctx.lineWidth = 2;
  polygram(ctx, cx, cy, 380, 7, 3);
  ctx.stroke();

  // ring
  ctx.beginPath();
  ctx.arc(cx, cy, 272, 0, Math.PI * 2);
  ctx.fillStyle = '#d2c39f';
  ctx.fill();
  ctx.fillStyle = color;
  thornRing(ctx, cx, cy, 272, 28, 22, 6);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 272, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(cx, cy, 226, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(26, 20, 16, 0.7)';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  runeRing(ctx, cx, cy, 249, 34, 17, mulberry32(hashString(card.rank.key)));

  // domain icon fused with the suit sigil beneath it
  drawCentered(ctx, iconCanvas(card.rank.icon, 520, INK), cx, cy - 22, 270);
  drawCentered(ctx, suitCanvas(card.suit.key, 160, color), cx, cy + 168, 60);
}

function fitFont(ctx, text, maxWidth, size, family, style = '') {
  let s = size;
  ctx.font = `${style} ${s}px ${family}`;
  while (ctx.measureText(text).width > maxWidth && s > 20) {
    s -= 2;
    ctx.font = `${style} ${s}px ${family}`;
  }
  return s;
}

function banner(ctx, W, card) {
  const y = 1048;
  const x0 = 168;
  const x1 = W - 168;
  const h = 92;
  const notch = 34;

  // ribbon tails
  ctx.fillStyle = '#b8a47c';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  for (const s of [-1, 1]) {
    const xe = s < 0 ? x0 : x1;
    ctx.beginPath();
    ctx.moveTo(xe - s * 10, y - h / 2 + 18);
    ctx.lineTo(xe + s * 70, y - h / 2 + 18);
    ctx.lineTo(xe + s * (70 - notch), y + 18);
    ctx.lineTo(xe + s * 70, y + h / 2 + 18);
    ctx.lineTo(xe - s * 10, y + h / 2 + 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  // main band
  ctx.beginPath();
  ctx.moveTo(x0, y - h / 2);
  ctx.quadraticCurveTo(W / 2, y - h / 2 - 22, x1, y - h / 2);
  ctx.lineTo(x1, y + h / 2);
  ctx.quadraticCurveTo(W / 2, y + h / 2 - 22, x0, y + h / 2);
  ctx.closePath();
  ctx.fillStyle = '#cbb990';
  ctx.fill();
  ctx.stroke();

  const text = `${card.suit.angle} × ${card.rank.domain}`;
  fitFont(ctx, text, x1 - x0 - 70, 60, FONT_INDEX, '400');
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, W / 2, y - 8);

  if (card.synthesis) {
    fitFont(ctx, card.synthesis, 520, 76, FONT_BODY, 'italic 500');
    ctx.fillStyle = suitInk(card.suit);
    ctx.fillText(card.synthesis, W / 2, 1168);
  }
  if (card.subtitle) {
    fitFont(ctx, card.subtitle, 600, 34, FONT_BODY, 'italic 500');
    ctx.fillStyle = 'rgba(26, 20, 16, 0.78)';
    ctx.fillText(card.subtitle, W / 2, 1226);
  }
}

/** Full-detail face for one card. */
export function paintFace(card) {
  const W = TEX_W;
  const H = TEX_H;
  const cv = makeCanvas(W, H);
  const ctx = cv.getContext('2d');
  const rng = mulberry32(hashString(card.id));
  parchment(ctx, W, H, rng);
  frame(ctx, W, H, card.suit, !!card.rank.court, rng);
  medallion(ctx, W, card, rng);
  banner(ctx, W, card);
  indices(ctx, W, H, card);
  return cv;
}

/**
 * A blank, veiled face shared by every card that is never revealed,
 * so 51 full-resolution faces never have to exist on the GPU.
 */
export function paintVeiledFace() {
  const W = 512;
  const H = Math.round((512 * TEX_H) / TEX_W);
  const cv = makeCanvas(W, H);
  const ctx = cv.getContext('2d');
  const rng = mulberry32(13);
  parchment(ctx, W, H, rng);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(22, 22, W - 44, H - 44, 18);
  ctx.stroke();
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1.5;
  polygram(ctx, W / 2, H / 2, 110, 7, 3);
  ctx.stroke();
  return cv;
}
