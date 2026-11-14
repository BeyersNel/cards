import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Cold moonlit rim, a guttering candle, and a hidden flash for the reveal.
 * Foil gets most of its shine from a heavily blurred environment, so
 * highlights read as broad sheens rather than pinpoints; the few direct
 * lights are soft and dim.
 */
export function createLighting(scene, renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.14).texture;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();

  const ambient = new THREE.HemisphereLight('#3a5a56', '#0a0806', 0.5);
  scene.add(ambient);

  const rim = new THREE.DirectionalLight('#8fd6c4', 1.1);
  rim.position.set(-6, 6, -4);
  scene.add(rim);

  const key = new THREE.SpotLight('#ffe2b0', 22, 30, Math.PI / 5.5, 1, 1.6);
  key.position.set(2.5, 4, 10);
  key.target.position.set(0, 0, 0);
  scene.add(key, key.target);

  const candle = new THREE.PointLight('#ff9c4a', 3, 14, 1.8);
  candle.position.set(3.2, -1.6, 4);
  scene.add(candle);

  const flash = new THREE.PointLight('#4fd1a5', 0, 12, 1.5);
  flash.position.set(0, 0.3, 5);
  scene.add(flash);

  return {
    key,
    candle,
    flash,
    update(t) {
      const f =
        Math.sin(t * 7.3) * 0.5 +
        Math.sin(t * 13.1 + 1.3) * 0.3 +
        Math.sin(t * 23.7 + 0.4) * 0.2;
      candle.intensity = 3 + f * 0.7;
      candle.position.x = 3.2 + Math.sin(t * 2.1) * 0.05;
    },
  };
}
