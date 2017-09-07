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

class ResponsiveContainer {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.baseWidth = 995;
    this.baseHeight = 500;
    this.padding = 15;
    this.spacing = 15;
    this.currentRow = 0;
    this.currentColumn = 0;
    this.occupiedWidth = 0;
  }

  addObject(obj){
    this.reScale(obj);
    let size = obj.getWidth() + this.spacing;
    this.occupiedWidth += size;
    if(this.occupiedWidth >= this.width) {
      this.currentRow++;
      this.currentColumn = 0;
      this.occupiedWidth = size;
    }
    obj.x = size * this.currentColumn + obj.offset.X + this.padding + this.x;
    obj.y = size * this.currentRow + obj.offset.Y + this.padding + this.y;
    this.currentColumn++;
  }


  reScale(obj){
    if(canvas.width < this.baseWidth){
      let scaleFactor = canvas.width / this.baseWidth;
      obj.scaleShape(scaleFactor);
    }
  }
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
    shape.draw(true); // Dibujamos la figura que se va a poder mover a su lugar de encastre
    shapeHolesContainer.addObject(shape);
    shapeHoles.push(new ShapeHole(shape));
    shape.draw(false); // Dibujamos la figura en su lugar de encastre
  }

  //  checkWin();
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
