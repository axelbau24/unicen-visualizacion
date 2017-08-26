let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

canvas.onclick = function () {
  ctx.fillStyle = "#4000F0";
  ctx.fillRect(0,0, canvas.width, canvas.height);
}
