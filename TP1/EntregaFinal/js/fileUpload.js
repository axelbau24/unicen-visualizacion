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


function getFileName(filePath) {
  let pathData = filePath.split("\\");
  let fileName = pathData[pathData.length - 1];

  return fileName;

}
