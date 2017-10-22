class Consumable extends GameObject {
  constructor(element, className) {
    super(element, true, false);
    element.className = className;

  }
  update(){
    super.update();
    let distance = Math.sqrt(Math.pow(this.x - Game.player.x, 2) + Math.pow(this.y - Game.player.y, 2));
    if(distance <= 100){
      game.destroy(this);
      this.activate();
    }
  }
  activate(){ }
}
class HealthConsumable extends Consumable{
  constructor(element, className) {
    super(element, className);
  }
  activate(){
    Game.player.health += 25;
  }
}
class DamageConsumable extends Consumable{
  constructor(element, className) {
    super(element, className);
  }
  activate(){
    Game.player.damage += 25;
  }
}
class ScoreConsumable extends Consumable{
  constructor(element, className) {
    super(element, className);
  }
  activate(){
    Game.score += 25;
  }
}
