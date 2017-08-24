let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


let image = new Image();
let imagePreviews = [];
let imagePreviewsFilters = [];

image.onload = function() {
  canvas.width = this.width;
  canvas.height = this.height;
  imagePreview = this;
  updatePreviews();
  ctx.drawImage(this, 0, 0);
}

function resizeCanvas(c, image) {
  c.width = image.width;
  c.height = image.height;
}

function updateCurrentImage(filter) {

  ctx.drawImage(image, 0, 0);
  let imageData = ctx.getImageData(0, 0, canvas.width , canvas.height);

  filter.fillCanvas(imageData, canvas);
  filter.putImageData(imageData, ctx);

}

function updatePreviews() {
  for (var i = 0; i < imagePreviews.length; i++) {
    let previewCanvas = document.getElementById(imagePreviews[i]);
    let previewContext = previewCanvas.getContext("2d");

    reScaleImage(previewCanvas);

    previewContext.drawImage(imagePreview, 0, 0, previewCanvas.width, previewCanvas.height);

    let imageData = previewContext.getImageData(0, 0, previewCanvas.width , previewCanvas.height);
    imagePreviewsFilters[i].fillCanvas(imageData, previewCanvas);
    imagePreviewsFilters[i].putImageData(imageData, previewContext);
  }

}

function reScaleImage(previewCanvas) {
  previewCanvas.height = 100;
  previewCanvas.width = 100;

  previewCanvas.height = previewCanvas.width * imagePreview.height / imagePreview.width;
  if(previewCanvas.height > previewCanvas.width) previewCanvas.height = 100;
  previewCanvas.width = previewCanvas.height * imagePreview.width / imagePreview.height;
}
