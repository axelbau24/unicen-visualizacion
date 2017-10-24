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
    let health = 50;
    Game.player.createFeedback("+" + health + " de vida");
    Game.player.addHealth(health);
  }
}
class DamageConsumable extends Consumable{
  constructor(element, className) {
    super(element, className);
  }
  activate(){
    let dmg = 20;
    Game.player.createFeedback("+" + dmg + " de daño");
    Game.player.damage += dmg;
  }
}
class ScoreConsumable extends Consumable{
  constructor(element, className) {
    super(element, className);
  }
  activate(){
    let sc = 100;
    Game.player.createFeedback("+" + sc + " puntos");
    Game.score += sc;
  }
}
