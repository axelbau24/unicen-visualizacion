let minutes = 0;
let seconds = 0;

setInterval(function () {

  seconds++;
  if(seconds >= 60){
    minutes++;
    seconds = 0;
  }
  displayTime();
}, 1000);

function displayTime(){
  let timeText = "Tiempo: ";
  ctx.fillStyle = my_gradient;
  ctx.fillRect(0, 0, canvas.width, 25);
  ctx.fillStyle = "black";
  if(seconds < 10) timeText += minutes + ":0" + seconds + " segundos";
  else timeText += minutes + ":" + seconds + " segundos";

  let textWidth = ctx.measureText(timeText).width;
  ctx.fillText(timeText, canvas.width - textWidth - 5, 20);
}
