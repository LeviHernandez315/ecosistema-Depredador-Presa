import Animal from "./Animal.js";

export default class Oveja extends Animal {
  constructor(x, y) {
    super(x, y);
  }

  eatGrass(patch) {
    if (patch.hasGrass) {
      patch.hasGrass = false;
      this.energy += 5; // Energía ganada al comer pasto
    }
  }

  reproduce() {
    return Math.random() < 0.05 ? new Oveja(this.x, this.y) : null;
  }
}
