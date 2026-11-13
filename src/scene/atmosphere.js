import * as THREE from 'three';
import { makeCanvas, mulberry32, runeRing, polygram } from '../deck/textures/ornament.js';

const VOID = new THREE.Color('#05070a');

function sigilTexture() {
  const S = 1024;
  const cv = makeCanvas(S, S);
  const c = cv.getContext('2d');
  const m = S / 2;
  c.strokeStyle = '#ffffff';
  c.lineCap = 'round';
  const rings = [
    [490, 3],
    [470, 1],
    [380, 1],
    [366, 2.5],
    [200, 1.5],
  ];
  for (const [r, w] of rings) {
    c.lineWidth = w;
    c.beginPath();
    c.arc(m, m, r, 0, Math.PI * 2);
    c.stroke();
  }
  c.lineWidth = 3;
  runeRing(c, m, m, 425, 40, 34, mulberry32(666));
  c.lineWidth = 2;
  polygram(c, m, m, 362, 7, 3);
  c.stroke();
  polygram(c, m, m, 200, 7, 2);
  c.stroke();
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Fog, a faint haze, drifting motes and a slowly turning occult circle. */
export function createAtmosphere(scene, { lite = false } = {}) {
  scene.background = VOID;
  scene.fog = new THREE.FogExp2(VOID, 0.045);

  // haze behind the deck
  const haze = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 50),
    new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      depthWrite: false,
      fog: false,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        uniform float uTime;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
        }
        float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
        void main() {
          vec2 p = vUv * vec2(4.0, 2.5);
          float n = fbm(p + vec2(uTime * 0.015, uTime * 0.008));
          n = fbm(p + n * 1.6 - vec2(0.0, uTime * 0.01));
          float d = distance(vUv, vec2(0.5, 0.52));
          float glow = smoothstep(0.55, 0.0, d);
          vec3 col = mix(vec3(0.0012, 0.0018, 0.002), vec3(0.009, 0.03, 0.024), n * n * glow);
          col += vec3(0.002, 0.006, 0.005) * glow * glow;
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }
      `,
    }),
  );
  haze.position.set(0, 0, -30);
  scene.add(haze);

  // occult circle on the floor
  const sigil = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 16),
    new THREE.MeshBasicMaterial({
      map: sigilTexture(),
      color: new THREE.Color('#4fd1a5'),
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  sigil.rotation.x = -Math.PI / 2;
  sigil.position.set(0, -3.4, -2);
  scene.add(sigil);

  // drifting motes
  const count = lite ? 260 : 700;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const rng = mulberry32(31);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rng() - 0.5) * 30;
    positions[i * 3 + 1] = (rng() - 0.5) * 18;
    positions[i * 3 + 2] = -22 + rng() * 30;
    seeds[i] = rng();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const motes = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uColor: { value: new THREE.Color('#9fe8cf') },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aSeed;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          float t = uTime * (0.08 + aSeed * 0.12);
          p.y = mod(p.y + t * 2.0 + 9.0, 18.0) - 9.0;
          p.x += sin(t * 3.0 + aSeed * 40.0) * 0.6;
          p.z += cos(t * 2.0 + aSeed * 20.0) * 0.4;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (2.0 + aSeed * 5.0) * uPixelRatio * (10.0 / -mv.z);
          float twinkle = 0.5 + 0.5 * sin(uTime * (0.6 + aSeed) + aSeed * 60.0);
          float edge = smoothstep(9.0, 6.0, abs(p.y));
          vAlpha = (0.15 + 0.5 * twinkle) * edge * smoothstep(40.0, 6.0, -mv.z);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(uColor, a * a * vAlpha);
        }
      `,
    }),
  );
  scene.add(motes);

  return {
    haze,
    sigil,
    motes,
    setPixelRatio(pr) {
      motes.material.uniforms.uPixelRatio.value = pr;
    },
    update(t) {
      haze.material.uniforms.uTime.value = t;
      motes.material.uniforms.uTime.value = t;
      sigil.rotation.z = t * 0.03;
      sigil.material.opacity = 0.13 + Math.sin(t * 0.5) * 0.04;
    },
  };
}
