const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;
const FILE_NAME = "table.json";

app.use(cors());
app.use(express.json());

// Vérifie si le fichier JSON existe avant de démarrer
if (!fs.existsSync(FILE_NAME)) {
    console.error(`❌ Erreur : Le fichier '${FILE_NAME}' n'existe pas.`);
    process.exit(1);
}

// Route d'accueil (évite l'erreur "Cannot GET /")
app.get("/", (req, res) => {
    res.send("🚀 API en ligne ! Utilise /questions pour obtenir des questions.");
});

// Route pour récupérer les questions filtrées
app.post("/questions", (req, res) => {
    const { categories, difficulty } = req.body;

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return res.status(400).json({ message: "Veuillez sélectionner au moins une catégorie." });
    }

    if (!difficulty || !["FACILE", "NORMAL", "DIFFICILE"].includes(difficulty)) {
        return res.status(400).json({ message: "Difficulté invalide." });
    }

    fs.readFile(FILE_NAME, "utf8", (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier JSON :", err);
            return res.status(500).json({ message: "Erreur serveur lors de la lecture des questions." });
        }

        try {
            const questions = JSON.parse(data).filter(q =>
                q.DIFFICULTE === difficulty && categories.includes(q.CATEGORIE)
            );

            res.json(questions);
        } catch (error) {
            console.error("Erreur lors du parsing JSON :", error);
            res.status(500).json({ message: "Erreur serveur lors du traitement des questions." });
        }
    });
});

// Démarre le serveur
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Serveur démarré sur ${PORT}`);
});
