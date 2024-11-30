import Animal from "./Animal.js";

export default class Lobo extends Animal {
  constructor(x, y) {
    super(x, y);
  }

  eatSheep(Oveja) {
    this.energy += 20; // Energía ganada al comer ovejas
    return null; // La oveja muere
  }

  reproduce() {
    return Math.random() < 0.02 ? new Lobo(this.x, this.y) : null;
  }
}
