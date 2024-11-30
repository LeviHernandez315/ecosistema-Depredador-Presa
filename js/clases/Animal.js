export default class Animal {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.energy = Math.random() * 20 + 10;
    }
  
    move(gridSize) {
      this.x = (this.x + (Math.floor(Math.random() * 3) - 1) + gridSize) % gridSize;
      this.y = (this.y + (Math.floor(Math.random() * 3) - 1) + gridSize) % gridSize;
      this.energy--;
    }
  }
  