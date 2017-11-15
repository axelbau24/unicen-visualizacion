let layout = createLayout();


function createLayout() {

  return $(".grid").masonry({
    itemSelector: ".grid__item_layout_" + currentLayout,
    columnWidth: 260,
    gutter: 15,
    transitionDuration: 0,
    fitWidth: true
  });
}

function updateLayout() {
  layout.masonry({
    itemSelector: ".grid__item_layout_" + currentLayout,
    columnWidth: currentLayout == 1 ? 260 : 150,
  });
}


$(".dropdown").on("click", function () {
  $(".dropdown-content").toggleClass("dropdown-content-active");
});

function getRandomImage() {
  let img = Math.floor(Math.random() * imagenes.length);
  return imagenes[img].url;
}

$(".layout-option").on("click", function (ev) {
  changeLayout($(this));
});

function changeLayout(element) {
  $(".layout-option").removeClass("disabled-link");
  element.addClass("disabled-link");
  currentLayout = element.data("id");
  updateLayout();

  switch (currentLayout) {
    case 1:
      $(".big-image").addClass("d-none").width("auto").height("auto");
      $(".arrow").addClass("d-none");
      $(".grid__item_layout_2").each(function () {
          $(this).removeClass("grid__item_layout_2");
          $(this).addClass("grid__item_layout_1");
          $(this).css("display", "initial");
      });
      break;

    case 2:
      $(".big-image, .arrow").removeClass("d-none");
      $(".layout").width("auto");
      carousel();
      $(".grid__item_layout_1").removeClass("grid__item_layout_1").addClass("grid__item_layout_2");
      $(".img-container").eq(0).click();
      break;
  }
  layout.masonry();
}


function carousel(){

  $(".grid__item_layout_1").each(function () {
    if($(this).css("top") != '0px'){
      $(this).css("display", "none");
    }
  });
}
