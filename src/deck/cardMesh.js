import * as THREE from 'three';
import { paintBack } from './textures/back.js';
import { paintFace, paintVeiledFace } from './textures/face.js';

export const CARD_W = 2.5;
export const CARD_H = 3.5;
export const CARD_D = 0.012;
const CORNER = 0.16;

const MAT = { BACK: 0, FRONT: 1, EDGE: 2 };

/**
 * Thin rounded-rectangle slab. Groups: 0 = back (−z), 1 = front (+z), 2 = edge.
 * Cap UVs span the card's bounding box; the back is mirrored so its texture
 * reads correctly once the card is turned over.
 */
export function createCardGeometry() {
  const w = CARD_W;
  const h = CARD_H;
  const r = CORNER;
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

  const g = new THREE.ExtrudeGeometry(s, {
    depth: CARD_D,
    bevelEnabled: false,
    curveSegments: 6,
  });
  g.translate(0, 0, -CARD_D / 2);

  // ExtrudeGeometry emits bottom caps, then top caps (one group), then sides.
  const [caps, sides] = g.groups;
  const half = caps.count / 2;
  g.clearGroups();
  g.addGroup(caps.start, half, MAT.BACK);
  g.addGroup(caps.start + half, half, MAT.FRONT);
  g.addGroup(sides.start, sides.count, MAT.EDGE);

  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = caps.start; i < caps.start + caps.count; i++) {
    const u = (pos.getX(i) + w / 2) / w;
    const v = (pos.getY(i) + h / 2) / h;
    uv.setXY(i, i < caps.start + half ? 1 - u : u, v);
  }
  uv.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

function toTexture(canvas, renderer) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}

export function createSharedMaterials(renderer) {
  const back = paintBack();
  const backColor = toTexture(back.color, renderer);
  const backEmissive = toTexture(back.emissive, renderer);

  return {
    back: new THREE.MeshStandardMaterial({
      map: backColor,
      emissiveMap: backEmissive,
      emissive: new THREE.Color('#4fd1a5'),
      emissiveIntensity: 0,
      roughness: 0.5,
      metalness: 0.2,
    }),
    veiled: new THREE.MeshStandardMaterial({
      map: toTexture(paintVeiledFace(), renderer),
      roughness: 0.9,
    }),
    edge: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#a8864a'),
      metalness: 0.9,
      roughness: 0.32,
      emissive: new THREE.Color('#2a1d0a'),
    }),
  };
}

/** A unique, full-detail face material for the drawn card. */
export function createFaceMaterial(card, renderer) {
  const tex = toTexture(paintFace(card), renderer);
  return new THREE.MeshStandardMaterial({
    map: tex,
    emissiveMap: tex,
    emissive: new THREE.Color('#ffffff'),
    emissiveIntensity: 0.1,
    roughness: 0.85,
    metalness: 0,
  });
}

export function createCardMesh(geometry, shared) {
  const mesh = new THREE.Mesh(geometry, [shared.back, shared.veiled, shared.edge]);
  mesh.castShadow = false;
  return mesh;
}

export function setFace(mesh, material) {
  const mats = mesh.material.slice();
  mats[MAT.FRONT] = material;
  mesh.material = mats;
}
