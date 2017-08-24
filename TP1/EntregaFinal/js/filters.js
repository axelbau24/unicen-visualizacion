
/**
* Clase abstracta Filter encargada de rellenar el canvas dependiendo
* del filtro utilizado.
*/
class Filter {

  constructor() {
    if (new.target === Filter) {
      throw new TypeError("No es posible instanciar una clase abstracta");
    }
  }

  fillCanvas(imageData) {
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {

        let index = this.getRGBIndex(x, y, imageData);
        this.applyFilter(index, imageData, x, y);

      }
    }
  }


  putImageData(imageData){
    ctx.putImageData(imageData, 0,0);
  }

  getRGBIndex(x, y, imageData) {
    return (x + y * imageData.width) * 4;
  }

  applyFilter(rgbIndex, imageData, x ,y) {} // Metodo "Abstracto"
}


/**
* Filtro de color "Convolucion", utilizado para filtros complejos.
* este utiliza una matriz 3x3 llamada "kernel" que definen la forma de imagen.
*/
class ConvolutionFilter extends Filter {
  constructor(kernel) {
    super();
    this.customImageData = null;
    this.kernel = kernel;
    this.kernelTotal = this.getKernelTotal();
  }

  applyFilter(rgbIndex, imageData, x, y) {
    if(x == 0 && y == 0) this.customImageData = ctx.createImageData(canvas.width, canvas.height);

    let R = this.multiply(this.getColorData(imageData, x, y, 0));
    let G = this.multiply(this.getColorData(imageData, x, y, 1));
    let B = this.multiply(this.getColorData(imageData, x, y, 2));

    let pixelData = [R, G, B, 255];
    for (var z = 0; z < 4; z++) {
      this.customImageData.data[rgbIndex+z] = pixelData[z] / this.kernelTotal;
    }
  }

  getKernelTotal(){
    let total = 0;
    for (let i = 0; i < this.kernel.length; i++) {
      total += this.kernel[i];
    }
    return total == 0 ? 1 : total;
  }

  putImageData(imageData){
    ctx.putImageData(this.customImageData, 0,0);
  }

  multiply(a) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      if(a[i] != undefined) sum += a[i] * this.kernel[i];
    }

    return sum;
  }
  // Metodo para generar una matriz 3x3 con los pixeles cercanos al pixel (x, y)
  getColorData(imageData, x, y, color){
    let colorData = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
       let pixelColor = imageData.data[this.getRGBIndex(x + j,  y + i, imageData) + color];
       colorData.push(pixelColor);
      }
    }
    return colorData;
  }

}

/**
* Filtro de color "Desenfoque o blur"
* Para la implementacion de este filtro se utiliza Box Blur,
* Al momento de aplicar el filtro, se obtiene el promedio de los colores vecinos de cada pixel
* de forma vertical y horizontal, para obtener una mejor eficiencia.
*/
class Blur extends Filter {
  constructor() {
    super();
    this.level = 4; // Intensidad, cantidad de vecinos que se agregan al promedio (intensidad * 2 + 1)
    this.fillingRow = false;
    this.averagePixel = [255,255,255];
  }

  setLevel(level){
    this.level = Math.round(level / 10);
  }

  applyFilter(rgbIndex, imageData, x, y) {
    if(x <= this.level && this.direction || y <= this.level && !this.direction){
      for (var i = 0; i < 3; i++) {
        this.averagePixel[i] = this.getAverageInRadius(imageData, x, y, i);
      }
    }
    else {
      let substractionPos = this.getValidAxis(x, y) - this.level - 1;
      let additionPos = this.getValidAxis(x, y) + this.level;

      for (var i = 0; i < this.averagePixel.length; i++) {
        if(this.fillingRow) {
          this.averagePixel[i] -= this.getValueInPosition(substractionPos, y, imageData, i);
          this.averagePixel[i] += this.getValueInPosition(additionPos, y, imageData, i);
        }
        else{
          this.averagePixel[i] -= this.getValueInPosition(x, substractionPos, imageData, i);
          this.averagePixel[i] += this.getValueInPosition(x, additionPos, imageData, i);
        }
      }
    }

    this.setPixelValues(rgbIndex, imageData);
  }

  setPixelValues(rgbIndex, imageData){
    for (var i = 0; i < 3; i++) {
      imageData.data[rgbIndex+i] = this.averagePixel[i] / (this.level * 2 + 1);
    }
  }

  getValidAxis(x, y){
    if(this.fillingRow) return x;
    return y;
  }

  getValueInPosition(x, y, imageData, color){
    let index = this.getRGBIndex(x, y, imageData);
    let value = imageData.data[index + color];
    if(!value) value = 0;
    return value;
  }

  fillCanvas(imageData) {
    // Se realizan 2 pasadas para obtener un buen efecto Blur
    for (var i = 0; i < 2; i++) {
      // Se aplica el filtro de manera vertical
      for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
          this.applyPixel(imageData, x, y);
        }
      }

      this.fillingRow = true;
      // Se aplica el filtro de manera horizontal
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          this.applyPixel(imageData, x, y);
        }
      }
      this.fillingRow = false;
    }
  }

  applyPixel(imageData, x, y){
    let index = this.getRGBIndex(x, y, imageData);
    this.applyFilter(index, imageData, x, y);
  }

  getAverageInRadius(imageData, x, y, color){
    let average = 0;

    for (var i = -this.level; i <= this.level; i++) {
      if(this.fillingRow) average += this.getValueInPosition(x + i, y, imageData, color);
      else average += this.getValueInPosition(x, y + i, imageData, color);
    }

    return average;
  }

}

/**
* Conversor de color HSL a RGB y viceversa.
*/

class HSLConverter {
  constructor() { }

  static hueTorgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }

  static getHue(hsl){
    return hsl[0];
  }
  static getSaturation(hsl){
    return hsl[1];
  }
  static getLightness(hsl){
    return hsl[2];
  }

  static hslToRGB(hsl){
    let r, g, b;
    let h = HSLConverter.getHue(hsl);
    let s = HSLConverter.getSaturation(hsl);
    let l = HSLConverter.getLightness(hsl);

    if(s == 0) r = g = b = l;
    else {
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = this.hueTorgb(p, q, h + 1/3);
      g = this.hueTorgb(p, q, h);
      b = this.hueTorgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  static getHSL(rgbIndex, imageData){
    let R = imageData.data[rgbIndex] / 255;
    let G = imageData.data[rgbIndex + 1] / 255;
    let B = imageData.data[rgbIndex + 2] / 255;

    let min = Math.min(R, G, B);
    let max = Math.max(R, G, B);

    let hue = 0;
    let saturation = 0;
    let luminance = (min + max) / 2;

    if(min != max) {
      if(luminance <= 0.5) saturation = (max-min)/(max+min);
      else saturation = (max-min)/(2.0-max-min);
    }
    switch (max) {
      case R: hue = (G-B)/(max-min);
      break;
      case G: hue = 2 + (B-R)/(max-min);
      break;
      case B: hue = 4 + (R-G)/(max-min)
      break;
    }
    hue *= 60;
    if(hue < 0) hue += 360;

    return [hue, saturation, luminance];
  }
}

/**
* Filtro de color "Saturacion"
*/
class Saturation extends Filter {
  constructor(level) {
    super();
    this.level = level;
  }

  applyFilter(rgbIndex, imageData) {
    let hsl = HSLConverter.getHSL(rgbIndex, imageData);
    let saturation = HSLConverter.getSaturation(hsl);
    let saturationLevel = this.level / 100;
    let newRgb = HSLConverter.hslToRGB([HSLConverter.getHue(hsl) / 360, saturation + saturationLevel , HSLConverter.getLightness(hsl)]);

    for (var i = 0; i < 3; i++) {
      imageData.data[rgbIndex+i] = newRgb[i];
    }
  }

  setLevel(level){
    this.level = level;
  }
}


/**
* Filtro de color "Negativo"
*/
class Negative extends Filter {
  constructor() { super(); }

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
  constructor(level) {
    super();
    this.level = level;
  }

  applyFilter(rgbIndex, imageData) {
    for (var i = 0; i < 3; i++) {
      let level = this.level / 10;
      if(level > 0) imageData.data[rgbIndex+i] *= level;
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
  constructor(level) {
    super();
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
    this.level = level * 2;
  }

}


/**
* Filtro de color "Sepia"
*/
class Sepia extends Filter {
  constructor(level) {
    super();
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
  constructor() { super(); }

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
