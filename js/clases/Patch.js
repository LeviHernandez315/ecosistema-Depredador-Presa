export default class Patch {
    constructor() {
      this.hasGrass = Math.random() > 0.5;
      this.grassCountdown = 10; // Tiempo predeterminado
    }
  
    growGrass() {
      if (!this.hasGrass) {
        this.grassCountdown--;
        if (this.grassCountdown <= 0) {
          this.hasGrass = true;
          this.grassCountdown = 10;
        }
      }
    }
  }
  