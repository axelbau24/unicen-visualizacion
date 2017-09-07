class ResponsiveContainer {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.baseWidth = 995;
    this.baseHeight = 500;
    this.padding = 15;
    this.spacing = 15;
    this.currentRow = 0;
    this.currentColumn = 0;
    this.occupiedWidth = 0;
  }

  addObject(obj){
    this.reScale(obj);
    let size = obj.getWidth() + this.spacing;
    this.occupiedWidth += size;
    if(this.occupiedWidth >= this.width) {
      this.currentRow++;
      this.currentColumn = 0;
      this.occupiedWidth = size;
    }
    obj.x = size * this.currentColumn + obj.offset.X + this.padding + this.x;
    obj.y = size * this.currentRow + obj.offset.Y + this.padding + this.y;
    this.currentColumn++;
  }


  reScale(obj){
    if(canvas.width < this.baseWidth){
      let scaleFactor = canvas.width / this.baseWidth;
      obj.scaleShape(scaleFactor);
    }
  }
}
