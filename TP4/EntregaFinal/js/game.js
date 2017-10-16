class Game {
  constructor() {
    this.gameObjects = [];
    let game = this;
    setInterval(function () { game.update(); }, 0);
  }
  update() {
    for (var i = 0; i < this.gameObjects.length; i++) {
      let gameObject = this.gameObjects[i];
      for (var j = 0; j < this.gameObjects.length; j++) {
        if(i != j) gameObject.checkCollision(this.gameObjects[j]);
      }
      gameObject.update();

    }
  }
  addObject(object){
    this.gameObjects.push(object);
  }
}

class GameObject {
  constructor(element, staticObject) {
    this.element = element;
    if(staticObject) this.staticObject = staticObject;
    else this.staticObject = false;
    this.x = parseFloat(this.getCSSProperty("left"));
    this.y = parseFloat(this.getCSSProperty("top"));
    this.width = parseFloat(this.getCSSProperty("width"));
    this.height = parseFloat(this.getCSSProperty("height"));
    this.colliding = false;
  }

  getCSSProperty(propertyName){
    let style = window.getComputedStyle(this.element);
    return style.getPropertyValue(propertyName);
  }
  update(){
    if(!this.colliding && !this.staticObject) this.setPos(this.x, (this.y + 5.05));
  }
  setPos(x, y){
    this.x = x;
    this.y = y;
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }
  checkCollision(gameObject){
    if(this.y + this.height > gameObject.y && this.x + this.width > gameObject.x &&
       this.x < gameObject.x + gameObject.width && this.y < gameObject.y - gameObject.height){

      this.colliding = true;
    }
    else this.colliding = false;
  }

}



class Player extends GameObject{
  constructor(element) {
    super(element);
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

  update(){
    super.update();
    if(this.holdingKey){
      if(this.currentEvent.keyCode == 68 || this.currentEvent.keyCode == 39) {
        this.x += 2.5;
        this.element.style.transform = "scaleX(1)";
      }
      else if(this.currentEvent.keyCode == 65 || this.currentEvent.keyCode == 37){
          this.x -= 2.5;
          this.element.style.transform = "scaleX(-1)";
      }
      else if(this.currentEvent.keyCode == 38){
          this.y -= 10.5;
          this.element.style.top = this.y + "px";
      }
      this.element.style.left = this.x + "px";
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

let game = new Game();

game.addObject(new GameObject(document.getElementById('cube')));
game.addObject(new Player(document.getElementById('player')));
game.addObject(new GameObject(document.getElementById('floor'), true));






//let player = new Player(document.getElementById('player'));





// function update() {
//   // let style = window.getComputedStyle(player.object),
//   // top = style.getPropertyValue('bottom');
//   // console.log(top);
//   //player.move();
//   //player.jump();
// }
//
