import express from 'express';
import multer from 'multer';
import fs from 'fs';
import Maison from '../models/maison.js'; // Assurez-vous que le chemin est correct

const router = express.Router();

// Vérifiez si le répertoire 'uploads/' existe, sinon le créer
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Répertoire où les fichiers seront stockés
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.array('images'), async (req, res) => {
    try {
        console.log('Request Body:', req.body);  
        console.log('Files:', req.files);

        let data = req.body;
        let maison = new Maison({ ...data, images: [] });
        maison.datedepot = new Date();

        if (req.files && req.files.length > 0) {
            maison.images = req.files.map(file => file.filename);
        }

        await maison.save();
        res.status(201).json(maison);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});


// Route pour récupérer toutes les maisons
router.get('/', async (req, res) => {
    try {
        const maisons = await Maison.find();
        return res.status(200).json({
            count: maisons.length,
            data: maisons,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route pour récupérer une maison par ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const maison = await Maison.findById(id);

        if (!maison) {
            return res.status(404).send({ message: 'House not found' });
        }
        return res.status(200).send(maison);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route pour mettre à jour une maison par ID
router.put('/:id', async (req, res) => {
    try {
        const requiredFields = [
            'titre', 'description', 'categorie', 'prix', 'nomproprietaire',
            'emailproprietaire', 'numproprietaire', 'images', 'adresse',
            'gouvernorat', 'ville', 'surface', 'nb_chambre', 'nb_salon',
            'nb_salleDeBain', 'nb_etage', 'meublé', 'jardin', 'piscine',
            'garage', 'ascenseur', 'terrasse', 'balcon', 'climatisation',
            'chauffage', 'interphone', 'gardien', 'alarme', 'camera',
            'syndic', 'cuisineEquipée', 'cheminée', 'vueMer', 'vueMontagne',
            'vueVille', 'autre', 'agentremarques'
        ];

        // Vérifiez que chaque champ requis est présent dans req.body
        for (let field of requiredFields) {
            if (req.body[field] === undefined) {
                return res.status(400).send({
                    message: `Field ${field} is required`,
                });
            }
        }

        const { id } = req.params;
        const maison = await Maison.findByIdAndUpdate(id, req.body, { new: true });

        if (!maison) {
            return res.status(404).send({ message: 'House not found' });
        }
        return res.status(200).send({ message: 'House updated successfully', maison });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route pour supprimer une maison par ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const maison = await Maison.findByIdAndDelete(id);

        if (!maison) {
            return res.status(404).send({ message: 'House not found' });
        }
        return res.status(200).send({ message: 'House deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

export default router;
