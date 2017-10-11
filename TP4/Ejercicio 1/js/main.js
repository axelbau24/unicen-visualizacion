  for (var i = 1; i <= 3; i++) {
    let el = document.getElementById('element-' + i);
    setInterval(function(){ transform(el); }, 500 * i);
  }

  function transform(element) {
    let x = Math.random() * 500;
    let y = Math.random() * 500;
    element.style.transform = "translate(" + x + "px, " + y + "px) rotate("+ (x + y) +"deg) skew("+ Math.sqrt(x)  +"deg, "+ Math.sqrt(y) +"deg)";
  }
