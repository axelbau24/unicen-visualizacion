class Enemy extends Entity {
  constructor(element) {
    super(element);

    this.element.addEventListener("animationiteration", () => {
      this.attacking = false;
    });
    this.multiplier = 1 + (Date.now() - game.startTime) / 100000;
    this.health *= this.multiplier;
  }



  update(){
    super.update();
    
    let distance = Math.sqrt(Math.pow((this.x + this.width / 2) - (Game.player.x + Game.player.width / 2), 2) + Math.pow((this.y + this.height / 2) - (Game.player.y + Game.player.height / 2), 2));
    if(!this.attacking){
      if(Math.abs(distance) <= 190) this.attack();
      else if(Math.abs(distance) <= 600) this.move();
      else {
        this.velocity.x = 0;
        this.setSize(117, 127, false);
        this.setAnimation("enemy_0_idle", 23, 0.9);
      }
    }
    if(this.health <= 0) {
      let reward = Math.floor(200 * this.multiplier);
      Game.player.createFeedback("+" + reward + " puntos", 0);
      Game.score += reward;
    }

  }

  move(){
    this.setSize(131, 135, false);
    this.setAnimation("enemy_0_run", 17, 0.9);
    if(this.x - Game.player.x < 0){
      this.velocity.x = 2.2;
      this.setScale(-1);
    }
    else {
      this.setScale(1);
      this.velocity.x = -2.2;
    }
  }

  attack(){
    this.setSize(235, 162, false);
    this.setAnimation("enemy_0_attack", 21, 0.9);
    if(this.scale > 0) this.setOffset(-100, -30);
    else this.setOffset(0, -30);
    this.attacking = true;
    this.velocity.x = 0;
    Game.player.takeDamage(5 * this.multiplier);
  }
}
