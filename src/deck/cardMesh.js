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

function toTexture(canvas, renderer, srgb = true) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}

/**
 * Black stock with metallic foil. The art's `orm` map makes the foil a
 * smooth metal and the stock a rough dielectric, so the foil catches the
 * light as the card turns; a little emissive keeps it legible in the dark.
 */
function foilMaterial(art, renderer, emissiveIntensity) {
  const orm = toTexture(art.orm, renderer, false);
  return new THREE.MeshStandardMaterial({
    map: toTexture(art.color, renderer),
    emissiveMap: toTexture(art.emissive, renderer),
    emissive: new THREE.Color('#ffffff'),
    emissiveIntensity,
    roughnessMap: orm,
    metalnessMap: orm,
    roughness: 1,
    metalness: 1,
  });
}

export function createSharedMaterials(renderer) {
  return {
    // emissiveIntensity is animated from 0 to 1 as the deck arrives
    back: foilMaterial(paintBack(), renderer, 0),
    veiled: foilMaterial(paintVeiledFace(), renderer, 0.2),
    edge: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#a8864a'),
      metalness: 0.9,
      roughness: 0.32,
      emissive: new THREE.Color('#2a1d0a'),
    }),
  };
}

/** A unique, full-detail face material for the drawn card. */
export function createFaceMaterial(card, renderer, art = null) {
  const material = foilMaterial(paintFace(card, art), renderer, 0.3);
  for (const t of [material.map, material.emissiveMap, material.roughnessMap]) renderer.initTexture(t);
  return material;
}

export function disposeFaceMaterial(material) {
  material.map.dispose();
  material.emissiveMap.dispose();
  material.roughnessMap.dispose();
  material.dispose();
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
