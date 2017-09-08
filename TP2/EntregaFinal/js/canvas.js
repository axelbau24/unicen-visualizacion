let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let padding = 0;
let spacing = 0;
let drawnShapes = [];
let shapeHoles = [];

function checkWin() {
  let i = 0;
  while (i < drawnShapes.length && drawnShapes[i].blocked) i++;
  if(i == shapeHoles.length) alert("Ganaste!");
}


/**
 * Metodo utilizado para rellenar el tablero con figuras disponibles
 * Cuando una figura es insertada en alguna ranura, se llamara a este metodo,
 * obteniendo asi las figuras que todavia no estaban dibujadas en la pantalla.
 */
function getNewShapes(shape) {
  let container = new ResponsiveContainer(0, 0, 260, canvas.height, 15, 15);
  let remaining = 0;
  for (var i = 0; i < drawnShapes.length; i++) {
    if(!drawnShapes[i].blocked){
       container.addObject(drawnShapes[i]);
       remaining++;
    }
  }
  document.getElementById('remaining').innerHTML = remaining;
}


/**
 * Metodo llamado para re-dibujar el canvas al momento que se mueve
 * alguna figura
 */
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(117,76,36,0.7)";
  ctx.fillRect(0,0, 260, canvas.height);
  ctx.fillStyle = "rgba(160,160,160,0.7)";
  ctx.fillRect(260,0, canvas.width - 260, canvas.height);
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(260, 0);
  ctx.lineTo(260, canvas.height);
  ctx.stroke();

  shapeHoles = [];
  let shapeHolesContainer = new ResponsiveContainer(260, 0, canvas.width - 260, canvas.height, padding, spacing);

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


/**
 * Metodo encargado de obtener figuras aleatorias y posicionarlas en el tablero
 * para que luego puedan ser movidas por el usuario.
 */
function drawPlayboard(shapesAmount) {
  drawnShapes = [];
  let container = new ResponsiveContainer(0, 0, 260, canvas.height, 15, 15);
  document.getElementById('remaining').innerHTML = shapesAmount;

  for (var i = 0; i < shapesAmount; i++) {
    let shape = getRandomShape();
    container.addObject(shape);
    drawnShapes.push(shape);
  }
}

function startGame(shapesAmount, _padding, _spacing) {

  padding = _padding;
  spacing = _spacing;
  // Clonamos el canvas para asi eliminar los eventos de drag actuales
  let oldCanvas = canvas;
  var newCanvas = oldCanvas.cloneNode(true);
  oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
  canvas = newCanvas;
  ctx = newCanvas.getContext("2d");

  resetTimer();
  drawPlayboard(shapesAmount);
  drawCanvas();
}


function getRandomShape() {
  let number = randomNumber();

  switch (number) {
    case 0: return new Triangle(0, 0, 100, new Point(0, 100), shapeImages[randomNumber()]);
    case 1: return new Square(0, 0, 100, null, shapeImages[randomNumber()]);
    case 2: return new Circle(0, 0, 50, new Point(50, 50), shapeImages[randomNumber()]);
    case 3: return new Diamond(0, 0, 50, new Point(50, 0), shapeImages[randomNumber()]);
    case 4: return new Hexagon(0, 0, 50, new Point(25, 0), shapeImages[randomNumber()]);
  }
}

function randomNumber() {
  return Math.floor(Math.random()* 5);
}
