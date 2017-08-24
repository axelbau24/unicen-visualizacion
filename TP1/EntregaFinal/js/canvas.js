let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


let image = new Image();

image.onload = function() {
  canvas.width = this.width;
  canvas.height = this.height;

  ctx.drawImage(this, 0, 0);
}

function updateCurrentImage(filter) {

  ctx.drawImage(image, 0, 0);
  let imageData = ctx.getImageData(0, 0, canvas.width , canvas.height);

  filter.fillCanvas(imageData);
  filter.putImageData(imageData);

}
