import express from 'express';
import multer from 'multer'; // Utilisation de 'import' au lieu de 'require'
import Blog from '../models/blog.js';

const router = express.Router();

// Configuration de multer pour gérer les uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Répertoire où enregistrer les fichiers
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nom du fichier
  }
});

const upload = multer({ storage });

// POST - Créer un nouvel article de blog avec image
router.post('/', upload.single('imageUrl'), async (req, res) => {
  const { title, content } = req.body;
  const imageUrl = req.file?.path; // Vérifiez si un fichier est téléchargé

  const newBlog = new Blog({
    title,
    content,
    imageUrl
  });

  try {
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Récupérer tous les articles de blog
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des blogs.' });
  }
});

// GET - Récupérer un article de blog par ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog non trouvé.' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du blog.' });
  }
});

// PUT - Mettre à jour un article de blog par ID avec possibilité de modifier l'image
router.put('/:id', upload.single('imageUrl'), async (req, res) => {
  const { title, content } = req.body;
  const imageUrl = req.file?.path;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog non trouvé.' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.imageUrl = imageUrl || blog.imageUrl;

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du blog.' });
  }
});

// DELETE - Supprimer un article de blog par ID
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog non trouvé.' });
    }
    res.status(200).json({ message: 'Blog supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du blog.' });
  }
});

export default router;
