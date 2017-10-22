class Game {

  constructor() {
    this.gameObjects = [];
    this.enemies = [];
    Game.instance = this;
    Game.deltaTime = 1;
    this.lastUpdate = Date.now();
    this.worldGeneration = new WorldGeneration(this);

    Game.player = new Player(document.getElementById('player'));
    this.addObject(Game.player);
    setInterval( () => { game.update(); }, 0);
  }
  update() {
    this.worldGeneration.update();
    this.setDeltaTime();

    for (var i = 0; i < this.gameObjects.length; i++) {
      let gameObject = this.gameObjects[i];
      gameObject.update();
      for (var j = 0; j < this.gameObjects.length; j++) {
        gameObject.checkCollision(this.gameObjects[j], j);
      }
    }
  }
  setDeltaTime(){
    let now = Date.now();
    Game.deltaTime = (now - this.lastUpdate) / 10;
    this.lastUpdate = now;
  }
  addObject(object){
    let i = 0;
    while(i < this.gameObjects.length && !this.areColliding(object, this.gameObjects[i])) i++;

    if(i == this.gameObjects.length){
      this.gameObjects.push(object);
      Game.objectCount++;
    }
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

  areColliding(a, b){
     if(a.staticObject || b.staticObject) return false;
     return !(((a.y + a.height) < (b.y)) || (a.y > (b.y + b.height)) || ((a.x + a.width) < b.x) || (a.x > (b.x + b.width)));
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
