class GameObject {
  constructor(element, staticObject = false, reactToCollisions = true) {
    this.element = element;
    this.reactToCollisions = reactToCollisions;
    this.staticObject = staticObject;
    this.x = parseFloat(this.getCSSProperty("left"));
    this.y = parseFloat(this.getCSSProperty("top"));
    this.width = parseFloat(this.getCSSProperty("width"));
    this.height = parseFloat(this.getCSSProperty("height"));
    this.velocity = new Point(0, 0);
    this.scale = 1;

  }

  getCSSProperty(propertyName){
    let style = window.getComputedStyle(this.element);
    return style.getPropertyValue(propertyName);
  }
  update(){
    if(!this.staticObject) {
      this.velocity.y = 7;
    }
    if(this.x + this.width + 200 < 0) game.destroy(this);
    this.setPos(this.x - 1.7 * Game.deltaTime);
  }
  setPos(x, y){
    if(x){
      this.x = x;
      this.element.style.left = this.x + "px";
    }
    if(y) {
      this.y = y;
      this.element.style.top = this.y + "px";
    }
  }

  setAnimation(name, steps, length, iterations = "infinite"){
    if(!name) this.element.style.animation = "none";
    else {
      this.element.style.background = "url('images/animations/" + name + ".png')";
      this.element.style.animation = name + " " + length + "s steps(" + steps + ") " + iterations + "";
    }
  }

  setSize(width, height, reactToCollisions = true){
    if(reactToCollisions){
      this.width = width;
      this.height = height;
    }
    this.element.style.width = width + "px";
    this.element.style.height = height + "px";
  }

  setScale(scale){
    this.scale = scale;
    this.element.style.transform = "scale(" + scale + ", 1)";
  }

  setOffset(x, y){
    this.element.style.transform = "scale(" + this.scale + ", 1) translate(" + x + "px, " + y + "px)";
  }

  checkCollision(gameObject, pos){
    if(this.reactToCollisions && !this.staticObject){
      if(pos == 0){
        this.y += this.velocity.y * Game.deltaTime;
        this.x += this.velocity.x * Game.deltaTime;
      }

      if(gameObject != this && gameObject.reactToCollisions){

        let vX = (this.x + (this.width / 2)) - (gameObject.x + (gameObject.width / 2));
        let vY = (this.y + (this.height / 2)) - (gameObject.y + (gameObject.height / 2));
        let hWidths = (this.width / 2) + (gameObject.width / 2);
        let hHeights = (this.height / 2) + (gameObject.height / 2);

        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
          let oX = hWidths - Math.abs(vX);
          let oY = hHeights - Math.abs(vY);
          if (oX >= oY) {
            if (vY > 0) this.y += oY;
            else this.y -= oY;
          }
          else {
            if (vX > 0) this.x += oX;
            else this.x -= oX;
          }
        }
      }
      if(pos == Game.objectCount - 1) this.setPos(this.x, this.y);
    }
  }

}
