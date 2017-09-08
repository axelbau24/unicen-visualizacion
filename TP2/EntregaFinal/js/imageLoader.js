let shapeImages = [];
window.onload = function(){

  let imageCount = 5;
  let imagesLoaded = 0;

  for (var i = 1; i <= imageCount; i++) {
    let img = new Image();
    img.src = "images/shape-" + i +".png";
    img.onload = function () {
      shapeImages.push(this);
      imagesLoaded++;
      // Una vez que se cargaron todas las imagenes, comenzamos el juego
      if(imagesLoaded == imageCount) startGame(6, 100, 100);
    }
  }
}
