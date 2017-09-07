let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let drawnShapes = [];
let shapeHoles = [];

function checkWin() {
  let i = 0;
  while (i < drawnShapes.length && drawnShapes[i].blocked) i++;
  if(i == shapeHoles.length) alert("Ganaste!");
}


function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(117,76,36,0.7)";
  ctx.fillRect(0,0, 260, canvas.height);
  ctx.fillStyle = "rgba(160,160,160,0.7)";
  ctx.fillRect(260,0, canvas.width - 260, canvas.height);

  shapeHoles = [];
  let shapeHolesContainer = new ResponsiveContainer(260, 0, canvas.width - 260, canvas.height);

  for (var i = 0; i < drawnShapes.length; i++) {
    let shape = drawnShapes[i];
    let originalPosition = new Point(shape.x, shape.y);
    shapeHolesContainer.addObject(shape);
    shapeHoles.push(new ShapeHole(shape));
    shape.draw(false); // Dibujamos la figura en su lugar de encastre
    restorePos(shape, originalPosition);
    shape.draw(true); // Dibujamos la figura que se va a poder mover a su lugar de encastre
  }

   checkWin();
}

function restorePos(shape, pos) {
  shape.x = pos.X;
  shape.y = pos.Y;
}

drawPlayboard();
drawCanvas();

function drawPlayboard() {
  let shapesCount = 24;
  let container = new ResponsiveContainer(0, 0, 260, canvas.height);

  for (var i = 0; i < shapesCount; i++) {
    let shape = getRandomShape(0, 0);
    container.addObject(shape);
    drawnShapes.push(shape);
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
