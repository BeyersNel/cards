import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/** Cold moonlit rim, a guttering candle, and a hidden flash for the reveal. */
export function createLighting(scene, renderer) {
  // faint neutral reflections so gilt edges read as metal
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.4;
  pmrem.dispose();

  const ambient = new THREE.HemisphereLight('#3a5a56', '#0a0806', 0.5);
  scene.add(ambient);

  const rim = new THREE.DirectionalLight('#8fd6c4', 1.1);
  rim.position.set(-6, 6, -4);
  scene.add(rim);

  const key = new THREE.SpotLight('#ffe2b0', 34, 30, Math.PI / 7, 0.8, 1.6);
  key.position.set(2.5, 4, 10);
  key.target.position.set(0, 0, 0);
  scene.add(key, key.target);

  const candle = new THREE.PointLight('#ff9c4a', 5, 14, 1.8);
  candle.position.set(3.2, -1.6, 4);
  scene.add(candle);

  const flash = new THREE.PointLight('#4fd1a5', 0, 12, 1.5);
  flash.position.set(0, 0.3, 5);
  scene.add(flash);

  // drifts in front of the revealed card (see main.js)
  const glint = new THREE.PointLight('#fff0d2', 0, 16, 2);
  scene.add(glint);

  return {
    key,
    candle,
    flash,
    glint,
    glintIntensity: 3,
    update(t) {
      const f =
        Math.sin(t * 7.3) * 0.5 +
        Math.sin(t * 13.1 + 1.3) * 0.3 +
        Math.sin(t * 23.7 + 0.4) * 0.2;
      candle.intensity = 5 + f * 1.2;
      candle.position.x = 3.2 + Math.sin(t * 2.1) * 0.05;
    },
  };
}
