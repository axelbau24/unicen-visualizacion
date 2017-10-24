class Game {

  constructor(highscore = 0) {
    this.gameObjects = [];
    this.enemies = [];
    Game.objectCount = 0;
    Game.deltaTime = 1;
    let player = document.createElement("div");
    gameContainer.appendChild(player);
    player.id = "player";
    Game.player = new Player(player);
    this.screenScore = document.getElementById('score');
    this.screenHighscore = document.getElementById('record');
    Game.score = 0;
    this.highscore = highscore;
    Game.finished = false;
    this.startTime = 0;
    this.lastUpdate = 0;
    this.worldGeneration = new WorldGeneration(this);
    this.started = false;
    this.addObject(Game.player);
    this.gameLoop = setInterval( () => { if(this.started) this.update(); }, 0);
  }
  update() {
    if(!this.finished){
      this.setDeltaTime();
      this.updateScore();
      this.worldGeneration.update();

      for (var i = 0; i < this.gameObjects.length; i++) {
        let gameObject = this.gameObjects[i];
        gameObject.update();
        for (var j = 0; j < this.gameObjects.length; j++) {
          gameObject.checkCollision(this.gameObjects[j], j);
        }
      }
    }
    else this.stopGame();
  }

  updateScore(){
    Game.score += (Game.deltaTime / 100) * 2;
    this.screenScore.innerHTML = Math.floor(Game.score);
    if(Game.score >= this.highscore) {
      this.highscore = Game.score;
      this.screenHighscore.innerHTML = Math.floor(this.highscore);
    }
  }

  stopGame(){
     clearInterval(this.gameLoop);
     if(this.finished){
       gameoverScreen.className = "gameover-background";
       gameoverScreen.style.opacity = 1;
     }
     setTimeout(() => {
       for (var i = 0; i < this.gameObjects.length; i++) {
           this.clearElement(this.gameObjects[i].element);
       }
       this.gameObjects = [];
     }, this.finished ? 1000 : 0);
  }

  setDeltaTime(){
    let now = Date.now();
    if(this.lastUpdate == 0) {
      this.lastUpdate = now;
      this.startTime = now;
    }
    Game.deltaTime = (now - this.lastUpdate) / 10;
    this.lastUpdate = now;
  }
  addObject(object){
      this.gameObjects.push(object);
      Game.objectCount++;
  }
  addEnemy(enemyObject){
    this.enemies.push(enemyObject);
    this.addObject(enemyObject);
  }

  clearElement(gameObject){
    gameContainer.removeChild(gameObject);
  }

  destroy(obj){
    for (var i = 0; i < this.gameObjects.length; i++) {
      if(obj == this.gameObjects[i]){
        this.clearElement(this.gameObjects[i].element);
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
      let distance = Math.sqrt(Math.pow(this.enemies[i].x - player.x, 2) + Math.pow(this.enemies[i].y - this.enemies[i].height - player.y, 2));
      if(distance <= 250){
        return this.enemies[i];
      }
    }
  }
}
