let defaultScale = .75;
let defaultWidth = 1920;
let gameContainer = document.getElementById('game-container');
let scale = window.innerWidth / defaultWidth;
gameContainer.style.transform = "scale(" + defaultScale * scale + ")";
let game = new Game();
