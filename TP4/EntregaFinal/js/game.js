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
  constructor(element, staticObject = false) {
    this.element = element;
    this.staticObject = staticObject;
    this.x = parseFloat(this.getCSSProperty("left"));
    this.y = parseFloat(this.getCSSProperty("top"));
    this.width = parseFloat(this.getCSSProperty("width"));
    this.height = parseFloat(this.getCSSProperty("height"));
    this.velocity = new Point(0, 0);
    this.jumpStartY = 0;
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

  setAnimation(name, steps, length, iterations = "infinite"){
    this.element.style.background = "url('images/" + name + ".png')";
    this.element.style.animation = name + " " + length + "s steps(" + steps + ") " + iterations + "";
  }

  setSize(width, height){
    this.width = width;
    this.height = height;
    this.element.style.width = this.width + "px";
    this.element.style.height = this.height + "px";
  }

  setScale(x = 1, y = 1){
    this.element.style.transform = "scale(" + x + ", " + y + ")";
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
    this.pressedKeys = {68: false, 39: false, 65: false, 37: false, 32: false};
    let p = this;
    document.onkeydown = function (e) { p.keyDown(e) };
    document.onkeyup = function (e) {  p.keyUp(e)};
  }

  keyDown(e){
    e = e || window.event;
    if (e.keyCode in this.pressedKeys) {
      this.pressedKeys[e.keyCode] = true;
    }
  }


  keyUp(e){
    if (e.keyCode in this.pressedKeys) {
      this.pressedKeys[e.keyCode] = false;
    }
    this.velocity = new Point(0,0);
  }

  update(){
    super.update();

    if(this.velocity.x == 0) {
      this.setSize(135, 137);
      this.setAnimation("player_idle", 27, 2);
    }
    else{
      this.setSize(151, 137);
      this.setAnimation("player_run", 18, .6);
    }

    if(this.pressedKeys[68] || this.pressedKeys[39]) {
      this.velocity.x = 1;
      this.setScale(1);
    }
    else if(this.pressedKeys[65] || this.pressedKeys[37]){
      this.velocity.x = -1;
      this.setScale(-1);
    }
    this.element.style.left = this.x + "px";

    this.jump();
  }

  jump(){
    if(this.pressedKeys[32]) {
      this.velocity.y = -3;
    }
  }
}

let game = new Game();

game.addObject(new GameObject(document.getElementById('floor'), true));
game.addObject(new GameObject(document.getElementById('cube'), false));
game.addObject(new Player(document.getElementById('player')));
