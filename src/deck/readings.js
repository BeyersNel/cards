// The 52 readings. Each card is angle × domain = title, in the spirit of
// "death × body = sleep" from cards.pdf. Every entry is
//   [title, gloss, prose]
// title — the combined meaning, shown on the card's title band
// gloss — a one-line definition
// prose — what the card says to the person who drew it

export const READINGS = {
  // ♣ death
  clubs: {
    A: [
      'Sleep',
      'the way that the body prepares for death',
      'Every night you rehearse the last surrender, and every morning you are handed back. Your body already knows the way into the dark and the way out again. Let go a little, and trust the waking.',
    ],
    2: [
      'Decay',
      'the inevitable rot that lingers on the fingertips after making contact with the living',
      'Nothing you touch stays as it was, and nothing that touches you leaves you unchanged. The rot is not a punishment; it is how the world makes room. Let something you have held too long soften and fall away.',
    ],
    3: [
      'Execution',
      'the final, inescapable decree from a power that hears no appeals',
      'A sentence has been passed, and it will not be revisited. Arguing with it only lengthens the wait on the scaffold. Accept the verdict on what must end, and spend your strength on what comes after.',
    ],
    4: [
      'Tomb',
      'the permanent, lightless residence where ancestral bloodlines ultimately turn to dust',
      'Behind the sealed door lie the ones who made you, name by name. Their house is quiet now, and part of you lives there too. Honour what you inherited, then step back into the light and choose what you will leave behind.',
    ],
    5: [
      'Slaughter',
      'the grim, repetitive labor of harvesting souls to feed the ravenous earth',
      'The scythe rises and falls, and the field is never finished. Some work is endless and joyless and still must be done. Do it cleanly, with respect for what is cut, and do not let it harden your heart.',
    ],
    6: [
      'Martyrdom',
      'the fatal sacrifice required to water the deepest roots of societal dogma',
      'Every faith is watered by someone’s sacrifice, and the crowd is always grateful for the one it did not make. Ask who is being offered up, and whether it should be you. A cause worth dying for is rarer than the causes demanding it.',
    ],
    7: [
      'Murder',
      'the buried, unspoken truth that festers beneath the floorboards of the mind',
      'Something was killed in the dark and buried where you walk every day. You hear it under the boards when the house is quiet. The truth will not stay down; better to lift the floor yourself than wait for it to rise.',
    ],
    8: [
      'Entropy',
      'the slow, agonizing unraveling of all constructed order into absolute stillness',
      'Every knot loosens, every wall leans, every bright pattern fades toward grey. You cannot hold back the unravelling, and you were never meant to. Tend what you love while it holds, and make peace with the stillness at the end.',
    ],
    9: [
      'Carrion',
      'the grotesque feast where the flesh of the fallen sustains the scavengers of the dark',
      'Where something has fallen, the crows gather, and from the ruin new life is fed. It is an ugly mercy, but a mercy all the same. Look at what has died in your life and ask what it might yet nourish.',
    ],
    10: [
      'Expiration',
      'the final grain of sand slipping through an hourglass swallowed by the void',
      'The last grains are slipping through the neck of the glass, and whatever you are putting off is running out with them. This is not a threat but a summons. Act while the sand still falls.',
    ],
    J: [
      'Loss of Innocence',
      'the chilling first realization that everything you love will one day cease to exist',
      'There was a day you learned that everything you love will end, and the world went a shade colder. That child still stands at the edge of the garden, holding a broken thing. Go back to them, and tell them love is not a mistake because it ends.',
    ],
    Q: [
      'Winter',
      'the suffocating cold breath that puts the vibrant world into a deep, frozen grave',
      'The world lies white and silent under a frozen breath, and every living thing has gone underground to wait. This is a season, not a sentence. Slow down, guard your warmth, and trust that the roots remember spring.',
    ],
    K: [
      'Apocalypse',
      'the complete unmaking and total collapse of the grand cosmic design',
      'The great design is coming apart at its seams; the stars fall and the old order burns. The word once meant only an unveiling. When your world ends, look closely at what the collapse reveals.',
    ],
  },

  // ♠ loneliness
  spades: {
    A: [
      'Illness',
      'the terrifying isolation of being trapped in flesh that has turned against you',
      'Your own flesh has become a locked room, and no one else can enter. Pain makes a hermit of everyone it visits. Speak of it anyway; a voice through the door is still company.',
    ],
    2: [
      'Phantom',
      'the haunting memory of physical warmth that only serves to chill the bone',
      'You still feel the hand that is no longer there, warm for a moment, then gone. Memory gives and takes in the same breath. Honour the ghost of that touch, then let a living hand find yours.',
    ],
    3: [
      'Tyranny',
      'the suffocating isolation of sitting on a throne to rule a kingdom of ash',
      'You sit high on a throne of your own making, and everything around you has turned to ash. Control kept you safe and left you alone. Step down from the dais. No crown is worth a kingdom without a single friend.',
    ],
    4: [
      'Asylum',
      'the padded walls and locked doors built to keep the frightening world at bay',
      'You built these walls to keep the world out, and they have done their work too well. Safety has become a cell. The door was locked from the inside, and the key is in your pocket.',
    ],
    5: [
      'Obsession',
      'the endless, solitary toil in the dark that estranges the mind from the heart',
      'One lamp burns through the night over work that has eaten the hours, the meals and the people who once called your name. The work is real, but so is the hunger in the next room. Lift your head. The world is still there.',
    ],
    6: [
      'Exile',
      'the cursed outcast forced to wander the desolate fringes of society forever',
      'You walk the grey edge of the map, far from the lit windows of the town. Whether you were cast out or wandered off, the road is long and cold. Exiles see what citizens cannot. Use the distance, but do not mistake it for home.',
    ],
    7: [
      'Madness',
      'the quiet, whispering voice in the dark that belongs to no one but you',
      'There is a voice in the dark that answers only to you, and it has been talking for a long time. Not every whisper deserves belief. Say it aloud in daylight to someone you trust. Some voices grow quiet once they are heard.',
    ],
    8: [
      'Echo',
      'the maddening, repeating loop of a solitary existence calling out to nothing',
      'You call out and your own voice comes back, again and again, a little fainter each time. The loop feels like fate. Break it with a different word, a different door, a different hour. Echoes only repeat what we give them.',
    ],
    9: [
      'Feral',
      'the cornered, unpredictable beast that has been permanently abandoned by its pack',
      'Left alone too long, something in you has gone wild: wary, hungry, quick to bite. It is not wicked; it is frightened. Approach it gently, as you would any creature that has forgotten kindness.',
    ],
    10: [
      'Purgatory',
      'the eternal, agonizing wait in an empty room where the clocks have stopped',
      'The clocks have stopped and the room is empty, and you have waited so long you have forgotten what for. Nobody is coming to open the door. Rise, and walk through it yourself.',
    ],
    J: [
      'Orphan',
      'the violent severance of roots, leaving a sapling to wither in barren soil',
      'A young tree, torn from the grove, tries to root in barren ground. Something that should have held you did not. You can still be planted. Seek out the soil, the people and the place that let you grow.',
    ],
    Q: [
      'Desert',
      'the vast, unforgiving expanse of nothingness that parches the soul',
      'Nothing for miles but sand and a white sun, and the silence presses on your ears. The desert strips away everything you do not need. What remains when every comfort is gone is your true provision. Carry it carefully toward water.',
    ],
    K: [
      'Silence',
      'the deafening, unanswered prayer echoing outward into a hollow universe',
      'You have prayed into the vault of heaven and heard nothing back but your own breath. The silence is vast, and it is honest. Perhaps the answer was never going to come from above. Listen to what the silence leaves room for.',
    ],
  },

  // ♥ meaning
  hearts: {
    A: [
      'Scar',
      'the permanent, physical record of pain etched directly into the skin as a warning',
      'Your skin has kept the record of what happened, in a script that will not fade. The mark is both a wound and a warning. Read it carefully: it maps what you survived, and where not to walk again.',
    ],
    2: [
      'Covenant',
      'the dark blood pact sealed in secret between two desperate, doomed souls',
      'Two hands, one blade, one cup: a promise sealed in the dark. Such vows bind tighter than the people who make them. Before you swear, be sure you can bear what it will cost you both.',
    ],
    3: [
      'Prophecy',
      'the crushing, inescapable burden of knowing how the tragic end will unfold',
      'You have seen the ending, and the knowledge sits on your shoulders like a stone. Knowing is not the same as being bound; even an oracle’s words can be read two ways. Look again at the vision before you surrender to it.',
    ],
    4: [
      'Altar',
      'the domestic hearth transformed into a place where heavy sacrifices are made to the unseen',
      'The kitchen table has become an altar, and every day something is laid upon it: time, desire, a self you might have been. Ask which god you are feeding, and whether it has earned the offering.',
    ],
    5: [
      'Alchemy',
      'the obsessive, dangerous pursuit of transmuting profound suffering into spiritual gold',
      'In the furnace of the night you are trying to turn your suffering into gold. The work is real and so is the danger; some burn to ash chasing the stone. Keep the fire steady and the vessel whole. Transmutation is slow.',
    ],
    6: [
      'Cult',
      'the collective delusion of a society bound together by forbidden, terrifying rites',
      'The circle chants in perfect unison, and the comfort of belonging is very sweet. Look closely at what is asked of you in return. A truth that cannot bear a single question is not a truth but a chain.',
    ],
    7: [
      'Revelation',
      'the sudden, terrible truth that shatters the fragile architecture of the mind',
      'The veil is torn and the light is blinding; what you believed lies in pieces on the floor. It is terrible to see clearly. Do not rush to rebuild the old house. Stand in the ruins a while and learn what was true all along.',
    ],
    8: [
      'Fate',
      'the invisible, bloody strings orchestrating every tragedy from the shadows',
      'Unseen threads run from your wrists up into the dark, and something far above is pulling. You did not choose every move. But a puppet that sees its strings is already half free. Find the thread you can cut.',
    ],
    9: [
      'Familiar',
      'the bound, unnatural spirit whispering twisted guidance from the darkest corners',
      'A creature with knowing eyes has settled at your side, and it whispers things you half want to hear. Guidance from the shadows is still guidance, but not every counsel serves you. Listen to the familiar; do not let it steer.',
    ],
    10: [
      'Karma',
      'the inescapable, compounding debt collected ruthlessly across multiple lifetimes',
      'The scales have been tipping for longer than this life, and now the debt comes due. You cannot outrun what you have set in motion. You can only begin to repay it, one honest act at a time.',
    ],
    J: [
      'Trauma',
      'the defining, early wound that scripts all the tragedies of the future',
      'There is an early wound, a broken thing, a door slammed shut, and it has been writing your story ever since. Find the place where the script began. You are allowed to edit it now.',
    ],
    Q: [
      'Venom',
      'the natural, earthly cure that demands the life of the weak to heal the strong',
      'The serpent’s bite can kill, and in the right measure it can cure. Nature heals by taking, and every remedy has a price. Ask what you are being given, and what it will cost someone else.',
    ],
    K: [
      'Judgment',
      'the terrifying final reckoning where the true weight of a blackened soul is measured',
      'The great scales are raised and your heart is set against a single feather. Every hidden weight will tell. Do not fear the measuring; fear only what you refused to look at. There is still time to lighten the load.',
    ],
  },

  // ♦ freedom
  diamonds: {
    A: [
      'Spirit',
      'the ghostly, untethered form permanently severed from the heavy mortal coil',
      'Something in you has slipped free of the heavy body and drifts weightless above it. Freedom this complete is both rapture and loss. Enjoy the lightness, but remember the warm, mortal house you came from.',
    ],
    2: [
      'Betrayal',
      'the violent severing of the very last string that binds you to another human heart',
      'The last thread between two hearts has been cut, and the blade is still in someone’s hand. Freedom bought this way leaves a wound on both sides. If you held the knife, own it. If you were cut, you are free to go.',
    ],
    3: [
      'Anarchy',
      'the beautiful, terrifying chaos unleashed when the final crown hits the floor',
      'The crown has hit the floor and rolled into the crowd, and no one knows who rules now. It is beautiful and it is terrifying. In the chaos, decide what order you will build, or someone else will decide for you.',
    ],
    4: [
      'Vagabond',
      'the cursed, restless wanderer who has burned every bridge and has no place to sleep',
      'Every bridge behind you is burning and the road ahead has no inn. You are free of every roof and every claim, but freedom without rest wears thin. Somewhere a fire would welcome you, if you would let it.',
    ],
    5: [
      'Ruin',
      'the total collapse of worldly ambition into a pure, liberating state of absolute nothingness',
      'The tower of your ambition has fallen, and you stand among the stones with nothing left to lose. It feels like the end. It is also the lightest you have ever been. From nothing, anything may be built.',
    ],
    6: [
      'Heresy',
      'the unforgivable, excommunicating sin that finally liberates the shackled mind',
      'You have spoken the forbidden word, and the temple doors are closing behind you. They will call it sin. The shackles of the old creed are broken, and the mind that remains is yours alone. Walk carefully: you are free, and you are unprotected.',
    ],
    7: [
      'Confession',
      'the excruciating bleeding out of deeply held sins to cleanse a rotting core',
      'The secret pours out of you at last, and it hurts as it leaves, like poison drawn from a wound. What was rotting at the core is open to the air, and this is how healing begins. Let it all out, and do not take it back.',
    ],
    8: [
      'Chaos',
      'the shattering of the universal mirror into a million unpredictable, jagged shards',
      'The great mirror has shattered and every shard shows a different world. Nothing is predictable now. Among the pieces are a thousand possibilities you could not see while the glass was whole. Choose a shard and look closely.',
    ],
    9: [
      'Predator',
      'the unbridled, visceral instinct to hunt and consume without a shred of remorse',
      'Something hungry and unashamed is awake in you, moving silently through the long grass. Instinct is a power, not a sin. But a hunter without restraint ends up alone in an empty forest. Know what you are hunting, and why.',
    ],
    10: [
      'Oblivion',
      'the sweet, dark erasure of all memory, consequence, and tomorrow',
      'A dark tide rises and washes away memory, consequence and tomorrow. It is sweet to forget, and the black water is calm. But what you erase cannot guide you. Drink only enough to rest; do not drown.',
    ],
    J: [
      'Runaway',
      'the blind flight into the pitch-black woods, abandoning all safety to never return',
      'The child is already running into the black woods, the lantern of home shrinking behind. Some flights are escapes and some are mistakes, and the forest will not tell you which. Run if you must, but mark the path.',
    ],
    Q: [
      'Wildfire',
      'the untamed, consuming blaze that ruthlessly purges the overgrown forest',
      'The blaze moves through the old forest, roaring and merciless, and what was overgrown is consumed. It looks like destruction. In the ashes, seeds that waited years will finally crack open. Let it burn what must burn.',
    ],
    K: [
      'Deicide',
      'the death of the old gods that leaves mortals to navigate the terrifying dark entirely alone',
      'The old god lies fallen on the temple floor, and the heavens are empty. No one is watching now, no one keeping score, no one coming to save you. It is terrifying, and it is the beginning of growing up. Light your own lamp.',
    ],
  },
};
