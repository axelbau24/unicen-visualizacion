/**
 * Clase utilizada para simplemente crear en el canvas un rect con bordes redondeados.
 */

class RoundedElement {
  constructor(x, y, width, height, fillStyle, strokeStyle) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.calculatePosition(x, y);
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
  }

  calculatePosition(x, y){
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;
  }
  draw(){

    let radius = 5;
    ctx.fillStyle = this.fillStyle;
    if(this.strokeStyle) ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x + radius, this.y);
    ctx.lineTo(this.x + this.width - radius, this.y);
    ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + radius);
    ctx.lineTo(this.x + this.width,this. y + this.height - radius);
    ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - radius, this.y + this.height);
    ctx.lineTo(this.x + radius, this.y + this.height);
    ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - radius);
    ctx.lineTo(this.x, this.y + radius);
    ctx.quadraticCurveTo(this.x, this.y, this.x + radius, this.y);
    ctx.closePath();
    ctx.fill();
    if(this.strokeStyle) ctx.stroke();

  }
}

/**
 * Boton utilizado en la interfaz del canvas
 */
class Button extends RoundedElement{
  constructor(x, y, text, clickEvt) {
    super(x, y, 0, 0, "#17a2b8", null);
    ctx.font = "18px Arial";
    this.width = ctx.measureText(text).width + 15;
    this.height = 36;
    this.text = text;
    super.calculatePosition(x, y);
    this.clickEvt = clickEvt;
    let b = this;
    canvas.addEventListener("click", function (e) {
      b.click(e);
    });
  }

  click(e){
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if(x >= this.x && y >= this.y && x <= this.x + this.width && y <= this.y + this.height){
      this.clickEvt();
    }
  }

  draw(){
    super.draw();
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 + 6);
  }
}

/**
 * Estructura para guardar datos de un texto a dibujar
 */
class Text {
  constructor(x, y, size, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.size = size;
  }
}

/**
 * Panel contenedor para mostrar mensajes en el canvas
 */

class Panel extends RoundedElement{
  constructor(x, y, width, height) {
    super(x, y, width, height, "rgba(90, 90, 90, 0.8)", "white");
    this.textData = [];
  }

  addText(text){
    this.textData.push(text);
  }

  draw(){
    super.draw();
    ctx.textAlign = "center";
    ctx.shadowColor="black";
    ctx.shadowBlur=7;
    ctx.fillStyle = "white";

    for (var i = 0; i < this.textData.length; i++) {
      let t = this.textData[i];
      ctx.font = t.size + "px Arial";
      ctx.fillText(t.text, this.x + t.x, this.y + t.y);
    }
    ctx.shadowBlur=0;
  }
}
