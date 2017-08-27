let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

class Rectangle {
  constructor(x, y, width, height, image) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
  }

  draw(){

    ctx.translate(this.x, this.y);
    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = this.width;
    tempCanvas.height = this.height;
    tempCtx.drawImage(this.image,0,0, this.width, this.height);

    var image = ctx.createPattern(tempCanvas,"no-repeat");
    ctx.fillStyle = image;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.translate(-this.x, -this.y);
  }

}

class Circle {
  constructor(x, y, radius, image) {
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

  getImagePattern(){
    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = this.radius * 2;
    tempCanvas.height = this.radius * 2;
    tempCtx.drawImage(this.image, 0, 0, this.radius * 2, this.radius * 2);
    return ctx.createPattern(tempCanvas, "no-repeat");
  }

}


let img = new Image();

img.src = "image.jpg"

img.onload = function () {
  new Rectangle(160, 50, 150, 200, this).draw();
  new Circle(310, 400, 100, this).draw();
}
