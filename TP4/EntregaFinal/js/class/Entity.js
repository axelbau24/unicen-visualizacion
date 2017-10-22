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

  createFeedback(msg, offset = 100){
    let element = document.createElement("div");
    element.className = "text-feedback";
    gameContainer.appendChild(element);
    element.innerHTML = msg;
    element.style.left = this.x + offset + "px";
    element.style.top = this.y + (this.height / 2) + "px";
    element.addEventListener("animationend", () => {   gameContainer.removeChild(element); });
  }

  takeDamage(amount){
    setTimeout(() => {
      amount = Math.floor((Math.random() * amount) + amount / 2);
      this.health -= amount;
      if(this != Game.player) this.createFeedback(amount);
    } , 200);
  }
}
