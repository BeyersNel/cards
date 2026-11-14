import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const GrainVignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uGrain: { value: 0.05 },
    uVignette: { value: 1.15 },
    uAberration: { value: 0.0016 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime, uGrain, uVignette, uAberration;
    varying vec2 vUv;
    float rand(vec2 co) { return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec2 c = vUv - 0.5;
      float d = length(c);
      vec2 off = c * d * uAberration * 10.0;
      vec3 col;
      col.r = texture2D(tDiffuse, vUv + off).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, vUv - off).b;
      col *= smoothstep(0.85, 0.2, d * uVignette);
      float g = rand(vUv * vec2(1024.0, 768.0) + fract(uTime * 7.0)) - 0.5;
      col += g * uGrain * (0.3 + col);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export function createPost(renderer, scene, camera, { lite = false, noBloom = false } = {}) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const size = renderer.getSize(new THREE.Vector2());
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(size.x / (lite ? 2 : 1), size.y / (lite ? 2 : 1)),
    0.75,
    0.7,
    0.8,
  );
  bloom.enabled = !noBloom;
  composer.addPass(bloom);

  const grain = new ShaderPass(GrainVignetteShader);
  if (lite) grain.uniforms.uAberration.value = 0;
  composer.addPass(grain);
  composer.addPass(new OutputPass());

  return {
    composer,
    bloom,
    baseBloom: bloom.strength,
    setSize(w, h) {
      composer.setSize(w, h);
      if (lite) bloom.resolution.set(w / 2, h / 2);
    },
    render(t) {
      grain.uniforms.uTime.value = t;
      composer.render();
    },
  };
}
