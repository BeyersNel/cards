# Eldritch Deck

A three.js experiment. A richly decorated, Lovecraftian deck of cards drifts out of the fog. Touch it, and the cards flow, riffle and restack. One card is drawn, the deck sinks back into the dark, and the card turns to show its face.

Each card reads as **angle × domain** (from `cards.pdf`):

| Suit (angle) | | Rank (domain) | |
| --- | --- | --- | --- |
| ♣ | death | A · 2 · 3 · 4 · 5 | body · touch · authority · home · work |
| ♥ | loneliness | 6 · 7 · 8 · 9 · 10 | culture · secret · pattern · animal · time |
| ♠ | meaning | J · Q · K | childhood · mother nature · father creator |
| ♦ | freedom | | |

All artwork (back, 52 faces, suit glyphs, domain icons) is painted procedurally with Canvas 2D at runtime. There are no image assets.

## Run

```bash
npm install
npm run dev
```

## Handy URL flags

| Flag | Effect |
| --- | --- |
| `?sheet` | Contact sheet of the back + all 52 faces |
| `?card=12` | Force a specific card (index 0–51; clubs, hearts, spades, diamonds × A–K) |
| `?fast` | Play every animation 4× faster |
| `?lite` | Low-quality path (no bloom, fewer motes) |

## Where things live

- `src/deck/cardData.js`: the 52 cards. Add `synthesis` / `subtitle` here (the Ace of Clubs already has "sleep").
- `src/deck/textures/`: procedural painters for the back, faces, glyphs and ornaments.
- `src/anim/timeline.js`: GSAP timelines for arrive, shuffle, draw, exit, reveal and dismiss.
- `src/scene/`: fog, haze, motes, the occult floor circle, lighting, bloom/grain post.
