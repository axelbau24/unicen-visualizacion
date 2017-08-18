let canvas = document.getElementById("canvas");

let ctx = canvas.getContext("2d");

let imageData;
let image = new Image();
image.src = "image.jpg";
image.onload = function() {

  canvas.width = this.width;
  canvas.height = this.height;
  ctx.drawImage(this, 0, 0);
  imageData = ctx.getImageData(0, 0, this.width, this.height);

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {

      let index = (x + y * imageData.width) * 4;
      let total = 0;
      for (var i = 0; i < 3; i++) {
        total += imageData.data[index+i];
      }

      for (var i = 0; i < 3; i++) {
        imageData.data[index+i] = total/ 3;
      }

    }
  }

  ctx.putImageData(imageData, 0,0);
}
