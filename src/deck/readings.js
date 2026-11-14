// The 52 readings. Each card is angle × domain = title, in the spirit of
// "death × body = sleep" from cards.pdf. Every entry is
//   [title, gloss, prose]
// title — the combined meaning, shown on the card's plaque
// gloss — a one-line definition, like the PDF's "the way that the body prepares for death"
// prose — what the card says to the person who drew it

export const READINGS = {
  // ♣ death
  clubs: {
    A: [
      'Sleep',
      'the way that the body prepares for death',
      'Every night you practise the last surrender, and every morning you are handed back. Some part of you already knows how to let go. Rest now. The dark has only ever borrowed you.',
    ],
    2: [
      'Farewell',
      'the last time a hand is held',
      'There is a hand you will hold for the last time, and you will not be told which time it is. Hold the next one as though you knew.',
    ],
    3: [
      'Sentence',
      'the one verdict no court can overturn',
      'It was passed on you before you were named, and no appeal has ever been heard. The judgment is already in. What remains to be decided is how you will spend the stay of execution.',
    ],
    4: [
      'Haunting',
      'what stays in a house when the living leave',
      'The rooms remember. A step on the stair, a chair still turned toward a conversation that ended years ago. You are not being followed. You are being asked to finish something.',
    ],
    5: [
      'Legacy',
      'the work that outlasts the hand',
      'Your hands will stop, and the thing they made will go on without you. Look at what you are building. Would you trust it to speak for you when you cannot?',
    ],
    6: [
      'Elegy',
      'the song the living make of their dead',
      'Every people keeps its dead in songs, in recipes, in the names given to children. Someone is waiting to be sung. If you do not carry them, who will?',
    ],
    7: [
      'Crypt',
      'what is carried to the grave',
      'Something was buried with great care, and you know where. The dead keep their secrets easily; the living have to choose. Decide whether this one sleeps with you or is spoken while there is breath.',
    ],
    8: [
      'Entropy',
      'the pattern beneath every pattern',
      'Everything you have put in order is quietly coming apart: the house, the plan, the stars. No one is punishing you. Tend what you love anyway. That is the whole of the work.',
    ],
    9: [
      'Prey',
      'the oldest fear, the one with teeth',
      'Long before you had words, something watched you from the tall grass, and your blood has not forgotten. The fear is ancient and it is sometimes right. Learn which shadows are only shadows.',
    ],
    10: [
      'Dusk',
      'the hour that knows it is ending',
      'The light is going, and it is most beautiful as it goes. You have less time than you assume and more than you fear. Do the thing you have been saving for later.',
    ],
    J: [
      'Outgrown',
      'the child you were, who did not survive you',
      'There was a child who answered to your name, and nobody held a funeral. You still carry their small belongings: a fear of the dark, a love of rain. Visit them. They wonder what became of you.',
    ],
    Q: [
      'Winter',
      'the dying that the earth survives',
      'The field lies stripped and silent, and under it nothing is idle. What looks like an ending is the ground keeping its promise. Let fall what must fall. The root knows its business.',
    ],
    K: [
      'Apocalypse',
      'the maker, unmaking',
      'What was made can be unmade, and the hand that lit the stars may yet close over them. The old word means only an unveiling. When your world ends, look closely at what is revealed.',
    ],
  },

  // ♥ loneliness
  hearts: {
    A: [
      'Ache',
      'the way the body says it is alone',
      'It sits under the ribs and has no wound to show for itself. Your body is telling you a plain truth: it was made to be near others. Do not argue with it. Answer it.',
    ],
    2: [
      'Longing',
      'the hand that reaches and closes on air',
      'Your skin keeps a memory of every hand that ever steadied you, and it is asking after them. There is no weakness in wanting this. Somewhere, someone is reaching into the same dark.',
    ],
    3: [
      'Exile',
      'the gate that closes behind you',
      'You were sent away, or you learned that the rules were never written with you in mind. Outside the walls it is cold, and you can see the whole city at once. No one inside will ever have that view.',
    ],
    4: [
      'Homesick',
      'longing for a place that may no longer exist',
      'You ache for a kitchen light, a particular creak of the floor. The house may be sold and the people scattered, and still it calls. What you miss is who you were allowed to be there.',
    ],
    5: [
      'Lighthouse',
      'the solitary work of keeping a light for others',
      'You keep your lamp turning through the night for ships that will never learn your name. No one thanks the keeper; they simply do not drown. Your work matters most in the hours it goes unseen.',
    ],
    6: [
      'Outsider',
      'the stranger at every feast',
      'You stand at the window of a lit room where everyone knows the words to the song. You were not made wrong. You were made elsewhere. From the edge you see what the dancers cannot.',
    ],
    7: [
      'Shame',
      'the secret that keeps you apart',
      'You built a locked room inside yourself and have stood guard so long you forgot you are also its prisoner. The thing in there is smaller than the door. Let one person see it.',
    ],
    8: [
      'Orbit',
      'circling what you cannot touch',
      'Round and round the same warm centre, never closer, never free. You call it loyalty, or habit, or fate. A moon does not choose its path. You are not a moon.',
    ],
    9: [
      'Howl',
      'the call sent out with no promise of an answer',
      'Something in you lifts its head at night and cries toward the hills. It does not want rescuing. It wants to know who else is out there. Listen. The answer is already on the wind.',
    ],
    10: [
      'Small Hours',
      'the time when only you are awake',
      'The clock says three and the whole world has gone on without you. In these hours every thought grows teeth. Remember that none of them will look the same at dawn.',
    ],
    J: [
      'Imaginary Friend',
      'the company a lonely child invents',
      'Once you made a companion out of nothing because you needed one, and it worked. That power did not leave when the friend did. You have always known how to keep yourself company.',
    ],
    Q: [
      'Wilderness',
      'the place that does not need you',
      'The mountain does not know your name and the sea will not miss you. Stand in that for a moment. It is terrible, and then it is restful: nothing here is asking you to be anything.',
    ],
    K: [
      'Forsaken',
      'the prayer that is met with silence',
      'You called up into the dark and nothing called back. Consider that the maker may have made the world for the same reason you are calling: it could not bear to be alone.',
    ],
  },

  // ♠ meaning
  spades: {
    A: [
      'Scar',
      'the story the body keeps',
      'Your skin has written down what happened, in a script that does not fade. Do not hide the page. It is the proof that you were hurt, and the proof that you healed.',
    ],
    2: [
      'Embrace',
      'what touch says that words cannot',
      'There are things too large for the mouth, and so we were given arms. Someone near you needs to be told something that has no sentence. You already know the grammar.',
    ],
    3: [
      'Creed',
      'the meaning you were handed before you could ask',
      'They gave you the answers first, bound and gilded, and only later did the questions arrive. Read it again as a stranger would. Keep what holds your weight and put the rest down gently.',
    ],
    4: [
      'Hearth',
      'the fire a life gathers round',
      'A home is a fire and the faces turned toward it. You are being asked what you gather around, and who you make room for in its light. Feed it. It goes out quietly.',
    ],
    5: [
      'Calling',
      'the work that knows your name',
      'Beneath the work you do for bread there is a work that has been waiting for you, patient as a seed. You have heard it call. The only mystery left is how long you will pretend you did not.',
    ],
    6: [
      'Myth',
      'the story a people tells to explain itself',
      'You are living inside a tale far older than you: the hero, the flood, the debt that must be paid. Learn which story has you in it. Only then can you change the ending.',
    ],
    7: [
      'Arcanum',
      'the truth that hides in order to be found',
      'Some knowledge cannot be handed over. It has to be earned in the dark, alone. The veil in front of you is an invitation with a price. Decide whether you will pay it.',
    ],
    8: [
      'Synchronicity',
      'when the world seems to rhyme',
      'The same number, the same stranger, the same bird at the window: three times now. Call it chance or call it a message. Either way you noticed. What were you thinking of when it came?',
    ],
    9: [
      'Omen',
      'the meaning read in the flight of birds',
      'The creatures have always known before we did: the dog at the door, the crows leaving the field. Something wordless in you is reading the signs. Trust the animal that knows the weather.',
    ],
    10: [
      'Memory',
      'how time is made to mean',
      'The past is the house you live in, and you rearrange its furniture every time you remember. Be a kind curator. You are the only one who holds these rooms.',
    ],
    J: [
      'Wonder',
      'the first question, asked of everything',
      'Once the whole world was a letter addressed to you, and you turned over every stone to read it. That child is quiet now, and still here. Ask why again, and mean it.',
    ],
    Q: [
      'Awe',
      'meaning too large to hold',
      'Under the weight of stars, at the lip of the sea, you were made small and it felt like relief. You do not have to understand it to belong to it. Stand there a while longer.',
    ],
    K: [
      'Design',
      'the suspicion that you were intended',
      'Look at your hands, so exactly suited to their work. Perhaps you were meant. If no one meant you, the task is the same and stranger: you must be both the maker and the made.',
    ],
  },

  // ♦ freedom
  diamonds: {
    A: [
      'Dance',
      'the body with nowhere it has to be',
      'Before it was put to work, your body knew how to move for no reason at all. That knowledge is still in the hips and the heels. Let it out. No one is keeping score.',
    ],
    2: [
      'Release',
      'the hand that opens',
      'You have held on so long that your fingers have forgotten they can open. What you are gripping is gripping you. Let it go, and see which of you is freed.',
    ],
    3: [
      'Rebellion',
      'the no that makes you',
      'A voice above you says this is how it has always been. A voice within you says no. The second is quieter, and it is the one that belongs to you. You may say it aloud.',
    ],
    4: [
      'Threshold',
      'the door you are free to walk out of',
      'You are standing in a doorway with the warm room behind you and the road ahead. No one is holding you. Staying is also a choice. Whichever you choose, choose it knowing the door was open.',
    ],
    5: [
      'Sabbath',
      'the day the work does not own',
      'You were not born to be useful. Put down the tools; the world will hold without you until morning. Rest is your right, as it is the field’s, whether or not the work is finished.',
    ],
    6: [
      'Carnival',
      'the night the rules wear masks',
      'For one night the king plays the fool and the fool is crowned, and everyone learns that the order of things is a costume. Put on a face that is not yours. See what truth it lets you tell.',
    ],
    7: [
      'Confession',
      'the lightness of having nothing left to hide',
      'A secret is a stone carried in the mouth. You have grown so used to its weight that you no longer notice how carefully you speak. Set it down before someone you trust, and feel your tongue come free.',
    ],
    8: [
      'Chance',
      'the break in the pattern',
      'The die is in the air, and for one instant every face is true. Not everything is written. There is a gap in the weave, exactly your size. Step through it.',
    ],
    9: [
      'Feral',
      'what you were before the leash',
      'Under the manners and the appointments, something still runs on four legs through wet grass. It has never agreed to any of this. Unclip the collar for an hour. It will remember the way home.',
    ],
    10: [
      'Now',
      'the only time you are free in',
      'Yesterday is finished and tomorrow is a rumour. Between them is one bright, narrow room, and you are standing in it. Everything you will ever do, you will do here.',
    ],
    J: [
      'Play',
      'freedom before it had a name',
      'Remember an afternoon with no purpose, when a stick was a sword and the whole garden was the sea. Nothing was achieved and nothing was wasted. You are still allowed. No one ever took the permission back.',
    ],
    Q: [
      'Wind',
      'what cannot be held',
      'It comes from nowhere you can point to and leaves without asking. It has thrown down forests and carried seeds over oceans. Something in your life wants to move like this. Open a window.',
    ],
    K: [
      'Free Will',
      'the gift the maker could not take back',
      'You were given the one power that could be turned against the giver: the power to choose otherwise. It is a terrible gift and it is entirely yours. Whatever you do next, you are its author.',
    ],
  },
};
