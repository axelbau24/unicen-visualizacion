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
