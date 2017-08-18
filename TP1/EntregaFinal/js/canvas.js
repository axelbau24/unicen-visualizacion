let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


let image = new Image();
image.src = "image.jpg";

image.onload = function() {
  canvas.width = this.width;
  canvas.height = this.height;

  ctx.drawImage(this, 0, 0);
}

function updateCurrentImage(filter) {
  ctx.drawImage(image, 0, 0);
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  filter.fillCanvas(imageData);
  ctx.putImageData(imageData, 0,0);
}


// Negativo
// greyscale
// Sepia
// binarizacion
// brillo
// saturacion
// suavizado
// deteccion border
// blur


/**
* Filtro de color "Negativo"
*/
class Negative extends Filter {
  constructor(canvas) {
    super(canvas);
  }

  applyFilter(rgbIndex, imageData) {
    for (var i = 0; i < 3; i++) {
      let currentValue = imageData.data[rgbIndex+i];
      imageData.data[rgbIndex+i] = 255 - currentValue;
    }
  }
}

/**
* Filtro de color "Brillo"
*/
class Brightness extends Filter {
  constructor(canvas, level) {
    super(canvas);
    this.level = level;
  }

  applyFilter(rgbIndex, imageData) {
    for (var i = 0; i < 3; i++) {
      imageData.data[rgbIndex+i] += this.level;
    }
  }
  setLevel(level){
    this.level = level;
  }
}


/**
* Filtro de color "Binarizacion"
* Para el funcionamiento de este Filtro
* se pasa la imagen a escala de grises
* y luego se calcula el color dependiendo del nivel elegido.
*/
class Binary extends Filter {
  constructor(canvas, level) {
    super(canvas);
    this.level = level;
    this.gray = new GrayScale(canvas);
  }

  applyFilter(rgbIndex, imageData) {
    let total = this.gray.getTotal(rgbIndex, imageData) / 3;
    for (var i = 0; i < 3; i++) {
      if(total >= this.level){
        imageData.data[rgbIndex+i] = 255;
      }
      else imageData.data[rgbIndex+i] = 0;
    }
  }
  setLevel(level){
    this.level = level;
  }

}


/**
* Filtro de color "Sepia"
*/
class Sepia extends Filter {
  constructor(canvas, level) {
    super(canvas);
    this.level = level;
  }

  applyFilter(rgbIndex, imageData) {

    let r = imageData.data[rgbIndex+0];
    let g = imageData.data[rgbIndex+1];
    let b = imageData.data[rgbIndex+2];

    let newlevel = this.level / 2;
    // Formula base para generar el color sepia
    let tr = Math.min(255, Math.round(0.393*r + 0.769*g + 0.189*b));
    let tg = Math.min(255, Math.round(0.349*r + 0.686*g + 0.168*b));
    let tb = Math.min(255, Math.round(0.272*r + 0.534*g + 0.131*b));

    imageData.data[rgbIndex+0] = tr + newlevel;
    imageData.data[rgbIndex+1] = tg + newlevel;
    imageData.data[rgbIndex+2] = tb + newlevel / 2;

  }
  setLevel(level){
    this.level = level;
  }
}

/**
* Filtro de color "Escala de grises"
*/
class GrayScale extends Filter {
  constructor(canvas) {
    super(canvas);
  }

  applyFilter(rgbIndex, imageData) {
    let avgColor = this.getTotal(rgbIndex, imageData)/ 3;
    for (var i = 0; i < 3; i++) {
      imageData.data[rgbIndex+i] = avgColor;
    }
  }

  getTotal(rgbIndex, imageData){
    let total = 0;
    for (var i = 0; i < 3; i++) {
      total += imageData.data[rgbIndex+i];
    }
    return total;
  }
}

/**
* Clase abstracta Filter encargada de rellenar el canvas dependiendo
* del filtro utilizado.
*/
class Filter {

  constructor(canvas) {
    if (new.target === Filter) {
      throw new TypeError("No es posible instanciar una clase abstracta");
    }
    this.canvas = canvas;
  }

  fillCanvas(imageData) {
    for (let x = 0; x < this.canvas.width; x++) {
      for (let y = 0; y < this.canvas.height; y++) {

        let index = this.getRGBIndex(x, y, imageData);
        this.applyFilter(index, imageData);

      }
    }
  }

  getRGBIndex(x, y, imageData) {
    return (x + y * imageData.width) * 4;
  }

  applyFilter(rgbIndex, imageData) {} // Metodo "Abstracto"
}
