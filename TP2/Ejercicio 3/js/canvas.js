let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

class Circle {
  constructor(x, y, radius, image) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dragging = false;
    this.image = image;
    let c = this;

    canvas.addEventListener("mousemove", function (e) {
      c.drag(e);
    });
    canvas.addEventListener("mousedown", function (e) {
      c.mouseDown(e);
    });
    canvas.addEventListener("mouseup", function (e) {
      c.mouseUp(e);
    });
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
    this.x = x;
    this.y = y;
    this.draw();

  }

  clear(){
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(this.x, this.y, this.radius + 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  getImagePattern(){
    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = this.radius * 2;
    tempCanvas.height = this.radius * 2;
    tempCtx.drawImage(this.image, 0, 0, this.radius * 2, this.radius * 2);
    return ctx.createPattern(tempCanvas, "no-repeat");
  }

  drag(e){

    if(this.dragging){
      var rect = canvas.getBoundingClientRect();
      this.setPos(e.clientX - rect.left, e.clientY - rect.top);
    }
  }

  mouseUp(e){
    this.dragging = false;
  }

  mouseDown(e){
    var rect = canvas.getBoundingClientRect();
    console.log("ev: " +this.x)
    let distance = Math.sqrt(Math.pow(e.clientX - rect.left - this.x, 2) + Math.pow(e.clientY - rect.top - this.y, 2));
    if(distance <= this.radius){
      this.dragging = true;
    }
  }

}


let img = new Image();
let c;
img.src = "image.jpg"
img.onload = function () {

  c = new Circle(200,200, 100, this);
  c.draw();
}
