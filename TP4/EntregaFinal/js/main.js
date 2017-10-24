let defaultScale = .75;
let defaultWidth = 1920;
let startBtn = document.getElementById("start-btn");
let gameContainer = document.getElementById('game-container');
let scale = window.innerWidth / defaultWidth;
gameContainer.style.transform = "scale(" + defaultScale * scale + ")";
let game = new Game();


startBtn.onclick = function () {
  let parallaxLayers = document.querySelectorAll('.layer');
  let startScreenContainer = document.getElementById('start-background');
  startScreenContainer.style.opacity = 0;
  game.started = true;
  for (var i = 0; i < parallaxLayers.length; i++) {
    parallaxLayers[i].style.webkitAnimationPlayState = 'running';
  }
}
