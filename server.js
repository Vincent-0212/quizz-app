const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const FILE_NAME = 'table.json';

app.use(cors());
app.use(express.json());

// 📌 Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, 'public')));

// 📌 Page d'accueil → Affiche index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 📌 Endpoint pour récupérer les questions
app.post('/questions', (req, res) => {
    const { categories, difficulty } = req.body;

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return res.status(400).json({ message: 'Veuillez sélectionner au moins une catégorie.' });
    }
    if (!difficulty || !["FACILE", "NORMAL", "DIFFICILE"].includes(difficulty)) {
        return res.status(400).json({ message: 'Difficulté invalide.' });
    }

    fs.readFile(FILE_NAME, (err, data) => {
        if (err) return res.status(500).json({ message: 'Erreur lecture fichier' });

        const questions = JSON.parse(data).filter(q =>
            q.DIFFICULTE === difficulty && categories.includes(q.CATEGORIE)
        );

        res.json(questions);
    });
});

app.listen(3000, '0.0.0.0', () => console.log("🚀 Serveur en ligne, accès à l'API et au site !"));
