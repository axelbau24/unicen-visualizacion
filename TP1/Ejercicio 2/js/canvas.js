let canvas = document.getElementById("canvas");

let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;


let imageData = ctx.createImageData(width, height);


for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    setPixel(imageData, x, y, 100, 255, 150, 255);
  }
}

ctx.putImageData(imageData, 0,0);

function setPixel(imgData, x, y, r, g, b, a) {
  let index = (x + y * imgData.width) * 4;
  imgData.data[index+0] = r;
  imgData.data[index+1] = g;
  imgData.data[index+2] = b;
  imgData.data[index+3] = a;
}
