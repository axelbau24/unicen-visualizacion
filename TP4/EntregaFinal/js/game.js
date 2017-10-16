class Player {
  constructor(selector) {
    this.object = selector;
    this.x = 0;
    this.y = 20;
    this.currentEvent = null;
    this.holdingKey = false;
    let p = this;

    document.onkeydown = function (e) { p.keyDown(e) };
    document.onkeyup = function (e) {  p.keyUp(e)};
  }


  keyDown(e){
    if(!this.holdingKey){
      this.holdingKey = true;
      e = e || window.event;
      this.currentEvent = e;
    }
  }


  keyUp(e){
    this.holdingKey = false;
  }

  move(){
    if(this.holdingKey){
      if(this.currentEvent.keyCode == 68 || this.currentEvent.keyCode == 39) {
        this.x += 5;
        this.object.style.transform = "scaleX(1)";
      }
      else if(this.currentEvent.keyCode == 65 || this.currentEvent.keyCode == 37){
          this.x -= 5;
          this.object.style.transform = "scaleX(-1)";
      }
      this.object.style.left = this.x + "px";
    }
  }

  jump(){
    if(this.holdingKey){
      if(this.currentEvent.keyCode == 32) {
        this.y += 20;
      }
    //  this.object.style.bottom = this.y + "%";
    //  this.holdingKey = false;
    }
  }
}

let player = new Player(document.getElementById('player'));


setInterval(update, 10);

function update() {
  // let style = window.getComputedStyle(player.object),
  // top = style.getPropertyValue('bottom');
  // console.log(top);
  player.move();
  player.jump();
}

update();
