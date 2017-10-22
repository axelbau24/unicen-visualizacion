let defaultScale = .75;
let gameContainer = document.getElementById('game-container');
let scale = window.innerWidth / 1920;
gameContainer.style.transform = "scale(" + defaultScale * scale + ")";
let game = new Game();


let element = document.createElement("div");
element.className = "hp-flask";
gameContainer.appendChild(element);
go = new GameObject(element, true);
game.addObject(go);
go.setPos(700, 100);
