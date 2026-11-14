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
      'Each night you practise the last surrender, and each morning you are given back. Your body already knows the way down into the dark and the way home again. Rest without bargaining. Some things only mend while you are not watching.',
    ],
    2: [
      'Decay',
      'the quiet change every touch leaves on both hands',
      'Nothing you touch stays as it was, and nothing that touches you leaves you unchanged. Decay is not a punishment; it is how the world makes room. Let something you have held too long soften and return to the soil.',
    ],
    3: [
      'Execution',
      'a decision made elsewhere, carried out without appeal',
      'A sentence has been passed and will not be reopened. Arguing with it only lengthens the morning on the scaffold. Accept the ending you cannot change, and keep your strength for what comes after it.',
    ],
    4: [
      'Tomb',
      'the house where a family keeps its dead, and its silences',
      'Behind the sealed door lie the ones who made you, name by name. Some of what they carried was handed down to you along with your face. Honour it, then step back into the light and choose what you will pass on.',
    ],
    5: [
      'Slaughter',
      'the work of cutting down, waiting again tomorrow',
      'The scythe rises and falls, and the field is never finished. Some work is hard and unlovely and still has to be done. Do it cleanly, with respect for what you cut, and do not let the repetition harden you.',
    ],
    6: [
      'Martyrdom',
      'a life given up so that a belief can stay standing',
      'Every creed is held up by someone’s sacrifice, and the crowd is always grateful for the one it did not have to make. Ask who is being offered, and whether it should be you. Causes worth dying for are rarer than the causes asking you to.',
    ],
    7: [
      'Murder',
      'something ended in secret, and the weight of keeping it there',
      'Something was ended in the dark and buried where you walk every day. You hear it under the boards when the house goes quiet. A secret like this does not stay down. Better to lift the floor yourself than wait for it to rise.',
    ],
    8: [
      'Entropy',
      'the patient undoing of everything that was ever put in order',
      'Every knot loosens, every wall leans, every bright pattern drifts toward grey. You cannot hold back the unravelling, and you were never meant to. Tend what you love while it holds; that is the whole of the work.',
    ],
    9: [
      'Carrion',
      'what the dead give back to the living who come to feed',
      'Where something has fallen, the crows arrive, and out of the loss new life is fed. It is an unlovely mercy, but it is a mercy. Look at what has died in your life and ask what it might still nourish.',
    ],
    10: [
      'Expiration',
      'the moment the time you were given is spent',
      'The last grains are slipping through the neck of the glass, and whatever you have been putting off is slipping with them. This is not a threat; it is an invitation. Do the thing while the sand is still moving.',
    ],
    J: [
      'Loss of Innocence',
      'the day you learn that what you love will end',
      'There was a day you understood that everything you love will end, and the world went a shade colder. That child is still standing at the edge of the garden, holding a broken thing. Go back for them. Tell them love is not a mistake because it ends.',
    ],
    Q: [
      'Winter',
      'the long cold in which the world lies down as if for good',
      'The world lies white and silent, and every living thing has gone underground to wait. This is a season, not a sentence. Slow down, keep your fire small and steady, and trust that the roots remember spring.',
    ],
    K: [
      'Apocalypse',
      'the end of the world as you have known it',
      'The great design is coming apart at the seams; the stars fall and the old order burns. The word first meant an unveiling, not an ending. When your world ends, look closely at what the collapse lets you see.',
    ],
  },

  // ♠ loneliness
  spades: {
    A: [
      'Illness',
      'the body becoming a place no one else can enter',
      'Your own body has become a locked room, and no one else can come in. Pain makes a hermit of everyone it visits. Speak of it anyway. A voice through the door is still company, and you were not meant to carry this unheard.',
    ],
    2: [
      'Phantom',
      'a warmth remembered so clearly that it makes the room colder',
      'You can still feel the arms that are no longer there, warm for a moment, then gone. Memory gives and takes in the same breath. Honour the ghost of that touch, and leave room for a living one.',
    ],
    3: [
      'Tyranny',
      'the loneliness of being obeyed by everyone and known by no one',
      'You sit high on a throne you built yourself, and everything around it has turned to ash. Control kept you safe, and it kept you alone. Step down from the dais. A crown is cold company.',
    ],
    4: [
      'Asylum',
      'the safe room that slowly becomes the only room',
      'You built these walls to keep the world out, and they have done their work too well. Shelter has become a cell. The door was locked from the inside, and the key has been in your pocket all along.',
    ],
    5: [
      'Obsession',
      'work that keeps you company until it is the only company you keep',
      'One lamp burns through the night over work that has eaten the hours, the meals and the voices that once called your name. The work is real, but so is the hunger in the next room. Lift your head. The world is still there, and so are they.',
    ],
    6: [
      'Exile',
      'living at the edge of a world that has stopped expecting you',
      'You walk the grey edge of the map, far from the lit windows of the town. Whether you were sent away or wandered off, the road is long and cold. Exiles see what citizens cannot. Use the distance, but do not mistake it for home.',
    ],
    7: [
      'Madness',
      'a voice only you can hear, and that you have begun to believe',
      'There is a voice in the dark that speaks only to you, and it has been talking for a long time. Not every whisper deserves belief. Say it aloud, in daylight, to someone you trust. Some voices grow quieter once they are heard.',
    ],
    8: [
      'Echo',
      'calling out and hearing only yourself come back',
      'You call out and your own voice returns, again and again, a little fainter each time. The loop feels like fate, but it is only habit. Break it with a different word, a different door, a different hour. An echo can only repeat what it is given.',
    ],
    9: [
      'Feral',
      'what becomes of a creature left too long without its kind',
      'Left alone too long, something in you has gone wild: wary, hungry, quick to bite. It is not wicked; it is afraid. Approach it gently, the way you would any animal that has forgotten kindness.',
    ],
    10: [
      'Purgatory',
      'waiting so long that you forget what you were waiting for',
      'The clocks have stopped and the room is empty, and you have waited so long you no longer remember what for. No one is coming to open the door. It was never locked. Stand, and walk through it.',
    ],
    J: [
      'Orphan',
      'growing up without the hands that were meant to hold you',
      'A young tree, torn from the grove, tries to take root in thin ground. Something that should have held you did not. You can still be planted. Look for the soil, the people and the places that let you grow.',
    ],
    Q: [
      'Desert',
      'a land that gives you nothing and asks you to keep walking',
      'Nothing for miles but sand and a white sun, and the silence presses against your ears. The desert takes away everything you do not need. What is left when every comfort is gone is what you truly carry. Carry it carefully toward water.',
    ],
    K: [
      'Silence',
      'a prayer that leaves you and does not come back',
      'You have prayed into the vault of heaven and heard nothing but your own breath. The silence is vast, and it is honest. Perhaps the answer was never going to come from above. Listen to what the silence leaves room for.',
    ],
  },

  // ♥ meaning
  hearts: {
    A: [
      'Scar',
      'the place where the body wrote down what happened',
      'Your skin has kept a record of what happened, in a script that will not fade. The mark is both a wound and a map. Read it carefully: it shows what you survived, and where not to walk again.',
    ],
    2: [
      'Covenant',
      'a promise that binds the two of you more tightly than you meant',
      'Two hands, one blade, one cup: a promise made in the dark. Some vows bind tighter than the people who make them. Before you swear, be sure you can bear what it will ask of you both.',
    ],
    3: [
      'Prophecy',
      'knowing how it ends, and having to live the middle anyway',
      'You have seen the ending, and the knowledge sits on your shoulders like a stone. But knowing is not the same as being bound; an oracle’s words can always be read two ways. Look at the vision again before you surrender to it.',
    ],
    4: [
      'Altar',
      'the ordinary place where you keep giving things up',
      'The kitchen table has become an altar, and every day something is laid on it: time, desire, a self you might have been. Ask which god you are feeding, and whether it has earned the offering.',
    ],
    5: [
      'Alchemy',
      'the long, uncertain work of making pain into something worth keeping',
      'In the furnace of the night you are trying to turn your suffering into gold. The work is real, and so is the danger; some burn to ash chasing the stone. Keep the fire steady and the vessel whole. Transformation is slow.',
    ],
    6: [
      'Cult',
      'belonging so complete that doubt becomes a betrayal',
      'The circle chants in perfect unison, and the comfort of belonging is very sweet. Look closely at what it asks of you in return. A truth that cannot bear a single question is not a truth but a chain.',
    ],
    7: [
      'Revelation',
      'the moment you see clearly and cannot go back to not seeing',
      'The veil is torn and the light is blinding; what you believed lies in pieces on the floor. It is hard to see clearly. Do not rush to rebuild the old house. Stand in the ruins a while and learn what was true all along.',
    ],
    8: [
      'Fate',
      'the sense that the story was written before you arrived',
      'Threads run from your wrists up into the dark, and something far above is pulling. You did not choose every move. But a puppet that sees its strings is already half free. Find the one thread you can cut.',
    ],
    9: [
      'Familiar',
      'the voice that keeps you company and is not always on your side',
      'A creature with knowing eyes has settled at your side, and it tells you things you half want to hear. Guidance from the shadows is still guidance, but not all of it serves you. Listen to the familiar; do not let it steer.',
    ],
    10: [
      'Karma',
      'the way what you do comes back, later and with interest',
      'The scales have been tipping for longer than you remember, and now something comes due. You cannot outrun what you have set in motion. You can begin to answer it, one honest act at a time.',
    ],
    J: [
      'Trauma',
      'an early hurt that quietly writes the rest of the story',
      'There is an early wound, a broken thing, a door slammed shut, and it has been writing your story ever since. Find the place where the script began. You are allowed to change it now.',
    ],
    Q: [
      'Venom',
      'the cure nature makes from something that can kill',
      'The serpent’s bite can kill, and in the right measure it can cure. Nature heals by taking, and every remedy has a price. Ask what you are being given, and who is paying for it.',
    ],
    K: [
      'Judgment',
      'the moment a life is weighed and nothing can be hidden',
      'The great scales are raised and your heart is set against a single feather. Every hidden weight will show. Do not fear the measuring; fear only what you refused to look at. There is still time to lighten the load.',
    ],
  },

  // ♦ freedom
  diamonds: {
    A: [
      'Spirit',
      'the self that slips free of the body, and of everything that held it',
      'Something in you has slipped free of the body and drifts weightless above it. Freedom this complete is both rapture and loss. Enjoy the lightness, but remember the warm, mortal house you came from.',
    ],
    2: [
      'Betrayal',
      'the freedom you take by breaking someone’s trust',
      'The last thread between two hearts has been cut, and the blade is still in someone’s hand. Freedom bought this way leaves a wound on both sides. If you held the knife, own it. If you were the one cut, you are free to go.',
    ],
    3: [
      'Anarchy',
      'the moment no one is in charge, for better and for worse',
      'The crown has hit the floor and rolled into the crowd, and no one knows who rules now. It is beautiful, and it is frightening. In the confusion, decide what order you will build, or someone else will decide it for you.',
    ],
    4: [
      'Vagabond',
      'being free to go anywhere, with nowhere to return to',
      'Every bridge behind you is burning and the road ahead has no inn. You are free of every roof and every claim, but freedom without rest wears thin. Somewhere a fire would welcome you, if you would let it.',
    ],
    5: [
      'Ruin',
      'losing everything you worked for, and finding you are lighter',
      'The tower of your ambition has fallen, and you stand among the stones with nothing left to lose. It feels like the end. It is also the lightest you have been in years. Out of the rubble, something truer can be built.',
    ],
    6: [
      'Heresy',
      'the thought you were forbidden to think, finally thought',
      'You have spoken the forbidden word, and the temple doors are closing behind you. They will call it sin. The shackles of the old creed are broken, and the mind that remains is your own. Walk carefully: you are free, and you are unprotected.',
    ],
    7: [
      'Confession',
      'saying the thing aloud, and what it costs to be free of it',
      'The secret pours out of you at last, and it hurts as it leaves, like poison drawn from a wound. What was festering is open to the air, and that is how healing begins. Let it out, and do not take it back.',
    ],
    8: [
      'Chaos',
      'the world in pieces, every piece a different possibility',
      'The great mirror has shattered and every shard shows a different world. Nothing is predictable now. Among the pieces are possibilities you could not see while the glass was whole. Choose a shard and look closely.',
    ],
    9: [
      'Predator',
      'the appetite that takes what it wants and does not look back',
      'Something hungry and unashamed is awake in you, moving silently through the long grass. Instinct is a power, not a sin. But a hunter without restraint ends up alone in an empty forest. Know what you are hunting, and why.',
    ],
    10: [
      'Oblivion',
      'the relief of forgetting, and everything forgetting takes with it',
      'A dark tide rises and washes away memory, consequence and tomorrow. It is sweet to forget, and the black water is calm. But what you erase can no longer guide you. Drink only enough to rest; do not drown.',
    ],
    J: [
      'Runaway',
      'leaving everything familiar before you know where you are going',
      'The child is already running into the dark woods, the lantern of home shrinking behind. Some flights are escapes and some are mistakes, and the forest will not tell you which. Run if you must, but mark the path.',
    ],
    Q: [
      'Wildfire',
      'the fire that destroys a forest so it can begin again',
      'The blaze moves through the old forest, roaring and merciless, and what was overgrown is consumed. It looks like destruction. In the ashes, seeds that waited years will finally split open. Let it burn what must burn.',
    ],
    K: [
      'Deicide',
      'the death of what you once worshipped, and the dark it leaves behind',
      'The old god lies fallen on the temple floor, and the heavens are empty. No one is watching now, no one keeping score, no one coming to rescue you. It is frightening, and it is also the beginning of growing up. Light your own lamp.',
    ],
  },
};
