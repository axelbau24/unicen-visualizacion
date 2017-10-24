class Player extends Entity{
  constructor(element) {
    super(element);
    this.pressedKeys = {68: false, 39: false, 65: false, 37: false, 32: false, 70: false, 38: false, 13: false};
    this.jumping = false;
    this.falling = false;
    this.attacking = false;
    this.damage = 50;
    this.healthBar = document.getElementById("health-bar");
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
    this.update();
  }

  keyDown(e){
    e = e || window.event;
    if (e.keyCode in this.pressedKeys) {
      e.preventDefault();
      this.pressedKeys[e.keyCode] = true;
    }
  }

  addHealth(health){
    if(this.health + health >= 100){
      this.health = 100;
    }
    else this.health += health;
  }


  keyUp(e){
    if (e.keyCode in this.pressedKeys) {
      this.pressedKeys[e.keyCode] = false;
    }
    this.velocity = new Point(0,0);
  }

  update(){
    super.update();
    if(this.health <= 0 || this.x + this.width < 0) game.finished = true;
    this.healthBar.style.width = this.health + "%";
    if(!this.attacking){
      this.move();
      this.jump();
    }
    this.attack();
  }

  attack(){
    if((this.pressedKeys[70] || this.pressedKeys[13]) && !this.attacking){
      this.attacking = true;
      let e = game.findEnemy(this);
      if(e) {
        e.takeDamage(this.damage);
      }
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
      this.velocity.x = 4.5;
      this.setScale(1);
    }
    else if(this.pressedKeys[65] || this.pressedKeys[37]){
      this.velocity.x = -4.5;
      this.setScale(-1);
    }
  }

  jump(){
    if(this.jumping){
      this.velocity.y = -6;
      this.setSize(176, 137, false);
      this.setAnimation("player_jump_start", 9, 0.4, 1);
    }
    if(this.falling) {
      this.setSize(176, 137, false);
      this.setAnimation("player_jump_end", 5, .4, 1);
    }

    if((this.pressedKeys[32] || this.pressedKeys[38]) && !this.falling) {
      this.jumping = true;
    }
  }
}
