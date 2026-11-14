// One card per 12 hours. The drawn card and the time it was drawn are kept
// in this browser's localStorage; until the window has passed, a reload
// shows that card again instead of the deck.
//
// Storage can be missing or throw (private windows, blocked site data), so
// every access is guarded. Without storage the page simply never locks.

const KEY = 'eldritch-deck:last-draw';
export const DRAW_WINDOW_MS = 12 * 60 * 60 * 1000;

/** The current draw ({ id, at }) if one was made in the last 12 hours, else null. */
export function loadDraw(now = Date.now()) {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    if (!v || typeof v.id !== 'string' || typeof v.at !== 'number') return null;
    // a time in the future means the clock was changed: ignore it
    if (v.at > now + 60_000) return null;
    return now - v.at < DRAW_WINDOW_MS ? v : null;
  } catch {
    return null;
  }
}

export function saveDraw(id, now = Date.now()) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ id, at: now }));
  } catch {
    /* storage unavailable: no lock */
  }
}

export function clearDraw() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}

/** Milliseconds until a new draw is allowed (0 if allowed now). */
export function msUntilNextDraw(draw, now = Date.now()) {
  return draw ? Math.max(0, draw.at + DRAW_WINDOW_MS - now) : 0;
}

/** "11h 42m", "42m" or "a moment" */
export function formatWait(ms) {
  const minutes = Math.ceil(ms / 60_000);
  if (minutes <= 1) return 'a moment';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
}
