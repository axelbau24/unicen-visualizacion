class Point {
  constructor(x , y) {
    this.X = x;
    this.Y = y;
  }
}

/**
* Clase utilizada para las ranuras de cada una de las figuras
* que comprobara si alguna pieza se inserto en el lugar.
*/

class ShapeHole {
  constructor(shape) {
    this.point = new Point(shape.x, shape.y);
    this.shape = shape;
    this.occupied = false;
  }

  validHole(shape, point){
    return this.inRange(new Point(shape.x, shape.y)) && this.shape.equals(shape) && !this.occupied;
  }

  inRange(point){
    let defaultRange = 30;
    return Math.abs(this.point.X - point.X) <= defaultRange && Math.abs(this.point.Y - point.Y) <= defaultRange;
  }
  snap(shape){
    this.occupied = true;
    shape.x = this.point.X;
    shape.y = this.point.Y;
    getNewShapes();
    drawCanvas();
  }
}

/**
* Clase utilizada por las figuras para permitir el movimiento con el mouse (dragging)
*/

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
    this.defaultRadius = radius;
    this.defaultOffset = offset;
  }

  draw(fill){

    ctx.fillStyle = "#003D1B";
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    if(fill) {
      ctx.shadowBlur = 0;
      ctx.shadowColor="white";
      ctx.lineWidth = 2;
      this.filled = true;
      ctx.fill();
      ctx.strokeStyle="white";
      ctx.drawImage(this.image, this.x - this.radius, this.y- this.radius, this.radius * 2 , this.radius * 2);
    }
    else {
      ctx.shadowColor="black";
      ctx.strokeStyle="black";
    }
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.restore();

  }

  setPos(x, y){
    if(this.x <= x) this.x = x - this.draggingDistance.X;
    else this.x = x + this.draggingDistance.X;
    if(this.y <= y) this.y = y - this.draggingDistance.Y;
    else this.y = y + this.draggingDistance.Y;
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

  getWidth(){
    return this.radius * 2;
  }
  scaleShape(factor){
    this.offset = this.defaultOffset;
    this.offset = new Point(this.offset.X * factor, this.offset.Y * factor);
    this.radius = this.defaultRadius;
    this.radius *= factor;
  }

}


class Polygon extends Draggable {
  constructor(x, y, size, offset, image) {
    super();
    if(offset) this.offset = offset;
    else this.offset = new Point(0,0);
    this.x = x + this.offset.X;
    this.y = y + this.offset.Y;
    this.polygon = [];
    this.size = size;
    this.defaultSize = size;
    this.defaultOffset = this.offset;
    this.image = image;
  }

  addPoint(point){
    if(this.polygon.length == 0) ctx.moveTo(point.X, point.Y);
    else ctx.lineTo(point.X, point.Y);
    this.polygon.push(point);
  }

  draw(fill){
    this.polygon = [];
    ctx.save();
    ctx.beginPath();
    this.createPoints();
    ctx.closePath();
    ctx.clip();
    if(fill) {
      ctx.lineWidth=2;
      this.filled = true;
      ctx.strokeStyle="white";
      ctx.fill();
      ctx.shadowBlur=0;
    }
    else{
      ctx.shadowColor="black";
      ctx.shadowBlur=15;
      ctx.strokeStyle="black";
    }
  }

  addShadow(){
    ctx.shadowColor="white";
    ctx.shadowBlur=15;
  }

  createPoints(){}

  isPointInside(p){
    let inside = false;

    for (let i = 0, j = this.polygon.length - 1 ; i < this.polygon.length; j = i++){
      if (this.polygon[i].Y > p.Y != this.polygon[j].Y > p.Y && p.X < (this.polygon[j].X - this.polygon[i].X) *   (p.Y - this.polygon[i].Y) / (this.polygon[j].Y - this.polygon[i].Y) + this.polygon[i].X) {
        inside = !inside;
      }
    }
    return inside;
  }

  getWidth(){
    return this.size;
  }

  scaleShape(factor){
    this.offset = this.defaultOffset;
    this.offset = new Point(this.offset.X * factor, this.offset.Y * factor);
    this.size = this.defaultSize;
    this.size *= factor;
  }

}



class Triangle extends Polygon {
  constructor(x, y, size, offset, image){
    super(x, y, size, offset, image);
  }

  createPoints(){
    this.addPoint(new Point(this.x, this.y));
    this.addPoint(new Point(this.x + this.size, this.y));
    this.addPoint(new Point(this.x + this.size / 2, this.y - this.size));
    this.addPoint(new Point(this.x, this.y));
  }

  draw(fill){
    ctx.fillStyle = "#640500";
    super.draw(fill);
    if(fill) {
      ctx.drawImage(this.image, this.x - this.offset.X, this.y - this.offset.Y + 10, this.size  , this.size);
      this.addShadow();
    }
    ctx.stroke();
    ctx.restore();
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
  constructor(x, y, size, offset, image){
    super(x, y, size, offset, image);
  }

  draw(fill){
    ctx.fillStyle = "#020293";
    super.draw(fill);
    if(fill) {
      ctx.drawImage(this.image, this.x - this.offset.X, this.y - this.offset.Y, this.size , this.size);
      this.addShadow();
    }
    ctx.stroke();
    ctx.restore();
  }

  createPoints(){
    this.addPoint(new Point(this.x, this.y));
    this.addPoint(new Point(this.x + this.size, this.y));
    this.addPoint(new Point(this.x + this.size, this.y + this.size));
    this.addPoint(new Point(this.x, this.y + this.size));
    this.addPoint(new Point(this.x, this.y));
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
  constructor(x, y, size, offset, image){
    super(x, y, size, offset, image);
  }

  createPoints(){
    this.addPoint(new Point(this.x, this.y));
    this.addPoint(new Point(this.x + this.size, this.y + this.size));
    this.addPoint(new Point(this.x, this.y + this.size * 2));
    this.addPoint(new Point(this.x - this.size, this.y + this.size));
  }

  draw(fill){
    ctx.fillStyle = "#53006E";
    super.draw(fill);
    if(fill){
      ctx.drawImage(this.image, this.x - this.offset.X, this.y - this.offset.Y, this.size * 2 , this.size * 2);
      this.addShadow();
    }
    ctx.stroke();
    ctx.restore();
  }

  setPos(x, y){
    this.x = x + this.draggingDistance.X;
    this.y = y - this.draggingDistance.Y;
  }
  equals(shape){
    return shape instanceof Diamond;
  }
  getWidth(){
    return this.size * 2;
  }

}

class Hexagon extends Polygon {
  constructor(x, y, size, offset, image){
    super(x, y, size, offset, image);
  }

  createPoints(){
    let width = this.size * 0.1;
    this.addPoint(new Point(this.x, this.y));
    this.addPoint(new Point(this.x + this.size, this.y));
    this.addPoint(new Point(this.x + this.size + this.size / 2 + width, this.y + this.size));
    this.addPoint(new Point(this.x + this.size, this.y  + this.size * 2));
    this.addPoint(new Point(this.x, this.y + this.size * 2));
    this.addPoint(new Point(this.x - this.size / 2 - width, this.y + this.size ));
  }

  draw(fill){
    ctx.fillStyle = "#694F00";
    super.draw(fill);
    if(fill) {
      ctx.drawImage(this.image, this.x - this.offset.X, this.y - this.offset.Y, this.size * 2 , this.size * 2);
      this.addShadow();
    }
    ctx.stroke();
    ctx.restore();
  }

  setPos(x, y){
    this.x = x - this.draggingDistance.X;
    this.y = y - this.draggingDistance.Y;
  }
  equals(shape){
    return shape instanceof Hexagon;
  }
  getWidth(){
    return this.size * 2;
  }

}
