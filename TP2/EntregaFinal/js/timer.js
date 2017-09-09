let minutes = 0;
let seconds = 0;
let paused = false;

setInterval(function () {

  if(!paused){
    seconds++;
    if(seconds >= 60){
      minutes++;
      seconds = 0;
    }
    displayTime();
  }
}, 1000);

function displayTime(){
  document.getElementById("timer").innerHTML = getCurrentTime();
}

function pauseTimer() {
  paused = true;
}

function getCurrentTime() {
  let timeText = "";
  if(seconds < 10) timeText += minutes + ":0" + seconds;
  else timeText += minutes + ":" + seconds;
  return timeText;
}

function resetTimer() {
  paused = false;
  minutes = 0;
  seconds = -1;
}
