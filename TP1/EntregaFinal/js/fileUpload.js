const SELECTED_IMAGE_THUMBNAIL = "#selectedImage";
const CANVAS_CONTAINER = ".image-container";
const FILTER_TAB = ".filter-tab";

$('#imageUpload').on('change', function () {
  loadImage($(this));
  playUploadAnimation();
});


$("#firstUpload").on("change", function() {
  loadImage($(this));
  playfirstUploadAnimation();
});


function loadImage(fileInput) {
  let file =  $(fileInput)[0].files[0];

  var reader = new FileReader();
  reader.onload = function(e) {
    $(SELECTED_IMAGE_THUMBNAIL).attr("src", e.target.result);
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
