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
    Game.objectCount++;
  }
}
Game.objectCount = 0;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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
    this.velocity = new Point(0, 2);
  }

  getCSSProperty(propertyName){
    let style = window.getComputedStyle(this.element);
    return style.getPropertyValue(propertyName);
  }
  update(){
    if(!this.staticObject) {
      this.velocity.y = 2;
    }
  }
  setPos(x, y){
    this.x = x;
    this.y = y;
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }
  checkCollision(gameObject){
    if(!this.staticObject){

      this.y = this.y + this.velocity.y;
      if(this.areColliding(this, gameObject) && this.areColliding(gameObject, this)){
        this.y = this.y - this.velocity.y * (Game.objectCount - 1);
      }

      this.x = this.x + this.velocity.x;
      if(this.areColliding(this, gameObject) && this.areColliding(gameObject, this)){
        this.x = this.x - this.velocity.x * (Game.objectCount - 1);
      }

      this.setPos(this.x, this.y);
    }
  }

  areColliding(a, b){
    return !(((a.y + a.height) < (b.y)) || (a.y > (b.y + b.height)) || ((a.x + a.width) < b.x) || (a.x > (b.x + b.width)));
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
    this.velocity = new Point(0,0);
    this.holdingKey = false;
  }

  update(){
    super.update();
    if(this.holdingKey){
      this.colliding = false;
      if(this.currentEvent.keyCode == 68 || this.currentEvent.keyCode == 39) {
        this.velocity.x = 1;
        this.element.style.transform = "scaleX(1)";
      }
      else if(this.currentEvent.keyCode == 65 || this.currentEvent.keyCode == 37){
        this.velocity.x = -1;
        this.element.style.transform = "scaleX(-1)";
      }
      this.element.style.left = this.x + "px";
    }
    this.jump();
  }

  jump(){
    if(this.holdingKey){
      if(this.currentEvent.keyCode == 32) {
        this.velocity.y = -3;
      }
    }
  }
}

let game = new Game();

game.addObject(new GameObject(document.getElementById('floor'), true));
game.addObject(new GameObject(document.getElementById('cube'), false));
game.addObject(new Player(document.getElementById('player')));
