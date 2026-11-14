// ?sheet — paints every face plus the back into one grid, for checking the art.
import { CARDS } from '../deck/cardData.js';
import { paintFace } from '../deck/textures/face.js';
import { paintBack } from '../deck/textures/back.js';
import { TEX_W, TEX_H } from '../deck/textures/ornament.js';

export async function renderContactSheet() {
  await Promise.all([
    document.fonts.load('64px "IM Fell English SC"'),
    document.fonts.load('64px "Pirata One"'),
    document.fonts.load('italic 500 64px "Cormorant Garamond"'),
  ]).catch(() => {});

  document.querySelectorAll('#hint, #reading').forEach((n) => n.remove());
  document.getElementById('scene').remove();
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';

  const cols = 14;
  const cw = 256;
  const ch = Math.round((cw * TEX_H) / TEX_W);
  const gap = 12;
  const rows = Math.ceil((CARDS.length + 1) / cols);
  const sheet = document.createElement('canvas');
  sheet.width = cols * (cw + gap) + gap;
  sheet.height = rows * (ch + gap) + gap;
  sheet.id = 'sheet';
  const ctx = sheet.getContext('2d');
  ctx.fillStyle = '#05070a';
  ctx.fillRect(0, 0, sheet.width, sheet.height);

  const items = [paintBack(), ...CARDS.map((c) => paintFace(c))].map((art) => ({ canvas: art.color }));
  items.forEach((it, i) => {
    const x = gap + (i % cols) * (cw + gap);
    const y = gap + Math.floor(i / cols) * (ch + gap);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, cw, ch, 10);
    ctx.clip();
    ctx.drawImage(it.canvas, x, y, cw, ch);
    ctx.restore();
  });

  document.body.appendChild(sheet);
  document.body.dataset.ready = 'true';
}
