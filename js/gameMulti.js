let score = 0;
let currentQuestionIndex = 0;
let selectedQuestions = [];
let selectedCategories = JSON.parse(localStorage.getItem("selectedCategories")) || [];
let selectedDifficulty = localStorage.getItem("selectedDifficulty") || "FACILE";

const categoryNames = {
  SCIE: "Science & Nature",
  HIST: "Histoire",
  GEOG: "Géographie",
  ARTL: "Arts",
  CULT: "Culture Générale",
  MYTH: "Mythologie"
};

document.addEventListener("DOMContentLoaded", fetchQuestions);

function fetchQuestions() {
  if (selectedCategories.length === 0) {
    alert("Veuillez sélectionner au moins une catégorie.");
    window.location.href = "settings.html";
    return;
  }
  fetch("http://localhost:3000/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categories: selectedCategories, difficulty: selectedDifficulty })
  })
  .then(res => res.json())
  .then(data => {
    if (data.length < 20) {
      alert("Erreur : Pas assez de questions disponibles !");
      window.location.href = "settings.html";
      return;
    }
    selectedQuestions = data.sort(() => Math.random() - 0.5).slice(0, 20);
    loadQuestion();
  })
  .catch(err => console.error(err));
}

function loadQuestion() {
  if (currentQuestionIndex >= selectedQuestions.length) {
    localStorage.setItem("finalScore", score);
    window.location.href = "score.html";
    return;
  }
  let q = selectedQuestions[currentQuestionIndex];
  let cat = categoryNames[q.CATEGORIE] || "Catégorie inconnue";
  document.getElementById("question").innerText = q.QUESTION;
  document.getElementById("reponse-text").innerText = q.REPONSE;
  document.getElementById("theme").innerText = cat;
  document.getElementById("question-number").innerText = currentQuestionIndex + 1;
}

function validateAnswer(correct) {
  if (correct) score++;
  currentQuestionIndex++;
  loadQuestion();
}
