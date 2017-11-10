
$(document).on("transitionend", ".big-image, .big-image-container", function () {
    layout.masonry();
  });
  
$(document).on("click", ".img-container", function () {
    if(currentLayout == 2){
        setImage($(this).find(".image").attr("src"));
    }
});

  /**
   * Cambia la imagen principal en el layout 2, se hacen una serie de operaciones
   * para que la animacion CSS funcione correctametne
   */
function setImage(url){
    var theImage = new Image();
    theImage.src = url;
    
    let previousWidth = $(".big-image").width();
    $(".big-image").width("auto");
    $(".selected-image").attr("src", theImage.src);
    
    let height = 0;
    let width = $(".selected-image").width();
    $(".big-image").width(previousWidth);
    $(".selected-image").attr("src", "");

    if(theImage.width < width) height = (theImage.width / width) * theImage.height;
    else height = (width / theImage.width) * theImage.height;

    $(".big-image").width(width);
    $(".big-image").height(height);
    $(".big-image-container").height(height);
    $(".big-image-container").css("background-image", "url("+ theImage.src +")");
}