class ResponsiveContainer {
  constructor(x, y, width, height, padding, spacing) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.baseWidth = 995;
    this.baseHeight = 500;
    this.padding = padding;
    this.defaultPadding = this.padding;
    this.spacing = spacing;
    this.defaultSpacing = this.spacing;
    this.currentRow = 0;
    this.currentColumn = 0;
    this.occupiedWidth = 0;
    this.occupiedHeight = 0;
  }
  /**
   * Metodo para reposicionar la figura a dibujar
   * en el lugar correspondiente, controlando que no se dibuje fuera de los
   * limites asignados
   */
  addObject(obj){
    this.reScale(obj);
    let size = obj.getWidth() + this.spacing;
    this.occupiedWidth += size;
    if(this.occupiedWidth >= this.width) {
      this.occupiedHeight += size;
      this.currentRow++;
      this.currentColumn = 0;
      this.occupiedWidth = size;
    }
    if(this.occupiedHeight + size <= this.height){
      obj.x = size * this.currentColumn + obj.offset.X + this.padding + this.x;
      obj.y = size * this.currentRow + obj.offset.Y + this.padding + this.y;
      this.currentColumn++;
    }
    else {
      obj.x = -size;
      obj.y = -size;
    }
  }

  /**
   * Si la pantalla cambia de tamaño, se reajustara el tamaño
   * de cada una de las figuras
   */
  reScale(obj){
    if(canvas.width < this.baseWidth){
      let scaleFactor = canvas.width / this.baseWidth;
      this.padding = this.defaultPadding;
      this.spacing = this.defaultSpacing;
      this.padding *= scaleFactor;
      this.spacing *= scaleFactor;
      obj.scaleShape(scaleFactor);
    }
  }
}
