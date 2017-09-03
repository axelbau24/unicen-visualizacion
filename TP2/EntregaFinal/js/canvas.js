let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

class Draggable {
  constructor() {
    if (new.target === Draggable) {
        throw new TypeError("No es posible instanciar una clase abstracta");
    }
    this.dragging = false;
    this.draggingDistance = null;
    let obj = this;

    canvas.addEventListener("mousemove", function (e) {
      obj.drag(e);
    });
    canvas.addEventListener("mousedown", function (e) {
      obj.mouseDown(e);
    });
    canvas.addEventListener("mouseup", function (e) {
      obj.mouseUp(e);
    });
  }

  isPointInside(point){} // Metodo abstracto
  draw(){} // Metodo abstracto
  setPos(x, y){} // Metodo abstracto

  drag(e){
    if(this.dragging){
      let rect = canvas.getBoundingClientRect();
      this.setPos(e.clientX - rect.left, e.clientY - rect.top);
    }
  }
  mouseDown(e){
    let rect = canvas.getBoundingClientRect();
    let p = new Point(e.clientX - rect.left, e.clientY - rect.top);
    this.draggingDistance = new Point(Math.abs(this.x - p.X), Math.abs(this.y - p.Y));
    if(this.isPointInside(p)) this.dragging = true;

  }
  mouseUp(e){
    this.dragging = false;
  }

  clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

class Circle extends Draggable {
  constructor(x, y, radius, image) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.image = image;

  }

  draw(){
    ctx.translate(this.x - this.radius, this.y - this.radius);

    ctx.fillStyle = this.getImagePattern();
    ctx.beginPath();
    ctx.arc(this.radius, this.radius, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.translate(-(this.x - this.radius), -(this.y - this.radius));
  }

  setPos(x, y){
    this.clear();
    if(this.x <= x) this.x = x - this.draggingDistance.X;
    else this.x = x + this.draggingDistance.X;
    if(this.y <= y) this.y = y - this.draggingDistance.Y;
    else this.y = y + this.draggingDistance.Y;
    this.draw();

  }

  getImagePattern(){
    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = this.radius * 2;
    tempCanvas.height = this.radius * 2;
    tempCtx.drawImage(this.image, 0, 0, this.radius * 2, this.radius * 2);
    return ctx.createPattern(tempCanvas, "no-repeat");
  }


  isPointInside(point){
    return this.getDistance(point.X, point.Y, this.x, this.y) <= this.radius;
  }

  getDistance(pX, pY, cX, cY){
    return Math.sqrt(Math.pow(pX - cX, 2) + Math.pow(pY - cY, 2));
  }

}


class Point {
  constructor(x , y) {
    this.X = x;
    this.Y = y;
  }
}



class Polygon extends Draggable{
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.polygon = [];
  }

  addPoint(point){
    if(this.polygon.length == 0) ctx.moveTo(point.X, point.Y);
    else ctx.lineTo(point.X, point.Y);
    this.polygon.push(point);
  }

  isPointInside(point){
    let rect = canvas.getBoundingClientRect();
    let inside = false;

    for (let i = 0, j = this.polygon.length - 1 ; i < this.polygon.length; j = i++){
        if (this.polygon[i].Y > point.Y != this.polygon[j].Y > point.Y &&
             point.X < (this.polygon[j].X - this.polygon[i].X) *
             (point.Y - this.polygon[i].Y) /
             (this.polygon[j].Y - this.polygon[i].Y) + this.polygon[i].X) {
            inside = !inside;
        }
    }
    return inside;
  }

  clear(){
    super.clear();
    this.polygon = [];
  }

}



class Triangle extends Polygon {
  constructor(x, y, size){
    super(x, y);
    this.size = size;
  }

  draw(){
    ctx.fillStyle = "red";
    ctx.beginPath();
    this.addPoint(new Point(this.x, this.y));
    this.addPoint(new Point(this.x + this.size, this.y));
    this.addPoint(new Point(this.x + this.size / 2, this.y - this.size));
    this.addPoint(new Point(this.x, this.y));
    ctx.closePath();
    ctx.stroke();

  }
  setPos(x, y){
    this.clear();
    this.x = x - this.draggingDistance.X;
    this.y = y + this.draggingDistance.Y;
    this.draw();
  }
}

class Square extends Polygon {
  constructor(x, y, size){
    super(x, y);
    this.size = size;
  }

  draw(){
    ctx.fillStyle = "red";
    ctx.beginPath();
    this.addPoint(new Point(this.x, this.y));
    this.addPoint(new Point(this.x + this.size, this.y));
    this.addPoint(new Point(this.x + this.size, this.y + this.size));
    this.addPoint(new Point(this.x, this.y + this.size));
    this.addPoint(new Point(this.x, this.y));
    ctx.closePath();
    ctx.stroke();

  }

  setPos(x, y){
    this.clear();
    this.x = x - this.draggingDistance.X;
    this.y = y - this.draggingDistance.Y;
    this.draw();
  }

}



let img = new Image();
let c;
img.src = "image.jpg"
img.onload = function () {

//  c = new Circle(200, 200, 50, this);
  c = new Triangle(100, 150, 150);
  c.draw();
}
