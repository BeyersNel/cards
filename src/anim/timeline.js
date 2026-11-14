import gsap from 'gsap';
import { DECK_SIZE } from '../deck/deck.js';

const N = DECK_SIZE;

/** Deck glides out of the fog toward the viewer. */
export function arrive(deck, { reduced = false } = {}) {
  const { root } = deck;
  const back = deck.shared.back;
  const tl = gsap.timeline();
  if (reduced) {
    root.position.set(0, 0.15, -6);
    root.rotation.set(-0.12, 0.25, 0);
    root.scale.setScalar(1);
    back.emissiveIntensity = 0;
    tl.to(root.position, { z: 0, duration: 1.2, ease: 'power1.out' });
    tl.to(back, { emissiveIntensity: 1, duration: 1.2 }, 0);
    return tl;
  }
  root.position.set(2.2, -1.4, -42);
  root.rotation.set(0.5, -1.45, 0.35);
  root.scale.setScalar(0.7);
  back.emissiveIntensity = 0;
  deck.floatAmount = 0;

  // different eases per axis give the approach a gentle curve
  tl.to(root.position, { z: 0, duration: 3.6, ease: 'power3.out' }, 0)
    .to(root.position, { x: 0, duration: 3.6, ease: 'sine.inOut' }, 0)
    .to(root.position, { y: 0.15, duration: 3.6, ease: 'back.out(1.4)' }, 0)
    .to(root.rotation, { x: -0.12, y: 0.25, z: 0, duration: 3.8, ease: 'power2.out' }, 0)
    .to(root.scale, { x: 1, y: 1, z: 1, duration: 3.4, ease: 'power2.out' }, 0)
    .to(back, { emissiveIntensity: 1, duration: 2.2, ease: 'sine.inOut' }, 1.4)
    .to(deck, { floatAmount: 1, duration: 1.5, ease: 'sine.inOut' }, 2.6);
  return tl;
}

/** Flow out into a current, riffle, and restack. Mutates deck.order. */
export function shuffle(deck, { reduced = false } = {}) {
  const tl = gsap.timeline();
  tl.to(deck, { floatAmount: 0.15, duration: 0.6, ease: 'sine.out' }, 0);
  tl.to(deck.root.rotation, { x: 0, y: 0, z: 0, duration: 0.8, ease: 'sine.inOut' }, 0);
  // pull back a little so the swirl stays inside the frame
  const fs = deck.flowScale ?? 0.74;
  tl.to(deck.root.scale, { x: fs, y: fs, z: fs, duration: 0.9, ease: 'sine.inOut' }, 0);

  const cards = deck.order.slice();

  if (!reduced) {
    // 1. flow: cards peel off the top and swirl into a spiralling arc
    cards.forEach((m, i) => {
      const t = i / (N - 1);
      const a = -Math.PI * 0.85 + t * Math.PI * 1.7;
      const r = 2.9 + Math.sin(t * Math.PI) * 0.7;
      tl.to(
        m.position,
        {
          x: Math.sin(a) * r,
          y: Math.cos(a) * r * 0.32 - 0.9,
          z: -1.6 + Math.cos(a) * 1.4 + i * 0.012,
          duration: 1.25,
          ease: 'power2.inOut',
        },
        0.15 + (1 - t) * 0.45,
      );
      tl.to(
        m.rotation,
        {
          x: -0.25 + Math.cos(a) * 0.15,
          y: Math.PI + Math.sin(a) * 0.35,
          z: -a * 0.35,
          duration: 1.25,
          ease: 'power2.inOut',
        },
        0.15 + (1 - t) * 0.45,
      );
    });
  }

  // 2. riffle: split into two halves, then interleave
  const half = N / 2;
  const left = cards.slice(0, half);
  const right = cards.slice(half);
  const splitAt = reduced ? 0.3 : 1.95;
  const pose = (m, side, k) => ({
    x: side * 1.75,
    y: -0.15 + k * 0.004,
    z: (k - half / 2) * 0.018,
    rz: side * -0.22,
  });
  [left, right].forEach((group, gi) => {
    const side = gi === 0 ? -1 : 1;
    group.forEach((m, k) => {
      const p = pose(m, side, k);
      tl.to(m.position, { x: p.x, y: p.y, z: p.z, duration: 0.7, ease: 'power3.inOut' }, splitAt + k * 0.006);
      tl.to(m.rotation, { x: 0.12, y: Math.PI, z: p.rz, duration: 0.7, ease: 'power3.inOut' }, splitAt + k * 0.006);
    });
  });

  // interleave: alternately drop from each half onto the new stack
  const newOrder = [];
  for (let k = 0; k < half; k++) {
    newOrder.push(left[k], right[k]);
  }
  const riffleAt = splitAt + 0.9;
  newOrder.forEach((m, i) => {
    const p = deck.stackPose(i, m);
    const at = riffleAt + i * 0.022;
    tl.to(m.position, { x: p.x * 3, y: p.y + 0.12, z: p.z, duration: 0.28, ease: 'power2.in' }, at);
    tl.to(m.rotation, { x: 0, y: p.ry, z: p.rz * 4, duration: 0.28, ease: 'power2.in' }, at);
  });

  // 3. restack: square the edges
  const squareAt = riffleAt + N * 0.022 + 0.2;
  newOrder.forEach((m, i) => {
    const p = deck.stackPose(i, m);
    tl.to(m.position, { x: p.x, y: p.y, z: p.z, duration: 0.35, ease: 'back.out(2)' }, squareAt + (i % 4) * 0.01);
    tl.to(m.rotation, { x: p.rx, y: p.ry, z: p.rz, duration: 0.35, ease: 'back.out(2)' }, squareAt + (i % 4) * 0.01);
  });
  tl.call(() => {
    deck.order = newOrder;
  }, null, squareAt);
  tl.to(deck, { floatAmount: 0.6, duration: 0.6 }, squareAt);
  tl.to(deck.root.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'sine.inOut' }, squareAt - 0.3);
  return tl;
}

/**
 * Pull the chosen card out of the middle of the stack, carry it forward,
 * and send the rest of the deck up and away into the fog.
 */
export function drawAndExit(deck, mesh, scene, revealPose, { reduced = false } = {}) {
  const tl = gsap.timeline();
  const idx = deck.order.indexOf(mesh);
  const home = deck.stackPose(idx, mesh);

  // slide sideways out of the stack
  tl.to(mesh.position, { x: home.x + 2.9, y: home.y + 0.15, duration: reduced ? 0.4 : 0.85, ease: 'power2.inOut' });
  tl.to(mesh.rotation, { z: -0.12, duration: reduced ? 0.4 : 0.85, ease: 'sine.inOut' }, '<');

  // reparent to the world so the deck can leave without it
  tl.call(() => scene.attach(mesh));
  tl.to(mesh.position, { ...revealPose.position, duration: reduced ? 0.6 : 1.3, ease: 'power3.inOut' }, '>');
  tl.to(mesh.rotation, { x: 0, y: Math.PI, z: 0, duration: reduced ? 0.6 : 1.3, ease: 'power2.inOut' }, '<');

  // deck departs
  const exitAt = reduced ? 0.4 : 0.95;
  tl.to(deck, { floatAmount: 0, duration: 0.5 }, exitAt);
  tl.to(
    deck.root.position,
    { x: -1.5, y: 7.5, z: -34, duration: reduced ? 1 : 2.4, ease: 'power2.in' },
    exitAt,
  );
  tl.to(deck.root.rotation, { x: -0.9, y: -0.6, z: 0.4, duration: reduced ? 1 : 2.4, ease: 'power2.in' }, exitAt);
  tl.to(deck.shared.back, { emissiveIntensity: 0, duration: 1.6 }, exitAt + 0.4);
  return tl;
}

/** Turn the card over with a flare of verdigris light. */
export function reveal(mesh, lights, post, revealPose, { reduced = false } = {}) {
  const tl = gsap.timeline();
  const d = reduced ? 0.6 : 1.5;
  tl.to(mesh.rotation, { y: 0, duration: d, ease: 'power3.inOut' }, 0);
  if (!reduced) {
    tl.to(mesh.rotation, { x: -0.18, duration: d / 2, ease: 'sine.out', yoyo: true, repeat: 1 }, 0);
    tl.to(mesh.position, { z: `+=${0.6}`, duration: d / 2, ease: 'sine.out', yoyo: true, repeat: 1 }, 0);
  }
  tl.to(mesh.scale, { x: revealPose.scale, y: revealPose.scale, z: revealPose.scale, duration: d, ease: 'power2.out' }, 0);
  tl.to(lights.flash, { intensity: 16, duration: d * 0.45, ease: 'power2.in' }, 0);
  tl.to(lights.flash, { intensity: 0, duration: 1.4, ease: 'power2.out' }, d * 0.45);
  tl.to(post.bloom, { strength: post.baseBloom * 2.2, duration: d * 0.45, ease: 'power2.in' }, 0);
  tl.to(post.bloom, { strength: post.baseBloom, duration: 1.4, ease: 'power2.out' }, d * 0.45);
  return tl;
}

/** Send the revealed card away before a new draw. */
export function dismiss(mesh, { reduced = false } = {}) {
  const tl = gsap.timeline();
  const d = reduced ? 0.5 : 1.4;
  tl.to(mesh.rotation, { y: Math.PI, x: 0.4, z: 0.3, duration: d, ease: 'power2.in' }, 0);
  tl.to(mesh.position, { y: 8, z: -30, duration: d, ease: 'power2.in' }, 0);
  return tl;
}
