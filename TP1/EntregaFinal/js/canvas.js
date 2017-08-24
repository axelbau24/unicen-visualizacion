let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


let image = new Image();
let imagePreviews = [];
let imagePreviewsFilters = [];

image.onload = function() {
  canvas.width = this.width;
  canvas.height = this.height;
  imagePreview = this;
  setTimeout(() => { // Esperamos un segundo antes de mostrar las previews, para que las animaciones no se vean mal.
    updatePreviews();
  }, 700);
  drawImage(this);

}

function resizeCanvas(c, image) {
  c.width = image.width;
  c.height = image.height;
}

function drawImage(image) {
  ctx.drawImage(image, 0, 0);
}

function updateCurrentImage(filter) {

  drawImage(image);
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

  showFilterTab(); // activamos la animacion para mostrar los filtros

}

function reScaleImage(previewCanvas) {
  let defaultSize = 110;
  previewCanvas.height = defaultSize;
  previewCanvas.width = defaultSize;

  previewCanvas.height = previewCanvas.width * imagePreview.height / imagePreview.width;
  if(previewCanvas.height > previewCanvas.width) previewCanvas.height = defaultSize;
  previewCanvas.width = previewCanvas.height * imagePreview.width / imagePreview.height;
}
