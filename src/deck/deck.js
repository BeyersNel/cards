import * as THREE from 'three';
import { createCardGeometry, createCardMesh } from './cardMesh.js';
import { mulberry32 } from './textures/ornament.js';

export const STACK_GAP = 0.0135;
export const DECK_SIZE = 52;

/**
 * Hierarchy:
 *   root   — moved by GSAP (arrive, exit)
 *   float  — moved every frame (bob, hover tilt)
 *   cards  — 52 meshes, face-down (rotation.y = π)
 */
export class Deck {
  constructor(shared) {
    this.root = new THREE.Group();
    this.float = new THREE.Group();
    this.root.add(this.float);
    this.geometry = createCardGeometry();
    this.shared = shared;
    this.cards = [];
    this.floatAmount = 1;
    this.tilt = new THREE.Vector2();

    const rng = mulberry32(5);
    for (let i = 0; i < DECK_SIZE; i++) {
      const mesh = createCardMesh(this.geometry, shared);
      mesh.userData.jitter = {
        x: (rng() - 0.5) * 0.035,
        y: (rng() - 0.5) * 0.035,
        rz: (rng() - 0.5) * 0.02,
      };
      this.float.add(mesh);
      this.cards.push(mesh);
    }
    this.order = this.cards.slice();
    this.squareUp();
  }

  /** Target transform for stack position `i` (0 = bottom, furthest away). */
  stackPose(i, mesh) {
    const j = mesh.userData.jitter;
    return {
      x: j.x,
      y: j.y,
      z: (i - (DECK_SIZE - 1) / 2) * STACK_GAP,
      rx: 0,
      ry: Math.PI,
      rz: j.rz,
    };
  }

  squareUp() {
    this.order.forEach((m, i) => {
      const p = this.stackPose(i, m);
      m.position.set(p.x, p.y, p.z);
      m.rotation.set(p.rx, p.ry, p.rz);
      m.scale.setScalar(1);
    });
  }

  /** Called every frame. */
  update(t, dt) {
    const a = this.floatAmount;
    this.float.position.y = Math.sin(t * 0.9) * 0.12 * a;
    this.float.position.x = Math.sin(t * 0.5) * 0.04 * a;
    const k = 1 - Math.exp(-dt * 4);
    this.float.rotation.x += (-this.tilt.y * 0.22 * a + Math.sin(t * 0.7) * 0.03 * a - this.float.rotation.x) * k;
    this.float.rotation.y += (this.tilt.x * 0.3 * a + Math.sin(t * 0.4) * 0.06 * a - this.float.rotation.y) * k;
    this.float.rotation.z = Math.sin(t * 0.6) * 0.02 * a;
  }
}

