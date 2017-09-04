class Point {
  constructor(x , y) {
    this.X = x;
    this.Y = y;
  }
}

class Draggable {
  constructor() {
    if (new.target === Draggable) {
      throw new TypeError("No es posible instanciar una clase abstracta");
    }
    this.dragging = false;
    this.draggingDistance = new Point(0,0);
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

  isPointInside(p){} // Metodo abstracto
  draw(){} // Metodo abstracto
  setPos(x, y){} // Metodo abstracto

  drag(e){
    if(this.dragging){
      let rect = canvas.getBoundingClientRect();
      let point = new Point(e.clientX - rect.left , e.clientY - rect.top);
      this.setPos(point.X, point.Y);
      this.clear();
      drawCanvas();

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
  constructor(x, y, radius, offset, image) {
    super();
    this.offset = offset;
    this.x = x + offset.X;
    this.y = y + offset.Y;
    this.radius = radius;
    this.image = image;
  }

  draw(){
    ctx.translate(this.x - this.radius, this.y - this.radius);

    if(this.image) ctx.fillStyle = this.getImagePattern();
    else ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(this.radius, this.radius, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.translate(-(this.x - this.radius), -(this.y - this.radius));
  }

  setPos(x, y){
    if(this.x <= x) this.x = x - this.draggingDistance.X;
    else this.x = x + this.draggingDistance.X;
    if(this.y <= y) this.y = y - this.draggingDistance.Y;
    else this.y = y + this.draggingDistance.Y;
  }

  getImagePattern(){
    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = this.radius * 2;
    tempCanvas.height = this.radius * 2;
    tempCtx.drawImage(this.image, 0, 0, this.radius * 2, this.radius * 2);
    return ctx.createPattern(tempCanvas, "no-repeat");
  }


  isPointInside(p){
    return this.getDistance(p.X, p.Y, this.x, this.y) <= this.radius;
  }

  getDistance(pX, pY, cX, cY){
    return Math.sqrt(Math.pow(pX - cX, 2) + Math.pow(pY - cY, 2));
  }

}



class Polygon extends Draggable {
  constructor(x, y, offset) {
    super();
    if(offset) this.offset = offset;
    else this.offset = new Point(0,0);
    this.x = x + this.offset.X;
    this.y = y + this.offset.Y;
    this.polygon = [];
  }

  addPoint(point){
    if(this.polygon.length == 0) ctx.moveTo(point.X, point.Y);
    else ctx.lineTo(point.X, point.Y);
    this.polygon.push(point);
  }

  isPointInside(p){
    let inside = false;

    for (let i = 0, j = this.polygon.length - 1 ; i < this.polygon.length; j = i++){
      if (this.polygon[i].Y > p.Y != this.polygon[j].Y > p.Y && p.X < (this.polygon[j].X - this.polygon[i].X) *   (p.Y - this.polygon[i].Y) / (this.polygon[j].Y - this.polygon[i].Y) + this.polygon[i].X) {
        inside = !inside;
      }
    }
    return inside;
  }

}



class Triangle extends Polygon {
  constructor(x, y, size, offset){
    super(x, y, offset);
    this.size = size;
  }

  draw(){
    this.polygon = [];
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
    this.x = x - this.draggingDistance.X;
    this.y = y + this.draggingDistance.Y;
  }
}

class Square extends Polygon {
  constructor(x, y, size, offset){
    super(x, y, offset);
    this.size = size;
  }

  draw(){
    this.polygon = [];
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
    this.x = x - this.draggingDistance.X;
    this.y = y - this.draggingDistance.Y;
  }

}

class Parallelogram extends Polygon {
  constructor(x, y, size, tilt, offset){
    super(x, y, offset);
    this.size = size;
    this.tilt = tilt;
  }

  draw(){
    this.polygon = [];
    ctx.fillStyle = "red";
    ctx.beginPath();
    this.addPoint(new Point(this.x, this.y));
    this.addPoint(new Point(this.x + this.size, this.y));
    this.addPoint(new Point(this.x + this.size + this.tilt, this.y + this.size));
    this.addPoint(new Point(this.x + this.tilt , this.y + this.size));
    this.addPoint(new Point(this.x, this.y));
    ctx.closePath();
    ctx.stroke();
  }

  setPos(x, y){
    this.x = x - this.draggingDistance.X;
    this.y = y - this.draggingDistance.Y;
  }

}
