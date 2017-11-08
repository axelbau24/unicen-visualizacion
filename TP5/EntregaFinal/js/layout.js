let layout = createLayout();


function createLayout() {
  return $(".grid").masonry({
    itemSelector: ".grid__item_layout_" + currentLayout,
    columnWidth: ".grid__sizer",
    gutter: 15,
    transitionDuration: 0,
    fitWidth: currentLayout == 1,
  });
}

function updateLayout() {
  layout.masonry({
    itemSelector: ".grid__item_layout_" + currentLayout,
    fitWidth: currentLayout == 1
  });
}


$(".dropdown").on("click", function () {
  $(".dropdown-content").toggleClass("d-none");
});

function getRandomImage(){
  let img = Math.floor(Math.random() * imagenes.length);
  return imagenes[img].url;
}

$(".layout-option").on("click", function () {
  currentLayout = $(this).data("id");
  updateLayout();

  switch (currentLayout) {
    case 1:
      $(".big-image").addClass("d-none");
      $(".grid__item_layout_2").removeClass("grid__item_layout_2").addClass("grid__item_layout_1");
      break;

      case 2:
      $(".big-image").removeClass("d-none");
      $(".layout").width("auto");
      $(".grid__item_layout_1").removeClass("grid__item_layout_1").addClass("grid__item_layout_2");
      $(".img-container").eq(0).click();
      break;
  }
  layout.masonry();

});
