let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

var my_gradient = ctx.createLinearGradient(250, 0, canvas.width, 0);
my_gradient.addColorStop(0,"#ad5c11");
my_gradient.addColorStop(.03,"#c9b480");

let drawnShapes = [];
let shapeHoles = [];

function checkWin() {
  let i = 0;
  while (i < drawnShapes.length && drawnShapes[i].blocked) i++;
  if(i == shapeHoles.length) alert("Ganaste!");
}

function drawCanvas() {

  ctx.font = "18px Arial";
  ctx.fillStyle = my_gradient;
  ctx.fillRect(0,0, canvas.width, canvas.height);
  displayTime();

  let row = 2;
  let column = 0;
  let padding = 30;
  let defaultWidth = 150;
  shapeHoles = [];

  for (var i = 0; i < drawnShapes.length; i++) {
    let shape = drawnShapes[i];

    if((row * defaultWidth + padding * 2) + padding >= canvas.width) {
      row = 2;
      column++;
    }
    let p = alterPos(shape, new Point((defaultWidth * row) + padding, (column * defaultWidth) + padding));
    row++;
    shape.draw(false); // Dibujamos la figura en su lugar de encastre
    shapeHoles.push(new ShapeHole(shape));
    restorePos(shape, p);
    shape.draw(true); // Dibujamos la figura en la parte inferior para que luego se puedan encastrar
  }
  checkWin();
}

function alterPos(shape, pos) {
  let original = new Point(shape.x, shape.y);
  shape.x = pos.X + shape.offset.X;
  shape.y = pos.Y + shape.offset.Y;
  return original;
}

function restorePos(shape, pos) {
  shape.x = pos.X;
  shape.y = pos.Y;
}

drawPlayboard();
drawCanvas();

function drawPlayboard() {
  let row = 0;
  let column = 0;
  let padding = 20;
  for (var i = 0; i < 8; i++) {
    if(column % 2 == 0 && column != 0) {
      row++;
      column = 0;
    }
    drawnShapes.push(getRandomShape(110 * column + padding, 110 * row + padding + 15));
    column++;
  }
}


function getRandomShape(x, y) {
  let number = Math.floor(Math.random()* 5);

  switch (number) {
    case 0: return new Triangle(x, y, 100, new Point(0, 100));
    case 1: return new Square(x, y, 100);
    case 2: return new Circle(x, y, 50, new Point(50, 50));
    case 3: return new Diamond(x, y, 50, new Point(50, 0));
    case 4: return new Hexagon(x, y, 50, new Point(25, 0));
  }
}
