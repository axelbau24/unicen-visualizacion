const SELECTED_IMAGE_THUMBNAIL = "#selectedImage";
const CANVAS_CONTAINER = ".image-container";

$('#imageUpload').on('change', function () {
  loadImage($(this));

  $(CANVAS_CONTAINER).hide("slide", 500, slideCanvas);
});

$("#firstUpload").on("change", function() {
  loadImage($(this));
  let home = $(".home-container").effect( "puff", 500, function() {
    let main = $(".main-container");
    clearElement(main);
    main.show("scale", { percent: 0 }, 500, slideCanvas);

    // $(".filter-tab").show("scale", { percent: 0 }, 5000, function () {
    //   updatePreviews();
    // });

  });

});


function slideCanvas() {
  let imgContainer = $(CANVAS_CONTAINER);
  clearElement(imgContainer);
  imgContainer.show("slide", 500);
  let filterTab = $(".filter-tab");
  filterTab.removeClass("invisible");
  filterTab.hide();
  filterTab.show("clip", 1200);

}

function clearElement(el) {
  el.removeClass("hidden");
  el.hide();
}

function loadImage(fileInput) {
  let file =  $(fileInput)[0].files[0];

  var reader = new FileReader();
  reader.onload = function(e) {
      $(SELECTED_IMAGE_THUMBNAIL).attr("src", e.target.result);
      image.src = $(SELECTED_IMAGE_THUMBNAIL).attr("src");
      bindFilters();

  };
  reader.readAsDataURL(file);
}


function getDownloadData() {
  return canvas.toDataURL('image/jpg');

}
$("#saveImage").click(function() {
  $(this).attr("href", getDownloadData());
});
