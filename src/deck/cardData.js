// Meanings from cards.pdf:
//   Suit  = Angle  — the existential force that shapes the exploration
//   Rank  = Domain — the area of life that the angle acts through
// A card reads as "angle × domain". `synthesis` / `subtitle` are optional
// and can be filled in later (only the PDF's own example is set).

export const SUITS = [
  { key: 'clubs', symbol: '♣', name: 'Clubs', angle: 'death', red: false },
  { key: 'hearts', symbol: '♥', name: 'Hearts', angle: 'loneliness', red: true },
  { key: 'spades', symbol: '♠', name: 'Spades', angle: 'meaning', red: false },
  { key: 'diamonds', symbol: '♦', name: 'Diamonds', angle: 'freedom', red: true },
];

export const RANKS = [
  { key: 'A', name: 'Ace', domain: 'body', icon: 'body' },
  { key: '2', name: 'Two', domain: 'touch', icon: 'hand' },
  { key: '3', name: 'Three', domain: 'authority', icon: 'column' },
  { key: '4', name: 'Four', domain: 'home', icon: 'house' },
  { key: '5', name: 'Five', domain: 'work', icon: 'briefcase' },
  { key: '6', name: 'Six', domain: 'culture', icon: 'masks' },
  { key: '7', name: 'Seven', domain: 'secret', icon: 'keyhole' },
  { key: '8', name: 'Eight', domain: 'pattern', icon: 'grid' },
  { key: '9', name: 'Nine', domain: 'animal', icon: 'tree' },
  { key: '10', name: 'Ten', domain: 'time', icon: 'hourglass' },
  { key: 'J', name: 'Jack', domain: 'childhood', icon: 'child', court: true },
  { key: 'Q', name: 'Queen', domain: 'mother nature', icon: 'earth', court: true },
  { key: 'K', name: 'King', domain: 'father creator', icon: 'crown', court: true },
];

// Optional synthesis words, keyed "<rank><suit symbol>".
const SYNTHESES = {
  'A♣': { synthesis: 'sleep', subtitle: 'the way that the body prepares for death' },
};

export const CARDS = SUITS.flatMap((suit) =>
  RANKS.map((rank) => {
    const id = `${rank.key}${suit.symbol}`;
    return {
      id,
      suit,
      rank,
      label: `${rank.name} of ${suit.name}`,
      reading: `${suit.angle} × ${rank.domain}`,
      ...(SYNTHESES[id] ?? {}),
    };
  }),
);

/** Uniform random card, jokers excluded (there are none in CARDS). */
export function drawRandomCard() {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / CARDS.length) * CARDS.length;
  let n;
  do {
    crypto.getRandomValues(buf);
    n = buf[0];
  } while (n >= limit);
  return CARDS[n % CARDS.length];
}
