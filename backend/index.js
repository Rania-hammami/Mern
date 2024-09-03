import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import maisonsRoute from './routes/maisonsRoute.js';
import cors from 'cors';
import path from 'path';


const app = express();


// Middleware pour le traitement du corps de la requête JSON
app.use(express.json({ limit: '10mb' })); // Limite à 10 Mo pour les corps JSON

// Middleware pour le traitement des données multipart/form-data
// app.use(upload.array()); // Gère les fichiers envoyés dans des requêtes multipart/form-data

// Middleware for handling CORS policy    
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "X-Requested-With", "Accept"]
}));

app.use('/maisons', maisonsRoute);

app.get('/maisons', (req, res) => {
    console.log(req);
    return res.status(200).send('Welcome to Samsra MERN stack');
});


// Connect to MongoDB and start the server
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB', error.message);
    });

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
   app.use(express.static(path.join(__dirname, "frontend", "build")));
   app.get('*', (req, res) => {
       res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
   });
}
