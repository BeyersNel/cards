// Ace of Clubs — death × body = Sleep.
// "The way that the body prepares for death."
//
// A sleeper lies shrouded on a stone bier at the edge of a night sea, hands
// folded like a tomb effigy. Great tentacles rise from the water and arch
// over the bier — cradle or threat, the picture does not say. Above, the
// moon has closed its eye. Poppies, flowers of sleep, grow at the foot.

import { mulberry32 } from '../ornament.js';
import { suitGlyph } from '../glyphs.js';
import { INK, shape, smooth, hatch, inkTentacle, tintGlyph, paintPlate } from './engraving.js';

const TAU = Math.PI * 2;
const MOON = '#e4d7a9';
const SKIN = '#c2c6b0';
const SHROUD = '#d2c9b1';
const SHROUD_SHADE = '#9d9a86';
const STONE = '#77848a';
const STONE_DARK = '#4d5a60';
const POPPY = '#8a1c24';

function sky(c, P, HZ, rng) {
  const g = c.createLinearGradient(0, P.y, 0, HZ);
  g.addColorStop(0, '#0b111b');
  g.addColorStop(0.55, '#18283a');
  g.addColorStop(1, '#3a5563');
  c.fillStyle = g;
  c.fillRect(P.x, P.y, P.w, HZ - P.y);

  // engraved sky: heavier, closer lines toward the zenith
  c.strokeStyle = 'rgba(5, 7, 11, 0.55)';
  c.lineCap = 'round';
  for (let y = P.y + 6; y < HZ; ) {
    const k = 1 - (y - P.y) / (HZ - P.y);
    c.lineWidth = 0.9 + k * 1.6;
    c.beginPath();
    c.moveTo(P.x, y);
    for (let x = P.x + 20; x <= P.x + P.w; x += 20) c.lineTo(x, y + Math.sin(x * 0.02 + y * 0.9) * 1.1);
    c.stroke();
    y += 5 + (1 - k) * 6;
  }

  // stars
  for (let i = 0; i < 90; i++) {
    const x = P.x + rng() * P.w;
    const y = P.y + rng() * rng() * (HZ - P.y - 80);
    const r = 0.8 + rng() * rng() * 2.6;
    c.fillStyle = `rgba(228, 220, 190, ${0.5 + rng() * 0.5})`;
    c.beginPath();
    if (r > 2.2) {
      c.moveTo(x, y - r * 3);
      c.quadraticCurveTo(x, y, x + r * 3, y);
      c.quadraticCurveTo(x, y, x, y + r * 3);
      c.quadraticCurveTo(x, y, x - r * 3, y);
      c.quadraticCurveTo(x, y, x, y - r * 3);
    } else {
      c.arc(x, y, r, 0, TAU);
    }
    c.fill();
  }
}

function moon(c, mx, my, r) {
  // halo
  const halo = c.createRadialGradient(mx, my, r * 0.9, mx, my, r + 300);
  halo.addColorStop(0, 'rgba(228, 215, 169, 0.42)');
  halo.addColorStop(0.4, 'rgba(160, 180, 170, 0.14)');
  halo.addColorStop(1, 'rgba(160, 180, 170, 0)');
  c.fillStyle = halo;
  c.fillRect(mx - r - 300, my - r - 300, (r + 300) * 2, (r + 300) * 2);
  c.strokeStyle = 'rgba(228, 215, 169, 0.3)';
  c.lineWidth = 1.5;
  c.setLineDash([3, 9]);
  for (const k of [36, 78]) {
    c.beginPath();
    c.arc(mx, my, r + k, 0, TAU);
    c.stroke();
  }
  c.setLineDash([]);

  const disc = (c) => {
    c.beginPath();
    c.arc(mx, my, r, 0, TAU);
  };
  shape(c, disc, { fill: MOON, lw: 4 });

  // limb shading: everything outside a circle offset toward the upper right
  const shade = (dx, dy, k) => (c) => {
    c.beginPath();
    c.rect(mx - r - 4, my - r - 4, r * 2 + 8, r * 2 + 8);
    c.arc(mx + dx, my + dy, r * k, 0, TAU, true);
  };
  const box = [mx - r, my - r, mx + r, my + r];
  hatch(c, [disc, shade(30, -26, 1)], box, { angle: -0.9, spacing: 6, width: 1.5, color: '#5b5a3c', alpha: 0.75 });
  hatch(c, [disc, shade(58, -48, 1.02)], box, { angle: 0.5, spacing: 7, width: 1.3, color: '#4a4930', alpha: 0.6 });

  // maria and craters
  c.strokeStyle = 'rgba(86, 84, 54, 0.75)';
  c.lineWidth = 1.6;
  for (const [dx, dy, cr, a0, a1] of [
    [-70, -78, 26, 0.4, 3.6],
    [58, -92, 16, 2.2, 5.6],
    [96, -18, 22, 1.2, 4.4],
    [-104, 30, 14, 0, 3.4],
    [-28, -122, 11, 0.6, 4],
    [112, 70, 12, 2.6, 6],
    [-60, 118, 18, 3, 6.2],
    [40, 124, 10, 3.4, 6.4],
  ]) {
    c.beginPath();
    c.arc(mx + dx, my + dy, cr, a0, a1);
    c.stroke();
  }

  // the closed eye
  c.strokeStyle = INK;
  c.lineCap = 'round';
  c.lineWidth = 7;
  c.beginPath();
  c.moveTo(mx - 112, my + 2);
  c.quadraticCurveTo(mx, my + 84, mx + 112, my + 2);
  c.stroke();
  c.lineWidth = 2.2;
  c.beginPath();
  c.moveTo(mx - 98, my - 22);
  c.quadraticCurveTo(mx, my - 78, mx + 98, my - 22);
  c.stroke();
  c.lineWidth = 3;
  c.beginPath();
  for (let i = 0; i <= 10; i++) {
    const t = 0.06 + (i / 10) * 0.88;
    const x = mx - 112 + 224 * t;
    const y = my + 2 + 164 * t * (1 - t);
    const lean = (t - 0.5) * 1.3;
    c.moveTo(x, y);
    c.quadraticCurveTo(x + lean * 10, y + 16, x + lean * 26, y + 24 + 14 * Math.sin(t * Math.PI));
  }
  c.stroke();
}

function clouds(c, rng) {
  for (const [x, y, w, h] of [
    [380, 468, 300, 13],
    [690, 300, 230, 10],
    [250, 250, 190, 9],
    [760, 520, 200, 9],
  ]) {
    const path = (c) => {
      c.beginPath();
      c.moveTo(x - w / 2, y);
      c.bezierCurveTo(x - w / 4, y - h, x + w / 4, y - h * 1.3, x + w / 2, y - 2);
      c.bezierCurveTo(x + w / 4, y + h, x - w / 4, y + h * 0.9, x - w / 2, y);
      c.closePath();
    };
    shape(c, path, { fill: '#101a26', lw: 1.5 });
    c.strokeStyle = 'rgba(190, 196, 176, 0.45)';
    c.lineWidth = 1.2;
    c.beginPath();
    c.moveTo(x - w * 0.36, y - h * 0.5);
    c.quadraticCurveTo(x + rng() * 20, y - h * 1.15, x + w * 0.38, y - h * 0.62);
    c.stroke();
  }
}

function cliffs(c, P, HZ) {
  const X0 = P.x;
  const X1 = P.x + P.w;
  const left = (c) => {
    c.beginPath();
    c.moveTo(X0, HZ);
    c.lineTo(X0, 548);
    c.lineTo(104, 540);
    c.lineTo(112, 452);
    c.lineTo(122, 458);
    c.lineTo(128, 440);
    c.lineTo(140, 452);
    c.lineTo(150, 436);
    c.lineTo(158, 540);
    c.lineTo(196, 548);
    c.lineTo(222, 590);
    c.lineTo(252, 612);
    c.lineTo(270, 668);
    c.lineTo(318, 716);
    c.lineTo(346, HZ);
    c.closePath();
  };
  const right = (c) => {
    c.beginPath();
    c.moveTo(X1, HZ);
    c.lineTo(X1, 596);
    c.lineTo(918, 588);
    c.lineTo(884, 632);
    c.lineTo(836, 650);
    c.lineTo(806, 712);
    c.lineTo(748, HZ);
    c.closePath();
  };
  for (const [path, box] of [
    [left, [X0, 430, 350, HZ]],
    [right, [740, 580, X1, HZ]],
  ]) {
    shape(c, path, { fill: '#0c131c', lw: 2.5 });
    hatch(c, path, box, { angle: 1.1, spacing: 9, width: 1.2, color: '#4b6676', alpha: 0.5 });
  }
  // a lit window in the ruin
  c.fillStyle = '#d9b25a';
  c.fillRect(129, 474, 7, 12);
}

function sea(c, P, HZ, mx, rng) {
  const Y1 = P.y + P.h;
  const g = c.createLinearGradient(0, HZ, 0, Y1);
  g.addColorStop(0, '#2b4654');
  g.addColorStop(0.35, '#1a2d3b');
  g.addColorStop(1, '#0c141d');
  c.fillStyle = g;
  c.fillRect(P.x, HZ, P.w, Y1 - HZ);
  // mist on the horizon
  const mist = c.createLinearGradient(0, HZ - 46, 0, HZ + 30);
  mist.addColorStop(0, 'rgba(150, 178, 176, 0)');
  mist.addColorStop(0.6, 'rgba(150, 178, 176, 0.3)');
  mist.addColorStop(1, 'rgba(150, 178, 176, 0)');
  c.fillStyle = mist;
  c.fillRect(P.x, HZ - 46, P.w, 76);

  c.lineCap = 'round';
  for (let y = HZ + 8, s = 7; y < Y1; y += s, s *= 1.085) {
    const n = Math.round(P.w / (s * 4.2));
    // swell lines
    c.strokeStyle = 'rgba(126, 170, 176, 0.42)';
    c.lineWidth = 1 + s * 0.05;
    c.beginPath();
    for (let i = 0; i < n; i++) {
      const x = P.x + rng() * P.w;
      const w = s * (1.2 + rng() * 2);
      c.moveTo(x - w, y);
      c.quadraticCurveTo(x, y - s * 0.5, x + w, y);
    }
    c.stroke();
    // troughs
    c.strokeStyle = 'rgba(4, 7, 11, 0.5)';
    c.beginPath();
    for (let i = 0; i < n * 0.7; i++) {
      const x = P.x + rng() * P.w;
      const w = s * (1 + rng() * 1.6);
      c.moveTo(x - w, y + s * 0.4);
      c.quadraticCurveTo(x, y + s * 0.75, x + w, y + s * 0.4);
    }
    c.stroke();
    // the moon's road
    const reach = 30 + (y - HZ) * 0.42;
    c.strokeStyle = 'rgba(228, 215, 169, 0.8)';
    c.lineWidth = 1.4 + s * 0.09;
    c.beginPath();
    for (let i = 0; i < 8; i++) {
      const x = mx + (rng() - 0.5) * 2 * reach;
      const w = (4 + rng() * 12) * (0.6 + s / 16);
      c.moveTo(x - w, y);
      c.lineTo(x + w, y);
    }
    c.stroke();
  }
}

function bier(c) {
  const top = (c) => {
    c.beginPath();
    c.moveTo(150, 972);
    c.lineTo(874, 972);
    c.lineTo(842, 942);
    c.lineTo(182, 942);
    c.closePath();
  };
  const front = (c) => {
    c.beginPath();
    c.rect(150, 972, 724, 112);
  };
  const plinth = (c) => {
    c.beginPath();
    c.moveTo(126, 1084);
    c.lineTo(898, 1084);
    c.lineTo(906, 1122);
    c.lineTo(118, 1122);
    c.closePath();
  };
  shape(c, plinth, { fill: STONE_DARK, lw: 3.5 });
  hatch(c, plinth, [118, 1084, 906, 1122], { angle: 0, spacing: 6, width: 1.3, alpha: 0.55 });
  shape(c, front, { fill: STONE_DARK, lw: 3.5 });
  // moonlit upper part of the face, shadow below
  const lit = c.createLinearGradient(0, 972, 0, 1084);
  lit.addColorStop(0, 'rgba(150, 168, 170, 0.55)');
  lit.addColorStop(1, 'rgba(150, 168, 170, 0)');
  c.fillStyle = lit;
  c.fillRect(152, 974, 720, 108);
  hatch(c, front, [150, 972, 874, 1084], { angle: Math.PI / 2, spacing: 7, width: 1.2, alpha: 0.4 });
  hatch(c, front, [150, 1030, 874, 1084], { angle: 0.6, spacing: 8, width: 1.2, alpha: 0.45 });
  // carved clubs, half hidden by the shroud
  const club = tintGlyph(suitGlyph('clubs'), '#2b363c');
  for (const x of [206, 302, 722, 818]) {
    c.drawImage(club, x - 30, 996, 60, 60);
    c.strokeStyle = 'rgba(170, 186, 188, 0.55)';
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(x, 1026, 38, 0.3, 2.3);
    c.stroke();
  }
  shape(c, top, { fill: STONE, lw: 3.5 });
  hatch(c, top, [150, 942, 874, 972], { angle: 0, spacing: 5, width: 1, alpha: 0.35 });
}

function sleeper(c) {
  // Head, hair and pillow are drawn at a larger working size and scaled
  // down so the head sits at about a seventh of the body's length.
  const k = 0.62;
  const u = 1 / k;
  c.save();
  c.translate(63.2, 360.7);
  c.scale(k, k);

  const pillow = (c) => {
    c.beginPath();
    c.moveTo(188, 948);
    c.bezierCurveTo(180, 918, 214, 902, 262, 906);
    c.bezierCurveTo(312, 900, 366, 912, 362, 946);
    c.bezierCurveTo(330, 958, 222, 958, 188, 948);
    c.closePath();
  };
  shape(c, pillow, { fill: '#b9b29b', lw: 3 * u });
  hatch(c, pillow, [180, 925, 366, 958], { angle: 0.2, spacing: 5 * u, width: 1.1 * u, alpha: 0.5 });

  // hair, spilling over the pillow and the edge of the stone
  const hair = (c) => {
    c.beginPath();
    c.moveTo(292, 836);
    c.bezierCurveTo(252, 832, 222, 858, 222, 896);
    c.bezierCurveTo(204, 920, 176, 946, 168, 990);
    c.bezierCurveTo(160, 1024, 172, 1052, 186, 1064);
    c.bezierCurveTo(184, 1030, 196, 1004, 214, 978);
    c.bezierCurveTo(228, 956, 250, 944, 276, 934);
    c.bezierCurveTo(284, 908, 282, 872, 292, 836);
    c.closePath();
  };
  shape(c, hair, { fill: '#10161e', lw: 3 * u });
  c.strokeStyle = 'rgba(150, 168, 176, 0.55)';
  c.lineWidth = 1.2 * u;
  c.beginPath();
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    c.moveTo(276 - t * 30, 846 + t * 14);
    c.bezierCurveTo(238 - t * 8, 880 + t * 10, 212 - t * 14, 930, 180 + t * 10, 1000 + t * 40);
  }
  c.stroke();

  // head in profile, face to the sky
  const head = (c) => {
    c.beginPath();
    c.moveTo(300, 932);
    c.bezierCurveTo(262, 934, 240, 914, 240, 886);
    c.bezierCurveTo(240, 858, 262, 840, 290, 838);
    c.bezierCurveTo(302, 834, 312, 832, 320, 834); // brow
    c.quadraticCurveTo(326, 838, 331, 836); // root of the nose
    c.quadraticCurveTo(340, 826, 348, 816); // bridge
    c.quadraticCurveTo(354, 822, 352, 834); // tip and underside
    c.quadraticCurveTo(356, 838, 361, 835); // upper lip
    c.quadraticCurveTo(363, 840, 360, 843); // parting of the lips
    c.quadraticCurveTo(366, 843, 368, 847); // lower lip
    c.quadraticCurveTo(366, 852, 370, 854);
    c.quadraticCurveTo(381, 852, 384, 861); // chin
    c.bezierCurveTo(386, 876, 378, 888, 372, 900); // under the jaw, throat
    c.lineTo(408, 912);
    c.lineTo(408, 944);
    c.lineTo(300, 944);
    c.closePath();
  };
  shape(c, head, { fill: SKIN, lw: 3 * u });
  hatch(
    c,
    [
      head,
      (c) => {
        c.beginPath();
        c.moveTo(236, 902);
        c.bezierCurveTo(290, 888, 340, 888, 392, 872);
        c.lineTo(410, 950);
        c.lineTo(236, 950);
        c.closePath();
      },
    ],
    [236, 860, 410, 950],
    { angle: -0.35, spacing: 5 * u, width: 1.2 * u, alpha: 0.5 },
  );
  c.strokeStyle = INK;
  c.lineCap = 'round';
  c.lineWidth = 2.2 * u;
  c.beginPath();
  // closed eye and lashes
  c.moveTo(308, 850);
  c.quadraticCurveTo(318, 859, 329, 852);
  c.moveTo(312, 855);
  c.lineTo(309, 861);
  c.moveTo(319, 858);
  c.lineTo(318, 864);
  c.moveTo(326, 856);
  c.lineTo(328, 862);
  // brow, nostril, corner of the mouth
  c.moveTo(302, 843);
  c.quadraticCurveTo(316, 838, 327, 843);
  c.moveTo(345, 834);
  c.quadraticCurveTo(348, 838, 351, 835);
  c.moveTo(360, 843);
  c.quadraticCurveTo(355, 850, 350, 850);
  // cheekbone, jaw, ear
  c.moveTo(336, 864);
  c.quadraticCurveTo(346, 873, 358, 870);
  c.moveTo(381, 867);
  c.quadraticCurveTo(350, 892, 302, 888);
  c.moveTo(292, 876);
  c.bezierCurveTo(276, 872, 274, 898, 290, 900);
  c.stroke();
  c.restore();

  // the body under its shroud
  const contour = [
    [304, 920],
    [326, 898],
    [372, 880],
    [420, 868],
    [452, 860],
    [486, 866],
    [530, 878],
    [580, 886],
    [636, 878],
    [700, 876],
    [752, 866],
    [800, 882],
    [828, 884],
    [846, 848],
    [858, 864],
    [862, 946],
  ];
  const body = (c) => {
    c.beginPath();
    smooth(c, contour);
    c.lineTo(304, 946);
    c.closePath();
  };
  shape(c, body, { fill: SHROUD, lw: 3 });
  // shadow along the underside and behind each rise
  const under = (c) => {
    c.beginPath();
    c.moveTo(304, 946);
    smooth(
      c,
      contour.map(([x, y]) => [x, y + 26 + (946 - y) * 0.3]),
      { move: false },
    );
    c.lineTo(862, 946);
    c.closePath();
  };
  c.save();
  body(c);
  c.clip();
  under(c);
  c.fillStyle = SHROUD_SHADE;
  c.fill();
  c.restore();
  hatch(c, [body, under], [304, 846, 862, 946], { angle: -0.5, spacing: 5.5, width: 1.2, alpha: 0.5 });
  // folds
  c.strokeStyle = INK;
  c.lineWidth = 1.7;
  c.beginPath();
  for (const [x0, y0, x1, y1, bend] of [
    [318, 908, 330, 942, 6],
    [346, 890, 372, 942, 12],
    [398, 874, 420, 940, 10],
    [522, 878, 556, 944, 18],
    [598, 886, 626, 942, 12],
    [662, 878, 678, 944, 8],
    [722, 872, 746, 942, 12],
    [778, 876, 788, 944, 6],
    [840, 858, 850, 940, 6],
  ]) {
    c.moveTo(x0, y0);
    c.quadraticCurveTo((x0 + x1) / 2 + bend, (y0 + y1) / 2 - 6, x1, y1);
  }
  c.stroke();

  // folded hands
  const hands = (c) => {
    c.beginPath();
    c.moveTo(424, 866);
    c.bezierCurveTo(428, 850, 450, 842, 472, 845);
    c.bezierCurveTo(492, 847, 504, 858, 501, 868);
    c.bezierCurveTo(484, 877, 446, 877, 424, 866);
    c.closePath();
  };
  shape(c, hands, { fill: SKIN, lw: 2.4 });
  c.lineWidth = 1.4;
  c.beginPath();
  c.moveTo(432, 862);
  c.quadraticCurveTo(462, 850, 496, 861);
  for (const x of [448, 460, 472, 484]) {
    c.moveTo(x, 848 + Math.abs(x - 466) * 0.12);
    c.lineTo(x + 3, 859);
  }
  c.stroke();
}

function drape(c) {
  // the shroud falls over the front of the stone in heavy scallops
  const xs = [322, 400, 486, 574, 662, 748, 836];
  const path = (c) => {
    c.beginPath();
    c.moveTo(316, 944);
    c.lineTo(852, 944);
    c.bezierCurveTo(858, 980, 848, 1008, 836, 1022);
    for (let i = xs.length - 1; i > 0; i--) {
      const a = xs[i];
      const b = xs[i - 1];
      const drop = 1046 + ((i * 37) % 24);
      c.bezierCurveTo(a - (a - b) * 0.2, drop, b + (a - b) * 0.3, drop + 4, b, 1016 + ((i * 13) % 12));
    }
    c.bezierCurveTo(310, 998, 310, 968, 316, 944);
    c.closePath();
  };
  shape(c, path, { fill: SHROUD, lw: 3 });
  c.save();
  path(c);
  c.clip();
  const g = c.createLinearGradient(0, 956, 0, 1070);
  g.addColorStop(0, 'rgba(120, 118, 100, 0)');
  g.addColorStop(1, 'rgba(92, 92, 82, 0.9)');
  c.fillStyle = g;
  c.fillRect(300, 940, 570, 140);
  c.restore();
  const low = (c) => {
    c.beginPath();
    c.rect(300, 1000, 570, 90);
  };
  hatch(c, [path, low], [300, 1000, 870, 1090], { angle: -1.1, spacing: 6, width: 1.2, alpha: 0.5 });
  c.strokeStyle = INK;
  c.lineWidth = 1.7;
  c.lineCap = 'round';
  c.beginPath();
  for (let i = 1; i < xs.length - 1; i++) {
    const x = xs[i];
    c.moveTo(x, 1020);
    c.bezierCurveTo(x - 6, 1000, x + 10, 978, x + 4, 950);
    c.moveTo(x + 28, 1040);
    c.quadraticCurveTo(x + 36, 1004, x + 30, 970);
    c.moveTo(x - 26, 1036);
    c.quadraticCurveTo(x - 32, 1008, x - 24, 982);
  }
  c.stroke();
}

/** Breath leaving the sleeper and climbing toward the moon. */
function breath(c) {
  const p = [
    [288, 880],
    [306, 822],
    [262, 772],
    [300, 712],
    [344, 650],
    [322, 602],
    [372, 556],
  ];
  const at = (t) => {
    const n = p.length - 1;
    const i = Math.min(n - 1, Math.floor(t * n));
    const f = t * n - i;
    const p0 = p[Math.max(0, i - 1)];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[Math.min(n, i + 2)];
    const cr = (a, b, c2, d) =>
      0.5 * (2 * b + (c2 - a) * f + (2 * a - 5 * b + 4 * c2 - d) * f * f + (3 * b - a - 3 * c2 + d) * f * f * f);
    return [cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])];
  };
  c.lineCap = 'round';
  for (const off of [0, 7]) {
    for (let i = 0; i < 60; i++) {
      const t0 = i / 60;
      const [x0, y0] = at(t0);
      const [x1, y1] = at(t0 + 1 / 60);
      c.strokeStyle = `rgba(214, 226, 208, ${(0.6 - off * 0.03) * (1 - t0) + 0.04})`;
      c.lineWidth = 2.4 - t0 * 1.6;
      c.beginPath();
      c.moveTo(x0 + off * t0 * 2, y0);
      c.lineTo(x1 + off * (t0 + 1 / 60) * 2, y1);
      c.stroke();
    }
  }
}

function moth(c, x, y, s, rot) {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.scale(s, s);
  for (const side of [-1, 1]) {
    c.save();
    c.scale(side, 1);
    const upper = (c) => {
      c.beginPath();
      c.moveTo(2, -4);
      c.bezierCurveTo(14, -30, 40, -34, 46, -22);
      c.bezierCurveTo(44, -8, 24, 2, 2, 2);
      c.closePath();
    };
    const lower = (c) => {
      c.beginPath();
      c.moveTo(2, 2);
      c.bezierCurveTo(20, 4, 32, 14, 28, 26);
      c.bezierCurveTo(16, 28, 6, 18, 2, 8);
      c.closePath();
    };
    shape(c, lower, { fill: '#9d967c', lw: 1.6 });
    shape(c, upper, { fill: '#cfc7a8', lw: 1.6 });
    c.fillStyle = INK;
    c.beginPath();
    c.arc(28, -18, 3.4, 0, TAU);
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(8, -6);
    c.quadraticCurveTo(24, -12, 40, -24);
    c.moveTo(2, -10);
    c.quadraticCurveTo(6, -22, 12, -28);
    c.stroke();
    c.restore();
  }
  c.fillStyle = INK;
  c.beginPath();
  c.ellipse(0, 2, 3.4, 13, 0, 0, TAU);
  c.fill();
  c.restore();
}

function shore(c, P, rng) {
  const Y1 = P.y + P.h;
  const rock = (c) => {
    c.beginPath();
    c.moveTo(P.x, 1116);
    smooth(
      c,
      [
        [P.x, 1116],
        [150, 1104],
        [260, 1126],
        [380, 1118],
        [520, 1132],
        [660, 1120],
        [790, 1128],
        [890, 1106],
        [P.x + P.w, 1118],
      ],
      { move: false },
    );
    c.lineTo(P.x + P.w, Y1);
    c.lineTo(P.x, Y1);
    c.closePath();
  };
  shape(c, rock, { fill: '#121a22', lw: 3 });
  hatch(c, rock, [P.x, 1100, P.x + P.w, Y1], { angle: 0.25, spacing: 7, width: 1.3, color: '#4f6875', alpha: 0.5 });
  hatch(c, rock, [P.x, 1140, P.x + P.w, Y1], { angle: -0.9, spacing: 9, width: 1.3, alpha: 0.6 });
  // foam where the water meets the stone
  c.strokeStyle = 'rgba(200, 214, 204, 0.6)';
  c.lineWidth = 1.6;
  c.beginPath();
  for (let i = 0; i < 26; i++) {
    const x = P.x + rng() * P.w;
    const y = 1106 + rng() * 12;
    c.moveTo(x - 10, y);
    c.quadraticCurveTo(x, y - 5, x + 10, y);
  }
  c.stroke();
}

function poppy(c, x, y, r, rootX, rootY, tilt) {
  c.strokeStyle = '#1d2a22';
  c.lineWidth = 4;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(rootX, rootY);
  c.quadraticCurveTo(rootX + (x - rootX) * 0.1, (y + rootY) / 2, x, y + r * 0.5);
  c.stroke();
  c.strokeStyle = INK;
  c.lineWidth = 1.2;
  c.stroke();
  c.save();
  c.translate(x, y);
  c.rotate(tilt);
  for (const [a, k] of [
    [-1.9, 1],
    [-0.5, 1.05],
    [0.9, 0.95],
    [2.4, 1],
  ]) {
    const petal = (c) => {
      c.beginPath();
      c.moveTo(0, r * 0.15);
      c.bezierCurveTo(
        Math.cos(a - 0.9) * r * 1.25 * k,
        Math.sin(a - 0.9) * r * 1.1 * k,
        Math.cos(a + 0.9) * r * 1.25 * k,
        Math.sin(a + 0.9) * r * 1.1 * k,
        0,
        r * 0.15,
      );
      c.closePath();
    };
    shape(c, petal, { fill: POPPY, lw: 2 });
    hatch(c, petal, [-r * 1.3, -r * 1.3, r * 1.3, r * 1.3], { angle: a, spacing: 4, width: 1, alpha: 0.4 });
  }
  c.fillStyle = INK;
  c.beginPath();
  c.arc(0, r * 0.1, r * 0.26, 0, TAU);
  c.fill();
  c.restore();
}

function scene(c, P) {
  const rng = mulberry32(1890);
  const HZ = 770;
  const MX = 512;
  const MY = 372;

  sky(c, P, HZ, rng);
  moon(c, MX, MY, 176);
  clouds(c, rng);
  cliffs(c, P, HZ);
  sea(c, P, HZ, MX, rng);

  // distant limbs breaking the surface
  const far = { back: '#16282c', belly: '#4f6a63', sucker: '#8fa08a', lw: 2.5 };
  inkTentacle(c, { x: 214, y: 838, angle: -1.45, length: 330, turns: 0.72, width: 36, ...far });
  inkTentacle(c, { x: 352, y: 852, angle: -1.7, length: 210, turns: -0.8, width: 26, ...far });
  inkTentacle(c, { x: 812, y: 836, angle: -1.7, length: 330, turns: -0.72, width: 36, ...far });
  inkTentacle(c, { x: 686, y: 850, angle: -1.42, length: 220, turns: 0.8, width: 26, ...far });
  // re-lay a little water over their roots
  const veil = c.createLinearGradient(0, 812, 0, 870);
  veil.addColorStop(0, 'rgba(26, 45, 59, 0)');
  veil.addColorStop(1, 'rgba(22, 38, 50, 1)');
  c.fillStyle = veil;
  c.fillRect(P.x, 812, P.w, 60);

  shore(c, P, rng);
  bier(c);
  sleeper(c);
  drape(c);

  // the two great arms that arch over the sleeper
  inkTentacle(c, { x: 92, y: 1230, angle: -1.42, length: 900, turns: 0.6, width: 92, power: 3 });
  inkTentacle(c, { x: 932, y: 1230, angle: -1.72, length: 900, turns: -0.6, width: 92, power: 3 });

  breath(c);
  moth(c, 430, 738, 1, -0.35);
  moth(c, 612, 690, 0.8, 0.45);
  moth(c, 548, 792, 0.62, 0.1);

  poppy(c, 214, 1046, 38, 232, 1196, -0.3);
  poppy(c, 290, 1100, 30, 276, 1196, 0.35);
  poppy(c, 156, 1120, 24, 190, 1196, -0.6);
  poppy(c, 764, 1060, 34, 752, 1196, 0.3);
  poppy(c, 704, 1112, 26, 726, 1196, -0.4);

  // darkness closing in at the edges
  const v = c.createRadialGradient(512, 620, 380, 512, 620, 860);
  v.addColorStop(0, 'rgba(4, 6, 10, 0)');
  v.addColorStop(1, 'rgba(4, 6, 10, 0.72)');
  c.fillStyle = v;
  c.fillRect(P.x, P.y, P.w, P.h);
}

export function paintSleep(card) {
  return paintPlate(card, scene);
}
