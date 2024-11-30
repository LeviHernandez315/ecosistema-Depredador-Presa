import Animal from "./Animal.js";

export default class Oveja extends Animal {
    constructor(x, y) {
        super(x, y);
        this.energy = 50; // Energía inicial de las ovejas
    }

    eatGrass(patch) {
        const energyGained = patch.consumeGrass(); // Consumir el pasto del parche
        if (energyGained > 0) {
            this.energy += energyGained; // Ganar energía solo si hay pasto
        }
    }

    reproduce() {
        const alpha = 0.1; // Tasa de crecimiento de las ovejas
        const reproductionThreshold = 60; // Energía necesaria para reproducirse
        if (this.energy >= reproductionThreshold) {
            this.energy /= 2; // Dividir la energía entre la madre y la cría
            return Math.random() < alpha ? new Oveja(this.x, this.y) : null; // Usar alpha como probabilidad
        }
        return null; // No se reproduce si no alcanza la energía necesaria
    }

    reduceEnergy() {
        this.energy -= 2; // Disminuir la energía en cada paso
    }

    moveAndGraze(grid, gridSize) {
        this.move(gridSize); // Pasar gridSize como argumento

        // Buscar pasto en la posición actual y comerlo
        const patch = grid[this.x][this.y];
        this.eatGrass(patch);

        // Reducir energía después del movimiento
        this.reduceEnergy();
    }
}
