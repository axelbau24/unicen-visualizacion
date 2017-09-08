addDifficulty(6, 100, 100, "easy", "Fácil");
addDifficulty(12, 60, 50, "normal", "Normal");
addDifficulty(24, 15, 15,"hard", "Dificil");


function updateDifficultyText(diff) {
  document.getElementById("difficulty").innerHTML = diff;
}

function addDifficulty(shapes, padding, spacing, id, text) {
  document.getElementById(id).addEventListener("click",function () {
    startGame(shapes, padding, spacing);
    updateDifficultyText(text);
  });
}

document.getElementById('restart').addEventListener("click", function () {
  startGame(drawnShapes.length, padding, spacing);
});
