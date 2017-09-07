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
  let timeText = "";
  if(seconds < 10) timeText += minutes + ":0" + seconds;
  else timeText += minutes + ":" + seconds;

  document.getElementById("timer").innerHTML = timeText;
}
