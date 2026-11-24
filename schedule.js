// EDIT ONGOING ACTIVITIES HERE
const ongoingActivities = [
    { icon: "🎮", name: "Freeplay Gaming", desc: "Smash Bros, Mario Kart, SF6, Tekken7" },
    { icon: "🃏", name: "Cartes Pokémon 3D", desc: "Atelier Créatif avec JakssDio" },
    { icon: "🧶", name: "Atelier Crochet", desc: "Créations CandiCrochettes" },
    { icon: "📸", name: "Cosplay Photo Booth", desc: "Séance photo gratuite" }
];

// PRE-LOAD A SPECIAL ANNOUNCEMENT (Or leave empty "")
const defaultAnnouncement = "NON, DOMINO!!! IL TAPE DE NOUVEAU DANS LES CROCQUETTES CE GROS CHAT!";

// OPTIONAL DEFAULT LOGOS BY HOST NAME (Used automatically if event.logo is empty)
// Example: "JakssDio": "logos/jakssdio.png"
// Any host without a logo automatically falls back to "NewLogoMP_Seri1coul_Noir.png"!
const defaultHostLogos = {
    // "JakssDio": "logos/jakssdio.png",
    // "CandiCrochettes": "assets/CandiCrochettes Promo.jpg"
};

// EDIT MAIN SCHEDULE HERE
const events = [
    {id: 1, day: 'Saturday', startTime: '9:00', endTime: '10:00', event: "Viens prendre le p'tit déj avec l'équipe 🥐", hosts: null, logo: null},
    {id: 2, day: 'Saturday', startTime: '10:00', endTime: '11:00', event: "Création de Cartes Pokémon 3D avec JakssDio ! 🃏", hosts: "JakssDio", logo: null},
    {id: 3, day: 'Saturday', startTime: '11:00', endTime: '12:00', event: "Quizz Disney Niveau Sérieux 😼", hosts: "Samir", logo: null},
    {id: 4, day: 'Saturday', startTime: '12:00', endTime: '13:00', event: "Pause Déj", hosts: null, logo: null},
    {id: 5, day: 'Saturday', startTime: '14:00', endTime: '15:00', event: "Sujet BlaBla Expédition 33⚔️", hosts: "Sacha", logo: null},
    {id: 6, day: 'Saturday', startTime: '15:00', endTime: '16:00', event: "Le Grand Tournoi de Mini-Pouces ! 👍 OFFICIEL", hosts: null, logo: null},
    {id: 7, day: 'Saturday', startTime: '16:00', endTime: '17:00', event: "CELEFIAKAKI - QUIZZ du Boulard 🍑", hosts: "Samir", logo: null},
    {id: 8, day: 'Saturday', startTime: '17:00', endTime: '18:00', event: "CELETCHOUTCHAKI - QUIZZ des Nib's", hosts: "Alicia & Samir", logo: null},
    {id: 9, day: 'Saturday', startTime: '18:00', endTime: '19:00', event: "Ménage", hosts: null, logo: null},
    {id: 10, day: 'Sunday', startTime: '9:00', endTime: '10:00', event: "Viens prendre le p'tit déj avec l'équipe 🥐", hosts: null, logo: null},
    {id: 11, day: 'Sunday', startTime: '10:00', endTime: '11:00', event: "Blindtest Inversé 👂", hosts: "John", logo: null},
    {id: 12, day: 'Sunday', startTime: '11:00', endTime: '12:00', event: "Quizz Harry Potter - Moldus s'Abstenir 🪄", hosts: "Samir", logo: null},
    {id: 13, day: 'Sunday', startTime: '12:00', endTime: '13:00', event: "Pause Déj", hosts: null, logo: null},
    {id: 14, day: 'Sunday', startTime: '14:00', endTime: '15:00', event: "Sujet BlaBla Histoire du JV", hosts: "Sacha & René (Silicium)", logo: null},
    {id: 15, day: 'Sunday', startTime: '15:00', endTime: '16:00', event: "Le Retour du Tournoi de Mini-Pouces ! 👍 OFFICIEL", hosts: null, logo: null},
    {id: 16, day: 'Sunday', startTime: '16:00', endTime: '17:00', event: "LE GRAND TOURNOI DE SHIFUMI ! ✊✋✌️", hosts: "John & Samir", logo: null},
    {id: 17, day: 'Sunday', startTime: '17:00', endTime: '18:00', event: "CELAKALVAKI - QUIZZ de la Chauvétie 🧑‍🦲", hosts: "Samir", logo: null},
    {id: 18, day: 'Sunday', startTime: '18:00', endTime: '19:00', event: "Désinstallation", hosts: null, logo: null}
];
