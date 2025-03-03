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

const FRENCH_STOPWORDS = ["l","le","la","les","des","un","une","de","du"];
let soundCorrect, soundWrong;

document.addEventListener("DOMContentLoaded", () => {
  soundCorrect = document.getElementById("sound-correct");
  soundWrong = document.getElementById("sound-wrong");
  fetchQuestionsSolo();
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const overlay = document.getElementById("popup-overlay");
      if (overlay && overlay.style.display === "flex") {
        closePopup();
      } else {
        checkAnswer();
      }
    }
  });
  const submitBtn = document.getElementById("submit-answer");
  if (submitBtn) submitBtn.addEventListener("click", checkAnswer);
  const closeBtn = document.getElementById("close-popup");
  if (closeBtn) closeBtn.addEventListener("click", closePopup);
});

function fetchQuestionsSolo() {
  if (selectedCategories.length === 0) {
    alert("Veuillez sélectionner au moins une catégorie.");
    window.location.href = "settings.html";
    return;
  }
  fetch("http://192.168.1.37:3000/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      categories: selectedCategories,
      difficulty: selectedDifficulty
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.length < 20) {
      alert("Erreur : Pas assez de questions disponibles !");
      window.location.href = "settings.html";
      return;
    }
    selectedQuestions = data.sort(() => Math.random() - 0.5).slice(0, 20);
    loadQuestionSolo();
  })
  .catch(err => console.error("Erreur fetch Solo:", err));
}

function loadQuestionSolo() {
  if (currentQuestionIndex >= selectedQuestions.length) {
    localStorage.setItem("finalScore", score);
    window.location.href = "score.html";
    return;
  }
  let q = selectedQuestions[currentQuestionIndex];
  let catName = categoryNames[q.CATEGORIE] || "Catégorie inconnue";
  document.getElementById("theme").innerText = catName;
  document.getElementById("question").innerText = String(q.QUESTION).trim();
  document.getElementById("question-number").innerText = currentQuestionIndex + 1;
  const userField = document.getElementById("user-answer");
  if (userField) userField.value = "";
}

function checkAnswer() {
  const userField = document.getElementById("user-answer");
  let userAnswer = userField ? userField.value.trim() : "";

  let questionObj = selectedQuestions[currentQuestionIndex];
  let correct = String(questionObj.REPONSE).trim();

  if (userAnswer === "" || !isAnswerCorrect(userAnswer, correct)) {
    soundWrong.play().catch(e => console.log("Erreur son wrong:", e));
    document.getElementById("correct-answer").innerText = correct;
    document.getElementById("popup-overlay").style.display = "flex";
  } else {
    soundCorrect.play().catch(e => console.log("Erreur son correct:", e));
    score++;
    currentQuestionIndex++;
    loadQuestionSolo();
  }
}


function closePopup() {
  document.getElementById("popup-overlay").style.display = "none";
  currentQuestionIndex++;
  loadQuestionSolo();
}

function isAnswerCorrect(user, correct) {
  if (isPureNumber(correct)) {
    return (user === correct);
  }
  const u = removeStopwords(removeAccents(normalize(user)));
  const c = removeStopwords(removeAccents(normalize(correct)));
  if (u === c) return true;
  if (u.length >= 3 && (c.includes(u) || u.includes(c))) return true;
  if (levenshtein(u, c) <= 2) return true;
  return false;
}

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9éèêëàâîïùçœ -]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function removeAccents(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function removeStopwords(str) {
  let words = str.split(' ').filter(w => w.length>0);
  return words.filter(w => !FRENCH_STOPWORDS.includes(w)).join(' ');
}

function isPureNumber(s) {
  return /^\d+$/.test(s);
}

function levenshtein(a,b) {
  const matrix = [];
  for(let i=0; i<=a.length; i++){
    matrix[i]=[i];
  }
  for(let j=1; j<=b.length; j++){
    matrix[0][j]=j;
  }
  for(let i=1; i<=a.length; i++){
    for(let j=1; j<=b.length; j++){
      if(a[i-1]===b[j-1]) {
        matrix[i][j]=matrix[i-1][j-1];
      } else {
        matrix[i][j]=1+Math.min(matrix[i-1][j], matrix[i][j-1], matrix[i-1][j-1]);
      }
    }
  }
  return matrix[a.length][b.length];
}
