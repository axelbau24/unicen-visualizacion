let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

class Circle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw(){
    this.setFillStyle(this.color);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  setFillStyle(color){
    ctx.fillStyle = color;
  }

}

class GradientCircle extends Circle {
  constructor(x, y, radius, colors) {
    super(x, y, radius, null);
    this.colors = colors;
  }
  setFillStyle(color){
    let gradient = ctx.createLinearGradient(this.x - this.radius, this.y, this.x + this.radius, this.y);

    for (var i = 0; i < this.colors.length; i++) {
      let colorIndex = Math.round(Math.random() * i );
      gradient.addColorStop((1 / this.colors.length ) * i, this.colors[colorIndex]);
    }

    ctx.fillStyle = gradient;
  }
}

let colors = ["red", "blue", "black", "yellow", "green", "purple"];

for (var i = 0; i < 60; i++) {
  let color = colors[i % colors.length];
  let circle = new Circle(Math.random() * canvas.width, Math.random() * canvas.height , i, color);
  circle.draw();

  let gradientCircle = new GradientCircle(Math.random() * canvas.width, Math.random() * canvas.height , 50, colors);
  gradientCircle.draw();

}
