// src/scripts/services-seed.ts
import 'dotenv/config';  // ← Import + config automatique (MEILLEURE PRATIQUE en ESM)

import mongoose from 'mongoose';
import Service from '../models/Service.model.js';

const services = [
  {
    slug: "classique",
    name: "Extension Classique",
    description: "Naturel & élégant",
    price: 60,
    duration: 150,          // en minutes
    active: true
  },
  {
    slug: "hybride",
    name: "Extension Hybride",
    description: "L'équilibre parfait",
    price: 70,
    duration: 150,
    active: true
  },
  {
    slug: "volume",
    name: "Volume",
    description: "Intense & glamour",
    price: 80,
    duration: 150,
    active: true
  },
  {
    slug: "remplissage-2s",
    name: "Remplissage classique",
    description: "Entretien régulier",
    price: 30,
    duration: 150,
    active: true
  },
  {
    slug: "remplissage-3s",
    name: "Remplissage hybride",
    description: "Entretien standard",
    price: 35,
    duration: 150,
    active: true
  },
  {
    slug: "remplissage-4s",
    name: "Remplissage volume",
    description: "Entretien standard",
    price: 40,
    duration: 150,
    active: true
  }
];

async function seedServices() {
  try {
    // Vérification de la variable d'environnement
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error(
        'MONGO_URI (ou MONGODB_URI) manquant dans .env. Vérifie ton fichier .env'
      );
    }

    console.log('Tentative de connexion MongoDB avec URI :', mongoUri.replace(/\/\/.*@/, '//****:****@'));

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connecté avec succès");

    // Optionnel : supprimer les anciens (attention en prod !)
    await Service.deleteMany({});
    console.log("🗑️ Anciens services supprimés");

    const inserted = await Service.insertMany(services);
    console.log(`✅ ${inserted.length} services créés avec succès !`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed :", error);
    process.exit(1);
  }
}

seedServices();