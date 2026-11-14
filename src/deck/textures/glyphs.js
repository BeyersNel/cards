// Suit glyphs and the 13 domain icons from cards.pdf, drawn in a
// -50..50 unit box as white-on-transparent masks. Each renders into a cached
// offscreen canvas so icons can use cut-outs (destination-out).

import { makeCanvas } from './ornament.js';

const circle = (c, x, y, r) => {
  c.moveTo(x + r, y);
  c.arc(x, y, r, 0, Math.PI * 2);
};

const cut = (c, draw) => {
  c.save();
  c.globalCompositeOperation = 'destination-out';
  c.beginPath();
  draw();
  c.fill();
  c.restore();
};

// ---------------------------------------------------------------- suits

const SUIT_PATHS = {
  hearts: (c) => {
    c.moveTo(0, 42);
    c.bezierCurveTo(-30, 18, -50, 0, -48, -20);
    c.bezierCurveTo(-46, -40, -20, -48, 0, -26);
    c.bezierCurveTo(20, -48, 46, -40, 48, -20);
    c.bezierCurveTo(50, 0, 30, 18, 0, 42);
    c.closePath();
  },
  diamonds: (c) => {
    c.moveTo(0, -48);
    c.bezierCurveTo(8, -26, 20, -10, 36, 0);
    c.bezierCurveTo(20, 10, 8, 26, 0, 48);
    c.bezierCurveTo(-8, 26, -20, 10, -36, 0);
    c.bezierCurveTo(-20, -10, -8, -26, 0, -48);
    c.closePath();
  },
  spades: (c) => {
    c.moveTo(0, -48);
    c.bezierCurveTo(-20, -24, -50, -6, -46, 14);
    c.bezierCurveTo(-42, 32, -16, 34, -4, 18);
    c.bezierCurveTo(-6, 32, -12, 40, -18, 47);
    c.lineTo(18, 47);
    c.bezierCurveTo(12, 40, 6, 32, 4, 18);
    c.bezierCurveTo(16, 34, 42, 32, 46, 14);
    c.bezierCurveTo(50, -6, 20, -24, 0, -48);
    c.closePath();
  },
  clubs: (c) => {
    circle(c, 0, -24, 17);
    circle(c, -21, 4, 17);
    circle(c, 21, 4, 17);
    circle(c, 0, -2, 10);
    c.moveTo(-3, 0);
    c.bezierCurveTo(-4, 24, -10, 38, -18, 47);
    c.lineTo(18, 47);
    c.bezierCurveTo(10, 38, 4, 24, 3, 0);
    c.closePath();
  },
};

// ---------------------------------------------------------------- domains

const ICONS = {
  // A — body
  body(c) {
    c.beginPath();
    circle(c, 0, -28, 14);
    c.moveTo(-30, 46);
    c.bezierCurveTo(-31, 12, -19, -8, 0, -8);
    c.bezierCurveTo(19, -8, 31, 12, 30, 46);
    c.closePath();
    c.fill();
    // hollow eyes
    cut(c, () => {
      circle(c, -5, -29, 2.6);
      circle(c, 5, -29, 2.6);
    });
  },

  // 2 — touch (hand, with an eye in the palm)
  hand(c) {
    c.beginPath();
    c.roundRect(-20, -2, 40, 42, [10, 10, 16, 16]);
    const fingers = [
      [-20, -32],
      [-9.5, -43],
      [1, -41],
      [11.5, -31],
    ];
    for (const [fx, top] of fingers) c.roundRect(fx, top, 8.5, 10 - top, 4.25);
    c.fill();
    c.save();
    c.translate(-19, 16);
    c.rotate(-0.85);
    c.beginPath();
    c.roundRect(-4.5, -28, 9, 30, 4.5);
    c.fill();
    c.restore();
    cut(c, () => {
      c.moveTo(-11, 20);
      c.quadraticCurveTo(0, 9, 11, 20);
      c.quadraticCurveTo(0, 31, -11, 20);
    });
    c.beginPath();
    circle(c, 0, 20, 3.8);
    c.fill();
  },

  // 3 — authority (column)
  column(c) {
    c.beginPath();
    c.rect(-27, -42, 54, 7);
    c.rect(-22, -35, 44, 6);
    circle(c, -23, -30, 6);
    circle(c, 23, -30, 6);
    c.rect(-17, -28, 34, 61);
    c.rect(-22, 32, 44, 6);
    c.rect(-28, 38, 56, 8);
    c.fill();
    cut(c, () => {
      for (const x of [-11, -4, 3, 10]) c.rect(x - 1.4, -24, 2.8, 53);
      circle(c, -23, -30, 2.2);
      circle(c, 23, -30, 2.2);
    });
  },

  // 4 — home
  house(c) {
    c.beginPath();
    c.moveTo(0, -42);
    c.lineTo(46, 2);
    c.lineTo(34, 2);
    c.lineTo(34, 42);
    c.lineTo(-34, 42);
    c.lineTo(-34, 2);
    c.lineTo(-46, 2);
    c.closePath();
    c.rect(18, -36, 9, 22);
    c.fill();
    cut(c, () => {
      c.roundRect(-8, 16, 16, 26, [8, 8, 0, 0]);
      circle(c, 0, -10, 5.5);
    });
  },

  // 5 — work
  briefcase(c) {
    c.beginPath();
    c.roundRect(-44, -18, 88, 58, 6);
    c.fill();
    c.lineWidth = 6;
    c.beginPath();
    c.moveTo(-14, -18);
    c.lineTo(-14, -28);
    c.quadraticCurveTo(-14, -33, -9, -33);
    c.lineTo(9, -33);
    c.quadraticCurveTo(14, -33, 14, -28);
    c.lineTo(14, -18);
    c.stroke();
    cut(c, () => c.rect(-44, 0, 88, 3.5));
    c.beginPath();
    c.roundRect(-7, -5, 14, 13, 2);
    c.fill();
    cut(c, () => circle(c, 0, 2, 2.2));
  },

  // 6 — culture (comedy & tragedy)
  masks(c) {
    const mask = (smile) => {
      const shape = () => {
        c.moveTo(-20, -22);
        c.bezierCurveTo(-20, -31, 20, -31, 20, -22);
        c.bezierCurveTo(22, 0, 14, 22, 0, 27);
        c.bezierCurveTo(-14, 22, -22, 0, -20, -22);
        c.closePath();
      };
      return { shape, smile };
    };
    const features = (smile) => {
      c.ellipse(-9, -10, 6, 3.5, smile ? -0.25 : 0.35, 0, Math.PI * 2);
      c.moveTo(15, -10);
      c.ellipse(9, -10, 6, 3.5, smile ? 0.25 : -0.35, 0, Math.PI * 2);
      if (smile) {
        c.moveTo(-11, 6);
        c.quadraticCurveTo(0, 19, 11, 6);
        c.quadraticCurveTo(0, 12, -11, 6);
      } else {
        c.moveTo(-10, 16);
        c.quadraticCurveTo(0, 3, 10, 16);
        c.quadraticCurveTo(0, 9, -10, 16);
      }
    };
    // tragedy behind
    const t = mask(false);
    c.save();
    c.translate(13, 5);
    c.rotate(0.28);
    c.beginPath();
    t.shape();
    c.fill();
    cut(c, () => features(false));
    c.restore();
    // comedy in front, separated by a gap
    const m = mask(true);
    c.save();
    c.translate(-12, -4);
    c.rotate(-0.28);
    c.save();
    c.globalCompositeOperation = 'destination-out';
    c.lineWidth = 6;
    c.beginPath();
    m.shape();
    c.stroke();
    c.fill();
    c.restore();
    c.beginPath();
    m.shape();
    c.fill();
    cut(c, () => features(true));
    c.restore();
  },

  // 7 — secret
  keyhole(c) {
    c.beginPath();
    circle(c, 0, -14, 18);
    c.moveTo(-8, -4);
    c.lineTo(-16, 44);
    c.lineTo(16, 44);
    c.lineTo(8, -4);
    c.closePath();
    c.fill();
  },

  // 8 — pattern
  grid(c) {
    c.lineWidth = 6;
    c.lineCap = 'butt';
    c.beginPath();
    for (const v of [-21, -7, 7, 21]) {
      c.moveTo(v, -44);
      c.lineTo(v, 44);
      c.moveTo(-44, v);
      c.lineTo(44, v);
    }
    c.stroke();
  },

  // 9 — animal (tree, as in the source sheet)
  tree(c) {
    c.beginPath();
    circle(c, 0, -24, 18);
    circle(c, -19, -12, 15);
    circle(c, 19, -12, 15);
    circle(c, -11, 3, 14);
    circle(c, 11, 3, 14);
    circle(c, 0, -6, 16);
    c.moveTo(-5, 8);
    c.lineTo(-6, 34);
    c.bezierCurveTo(-11, 39, -18, 42, -24, 45);
    c.lineTo(24, 45);
    c.bezierCurveTo(18, 42, 11, 39, 6, 34);
    c.lineTo(5, 8);
    c.closePath();
    c.fill();
  },

  // 10 — time
  hourglass(c) {
    c.beginPath();
    c.roundRect(-27, -47, 54, 8, 2);
    c.roundRect(-27, 39, 54, 8, 2);
    c.fill();
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(-20, -39);
    c.bezierCurveTo(-20, -12, -4, -6, -4, 0);
    c.bezierCurveTo(-4, 6, -20, 12, -20, 39);
    c.moveTo(20, -39);
    c.bezierCurveTo(20, -12, 4, -6, 4, 0);
    c.bezierCurveTo(4, 6, 20, 12, 20, 39);
    c.stroke();
    c.beginPath();
    c.moveTo(-14, -27);
    c.lineTo(14, -27);
    c.bezierCurveTo(12, -15, 3, -8, 0, -3);
    c.bezierCurveTo(-3, -8, -12, -15, -14, -27);
    c.closePath();
    c.rect(-1, -3, 2, 30);
    c.moveTo(-16, 37);
    c.bezierCurveTo(-10, 25, -3, 21, 0, 19);
    c.bezierCurveTo(3, 21, 10, 25, 16, 37);
    c.closePath();
    c.fill();
  },

  // J — childhood
  child(c) {
    c.beginPath();
    circle(c, 0, -19, 19);
    c.moveTo(-25, 46);
    c.bezierCurveTo(-25, 18, -14, 6, 0, 6);
    c.bezierCurveTo(14, 6, 25, 18, 25, 46);
    c.closePath();
    c.fill();
    cut(c, () => {
      circle(c, -7, -18, 3.2);
      circle(c, 7, -18, 3.2);
    });
  },

  // Q — mother nature (crescent with a sprout and stars)
  earth(c) {
    c.beginPath();
    circle(c, -4, 2, 40);
    c.fill();
    cut(c, () => circle(c, 14, -6, 33));
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(14, 30);
    c.quadraticCurveTo(12, 14, 16, 0);
    c.stroke();
    c.beginPath();
    c.moveTo(15, 12);
    c.bezierCurveTo(4, 10, 0, 2, 2, -4);
    c.bezierCurveTo(10, -2, 15, 4, 15, 12);
    c.moveTo(16, 4);
    c.bezierCurveTo(24, 0, 30, -8, 28, -16);
    c.bezierCurveTo(20, -14, 16, -6, 16, 4);
    c.fill();
    c.beginPath();
    for (const [sx, sy, r] of [
      [30, -32, 3],
      [38, -14, 2],
      [22, -38, 1.8],
    ]) {
      c.moveTo(sx, sy - r * 2);
      c.lineTo(sx + r * 0.6, sy - r * 0.6);
      c.lineTo(sx + r * 2, sy);
      c.lineTo(sx + r * 0.6, sy + r * 0.6);
      c.lineTo(sx, sy + r * 2);
      c.lineTo(sx - r * 0.6, sy + r * 0.6);
      c.lineTo(sx - r * 2, sy);
      c.lineTo(sx - r * 0.6, sy - r * 0.6);
      c.closePath();
    }
    c.fill();
  },

  // K — father creator
  crown(c) {
    c.beginPath();
    c.roundRect(-40, 22, 80, 13, 2);
    c.moveTo(-40, 22);
    c.lineTo(-46, -14);
    c.lineTo(-23, 3);
    c.lineTo(0, -34);
    c.lineTo(23, 3);
    c.lineTo(46, -14);
    c.lineTo(40, 22);
    c.closePath();
    circle(c, -46, -15, 5.5);
    circle(c, 46, -15, 5.5);
    circle(c, 0, -36, 6.5);
    c.fill();
    cut(c, () => {
      circle(c, -20, 28.5, 3);
      circle(c, 0, 28.5, 3);
      circle(c, 20, 28.5, 3);
      c.moveTo(0, -12);
      c.lineTo(5, 4);
      c.lineTo(0, 12);
      c.lineTo(-5, 4);
      c.closePath();
    });
  },
};

// ---------------------------------------------------------------- caches

const cache = new Map();

function render(id, px, draw) {
  if (cache.has(id)) return cache.get(id);
  const cv = makeCanvas(px, px);
  const c = cv.getContext('2d');
  c.scale(px / 100, px / 100);
  c.translate(50, 50);
  c.fillStyle = '#fff';
  c.strokeStyle = '#fff';
  draw(c);
  cache.set(id, cv);
  return cv;
}

/** White-on-transparent suit glyph, for stamping onto a foil mask. */
export function suitGlyph(suitKey, px = 256) {
  return render(`suit-${suitKey}-${px}`, px, (c) => {
    c.beginPath();
    SUIT_PATHS[suitKey](c);
    c.fill();
  });
}

/** White-on-transparent domain icon. */
export function iconGlyph(iconKey, px = 512) {
  return render(`icon-${iconKey}-${px}`, px, ICONS[iconKey]);
}
