let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let image = new Image();
image.src = "image.jpg";

image.onload = function() {

  ctx.drawImage(this, 0, 0);

  let imageData = ctx.getImageData(0, 0, this.width, this.height);

  fillCanvas(imageData);

  ctx.putImageData(imageData, 0,0);
}

function fillCanvas(imageData) {
  for (var i = 0; i < canvas.width; i++) {
    for (var j = 0; j < canvas.height; j++) {
      applyGrayScale(i, j, imageData);
    }
  }
}

function applyGrayScale(x, y, imageData) {

  let total = 0;
  let index = getRGBIndex(x, y, imageData);

  for (var i = 0; i < 3; i++) {
    total += imageData.data[index+i];
  }

  for (var i = 0; i < 3; i++) {
    imageData.data[index+i] = total/ 3;
  }
}

function getRGBIndex(x, y, imageData) {
  return  (x + y * imageData.width) * 4;
}
