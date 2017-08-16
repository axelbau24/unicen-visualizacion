let canvas = document.getElementById("canvas");

let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

let imageData = ctx.createImageData(width, height);


for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    setPixel(imageData, x, y, y / height * 255);
  }
}

ctx.putImageData(imageData, 0,0);

function setPixel(imgData, x, y, color) {
  let index = (x + y * imgData.width) * 4;

  imgData.data[index+3] = 255;

  for (var i = 0; i < 3; i++) {
    imgData.data[index+i] = color;
  }

}
