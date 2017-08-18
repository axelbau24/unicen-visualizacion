let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


let image = new Image();
image.src = "image.jpg";

image.onload = function() {
  canvas.width = this.width;
  canvas.height = this.height;

  ctx.drawImage(this, 0, 0);

  let imageData = ctx.getImageData(0, 0, this.width, this.height);

  let filter = new Negative(imageData, canvas);
 // filter = new GrayScale(imageData, canvas);
  filter.fillCanvas();

  ctx.putImageData(imageData, 0,0);
}


/**
 * Clase abstracta Filter encargada de rellenar el canvas dependiendo
 * del filtro utilizado.
 */
class Filter {

  constructor(imageData, canvas) {
    if (new.target === Filter) {
      throw new TypeError("No es posible instanciar una clase abstracta");
    }
    this.imageData = imageData;
    this.canvas = canvas;
  }

  fillCanvas() {
    for (let x = 0; x < this.canvas.width; x++) {
      for (let y = 0; y < this.canvas.height; y++) {

        let index = this.getRGBIndex(x, y);
        this.applyFilter(index);

      }
    }
  }

  getRGBIndex(x, y) {
    return (x + y * this.imageData.width) * 4;
  }

  applyFilter(rgbIndex) {} // Metodo "Abstracto"
}

// Filtro de color "Negativo"
class Negative extends Filter {
    constructor(imageData, canvas) {
      super(imageData, canvas);
    }

    applyFilter(rgbIndex) {
      for (var i = 0; i < 3; i++) {
        let currentValue = this.imageData.data[rgbIndex+i];
        this.imageData.data[rgbIndex+i] = 255 - currentValue;
      }
    }
}

// Filtro de color "Escala de grises"
class GrayScale extends Filter {
    constructor(imageData, canvas) {
      super(imageData, canvas);
    }

    applyFilter(rgbIndex) {
      let total = 0;
      for (var i = 0; i < 3; i++) {
        total += this.imageData.data[rgbIndex+i];
      }

      for (var i = 0; i < 3; i++) {
        this.imageData.data[rgbIndex+i] = total/ 3;
      }
    }
}
