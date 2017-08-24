function slideCanvas() {
  image.src = $(SELECTED_IMAGE_THUMBNAIL).attr("src");
  let imgContainer = $(CANVAS_CONTAINER);
  clearElement(imgContainer);
  imgContainer.show("slide", 500);

}

function showFilterTab() {
  let filterTab = $(FILTER_TAB);
  filterTab.removeClass("hidden");
  filterTab.show("blind", 500);
}

function clearElement(el) {
  el.hide();
  el.removeClass("hidden");
}


function playUploadAnimation() {
  $(CANVAS_CONTAINER).hide("slide", 500, slideCanvas);

  $(FILTER_TAB).hide("blind", 400);
}


function playfirstUploadAnimation() {
  let home = $(".home-container").effect( "puff", 500, function() {
    let main = $(".main-container");
    clearElement(main);
    main.show("scale", { percent: 0 }, 500, slideCanvas);

    $(FILTER_TAB).hide();
  });
}
$( document ).tooltip({
      track: true
    });
