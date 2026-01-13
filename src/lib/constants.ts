// Business Information
export const BUSINESS_INFO = {
  name: "Dalee_lashes",
  tagline: "L'art de sublimer votre regard",
  phone: "+1 (873) 255-7383",
  email: "contact@daleelashes.com",
  location: "Trois-Rivières, Québec",
  addressNote: "L'adresse exacte sera communiquée après confirmation du rendez-vous",
  instagram: "https://instagram.com/dalee_lashes",
  
  // Operating Hours
  hours: {
    days: "Lundi - Dimanche",
    time: "8h - 21h",
    open: 8,
    close: 21,
  },
  
  // Payment Policy
  payment: {
    deposit: "Acompte payable par Interac",
    final: "Le reste du paiement uniquement en cash après la prestation",
    depositAmount: 30, // percentage
  },
  
  // General service duration
  generalDuration: "2h30",
};

// Services
export const SERVICES = [
  {
    id: "classique",
    title: "Extension Classique",
    subtitle: "Naturel & Élégant",
    description: "Une extension par cil naturel pour un résultat subtil et sophistiqué. Parfait pour un premier essai ou un look naturel au quotidien.",
    duration: "2h30",
    price: 75,
    depositRequired: true,
  },
  {
    id: "hybride",
    title: "Extension Hybride",
    subtitle: "L'équilibre parfait",
    description: "Mix harmonieux de classique et volume pour un regard intensifié tout en gardant un aspect naturel.",
    duration: "2h30",
    price: 85,
    depositRequired: true,
  },
  {
    id: "volume",
    title: "Volume Russe",
    subtitle: "Intense & Glamour",
    description: "Bouquets de 2 à 6 extensions ultra-fines pour un effet volume spectaculaire et un regard captivant.",
    duration: "2h30",
    price: 95,
    depositRequired: true,
  },
  {
    id: "mega-volume",
    title: "Mega Volume",
    subtitle: "Drama & Impact",
    description: "Le summum du volume avec des bouquets de 10+ extensions pour un regard de star.",
    duration: "2h30",
    price: 110,
    depositRequired: true,
  },
  {
    id: "remplissage-2s",
    title: "Remplissage 2 semaines",
    subtitle: "Entretien régulier",
    description: "Remplissage pour maintenir un résultat optimal. Recommandé pour un entretien régulier.",
    duration: "1h30",
    price: 45,
    depositRequired: false,
  },
  {
    id: "remplissage-3s",
    title: "Remplissage 3 semaines",
    subtitle: "Entretien standard",
    description: "Remplissage pour raviver votre pose. Idéal pour maintenir un regard impeccable.",
    duration: "1h45",
    price: 55,
    depositRequired: false,
  },
  {
    id: "depose",
    title: "Dépose",
    subtitle: "Retrait en douceur",
    description: "Retrait professionnel et délicat de vos extensions pour préserver vos cils naturels.",
    duration: "45min",
    price: 25,
    depositRequired: false,
  },
];

// Time slots
export const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30",
];

// Admin credentials (in real app, this would be server-side)
export const ADMIN_CREDENTIALS = {
  username: "daleela",
  password: "dalee",
};
