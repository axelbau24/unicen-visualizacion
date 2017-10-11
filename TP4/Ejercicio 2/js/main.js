
for (var i = 1; i <= 3; i++) {
  let el = document.getElementById('element-' + i);
  setTimeout(function () { transform(el); });
  setInterval(function(){ transform(el); }, 3500);
}

function transform(element) {
  let x = Math.random() * 500;
  let y = Math.random() * 500;
  element.style.transform = "translate(" + x + "px, " + y + "px) rotate("+ (x + y) +"deg) skewX(" + Math.random() * 75+ "deg)";
}
