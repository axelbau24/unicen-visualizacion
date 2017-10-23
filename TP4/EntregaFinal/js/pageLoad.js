window.onload = function () {
  setTimeout(function () {
    let loader = document.getElementById('loader');
    loader.className = "loaded";
    //document.body.removeChild(loader);
  },1500);
}
