addDifficulty(6, "easy", "Fácil");
addDifficulty(12, "normal", "Normal");
addDifficulty(24, "hard", "Dificil");


function updateDifficultyText(diff) {
  document.getElementById("difficulty").innerHTML = diff;
}

function addDifficulty(shapes, id, text) {
  document.getElementById(id).addEventListener("click",function () {
    startGame(shapes);
    updateDifficultyText(text);
  });
}

document.getElementById('restart').addEventListener("click", function () {
  startGame(drawnShapes.length);
});
