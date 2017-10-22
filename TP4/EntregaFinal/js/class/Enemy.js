class Enemy extends Entity {
  constructor(element) {
    super(element);

    this.element.addEventListener("animationiteration", () => {
      this.attacking = false;
    });
  }

  update(){
    super.update();

    let distance = Math.sqrt(Math.pow(this.x - Game.player.x, 2) + Math.pow(this.y - Game.player.y, 2));
    if(!this.attacking){
      if(Math.abs(distance) <= 200) this.attack();
      else if(Math.abs(distance) <= 600) this.move();
      else {
        this.velocity.x = 0;
        this.setSize(117, 127, false);
        this.setAnimation("enemy_0_idle", 23, 0.9);
      }
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
    this.setOffset(0, -30);
    this.attacking = true;
    Game.player.takeDamage(10);
  }
}
