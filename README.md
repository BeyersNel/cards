# Eldritch Deck

A three.js experiment. A gold-foiled deck of cards drifts out of the fog. Touch it, and the cards flow, riffle and restack. One card is drawn, the deck sinks back into the dark, and the card turns to show an engraved, tarot-style painting with its reading.

Each card reads as **angle × domain = title** (from `cards.pdf`), for example death × body = **Sleep**.

| Suit (angle) | | Rank (domain) | |
| --- | --- | --- | --- |
| ♣ | death | A · 2 · 3 · 4 · 5 | body · touch · authority · home · work |
| ♠ | loneliness | 6 · 7 · 8 · 9 · 10 | culture · secret · pattern · animal · time |
| ♥ | meaning | J · Q · K | childhood · mother nature · father creator |
| ♦ | freedom | | |

**Live:** [https://beyersnel.github.io/cards/](https://beyersnel.github.io/cards/)

Pushes to `main` build with Vite and deploy to GitHub Pages via Actions (`.github/workflows/deploy-pages.yml`).

## Run

```bash
npm install
npm run dev
```

## Handy URL flags

| Flag | Effect |
| --- | --- |
| `?sheet` | Contact sheet of the back + all 52 framed fronts |
| `?card=12` | Force a specific card (index 0–51; clubs, spades, hearts, diamonds × A–K) |
| `?fast` | Play every animation 4× faster |
| `?lite` | Low-quality path (no bloom, fewer motes) |
| `?step` | Freeze time; advance with `window.__advance(seconds)` (for headless capture) |

## Where things live

- `src/deck/readings.js`: the title, gloss and tarot passage for every card.
- `src/deck/cardData.js`: suits, ranks and the 52 cards built from them.
- `public/cards/<suit>-<rank>.webp`: the painted fronts. `src/deck/textures/face.js` loads the drawn card's painting and frames it (index tabs, title band) via `textures/plates/engraving.js`.
- `src/deck/textures/back.js`: the gold-foil back, drawn in code (`ornament.js` holds the foil pipeline).
- `src/anim/timeline.js`: GSAP timelines for arrive, shuffle, draw, exit, reveal and dismiss.
- `src/scene/`: fog, haze, motes, the occult floor circle, lighting, bloom/grain post.

## The paintings

The fronts were generated with Kling (`kling-image-v3_0_omni`, 2k, 3:4). Each card's brief is in `art/prompts.json`: a shared style, a palette per suit and a scene per card.

```bash
python3 -I tools/prompt.py hearts-K    # print the full prompt for one card
python3 -I tools/crop-art.py in.png public/cards/hearts-K.webp   # trim and save a result
```

A card without a painting falls back to the gold-foil front.
