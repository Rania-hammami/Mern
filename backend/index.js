import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import maisonsRoute from './routes/maisonsRoute.js';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js'; // Notez l'extension `.js`

import createDefaultAdmin from './utils/createAdmin.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Recréer __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static('public'));

// Middleware pour le traitement du corps de la requête JSON
app.use(express.json());

// Middleware for handling CORS policy    
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "X-Requested-With", "Accept"]
}));

app.use('/maisons', maisonsRoute);
app.use('/blogs', blogRoutes); 

app.get('/maisons', (req, res) => {
    console.log(req);
    return res.status(200).send('Welcome to Samsra MERN stack');
});
app.get('blogs',(req,res) => {
    console.log(req);
    return res.status(200).send('Welcome to Samsra Blog');
});

app.use('/auth', authRoutes);

// Servir les fichiers statiques dans le dossier "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "build")));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

// Connect to MongoDB and start the server
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('Connected to MongoDB');
        createDefaultAdmin(); // Create default admin if not exists
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB', error.message);
    });
