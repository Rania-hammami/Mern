import Utilisateur from '../models/utilisateur.js';  // Assurez-vous que le chemin est correct
import bcrypt from 'bcrypt';

const createDefaultAdmin = async () => {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin123';

  // Vérifier si l'admin existe déjà
  const existingAdmin = await Utilisateur.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new Utilisateur({
      firstName: 'Admin',
      lastName: 'dash',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin', // Spécifier que c'est un admin
    });

    await admin.save();
    console.log('Administrateur par défaut créé');
  } else {
    console.log('Administrateur par défaut déjà existant');
  }
};

export default createDefaultAdmin;
