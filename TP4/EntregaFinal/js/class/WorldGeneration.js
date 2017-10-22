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
    if(this.baseElement.x + this.baseElement.width <= defaultWidth * 2){
      let newObj = this.createObject("floor");
      newObj.setPos(this.baseElement.x + this.baseElement.width - 100, this.baseElement.y);
      this.baseElement = newObj;
      this.game.addObject(this.baseElement);

      this.spawnPlatforms();
      this.spawnRandom(this.baseElement)
    }
  }

  spawnRandom(element){
    if(Math.random() * 100 <= 50) this.spawnEnemy(element);
    if(Math.random() * 100 <= 50) this.spawnConsumable(element);
  }

  spawnConsumable(platform){
    let el = document.createElement("div");
    let consumableId = Math.floor(Math.random() * 3);
    let consumable = this.getConsumable(consumableId, el);
    gameContainer.appendChild(el);

    consumable.setPos(platform.x + 150, platform.y - 75);
    this.game.addObject(consumable);
  }

  getConsumable(id, element){
    switch (id) {
      case 0: return new HealthConsumable(element, "healthUp");
      case 1: return new DamageConsumable(element, "damageUp");
      case 2: return new ScoreConsumable(element, "scoreUp");
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
    let platformsPosition = (Math.floor(Math.random() * 1000) + defaultWidth);
    let platforms = Math.random() * 5;
    let platformsHeight = Math.floor(Math.random() * this.platformHeights.length);
      let platform = this.createObject("platform");
      platform.setPos(platformsPosition, this.platformHeights[platformsHeight]);
      platform.setSize(Math.random() * 600 + 120, platform.height);
      this.game.addObject(platform);
      this.spawnRandom(platform);
  }

  createObject(name){
    let element = document.createElement("div");
    element.className = name;
    gameContainer.appendChild(element);
    return new GameObject(element, true);
  }
}
