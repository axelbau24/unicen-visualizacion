class Point {
  constructor(x , y) {
    this.X = x;
    this.Y = y;
  }
}

class ShapeHole {
  constructor(shape) {
    this.point = new Point(shape.x, shape.y);
    this.shape = shape;
  }

  validHole(shape, point){
    return this.inRange(new Point(shape.x, shape.y)) && this.shape.equals(shape);
  }

  inRange(point){
    let defaultRange = 25;
    return Math.abs(this.point.X - point.X) <= defaultRange && Math.abs(this.point.Y - point.Y) <= defaultRange;
  }
  snap(shape){
    this.filled = true;
    shape.x = this.point.X;
    shape.y = this.point.Y;
    drawCanvas();
  }
}

class Draggable {
  constructor() {
    if (new.target === Draggable) {
      throw new TypeError("No es posible instanciar una clase abstracta");
    }
    this.filled = false;
    this.dragging = false;
    this.blocked = false;
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
  draw(fill){} // Metodo abstracto
  setPos(x, y){} // Metodo abstracto

  getMousePosition(e){
    let rect = canvas.getBoundingClientRect();
    return new Point(e.clientX - rect.left , e.clientY - rect.top);
  }

  drag(e){
    if(this.dragging){
      let point = this.getMousePosition(e);
      this.setPos(point.X, point.Y);
      drawCanvas();
    }
  }
  mouseDown(e){
    if(!this.blocked){
      let p = this.getMousePosition(e);
      this.draggingDistance = new Point(Math.abs(this.x - p.X), Math.abs(this.y - p.Y));
      if(this.isPointInside(p)) this.dragging = true;
    }

  }
  mouseUp(e){
    if(this.dragging){
      let mousePos = this.getMousePosition(e);
      let i = 0;
      while(i < shapeHoles.length && !shapeHoles[i].validHole(this)) i++;

      if(i != shapeHoles.length){
        this.blocked = true;
        shapeHoles[i].snap(this);
      }


      this.dragging = false;
    }
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

  draw(fill){
    ctx.translate(this.x - this.radius, this.y - this.radius);

    if(this.image) ctx.fillStyle = this.getImagePattern();
    else ctx.fillStyle = "#005826";
    ctx.beginPath();
    ctx.arc(this.radius, this.radius, this.radius, 0, Math.PI * 2);
    if(fill) {
      this.filled = true;
      ctx.fill();
      ctx.strokeStyle="white";
    }
    else ctx.strokeStyle="black";
    ctx.stroke();
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

  equals(shape){
    return shape instanceof Circle;
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

  draw(fill){
    this.polygon = [];
    ctx.fillStyle = "#8a0b05";
    ctx.beginPath();
    this.addPoint(new Point(this.x, this.y));
    this.addPoint(new Point(this.x + this.size, this.y));
    this.addPoint(new Point(this.x + this.size / 2, this.y - this.size));
    this.addPoint(new Point(this.x, this.y));
    ctx.closePath();
    if(fill) {
      this.filled = true;
      ctx.strokeStyle="white";
      ctx.fill();
    }
    else ctx.strokeStyle="black";
    ctx.stroke();
  }
  setPos(x, y){
    this.x = x - this.draggingDistance.X;
    this.y = y + this.draggingDistance.Y;
  }

  equals(shape){
    return shape instanceof Triangle;
  }
}

class Square extends Polygon {
  constructor(x, y, size, offset){
    super(x, y, offset);
    this.size = size;
  }

  draw(fill){
    this.polygon = [];
    ctx.fillStyle = "#0202b7";

    ctx.beginPath();
    this.addPoint(new Point(this.x, this.y));
    this.addPoint(new Point(this.x + this.size, this.y));
    this.addPoint(new Point(this.x + this.size, this.y + this.size));
    this.addPoint(new Point(this.x, this.y + this.size));
    this.addPoint(new Point(this.x, this.y));
    ctx.closePath();
    if(fill) {
      this.filled = true;
      ctx.fill();
      ctx.strokeStyle="white";
    }
    else ctx.strokeStyle="black";
    ctx.stroke();
  }

  setPos(x, y){
    this.x = x - this.draggingDistance.X;
    this.y = y - this.draggingDistance.Y;
  }
  equals(shape){
    return shape instanceof Square;
  }

}

class Diamond extends Polygon {
  constructor(x, y, size, offset){
    super(x, y, offset);
    this.size = size;
  }

  draw(fill){
    this.polygon = [];
    ctx.fillStyle = "purple";
    ctx.beginPath();
    this.addPoint(new Point(this.x, this.y));
    this.addPoint(new Point(this.x + this.size, this.y + this.size));
    this.addPoint(new Point(this.x, this.y + this.size * 2));
    this.addPoint(new Point(this.x - this.size, this.y + this.size));
    ctx.closePath();
    if(fill) {
      this.filled = true;
      ctx.fill();
      ctx.strokeStyle="white";
    }
    else ctx.strokeStyle="black";
    ctx.stroke();
  }

  setPos(x, y){
    this.x = x + this.draggingDistance.X;
    this.y = y - this.draggingDistance.Y;
  }
  equals(shape){
    return shape instanceof Diamond;
  }

}

class Hexagon extends Polygon {
  constructor(x, y, size, offset){
    super(x, y, offset);
    this.size = size;
  }

  draw(fill){
    let width = this.size * 0.1;
    this.polygon = [];
    ctx.fillStyle = "#b78a02";
    ctx.beginPath();
    this.addPoint(new Point(this.x, this.y));
    this.addPoint(new Point(this.x + this.size, this.y));
    this.addPoint(new Point(this.x + this.size + this.size / 2 + width, this.y + this.size));
    this.addPoint(new Point(this.x + this.size, this.y  + this.size * 2));
    this.addPoint(new Point(this.x, this.y + this.size * 2));
    this.addPoint(new Point(this.x - this.size / 2 - width, this.y + this.size ));
    ctx.closePath();
    if(fill) {
      this.filled = true;
      ctx.fill();
      ctx.strokeStyle="white";
    }
    else ctx.strokeStyle="black";
    ctx.stroke();
  }

  setPos(x, y){
    this.x = x - this.draggingDistance.X;
    this.y = y - this.draggingDistance.Y;
  }
  equals(shape){
    return shape instanceof Hexagon;
  }

}
