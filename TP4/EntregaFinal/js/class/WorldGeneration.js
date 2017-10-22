class WorldGeneration {
  constructor(game) {
    this.baseElement = null;
    this.game = game;
    this.platformHeights = [660, 450];
    for (var i = -3; i < 3; i++) {
      this.baseElement = this.createObject("floor");
      this.baseElement.setPos((this.baseElement.width - 100) * i, this.baseElement.y);
      game.addObject(this.baseElement);
    }
  }

  update(){
    if(this.baseElement.x + this.baseElement.width <= 1920 * 2){
      let newObj = this.createObject("floor");
      newObj.setPos(this.baseElement.x + this.baseElement.width - 100, this.baseElement.y);
      this.baseElement = newObj;
      this.game.addObject(this.baseElement);

      this.spawnPlatforms();
      this.spawnEnemy(this.baseElement);

    }
  }

  spawnEnemy(platform){
    let el = document.createElement("div");
    el.className = "enemy";
    gameContainer.appendChild(el);
    let enemy = new Enemy(el);
    enemy.setPos(platform.x + 20, platform.y - 200);
    this.game.addEnemy(enemy);
  }

  spawnPlatforms(){
    let platformsPosition = (Math.floor(Math.random() * 1000) + 1920);
    let platforms = Math.random() * 5;
    let platformsHeight = Math.floor(Math.random() * this.platformHeights.length);
    for (var i = 0; i <= platforms; i++) {
      let platform = this.createObject("platform");
      platform.setPos(platformsPosition + (platform.width - 5) * i, this.platformHeights[platformsHeight]);
      this.game.addObject(platform);
      if(Math.random() * 100 <= 30) this.spawnEnemy(platform);
    }
  }

  createObject(name){
    let element = document.createElement("div");
    element.className = name;
    gameContainer.appendChild(element);
    return new GameObject(element, true);
  }
}
