class Game {

  constructor() {
    this.gameObjects = [];
    this.enemies = [];
    Game.instance = this;

    setInterval( () => { game.update(); }, 0);
  }
  update() {
    for (var i = 0; i < this.gameObjects.length; i++) {
      let gameObject = this.gameObjects[i];
      gameObject.update();
      for (var j = 0; j < this.gameObjects.length; j++) {
        gameObject.checkCollision(this.gameObjects[j], j);
      }
    }


  }
  addObject(object){
    this.gameObjects.push(object);
    Game.objectCount++;
  }
  addEnemy(enemyObject){
    this.enemies.push(enemyObject);
    this.addObject(enemyObject);
  }
  destroy(obj){
    for (var i = 0; i < this.gameObjects.length; i++) {
      if(obj == this.gameObjects[i]){
        gameContainer.removeChild(this.gameObjects[i].element);
        this.gameObjects.splice(i, 1);
        Game.objectCount--;
      }
    }
    for (var i = 0; i < this.enemies.length; i++) {
      if(obj == this.enemies[i]){
        this.enemies.splice(i, 1);
      }
    }
  }

  findEnemy(player){
    for (var i = 0; i < this.enemies.length; i++) {
      if(Math.abs(player.x - this.enemies[i].x) <= 200){
        return this.enemies[i];
      }
    }
  }
}
Game.objectCount = 0;
Game.instance = null;

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
    this.collision = new Point(false, false);

  }

  getCSSProperty(propertyName){
    let style = window.getComputedStyle(this.element);
    return style.getPropertyValue(propertyName);
  }
  update(){
    if(!this.staticObject) {
      this.velocity.y = 3;
    }

  //  this.setPos(this.x + 0.70);
  }
  setPos(x, y){
    if(x){
      this.x = x;
      this.element.style.left = this.x + "px";
    }
    if(y) {
      this.y = y;
      this.element.style.top = this.y + "px";
    }
  }

  setAnimation(name, steps, length, iterations = "infinite"){
    this.element.style.background = "url('images/animations/" + name + ".png')";
    this.element.style.animation = name + " " + length + "s steps(" + steps + ") " + iterations + "";
  }

  setSize(width, height, reactToCollisions = true){
    if(reactToCollisions){
      this.width = width;
      this.height = height;
    }
    this.element.style.width = width + "px";
    this.element.style.height = height + "px";
  }

  setScale(x = 1, y = 1){
    this.element.style.transform = "scale(" + x + ", " + y + ")";
  }

  checkCollision(gameObject, pos){

    if(!this.staticObject && gameObject != this){

      if(!this.collision.y) {
        this.y += this.velocity.y;
        this.collision.y = true;
      }
      if(this.areColliding(this, gameObject)){
        this.y = this.y - this.velocity.y;
      }

      if(!this.collision.x) {
        this.x += this.velocity.x;
        this.collision.x = true;
      }

      if(this.areColliding(this, gameObject)){
        this.x = this.x - this.velocity.x;
      }
    }
    if(pos == Game.objectCount - 1){
      this.collision = new Point(false, false);
      this.setPos(this.x, this.y);
    }
  }

  areColliding(a, b){
    return !(((a.y + a.height) < (b.y)) || (a.y > (b.y + b.height)) || ((a.x + a.width) < b.x) || (a.x > (b.x + b.width)));
  }

}
// Player y enemigos
class Entity extends GameObject{
  constructor(element) {
    super(element);
    this.health = 100;
  }
  update(){
    super.update();
  }

  takeDamage(amount){
    this.health -= amount;
  }
}

class Player extends Entity{
  constructor(element) {
    super(element);
    this.pressedKeys = {68: false, 39: false, 65: false, 37: false, 32: false, 70: false};
    this.jumping = false;
    this.falling = false;

    document.addEventListener("keydown", (e) => { this.keyDown(e) });
    document.addEventListener("keyup", (e) => { this.keyUp(e) });
    this.element.addEventListener("animationend", () => {
      if(this.falling) this.falling = false;
      if(this.jumping) {
        this.jumping = false;
        this.falling = true;
      }
    });
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

    if(this.pressedKeys[70]){
      let e = game.findEnemy(this);
      if(e) e.takeDamage(1);
    }
    this.move();
    this.jump();
  }

  move(){
    if(this.velocity.x == 0) {
      this.setSize(135, 137, false);
      this.setAnimation("player_idle", 27, 2);
    }
    else{
      this.setSize(151, 137, false);
      this.setAnimation("player_run", 18, .6);
    }

    if(this.pressedKeys[68] || this.pressedKeys[39]) {
      this.velocity.x = 2;
      this.setScale(1);
    }
    else if(this.pressedKeys[65] || this.pressedKeys[37]){
      this.velocity.x = -2;
      this.setScale(-1);
    }
  }

  jump(){
    if(this.jumping){
      this.velocity.y = -2.5;
      this.setSize(176, 137, false);
      this.setAnimation("player_jump_start", 9, 0.4, 1);
    }
    if(this.falling) {
      this.setSize(176, 137, false);
      this.setAnimation("player_jump_end", 5, .4, 1);
    }

    if(this.pressedKeys[32] && !this.falling) {
      this.jumping = true;
    }
  }
}

class Enemy extends Entity {
  constructor(element) {
    super(element);
  }

  update(){
    super.update();
    this.velocity.x = -0.5;
    if(this.health <= 0) game.destroy(this);
  }


}

let scale = Math.min(1920 / window.innerWidth,  950 / window.innerHeight);

let gameContainer = document.getElementById('game-container');
let game = new Game();


game.addObject(new GameObject(document.getElementById('cube'), false));
game.addObject(new Player(document.getElementById('player-container')));
game.addObject(new GameObject(document.getElementById('cube2'), false));
game.addObject(new GameObject(document.getElementById('cube3'), false));
game.addEnemy(new Enemy(document.getElementsByClassName('enemy')[0], false));

for (var i = -50; i < 5; i++) {
  let floor = document.createElement("div");
  floor.className = "floor";
  gameContainer.appendChild(floor);
  let go = new GameObject(floor, true);
  go.x = 1000;
  go.setPos(go.x + ((go.width - 100) * i), go.y);

  game.addObject(go);
}
