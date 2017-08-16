let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;


let imageData = ctx.createImageData(width, height);

let halfCanvas = width / 2;

for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {

    if(x < width / 2) {
        let scale = x / halfCanvas * 255;
        setPixel(imageData, x, y,  scale, scale, 0, 255);
    }
    else {
      let scale = (x - halfCanvas) / halfCanvas * 255;
      setPixel(imageData, x, y, 255, 255 - scale, 0, 255);
    }
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
