window.onload = function () {
  setTimeout(function () {
    let loader = document.getElementById('loader');
    loader.className = "loaded";
    setTimeout(function () {
      document.body.removeChild(loader);
    }, 1200);
  },500);
}
