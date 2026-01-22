import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.model.js';

dotenv.config();

async function createFirstAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ MongoDB connecté');

    // Vérifier si un admin existe déjà
    const existingAdmin = await Admin.findOne();
    
    if (existingAdmin) {
      console.log('⚠️  Un admin existe déjà');
      process.exit(0);
    }

    // Créer le premier super-admin
    const admin = await Admin.create({
      email: 'admin@daleelashes.com',
      password: 'Admin123!',
      name: 'Super Admin',
      role: 'super-admin',
      active: true,
    });

    console.log('✅ Super-admin créé avec succès !');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Mot de passe: Admin123!');
    console.log('⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

createFirstAdmin();