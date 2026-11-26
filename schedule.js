// EDIT ONGOING ACTIVITIES HERE
const ongoingActivities = [
    { icon: "🎮", name: "Freeplay Gaming", desc: "Smash Bros, Mario Kart, SF6, Tekken" },
    { icon: "🃏", name: "Cartes Pokémon 3D", desc: "Atelier Créatif avec JakssDio" },
    { icon: "🧶", name: "Atelier Crochet", desc: "Créations CandiCrochettes" },
    { icon: "📦", name: "Fil Rouge : Boîte Mystère", desc: "Devine ce qu'il y a dans la boîte !" }
];

// PRE-LOAD A SPECIAL ANNOUNCEMENT (Or leave empty "")
const defaultAnnouncement = "BIENVENUE SUR LE STAND ASSOMULTIPLAYER — INSCRIVEZ-VOUS AUX QUIZZ VIA LE QR CODE !";

// OPTIONAL DEFAULT LOGOS BY HOST NAME (Used automatically if event.logo is empty)
const defaultHostLogos = {
    "JakssDio": "logos/JakssDio.jpg",
    "PA": "logos/pokemon.svg",
    "John": "logos/mysterybox.svg",
    "Samir": "logos/quiz_stage.svg"
};

// EDIT MAIN SCHEDULE HERE (TGS 2026)
const events = [
    // SAMEDI
    {id: 1, day: 'Saturday', startTime: '10:00', endTime: '10:30', event: "Unboxing Cartes Pokémon 🃏", hosts: "PA & JakssDio", logo: "logos/pokemon.svg", registrable: false},
    {id: 2, day: 'Saturday', startTime: '10:30', endTime: '11:30', event: "Animation Charles ✨", hosts: "Charles", logo: null, registrable: false},
    {id: 3, day: 'Saturday', startTime: '11:30', endTime: '12:30', event: "Animation & Quizz Pokémon ⚡", hosts: "PA", logo: "logos/pokemon.svg", registrable: true},
    {id: 4, day: 'Saturday', startTime: '12:30', endTime: '13:30', event: "Pause Déj 🍔", hosts: null, logo: null, registrable: false},
    {id: 5, day: 'Saturday', startTime: '13:30', endTime: '14:00', event: "Défilé & Animation Lolita 🎀", hosts: null, logo: "logos/lolita.svg", registrable: false},
    {id: 6, day: 'Saturday', startTime: '14:00', endTime: '15:00', event: "CÉLÉFIAKAKI - Quizz à Ki ? 🤔", hosts: "Samir", logo: "logos/quiz_stage.svg", registrable: true},
    {id: 7, day: 'Saturday', startTime: '15:00', endTime: '16:00', event: "Grand Tournoi Bataille de Pouces 👍", hosts: "John", logo: "logos/quiz_stage.svg", registrable: true},
    {id: 8, day: 'Saturday', startTime: '16:00', endTime: '17:00', event: "Quizz Zelda 🗡️🛡️", hosts: "Samir", logo: "logos/zelda.svg", registrable: true},
    {id: 9, day: 'Saturday', startTime: '17:00', endTime: '18:00', event: "Croisée Pop Culture 🎬🎮", hosts: "PA", logo: "logos/popculture.svg", registrable: false},

    // DIMANCHE
    {id: 10, day: 'Sunday', startTime: '10:00', endTime: '11:00', event: "Unboxing Cartes Pokémon 🃏", hosts: "PA & JakssDio", logo: "logos/pokemon.svg", registrable: false},
    {id: 11, day: 'Sunday', startTime: '11:00', endTime: '12:00', event: "Quizz Inversé / Harry Potter 🪄👂", hosts: "Samir & John", logo: "logos/quiz_stage.svg", registrable: true},
    {id: 12, day: 'Sunday', startTime: '12:00', endTime: '13:30', event: "Pause Déj 🍔", hosts: null, logo: null, registrable: false},
    {id: 13, day: 'Sunday', startTime: '13:30', endTime: '14:00', event: "Animation Lolita 🎀", hosts: null, logo: "logos/lolita.svg", registrable: false},
    {id: 14, day: 'Sunday', startTime: '14:00', endTime: '15:00', event: "CÉLÉFIAKAKI 🔥", hosts: "Samir", logo: "logos/quiz_stage.svg", registrable: true},
    {id: 15, day: 'Sunday', startTime: '15:00', endTime: '16:00', event: "Devine ce qui est dans la Boîte 📦 (+ Fil Rouge)", hosts: "John", logo: "logos/mysterybox.svg", registrable: true},
    {id: 16, day: 'Sunday', startTime: '16:00', endTime: '17:00', event: "Quizz Mario & Shrek 🍄🧅", hosts: "Samir & John", logo: "logos/mario_shrek.svg", registrable: true}
];
