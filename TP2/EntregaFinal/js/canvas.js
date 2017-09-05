let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");


canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let drawnShapes = [];
let shapeHoles = [];

function drawCanvas() {
  ctx.fillStyle = "#3974a0";
  ctx.fillRect(0,0, canvas.width, canvas.height);

  let row = 0;
  let column = 0;
  let padding = 10;
  shapeHoles = [];

  for (var i = 0; i < drawnShapes.length; i++) {
    let shape = drawnShapes[i];

    if((row * 160) + padding >= canvas.width) {
      row = 0;
      column++;
    }
    let p = alterPos(shape, new Point((130 * row) + padding, (column * 130) + padding));
    row++;
    shape.draw(false); // Dibujamos la figura en su lugar de encastre
    shapeHoles.push(new ShapeHole(shape));
    restorePos(shape, p);
    shape.draw(true); // Dibujamos la figura en la parte inferior para que luego se puedan encastrar
  }

}

function alterPos(shape, pos, shapeOffset) {
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
  let row = 5;
  let column = 0;
  for (var i = 0; i < 15; i++) {
    drawnShapes.push(getRandomShape(100 * column, 100 * row));
    column++;
  }
}


function getRandomShape(x, y) {
  let number = Math.floor(Math.random()* 4);

  switch (number) {
    case 0: return new Triangle(x, y, 100, new Point(0, 100));
    case 1: return new Parallelogram(x, y, 100, 30);
    case 2: return new Square(x, y, 100);
    case 3: return new Circle(x, y, 50, new Point(50, 50));
  }
}


// Test

// let img = new Image();
// img.src = "image.jpg"
// img.onload = function () {
//
//   drawnShapes.push(new Parallelogram(100, 150, 100, 30));
//   drawnShapes.push(new Triangle(200, 200, 150));
//   drawnShapes.push(new Circle(200, 300, 75, this));
//   drawnShapes.push(new Circle(100, 100, 150, this));
//   drawnShapes.push(new Circle(300, 100, 30, this));
//   drawCanvas();
//
// }
// let img1 = new Image();
// img1.src = "https://i.pinimg.com/736x/a8/0d/a1/a80da10ca53188750464ac3bdb706c06--night-photography-night-landscape-photography.jpg";
// img1.onload = function () {
//
//   drawnShapes.push(new Circle(300, 300, 125, this));
//   drawnShapes.push(new Square(300, 300, 75));
//   drawCanvas();
//
// }
// let img2 = new Image();
// img2.src = "https://cdn.pixabay.com/photo/2015/10/04/17/31/abstract-971439_960_720.jpg";
// img2.onload = function () {
//
//   drawnShapes.push(new Circle(250, 300, 70, this));
//   drawCanvas();
//
// }
