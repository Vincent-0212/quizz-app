document.addEventListener("DOMContentLoaded", () => {
    const finalScoreEl = document.getElementById("final-score");
    const menuBtn = document.getElementById("menu-btn");
    const replayBtn = document.getElementById("replay-btn");
  
    if (finalScoreEl) {
      finalScoreEl.innerText = localStorage.getItem("finalScore") || 0;
    }
  
    if (menuBtn) {
      menuBtn.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }
  
    if (replayBtn) {
      replayBtn.addEventListener("click", () => {
        localStorage.setItem("score", 0);
        localStorage.setItem("currentQuestionIndex", 0);
        window.location.href = "settings.html";
      });
    }
  });
  