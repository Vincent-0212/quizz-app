const express = require("express");
const cors = require("cors");
const fs = require("fs");
const port = process.env.PORT || 3000;

const app = express();
const FILE_NAME = "table.json";

app.use(cors());
app.use(express.json());

if (!fs.existsSync(FILE_NAME)) {
  console.error("Le fichier 'table.json' n'existe pas.");
  process.exit(1);
}

app.post("/questions", (req, res) => {
  const { categories, difficulty } = req.body;
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({ message: "Veuillez sélectionner au moins une catégorie." });
  }
  if (!difficulty || !["FACILE","NORMAL","DIFFICILE"].includes(difficulty)) {
    return res.status(400).json({ message: "Difficulté invalide." });
  }
  fs.readFile(FILE_NAME, (err, data) => {
    if (err) return res.status(500).json({ message: "Erreur lecture fichier" });
    const allQ = JSON.parse(data).filter(q => q.DIFFICULTE===difficulty && categories.includes(q.CATEGORIE));
    res.json(allQ);
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${port}`);
});