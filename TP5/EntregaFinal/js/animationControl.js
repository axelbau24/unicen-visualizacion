let last = null;
$(document).on("transitionend", ".big-image, .big-image-container", function () {
  layout.masonry();
});

$(document).on("click", ".img-container", function () {
  if (currentLayout == 2) {
    currentImage = $(this).index();
    if (last != null) last.removeClass("selected");
    let likes = $(this).find(".fa").attr("class");
    let likeCount = $(this).find(".like-count").html();
    $(".big-image-container").find(".fa").attr("class", likes);
    $(".big-image-container").find(".like-count").html(likeCount);
    last = $(this).find(".item__overlay");
    last.addClass("selected");
    setImage($(this).find(".image").attr("src"));
  }
});

/**
 * Cambia la imagen principal en el layout 2, se hacen una serie de operaciones
 * para que la animacion CSS funcione correctametne
 */
function setImage(url) {

  let maxHeight = $(window).height() * .6;
  $(".big-image").css("max-height", maxHeight);
  var theImage = new Image();
  theImage.src = url;
  let height = 0;
  if (theImage.height >= maxHeight) height = maxHeight;
  else height = theImage.height;

  let width = (height / theImage.height) * theImage.width;
  $(".big-image-container").css("background-image", "url(" + theImage.src + ")");
  $(".big-image").height(height);
  $(".big-image-container").width(width);
}
