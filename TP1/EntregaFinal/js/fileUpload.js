$('#imageUpload').on('change',function(){

  let file =  document.getElementById('imageUpload').files[0];

  var reader = new FileReader();
  reader.onload = function(e) {
      $("#selectedImage").attr("src", e.target.result);
      image.src = e.target.result;
      bindFilters();
  };
  reader.readAsDataURL(file);

});


function getDownloadData() {
  return canvas.toDataURL('image/png');

}
$("#saveImage").click(function() {
  $(this).attr("href", getDownloadData());
});
