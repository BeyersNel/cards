import * as THREE from 'three';

/**
 * Pointer + keyboard input. Reports hover over the deck and activation
 * (click/tap on the deck, or Enter/Space while the canvas has focus).
 */
export function createInput(canvas, camera, getTargets, { onActivate, onPointer }) {
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2(10, 10);
  let hovering = false;

  const hitTest = () => {
    const targets = getTargets();
    if (!targets.length) return false;
    raycaster.setFromCamera(ndc, camera);
    return raycaster.intersectObjects(targets, false).length > 0;
  };

  const setNdc = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  };

  canvas.addEventListener('pointermove', (e) => {
    setNdc(e);
    onPointer?.(ndc);
    hovering = hitTest();
    canvas.classList.toggle('is-hovering', hovering);
  });

  canvas.addEventListener('pointerleave', () => {
    ndc.set(10, 10);
    onPointer?.(new THREE.Vector2(0, 0));
    hovering = false;
    canvas.classList.remove('is-hovering');
  });

  canvas.addEventListener('click', (e) => {
    setNdc(e);
    if (hitTest()) onActivate();
  });

  canvas.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate();
    }
  });

  return {
    refresh() {
      hovering = hitTest();
      canvas.classList.toggle('is-hovering', hovering);
    },
  };
}
