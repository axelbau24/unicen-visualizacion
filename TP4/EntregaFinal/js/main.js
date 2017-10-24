let defaultScale = .75;
let defaultWidth = 1920;
let startBtn = document.getElementById("start-btn");
let restartBtns = document.getElementsByClassName("restart");
let gameoverScreen = document.getElementById("gameover");
let gameContainer = document.getElementById('game-container');
let parallaxLayers = document.querySelectorAll('.layer');
let startScreenContainer = document.getElementById('start-background');
let scale = window.innerWidth / defaultWidth;
gameContainer.style.transform = "scale(" + defaultScale * scale + ")";
let game = new Game();


startBtn.onclick = function () {
  startScreenContainer.style.opacity = 0;
  game.started = true;
  for (var i = 0; i < parallaxLayers.length; i++) {
    parallaxLayers[i].style.webkitAnimationPlayState = 'running';
  }
}

for (var i = 0; i < restartBtns.length; i++) {
  restartBtns[i].onclick = function () {
    game.stopGame();
    for (var i = 0; i < parallaxLayers.length; i++) {
      parallaxLayers[i].style.webkitAnimationPlayState = 'paused';
    }
    gameoverScreen.className = null;
    gameoverScreen.style.opacity = 0;
    startScreenContainer.style.opacity = 1;
    game = new Game();
  };
  
}