document.addEventListener("DOMContentLoaded", () => {
  const btnSolo = document.getElementById("start-solo");
  const btnMulti = document.getElementById("start-multi");

  if (btnSolo) {
    btnSolo.addEventListener("click", () => {
      startQuiz("gameSolo.html");
    });
  }
  if (btnMulti) {
    btnMulti.addEventListener("click", () => {
      startQuiz("gameMulti.html");
    });
  }
});

function startQuiz(targetPage) {
  const selectedCategories = [...document.querySelectorAll('#categories input:checked')].map(cb => cb.value);
  const difficulty = document.getElementById('difficulty').value;
  if (selectedCategories.length < 1) {
    alert("Veuillez sélectionner au moins une catégorie !");
    return;
  }
  localStorage.setItem("selectedCategories", JSON.stringify(selectedCategories));
  localStorage.setItem("selectedDifficulty", difficulty);
  localStorage.setItem("score", "0");
  localStorage.setItem("currentQuestionIndex", "0");
  window.location.href = targetPage;
}
