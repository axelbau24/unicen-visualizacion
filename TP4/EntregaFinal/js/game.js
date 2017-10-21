class Game {

  constructor() {
    this.gameObjects = [];
    this.enemies = [];
    Game.instance = this;
    Game.player = new Player(document.getElementById('player'));
    this.addObject(Game.player);
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
    this.scale = 1;

  }

  getCSSProperty(propertyName){
    let style = window.getComputedStyle(this.element);
    return style.getPropertyValue(propertyName);
  }
  update(){
    if(!this.staticObject) {
      this.velocity.y = 3;
    }

    this.setPos(this.x - 0.70);
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
    if(!name) this.element.style.animation = "none";
    else {
      this.element.style.background = "url('images/animations/" + name + ".png')";
      this.element.style.animation = name + " " + length + "s steps(" + steps + ") " + iterations + "";
    }
  }

  setSize(width, height, reactToCollisions = true){
    if(reactToCollisions){
      this.width = width;
      this.height = height;
    }
    this.element.style.width = width + "px";
    this.element.style.height = height + "px";
  }

  setScale(scale){
    this.scale = scale;
    this.element.style.transform = "scale(" + scale + ", 1)";
  }

  setOffset(x, y){
    this.element.style.transform = "scale(" + this.scale + ", 1) translate(" + x + "px, " + y + "px)";
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
    if(this.health <= 0) game.destroy(this);
  }

  takeDamage(amount){
    setTimeout(() => {this.health -= amount} , 100);
  }
}

class Player extends Entity{
  constructor(element) {
    super(element);
    this.pressedKeys = {68: false, 39: false, 65: false, 37: false, 32: false, 70: false};
    this.jumping = false;
    this.falling = false;
    this.attacking = false;

    document.addEventListener("keydown", (e) => { this.keyDown(e) });
    document.addEventListener("keyup", (e) => { this.keyUp(e) });
    this.element.addEventListener("animationend", () => {
      if(this.falling) this.falling = false;
      if(this.jumping) {
        this.jumping = false;
        this.falling = true;
      }
      this.setAnimation(null);
      this.attacking = false;
    });
  }

  keyDown(e){
    e = e || window.event;
    if (e.keyCode in this.pressedKeys) {
      e.preventDefault();
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
    if(!this.attacking){
      this.move();
      this.jump();
    }
    this.attack();
  }

  attack(){
    if(this.pressedKeys[70] && !this.attacking){
      this.attacking = true;
      let e = game.findEnemy(this);
      if(e) e.takeDamage(50);
    }
    if(this.attacking){
      this.setSize(304, 146, false);
      this.setAnimation("player_attack", 24, .75, 1);
    }
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
    this.attacking = false;

    this.element.addEventListener("animationend", () => {
      this.attacking = false;
    });
  }

  update(){
    super.update();

    let distance = this.x - Game.player.x;

    if(!this.attacking){
      this.setSize(117, 127, false);
      this.setAnimation("enemy_0_idle", 23, 0.9);
      if(Math.abs(distance) <= 200 ) this.attack();
      else if(Math.abs(distance) <= 600) this.move(distance);
      else this.velocity.x = 0;
    }

  }

  move(playerDistance){
    this.setSize(131, 135, false);
    this.setAnimation("enemy_0_run", 17, 0.9);
    if(playerDistance < 0){
      this.velocity.x = 0.5;
      this.setScale(-1);
    }
    else {
      this.setScale(1);
      this.velocity.x = -0.5;
    }
  }

  attack(){
    this.setSize(235, 162, false);
    this.setAnimation("enemy_0_attack", 21, 0.9, 1);
    this.setOffset(0, -30);
    this.attacking = true;
    Game.player.takeDamage(20);
  }


}

let defaultScale = .75;
let gameContainer = document.getElementById('game-container');
let scale = window.innerWidth / 1920;
gameContainer.style.transform = "scale(" + defaultScale * scale + ")";
let game = new Game();


game.addEnemy(new Enemy(document.getElementsByClassName('enemy')[0], false));

for (var i = -5; i < 50; i++) {
  let floor = document.createElement("div");
  floor.className = "floor";
  gameContainer.appendChild(floor);
  let go = new GameObject(floor, true);
  go.x = 1000;
  go.setPos(go.x + ((go.width - 100) * i), go.y);

  game.addObject(go);
}
