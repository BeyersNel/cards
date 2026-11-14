import * as THREE from 'three';
import gsap from 'gsap';

import { createAtmosphere } from './scene/atmosphere.js';
import { createLighting } from './scene/lighting.js';
import { createPost } from './scene/post.js';
import { Deck } from './deck/deck.js';
import {
  createSharedMaterials,
  createFaceMaterial,
  disposeFaceMaterial,
  setFace,
  CARD_W,
  CARD_H,
} from './deck/cardMesh.js';
import { CARDS, drawRandomCard } from './deck/cardData.js';
import { arrive, shuffle, drawAndExit, reveal, dismiss } from './anim/timeline.js';
import { createInput } from './input.js';
import { loadArt } from './deck/textures/face.js';
import { loadDraw, saveDraw, clearDraw, msUntilNextDraw, formatWait } from './drawLock.js';
import { renderContactSheet } from './debug/contactSheet.js';

const params = new URLSearchParams(location.search);

if (params.has('sheet')) {
  renderContactSheet();
} else {
  start();
}

async function start() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 600;
  const lite = params.has('lite') || narrow || (navigator.hardwareConcurrency ?? 8) <= 4;
  const noBloom = params.has('lite') || (navigator.hardwareConcurrency ?? 8) <= 2;
  if (params.has('fast')) gsap.globalTimeline.timeScale(4);

  // ------------------------------------------------------------ renderer
  const canvas = document.getElementById('scene');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 120);
  const cameraBase = new THREE.Vector3(0, 0, 12);

  const atmosphere = createAtmosphere(scene, { lite });
  atmosphere.setPixelRatio(renderer.getPixelRatio());
  const lights = createLighting(scene, renderer);
  const post = createPost(renderer, scene, camera, { lite, noBloom });

  // ------------------------------------------------------------ deck
  const backImage = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // fall back to the procedural back
    img.src = `${import.meta.env.BASE_URL}cards/back.webp`;
  });
  const shared = createSharedMaterials(renderer, backImage);
  const deck = new Deck(shared);
  scene.add(deck.root);

  // Where the drawn card comes to rest. Recomputed for the viewport:
  // beside the reading on wide screens, above it on tall ones.
  const REVEAL = { position: { x: 0, y: 0.3, z: 3 }, scale: 1.12 };
  let drawn = null; // { mesh, card, material }

  const fitLayout = () => {
    const aspect = window.innerWidth / window.innerHeight;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const side = aspect >= 1.15;
    document.body.dataset.layout = side ? 'side' : 'below';

    // fw/fh: how much of the viewport the card may fill; cx/cy: where its centre sits
    const spec = side ? { fw: 0.38, fh: 0.82, cx: 0.3, cy: 0.5 } : { fw: 0.84, fh: 0.5, cx: 0.5, cy: 0.3 };
    const cardW = CARD_W * REVEAL.scale;
    const cardH = CARD_H * REVEAL.scale;
    const distance = Math.max(cardW / spec.fw / (2 * tanHalf * aspect), cardH / spec.fh / (2 * tanHalf));
    const z = Math.min(5, cameraBase.z - distance);
    const visibleH = 2 * tanHalf * (cameraBase.z - z);
    REVEAL.position.x = (spec.cx - 0.5) * visibleH * aspect;
    REVEAL.position.y = (0.5 - spec.cy) * visibleH + 0.1;
    REVEAL.position.z = z;
    if (drawn && state === 'done') {
      drawn.mesh.position.set(REVEAL.position.x, REVEAL.position.y, z);
      lights.key.target.position.copy(drawn.mesh.position);
    }

    // shrink the shuffle swirl (~9.7 units wide) to fit narrow screens, allowing slight overflow
    const visibleW = 2 * tanHalf * cameraBase.z * aspect;
    deck.flowScale = Math.min(0.74, (visibleW * 1.2) / 9.7);
  };

  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    fitLayout();
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    post.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  // ------------------------------------------------------------ ui
  const hint = document.getElementById('hint');
  const reading = document.getElementById('reading');
  const readingTitle = reading.querySelector('.reading__title');
  const readingMeta = reading.querySelector('.reading__meta');
  const readingGloss = reading.querySelector('.reading__gloss');
  const readingProse = reading.querySelector('.reading__prose');
  const again = document.getElementById('again');
  const nextDraw = document.getElementById('next-draw');

  // One draw per 12 hours. `?card=N` (testing) bypasses the lock; `?reset`
  // forgets the last draw.
  const lockEnabled = !params.has('card') && !params.has('free');
  if (params.has('reset')) clearDraw();
  const announcer = document.getElementById('announcer');

  // ------------------------------------------------------------ state
  const debug = { state: 'arriving', card: null };
  window.__eldritch = debug;
  let state = 'arriving';
  const setState = (s) => {
    state = s;
    debug.state = s;
  };
  let revealedAt = 0;
  onResize();

  const fontsReady = Promise.all([
    document.fonts.load('64px "IM Fell English SC"'),
    document.fonts.load('64px "Pirata One"'),
    document.fonts.load('italic 500 64px "Cormorant Garamond"'),
  ]).catch(() => {});

  const playArrival = () => {
    setState('arriving');
    deck.root.visible = true;
    arrive(deck, { reduced }).call(() => {
      setState('idle');
      hint.classList.add('is-visible');
      input.refresh();
    });
  };

  const pickCard = () => {
    const forced = params.get('card');
    if (forced !== null && CARDS[Number(forced)]) return CARDS[Number(forced)];
    return drawRandomCard();
  };

  const begin = async () => {
    if (state !== 'idle') return;
    setState('shuffling');
    hint.classList.remove('is-visible');
    canvas.classList.remove('is-hovering');

    const card = pickCard();
    debug.card = card.id;

    const tl = gsap.timeline();
    tl.add(shuffle(deck, { reduced }));

    // prepare the face while the shuffle plays
    const [art] = await Promise.all([loadArt(card), fontsReady]);
    const material = createFaceMaterial(card, renderer, art);

    tl.call(() => {
      setState('drawing');
      const mesh = deck.order[Math.floor(deck.order.length / 2)];
      setFace(mesh, material);
      drawn = { mesh, card, material };
      // bring the light with the card
      const { x, y, z } = REVEAL.position;
      gsap.to(lights.key.target.position, { x, y, z, duration: 2, ease: 'sine.inOut' });
      lights.flash.position.set(x, y + 0.3, z + 2.2);
      tl.add(
        drawAndExit(deck, mesh, scene, REVEAL, { reduced }).call(() => {
          setState('revealing');
          reveal(mesh, lights, post, REVEAL, { reduced }).call(() => {
            setState('done');
            revealedAt = clock.elapsedTime;
            if (lockEnabled) saveDraw(card.id);
            showReading(card);
          });
        }),
      );
    });
  };

  const showReading = (card) => {
    readingTitle.textContent = card.title;
    readingMeta.textContent = `${card.label} · ${card.reading}`;
    readingGloss.textContent = card.gloss;
    readingProse.textContent = card.prose;
    updateLock();
    reading.inert = false;
    reading.classList.add('is-visible');
    announcer.textContent = `${card.label}. ${card.reading}: ${card.title}, ${card.gloss}. ${card.prose}`;
  };

  // While the last draw is under 12 hours old, "draw again" is replaced by
  // a countdown; it comes back by itself once the window has passed.
  const updateLock = () => {
    const draw = lockEnabled ? loadDraw() : null;
    again.hidden = !!draw;
    nextDraw.hidden = !draw;
    if (draw) nextDraw.textContent = `the deck rests · it returns in ${formatWait(msUntilNextDraw(draw))}`;
  };
  setInterval(() => {
    if (state === 'done') updateLock();
  }, 20_000);

  /** Show a card drawn earlier (within the window) without replaying the draw. */
  const restoreDraw = async (card) => {
    setState('restoring');
    debug.card = card.id;
    deck.root.visible = false;
    const [art] = await Promise.all([loadArt(card), fontsReady]);
    const material = createFaceMaterial(card, renderer, art);
    const mesh = deck.order[Math.floor(deck.order.length / 2)];
    setFace(mesh, material);
    scene.attach(mesh);
    mesh.rotation.set(0, 0, 0);
    mesh.scale.setScalar(REVEAL.scale);
    mesh.position.set(REVEAL.position.x, REVEAL.position.y, REVEAL.position.z);
    lights.key.target.position.copy(mesh.position);
    drawn = { mesh, card, material };
    // drift in out of the dark
    gsap.from(mesh.position, { z: REVEAL.position.z - 4, duration: reduced ? 0.6 : 2.2, ease: 'power3.out' });
    gsap.from(mesh.scale, { x: 0.8, y: 0.8, z: 0.8, duration: reduced ? 0.6 : 2.2, ease: 'power3.out' });
    setState('done');
    revealedAt = clock.elapsedTime;
    showReading(card);
  };

  again.addEventListener('click', () => {
    if (state !== 'done' || !drawn) return;
    if (lockEnabled && loadDraw()) return updateLock();
    setState('resetting');
    reading.classList.remove('is-visible');
    reading.inert = true;
    canvas.focus({ preventScroll: true });
    gsap.to(lights.key.target.position, { x: 0, y: 0, z: 0, duration: 2, ease: 'sine.inOut' });
    const { mesh, material } = drawn;
    dismiss(mesh, { reduced }).call(() => {
      deck.float.attach(mesh);
      setFace(mesh, shared.veiled);
      disposeFaceMaterial(material);
      deck.squareUp();
      drawn = null;
      playArrival();
    });
  });

  const input = createInput(canvas, camera, () => (state === 'idle' ? deck.cards : []), {
    onActivate: begin,
    onPointer: (ndc) => {
      deck.tilt.set(THREE.MathUtils.clamp(ndc.x, -1, 1), THREE.MathUtils.clamp(ndc.y, -1, 1));
    },
  });

  // ------------------------------------------------------------ loop
  // `clock.elapsedTime` is the scene time. In ?step mode (headless capture)
  // time only moves when window.__advance() is called.
  const stepMode = params.has('step');
  const clock = stepMode ? { elapsedTime: 0, getDelta: () => 0 } : new THREE.Clock();
  const tick = (stepDt) => {
    const dt = stepMode ? stepDt : Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    deck.update(t, dt);
    atmosphere.update(t);
    lights.update(t);

    // breathing camera
    camera.position.set(
      cameraBase.x + Math.sin(t * 0.21) * 0.12,
      cameraBase.y + Math.sin(t * 0.17) * 0.08,
      cameraBase.z,
    );
    camera.lookAt(0, 0.1, 0);

    // the revealed card hovers gently
    if (state === 'done' && drawn) {
      const k = Math.min(1, (t - revealedAt) / 1.5);
      drawn.mesh.position.y = REVEAL.position.y + Math.sin((t - revealedAt) * 0.9) * 0.06 * k;
      drawn.mesh.rotation.y = Math.sin((t - revealedAt) * 0.5) * 0.08 * k;
      drawn.mesh.rotation.x = Math.sin((t - revealedAt) * 0.7) * 0.04 * k;
    }

    if (!stepMode) post.render(t);
  };

  if (stepMode) {
    gsap.ticker.remove(gsap.updateRoot);
    window.__advance = (seconds, fps = 30) => {
      const n = Math.max(1, Math.round(seconds * fps));
      for (let i = 0; i < n; i++) {
        clock.elapsedTime += 1 / fps;
        gsap.updateRoot(clock.elapsedTime);
        tick(1 / fps);
      }
      post.render(clock.elapsedTime);
      return debug.state;
    };
    window.__activate = begin;
    debug.updateLock = updateLock;
    debug.deck = deck; // for the headless overlap check
    post.render(0);
  } else {
    renderer.setAnimationLoop(tick);
  }

  const saved = lockEnabled ? loadDraw() : null;
  const savedCard = saved && CARDS.find((c) => c.id === saved.id);
  if (savedCard) restoreDraw(savedCard);
  else playArrival();
}
