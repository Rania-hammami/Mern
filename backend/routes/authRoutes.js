import express from 'express';
import Utilisateur from '../models/utilisateur.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Inscription
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUtilisateur = new Utilisateur({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUtilisateur.save();
    res.status(201).send('Utilisateur créé avec succès');
  } catch (error) {
    res.status(500).send('Erreur lors de la création de l’utilisateur');
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({ email });

    if (!utilisateur) {
      return res.status(400).send('Utilisateur non trouvé');
    }

    const match = await bcrypt.compare(password, utilisateur.password);

    if (!match) {
      return res.status(400).send('Mot de passe incorrect');
    }

    // Inclure le rôle de l'utilisateur dans le token
    const token = jwt.sign({ id: utilisateur._id, role: utilisateur.role }, 'votre-clé-secrète', {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: {
        firstName: utilisateur.firstName,
        lastName: utilisateur.lastName,
        role: utilisateur.role, // Envoyer le rôle au frontend
      },
    });
  } catch (error) {
    res.status(500).send('Erreur lors de la connexion');
  }
});

export default router;
