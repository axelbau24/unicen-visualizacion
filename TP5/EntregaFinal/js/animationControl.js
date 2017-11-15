let last = null;
$(document).on("transitionend", ".big-image, .big-image-container", function () {
  layout.masonry();
});

$(document).on("click", ".img-container", function () {
  if (currentLayout == 2) {
    currentImage = $(this).index() - 1;
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
  let height = maxHeight;

  let width = (height / theImage.height) * theImage.width;
  $(".big-image-container").css("background-image", "url(" + theImage.src + ")");
  $(".big-image").height(height);
  let random = Math.floor(Math.random() * 3);

    switch (random) {
      case 0:
        $(".big-image-container").width(0);
        setTimeout(function () {
          $(".big-image-container").width(width);
        }, 500);
        break;
      case 1:
        $(".big-image-container").width(width);
        break;
      case 2:
        $(".big-image-container").addClass("slide");
        $(".big-image-container").width(width)
        setTimeout(function() { $('.big-image-container').removeClass('slide'); }, 2000);
        break;
    }
}
